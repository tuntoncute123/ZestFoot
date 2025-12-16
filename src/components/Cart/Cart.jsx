import React from 'react';
import { useCart } from '../../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Minus, Plus } from 'lucide-react';
import './Cart.css';

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();
    const navigate = useNavigate();
    const total = getCartTotal();

    if (cartItems.length === 0) {
        return (
            <div className="cart-container empty-cart">
                <h2>Giỏ hàng của bạn đang trống</h2>
                <p>Hãy chọn những sản phẩm yêu thích để mua sắm nhé!</p>
                <Link to="/" className="continue-shopping-btn">Tiếp tục mua sắm</Link>
            </div>
        );
    }

    const handleCheckout = () => {
        // Navigate to checkout with cart items if needed, or simply let checkout read from context
        navigate('/checkout', { state: { fromCart: true } });
    };

    return (
        <div className="cart-container">
            <h1 className="cart-title">Giỏ Hàng</h1>

            <div className="cart-content">
                <div className="cart-items">
                    {cartItems.map((item, index) => {
                        const price = item.product.isSale ? item.product.salePrice : item.product.price;
                        return (
                            <div key={`${item.product.id}-${item.size}`} className="cart-item">
                                <Link to={`/products/${item.product.id}`}>
                                    <img src={item.product.image} alt={item.product.name} />
                                </Link>
                                <div className="cart-item-details">
                                    <Link to={`/products/${item.product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                        <div className="item-name">{item.product.name}</div>
                                    </Link>
                                    <div className="item-meta">
                                        Size: {item.size} | {item.product.brand}
                                    </div>
                                    <div className="item-price">
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)}
                                    </div>

                                    <div className="cart-item-actions">
                                        <div className="quantity-control">
                                            <button
                                                className="qty-btn"
                                                onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)}
                                                disabled={item.quantity <= 1}
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className="qty-display">{item.quantity}</span>
                                            <button
                                                className="qty-btn"
                                                onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)}
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                        <button
                                            className="remove-btn"
                                            onClick={() => removeFromCart(item.product.id, item.size)}
                                            title="Xóa sản phẩm"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="cart-summary">
                    <div className="summary-title">Tổng đơn hàng</div>
                    <div className="summary-row">
                        <span>Tạm tính</span>
                        <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total)}</span>
                    </div>
                    <div className="summary-row">
                        <span>Vận chuyển</span>
                        <span>Miễn phí</span>
                    </div>
                    <div className="summary-total summary-row">
                        <span>Thành tiền</span>
                        <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total)}</span>
                    </div>

                    <button className="pay-btn" onClick={handleCheckout}>
                        TIẾN HÀNH THANH TOÁN
                    </button>

                    <div style={{ marginTop: '15px', textAlign: 'center' }}>
                        <Link to="/" style={{ fontSize: '0.9rem', color: '#666', textDecoration: 'underline' }}>
                            Tiếp tục mua sắm
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
