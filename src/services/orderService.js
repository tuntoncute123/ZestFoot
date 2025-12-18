
const API_URL = 'http://localhost:3000';

const orderService = {
    getOrdersByUser: async (email) => {
        try {
            // json-server filtering: ?customer.email=...
            // Note: db.json structure is "orders": [ { "customer": { "email": ... } } ]
            // json-server supports nested property filtering.
            const response = await fetch(`${API_URL}/orders?customer.email=${email}&_sort=date&_order=desc`);
            if (!response.ok) {
                throw new Error('Failed to fetch orders');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching orders:', error);
            throw error;
        }
    },

    getOrderById: async (id) => {
        try {
            const response = await fetch(`${API_URL}/orders/${id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch order details');
            }
            return await response.json();
        } catch (error) {
            console.error(`Error fetching order ${id}:`, error);
            throw error;
        }
    },

    cancelOrder: async (id) => {
        try {
            const response = await fetch(`${API_URL}/orders/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: 'cancelled' }),
            });
            if (!response.ok) {
                throw new Error('Failed to cancel order');
            }
            return await response.json();
        } catch (error) {
            console.error(`Error cancelling order ${id}:`, error);
            throw error;
        }
    }
};

export default orderService;
