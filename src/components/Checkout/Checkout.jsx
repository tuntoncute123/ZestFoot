import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { processPayment } from '../../services/paymentService';
import './Checkout.css';
import { CreditCard, Truck, Wallet } from 'lucide-react';
import AddressAutocomplete from './AddressAutocomplete';

const Checkout = () => {
    const { state } = useLocation();
    const navigate = useNavigate();

    // Fallback if accessed directly without product (should redirect or show empty)
    const product = state?.product;
    const size = state?.size;
    const quantity = state?.quantity || 1;
    const fromCart = state?.fromCart;

    const { cartItems, getCartTotal, clearCart } = useCart();

    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        address: '',
        email: ''
    });
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [error, setError] = useState('');

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                fullName: user.lastName + ' ' + user.firstName || '',
                email: user.email || '',
                // address and phone might not be in user object based on db.json check, but we map what we can
            }));
        }
    }, [user]);

    if (!product && !fromCart) {
        return <div style={{ padding: '50px', textAlign: 'center' }}><h2>Giỏ hàng trống</h2><button onClick={() => navigate('/')}>Quay lại mua sắm</button></div>;
    }

    const total = fromCart ? getCartTotal() : (product.isSale ? product.salePrice : product.price) * quantity;
    const checkoutItems = fromCart ? cartItems : [{ product, size, quantity }];

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.fullName || !formData.phone || !formData.address) {
            setError('Vui lòng điền đầy đủ thông tin giao hàng.');
            return;
        }

        setLoading(true);
        try {
            const orderData = {
                customer: formData,
                items: checkoutItems.map(item => ({
                    productId: item.product.id,
                    productName: item.product.name,
                    price: item.product.isSale ? item.product.salePrice : item.product.price,
                    quantity: item.quantity,
                    size: item.size
                })),
                totalAmount: total
            };

            if (paymentMethod === 'cod') {
                await processPayment(orderData, paymentMethod);
                if (fromCart) clearCart();
                setSuccess(true);
            } else {
                // Redirect to Fake Gateway
                navigate(`/payment-gateway/${paymentMethod}`, { state: { orderData, fromCart } });
                return;
            }
        } catch (err) {
            setError('Thanh toán thất bại. Vui lòng thử lại.');
        } finally {
            if (paymentMethod === 'cod') setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="checkout-container success-message">
                <div>
                    <h2 style={{ color: 'green' }}>Đặt hàng thành công!</h2>
                    <p>Cảm ơn bạn đã mua hàng. Mã đơn hàng của bạn đã được gửi tới email.</p>
                    <button className="pay-btn" onClick={() => navigate('/')} style={{ marginTop: '20px', width: 'auto', padding: '10px 30px' }}>
                        Tiếp tục mua sắm
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="checkout-container">
            <div className="checkout-form">
                <h2>Thông tin giao hàng</h2>
                <form id="checkoutForm" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Họ và tên</label>
                        <input type="text" name="fullName" className="form-control" value={formData.fullName} onChange={handleInputChange} placeholder="Nguyễn Văn A" />
                    </div>
                    <div className="form-group">
                        <label>Số điện thoại</label>
                        <input type="text" name="phone" className="form-control" value={formData.phone} onChange={handleInputChange} placeholder="0901234567" />
                    </div>
                    <div className="form-group">
                        <label>Email (Tùy chọn)</label>
                        <input type="email" name="email" className="form-control" value={formData.email} onChange={handleInputChange} placeholder="email@example.com" />
                    </div>
                    <div className="form-group">
                        <AddressAutocomplete
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                        />
                    </div>

                    <h2>Phương thức thanh toán</h2>
                    <div className="payment-methods">
                        <div
                            className={`payment-method-item ${paymentMethod === 'cod' ? 'active' : ''}`}
                            onClick={() => setPaymentMethod('cod')}
                        >
                            <input type="radio" checked={paymentMethod === 'cod'} readOnly />
                            <Truck size={20} style={{ marginRight: '10px' }} />
                            <span>Thanh toán khi nhận hàng (COD)</span>
                        </div>
                        <div
                            className={`payment-method-item ${paymentMethod === 'momo' ? 'active' : ''}`}
                            onClick={() => setPaymentMethod('momo')}
                        >
                            <input type="radio" checked={paymentMethod === 'momo'} readOnly />
                            <Wallet size={20} style={{ marginRight: '10px', color: '#af2070' }} />
                            <span>Ví MoMo</span>
                        </div>
                        <div
                            className={`payment-method-item ${paymentMethod === 'vnpay' ? 'active' : ''}`}
                            onClick={() => setPaymentMethod('vnpay')}
                        >
                            <input type="radio" checked={paymentMethod === 'vnpay'} readOnly />
                            <CreditCard size={20} style={{ marginRight: '10px', color: '#005ba3' }} />
                            <span>VNPAY-QR</span>
                        </div>
                    </div>
                </form>
            </div>

            <div className="checkout-summary">
                <h2>Đơn hàng</h2>
                <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '20px' }}>
                    {checkoutItems.map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                            <img src={item.product.image} alt={item.product.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} />
                            <div>
                                <div style={{ fontWeight: '500', fontSize: '0.95rem' }}>{item.product.name}</div>
                                <div style={{ color: '#777', fontSize: '0.85rem' }}>Size: {item.size || 'N/A'}</div>
                                <div style={{ color: '#777', fontSize: '0.85rem' }}>SL: {item.quantity} x {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.product.isSale ? item.product.salePrice : item.product.price)}</div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="summary-row">
                    <span>Tạm tính</span>
                    <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total)}</span>
                </div>
                <div className="summary-row">
                    <span>Phí vận chuyển</span>
                    <span>Miễn phí</span>
                </div>
                <div className="summary-total summary-row">
                    <span>Tổng cộng</span>
                    <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total)}</span>
                </div>

                {error && <div className="error-msg">{error}</div>}

                <button type="submit" form="checkoutForm" className="pay-btn" disabled={loading}>
                    {loading ? 'Đang xử lý...' : `Thanh toán ${paymentMethod === 'cod' ? '' : (paymentMethod === 'momo' ? 'qua MoMo' : 'qua VNPAY')}`}
                </button>
            </div>
        </div>
    );
};

export default Checkout;
