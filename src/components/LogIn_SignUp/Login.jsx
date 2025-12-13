// eslint-disable-next-line no-unused-vars
import React from 'react';
import Navbar from '../Navbar/Navbar.jsx';
import Footer from '../Footer/Footer.jsx';
import pic1 from '../../assets/pic1.jpg';
import CategoryBar from '../CategoryBar/CategoryBar';
import './Auth.css';


const Login = () => {
    return (
        <>

            <Navbar/>
            <CategoryBar/>
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
                            {/* Thay src bằng biến import ảnh hoặc link ảnh thật */}
                            <img
                                src={pic1}
                                alt="Welcome to HKT-SHOES"/>
                        </div>
                    </div>

                    {/* Cột Phải - Form */}
                    <div className="auth-right">
                        <form>
                            <div className="form-group">
                                <label>Email</label>
                                <input type="email" className="form-input" placeholder=""/>
                            </div>
                            <div className="form-group">
                                <label>Mật khẩu</label>
                                <input type="password" className="form-input" placeholder=""/>
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
            <Footer/>
        </>
    );
};

export default Login;