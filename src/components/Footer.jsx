import React from 'react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer-wrapper">
            <div className="container footer-content">
                <div className="footer-section">
                    <h3 className="footer-title">THÔNG TIN</h3>
                    <ul className="footer-links">
                        <li><a href="#">Giới thiệu</a></li>
                        <li><a href="#">Liên hệ</a></li>
                        <li><a href="#">Tuyển dụng</a></li>
                        <li><a href="#">Tin tức</a></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h3 className="footer-title">MUA SẮM</h3>
                    <ul className="footer-links">
                        <li><a href="#">Thương hiệu</a></li>
                        <li><a href="#">Danh mục</a></li>
                        <li><a href="#">Sale</a></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h3 className="footer-title">CÁC CHÍNH SÁCH</h3>
                    <ul className="footer-links">
                        <li><a href="#">Điều khoản sử dụng</a></li>
                        <li><a href="#">Chính sách bảo mật</a></li>
                        <li><a href="#">Chính sách giao hàng</a></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h3 className="footer-title">THEO DÕI CHÚNG TÔI</h3>
                    <div className="social-links">
                        <span className="social-icon">Facebook</span>
                        <span className="social-icon">Instagram</span>
                        <span className="social-icon">Youtube</span>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <p className="container">© 2025 ABC-MART Vietnam. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
