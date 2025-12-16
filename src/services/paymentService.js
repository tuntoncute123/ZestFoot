
// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const API_URL = 'http://localhost:3000';

export const processPayment = async (orderData, method) => {
    await delay(1500); // Simulate network latency

    // random failing (optional, kept simple for now)
    // if (Math.random() < 0.1) throw new Error("Payment failed");

    let status = 'pending';
    if (method === 'cod') status = 'success';
    if (method === 'momo') status = 'success'; // Simulating successful callback
    if (method === 'vnpay') status = 'success'; // Simulating successful callback

    const newOrder = {
        ...orderData,
        date: new Date().toISOString(),
        status: status,
        paymentMethod: method,
        id: Date.now() // Simple ID generation
    };

    try {
        const response = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newOrder),
        });

        if (!response.ok) {
            throw new Error('Failed to save order');
        }

        return await response.json();
    } catch (error) {
        console.error("Payment Error:", error);
        throw error;
    }
};
