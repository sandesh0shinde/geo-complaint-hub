-- Add database constraints for input validation and security
ALTER TABLE public.complaints 
ADD CONSTRAINT check_subject_length CHECK (char_length(subject) >= 5 AND char_length(subject) <= 200),
ADD CONSTRAINT check_description_length CHECK (char_length(description) >= 20 AND char_length(description) <= 2000),
ADD CONSTRAINT check_location_length CHECK (location IS NULL OR char_length(location) <= 500);

-- Add database constraints for user_profiles
ALTER TABLE public.user_profiles
ADD CONSTRAINT check_full_name_length CHECK (char_length(full_name) >= 2 AND char_length(full_name) <= 100),
ADD CONSTRAINT check_phone_format CHECK (phone_number IS NULL OR phone_number ~ '^\+?[1-9]\d{1,14}$'),
ADD CONSTRAINT check_address_length CHECK (address IS NULL OR char_length(address) <= 500);

-- Create rate limiting table for complaint submissions
CREATE TABLE IF NOT EXISTS public.rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  action_type text NOT NULL,
  action_count integer DEFAULT 1,
  window_start timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on rate_limits table
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Create policies for rate_limits table
CREATE POLICY "Users can view own rate limits" 
ON public.rate_limits 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own rate limits" 
ON public.rate_limits 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own rate limits" 
ON public.rate_limits 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create function to check and enforce rate limits
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  p_user_id uuid,
  p_action_type text,
  p_max_actions integer DEFAULT 5,
  p_window_minutes integer DEFAULT 60
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  current_count integer;
  window_start_time timestamp with time zone;
BEGIN
  -- Calculate window start time
  window_start_time := now() - (p_window_minutes || ' minutes')::interval;
  
  -- Clean up old rate limit records
  DELETE FROM public.rate_limits 
  WHERE window_start < window_start_time;
  
  -- Get current count for this user and action type
  SELECT COALESCE(SUM(action_count), 0) INTO current_count
  FROM public.rate_limits
  WHERE user_id = p_user_id 
    AND action_type = p_action_type
    AND window_start >= window_start_time;
  
  -- Check if limit exceeded
  IF current_count >= p_max_actions THEN
    RETURN false;
  END IF;
  
  -- Record this action
  INSERT INTO public.rate_limits (user_id, action_type, action_count, window_start)
  VALUES (p_user_id, p_action_type, 1, now())
  ON CONFLICT (user_id, action_type) 
  DO UPDATE SET 
    action_count = rate_limits.action_count + 1,
    window_start = CASE 
      WHEN rate_limits.window_start < window_start_time THEN now()
      ELSE rate_limits.window_start
    END;
  
  RETURN true;
END;
$function$;

-- Create audit trail table for admin actions
CREATE TABLE IF NOT EXISTS public.admin_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id uuid NOT NULL,
  action_type text NOT NULL,
  target_user_email text,
  details jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on audit log
ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Only admins can view audit logs" 
ON public.admin_audit_log 
FOR SELECT 
USING (public.is_admin());

-- Create enhanced admin promotion function with audit trail
CREATE OR REPLACE FUNCTION public.promote_user_to_admin_secure(
  user_email text,
  justification text DEFAULT '',
  ip_address inet DEFAULT NULL,
  user_agent text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  target_user_id uuid;
  admin_count integer;
BEGIN
  -- Check if current user is admin
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Only admins can promote users';
  END IF;
  
  -- Validate email format
  IF user_email !~ '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
    RAISE EXCEPTION 'Invalid email format';
  END IF;
  
  -- Enhanced domain validation for admin emails
  IF user_email !~ '@(municipal\.gov|gov\.in|city\.gov)$' THEN
    RAISE EXCEPTION 'Admin users must have government domain email (@municipal.gov, @gov.in, @city.gov)';
  END IF;
  
  -- Check if justification is provided for sensitive action
  IF char_length(trim(justification)) < 10 THEN
    RAISE EXCEPTION 'Justification must be at least 10 characters for admin promotion';
  END IF;
  
  -- Rate limiting check for admin actions
  IF NOT public.check_rate_limit(auth.uid(), 'admin_promotion', 3, 60) THEN
    RAISE EXCEPTION 'Rate limit exceeded for admin promotions. Please try again later.';
  END IF;
  
  -- Find user by email
  SELECT au.id INTO target_user_id
  FROM auth.users au
  WHERE au.email = user_email;
  
  IF target_user_id IS NULL THEN
    RAISE EXCEPTION 'User with email % not found', user_email;
  END IF;
  
  -- Check if user is already admin
  SELECT COUNT(*) INTO admin_count
  FROM user_profiles 
  WHERE id = target_user_id AND is_admin = true;
  
  IF admin_count > 0 THEN
    RAISE EXCEPTION 'User % is already an admin', user_email;
  END IF;
  
  -- Update user profile to admin
  UPDATE user_profiles 
  SET is_admin = true, updated_at = NOW()
  WHERE id = target_user_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User profile not found for email %', user_email;
  END IF;
  
  -- Log the admin action
  INSERT INTO public.admin_audit_log (
    admin_user_id, 
    action_type, 
    target_user_email, 
    details,
    ip_address,
    user_agent
  ) VALUES (
    auth.uid(), 
    'promote_to_admin', 
    user_email,
    jsonb_build_object(
      'justification', justification,
      'target_user_id', target_user_id
    ),
    ip_address,
    user_agent
  );
END;
$function$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.promote_user_to_admin_secure(text, text, inet, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_rate_limit(uuid, text, integer, integer) TO authenticated;