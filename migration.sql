-- ============================================
-- VendorTracker — Database Migration
-- Project: vendortracker
-- Supabase: mgiamamqrvfcfqzlqtcs (SaaS Factory)
-- ============================================

-- ============================================
-- vt_settings: user settings/subscription plan
-- ============================================
CREATE TABLE IF NOT EXISTS vt_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'business')),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  subscriptions_limit INTEGER DEFAULT 10,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- ============================================
-- vt_subscriptions: tracked SaaS subscriptions
-- ============================================
CREATE TABLE IF NOT EXISTS vt_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  vendor TEXT NOT NULL DEFAULT '',
  price_monthly NUMERIC(10, 2) NOT NULL DEFAULT 0,
  category TEXT NOT NULL DEFAULT 'Other',
  usage_percent INTEGER NOT NULL DEFAULT 0 CHECK (usage_percent >= 0 AND usage_percent <= 100),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'unused', 'duplicate', 'cancelled')),
  renewal_date DATE,
  seats INTEGER DEFAULT 1,
  notes TEXT,
  detected_from TEXT DEFAULT 'manual' CHECK (detected_from IN ('manual', 'bank', 'stripe', 'quickbooks')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- vt_expenses: expense log per subscription
-- ============================================
CREATE TABLE IF NOT EXISTS vt_expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES vt_subscriptions(id) ON DELETE SET NULL,
  amount NUMERIC(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- vt_savings: AI savings recommendations
-- ============================================
CREATE TABLE IF NOT EXISTS vt_savings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES vt_subscriptions(id) ON DELETE CASCADE,
  recommendation TEXT NOT NULL,
  potential_savings NUMERIC(10, 2) NOT NULL DEFAULT 0,
  action TEXT NOT NULL DEFAULT 'cancel' CHECK (action IN ('cancel', 'downgrade', 'consolidate', 'negotiate', 'rightsize')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
  is_applied BOOLEAN DEFAULT false,
  applied_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- RLS Policies
-- ============================================
ALTER TABLE vt_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE vt_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE vt_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE vt_savings ENABLE ROW LEVEL SECURITY;

-- vt_settings
CREATE POLICY "Users can view own settings" ON vt_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own settings" ON vt_settings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own settings" ON vt_settings FOR UPDATE USING (auth.uid() = user_id);

-- vt_subscriptions
CREATE POLICY "Users can view own subscriptions" ON vt_subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own subscriptions" ON vt_subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own subscriptions" ON vt_subscriptions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own subscriptions" ON vt_subscriptions FOR DELETE USING (auth.uid() = user_id);

-- vt_expenses
CREATE POLICY "Users can view own expenses" ON vt_expenses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own expenses" ON vt_expenses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own expenses" ON vt_expenses FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own expenses" ON vt_expenses FOR DELETE USING (auth.uid() = user_id);

-- vt_savings
CREATE POLICY "Users can view own savings" ON vt_savings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own savings" ON vt_savings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own savings" ON vt_savings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own savings" ON vt_savings FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- updated_at trigger
-- ============================================
CREATE OR REPLACE FUNCTION update_vt_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER vt_settings_updated_at
  BEFORE UPDATE ON vt_settings
  FOR EACH ROW EXECUTE FUNCTION update_vt_updated_at();

CREATE TRIGGER vt_subscriptions_updated_at
  BEFORE UPDATE ON vt_subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_vt_updated_at();
