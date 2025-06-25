
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
    console.log("Starting subscription check...");

    // Initialize Stripe
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      throw new Error("STRIPE_SECRET_KEY not configured");
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
    });

    // Initialize Supabase with service role key
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Get all profiles with Stripe customer IDs
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .not('stripe_customer_id', 'is', null);

    if (profilesError) {
      throw new Error(`Error fetching profiles: ${profilesError.message}`);
    }

    console.log(`Found ${profiles?.length || 0} profiles with Stripe customer IDs`);

    let updatedCount = 0;
    let failureCount = 0;

    for (const profile of profiles || []) {
      try {
        console.log(`Checking subscriptions for customer: ${profile.stripe_customer_id}`);

        // Get active subscriptions for this customer
        const subscriptions = await stripe.subscriptions.list({
          customer: profile.stripe_customer_id,
          status: 'active',
          limit: 100,
        });

        const hasActiveSubscription = subscriptions.data.length > 0;
        let planType = 'free';
        let subscriptionExpiresAt = null;
        let stripeSubscriptionId = null;

        if (hasActiveSubscription) {
          const subscription = subscriptions.data[0]; // Get first active subscription
          stripeSubscriptionId = subscription.id;
          subscriptionExpiresAt = new Date(subscription.current_period_end * 1000).toISOString();

          // Determine plan type based on price ID (UPDATED PRICE IDS)
          const priceId = subscription.items.data[0]?.price?.id;
          console.log(`Price ID for customer ${profile.stripe_customer_id}: ${priceId}`);

          if (priceId === "price_1RdhpHG1GdQ2ZjmFmYXfEFJa") {
            planType = 'monthly';
          } else if (priceId === "price_1RdhqYG1GdQ2ZjmFlAOaBr4A") {
            planType = 'annual';
          } else {
            planType = 'premium'; // fallback for other price IDs
          }

          console.log(`Customer ${profile.stripe_customer_id} has active ${planType} subscription until ${subscriptionExpiresAt}`);
        } else {
          console.log(`Customer ${profile.stripe_customer_id} has no active subscriptions`);
        }

        // Update profile in Supabase
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            plan_type: planType,
            subscription_status: hasActiveSubscription ? 'active' : 'inactive',
            subscription_expires_at: subscriptionExpiresAt,
            stripe_subscription_id: stripeSubscriptionId,
            updated_at: new Date().toISOString(),
          })
          .eq('id', profile.id);

        if (updateError) {
          console.error(`Error updating profile ${profile.id}:`, updateError);
          failureCount++;
        } else {
          console.log(`Successfully updated profile ${profile.id}`);
          updatedCount++;
        }

      } catch (error) {
        console.error(`Error processing customer ${profile.stripe_customer_id}:`, error);
        failureCount++;
      }
    }

    const summary = {
      total_profiles: profiles?.length || 0,
      updated_count: updatedCount,
      failure_count: failureCount,
      timestamp: new Date().toISOString()
    };

    console.log("Subscription check completed:", summary);

    return new Response(JSON.stringify(summary), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("Error in subscription check:", error);
    return new Response(JSON.stringify({ 
      error: error.message,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
