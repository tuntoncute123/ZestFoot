import React from 'react';
import './DailyCheckIn.css';
import { Calendar, Check, Flame, Gift } from 'lucide-react';

const DailyCheckIn = () => {
    // MOCK DATA FOR UI
    const days = [
        { day: 1, points: 100, status: 'checked', label: 'Hôm qua' },
        { day: 2, points: 100, status: 'today', label: 'Hôm nay' },
        { day: 3, points: 100, status: 'future', label: 'Ngày 3' },
        { day: 4, points: 100, status: 'future', label: 'Ngày 4' },
        { day: 5, points: 200, status: 'future', label: 'Ngày 5' },
        { day: 6, points: 200, status: 'future', label: 'Ngày 6' },
        { day: 7, points: 500, status: 'future', icon: <Gift size={20} color="#FBC02D" />, label: 'Ngày 7' },
    ];

    return (
        <div className="daily-checkin-container">
            <div className="checkin-header">
                <Calendar size={20} />
                <span>ĐIỂM DANH HÀNG NGÀY</span>
            </div>

            <div className="days-strip">
                {days.map((item, index) => (
                    <div
                        key={index}
                        className={`day-box ${item.status === 'checked' ? 'checked' : ''} ${item.status === 'today' ? 'today' : ''} ${item.day === 7 ? 'day-7' : ''}`}
                    >
                        {item.status === 'checked' && <Check className="check-icon" size={20} />}
                        {item.status === 'today' && <Flame className="check-icon" size={20} />}
                        {item.day === 7 && item.status === 'future' && <div className="check-icon">{item.icon}</div>}

                        <span className="points">+{item.points}</span>
                        <span className="day-label">{item.label}</span>
                    </div>
                ))}
            </div>

            <div className="checkin-btn-container">
                <button className="checkin-btn">
                    ĐIỂM DANH & NHẬN XU
                </button>
            </div>
        </div>
    );
};

export default DailyCheckIn;
