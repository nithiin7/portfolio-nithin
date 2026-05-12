-- Add moderation column
ALTER TABLE comments ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT false NOT NULL;

-- Extend the column-level grant from supabase-security-fix.sql to include is_approved
GRANT SELECT (is_approved) ON comments TO anon;

-- Tighten SELECT policy to only expose approved comments to the public
DROP POLICY IF EXISTS "Allow public read access" ON comments;
CREATE POLICY "Allow public read access" ON comments
    FOR SELECT USING (is_approved = true);
