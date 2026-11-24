-- =====================================================================
-- Kauseyah: Promotional Announcement Bar Migration
-- File: supabase/migrations/20261116_create_announcement_bars.sql
-- Description: Dynamic top promotional announcement bars.
-- Status: PENDING CLIENT AUTHORIZATION (DO NOT EXECUTE WITHOUT APPROVAL)
-- =====================================================================

CREATE TABLE IF NOT EXISTS public.announcement_bars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  internal_name TEXT NOT NULL,
  message TEXT NOT NULL,
  cta_text TEXT,
  cta_url TEXT,
  background_color TEXT NOT NULL DEFAULT '#851A36',
  text_color TEXT NOT NULL DEFAULT '#FFFFFF',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'inactive')),
  start_at TIMESTAMPTZ,
  end_at TIMESTAMPTZ,
  priority INTEGER NOT NULL DEFAULT 0,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_dismissible BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_announcement_bars_status ON public.announcement_bars(status);
CREATE INDEX IF NOT EXISTS idx_announcement_bars_schedule ON public.announcement_bars(start_at, end_at);
CREATE INDEX IF NOT EXISTS idx_announcement_bars_priority ON public.announcement_bars(priority DESC, display_order ASC);

-- Enable Row Level Security
ALTER TABLE public.announcement_bars ENABLE ROW LEVEL SECURITY;

-- 1. Public Read Policy: Only active, currently scheduled announcements
CREATE POLICY "Public can view active eligible announcements"
  ON public.announcement_bars
  FOR SELECT
  TO public
  USING (
    status = 'active' AND
    (start_at IS NULL OR start_at <= NOW()) AND
    (end_at IS NULL OR end_at >= NOW())
  );

-- 2. Administrator Full Access Policy
CREATE POLICY "Admins have full access to announcement_bars"
  ON public.announcement_bars
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_roles.user_id = auth.uid() 
      AND user_roles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_roles.user_id = auth.uid() 
      AND user_roles.role = 'admin'
    )
  );

-- Trigger for auto-updating updated_at timestamp
CREATE OR REPLACE FUNCTION update_announcement_bars_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_announcement_bars_updated_at ON public.announcement_bars;
CREATE TRIGGER tr_announcement_bars_updated_at
  BEFORE UPDATE ON public.announcement_bars
  FOR EACH ROW
  EXECUTE FUNCTION update_announcement_bars_timestamp();

-- =====================================================================
-- Rollback Instructions:
-- DROP TABLE IF EXISTS public.announcement_bars CASCADE;
-- DROP FUNCTION IF EXISTS update_announcement_bars_timestamp CASCADE;
-- =====================================================================
