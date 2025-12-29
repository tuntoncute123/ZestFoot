-- Migration: Add discount columns to orders table
-- Date: 2025-12-29
-- Purpose: Support voucher and point discounts in checkout

-- Add voucher_discount column (stores discount amount from game vouchers)
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS voucher_discount NUMERIC DEFAULT 0;

-- Add voucher_code column (stores the voucher code used)
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS voucher_code TEXT;

-- Add point_discount column (stores discount amount from points redemption)
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS point_discount NUMERIC DEFAULT 0;

-- Add comments for documentation
COMMENT ON COLUMN orders.voucher_discount IS 'Discount amount applied from game vouchers (VND)';
COMMENT ON COLUMN orders.voucher_code IS 'Voucher code used for this order';
COMMENT ON COLUMN orders.point_discount IS 'Discount amount applied from points redemption (VND)';
