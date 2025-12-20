import React, { useState } from 'react';
import './ChatBot.css';

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    const questions = [
        "Tôi có thể check size sản phẩm của mình ở đâu?",
        "Theo dõi đơn hàng của tôi",
        "Các sản phẩm có phải chính hãng / nguyên bản không?",
        "Có những hình thức thanh toán nào trên trang ?",
        "Thời gian giao hàng bao lâu?",
        "Làm cách nào để theo dõi tình trạng đơn hàng?",
        "Khi sản phẩm tới tay bị hư hỏng thì như thế nào?",
        "Có thể thay đổi địa chỉ sau khi đặt hàng?",
        "Tôi có thể đổi lại các sản phẩm tôi đã mua không?"
    ];

    return (
        <div className="chatbot-container">
            {isOpen && (
                <div className="chatbot-window">
                    <div className="chatbot-header">
                        <h3>Trò chuyện với chúng tôi</h3>
                        <p>Chào mừng bạn đến cửa hàng ABC-Mart Việt Nam. Nhắn tin ngay với chúng tôi để giải đáp thắc mắc của bạn.</p>
                    </div>
                    <div className="chatbot-body">
                        <div className="input-area">
                            <input type="text" placeholder="Viết tin nhắn" />
                            <button className="send-btn">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z" fill="#AAA" />
                                </svg>
                            </button>
                        </div>
                        <div className="faq-section">
                            <h4>Câu trả lời tức thì</h4>
                            <div className="faq-list">
                                {questions.map((q, index) => (
                                    <button key={index} className="faq-item">
                                        {q}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div className="chatbot-toggle" onClick={toggleChat}>
                {isOpen ? (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="white" />
                    </svg>
                ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM6 9H18V11H6V9ZM14 14H6V12H14V14ZM18 8H6V6H18V8Z" fill="white" />
                    </svg>
                )}
            </div>
        </div>
    );
};

export default ChatBot;
