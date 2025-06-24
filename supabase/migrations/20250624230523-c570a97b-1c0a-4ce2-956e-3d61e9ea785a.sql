
-- Create orders table to track payment information
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  customer_email TEXT NOT NULL,
  stripe_session_id TEXT UNIQUE,
  price_id TEXT,
  amount INTEGER,             -- Amount charged (in cents)
  currency TEXT DEFAULT 'brl',
  status TEXT DEFAULT 'pending',-- e.g., 'pending', 'paid', 'failed'
  plan_name TEXT,            -- Nome do plano (Mensal, Anual)
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row-Level Security
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow users to view their own orders
CREATE POLICY "select_own_orders" ON public.orders
  FOR SELECT
  USING (user_id = auth.uid() OR customer_email = auth.email());

-- Create policies for edge functions (trusted code) to insert and update orders
CREATE POLICY "insert_order" ON public.orders
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "update_order" ON public.orders
  FOR UPDATE
  USING (true);

-- Create trigger to update updated_at column
CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
