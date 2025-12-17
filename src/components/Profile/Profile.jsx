import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (!user) {
        return (
            <div className="profile-container" style={{ textAlign: 'center', padding: '50px' }}>
                <p>Vui lòng đăng nhập để xem thông tin tài khoản.</p>
                <Link to="/login" className="btn-primary">Đăng nhập</Link>
            </div>
        );
    }

    return (
        <div className="profile-container">
            {/* Header */}
            <div className="profile-header">
                <h1 className="profile-title">Welcome to Your Account</h1>
                <button onClick={handleLogout} className="logout-btn">Đăng xuất</button>
            </div>

            {/* Main Content Grid */}
            <div className="profile-content">
                {/* Left Column: Order History */}
                <div className="profile-main">
                    <h2 className="section-heading">Lịch sử đặt hàng</h2>
                    <div className="order-history-placeholder">
                        <p>Bạn chưa đặt đơn hàng nào.</p>
                    </div>
                </div>

                {/* Right Column: Account Details */}
                <div className="profile-sidebar">
                    <h2 className="section-heading">Chi tiết tài khoản</h2>
                    <div className="account-details-card">
                        <p className="user-name">{user.firstName} {user.lastName}</p>
                        <p className="user-location">{user.country || 'Việt Nam'}</p>
                        <p className="view-addresses">
                            <Link to="/addresses">Xem địa chỉ (1)</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
