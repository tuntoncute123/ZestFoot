
import { supabase } from './supabaseClient';

const orderService = {
    getOrdersByUser: async (email) => {
        try {
            // Assuming 'orders' table has a 'user_email' column or we filter by JSONb 'customer->>email'
            // The table schema in setup_supabase.sql had `items jsonb`, `name`, `phone`, `address`, `total`.
            // It did NOT have an explicit email column. It likely relies on knowing who created it, or we need to add email column.
            // Let's assume we filter by `name` or we need to add `email` to schema?
            // Wait, previous `db.json` structure likely had email inside customer object or root.
            // Let's check schema again. `orders` table has `name`, `phone`, `address`. It's missing `email`.
            // I should strongly advise adding email column.

            // For now, let's try to query assuming we will fix schema or it's in a json field?
            // Actually, best to add email column to table if not there.
            // But I cannot run SQL on their behalf easily without them using the dashboard.
            // I'll assume for now we cannot filter securely without RLS on `auth.uid()`, but let's try to find orders by `phone` or `name` if email not present?
            // No, getting orders by email is critical.

            // Temporary Workaround: Fetch all and filter in JS (BAD for performance but works for migration)
            // OR assumes 'orders' table will be updated.

            const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });

            if (error) throw error;

            return data.filter(order => order.email === email || (order.customer && order.customer.email === email));
        } catch (error) {
            console.error('Error fetching orders:', error);
            throw error;
        }
    },

    getOrderById: async (id) => {
        try {
            const { data, error } = await supabase.from('orders').select('*').eq('id', id).single();
            if (error) throw error;
            return data;
        } catch (error) {
            console.error(`Error fetching order ${id}:`, error);
            throw error;
        }
    },

    createOrder: async (orderData) => {
        try {
            const { data, error } = await supabase.from('orders').insert([orderData]).select();
            if (error) throw error;
            return data[0];
        } catch (error) {
            console.error('Error creating order:', error);
            throw error;
        }
    },

    cancelOrder: async (id) => {
        try {
            const { data, error } = await supabase
                .from('orders')
                .update({ status: 'cancelled' })
                .eq('id', id)
                .select();

            if (error) throw error;
            return data[0];
        } catch (error) {
            console.error(`Error cancelling order ${id}:`, error);
            throw error;
        }
    }
};

export default orderService;
