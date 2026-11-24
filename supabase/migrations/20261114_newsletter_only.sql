-- ==============================================================================
-- KAUSEYAH E-COMMERCE MIGRATION: 20261114_newsletter_only.sql (AUDITED & HARDENED)
-- Isolated Newsletter Subscription, Campaign Management, and Marketing Consent
-- ==============================================================================

-- 0. Ensure pgcrypto extension exists for cryptographic token generation
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

-- 1. CREATE newsletter_subscribers
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  first_name TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed', 'bounced')),
  consent_given BOOLEAN NOT NULL DEFAULT true,
  consent_timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
  source TEXT NOT NULL DEFAULT 'website',
  unsubscribe_token TEXT NOT NULL UNIQUE DEFAULT encode(extensions.gen_random_bytes(32), 'hex'),
  unsubscribed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Safe idempotent column additions in case table was created partially
ALTER TABLE public.newsletter_subscribers ADD COLUMN IF NOT EXISTS first_name TEXT;
ALTER TABLE public.newsletter_subscribers ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'active';
ALTER TABLE public.newsletter_subscribers ADD COLUMN IF NOT EXISTS consent_given BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE public.newsletter_subscribers ADD COLUMN IF NOT EXISTS consent_timestamp TIMESTAMPTZ NOT NULL DEFAULT now();
ALTER TABLE public.newsletter_subscribers ADD COLUMN IF NOT EXISTS source TEXT NOT NULL DEFAULT 'website';
ALTER TABLE public.newsletter_subscribers ADD COLUMN IF NOT EXISTS unsubscribe_token TEXT;
ALTER TABLE public.newsletter_subscribers ADD COLUMN IF NOT EXISTS unsubscribed_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_subscribers_email ON public.newsletter_subscribers (email);
CREATE INDEX IF NOT EXISTS idx_subscribers_status ON public.newsletter_subscribers (status);
CREATE INDEX IF NOT EXISTS idx_subscribers_token ON public.newsletter_subscribers (unsubscribe_token);

-- 2. CREATE newsletter_campaigns
CREATE TABLE IF NOT EXISTS public.newsletter_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  preview_text TEXT,
  content_html TEXT NOT NULL,
  content_text TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'partially_failed', 'failed')),
  recipient_count INT DEFAULT 0,
  sent_count INT DEFAULT 0,
  failed_count INT DEFAULT 0,
  scheduled_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_campaigns_status ON public.newsletter_campaigns (status);
CREATE INDEX IF NOT EXISTS idx_campaigns_created ON public.newsletter_campaigns (created_at DESC);

-- 3. CREATE newsletter_campaign_logs
CREATE TABLE IF NOT EXISTS public.newsletter_campaign_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES public.newsletter_campaigns(id) ON DELETE CASCADE,
  subscriber_id UUID REFERENCES public.newsletter_subscribers(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'sent', 'failed', 'bounced')),
  attempt_count INT NOT NULL DEFAULT 0,
  error_message TEXT,
  last_attempt_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_campaign_subscriber_email UNIQUE (campaign_id, email)
);

ALTER TABLE public.newsletter_campaign_logs ADD COLUMN IF NOT EXISTS attempt_count INT NOT NULL DEFAULT 0;
ALTER TABLE public.newsletter_campaign_logs ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();
ALTER TABLE public.newsletter_campaign_logs ADD COLUMN IF NOT EXISTS last_attempt_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_campaign_logs_campaign ON public.newsletter_campaign_logs (campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_logs_email ON public.newsletter_campaign_logs (email);
CREATE INDEX IF NOT EXISTS idx_campaign_logs_status_retry ON public.newsletter_campaign_logs (campaign_id, status, attempt_count, updated_at);

-- 4. CREATE marketing_consent_records
CREATE TABLE IF NOT EXISTS public.marketing_consent_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  consent_type TEXT NOT NULL DEFAULT 'newsletter_craft_journal',
  consent_text TEXT NOT NULL,
  ip_hash TEXT,
  source TEXT NOT NULL DEFAULT 'website',
  consent_given BOOLEAN NOT NULL DEFAULT true,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.marketing_consent_records ADD COLUMN IF NOT EXISTS source TEXT NOT NULL DEFAULT 'website';
ALTER TABLE public.marketing_consent_records ADD COLUMN IF NOT EXISTS ip_hash TEXT;
CREATE INDEX IF NOT EXISTS idx_consent_email ON public.marketing_consent_records (email);
CREATE INDEX IF NOT EXISTS idx_consent_ip_hash_time ON public.marketing_consent_records (ip_hash, timestamp);

-- 5. CREATE dedicated newsletter_rate_limits TABLE
CREATE TABLE IF NOT EXISTS public.newsletter_rate_limits (
  ip_hash TEXT PRIMARY KEY,
  attempts INT NOT NULL DEFAULT 1,
  first_attempt_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_attempt_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  blocked_until TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_rate_limits_window ON public.newsletter_rate_limits (last_attempt_at);

-- 6. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_campaign_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketing_consent_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_rate_limits ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_newsletter_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, pg_temp
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  );
END;
$$;

REVOKE EXECUTE ON FUNCTION public.is_newsletter_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_newsletter_admin() TO authenticated;

-- Hardened Admin Policies (Public REST API writes blocked)
DROP POLICY IF EXISTS "Admins have full access to subscribers" ON public.newsletter_subscribers;
CREATE POLICY "Admins have full access to subscribers"
  ON public.newsletter_subscribers
  FOR ALL
  USING (public.is_newsletter_admin())
  WITH CHECK (public.is_newsletter_admin());

DROP POLICY IF EXISTS "Admins have full access to campaigns" ON public.newsletter_campaigns;
CREATE POLICY "Admins have full access to campaigns"
  ON public.newsletter_campaigns
  FOR ALL
  USING (public.is_newsletter_admin())
  WITH CHECK (public.is_newsletter_admin());

DROP POLICY IF EXISTS "Admins have full access to campaign logs" ON public.newsletter_campaign_logs;
CREATE POLICY "Admins have full access to campaign logs"
  ON public.newsletter_campaign_logs
  FOR ALL
  USING (public.is_newsletter_admin())
  WITH CHECK (public.is_newsletter_admin());

DROP POLICY IF EXISTS "Admins can view consent records" ON public.marketing_consent_records;
CREATE POLICY "Admins can view consent records"
  ON public.marketing_consent_records
  FOR ALL
  USING (public.is_newsletter_admin())
  WITH CHECK (public.is_newsletter_admin());

DROP POLICY IF EXISTS "Admins have full access to rate limits" ON public.newsletter_rate_limits;
CREATE POLICY "Admins have full access to rate limits"
  ON public.newsletter_rate_limits
  FOR ALL
  USING (public.is_newsletter_admin())
  WITH CHECK (public.is_newsletter_admin());

-- 7. ATOMIC RECIPIENT CLAIMING FUNCTION FOR CONCURRENT BATCH WORKERS
-- Employs SELECT ... FOR UPDATE SKIP LOCKED to guarantee no duplicate sends across parallel workers.
-- Hardened with database-level admin and service-role authorization check.
CREATE OR REPLACE FUNCTION public.claim_campaign_recipients(
  p_campaign_id UUID,
  p_batch_size INT DEFAULT 15,
  p_timeout_seconds INT DEFAULT 300
)
RETURNS TABLE (
  log_id UUID,
  subscriber_id UUID,
  email TEXT,
  first_name TEXT,
  unsubscribe_token TEXT,
  attempt_count INT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions, pg_temp
AS $$
BEGIN
  -- Database-level authorization gate: service_role or admin user role required
  IF auth.role() <> 'service_role' AND NOT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Unauthorized: newsletter admin or service role privileges required'
      USING ERRCODE = 'insufficient_privilege';
  END IF;

  RETURN QUERY
  WITH candidate AS (
    SELECT l.id
    FROM public.newsletter_campaign_logs l
    WHERE l.campaign_id = p_campaign_id
      AND (
        l.status = 'pending'
        OR (l.status = 'failed' AND l.attempt_count < 3)
        OR (l.status = 'processing' AND l.updated_at < (now() - (p_timeout_seconds || ' seconds')::INTERVAL))
      )
    ORDER BY l.attempt_count ASC, l.created_at ASC
    LIMIT p_batch_size
    FOR UPDATE SKIP LOCKED
  ),
  claimed AS (
    UPDATE public.newsletter_campaign_logs l
    SET
      status = 'processing',
      attempt_count = l.attempt_count + 1,
      updated_at = now(),
      last_attempt_at = now()
    FROM candidate c
    WHERE l.id = c.id
    RETURNING l.id, l.subscriber_id, l.email, l.attempt_count
  )
  SELECT
    cl.id AS log_id,
    cl.subscriber_id,
    cl.email,
    s.first_name,
    s.unsubscribe_token,
    cl.attempt_count
  FROM claimed cl
  LEFT JOIN public.newsletter_subscribers s ON s.id = cl.subscriber_id;
END;
$$;

REVOKE ALL ON FUNCTION public.claim_campaign_recipients(UUID, INT, INT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.claim_campaign_recipients(UUID, INT, INT) TO service_role, authenticated;

-- 8. ATOMIC RATE LIMITING FUNCTION (PERSISTENT & CONCURRENCY SAFE)
-- Prevents read-then-write race conditions and initial-row insertion races across serverless instances.
-- Uses atomic ON CONFLICT DO NOTHING followed by row-level locking (FOR UPDATE) to guarantee serialized increments.
CREATE OR REPLACE FUNCTION public.check_and_record_newsletter_rate_limit(
  p_ip_hash TEXT,
  p_max_attempts INT DEFAULT 5,
  p_window_minutes INT DEFAULT 15
)
RETURNS TABLE (
  allowed BOOLEAN,
  attempts_recorded INT,
  blocked_until TIMESTAMPTZ,
  reason TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions, pg_temp
AS $$
DECLARE
  v_row public.newsletter_rate_limits%ROWTYPE;
  v_now TIMESTAMPTZ := now();
  v_window_interval INTERVAL := (p_window_minutes || ' minutes')::INTERVAL;
BEGIN
  IF p_ip_hash IS NULL OR p_ip_hash = '' OR p_ip_hash = 'unknown' THEN
    RETURN QUERY SELECT true, 0, NULL::TIMESTAMPTZ, 'unknown_ip'::TEXT;
    RETURN;
  END IF;

  -- Step 1: Ensure row exists atomically without throwing duplicate key errors on concurrent requests
  INSERT INTO public.newsletter_rate_limits (ip_hash, attempts, first_attempt_at, last_attempt_at, blocked_until)
  VALUES (p_ip_hash, 0, v_now, v_now, NULL)
  ON CONFLICT (ip_hash) DO NOTHING;

  -- Step 2: Acquire an exclusive row lock on the guaranteed-existing row
  SELECT * INTO v_row
  FROM public.newsletter_rate_limits
  WHERE ip_hash = p_ip_hash
  FOR UPDATE;

  -- Step 3: Check if currently blocked
  IF v_row.blocked_until IS NOT NULL AND v_row.blocked_until > v_now THEN
    RETURN QUERY SELECT false, v_row.attempts, v_row.blocked_until, 'blocked'::TEXT;
    RETURN;
  END IF;

  -- Step 4: Check if window has expired (or if this is initial row created at 0)
  IF v_row.attempts = 0 OR v_row.last_attempt_at < (v_now - v_window_interval) THEN
    UPDATE public.newsletter_rate_limits
    SET attempts = 1,
        first_attempt_at = v_now,
        last_attempt_at = v_now,
        blocked_until = NULL
    WHERE ip_hash = p_ip_hash;
    RETURN QUERY SELECT true, 1, NULL::TIMESTAMPTZ, 'first_attempt'::TEXT;
    RETURN;
  END IF;

  -- Step 5: Within active window: check threshold
  IF v_row.attempts >= p_max_attempts THEN
    UPDATE public.newsletter_rate_limits
    SET attempts = v_row.attempts + 1,
        last_attempt_at = v_now,
        blocked_until = v_now + v_window_interval
    WHERE ip_hash = p_ip_hash;
    RETURN QUERY SELECT false, v_row.attempts + 1, (v_now + v_window_interval), 'rate_limit_exceeded'::TEXT;
    RETURN;
  ELSE
    UPDATE public.newsletter_rate_limits
    SET attempts = v_row.attempts + 1,
        last_attempt_at = v_now
    WHERE ip_hash = p_ip_hash;
    RETURN QUERY SELECT true, v_row.attempts + 1, NULL::TIMESTAMPTZ, 'attempt_recorded'::TEXT;
    RETURN;
  END IF;
END;
$$;

REVOKE ALL ON FUNCTION public.check_and_record_newsletter_rate_limit(TEXT, INT, INT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.check_and_record_newsletter_rate_limit(TEXT, INT, INT) TO anon, authenticated, service_role;

-- 9. ATOMIC CAMPAIGN STATUS RECONCILIATION FUNCTION
-- Prevents race conditions and guarantees accurate counts and status transitions.
CREATE OR REPLACE FUNCTION public.reconcile_campaign_status(
  p_campaign_id UUID
)
RETURNS TABLE (
  campaign_id UUID,
  status TEXT,
  sent_count INT,
  failed_count INT,
  pending_count INT,
  processing_count INT,
  is_complete BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions, pg_temp
AS $$
DECLARE
  v_sent INT;
  v_failed INT;
  v_pending INT;
  v_processing INT;
  v_total INT;
  v_new_status TEXT;
  v_is_done BOOLEAN;
  v_camp public.newsletter_campaigns%ROWTYPE;
BEGIN
  IF auth.role() <> 'service_role' AND NOT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Unauthorized: newsletter admin or service role privileges required'
      USING ERRCODE = 'insufficient_privilege';
  END IF;

  SELECT * INTO v_camp
  FROM public.newsletter_campaigns
  WHERE id = p_campaign_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Campaign not found' USING ERRCODE = 'data_exception';
  END IF;

  SELECT
    COALESCE(COUNT(*) FILTER (WHERE l.status = 'sent'), 0),
    COALESCE(COUNT(*) FILTER (WHERE l.status = 'failed'), 0),
    COALESCE(COUNT(*) FILTER (WHERE l.status = 'pending'), 0),
    COALESCE(COUNT(*) FILTER (WHERE l.status = 'processing'), 0),
    COALESCE(COUNT(*), 0)
  INTO v_sent, v_failed, v_pending, v_processing, v_total
  FROM public.newsletter_campaign_logs l
  WHERE l.campaign_id = p_campaign_id;

  v_is_done := (v_pending = 0 AND v_processing = 0);

  IF v_is_done THEN
    IF v_failed > 0 THEN
      v_new_status := 'partially_failed';
    ELSE
      v_new_status := 'sent';
    END IF;

    UPDATE public.newsletter_campaigns
    SET
      status = v_new_status,
      sent_count = v_sent,
      failed_count = v_failed,
      recipient_count = v_total,
      sent_at = COALESCE(sent_at, now()),
      completed_at = now(),
      updated_at = now()
    WHERE id = p_campaign_id;
  ELSE
    v_new_status := 'sending';
    UPDATE public.newsletter_campaigns
    SET
      status = 'sending',
      sent_count = v_sent,
      failed_count = v_failed,
      recipient_count = v_total,
      updated_at = now()
    WHERE id = p_campaign_id;
  END IF;

  RETURN QUERY SELECT
    p_campaign_id,
    v_new_status,
    v_sent,
    v_failed,
    v_pending,
    v_processing,
    v_is_done;
END;
$$;

REVOKE ALL ON FUNCTION public.reconcile_campaign_status(UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.reconcile_campaign_status(UUID) TO service_role, authenticated;
