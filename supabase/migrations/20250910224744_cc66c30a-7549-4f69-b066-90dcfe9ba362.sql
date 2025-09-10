-- Fix security definer view issue
DROP VIEW IF EXISTS public.clinician_discovery;

-- Create a regular view without SECURITY DEFINER (safer approach)
CREATE VIEW public.clinician_discovery AS 
SELECT 
  id,
  first_name as display_name,
  'Psychologist' as specializations,
  CASE WHEN language = 'es' THEN ARRAY['Spanish'] ELSE ARRAY['English'] END as languages,
  'Argentina' as region
FROM public.profiles 
WHERE role IN ('clinician', 'psychologist') 
  AND status = 'active';

-- Create RLS policy for the view access
CREATE POLICY "clinician_discovery_public_read" ON public.profiles 
FOR SELECT 
USING (
  role IN ('clinician', 'psychologist') 
  AND status = 'active'
);

-- Revoke the broad grant and be more specific
REVOKE SELECT ON public.clinician_discovery FROM anon, authenticated;
GRANT SELECT (id, display_name, specializations, languages, region) ON public.clinician_discovery TO anon, authenticated;