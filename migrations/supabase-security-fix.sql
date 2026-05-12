-- Fix: restrict public SELECT on comments to exclude author_email
-- The anon role is used by the public Supabase anon key, which is exposed in the browser.
-- Column-level grants replace the broad SELECT so email cannot be read directly.
DROP POLICY IF EXISTS "Allow public read access" ON comments;

REVOKE SELECT ON comments FROM anon;
GRANT SELECT (id, post_id, author_name, content, parent_id, created_at, updated_at)
    ON comments TO anon;

CREATE POLICY "Allow public read access" ON comments
    FOR SELECT USING (true);

-- Fix: remove public SELECT on newsletter_subscriptions entirely.
-- There is no legitimate reason for the anon role to enumerate subscriber emails.
DROP POLICY IF EXISTS "Allow public read access for newsletter" ON newsletter_subscriptions;
