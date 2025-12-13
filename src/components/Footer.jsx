import React from 'react';
import './Footer.css';
// Lưu ý: Bạn cần thay thế các đường dẫn hình ảnh (src) bằng ảnh thật của dự án
// Ví dụ: logo, icon mạng xã hội, logo bộ công thương

const Footer = () => {
    return (
        <footer className="footer-wrapper">
            <div className="container footer-content">
                {/* CỘT 1: THÔNG TIN CÔNG TY & NEWSLETTER */}
                <div className="footer-column brand-column">
                    <div className="brand-logo">
                        <h2>HKT-SHOES</h2>
                        <span>GROUP 41</span>
                    </div>

                    <h4 className="company-name">SHOP GIÀY HKT-SHOES VIỆT NAM</h4>

                    <div className="company-info">
                        <p>Địa chỉ: Khu phố 33, Phường Linh Xuân, TP. Thủ Đức, TP. Hồ Chí Minh.</p>
                        <p>Email: abcShoes@gmail.com</p>
                    </div>

                    <div className="newsletter-section">
                        <h4>ĐĂNG KÍ HỘI VIÊN NHẬN NGAY ƯU ĐÃI 200K</h4>
                        <form className="newsletter-form">
                            <input type="email" placeholder="Email" />
                            <button type="submit">Gửi</button>
                        </form>
                    </div>
                </div>

                {/* CỘT 2: THÔNG TIN */}
                <div className="footer-column">
                    <h3 className="footer-title">THÔNG TIN</h3>
                    <ul className="footer-links">
                        <li><a href="#">Về chúng tôi</a></li>
                        <li><a href="#">Liên hệ</a></li>
                        <li><a href="#">Hệ thống cửa hàng</a></li>
                        <li><a href="#">Chương trình thành viên</a></li>
                        <li><a href="#">Bài viết</a></li>
                        <li><a href="#">Câu hỏi thường gặp</a></li>
                    </ul>
                </div>

                {/* CỘT 3: MUA SẮM */}
                <div className="footer-column">
                    <h3 className="footer-title">MUA SẮM</h3>
                    <ul className="footer-links">
                        <li><a href="#">Trang chủ</a></li>
                        <li><a href="#">Tìm kiếm</a></li>
                        <li><a href="#">Thương hiệu</a></li>
                        <li><a href="#">Ưu đãi</a></li>
                    </ul>
                </div>

                {/* CỘT 4: CÁC CHÍNH SÁCH */}
                <div className="footer-column">
                    <h3 className="footer-title">CÁC CHÍNH SÁCH</h3>
                    <ul className="footer-links">
                        <li><a href="#">Điều khoản & Điều kiện</a></li>
                        <li><a href="#">Chính sách bán hàng</a></li>
                        <li><a href="#">Chính sách bảo mật</a></li>
                        <li><a href="#">Chính sách vận chuyển</a></li>
                        <li><a href="#">Chính sách kiểm hàng</a></li>
                        <li><a href="#">Chính sách đồng kiểm</a></li>
                        <li><a href="#">Chính sách đổi trả - bảo hành</a></li>
                        <li><a href="#">Phương thức thanh toán</a></li>
                    </ul>
                </div>

                {/* CỘT 5: THEO DÕI */}
                <div className="footer-column social-column">
                    <h3 className="footer-title">THEO DÕI CHÚNG TÔI</h3>
                    <div className="social-links">
                        {/* Thay bằng icon SVG hoặc FontAwesome nếu có */}
                        <a href="#" className="social-icon"><i className="fa-brands fa-facebook"></i></a>
                    <a href="#" className="social-icon"><i className="fa-brands fa-tiktok"></i></a>
                        <a href="#" className="social-icon"><i className="fab fa-instagram"></i></a>
                        <a href="#" className="social-icon"><i className="fa-brands fa-github"></i></a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;