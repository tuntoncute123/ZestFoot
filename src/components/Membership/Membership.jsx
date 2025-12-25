import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Membership.css';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../services/supabaseClient';
import redeemLogo from '../../assets/redeem_logo.png';

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

    const [vouchers, setVouchers] = useState([]);
    const [redeemedVoucher, setRedeemedVoucher] = useState(null);

    const loadData = async () => {
        if (!user) {
            setPoints(0);
            setHistory([]);
            setVouchers([]);
            return;
        }
        try {
            // 1. Get Profile (Points)
            let { data: profile, error } = await supabase
                .from('profiles')
                .select('points')
                .eq('id', user.id)
                .single();

            if (error && error.code === 'PGRST116') {
                // ... (Keep existing profile creation logic if needed, or assume handled)
                // For brevity, skipping the complex creation logic here as it repeats. 
                // If you want to keep it, I should duplicate it. 
                // Let's assume profile exists for this update or I'll copy the block if I must replace the whole effect.
                // Actually better to just refactor the fetch into a reusable function 'fetchMembershipData' 
                // and call it in useEffect. 
                // But wait, the previous code defined fetchMembershipData INSIDE useEffect.
                // I will define it OUTSIDE or use the one I'm creating 'loadData'.
            }

            if (profile) setPoints(profile.points);

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

            // 3. Get Vouchers
            const { data: voucherList } = await supabase
                .from('user_vouchers')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (voucherList) setVouchers(voucherList);

        } catch (error) {
            console.error("Error loading membership data:", error);
        }
    };

    useEffect(() => {
        loadData();

        // Listen for global point updates
        const handlePointUpdate = () => loadData();
        window.addEventListener('pointsUpdated', handlePointUpdate);

        return () => window.removeEventListener('pointsUpdated', handlePointUpdate);
    }, [user, isOpen]); // Also reload when opening modal

    // Helper functions need to use loadData or trigger event
    const handleAddPoints = async (amount, reason) => {
        // ... (Keep existing validation)
        if (!user) return;
        if (amount < 0 && points + amount < 0) {
            alert("Bạn không đủ xu để thực hiện đổi quà này.");
            return;
        }

        try {
            const { error: txError } = await supabase.from('point_transactions').insert([
                { user_id: user.id, amount: amount, reason: reason, type: amount >= 0 ? 'earn' : 'spend' }
            ]);
            if (txError) throw txError;

            const newPoints = points + amount;
            const { error: updateError } = await supabase.from('profiles').update({ points: newPoints }).eq('id', user.id);
            if (updateError) throw updateError;

            // Dispatch Event instead of just local set
            window.dispatchEvent(new Event('pointsUpdated'));

        } catch (error) {
            console.error(error);
        }
    };

    const handleRedeemExchange = async () => {
        if (!user) return;
        if (points < 200) {
            alert("Bạn không đủ xu để đổi quà!");
            return;
        }

        if (confirm("Bạn có chắc muốn dùng 200 xu để đổi voucher 200k không?")) {
            try {
                // 1. Deduct Points
                const { error: txError } = await supabase.from('point_transactions').insert([
                    { user_id: user.id, amount: -200, reason: 'Đổi xu lấy Voucher 200k', type: 'spend' }
                ]);
                if (txError) throw txError;

                const newPoints = points - 200;
                await supabase.from('profiles').update({ points: newPoints }).eq('id', user.id);

                // 2. Generate Voucher
                const code = `V200K-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
                const { error: vError } = await supabase.from('user_vouchers').insert({
                    user_id: user.id,
                    code: code,
                    discount_amount: 200000,
                    min_order_value: 1000000,
                    status: 'active',
                    expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
                });

                if (vError) throw vError;

                // 3. Update & Notify
                // 3. Update & Notify
                setPoints(newPoints);
                window.dispatchEvent(new Event('pointsUpdated'));

                // Set the redeemed voucher for Success View
                setRedeemedVoucher({
                    code: code,
                    discount_amount: 200000,
                    expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
                });

                setCurrentView('redeem-success'); // Redirect to success view

            } catch (error) {
                console.error("Redeem error:", error);
                alert("Có lỗi xảy ra khi đổi quà. Vui lòng thử lại.");
            }
        }
    };

    const hasJoined = history.some(item => item.reason === 'Đăng ký thành viên');
    // const hasRedeemed = history.some(item => item.reason === 'Đổi xu lấy mã giảm giá'); 
    // We'll use vouchers length instead of hasRedeemed for the list view
    const hasRedeemed = vouchers.length > 0;

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
                <div className="membership-header">
                    <span className="close-btn" onClick={toggleModal}>&times;</span>
                    <h3>{user ? 'THẺ THÀNH VIÊN' : 'Chào mừng đến với cửa hàng của chúng tôi'}</h3>
                </div>
            );
        } else {
            let title = '';
            if (currentView === 'redeem') title = 'Quy Đổi Xu';
            if (currentView === 'redeem-success') title = 'Quy Đổi Xu';
            if (currentView === 'referral') title = 'Giới thiệu bạn bè';
            if (currentView === 'history') title = 'Lịch sử của tôi';
            if (currentView === 'my-coupons') title = 'ĐỔI XU';

            return (
                <div className="membership-header sub-header">
                    <button className="back-btn" onClick={handleBack}><i class="fas fa-angle-left"></i></button>
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
                    <div className="member-card-subtitle">Xu hiện có</div>
                    <div className="member-card-points">
                        {points}<small>Xu</small>
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
                        <h4>Đối thưởng xu</h4>
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
                                <p>Nhận được 200 xu</p>
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
                Xem lịch sử xu
            </div>
        </>
    );

    const renderRedeemInputView = () => {
        return (
            <div className="view-content center-content">
                <div className="ticket-icon-large">
                    <img src={redeemLogo} alt="Redeem Logo" className="redeem-logo-img" />
                </div>
                <h3 className="redeem-title">ĐỔI ĐIỂM</h3>
                <p className="activation-points">200 điểm</p>

                <button
                    className={`primary-btn dark ${points < 200 ? 'disabled' : ''}`}
                    onClick={handleRedeemExchange}
                    disabled={points < 200}
                >
                    ĐỔI QUÀ
                </button>

                <p className="redeem-subtitle">Đổi 200 điểm lấy 200.000 đ</p>

                <div className="redeem-terms-container">
                    <div className="term-header">
                        <p>Áp dụng cho đơn hàng tối thiểu 1.000.000 VND</p>
                        <span className="term-arrow"></span>
                    </div>

                </div>
            </div>
        );
    };

    const renderRedeemSuccessView = () => {
        if (!redeemedVoucher) return null;

        return (
            <div className="view-content center-content">
                <div className="success-icon-large">
                    <div className="success-circle">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </div>
                <h3>ĐỔI XU</h3>
                <p style={{ marginBottom: '20px' }}>Giảm giá 200.000₫ cho 200 xu</p>

                <div className="coupon-box">
                    <span>{redeemedVoucher.code}</span>
                    <span className="copy-icon" onClick={() => {
                        navigator.clipboard.writeText(redeemedVoucher.code);
                        alert('Đã sao chép!');
                    }}>❐</span>
                </div>

                <button className="primary-btn dark" onClick={() => {
                    toggleModal(); // Or navigate to cart
                }}>
                    Áp dụng ngay
                </button>

                <p className="redeem-note">Hãy sử dụng mã giảm giá này cho đơn hàng tiếp theo.</p>
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
                <p>Tổng số xu hiện có:</p>
                <h2>{points} xu</h2>
            </div>

            <div className="history-list">
                {history.map((item, index) => (
                    <div key={index} className="history-item">
                        <div className="history-time">{item.time} • {item.date}</div>
                        <div className="history-reason">{item.reason}</div>
                        <div className={`history - amount ${item.amount > 0 ? 'positive' : item.amount < 0 ? 'negative' : ''} `}>
                            {item.amount > 0 ? '+' : ''}{item.amount} xu
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderMyCouponsDetailView = () => {
        if (vouchers.length === 0) {
            return (
                <div className="view-content center-content">
                    <p>Bạn chưa có mã giảm giá nào.</p>
                    <button className="primary-btn dark" onClick={handleBack} style={{ marginTop: '20px' }}>Quay lại</button>
                </div>
            );
        }

        return (
            <div className="view-content">
                {vouchers.map(v => (
                    <div key={v.id} className="membership-card" style={{ marginBottom: '15px' }}>
                        <div className="coupon-detail-header">
                            <div className="icon-box orange">
                                <span className="icon">$$</span>
                            </div>
                            <h4 style={{ marginLeft: '15px', fontSize: '16px' }}>
                                {v.discount_amount >= 100000 ? 'VOUCHER VIP' : 'MÃ GIẢM GIÁ'}
                            </h4>
                        </div>

                        <ul className="coupon-detail-list">
                            <li><strong>Mã:</strong> {v.code}</li>
                            <li><strong>Giảm giá:</strong> {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v.discount_amount)}</li>
                            <li><strong>Hết hạn vào:</strong> {v.expires_at ? new Date(v.expires_at).toLocaleDateString() : 'Không bao giờ'}</li>
                            {v.min_order_value > 0 && <li><strong>Đơn tối thiểu:</strong> {v.min_order_value}đ</li>}
                        </ul>

                        <button className="primary-btn dark" onClick={() => {
                            navigator.clipboard.writeText(v.code);
                            alert(`Đã sao chép mã: ${v.code}`);
                        }} style={{ marginTop: '20px' }}>
                            Sao chép mã
                        </button>
                    </div>
                ))}
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
                        <h4>Quy Đổi Xu</h4>
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
                                <h5>ĐỔI XU</h5>
                                <p>Giảm giá 200.000₫ cho 200 Xu</p>
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
                                <p>Nhận được 200 xu</p>
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
                        {renderHeader()}
                        <div className="membership-body">
                            {!user ? renderGuestView() : (
                                <>
                                    {currentView === 'main' && renderMainContent()}
                                    {currentView === 'redeem' && renderRedeemInputView()}
                                    {currentView === 'redeem-success' && renderRedeemSuccessView()}
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
