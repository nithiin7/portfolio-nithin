-- Blog view counter: one row per post slug, incremented via RPC only.
-- No INSERT/UPDATE policies for anon — the SECURITY DEFINER function is the
-- sole write path, so the anon key can increment without RETURNING access.
CREATE TABLE IF NOT EXISTS blog_views (
    slug TEXT PRIMARY KEY,
    view_count BIGINT NOT NULL DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE blog_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON blog_views
    FOR SELECT USING (true);

CREATE OR REPLACE FUNCTION increment_blog_view(post_slug TEXT)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
    INSERT INTO blog_views (slug, view_count)
    VALUES (post_slug, 1)
    ON CONFLICT (slug) DO UPDATE
    SET view_count = blog_views.view_count + 1,
        updated_at = NOW();
$$;

GRANT EXECUTE ON FUNCTION increment_blog_view(TEXT) TO anon;
