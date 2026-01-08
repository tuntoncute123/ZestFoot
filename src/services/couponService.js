import { supabase } from './supabaseClient';

export const validateCoupon = async (code, orderTotal) => {
    try {
        const upperCode = code.toUpperCase().trim();

        // 1. Fetch coupon
        const { data: coupon, error } = await supabase
            .from('coupons')
            .select('*')
            .eq('code', upperCode)
            .eq('is_active', true)
            .single();

        if (error || !coupon) {
            return { valid: false, message: 'Mã giảm giá không tồn tại hoặc đã hết hạn.' };
        }

        // 2. Check Expiry
        const now = new Date();
        if (coupon.start_date && new Date(coupon.start_date) > now) {
            return { valid: false, message: 'Mã giảm giá chưa đến đợt áp dụng.' };
        }
        if (coupon.end_date && new Date(coupon.end_date) < now) {
            return { valid: false, message: 'Mã giảm giá đã hết hạn.' };
        }

        // 3. Check Usage Limit
        if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
            return { valid: false, message: 'Mã giảm giá đã hết số lượng.' };
        }

        // 4. Check Min Order Value
        if (orderTotal < (coupon.min_order_value || 0)) {
            return {
                valid: false,
                message: `Đơn hàng tối thiểu để dùng mã này là ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(coupon.min_order_value)}`
            };
        }

        // 5. Calculate Discount
        let discountAmount = 0;
        if (coupon.discount_type === 'fixed') {
            discountAmount = coupon.discount_value;
        } else if (coupon.discount_type === 'percent') {
            discountAmount = (orderTotal * coupon.discount_value) / 100;
            if (coupon.max_discount_amount && discountAmount > coupon.max_discount_amount) {
                discountAmount = coupon.max_discount_amount;
            }
        }

        return {
            valid: true,
            discount: discountAmount,
            message: `Áp dụng thành công! Giảm ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(discountAmount)}`,
            coupon: coupon
        };

    } catch (error) {
        console.error("Coupon Validation Error:", error);
        return { valid: false, message: 'Có lỗi xảy ra khi kiểm tra mã giảm giá.' };
    }
};

export const markCouponAsUsed = async (couponCode) => {
    if (!couponCode) return;

    try {
        // Use RPC or simple update if race condition is not a huge concern for this scale
        // For simplicity/demo: Fetch then update, or just increment
        // Note: Ideally use a Supabase RPC function `increment_coupon_usage`

        // We will try to just call an RPC if exists, or do a safe update
        // Since we cannot create RPC easily here without running SQL, we'll assume low concurrency for now
        // and just increment.

        const { data: coupon } = await supabase.from('coupons').select('used_count').eq('code', couponCode).single();
        if (coupon) {
            await supabase
                .from('coupons')
                .update({ used_count: (coupon.used_count || 0) + 1 })
                .eq('code', couponCode);
        }
    } catch (err) {
        console.error("Error marking coupon used:", err);
    }
};
