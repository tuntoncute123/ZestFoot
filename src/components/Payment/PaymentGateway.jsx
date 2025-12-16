import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { processPayment } from '../../services/paymentService';
import { useCart } from '../../context/CartContext';
import { CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';

const PaymentGateway = () => {
    const { method } = useParams();
    const { state } = useLocation();
    const navigate = useNavigate();
    const { clearCart } = useCart();
    // Redirect if no order data
    useEffect(() => {
        if (!state || !state.orderData) {
            navigate('/');
        }
    }, [state, navigate]);

    const [status, setStatus] = useState('confirm'); // confirm, processing, success, fail
    const orderData = state?.orderData;
    const fromCart = state?.fromCart;

    const handleConfirm = async () => {
        setStatus('processing');
        try {
            // Call the same backend service, but now we are "on the gateway"
            await processPayment(orderData, method);

            if (fromCart) clearCart();

            setStatus('success');
            // Auto redirect after success
            setTimeout(() => {
                navigate('/', { state: { paymentSuccess: true } });
                // In a real app we might go to a specific /order-success page, 
                // but for now redirecting to home or back to checkout with success flag is fine.
                // Or better, let's just show success here and a "Back to Merchant" button.
            }, 2000);
        } catch (error) {
            setStatus('fail');
        }
    };

    if (!orderData) return null;

    const isMomo = method === 'momo';
    const isVNPay = method === 'vnpay';

    const gatewayName = isMomo ? 'Ví MoMo' : 'VNPAY-QR';
    const themeColor = isMomo ? '#af2070' : '#005ba3';
    const logoUrl = isMomo
        ? "https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png"
        : "https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-VNPAY-QR.png";

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#f5f5f5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '40px',
                borderRadius: '12px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                width: '100%',
                maxWidth: '500px',
                textAlign: 'center'
            }}>
                <div style={{ marginBottom: '30px' }}>
                    <img src={logoUrl} alt={gatewayName} style={{ height: '60px', objectFit: 'contain' }} />
                </div>

                {status === 'confirm' && (
                    <>
                        <h2 style={{ color: themeColor, marginBottom: '10px' }}>Thanh toán qua {gatewayName}</h2>
                        <div style={{ margin: '20px 0', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', textAlign: 'left' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                <span style={{ color: '#666' }}>Đơn hàng:</span>
                                <span style={{ fontWeight: 'bold' }}>{orderData.id || Date.now()}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#666' }}>Tổng tiền:</span>
                                <span style={{ fontWeight: 'bold', color: themeColor, fontSize: '1.2rem' }}>
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(orderData.totalAmount)}
                                </span>
                            </div>
                        </div>

                        {/* Fake QR or Login Form */}
                        <div style={{ margin: '30px 0', padding: '20px', border: '1px dashed #ddd', borderRadius: '8px' }}>
                            <p style={{ marginBottom: '15px', color: '#555', fontStyle: 'italic' }}>
                                {isMomo ? 'Quét mã QR để thanh toán' : 'Mở ứng dụng Mobile Banking để quét mã'}
                            </p>
                            <div style={{ width: '200px', height: '200px', background: '#eee', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
                                [FAKE QR CODE]
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '15px' }}>
                            <button
                                onClick={() => navigate(-1)}
                                style={{
                                    flex: 1, padding: '12px', border: '1px solid #ddd', background: 'white', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold'
                                }}
                            >
                                Hủy bỏ
                            </button>
                            <button
                                onClick={handleConfirm}
                                style={{
                                    flex: 1, padding: '12px', border: 'none', background: themeColor, color: 'white', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold'
                                }}
                            >
                                Xác nhận thanh toán
                            </button>
                        </div>
                    </>
                )}

                {status === 'processing' && (
                    <div>
                        <Loader2 className="spin" size={60} color={themeColor} style={{ animation: 'spin 1s linear infinite' }} />
                        <h3 style={{ marginTop: '20px', color: '#555' }}>Đang xử lý giao dịch...</h3>
                        <p style={{ color: '#888' }}>Vui lòng không tắt trình duyệt</p>
                    </div>
                )}

                {status === 'success' && (
                    <div>
                        <CheckCircle size={80} color="green" style={{ marginBottom: '20px' }} />
                        <h2 style={{ color: 'green', marginBottom: '10px' }}>Giao dịch Thành Công!</h2>
                        <p>Bạn sẽ được chuyển về trang chủ trong giây lát...</p>
                    </div>
                )}

                {status === 'fail' && (
                    <div>
                        <AlertTriangle size={80} color="red" style={{ marginBottom: '20px' }} />
                        <h2 style={{ color: 'red', marginBottom: '10px' }}>Giao dịch Thất bại</h2>
                        <p>Đã có lỗi xảy ra. Vui lòng thử lại.</p>
                        <button
                            onClick={() => setStatus('confirm')}
                            style={{ marginTop: '20px', padding: '10px 30px', background: '#333', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                        >
                            Thử lại
                        </button>
                    </div>
                )}
            </div>

            {/* Simple CSS animation injection */}
            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
};

export default PaymentGateway;
