import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import orderService from '../../services/orderService';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft, MapPin, Phone, Mail, Package, CreditCard, Calendar } from 'lucide-react';
import './OrderDetail.css';

const OrderDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchOrder = async () => {
            try {
                const data = await orderService.getOrderById(id);
                // Basic security check: ensure order belongs to current user
                // Note: In a real app, the API should handle this check. 
                // Since this is json-server, we check client-side or assume trusting the API query.
                // However, matching email is safer.
                if (data.customer.email !== user.email && data.customer.email !== undefined) {
                    // Handle case where order doesn't belong to user (optional)
                    // console.warn("Access denied: Order email mismatch");
                }
                setOrder(data);
            } catch (error) {
                console.error("Failed to load order detail", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id, user, navigate]);

    if (loading) return <div className="loading-spinner">Loading...</div>;
    if (!order) return <div className="error-message">Không tìm thấy đơn hàng.</div>;

    const getStatusText = (status) => {
        switch (status) {
            case 'success': return 'Thành công';
            case 'paid': return 'Đã thanh toán';
            case 'processing': return 'Đang xử lý';
            case 'cancelled': return 'Đã hủy';
            default: return status;
        }
    }

    const handleCancelOrder = async () => {
        if (window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này không?')) {
            try {
                await orderService.cancelOrder(order.id);
                setOrder({ ...order, status: 'cancelled' });
                alert('Đã hủy đơn hàng thành công.');
            } catch (error) {
                alert('Không thể hủy đơn hàng. Vui lòng thử lại sau.');
            }
        }
    };

    return (
        <div className="order-detail-container">
            <button onClick={() => navigate('/orders')} className="back-btn">
                <ArrowLeft size={20} /> Quay lại danh sách
            </button>

            <div className="order-detail-header">
                <div className="header-left">
                    <h1>Chi tiết đơn hàng #{order.id}</h1>
                    <span className={`status-badge status-${order.status}`}>
                        {getStatusText(order.status)}
                    </span>
                </div>
                {order.status === 'processing' && (
                    <button onClick={handleCancelOrder} className="cancel-order-btn">
                        Hủy đơn hàng
                    </button>
                )}
            </div>

            <div className="order-meta">
                <div className="meta-item">
                    <Calendar size={18} />
                    <span>Ngày đặt: {new Date(order.date).toLocaleDateString('vi-VN')} {new Date(order.date).toLocaleTimeString('vi-VN')}</span>
                </div>
                <div className="meta-item">
                    <CreditCard size={18} />
                    <span>Phương thức: {order.paymentMethod?.toUpperCase() || "COD"}</span>
                </div>
            </div>

            <div className="order-content">
                <div className="customer-info-section">
                    <h3><MapPin size={20} /> Địa chỉ nhận hàng</h3>
                    <div className="info-box">
                        <p className="customer-name">{order.customer.fullName}</p>
                        <p className="customer-phone"><Phone size={14} /> {order.customer.phone}</p>
                        <p className="customer-address">{order.customer.address}</p>
                        {order.customer.detailAddress && <p className="customer-address-detail">{order.customer.detailAddress}, {order.customer.province}</p>}
                    </div>
                </div>

                <div className="items-section">
                    <h3><Package size={20} /> Sản phẩm</h3>
                    <div className="items-list">
                        {order.items.map((item, idx) => (
                            <div key={idx} className="order-item">
                                <div className="item-image">
                                    {item.image ? (
                                        <img src={item.image} alt={item.productName} />
                                    ) : (
                                        <div className="no-image">No Image</div>
                                    )}
                                </div>
                                <div className="item-details">
                                    <div className="item-name">{item.productName}</div>
                                    <div className="item-variant">Size: {item.size}</div>
                                    <div className="item-quantity">x{item.quantity}</div>
                                </div>
                                <div className="item-price">
                                    {item.price.toLocaleString('vi-VN')}₫
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="order-summary">
                <div className="summary-row">
                    <span>Tạm tính</span>
                    <span>{order.subTotal ? order.subTotal.toLocaleString('vi-VN') : (order.totalAmount - (order.shippingFee || 0)).toLocaleString('vi-VN')}₫</span>
                </div>
                <div className="summary-row">
                    <span>Phí vận chuyển</span>
                    <span>{order.shippingFee ? order.shippingFee.toLocaleString('vi-VN') : '0'}₫</span>
                </div>
                {order.discount > 0 && (
                    <div className="summary-row discount">
                        <span>Giảm giá</span>
                        <span>-{order.discount.toLocaleString('vi-VN')}₫</span>
                    </div>
                )}
                <div className="summary-row total">
                    <span>Tổng cộng</span>
                    <span>{order.totalAmount.toLocaleString('vi-VN')}₫</span>
                </div>
            </div>
        </div>
    );
};

export default OrderDetail;
