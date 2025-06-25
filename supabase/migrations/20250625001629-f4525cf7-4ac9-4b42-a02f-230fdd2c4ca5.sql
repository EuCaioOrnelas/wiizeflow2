
-- Insert admin user into auth.users table
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  invited_at,
  confirmation_token,
  confirmation_sent_at,
  recovery_token,
  recovery_sent_at,
  email_change_token_new,
  email_change,
  email_change_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  created_at,
  updated_at,
  phone,
  phone_confirmed_at,
  phone_change,
  phone_change_token,
  phone_change_sent_at,
  email_change_token_current,
  email_change_confirm_status,
  banned_until,
  reauthentication_token,
  reauthentication_sent_at,
  is_sso_user,
  deleted_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'adminwiize@wiizeflow.com.br',
  crypt('Adminflow135795.$', gen_salt('bf')),
  now(),
  null,
  '',
  null,
  '',
  null,
  '',
  '',
  null,
  null,
  '{"provider": "email", "providers": ["email"]}',
  '{"name": "Admin WiizeFlow"}',
  false,
  now(),
  now(),
  null,
  null,
  '',
  '',
  null,
  '',
  0,
  null,
  '',
  null,
  false,
  null
)
RETURNING id;

-- Get the user ID for the admin user we just created
DO $$
DECLARE
    admin_user_id UUID;
BEGIN
    -- Get the user ID
    SELECT id INTO admin_user_id 
    FROM auth.users 
    WHERE email = 'adminwiize@wiizeflow.com.br';
    
    -- Insert into profiles table
    INSERT INTO public.profiles (id, name, email, plan_type, funnel_count)
    VALUES (
        admin_user_id,
        'Admin WiizeFlow',
        'adminwiize@wiizeflow.com.br',
        'free',
        0
    )
    ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        email = EXCLUDED.email;
    
    -- Insert into admin_users table with super_admin role
    INSERT INTO public.admin_users (user_id, role, created_by)
    VALUES (
        admin_user_id,
        'super_admin',
        admin_user_id
    )
    ON CONFLICT (user_id) DO UPDATE SET
        role = EXCLUDED.role;
END $$;
