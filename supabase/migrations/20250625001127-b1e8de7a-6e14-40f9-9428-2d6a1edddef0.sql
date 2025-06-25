
-- Create admin roles and permissions
CREATE TYPE public.admin_role AS ENUM ('super_admin', 'admin', 'moderator');

-- Create admin_users table to track admin permissions
CREATE TABLE public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role admin_role NOT NULL DEFAULT 'admin',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  UNIQUE(user_id)
);

-- Enable RLS on admin_users
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Create policy for admin users to view other admins
CREATE POLICY "Admins can view admin users" ON public.admin_users
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users au 
      WHERE au.user_id = auth.uid() 
      AND au.role IN ('super_admin', 'admin')
    )
  );

-- Create policy for super admins to manage admin users
CREATE POLICY "Super admins can manage admin users" ON public.admin_users
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users au 
      WHERE au.user_id = auth.uid() 
      AND au.role = 'super_admin'
    )
  );

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE admin_users.user_id = $1
  );
$$;

-- Create user_sessions table to track online users
CREATE TABLE public.user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  session_token TEXT NOT NULL,
  last_activity TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, session_token)
);

-- Enable RLS on user_sessions
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

-- Create policy for admins to view all sessions
CREATE POLICY "Admins can view all sessions" ON public.user_sessions
  FOR SELECT
  USING (public.is_admin(auth.uid()));

-- Create policy for users to manage their own sessions
CREATE POLICY "Users can manage own sessions" ON public.user_sessions
  FOR ALL
  USING (user_id = auth.uid());

-- Create trigger to update user_sessions last_activity
CREATE OR REPLACE FUNCTION public.update_user_session()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.user_sessions (user_id, session_token, last_activity)
  VALUES (NEW.id, 'session_' || NEW.id, now())
  ON CONFLICT (user_id, session_token)
  DO UPDATE SET last_activity = now();
  RETURN NEW;
END;
$$;

-- Trigger to update sessions on profile updates (indicating activity)
CREATE TRIGGER update_user_activity
  AFTER UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_user_session();

-- Create function to get admin dashboard statistics (only accessible to admins)
CREATE OR REPLACE FUNCTION public.get_admin_dashboard_stats()
RETURNS TABLE (
  online_users BIGINT,
  total_users BIGINT,
  free_users BIGINT,
  monthly_users BIGINT,
  annual_users BIGINT,
  projected_monthly_revenue NUMERIC
)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  -- Check if user is admin
  SELECT 
    CASE WHEN public.is_admin(auth.uid()) THEN
      (SELECT COUNT(*) FROM public.user_sessions 
       WHERE last_activity > now() - INTERVAL '15 minutes')
    ELSE 0 END,
    
    CASE WHEN public.is_admin(auth.uid()) THEN
      (SELECT COUNT(*) FROM public.profiles)
    ELSE 0 END,
    
    CASE WHEN public.is_admin(auth.uid()) THEN
      (SELECT COUNT(*) FROM public.profiles WHERE plan_type = 'free')
    ELSE 0 END,
    
    CASE WHEN public.is_admin(auth.uid()) THEN
      (SELECT COUNT(*) FROM public.profiles WHERE plan_type = 'monthly')
    ELSE 0 END,
    
    CASE WHEN public.is_admin(auth.uid()) THEN
      (SELECT COUNT(*) FROM public.profiles WHERE plan_type = 'annual')
    ELSE 0 END,
    
    CASE WHEN public.is_admin(auth.uid()) THEN
      COALESCE((SELECT COUNT(*) FROM public.profiles WHERE plan_type = 'monthly'), 0) * 29.90 +
      COALESCE((SELECT COUNT(*) FROM public.profiles WHERE plan_type = 'annual'), 0) * (299.90 / 12)
    ELSE 0 END;
$$;
