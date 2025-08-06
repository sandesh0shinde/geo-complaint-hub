-- Drop the problematic view
DROP VIEW IF EXISTS public.admin_dashboard_stats;

-- Create a function that returns admin stats instead of a view
CREATE OR REPLACE FUNCTION public.get_admin_dashboard_stats()
RETURNS TABLE (
  total_users bigint,
  total_admins bigint,
  total_complaints bigint,
  pending_complaints bigint,
  in_progress_complaints bigint,
  resolved_complaints bigint,
  complaints_last_30_days bigint,
  new_users_last_30_days bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  -- Check if current user is admin
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Only admins can access dashboard statistics';
  END IF;
  
  RETURN QUERY
  SELECT 
    (SELECT COUNT(*) FROM user_profiles)::bigint as total_users,
    (SELECT COUNT(*) FROM user_profiles WHERE is_admin = true)::bigint as total_admins,
    (SELECT COUNT(*) FROM complaints)::bigint as total_complaints,
    (SELECT COUNT(*) FROM complaints WHERE status = 'Submitted')::bigint as pending_complaints,
    (SELECT COUNT(*) FROM complaints WHERE status = 'In Progress')::bigint as in_progress_complaints,
    (SELECT COUNT(*) FROM complaints WHERE status = 'Resolved')::bigint as resolved_complaints,
    (SELECT COUNT(*) FROM complaints WHERE created_at >= NOW() - INTERVAL '30 days')::bigint as complaints_last_30_days,
    (SELECT COUNT(*) FROM user_profiles WHERE created_at >= NOW() - INTERVAL '30 days')::bigint as new_users_last_30_days;
END;
$function$;

-- Grant execute permission to authenticated users (function will check admin status internally)
GRANT EXECUTE ON FUNCTION public.get_admin_dashboard_stats() TO authenticated;