-- Register the private "work-assets" Supabase Storage bucket.
--
-- Required by app/api/works/[workId]/assets/route.ts (Sentry Sound V1
-- song registration journey, Phase 2 — file upload). Bucket is private;
-- all access goes through the service-role-authenticated API route, not
-- direct client access.

INSERT INTO storage.buckets (id, name, public)
VALUES ('work-assets', 'work-assets', false)
ON CONFLICT (id) DO NOTHING;
