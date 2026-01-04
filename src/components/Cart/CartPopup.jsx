import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { X, Minus, Plus, Trash2 } from 'lucide-react';
import './CartPopup.css';

const CartPopup = ({ onClose }) => {
    const { cartItems, removeFromCart, updateQuantity, getCartTotal, getCartCount } = useCart();
    const navigate = useNavigate();
    const [isPaperBag, setIsPaperBag] = useState(false);

    // Stop propagation to prevent closing when clicking inside the popup content
    const handleContentClick = (e) => {
        e.stopPropagation();
    };

    const handleCheckout = () => {
        // Navigate to checkout with all items (or logic can be improved to select all by default)
        // Similar to Cart.jsx passing state
        const itemsToCheckout = cartItems;
        navigate('/checkout', {
            state: {
                fromCart: true,
                selectedItems: itemsToCheckout
            }
        });
        onClose();
    };

    const handleViewCart = () => {
        navigate('/cart');
        onClose();
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    return (
        <div className="cart-popup-overlay" onClick={onClose}>
            <div className="cart-popup-content" onClick={handleContentClick}>
                <div className="cart-popup-header">
                    <h2>GIỎ HÀNG CỦA BẠN ({getCartCount()})</h2>
                    <button className="close-popup-btn" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <div className="cart-popup-body">
                    {cartItems.length === 0 ? (
                        <div className="cart-popup-empty">
                            <p>Giỏ hàng của bạn đang trống.</p>
                            <button className="continue-shopping-btn" onClick={onClose}>Tiếp tục mua sắm</button>
                        </div>
                    ) : (
                        <div className="cart-popup-items">
                            {cartItems.map((item) => {
                                const price = item.product.isSale ? item.product.salePrice : item.product.price;
                                const itemKey = `${item.product.id}-${item.size}`;
                                return (
                                    <div key={itemKey} className="cart-popup-item">
                                        <div className="item-image">
                                            <img src={item.product.image} alt={item.product.name} />
                                        </div>
                                        <div className="item-details">
                                            {item.product.brand && <div className="item-brand">{item.product.brand}</div>}
                                            <div className="item-name">{item.product.name}</div>
                                            <div className="item-options">
                                                {/* If color exists in product data, we could show it here */}
                                                {/* <span>Màu sắc: Nâu / Trắng</span> */}
                                                <span>Kích thước: {item.size}</span>
                                            </div>
                                            <div className="item-price">{formatPrice(price)}</div>

                                            <div className="item-actions-row">
                                                <div className="quantity-control-sm">
                                                    <button
                                                        onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)}
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        <Minus size={14} />
                                                    </button>
                                                    <span>{item.quantity}</span>
                                                    <button onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)}>
                                                        <Plus size={14} />
                                                    </button>
                                                </div>
                                                <button
                                                    className="remove-item-btn"
                                                    onClick={() => removeFromCart(item.product.id, item.size)}
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {cartItems.length > 0 && (
                    <div className="cart-popup-footer">
                        <div className="popup-total">
                            <span>Tổng tiền</span>
                            <span className="total-amount">{formatPrice(getCartTotal())}</span>
                        </div>
                        <p className="popup-note">
                            Thuế, ưu đãi giảm giá và <span className="underline">phí vận chuyển</span> được tính khi thanh toán.
                        </p>

                        <div className="popup-checkbox">
                            <input
                                type="checkbox"
                                id="paperBag"
                                checked={isPaperBag}
                                onChange={(e) => setIsPaperBag(e.target.checked)}
                            />
                            <label htmlFor="paperBag">Bạn có muốn lấy túi giấy không?</label>
                        </div>

                        <div className="popup-buttons">
                            <button className="popup-btn view-cart-btn" onClick={handleViewCart}>
                                Xem Giỏ Hàng
                            </button>
                            <button className="popup-btn checkout-btn" onClick={handleCheckout}>
                                Thanh Toán
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartPopup;
