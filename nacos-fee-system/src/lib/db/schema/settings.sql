-- ===========================================
-- SETTINGS TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS settings (
    key VARCHAR(50) PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_by UUID REFERENCES admins(id)
);

-- ===========================================
-- RLS POLICIES FOR SETTINGS
-- ===========================================
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Service role has full access
CREATE POLICY "Service role has full access to settings" ON settings
    FOR ALL USING (auth.role() = 'service_role');

-- Authenticated users (admins and students) can read settings
-- Students might need to read maintenance mode status, etc.
CREATE POLICY "Authenticated users can read settings" ON settings
    FOR SELECT USING (auth.role() = 'authenticated');

-- Only admins can update settings
-- Assuming admins have a specific claim or we check against the admins table.
-- For now, we'll allow service role or specific admin checks if we had an admin role in auth.
-- Since we are building an admin panel, we might need a more robust check later.
-- For now, relying on API logic to enforce admin privileges, 
-- but RLS can restrict to service role for updates to be safe, 
-- and let the API (running as service role or checking permissions) handle it.
-- Actually, if we use Supabase client on frontend, we need RLS.
-- But usually admin actions are better done via server actions/API routes with service role.
-- Let's stick to: Read for all authenticated, Write for Service Role (API).

-- Public can read specific settings like 'maintenance_mode' if needed for login page?
-- For now, let's keep it authenticated.
