import React from 'react';
import Navbar from '../Navbar/Navbar.jsx';
import Footer from '../Footer/Footer.jsx';
import './Auth.css';


const SignUp = () => {
    return (
        <>

            <Navbar/>
            <div className="auth-wrapper">
                <div className="auth-container">
                    {/* Cột Trái */}
                    <div className="auth-left">
                        <div>
                            <h2 className="auth-title">TẠO TÀI KHOẢN</h2>
                            <p className="auth-desc">
                                Tạo tài khoản mới ngay để trải nghiệm mua sắm dễ dàng và nhận ngay những ưu đãi đặc biệt
                                dành riêng cho bạn!
                            </p>
                        </div>
                        <div className="auth-image">
                            {/* Thay src bằng biến import ảnh hoặc link ảnh thật */}
                            <img
                                src="https://file.hstatic.net/200000384421/file/artboard_1_801b6377694d4d68846171f687498c4d.jpg"
                                alt="Welcome to HKT-SHOES"/>
                        </div>
                    </div>

                    {/* Cột Phải - Form */}
                    <div className="auth-right">
                        <form>
                            <div className="form-group">
                                <label>Tên</label>
                                <input type="text" className="form-input"/>
                            </div>
                            <div className="form-group">
                                <label>Họ</label>
                                <input type="text" className="form-input"/>
                            </div>
                            <div className="form-group">
                                <label>Ngày sinh</label>
                                <input type="date" className="form-input" placeholder="dd/mm/yyyy"/>
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input type="email" className="form-input"/>
                            </div>
                            <div className="form-group">
                                <label>Mật khẩu</label>
                                <input type="password" className="form-input"/>
                                <small style={{color: '#999', fontSize: '0.8rem', marginTop: '5px', display: 'block'}}>
                                    Bao gồm ít nhất một chữ cái viết hoa.
                                </small>
                            </div>

                            <button type="submit" className="auth-btn">Tạo Ngay</button>

                            <div className="auth-switch">
                                <span>Đã có tài khoản? </span>
                                <a href="/login">Đăng nhập</a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <Footer/>
        </>
    );
};

export default SignUp;