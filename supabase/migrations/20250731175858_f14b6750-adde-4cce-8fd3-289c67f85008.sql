-- Fix security issues by setting search_path for existing functions
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  INSERT INTO public.user_profiles (id, full_name, is_admin)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    CASE 
      WHEN NEW.email LIKE '%@municipal.gov' OR NEW.email LIKE '%@gov.in' THEN TRUE
      ELSE COALESCE((NEW.raw_user_meta_data->>'is_admin')::boolean, FALSE)
    END
  );
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;

-- Create security definer function to prevent RLS recursion
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE id = auth.uid() AND is_admin = true
  );
$function$;

-- Update RLS policies to use the security definer function
DROP POLICY IF EXISTS "Admins can view all complaints" ON public.complaints;
DROP POLICY IF EXISTS "Admins can update all complaints" ON public.complaints;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.user_profiles;

CREATE POLICY "Admins can view all complaints"
ON public.complaints
FOR SELECT
USING (public.is_admin() OR auth.uid() = user_id);

CREATE POLICY "Admins can update all complaints"
ON public.complaints
FOR UPDATE
USING (public.is_admin() OR auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles"
ON public.user_profiles
FOR SELECT
USING (public.is_admin() OR auth.uid() = id);

-- Create admin dashboard stats view
CREATE OR REPLACE VIEW public.admin_dashboard_stats AS
SELECT 
  (SELECT COUNT(*) FROM user_profiles) as total_users,
  (SELECT COUNT(*) FROM user_profiles WHERE is_admin = true) as total_admins,
  (SELECT COUNT(*) FROM complaints) as total_complaints,
  (SELECT COUNT(*) FROM complaints WHERE status = 'Submitted') as pending_complaints,
  (SELECT COUNT(*) FROM complaints WHERE status = 'In Progress') as in_progress_complaints,
  (SELECT COUNT(*) FROM complaints WHERE status = 'Resolved') as resolved_complaints,
  (SELECT COUNT(*) FROM complaints WHERE created_at >= NOW() - INTERVAL '30 days') as complaints_last_30_days,
  (SELECT COUNT(*) FROM user_profiles WHERE created_at >= NOW() - INTERVAL '30 days') as new_users_last_30_days;

-- Create admin management functions
CREATE OR REPLACE FUNCTION public.promote_user_to_admin(user_email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  target_user_id uuid;
BEGIN
  -- Check if current user is admin
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Only admins can promote users';
  END IF;
  
  -- Find user by email
  SELECT au.id INTO target_user_id
  FROM auth.users au
  WHERE au.email = user_email;
  
  IF target_user_id IS NULL THEN
    RAISE EXCEPTION 'User with email % not found', user_email;
  END IF;
  
  -- Update user profile to admin
  UPDATE user_profiles 
  SET is_admin = true, updated_at = NOW()
  WHERE id = target_user_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User profile not found for email %', user_email;
  END IF;
END;
$function$;

CREATE OR REPLACE FUNCTION public.revoke_admin_privileges(user_email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  target_user_id uuid;
BEGIN
  -- Check if current user is admin
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Only admins can revoke admin privileges';
  END IF;
  
  -- Find user by email
  SELECT au.id INTO target_user_id
  FROM auth.users au
  WHERE au.email = user_email;
  
  IF target_user_id IS NULL THEN
    RAISE EXCEPTION 'User with email % not found', user_email;
  END IF;
  
  -- Prevent revoking own admin status
  IF target_user_id = auth.uid() THEN
    RAISE EXCEPTION 'Cannot revoke your own admin privileges';
  END IF;
  
  -- Update user profile to remove admin
  UPDATE user_profiles 
  SET is_admin = false, updated_at = NOW()
  WHERE id = target_user_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User profile not found for email %', user_email;
  END IF;
END;
$function$;

-- Grant necessary permissions
GRANT SELECT ON public.admin_dashboard_stats TO authenticated;
GRANT EXECUTE ON FUNCTION public.promote_user_to_admin(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.revoke_admin_privileges(text) TO authenticated;