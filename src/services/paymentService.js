// src/services/paymentService.js

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Hàm helper tạo chuỗi ngẫu nhiên (giả lập mã giao dịch)
const generateRandomString = (length) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

// Logic xử lý chính (Bạn gọi hàm này ở Checkout.jsx)
// Lưu ý: Trong Checkout.jsx bạn đang navigate thủ công, nhưng logic chuẩn là
// gọi API này để lấy URL, sau đó window.location.href = url.
// Tuy nhiên để khớp với code hiện tại của bạn (redirect nội bộ), tôi sẽ giữ logic xử lý data.

export const processPayment = async (orderData, method) => {
    await delay(1500); // Giả lập mạng lag khi đang "kết nối cổng thanh toán"

    // 1. Giả lập xác suất lỗi (Demo thì comment lại, khi bảo vệ đồ án muốn show case lỗi thì mở ra)
    // if (Math.random() < 0.1) throw new Error("Giao dịch bị từ chối bởi ngân hàng");

    let status = 'pending'; // Mặc định
    let paymentStatus = 'unpaid';

    // Logic giả lập phản hồi từ cổng thanh toán
    if (method === 'cod') {
        status = 'pending'; // Đơn hàng tạo xong, chờ giao
        paymentStatus = 'cod_pending';
    }
    else if (method === 'momo' || method === 'vnpay') {
        // Giả sử callback trả về thành công
        status = 'processing'; // Đang xử lý đóng gói
        paymentStatus = 'paid';
    }

    // Tạo mã giao dịch giả cho đẹp
    const transactionId = method === 'vnpay' ? `VNP${generateRandomString(8)}` : (method === 'momo' ? `MOMO${generateRandomString(10)}` : null);

    const newOrder = {
        ...orderData,
        date: new Date().toISOString(),
        status: status, // Trạng thái đơn hàng
        paymentInfo: {
            method: method,
            status: paymentStatus, // Trạng thái thanh toán
            transactionId: transactionId,
            paidAt: method !== 'cod' ? new Date().toISOString() : null
        },
        id: Date.now()
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