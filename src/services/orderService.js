
import { supabase } from './supabaseClient';

const orderService = {
    getOrdersByUser: async (email) => {
        try {
            // Using the new 'email' column for filtering
            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .eq('email', email)
                .order('created_at', { ascending: false });

            if (error) throw error;

            return data;
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
            // Ensure email is extracted from customer data and added to the top-level column
            const orderPayload = {
                ...orderData,
                email: orderData.customer?.email
            };

            const { data, error } = await supabase.from('orders').insert([orderPayload]).select();
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
