import React, { useState } from 'react';
import { Package, Tag, Info, BellOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './NotificationPage.css';

const NotificationPage = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('order');

    // Mock Data based on user request
    const notifications = [
        // ORDER Notifications
        {
            id: 1,
            type: "order",
            title: "Đơn hàng đang vận chuyển",
            content: "Đơn hàng #VN284920 của bạn đã được giao cho đơn vị vận chuyển. Vui lòng chú ý điện thoại.",
            date: "14:30 20-10-2023",
            isRead: false,
            image: "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/e6da41fa-1be4-4ce5-b89c-22be4f1f02d4/air-force-1-07-shoes-WrLlWX.png" // Placeholder shoe image
        },
        {
            id: 2,
            type: "order",
            title: "Giao hàng thành công",
            content: "Đơn hàng #VN284910 đã được giao thành công. Hãy đánh giá sản phẩm để nhận xu nhé!",
            date: "Yesterday 10:20",
            isRead: true,
            status: "success",
            image: "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/4f37fca8-6bce-43e7-ad07-f57ae3c13142/air-force-1-07-ehm-shoes-Trj5D2.png"
        },
        {
            id: 3,
            type: "order",
            title: "Đơn hàng của bạn đã bị hủy",
            content: "Rất tiếc, đơn hàng #123AD của bạn đã bị hủy do hết size. Tiền đã được hoàn về ví.",
            date: "15 Oct 2023",
            isRead: true,
            status: "cancelled",
            image: "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/52550186-2244-4861-893c-242099f81df6/air-jordan-1-mid-shoes-X5pM09.png"
        },

        // PROMOTION Notifications
        {
            id: 4,
            type: "promotion",
            title: "Flash Sale 11.11 Sắp Bắt Đầu!",
            content: "Săn giày hiệu giảm giá đến 50%. Đừng bỏ lỡ cơ hội sở hữu đôi giày mơ ước!",
            date: "09:00 20-10-2023",
            isRead: false,
            image: null
        },
        {
            id: 5,
            type: "promotion",
            title: "Bạn nhận được Voucher mới",
            content: "Voucher giảm giá 20% cho đơn hàng giày chạy bộ đã được thêm vào ví của bạn.",
            date: "12 Oct 2023",
            isRead: true,
            image: null
        },

        // ACTIVITY/SYSTEM Notifications
        {
            id: 6,
            type: "info",
            title: "Cập nhật bảo mật tài khoản",
            content: "Chúng tôi đã cập nhật chính sách bảo mật mới. Vui lòng kiểm tra lại thông tin tài khoản của bạn.",
            date: "15 Oct 2023",
            isRead: true,
            image: null
        },
        {
            id: 7,
            type: "info",
            title: "Chào mừng bạn đến với Shoe Store",
            content: "Cảm ơn bạn đã tạo tài khoản. Hãy bắt đầu mua sắm ngay hôm nay!",
            date: "01 Oct 2023",
            isRead: true,
            image: null
        }
    ];

    // Filter notifications based on Active Tab
    const filteredNotifications = notifications.filter(notif => {
        if (activeTab === 'order') return notif.type === 'order';
        if (activeTab === 'promotion') return notif.type === 'promotion';
        if (activeTab === 'info') return notif.type === 'info';
        return true;
    });

    const handleItemClick = (notif) => {
        if (notif.type === 'order') {
            navigate('/orders'); // Or /orders/:id
        } else if (notif.type === 'promotion') {
            // Example: Navigate to collection or sales page
            navigate('/collections/sale');
        } else {
            // Stay or expand
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'order': return <Package size={24} color="#26aa99" />;
            case 'promotion': return <Tag size={24} color="#ee4d2d" />;
            case 'info': return <Info size={24} color="#1890ff" />;
            default: return <BellOff size={24} color="#888" />;
        }
    };

    return (
        <div className="notification-page">
            <div className="notification-header">
                <h3>THÔNG BÁO</h3>
                <button className="mark-all-read">Đánh dấu đã đọc tất cả</button>
            </div>

            <div className="notification-tabs">
                <div
                    className={`notif-tab ${activeTab === 'order' ? 'active' : ''}`}
                    onClick={() => setActiveTab('order')}
                >
                    Cập nhật đơn hàng
                </div>
                <div
                    className={`notif-tab ${activeTab === 'promotion' ? 'active' : ''}`}
                    onClick={() => setActiveTab('promotion')}
                >
                    Khuyến mãi
                </div>
                <div
                    className={`notif-tab ${activeTab === 'info' ? 'active' : ''}`}
                    onClick={() => setActiveTab('info')}
                >
                    Cập nhật hệ thống
                </div>
            </div>

            <div className="notification-list">
                {filteredNotifications.length > 0 ? (
                    filteredNotifications.map(item => (
                        <div
                            key={item.id}
                            className={`notification-item ${!item.isRead ? 'unread' : ''}`}
                            onClick={() => handleItemClick(item)}
                        >
                            <div className="notif-image-container">
                                {item.image ? (
                                    <img src={item.image} alt="Product" className="notif-image" />
                                ) : (
                                    getIcon(item.type)
                                )}
                            </div>
                            <div className="notif-content">
                                <div className="notif-title">{item.title}</div>
                                <div className="notif-description">{item.content}</div>
                                <div className="notif-time">{item.date}</div>
                            </div>
                            {item.type === 'order' && (
                                <button className="notif-action-btn">
                                    {item.status === 'success' ? 'Đánh giá' : 'Xem chi tiết'}
                                </button>
                            )}
                            {item.type === 'promotion' && (
                                <button className="notif-action-btn">
                                    Xem ngay
                                </button>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="empty-notification">
                        <BellOff size={48} className="empty-icon" />
                        <p>Chưa có thông báo nào.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationPage;
