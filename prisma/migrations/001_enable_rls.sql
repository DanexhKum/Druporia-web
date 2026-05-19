-- ============================================================
-- Migration: 001_enable_rls.sql
-- Purpose: Enable Row-Level Security on all application tables.
-- Run this in your Supabase SQL Editor AFTER `prisma db push`.
-- 
-- IMPORTANT: Prisma uses the service-role key (bypasses RLS).
-- RLS protects against direct Supabase client access from
-- frontend code or compromised anon keys.
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE downloads ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- USERS table policies
-- Users can only read/update their own row.
-- Admins can read all rows.
-- ============================================================
CREATE POLICY "users_select_own" ON users
  FOR SELECT USING (auth.uid()::text = clerk_id);

CREATE POLICY "users_update_own" ON users
  FOR UPDATE USING (auth.uid()::text = clerk_id)
  WITH CHECK (auth.uid()::text = clerk_id);

-- ============================================================
-- PRODUCTS table policies
-- Anyone can read published products.
-- Only service-role (Prisma) can insert/update/delete.
-- ============================================================
CREATE POLICY "products_select_published" ON products
  FOR SELECT USING (is_published = true);

-- ============================================================
-- ORDERS table policies
-- Users can only read their own orders.
-- ============================================================
CREATE POLICY "orders_select_own" ON orders
  FOR SELECT USING (
    user_id IN (
      SELECT id FROM users WHERE clerk_id = auth.uid()::text
    )
  );

-- ============================================================
-- ORDER_ITEMS table policies
-- Users can only read items belonging to their own orders.
-- ============================================================
CREATE POLICY "order_items_select_own" ON order_items
  FOR SELECT USING (
    order_id IN (
      SELECT o.id FROM orders o
      INNER JOIN users u ON u.id = o.user_id
      WHERE u.clerk_id = auth.uid()::text
    )
  );

-- ============================================================
-- DOWNLOADS table policies
-- Users can only read their own download history.
-- ============================================================
CREATE POLICY "downloads_select_own" ON downloads
  FOR SELECT USING (
    user_id IN (
      SELECT id FROM users WHERE clerk_id = auth.uid()::text
    )
  );

-- ============================================================
-- Grant service_role full access (used by Prisma server-side)
-- ============================================================
GRANT ALL ON users TO service_role;
GRANT ALL ON products TO service_role;
GRANT ALL ON orders TO service_role;
GRANT ALL ON order_items TO service_role;
GRANT ALL ON downloads TO service_role;
