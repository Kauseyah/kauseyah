-- Add the is_active column to the profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Refresh Supabase API Cache
NOTIFY pgrst, 'reload schema';
