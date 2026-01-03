import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { User, Edit2, ClipboardList, Bell, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Profile.css';

const ProfileSidebar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const currentPath = location.pathname;

    const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(true);

    // Default Avatar
    const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const toggleAccountMenu = () => {
        setIsAccountMenuOpen(!isAccountMenuOpen);
    };

    if (!user) return null;

    // Derived User Info
    const avatarUrl = user.user_metadata?.avatar_url || defaultAvatar;
    const username = user.user_metadata?.username || user.email?.split('@')[0] || 'User';

    return (
        <div className="profile-sidebar">
            <div className="sidebar-user">
                <img
                    src={avatarUrl}
                    alt="avatar"
                    className="sidebar-avatar"
                    onError={(e) => { e.target.src = defaultAvatar; }}
                />
                <div className="sidebar-username">
                    <strong>{username}</strong>
                    <Link to="/profile" className="edit-profile-link">
                        <Edit2 size={12} /> Sửa Hồ Sơ
                    </Link>
                </div>
            </div>

            <nav className="sidebar-nav">
                <div className="nav-group">
                    <div
                        className={`nav-item ${['/profile', '/addresses', '/change-password'].includes(currentPath) ? 'active-highlight' : ''}`}
                        onClick={toggleAccountMenu}
                        style={{ cursor: 'pointer', justifyContent: 'space-between' }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span className="nav-icon"><User size={20} /></span>
                            <span className="nav-label">Tài Khoản Của Tôi</span>
                        </div>
                        <ChevronDown
                            size={16}
                            style={{
                                transform: isAccountMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                                transition: 'transform 0.2s',
                                color: '#888'
                            }}
                        />
                    </div>

                    {isAccountMenuOpen && (
                        <div className="sub-nav">
                            <Link to="/profile" className={`sub-nav-item ${currentPath === '/profile' ? 'active' : ''}`}>Hồ Sơ</Link>
                            <Link to="/addresses" className={`sub-nav-item ${currentPath === '/addresses' ? 'active' : ''}`}>Địa Chỉ</Link>
                            <Link to="/change-password" className={`sub-nav-item ${currentPath === '/change-password' ? 'active' : ''}`}>Đổi Mật Khẩu</Link>
                        </div>
                    )}
                </div>

                <Link to="/orders" className={`nav-item ${currentPath === '/orders' ? 'active-highlight' : ''}`}>
                    <span className="nav-icon"><ClipboardList size={20} /></span>
                    <span className="nav-label">Đơn Mua</span>
                </Link>

                <Link to="/notifications" className={`nav-item ${currentPath === '/notifications' ? 'active-highlight' : ''}`}>
                    <span className="nav-icon"><Bell size={20} /></span>
                    <span className="nav-label">Thông Báo</span>
                </Link>

                <button onClick={handleLogout} className="nav-item logout-btn">
                    <span className="nav-icon"><LogOut size={20} /></span>
                    <span className="nav-label">Đăng Xuất</span>
                </button>
            </nav>
        </div>
    );
};

export default ProfileSidebar;
