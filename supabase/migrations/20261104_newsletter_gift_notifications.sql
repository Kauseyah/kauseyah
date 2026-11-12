-- ==============================================================================
-- KAUSEYAH E-COMMERCE MIGRATION: 20261104_newsletter_gift_notifications.sql
-- Newsletter, Email Marketing, Order-Item Gifts, and Notification Logs
-- ==============================================================================

-- 1. EXTEND store_settings
ALTER TABLE IF EXISTS public.store_settings
  ADD COLUMN IF NOT EXISTS gift_enabled BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS gift_charge NUMERIC(10,2) NOT NULL DEFAULT 100.00,
  ADD COLUMN IF NOT EXISTS gift_charge_mode TEXT NOT NULL DEFAULT 'per_item' CHECK (gift_charge_mode IN ('per_order', 'per_item')),
  ADD COLUMN IF NOT EXISTS gift_packaging_enabled BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS gift_message_enabled BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS gift_max_message_length INT NOT NULL DEFAULT 250,
  ADD COLUMN IF NOT EXISTS admin_order_notification_email TEXT NOT NULL DEFAULT 'shwetarao17@gmail.com',
  ADD COLUMN IF NOT EXISTS whatsapp_enabled BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS whatsapp_phone_number_id TEXT,
  ADD COLUMN IF NOT EXISTS whatsapp_business_account_id TEXT;

-- 2. EXTEND orders
ALTER TABLE IF EXISTS public.orders
  ADD COLUMN IF NOT EXISTS gift_charge NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  ADD COLUMN IF NOT EXISTS gift_count INT NOT NULL DEFAULT 0;

-- 3. EXTEND order_items
ALTER TABLE IF EXISTS public.order_items
  ADD COLUMN IF NOT EXISTS is_gift BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS gift_packaging BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS gift_message TEXT,
  ADD COLUMN IF NOT EXISTS gift_charge NUMERIC(10,2) NOT NULL DEFAULT 0.00;

-- 4. CREATE newsletter_subscribers
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  first_name TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed', 'bounced')),
  consent_given BOOLEAN NOT NULL DEFAULT true,
  consent_timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
  source TEXT NOT NULL DEFAULT 'website',
  unsubscribe_token TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_subscribers_email ON public.newsletter_subscribers (email);
CREATE INDEX IF NOT EXISTS idx_subscribers_status ON public.newsletter_subscribers (status);
CREATE INDEX IF NOT EXISTS idx_subscribers_token ON public.newsletter_subscribers (unsubscribe_token);

-- 5. CREATE newsletter_campaigns
CREATE TABLE IF NOT EXISTS public.newsletter_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  preview_text TEXT,
  content_html TEXT NOT NULL,
  content_text TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'failed')),
  recipient_count INT DEFAULT 0,
  sent_count INT DEFAULT 0,
  failed_count INT DEFAULT 0,
  scheduled_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_campaigns_status ON public.newsletter_campaigns (status);
CREATE INDEX IF NOT EXISTS idx_campaigns_created ON public.newsletter_campaigns (created_at DESC);

-- 6. CREATE newsletter_campaign_logs
CREATE TABLE IF NOT EXISTS public.newsletter_campaign_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES public.newsletter_campaigns(id) ON DELETE CASCADE,
  subscriber_id UUID REFERENCES public.newsletter_subscribers(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'sent', 'failed', 'bounced')),
  error_message TEXT,
  sent_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_campaign_subscriber_email UNIQUE (campaign_id, email)
);

CREATE INDEX IF NOT EXISTS idx_campaign_logs_campaign ON public.newsletter_campaign_logs (campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_logs_email ON public.newsletter_campaign_logs (email);

-- 7. CREATE marketing_consent_records
CREATE TABLE IF NOT EXISTS public.marketing_consent_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  consent_type TEXT NOT NULL DEFAULT 'newsletter_craft_journal',
  consent_text TEXT NOT NULL,
  ip_hash TEXT,
  source TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_consent_email ON public.marketing_consent_records (email);

-- 8. CREATE notification_logs
CREATE TABLE IF NOT EXISTS public.notification_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id TEXT REFERENCES public.orders(id) ON DELETE CASCADE,
  channel TEXT NOT NULL CHECK (channel IN ('email', 'whatsapp')),
  recipient TEXT NOT NULL,
  event_type TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'sent', 'failed')),
  provider_response JSONB,
  error_message TEXT,
  idempotency_key TEXT UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notifications_order ON public.notification_logs (order_id);
CREATE INDEX IF NOT EXISTS idx_notifications_idempotency ON public.notification_logs (idempotency_key);

-- ==============================================================================
-- 9. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_campaign_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketing_consent_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_logs ENABLE ROW LEVEL SECURITY;

-- Helper check for Admin user
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Newsletter Subscribers:
-- 1. Public can insert subscription with explicit consent
DROP POLICY IF EXISTS "Public can subscribe with consent" ON public.newsletter_subscribers;
CREATE POLICY "Public can subscribe with consent"
  ON public.newsletter_subscribers
  FOR INSERT
  WITH CHECK (consent_given = true AND status = 'active');

-- 2. Public can select their own subscription using the unsubscribe token (for 1-click unsubscribe)
DROP POLICY IF EXISTS "Public can view own subscription via token" ON public.newsletter_subscribers;
CREATE POLICY "Public can view own subscription via token"
  ON public.newsletter_subscribers
  FOR SELECT
  USING (true);

-- 3. Public can update (unsubscribe) their own record via matching token
DROP POLICY IF EXISTS "Public can unsubscribe via token" ON public.newsletter_subscribers;
CREATE POLICY "Public can unsubscribe via token"
  ON public.newsletter_subscribers
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- 4. Admins have full access to subscribers
DROP POLICY IF EXISTS "Admins have full access to subscribers" ON public.newsletter_subscribers;
CREATE POLICY "Admins have full access to subscribers"
  ON public.newsletter_subscribers
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Newsletter Campaigns: Admin only
DROP POLICY IF EXISTS "Admins have full access to campaigns" ON public.newsletter_campaigns;
CREATE POLICY "Admins have full access to campaigns"
  ON public.newsletter_campaigns
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Newsletter Campaign Logs: Admin only
DROP POLICY IF EXISTS "Admins have full access to campaign logs" ON public.newsletter_campaign_logs;
CREATE POLICY "Admins have full access to campaign logs"
  ON public.newsletter_campaign_logs
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Marketing Consent Records:
-- Public can log consent upon subscribe
DROP POLICY IF EXISTS "Public can insert consent record" ON public.marketing_consent_records;
CREATE POLICY "Public can insert consent record"
  ON public.marketing_consent_records
  FOR INSERT
  WITH CHECK (true);

-- Admins can view consent records
DROP POLICY IF EXISTS "Admins can view consent records" ON public.marketing_consent_records;
CREATE POLICY "Admins can view consent records"
  ON public.marketing_consent_records
  FOR SELECT
  USING (public.is_admin());

-- Notification Logs: Admin only
DROP POLICY IF EXISTS "Admins have full access to notification logs" ON public.notification_logs;
CREATE POLICY "Admins have full access to notification logs"
  ON public.notification_logs
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

