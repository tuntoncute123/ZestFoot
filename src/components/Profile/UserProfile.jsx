import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Lock } from 'lucide-react';
import './Profile.css';

const UserProfile = () => {
    const { user } = useAuth();

    // Default Avatar
    const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

    // Initial state setup
    const [profileData, setProfileData] = useState({
        username: '',
        name: '',
        email: '',
        phone: '',
        gender: 'male',
        day: '1',
        month: '1',
        year: '1990',
        avatarUrl: ''
    });

    useEffect(() => {
        if (user) {
            // Extract username
            const username = user.user_metadata?.username || user.email?.split('@')[0] || '';

            // Extract name
            let fullName = '';
            if (user.user_metadata?.full_name) {
                fullName = user.user_metadata.full_name;
            } else if (user.user_metadata?.first_name || user.user_metadata?.last_name) {
                fullName = [user.user_metadata.first_name, user.user_metadata.last_name].filter(Boolean).join(' ');
            } else {
                fullName = 'Khách';
            }

            setProfileData(prev => ({
                ...prev,
                username: username,
                name: fullName,
                email: user.email || '',
                phone: user.user_metadata?.phone || '********42',
                avatarUrl: user.user_metadata?.avatar_url || ''
            }));
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Days/Months/Years generation
    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

    return (
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
                        <div className="input-text-display read-only-text">
                            {profileData.username} <Lock size={14} className="lock-icon" />
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
                        <div className="input-text-display">
                            {profileData.email.replace(/(^..)(.*)(@.*)/, '$1**$3')}
                            <a href="#" className="link-change">Thay Đổi</a>
                        </div>
                    </div>

                    <div className="form-row-custom">
                        <label>Số điện thoại</label>
                        <div className="input-text-display">
                            {profileData.phone}
                            <a href="#" className="link-change">Thay Đổi</a>
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
                        <label></label>
                        <button className="save-btn">Lưu</button>
                    </div>
                </div>

                {/* Right Side: Avatar */}
                <div className="profile-avatar-section">
                    <div className="avatar-wrapper">
                        <img
                            src={profileData.avatarUrl || defaultAvatar}
                            alt="Avatar"
                            onError={(e) => { e.target.src = defaultAvatar; }}
                        />
                    </div>
                    <button className="select-image-btn">Chọn Ảnh</button>
                    <div className="avatar-note">
                        <p>Dụng lượng file tối đa 1 MB</p>
                        <p>Định dạng:.JPEG, .PNG</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
