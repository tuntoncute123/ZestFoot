import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar.jsx';
import Footer from '../Footer/Footer.jsx';
import pic1 from '../../assets/pic1.jpg';
import CategoryBar from '../CategoryBar/CategoryBar';
import './Auth.css';
import { loginUser } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth(); // Lấy hàm login từ context

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        // Kiểm tra cơ bản
        if (!email || !password) {
            setError("Vui lòng nhập email và mật khẩu");
            return;
        }

        const result = await loginUser(email, password);

        if (result.success) {
            // Lưu thông tin user vào Context (và LocalStorage)
            login(result.user);
            // Supabase user object has metadata in user_metadata
            const name = result.user.user_metadata?.last_name || result.user.email;
            alert(`Chào mừng ${name}!`);
            navigate('/'); // Chuyển về trang chủ
        } else {
            setError(result.message);
        }
    };

    return (
        <>
            <Navbar />
            <CategoryBar />
            <div className="auth-wrapper">
                <div className="auth-container">
                    {/* Cột Trái */}
                    <div className="auth-left">
                        <div>
                            <h2 className="auth-title">ĐĂNG NHẬP</h2>
                            <p className="auth-desc">
                                Chào mừng bạn! Đăng nhập ngay để tận hưởng trải nghiệm mua sắm cá nhân hóa và các ưu đãi
                                độc quyền chỉ dành cho bạn.
                            </p>
                        </div>
                        <div className="auth-image">
                            <img
                                src={pic1}
                                alt="Welcome to HKT-SHOES" />
                        </div>
                    </div>

                    {/* Cột Phải - Form */}
                    <div className="auth-right">
                        <form onSubmit={handleLogin}>
                            {/* Hiển thị lỗi nếu có */}
                            {error && <p style={{ color: 'red', marginBottom: '10px', fontSize: '0.9rem' }}>{error}</p>}

                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    className="form-input"
                                    placeholder=""
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label>Mật khẩu</label>
                                <input
                                    type="password"
                                    className="form-input"
                                    placeholder=""
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>

                            <div className="form-actions">
                                <a href="/forgot" className="forgot-password">Quên mật khẩu?</a>
                            </div>

                            <button type="submit" className="auth-btn">ĐĂNG NHẬP</button>

                            <div className="auth-switch">
                                <span>Khách hàng mới? </span>
                                <a href="/register">Tạo tài khoản</a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Login;