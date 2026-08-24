-- ============================================================
-- Migration: 002_fix_rls.sql
-- Supersedes 001_enable_rls.sql, which could never apply.
--
-- Why 001 failed:
--   schema.prisma maps TABLE names (@@map) but no FIELD names
--   (@map), so Prisma creates camelCase columns: "clerkId",
--   "isPublished", "userId", "downloadUrl". 001 referenced
--   clerk_id / is_published / user_id, so every CREATE POLICY
--   raised "column does not exist" and aborted the transaction —
--   leaving RLS disabled on every table.
--
-- Why the policies in 001 were also wrong:
--   They keyed on auth.uid(), but this app authenticates with
--   Clerk, not Supabase Auth. auth.uid() is always NULL here, so
--   those policies could never match a row even if they applied.
--
-- Model enforced below:
--   - Prisma connects as service_role / postgres and BYPASSES RLS.
--     All application reads and writes continue to work unchanged.
--   - anon + authenticated (the browser-side keys) get read-only
--     access to published marketing content, and nothing else.
--   - Private tables (users, orders, order_items, downloads) get
--     RLS with NO policies = deny-all for anon/authenticated.
--   - "downloadUrl" is revoked at the COLUMN level so the private
--     storage path can never be selected with a public key.
--
-- Run this in the Supabase SQL Editor. It is idempotent.
-- ============================================================

BEGIN;

-- ============================================================
-- 1. Remove the broken policies from 001, if any survived.
-- ============================================================
DROP POLICY IF EXISTS "users_select_own"        ON users;
DROP POLICY IF EXISTS "users_update_own"        ON users;
DROP POLICY IF EXISTS "products_select_published" ON products;
DROP POLICY IF EXISTS "orders_select_own"       ON orders;
DROP POLICY IF EXISTS "order_items_select_own"  ON order_items;
DROP POLICY IF EXISTS "downloads_select_own"    ON downloads;

-- ============================================================
-- 2. Enable RLS on every application table.
--    001 covered five; team_members, service_items, faqs and
--    reviews were missing entirely.
-- ============================================================
ALTER TABLE users         ENABLE ROW LEVEL SECURITY;
ALTER TABLE products      ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders        ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items   ENABLE ROW LEVEL SECURITY;
ALTER TABLE downloads     ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members  ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs          ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews       ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 3. Strip write privileges from the public roles.
--    RLS with no INSERT/UPDATE/DELETE policy already denies
--    these, but revoking the grant is the belt to that braces.
-- ============================================================
REVOKE INSERT, UPDATE, DELETE, TRUNCATE
  ON users, products, orders, order_items, downloads,
     team_members, service_items, faqs, reviews
  FROM anon, authenticated;

-- ============================================================
-- 4. Private tables: RLS on, zero policies => deny-all.
--    Revoke SELECT outright so the intent is explicit rather
--    than implied by the absence of a policy.
-- ============================================================
REVOKE SELECT ON users, orders, order_items, downloads
  FROM anon, authenticated;

-- ============================================================
-- 5. products — public may read PUBLISHED rows only, and must
--    never see "downloadUrl" (the private storage path).
--
--    Column-level grants require revoking the table-level grant
--    first: in Postgres, table-level SELECT implies every column.
-- ============================================================
REVOKE SELECT ON products FROM anon, authenticated;

GRANT SELECT (
  id, title, slug, description, price, category,
  "thumbnailUrl", "galleryUrls", version, "fileSize",
  changelog, documentation, status,
  "isPublished", "isFeatured", "createdAt", "updatedAt"
) ON products TO anon, authenticated;

CREATE POLICY "products_public_read_published" ON products
  FOR SELECT TO anon, authenticated
  USING (status::text = 'PUBLISHED');

-- ============================================================
-- 6. Marketing content — public may read published rows only.
--    Note: the app itself reads these through Prisma, which
--    bypasses RLS. These policies exist so a future browser-side
--    read works without reopening the whole table.
-- ============================================================
CREATE POLICY "team_members_public_read_published" ON team_members
  FOR SELECT TO anon, authenticated
  USING ("isPublished" = true);

CREATE POLICY "service_items_public_read_published" ON service_items
  FOR SELECT TO anon, authenticated
  USING ("isPublished" = true);

CREATE POLICY "faqs_public_read_published" ON faqs
  FOR SELECT TO anon, authenticated
  USING ("isPublished" = true);

CREATE POLICY "reviews_public_read_published" ON reviews
  FOR SELECT TO anon, authenticated
  USING ("isPublished" = true AND "approvalStatus"::text = 'APPROVED');

-- ============================================================
-- 7. Confirm service_role retains full access (Prisma path).
-- ============================================================
GRANT ALL ON users, products, orders, order_items, downloads,
             team_members, service_items, faqs, reviews
  TO service_role;

COMMIT;

-- ============================================================
-- Verify after running:
--
--   SELECT tablename, rowsecurity
--     FROM pg_tables WHERE schemaname = 'public';
--   -- expect rowsecurity = true for all nine
--
--   SELECT tablename, policyname FROM pg_policies
--    WHERE schemaname = 'public' ORDER BY tablename;
--   -- expect exactly the five *_public_read_* policies above
-- ============================================================
