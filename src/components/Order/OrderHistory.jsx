import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import orderService from '../../services/orderService';
import { useNavigate } from 'react-router-dom';
import { Package, Calendar, DollarSign, ChevronRight, Clock, CheckCircle } from 'lucide-react';
import './OrderHistory.css';

const OrderHistory = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchOrders = async () => {
            try {
                const data = await orderService.getOrdersByUser(user.email);
                setOrders(data);
            } catch (error) {
                console.error('Failed to load orders', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user, navigate]);

    if (loading) return <div className="loading-spinner">Loading...</div>;

    const getStatusColor = (status) => {
        switch (status) {
            case 'success':
            case 'paid':
                return 'status-success';
            case 'processing':
                return 'status-processing';
            case 'cancelled':
                return 'status-cancelled';
            default:
                return 'status-default';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'success': return 'Thành công';
            case 'paid': return 'Đã thanh toán';
            case 'processing': return 'Đang xử lý';
            case 'cancelled': return 'Đã hủy';
            default: return status;
        }
    }

    return (
        <div className="order-history-container">
            <h2 className="page-title">Lịch sử đơn hàng</h2>

            {orders.length === 0 ? (
                <div className="no-orders">
                    <Package size={48} />
                    <p>Bạn chưa có đơn hàng nào.</p>
                    <button onClick={() => navigate('/')} className="shop-now-btn">Mua sắm ngay</button>
                </div>
            ) : (
                <div className="orders-list">
                    {orders.map((order) => (
                        <div key={order.id} className="order-card" >
                            <div className="order-header">
                                <div className="order-id">
                                    <span className="label">Đơn hàng</span>
                                    <span className="value">#{order.id}</span>
                                </div>
                                <div className={`order-status ${getStatusColor(order.status)}`}>
                                    {order.status === 'success' || order.status === 'paid' ? <CheckCircle size={16} /> : <Clock size={16} />}
                                    {getStatusText(order.status)}
                                </div>
                            </div>

                            <div className="order-body">
                                <div className="order-info">
                                    <div className="info-item">
                                        <Calendar size={16} />
                                        <span>{new Date(order.date).toLocaleDateString('vi-VN')} {new Date(order.date).toLocaleTimeString('vi-VN')}</span>
                                    </div>
                                    <div className="info-item">
                                        <DollarSign size={16} />
                                        <span className="price">{order.totalAmount.toLocaleString('vi-VN')}₫</span>
                                    </div>
                                    <div className="info-item">
                                        <span>{order.items.length} sản phẩm</span>
                                    </div>
                                </div>
                                <div className="order-items-preview">
                                    {order.items.slice(0, 3).map((item, idx) => (
                                        <div key={idx} className="item-preview">
                                            {item.productName} x{item.quantity}
                                        </div>
                                    ))}
                                    {order.items.length > 3 && <div className="more-items">...và {order.items.length - 3} sản phẩm khác</div>}
                                </div>
                            </div>

                            <div className="order-footer">
                                <button className="view-detail-btn" onClick={() => navigate(`/orders/${order.id}`)}>
                                    Xem chi tiết <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrderHistory;
