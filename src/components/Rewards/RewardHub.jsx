import React, { useState } from 'react';
import './RewardHub.css';
import DailyCheckIn from './DailyCheckIn';
// Game imports removed for "UI First" phase as requested by user
import { Gamepad2, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../services/supabaseClient';

const RewardHub = () => {
    const { user } = useAuth();
    const [points, setPoints] = useState(200); // Default/Mock

    // Fetch real points if user exists (Quick inline effect)
    React.useEffect(() => {
        if (user) {
            const fetchPoints = async () => {
                const { data } = await supabase.from('profiles').select('points').eq('id', user.id).single();
                if (data) setPoints(data.points);
            };
            fetchPoints();
        }
    }, [user]);

    const handlePlayGame = (gameName) => {
        alert(`Tính năng ${gameName} đang được phát triển!`);
    };

    return (
        <div className="reward-hub-container">
            {/* 1. Header Section */}
            <div className="reward-header">
                <div className="reward-user-info">
                    <div>
                        <div className="accumulated-label">Xu tích lũy</div>
                        <div className="points-display-large">
                            <div className="coin-icon-lg">$</div>
                            <span className="points-value">{points}</span>
                        </div>
                        <div className="expiry-date">Hết hạn: 31-01-2026</div>
                    </div>

                    <div className="user-tier-badge">
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontWeight: 'bold' }}>Thành viên Bạc</div>
                            <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>{user?.email || 'Khách'}</div>
                        </div>
                        <div className="user-avatar-sm" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <User size={18} color="#333" />
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Main Content */}
            <div className="reward-content">
                {/* Check-in Strip */}
                <DailyCheckIn onPointUpdate={(addedPoints) => setPoints(prev => prev + addedPoints)} />

                {/* Game Grid */}
                <div className="games-section">
                    <div className="section-title">
                        <Gamepad2 />
                        <span>Giải trí & Săn quà</span>
                    </div>

                    <div className="games-grid">
                        {/* Game 1: Oẳn Tù Tì */}
                        <div className="game-card bg-green">
                            <div className="game-icon">✊</div>
                            <div className="game-name">Oẳn Tù Tì</div>
                            <div className="game-desc">Thắng máy nhận 200 xu</div>
                            <button className="play-btn" onClick={() => handlePlayGame("Oẳn Tù Tì")}>Chơi ngay</button>
                        </div>

                        {/* Game 2: Ghép Giày */}
                        <div className="game-card bg-yellow">
                            <div className="game-icon">🧩</div>
                            <div className="game-name">Ghép Giày Đôi</div>
                            <div className="game-desc">Săn xu đổi quà</div>
                            <button className="play-btn" onClick={() => handlePlayGame("Ghép Giày")}>Chơi ngay</button>
                        </div>

                        {/* Game 3: Vòng Quay */}
                        <div className="game-card bg-purple">
                            <div className="game-icon">🎡</div>
                            <div className="game-name">Vòng Quay May Mắn</div>
                            <div className="game-desc">100% Trúng thưởng</div>
                            <button className="play-btn" onClick={() => handlePlayGame("Vòng Quay")}>Quay ngay</button>
                        </div>

                        {/* Game 4: Deal (Placeholder) */}
                        <div className="game-card bg-blue">
                            <div className="game-icon">🫧</div>
                            <div className="game-name">Bắt Deal Giờ Vàng</div>
                            <div className="game-desc">Săn kho 1 Triệu Xu</div>
                            <button className="play-btn" onClick={() => handlePlayGame("Bắt Deal")}>Sắp ra mắt</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RewardHub;
