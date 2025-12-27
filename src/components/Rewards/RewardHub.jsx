import React, { useState } from 'react';
import './RewardHub.css';
import DailyCheckIn from './DailyCheckIn';
import LuckyWheel from './LuckyWheel';
import SnakeGame from './SnakeGame';
import ShoeMatchGame from './ShoeMatchGame';
import TetrisGame from './TetrisGame';
import { Gamepad2, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../services/supabaseClient';

const RewardHub = () => {
    const { user } = useAuth();
    const [points, setPoints] = useState(0);
    const [showLuckyWheel, setShowLuckyWheel] = useState(false);
    const [showSnakeGame, setShowSnakeGame] = useState(false);
    const [showShoeMatchGame, setShowShoeMatchGame] = useState(false);
    const [showTetrisGame, setShowTetrisGame] = useState(false);

    // Fetch real points if user exists (Quick inline effect)
    React.useEffect(() => {
        const fetchPoints = async () => {
            if (user) {
                const { data } = await supabase.from('profiles').select('points').eq('id', user.id).single();
                if (data) setPoints(data.points);
            } else {
                setPoints(0);
            }
        };

        fetchPoints();
        window.addEventListener('pointsUpdated', fetchPoints);
        return () => window.removeEventListener('pointsUpdated', fetchPoints);
    }, [user, showLuckyWheel, showSnakeGame, showShoeMatchGame]);

    const handlePlayGame = (gameName) => {
        if (gameName === "Vòng Quay") {
            setShowLuckyWheel(true);
        } else if (gameName === "Rắn Săn Mồi") {
            setShowSnakeGame(true);
        } else if (gameName === "Ghép Giày") {
            setShowShoeMatchGame(true);
        } else if (gameName === "Xếp Gạch") {
            setShowTetrisGame(true);
        } else {
            alert(`Tính năng ${gameName} đang được phát triển!`);
        }
    };

    return (
        <div className="reward-hub-container">
            {/* 1. Header Section */}
            <div className="reward-header">
                {/* ... keep header ... */}
                <div className="reward-user-info">
                    <div>
                        <div className="accumulated-label">Xu tích lũy</div>
                        <div className="points-display-large">
                            <div className="coin-icon-lg">$</div>
                            <span className="points-value">{points}</span>
                        </div>
                        {user && <div className="expiry-date">Hết hạn: 31-01-2026</div>}
                    </div>

                    <div className="user-tier-badge">
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontWeight: 'bold' }}>{user ? 'Thành viên Đồng' : ''}</div>
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
                        {/* Game 1: Rắn Săn Mồi */}
                        <div className="game-card bg-green">
                            <div className="game-icon">🐍</div>
                            <div className="game-name">Rắn Săn Mồi</div>
                            <div className="game-desc">Săn điểm đổi Voucher</div>
                            <button className="play-btn" onClick={() => handlePlayGame("Rắn Săn Mồi")}>Chơi ngay</button>
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

                        {/* Game 4: Tetris */}
                        <div className="game-card bg-blue">
                            <div className="game-icon">🧱</div>
                            <div className="game-name">Xếp Gạch</div>
                            <div className="game-desc">Xếp hình nhận quà</div>
                            <button className="play-btn" onClick={() => handlePlayGame("Xếp Gạch")}>Chơi ngay</button>
                        </div>
                    </div>
                </div>
            </div>

            {showLuckyWheel && <LuckyWheel onClose={() => setShowLuckyWheel(false)} onSpinComplete={() => setShowLuckyWheel(false)} />}
            {showSnakeGame && <SnakeGame onClose={() => setShowSnakeGame(false)} />}
            {showShoeMatchGame && <ShoeMatchGame onClose={() => setShowShoeMatchGame(false)} />}
            {showTetrisGame && <TetrisGame onClose={() => setShowTetrisGame(false)} />}
        </div>
    );
};

export default RewardHub;
