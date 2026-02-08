-- ===========================================
-- STUDENTS / PROFILES TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(255) NOT NULL,
    matric_number VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    department VARCHAR(100) NOT NULL,
    level VARCHAR(20) NOT NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    email_verification_token VARCHAR(255),
    email_verification_expires TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_students_email ON students(email);
CREATE INDEX IF NOT EXISTS idx_students_matric ON students(matric_number);
CREATE INDEX IF NOT EXISTS idx_students_verification_token ON students(email_verification_token);

-- ===========================================
-- RLS POLICIES FOR STUDENTS
-- ===========================================
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

-- Service role has full access
CREATE POLICY "Service role has full access to students" ON students
    FOR ALL USING (auth.role() = 'service_role');

-- Students can view their own profile
CREATE POLICY "Students can view own profile" ON students
    FOR SELECT USING (auth.uid() = id);

-- Students can update their own profile
CREATE POLICY "Students can update own profile" ON students
    FOR UPDATE USING (auth.uid() = id);
