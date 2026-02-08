-- ===========================================
-- NOTIFICATIONS TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(20) DEFAULT 'info' CHECK (type IN ('info', 'alert', 'success', 'warning')),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for notifications
CREATE INDEX IF NOT EXISTS idx_notifications_student ON notifications(student_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);

-- ===========================================
-- RLS POLICIES FOR NOTIFICATIONS
-- ===========================================
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role has full access to notifications" ON notifications
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Students can read their own notifications" ON notifications
    FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Students can update their own notifications" ON notifications
    FOR UPDATE USING (auth.uid() = student_id);
