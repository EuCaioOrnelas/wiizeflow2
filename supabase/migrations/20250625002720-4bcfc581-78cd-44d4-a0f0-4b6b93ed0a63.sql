
-- Atualizar a tabela profiles para incluir campos de expiração e status de pagamento
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'active',
ADD COLUMN IF NOT EXISTS subscription_expires_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT;

-- Criar tabela para registrar tentativas de pagamento falhadas
CREATE TABLE IF NOT EXISTS public.payment_failures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  failure_reason TEXT,
  failure_date TIMESTAMPTZ DEFAULT now(),
  resolved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Habilitar RLS na tabela payment_failures
ALTER TABLE public.payment_failures ENABLE ROW LEVEL SECURITY;

-- Política para que apenas admins vejam falhas de pagamento
CREATE POLICY "Admin can view payment failures" ON public.payment_failures
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE user_id = auth.uid()
    )
  );

-- Política para inserção de falhas de pagamento (edge functions)
CREATE POLICY "Allow insert payment failures" ON public.payment_failures
  FOR INSERT
  WITH CHECK (true);

-- Atualizar função para criar usuários administrativamente
CREATE OR REPLACE FUNCTION public.create_admin_user(
  user_email TEXT,
  user_password TEXT,
  user_name TEXT,
  plan_type TEXT,
  subscription_period TEXT DEFAULT 'monthly'
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_user_id UUID;
  expires_at TIMESTAMPTZ;
BEGIN
  -- Verificar se o usuário atual é admin
  IF NOT EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = auth.uid()
  ) THEN
    RETURN json_build_object('error', 'Acesso negado');
  END IF;

  -- Calcular data de expiração baseada no período
  CASE subscription_period
    WHEN 'monthly' THEN expires_at := now() + INTERVAL '1 month';
    WHEN 'annual' THEN expires_at := now() + INTERVAL '1 year';
    WHEN 'lifetime' THEN expires_at := NULL; -- Vitalício não expira
    ELSE expires_at := now() + INTERVAL '1 month';
  END CASE;

  -- Criar usuário via auth (isso requer privilégios especiais)
  -- Por enquanto, vamos apenas registrar a intenção
  INSERT INTO public.profiles (
    id,
    email,
    name,
    plan_type,
    subscription_status,
    subscription_expires_at,
    created_at,
    updated_at
  ) VALUES (
    gen_random_uuid(),
    user_email,
    user_name,
    plan_type,
    'pending_activation',
    expires_at,
    now(),
    now()
  ) RETURNING id INTO new_user_id;

  RETURN json_build_object(
    'success', true,
    'user_id', new_user_id,
    'message', 'Usuário criado com sucesso'
  );
END;
$$;

-- Função para verificar e cancelar assinaturas expiradas
CREATE OR REPLACE FUNCTION public.check_expired_subscriptions()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  expired_count INTEGER := 0;
BEGIN
  -- Atualizar usuários com assinaturas expiradas para plano gratuito
  UPDATE public.profiles 
  SET 
    plan_type = 'free',
    subscription_status = 'expired',
    updated_at = now()
  WHERE 
    subscription_expires_at IS NOT NULL 
    AND subscription_expires_at < now() 
    AND plan_type != 'free'
    AND subscription_status = 'active';
  
  GET DIAGNOSTICS expired_count = ROW_COUNT;
  
  RETURN expired_count;
END;
$$;

-- Criar trigger para atualizar updated_at em payment_failures
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar trigger na tabela payment_failures se não existir
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'update_payment_failures_updated_at'
    ) THEN
        CREATE TRIGGER update_payment_failures_updated_at
            BEFORE UPDATE ON public.payment_failures
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;
