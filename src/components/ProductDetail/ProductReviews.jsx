import React, { useState } from 'react';
import './ProductReviews.css';
import { Star, Camera } from 'lucide-react';

const ProductReviews = () => {
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);

    const toggleForm = () => {
        setIsFormVisible(!isFormVisible);
    };

    return (
        <div className="product-reviews-container">
            <h2 className="reviews-title">ĐÁNH GIÁ TỪ KHÁCH HÀNG</h2>

            <div className="reviews-summary">
                <div className="stars-display">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="star-icon-empty" />
                    ))}
                    {!isFormVisible && (
                        <span style={{ marginLeft: '10px', fontSize: '14px', color: '#333' }}>Hãy là người đầu tiên viết đánh giá</span>
                    )}
                </div>

                <button className="cancel-review-btn-black" onClick={toggleForm}>
                    {isFormVisible ? 'Hủy đánh giá' : 'Viết đánh giá'}
                </button>
            </div>

            {isFormVisible && (
                <div className="review-form-container">
                    <div className="review-form">
                        <h3 className="form-title">Viết đánh giá</h3>
                        <p className="form-subtitle">Đánh giá</p>

                        <div className="form-rating">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={`star-icon-large ${star <= (hoverRating || rating) ? 'filled' : ''}`}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    onClick={() => setRating(star)}
                                />
                            ))}
                        </div>

                        <div className="form-group">
                            <label>Tiêu đề Đánh giá</label>
                            <input type="text" placeholder="Đặt tiêu đề cho đánh giá của bạn" />
                        </div>

                        <div className="form-group">
                            <label>Nội dung đánh giá</label>
                            <textarea placeholder="Bắt đầu viết ở đây..."></textarea>
                        </div>

                        <div className="form-group">
                            <label>Hình ảnh/Video (tùy chọn)</label>
                            <div className="media-upload-box">
                                <span className="upload-icon">?</span>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Tên hiển thị (hiển thị công khai như Lọc theo: John Smith )</label>
                            <input type="text" placeholder="Tên hiển thị" />
                        </div>

                        <div className="form-group">
                            <label>Địa chỉ email</label>
                            <input type="email" placeholder="Địa chỉ email của bạn" />
                        </div>

                        <p className="form-disclaimer">
                            Cảm ơn bạn đã dành thời gian chia sẻ trải nghiệm của mình. Ý kiến của bạn rất quý giá với chúng tôi!
                        </p>

                        <div className="form-actions">
                            <button className="btn-cancel" onClick={toggleForm}>Hủy đánh giá</button>
                            <button className="btn-submit">Gửi Đánh giá</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductReviews;
