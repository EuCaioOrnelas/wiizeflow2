
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const usePayment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPayment = async (priceId: string, customerEmail?: string) => {
    console.log('Starting payment process with priceId:', priceId);
    console.log('Customer email:', customerEmail);
    
    setLoading(true);
    setError(null);

    try {
      console.log('Calling Supabase function create-payment...');
      
      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: {
          priceId,
          customerEmail
        }
      });

      console.log('Supabase function response:', { data, error });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      if (data?.url) {
        console.log('Redirecting to Stripe checkout URL:', data.url);
        // Open Stripe checkout in a new tab
        window.open(data.url, '_blank');
      } else {
        console.error('No checkout URL received from Stripe');
        throw new Error('URL de checkout não recebida');
      }
    } catch (err) {
      console.error('Error creating payment:', err);
      setError(err instanceof Error ? err.message : 'Erro ao processar pagamento');
    } finally {
      setLoading(false);
    }
  };

  return {
    createPayment,
    loading,
    error
  };
};
