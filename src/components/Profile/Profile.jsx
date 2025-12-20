import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // Mock state matching the form
    const [profileData, setProfileData] = useState({
        username: user?.email ? user.email.split('@')[0] : 'user123',
        name: user?.user_metadata?.first_name ? `${user.user_metadata.first_name} ${user.user_metadata.last_name}` : (user?.firstName ? `${user.firstName} ${user.lastName}` : 'Khách'),
        email: user?.email || 'test@example.com',
        phone: '********42',
        gender: 'male',
        day: '1',
        month: '1',
        year: '1990'
    });

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    if (!user) {
        return (
            <div className="profile-container" style={{ textAlign: 'center', padding: '50px' }}>
                <p>Vui lòng đăng nhập để xem thông tin tài khoản.</p>
                <Link to="/login" className="btn-primary">Đăng nhập</Link>
            </div>
        );
    }

    // Days/Months/Years generation
    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

    return (
        <div className="profile-container">
            {/* Top Header - Requested to keep */}
            <div className="profile-header-top">
                <h1 className="profile-title-main">Welcome to Your Account</h1>
                <div className="header-actions">
                    <Link to="/addresses" className="view-address-btn">Xem địa chỉ</Link>
                    <button onClick={handleLogout} className="logout-link">Đăng xuất</button>
                </div>
            </div>

            {/* Main White Box Content */}
            <div className="profile-paper">
                <div className="paper-header">
                    <h2>Hồ Sơ Của Tôi</h2>
                    <p>Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
                </div>

                <div className="profile-body">
                    {/* Left Side: Form */}
                    <div className="profile-form-section">
                        <div className="form-row-custom">
                            <label>Tên đăng nhập</label>
                            <div className="input-with-text">
                                <span className="static-text">{profileData.username}</span>
                                <span className="note">Tên Đăng nhập chỉ có thể thay đổi một lần.</span>
                            </div>
                        </div>

                        <div className="form-row-custom">
                            <label>Tên</label>
                            <input
                                type="text"
                                name="name"
                                value={profileData.name}
                                onChange={handleChange}
                                className="input-field"
                            />
                        </div>

                        <div className="form-row-custom">
                            <label>Email</label>
                            <div className="input-with-text">
                                <span className="static-text">{profileData.email}</span>
                                <a href="#" className="link-action">Thay Đổi</a>
                            </div>
                        </div>

                        <div className="form-row-custom">
                            <label>Số điện thoại</label>
                            <div className="input-with-text">
                                <span className="static-text">{profileData.phone}</span>
                                <a href="#" className="link-action">Thay Đổi</a>
                            </div>
                        </div>

                        <div className="form-row-custom">
                            <label>Giới tính</label>
                            <div className="radio-group">
                                <label className="radio-label">
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="male"
                                        checked={profileData.gender === 'male'}
                                        onChange={handleChange}
                                    />
                                    <span>Nam</span>
                                </label>
                                <label className="radio-label">
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="female"
                                        checked={profileData.gender === 'female'}
                                        onChange={handleChange}
                                    />
                                    <span>Nữ</span>
                                </label>
                                <label className="radio-label">
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="other"
                                        checked={profileData.gender === 'other'}
                                        onChange={handleChange}
                                    />
                                    <span>Khác</span>
                                </label>
                            </div>
                        </div>

                        <div className="form-row-custom">
                            <label>Ngày sinh</label>
                            <div className="dob-selects">
                                <select name="day" value={profileData.day} onChange={handleChange}>
                                    <option value="">Ngày</option>
                                    {days.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                                <select name="month" value={profileData.month} onChange={handleChange}>
                                    <option value="">Tháng</option>
                                    {months.map(m => <option key={m} value={m}>{m}</option>)}
                                </select>
                                <select name="year" value={profileData.year} onChange={handleChange}>
                                    <option value="">Năm</option>
                                    {years.map(y => <option key={y} value={y}>{y}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="form-row-custom submit-row">
                            <label></label> {/* Empty label for alignment */}
                            <button className="save-btn">Lưu</button>
                        </div>
                    </div>

                    {/* Right Side: Avatar */}
                    <div className="profile-avatar-section">
                        <div className="avatar-wrapper">
                            <img src="https://i.pinimg.com/736x/0d/64/98/0d64989794b1a4c9d89bf5c0d8db907b.jpg" alt="Avatar" />
                        </div>
                        <button className="select-image-btn">Chọn Ảnh</button>
                        <div className="avatar-note">
                            <p>Dụng lượng file tối đa 1 MB</p>
                            <p>Định dạng:.JPEG, .PNG</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
