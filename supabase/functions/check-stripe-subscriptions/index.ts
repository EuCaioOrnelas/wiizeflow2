
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    console.log("Checking Stripe subscriptions status...");

    // Buscar todos os perfis com assinaturas ativas
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, email, stripe_customer_id, stripe_subscription_id, plan_type, subscription_status')
      .neq('plan_type', 'free')
      .eq('subscription_status', 'active');

    if (profilesError) {
      console.error('Error fetching profiles:', profilesError);
      throw profilesError;
    }

    let updatedCount = 0;
    let failedCount = 0;

    for (const profile of profiles || []) {
      try {
        if (!profile.stripe_subscription_id) {
          console.log(`Profile ${profile.email} has no Stripe subscription ID`);
          continue;
        }

        // Verificar status da assinatura no Stripe
        const subscription = await stripe.subscriptions.retrieve(profile.stripe_subscription_id);
        
        console.log(`Subscription ${subscription.id} status: ${subscription.status}`);

        // Se a assinatura foi cancelada, expirou ou está com falha de pagamento
        if (subscription.status === 'canceled' || 
            subscription.status === 'unpaid' || 
            subscription.status === 'past_due' ||
            subscription.status === 'incomplete_expired') {
          
          console.log(`Downgrading user ${profile.email} from ${profile.plan_type} to free`);

          // Atualizar para plano gratuito
          const { error: updateError } = await supabase
            .from('profiles')
            .update({
              plan_type: 'free',
              subscription_status: 'canceled',
              subscription_expires_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            .eq('id', profile.id);

          if (updateError) {
            console.error(`Error updating profile ${profile.email}:`, updateError);
            failedCount++;
            
            // Registrar falha de pagamento
            await supabase.from('payment_failures').insert({
              user_id: profile.id,
              stripe_customer_id: profile.stripe_customer_id,
              stripe_subscription_id: profile.stripe_subscription_id,
              failure_reason: `Subscription status: ${subscription.status}`,
              failure_date: new Date().toISOString()
            });
          } else {
            updatedCount++;
          }
        }
      } catch (error) {
        console.error(`Error processing profile ${profile.email}:`, error);
        failedCount++;
        
        // Registrar falha no processamento
        await supabase.from('payment_failures').insert({
          user_id: profile.id,
          stripe_customer_id: profile.stripe_customer_id,
          stripe_subscription_id: profile.stripe_subscription_id,
          failure_reason: error.message,
          failure_date: new Date().toISOString()
        });
      }
    }

    console.log(`Subscription check completed. Updated: ${updatedCount}, Failed: ${failedCount}`);

    return new Response(JSON.stringify({
      success: true,
      message: `Processed ${profiles?.length || 0} subscriptions`,
      updated: updatedCount,
      failed: failedCount
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error('Error in check-stripe-subscriptions:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
