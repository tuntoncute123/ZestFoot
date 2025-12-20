import React, { useState } from 'react';
import './Membership.css';

const Membership = () => {
    const [isOpen, setIsOpen] = useState(false);

    const [expandedSections, setExpandedSections] = useState({
        redeem: false,
        earn: false
    });

    const toggleModal = () => {
        setIsOpen(!isOpen);
    };

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    return (
        <div className="membership-container">
            {/* Modal */}
            {isOpen && (
                <div className="membership-modal-overlay">
                    <div className="membership-modal">
                        <div className="membership-header">
                            <div className="header-content">
                                <h3>Chào mừng đến với cửa hàng của chúng tôi</h3>
                            </div>
                            <button className="close-btn" onClick={toggleModal}>&times;</button>
                        </div>

                        <div className="membership-body">
                            {/* Card 1: Join Program */}
                            <div className="membership-card main-card">
                                <h4>THẺ THÀNH VIÊN</h4>
                                <p>Nhận ưu đãi độc quyền từ chương trình khách hàng thân thiết của chúng tôi</p>
                                <button className="join-btn">Tham gia chương trình</button>
                                <div className="login-text">
                                    Bạn đã là thành viên? <a href="/login">Đăng nhập</a>
                                </div>
                            </div>

                            {/* Card 2: Redeem Points - Collapsible */}
                            <div className="membership-card clickable-card" onClick={() => toggleSection('redeem')}>
                                <div className="card-header">
                                    <div>
                                        <h4>Quy Đổi Điểm</h4>
                                        <p className="subtitle-text">1 giảm giá</p>
                                    </div>
                                    <span className={`arrow-icon ${expandedSections.redeem ? 'expanded' : ''}`}>
                                        <svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M11 1L6 6L1 1" stroke="#333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </span>
                                </div>
                                {expandedSections.redeem && (
                                    <div className="card-content">
                                        <div className="reward-item">
                                            <div className="icon-box orange">
                                                <span className="icon">$</span>
                                            </div>
                                            <div className="reward-info">
                                                <h5>ĐỔI ĐIỂM</h5>
                                                <p>Giảm giá 200.000₫ cho 200 điểm</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Card 3: Earn Points - Collapsible */}
                            <div className="membership-card clickable-card" onClick={() => toggleSection('earn')}>
                                <div className="card-header">
                                    <div>
                                        <h4>Tham Gia Nhận Thưởng</h4>
                                        <p className="subtitle-text">1 chương trình</p>
                                    </div>
                                    <span className={`arrow-icon ${expandedSections.earn ? 'expanded' : ''}`}>
                                        <svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M11 1L6 6L1 1" stroke="#333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </span>
                                </div>
                                {expandedSections.earn && (
                                    <div className="card-content">
                                        <div className="reward-item">
                                            <div className="icon-box blue">
                                                <span className="icon">👤</span>
                                            </div>
                                            <div className="reward-info">
                                                <h5>Đăng ký thành viên</h5>
                                                <p>Nhận được 200 điểm</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Card 4: Refer Friends */}
                            <div className="membership-card">
                                <div className="card-header">
                                    <h4>Giới thiệu bạn bè</h4>
                                </div>
                                <p className="refer-desc">Giới thiệu bạn bè mua hàng và cả hai bạn sẽ nhận được phần thưởng.</p>
                                <div className="refer-rewards">
                                    <div className="refer-item">
                                        <div className="icon-box purple">
                                            <span className="icon">%</span>
                                        </div>
                                        <div className="refer-info">
                                            <h5>Bạn nhận được</h5>
                                            <p>10% phiếu giảm giá</p>
                                        </div>
                                    </div>
                                    <div className="refer-item">
                                        <div className="icon-box purple">
                                            <span className="icon">%</span>
                                        </div>
                                        <div className="refer-info">
                                            <h5>Bạn của bạn nhận được</h5>
                                            <p>10% phiếu giảm giá</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="membership-toggle" onClick={toggleModal}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 12V22H4V12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M22 7H2V12H22V7Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 22V7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 7H7.5C6.83696 7 6.20107 6.73661 5.73223 6.26777C5.26339 5.79893 5 5.16304 5 4.5C5 3.83696 5.26339 3.20107 5.73223 2.73223C6.20107 2.26339 6.83696 2 7.5 2C11 2 12 7 12 7Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 7H16.5C17.163 7 17.7989 6.73661 18.2678 6.26777C18.7366 5.79893 19 5.16304 19 4.5C19 3.83696 18.7366 3.20107 18.2678 2.73223C17.7989 2.26339 17.163 2 16.5 2C13 2 12 7 12 7Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
        </div>
    );
};

export default Membership;
