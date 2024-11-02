-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create tickets table
CREATE TABLE IF NOT EXISTS tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    module_category VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'Not Started',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT valid_module_category CHECK (
        module_category IN (
            'Work Order',
            'Asset',
            'User Management',
            'Performance',
            'Dashboard/Reports',
            'Inventory',
            'Platform Settings'
        )
    ),
    CONSTRAINT valid_status CHECK (
        status IN ('Not Started', 'In Progress', 'Completed')
    )
);

-- Create ticket_attachments table
CREATE TABLE IF NOT EXISTS ticket_attachments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    filename VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    content_type VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create ticket_updates table
CREATE TABLE IF NOT EXISTS ticket_updates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_updates ENABLE ROW LEVEL SECURITY;

-- Policies for tickets
CREATE POLICY "Users can view own tickets"
    ON tickets FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tickets"
    ON tickets FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tickets"
    ON tickets FOR UPDATE
    USING (auth.uid() = user_id);

-- Policies for attachments
CREATE POLICY "Users can view ticket attachments"
    ON ticket_attachments FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM tickets
        WHERE tickets.id = ticket_attachments.ticket_id
        AND tickets.user_id = auth.uid()
    ));

-- Policies for updates
CREATE POLICY "Users can view ticket updates"
    ON ticket_updates FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM tickets
        WHERE tickets.id = ticket_updates.ticket_id
        AND tickets.user_id = auth.uid()
    ));