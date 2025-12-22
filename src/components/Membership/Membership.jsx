import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Membership.css';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../services/supabaseClient';

const Membership = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [points, setPoints] = useState(0);
    const [history, setHistory] = useState([]);
    const [currentView, setCurrentView] = useState('main'); // 'main', 'redeem', 'referral', 'history', 'my-coupons'
    const [expandedSections, setExpandedSections] = useState({
        redeem: false,
        earn: false
    });

    useEffect(() => {
        if (!user) {
            setPoints(0);
            setHistory([]);
            return;
        }

        const fetchMembershipData = async () => {
            try {
                // 1. Get Profile (Points)
                let { data: profile, error } = await supabase
                    .from('profiles')
                    .select('points')
                    .eq('id', user.id)
                    .single();

                // If profile doesn't exist (e.g. old user created before trigger), create one
                if (error && error.code === 'PGRST116') {
                    const { data: newProfile, error: createError } = await supabase
                        .from('profiles')
                        .insert([
                            {
                                id: user.id,
                                full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Member',
                                points: 200
                            }
                        ])
                        .select()
                        .single();

                    if (!createError && newProfile) {
                        profile = newProfile;
                        // Log initial bonus
                        await supabase.from('point_transactions').insert([
                            { user_id: user.id, amount: 200, reason: 'Đăng ký thành viên', type: 'earn' }
                        ]);
                    }
                }

                if (profile) {
                    setPoints(profile.points);
                }

                // 2. Get Transaction History
                const { data: transactions } = await supabase
                    .from('point_transactions')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });

                if (transactions) {
                    setHistory(transactions.map(t => ({
                        ...t,
                        date: new Date(t.created_at).toLocaleDateString('vi-VN'),
                        time: new Date(t.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
                    })));
                }

            } catch (error) {
                console.error("Error fetching membership data:", error);
            }
        };

        fetchMembershipData();
    }, [user]);

    const handleAddPoints = async (amount, reason) => {
        if (!user) return;

        // Prevent duplicate 'Đăng ký thành viên' check locally first for UX
        if (reason === 'Đăng ký thành viên' && history.some(item => item.reason === 'Đăng ký thành viên')) {
            return;
        }

        // Prevent negative points if trying to spend more than available
        if (amount < 0 && points + amount < 0) {
            alert("Bạn không đủ điểm để thực hiện đổi quà này.");
            return;
        }

        try {
            // 1. Insert Transaction
            const { error: txError } = await supabase
                .from('point_transactions')
                .insert([
                    { user_id: user.id, amount: amount, reason: reason, type: amount >= 0 ? 'earn' : 'spend' }
                ]);

            if (txError) throw txError;

            // 2. Update Profile Points
            const newPoints = points + amount;
            const { error: updateError } = await supabase
                .from('profiles')
                .update({ points: newPoints, updated_at: new Date() })
                .eq('id', user.id);

            if (updateError) throw updateError;

            // 3. Update Local State (Optimistic or Refetch)
            setPoints(newPoints);

            // Refetch history to safeguard
            const { data: transactions } = await supabase
                .from('point_transactions')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (transactions) {
                setHistory(transactions.map(t => ({
                    ...t,
                    date: new Date(t.created_at).toLocaleDateString('vi-VN'),
                    time: new Date(t.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
                })));
            }

        } catch (error) {
            console.error("Error updating points:", error);
            alert("Có lỗi xảy ra khi cập nhật điểm.");
        }
    };

    const hasJoined = history.some(item => item.reason === 'Đăng ký thành viên');
    const hasRedeemed = history.some(item => item.reason === 'Đổi điểm lấy mã giảm giá');

    const toggleModal = () => {
        setIsOpen(!isOpen);
        if (!isOpen) setCurrentView('main');
    };

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const handleBack = () => {
        setCurrentView('main');
    };

    const handleUseCoupon = () => {
        navigator.clipboard.writeText('JOY-RKKA1FDFGVZU');
        toggleModal(); // Close modal
        navigate('/cart'); // Go to cart
    };

    const renderHeader = () => {
        if (currentView === 'main') {
            return (
                <div className="membership-header main-header">
                    <h4>THẺ THÀNH VIÊN</h4>
                    <p className="points-label">Điểm hiện có điểm</p>
                    <div className="points-display">
                        <h1>{points}</h1>
                        <span>ĐIỂM</span>
                    </div>
                    <p className="username">KHANG</p>
                    <button className="close-btn" onClick={toggleModal}>&times;</button>
                </div>
            );
        } else {
            let title = '';
            if (currentView === 'redeem') title = 'Quy Đổi Điểm';
            if (currentView === 'referral') title = 'Giới thiệu bạn bè';
            if (currentView === 'history') title = 'Lịch sử của tôi';
            if (currentView === 'my-coupons') title = 'ĐỔI ĐIỂM';

            return (
                <div className="membership-header sub-header">
                    <button className="back-btn" onClick={handleBack}>&larr;</button>
                    <h3>{title}</h3>
                    <button className="close-btn" onClick={toggleModal}>&times;</button>
                </div>
            );
        }
    };

    const renderMainContent = () => (
        <>
            {/* Member Info Card - NEW */}
            <div className="member-info-card">
                <div>
                    <div className="member-card-title">THẺ THÀNH VIÊN</div>
                    <div className="member-card-subtitle">Điểm hiện có</div>
                    <div className="member-card-points">
                        {points}<small>ĐIỂM</small>
                    </div>
                </div>
                <div className="member-card-name">
                    {user?.lastName || user?.user_metadata?.last_name || 'KHÁCH HÀNG'}
                </div>
            </div>

            <div className="membership-grid">
                {/* Redeem Points Section */}
                <div className="membership-card clickable-card grid-item" onClick={() => setCurrentView('redeem')}>
                    <div className="card-header-column">
                        <div className="icon-box-small green">
                            <span className="icon">P</span>
                        </div>
                        <h4>Đối điểm thưởng điểm</h4>
                        <span className="arrow-right">&rsaquo;</span>
                    </div>
                </div>

                {/* My Coupons Section - NEW */}
                <div className="membership-card clickable-card grid-item" onClick={() => setCurrentView('my-coupons')}>
                    <div className="card-header-column">
                        <div className="icon-box-small pink">
                            <span className="icon">%</span>
                        </div>
                        <h4>Mã giảm giá của tôi</h4>
                        <span className="arrow-right">&rsaquo;</span>
                    </div>
                </div>
            </div>

            {/* Earn Points Section */}
            <div className="membership-card clickable-card">
                <div className="card-header" onClick={() => toggleSection('earn')}>
                    <div>
                        <p className="subtitle-text">1 chương trình</p>
                    </div>
                    <span className={`arrow - icon ${expandedSections.earn ? 'expanded' : ''} `}>
                        <svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11 1L6 6L1 1" stroke="#333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </span>
                </div>
                {expandedSections.earn && (
                    <div className="card-content">
                        <div className="reward-item" onClick={() => !hasJoined && handleAddPoints(200, 'Đăng ký thành viên')}>
                            <div className="icon-box blue">
                                <span className="icon">👤</span>
                            </div>
                            <div className="reward-info">
                                <h5>Đăng ký thành viên</h5>
                                <p>Nhận được 200 điểm</p>
                            </div>
                            {hasJoined && <div className="check-mark">✓</div>}
                        </div>
                    </div>
                )}
            </div>

            {/* Referral Section */}
            <div className="membership-card clickable-card" onClick={() => setCurrentView('referral')}>
                <div className="card-header">
                    <div>
                        <h4>Giới thiệu bạn bè</h4>
                        <p className="subtitle-text">Nhận voucher 10%</p>
                    </div>
                    <span className="arrow-icon">
                        <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 9L5 5L1 1" stroke="#333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </span>
                </div>
            </div>

            {/* History Link */}
            <div className="history-link" onClick={() => setCurrentView('history')}>
                Xem lịch sử điểm
            </div>
        </>
    );

    const renderRedeemView = () => {
        if (hasRedeemed) {
            return (
                <div className="view-content center-content">
                    <div className="success-icon-large">
                        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="12" fill="#E8F5E9" />
                            <path d="M7 12L10 15L17 8" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <h3>ĐỔI ĐIỂM</h3>
                    <p style={{ marginBottom: '20px' }}>Giảm giá 200.000₫ cho 200 điểm</p>

                    <div className="coupon-box">
                        <span>JOY-RKKA1FDFGVZU</span>
                        <span className="copy-icon">❐</span>
                    </div>

                    <button className="primary-btn dark" onClick={() => {
                        toggleModal();
                        // Optional: Navigate to products or just close
                    }}>
                        Áp dụng ngay
                    </button>

                    <p className="redeem-note">Hãy sử dụng mã giảm giá này cho đơn hàng tiếp theo.</p>
                </div>
            );
        }

        return (
            <div className="view-content center-content">
                <div className="coupon-icon-large">
                    <div className="icon-box orange large">
                        <span className="icon">$$</span>
                    </div>
                </div>
                <h3>ĐỔI ĐIỂM</h3>
                <p className="points-req">200 điểm</p>

                <button
                    className={`primary - btn ${points < 200 ? 'disabled' : ''} `}
                    onClick={() => {
                        if (points >= 200) {
                            handleAddPoints(-200, 'Đổi điểm lấy mã giảm giá');
                        }
                    }}
                    disabled={points < 200}
                >
                    ĐỔI QUÀ
                </button>

                <p className="redeem-detail-text">Đổi 200 điểm lấy 200.000 đ</p>

                <div className="redeem-terms">
                    <p>Áp dụng cho đơn hàng tối thiểu 1000000 VND</p>
                </div>
            </div>
        );
    };

    const renderReferralView = () => (
        <div className="view-content center-content">
            <div className="heart-icon-large">
                ❤️
            </div>
            <h3>Giới Thiệu Bạn Bè</h3>
            <p className="refer-desc-large">
                Giới thiệu bạn bè cùng trở thành thành viên ABC-MART để nhận ngay voucher ưu đãi 10%
            </p>

            <div className="referral-link-box">
                https://hkt-shoes.com?referralCode=zDie
            </div>

            <button className="primary-btn dark" onClick={() => handleAddPoints(0, 'Nhận Voucher 10% (Giới thiệu)')}>
                Sao chép liên kết mời
            </button>

            <p className="refer-status">Bạn đã giới thiệu 0 người bạn</p>
        </div>
    );

    const renderHistoryView = () => (
        <div className="view-content">
            <div className="history-summary-card">
                <p>Tổng số điểm hiện có:</p>
                <h2>{points} điểm</h2>
            </div>

            <div className="history-list">
                {history.map((item, index) => (
                    <div key={index} className="history-item">
                        <div className="history-time">{item.time} • {item.date}</div>
                        <div className="history-reason">{item.reason}</div>
                        <div className={`history - amount ${item.amount > 0 ? 'positive' : item.amount < 0 ? 'negative' : ''} `}>
                            {item.amount > 0 ? '+' : ''}{item.amount} điểm
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderMyCouponsDetailView = () => {
        if (!hasRedeemed) {
            return (
                <div className="view-content center-content">
                    <p>Bạn chưa có mã giảm giá nào.</p>
                    <button className="primary-btn dark" onClick={handleBack} style={{ marginTop: '20px' }}>Quay lại</button>
                </div>
            );
        }

        return (
            <div className="view-content">
                <div className="membership-card">
                    <div className="coupon-detail-header">
                        <div className="icon-box orange">
                            <span className="icon">$$</span>
                        </div>
                        <h4 style={{ marginLeft: '15px', fontSize: '16px' }}>ĐỔI ĐIỂM</h4>
                    </div>

                    <ul className="coupon-detail-list">
                        <li><strong>Mã:</strong> JOY-RKKA1FDFGVZU</li>
                        <li><strong>Giảm giá:</strong> 200.000₫</li>
                        <li><strong>Hết hạn vào:</strong> Không bao giờ hết hạn</li>
                        <li><strong>Áp dụng cho đơn hàng tối thiểu:</strong> 1000000 VND</li>
                        <li><strong>Áp dụng cho các bộ sưu tập:</strong> Tất cả sản phẩm trừ BST Limited/Speedcat</li>
                    </ul>

                    <button className="primary-btn dark" onClick={handleUseCoupon} style={{ marginTop: '20px' }}>
                        Sử dụng ngay
                    </button>
                </div>
            </div>
        );
    };

    const renderGuestView = () => (
        <>
            {/* Card 1: Join Program */}
            <div className="membership-card main-card">
                <h4>THẺ THÀNH VIÊN</h4>
                <p>Nhận ưu đãi độc quyền từ chương trình khách hàng thân thiết của chúng tôi</p>
                <button
                    className="join-btn"
                    onClick={() => {
                        setIsOpen(false);
                        navigate('/register');
                    }}
                >
                    Tham gia chương trình
                </button>
                <div className="login-text">
                    Bạn đã là thành viên?
                    <span
                        style={{ color: 'black', textDecoration: 'underline', cursor: 'pointer', marginLeft: '5px', fontWeight: 'bold' }}
                        onClick={() => {
                            setIsOpen(false);
                            navigate('/login');
                        }}
                    >
                        Đăng nhập
                    </span>
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
        </>
    );

    return (
        <div className="membership-container">
            {/* Modal */}
            {isOpen && (
                <div className="membership-modal-overlay">
                    <div className="membership-modal">
                        <div className="membership-header">
                            <span className="close-btn" onClick={toggleModal}>&times;</span>
                            <h3>{user ? 'THẺ THÀNH VIÊN' : 'Chào mừng đến với cửa hàng của chúng tôi'}</h3>
                        </div>
                        <div className="membership-body">
                            {!user ? renderGuestView() : (
                                <>
                                    {currentView === 'main' && renderMainContent()}
                                    {currentView === 'redeem' && renderRedeemView()}
                                    {currentView === 'referral' && renderReferralView()}
                                    {currentView === 'history' && renderHistoryView()}
                                    {currentView === 'my-coupons' && renderMyCouponsDetailView()}
                                </>
                            )}
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
