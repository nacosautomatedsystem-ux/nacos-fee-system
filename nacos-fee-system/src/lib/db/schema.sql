-- ===========================================
-- NACOS Fee Clearance System - Supabase Schema
-- ===========================================
-- Run this SQL in your Supabase SQL Editor
-- Project Dashboard > SQL Editor > New Query
-- ===========================================

-- Enable UUID extension (usually already enabled in Supabase)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===========================================
-- STUDENTS TABLE
-- ===========================================
-- Moved to src/lib/db/schema/profiles.sql

-- ===========================================
-- ADMINS TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS admins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===========================================
-- FEES TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS fees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
    session VARCHAR(20) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===========================================
-- PAYMENTS TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    fee_id UUID NOT NULL REFERENCES fees(id) ON DELETE RESTRICT,
    amount DECIMAL(10, 2) NOT NULL,
    reference VARCHAR(100) UNIQUE NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed')),
    paid_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for payments
CREATE INDEX IF NOT EXISTS idx_payments_student ON payments(student_id);
CREATE INDEX IF NOT EXISTS idx_payments_reference ON payments(reference);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);

-- ===========================================
-- CLEARANCE TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS clearance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID UNIQUE NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'uncleared' CHECK (status IN ('cleared', 'uncleared')),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for clearance
CREATE INDEX IF NOT EXISTS idx_clearance_student ON clearance(student_id);
CREATE INDEX IF NOT EXISTS idx_clearance_status ON clearance(status);

-- ===========================================
-- NOTIFICATIONS TABLE
-- ===========================================
-- Moved to src/lib/db/schema/notifications.sql

-- ===========================================
-- ROW LEVEL SECURITY (RLS) 
-- ===========================================
-- Enable RLS on all tables
-- Note: students and notifications RLS policies are in their respective schema files.
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE fees ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE clearance ENABLE ROW LEVEL SECURITY;

-- Allow service role full access (for server-side operations)

-- Admins table
CREATE POLICY "Service role has full access to admins" ON admins
    FOR ALL USING (auth.role() = 'service_role');

-- Fees table
CREATE POLICY "Service role has full access to fees" ON fees
    FOR ALL USING (auth.role() = 'service_role');

-- Public read access for fees (so students can see available fees)
CREATE POLICY "Anyone can read active fees" ON fees
    FOR SELECT USING (is_active = TRUE);

-- Payments table
CREATE POLICY "Service role has full access to payments" ON payments
    FOR ALL USING (auth.role() = 'service_role');

-- Clearance table
CREATE POLICY "Service role has full access to clearance" ON clearance
    FOR ALL USING (auth.role() = 'service_role');


-- ===========================================
-- SAMPLE DATA (Optional - for testing)
-- ===========================================
-- Default admin account (password: admin123)
-- Hash generated with bcrypt, 10 rounds
INSERT INTO admins (email, password_hash, full_name)
VALUES (
    'admin@sacoetec.edu.ng',
    '$2b$10$mvv5WhXUGviifnQne8Y5OODpTnRIqMf3UNRJPcO1PyaACtPevP626',
    'System Administrator'
) ON CONFLICT (email) DO NOTHING;

-- Sample fees
INSERT INTO fees (title, amount, session, is_active) VALUES
    ('NACOS Membership Fee', 5000.00, '2024/2025', TRUE),
    ('NACOS Development Levy', 3000.00, '2024/2025', TRUE)
ON CONFLICT DO NOTHING;

-- ===========================================
-- NOTES FOR SUPABASE SETUP
-- ===========================================
-- 1. Go to Project Settings > API to get your:
--    - Project URL (NEXT_PUBLIC_SUPABASE_URL)
--    - anon public key (NEXT_PUBLIC_SUPABASE_ANON_KEY)
--    - service_role key (SUPABASE_SERVICE_ROLE_KEY) - Keep this secret!
--
-- 2. The service_role key bypasses RLS and should only be used server-side
--
-- 3. For the admin password hash, generate a new one using:
--    const bcrypt = require('bcryptjs');
--    const hash = await bcrypt.hash('your-password', 10);
--    console.log(hash);
-- ===========================================
