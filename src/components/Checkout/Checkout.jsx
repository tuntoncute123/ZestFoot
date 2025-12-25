// src/components/Checkout/Checkout.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { processPayment } from '../../services/paymentService';
import { supabase } from '../../services/supabaseClient';
import './Checkout.css';
import { CreditCard, Truck, Wallet, Tag } from 'lucide-react';
import ProvinceSelector from './ProvinceSelector';

const Checkout = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { cartItems, clearCart } = useCart(); // Bỏ getCartTotal vì ta tự tính lại
    const { user } = useAuth();

    // Lấy thông tin sản phẩm từ state truyền sang
    const product = state?.product;
    const size = state?.size;
    const quantity = state?.quantity || 1;
    const fromCart = state?.fromCart;
    const selectedItemsFromCart = state?.selectedItems; // <-- NHẬN ITEM ĐƯỢC CHỌN

    // --- LOGIC QUAN TRỌNG: Xác định danh sách sản phẩm cần thanh toán ---
    // 1. Nếu từ Cart và có danh sách chọn -> Dùng danh sách chọn
    // 2. Nếu từ Cart nhưng không có danh sách chọn (fallback) -> Dùng toàn bộ cartItems
    // 3. Nếu mua ngay (Buy Now) -> Tạo mảng chứa 1 sản phẩm
    const checkoutItems = fromCart
        ? (selectedItemsFromCart || cartItems)
        : [{ product, size, quantity }];

    // --- TÍNH LẠI TỔNG TIỀN (SUBTOTAL) ---
    // Phải tính lại dựa trên checkoutItems vì getCartTotal() trong context sẽ tính hết cả giỏ
    const subTotal = checkoutItems.reduce((total, item) => {
        const price = item.product.isSale ? item.product.salePrice : item.product.price;
        return total + (price * item.quantity);
    }, 0);
    // -------------------------------------

    // ... PHẦN CÒN LẠI GIỮ NGUYÊN ...

    // --- LOGIC MÃ GIẢM GIÁ ---
    const [couponCode, setCouponCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [couponMsg, setCouponMsg] = useState('');

    const handleApplyCoupon = () => {
        if (!couponCode) return;
        const code = couponCode.toUpperCase().trim();

        if (code === 'HKTSHOES') {
            const val = subTotal * 0.1;
            setDiscount(val);
            setCouponMsg(`Áp dụng thành công! Giảm ${new Intl.NumberFormat('vi-VN').format(val)}đ`);
        } else if (code === 'GIAM50K') {
            setDiscount(50000);
            setCouponMsg('Áp dụng thành công! Giảm 50.000đ');
        } else if (code === 'JOY-RKKA1FDFGVZU') {
            setDiscount(200000);
            setCouponMsg('Áp dụng thành công! Giảm 200.000đ');
        } else {
            setDiscount(0);
            setCouponMsg('Mã giảm giá không hợp lệ hoặc đã hết hạn.');
        }
    };

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '', phone: '', detailAddress: '', province: '', email: ''
    });
    const [shippingFee, setShippingFee] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [error, setError] = useState('');

    const [availablePoints, setAvailablePoints] = useState(0);
    const [usePoints, setUsePoints] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                fullName: (user.lastName || '') + ' ' + (user.firstName || ''),
                email: user.email || '',
            }));

            // Fetch points
            const fetchPoints = async () => {
                const { data } = await supabase.from('profiles').select('points').eq('id', user.id).single();
                if (data) setAvailablePoints(data.points);
            };
            fetchPoints();
        }
    }, [user]);

    if ((!product && !fromCart) || checkoutItems.length === 0) return null; // Check thêm checkoutItems.length

    // Tính toán giảm giá từ điểm
    // 1 Xu = 1000 VND
    // Logic: Dùng toàn bộ xu, nhưng không vượt quá số tiền phải thanh toán
    let pointDiscount = 0;
    if (usePoints && availablePoints > 0) {
        const amountToCover = subTotal + shippingFee - discount; // Số tiền còn lại sau coupon
        const maxPointValue = availablePoints * 1000;

        pointDiscount = Math.min(maxPointValue, amountToCover);
        if (pointDiscount < 0) pointDiscount = 0;
    }

    const totalAmount = subTotal + shippingFee - discount - pointDiscount;
    const finalTotal = totalAmount > 0 ? totalAmount : 0;

    const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleShippingChange = useCallback((data) => {
        setFormData(prev => {
            if (prev.province === data.address) return prev;
            return { ...prev, province: data.address || '' };
        });
        setShippingFee(prevFee => {
            if (prevFee === data.shippingFee) return prevFee;
            return data.shippingFee;
        });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!formData.fullName || !formData.phone || !formData.detailAddress || !formData.province) {
            setError('Vui lòng điền đầy đủ thông tin giao hàng.');
            return;
        }

        setLoading(true);
        try {
            const fullAddress = `${formData.detailAddress}, ${formData.province}`;
            const orderData = {
                customer: {
                    fullName: formData.fullName,
                    phone: formData.phone,
                    email: formData.email,
                    address: fullAddress
                },
                items: checkoutItems.map(item => ({
                    product_id: item.product.id,
                    product_name: item.product.name,
                    price: item.product.isSale ? item.product.salePrice : item.product.price,
                    quantity: item.quantity,
                    size: item.size,
                    image: item.product.image
                })),
                sub_total: subTotal,
                shipping_fee: shippingFee,
                discount: discount,
                total_amount: finalTotal,
                payment_method: paymentMethod,
                status: 'pending'
            };





            // ... inside checkout component ...

            if (paymentMethod === 'cod') {
                await processPayment(orderData, 'cod');

                // --- XỬ LÝ TRỪ ĐIỂM NẾU CÓ DÙNG ---
                if (usePoints && pointDiscount > 0 && user) {
                    const pointsUsed = Math.ceil(pointDiscount / 1000);
                    try {
                        const { error: deductError } = await supabase.rpc('decrement_points', {
                            // Nếu không có function RPC, dùng update tay (kém an toàn hơn chút nhưng ok cho demo)
                            // Ta dùng update tay ở bước dưới cho đơn giản vì chưa tạo RPC
                        });

                        // Update tay:
                        // 1. Get curent (again for safety? or trust local?) - Trust local for speed/demo
                        const newBalance = availablePoints - pointsUsed;
                        await supabase.from('profiles').update({ points: newBalance }).eq('id', user.id);

                        // 2. Log spend transaction
                        await supabase.from('point_transactions').insert([{
                            user_id: user.id,
                            amount: -pointsUsed, // Âm để thể hiện chi tiêu? Hoặc dương với type='spend'. Schema check 'spend'
                            // Schema DB: amount integer. type in ('earn', 'spend'). 
                            // Usually 'spend' implies positive amount spent. Let's use positive amount and type='spend'.
                            // Wait, previous code used negative for spend? 
                            // Let's check handleAddPoints in Membership.jsx: 
                            // handleAddPoints(-200, ...) -> insert amount: -200, type: 'spend'.
                            // So we should insert NEGATIVE number.
                            amount: -pointsUsed,
                            reason: `Dùng Xu thanh toán đơn hàng`,
                            type: 'spend'
                        }]);

                    } catch (err) {
                        console.error("Lỗi trừ điểm:", err);
                    }
                }
                // -----------------------------------

                // --- TÍCH ĐIỂM THÀNH VIÊN (NEW) ---
                if (user) {
                    try {
                        // Quy đổi điểm: 10,000 VND = 1 điểm (Tương đương 3,000,000 = 300 điểm)
                        // Công thức: total_amount / 10000
                        const pointsEarned = Math.floor(finalTotal / 10000);

                        if (pointsEarned > 0) {
                            // 1. Lấy điểm hiện tại
                            const { data: profile } = await supabase
                                .from('profiles')
                                .select('points')
                                .eq('id', user.id)
                                .single();

                            const currentPoints = profile ? profile.points : 0;
                            const newPoints = currentPoints + pointsEarned;

                            // 2. Cập nhật điểm mới
                            await supabase
                                .from('profiles')
                                .update({ points: newPoints, updated_at: new Date() })
                                .eq('id', user.id);

                            // 3. Ghi lịch sử giao dịch
                            await supabase
                                .from('point_transactions')
                                .insert([
                                    {
                                        user_id: user.id,
                                        amount: pointsEarned,
                                        reason: `Tích điểm đơn hàng #${Date.now().toString().slice(-6)}`,
                                        type: 'earn'
                                    }
                                ]);

                            console.log(`Đã tích ${pointsEarned} điểm cho user ${user.id}`);
                        }
                    } catch (pointError) {
                        console.error("Lỗi tích điểm:", pointError);
                        // Không chặn luồng thanh toán chính nếu lỗi tích điểm
                    }
                }
                // ------------------------------------

                // LƯU Ý: Nếu chỉ thanh toán 1 phần, ta không nên clearCart() toàn bộ.
                // Tuy nhiên, context hiện tại của bạn chỉ có clearCart().
                // Để đơn giản, nếu mua từ giỏ (dù chọn ít hay nhiều), tạm thời ta vẫn clearCart()
                // (Hoặc bạn cần viết thêm hàm removeMultipleFromCart trong Context để chỉ xóa món đã mua)
                if (fromCart) clearCart();

                setSuccess(true);
            } else {
                const fakeParams = new URLSearchParams({
                    amount: finalTotal,
                    orderId: Date.now(),
                    orderInfo: `Thanh toan don hang ${formData.phone}`,
                    bankCode: paymentMethod === 'vnpay' ? 'NCB' : '',
                }).toString();
                navigate(`/payment-gateway/${paymentMethod}?${fakeParams}`, { state: { orderData, fromCart } });
            }
        } catch (err) {
            console.error("Checkout Error:", err);
            setError(`Có lỗi xảy ra: ${err.message || 'Vui lòng thử lại.'}`);
            // Check if it might be a connection error
            if (err.message && err.message.includes('Failed to fetch')) {
                setError('Lỗi kết nối mạng. Vui lòng kiểm tra đường truyền.');
            }
        } finally {
            if (paymentMethod === 'cod') setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="checkout-container success-message">
                <div>
                    <h2 style={{ color: 'green' }}>Đặt hàng thành công!</h2>
                    <p>Cảm ơn bạn đã mua hàng.</p>
                    <button className="pay-btn" onClick={() => navigate('/')} style={{ marginTop: '20px', width: 'auto' }}>Tiếp tục mua sắm</button>
                </div>
            </div>
        );
    }

    return (
        <div className="checkout-container">
            <div className="checkout-form">
                <h2>Thông tin giao hàng</h2>
                <form id="checkoutForm" onSubmit={handleSubmit}>
                    <div className="form-group"><label>Họ và tên</label><input type="text" name="fullName" className="form-control" value={formData.fullName} onChange={handleInputChange} /></div>
                    <div className="form-group"><label>Số điện thoại</label><input type="text" name="phone" className="form-control" value={formData.phone} onChange={handleInputChange} /></div>
                    <div className="form-group"><label>Email</label><input type="email" name="email" className="form-control" value={formData.email} onChange={handleInputChange} /></div>
                    <div className="form-group"><label>Địa chỉ chi tiết</label><input type="text" name="detailAddress" className="form-control" value={formData.detailAddress} onChange={handleInputChange} placeholder="Số nhà, đường, phường/xã..." /></div>

                    <ProvinceSelector
                        onShippingChange={handleShippingChange}
                        orderTotal={subTotal}
                        selectedProvince={formData.province}
                    />

                    <h2>Phương thức thanh toán</h2>
                    <div className="payment-methods">
                        <div className={`payment-method-item ${paymentMethod === 'cod' ? 'active' : ''}`} onClick={() => setPaymentMethod('cod')}>
                            <Truck size={20} style={{ marginRight: '10px' }} /><span>COD</span>
                        </div>
                        <div className={`payment-method-item ${paymentMethod === 'momo' ? 'active' : ''}`} onClick={() => setPaymentMethod('momo')}>
                            <Wallet size={20} style={{ marginRight: '10px', color: '#af2070' }} /><span>Ví MoMo</span>
                        </div>
                        <div className={`payment-method-item ${paymentMethod === 'vnpay' ? 'active' : ''}`} onClick={() => setPaymentMethod('vnpay')}>
                            <CreditCard size={20} style={{ marginRight: '10px', color: '#005ba3' }} /><span>VNPAY-QR</span>
                        </div>
                    </div>
                </form>
            </div>

            <div className="checkout-summary">
                <h2>Đơn hàng ({checkoutItems.length} món)</h2>
                <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '20px' }}>
                    {checkoutItems.map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                            <img src={item.product.image} alt={item.product.name} style={{ width: '60px', height: '60px', objectFit: 'cover' }} />
                            <div>
                                <div style={{ fontWeight: '500' }}>{item.product.name}</div>
                                <div style={{ color: '#777', fontSize: '0.85rem' }}>Size: {item.size} x {item.quantity}</div>
                                <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                                        (item.product.isSale ? item.product.salePrice : item.product.price) * item.quantity
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="form-group" style={{ marginBottom: '15px', padding: '15px', background: '#f5f5f5', borderRadius: '6px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'bold' }}><Tag size={16} /> Mã giảm giá</label>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Nhập: HKTSHOES hoặc GIAM50K"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                        />
                        <button
                            type="button"
                            onClick={handleApplyCoupon}
                            style={{ whiteSpace: 'nowrap', padding: '0 15px', backgroundColor: '#333', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                        >
                            Áp dụng
                        </button>
                    </div>
                    {couponMsg && <div style={{ fontSize: '0.85rem', marginTop: '8px', color: discount > 0 ? 'green' : 'red' }}>{couponMsg}</div>}
                    {couponMsg && <div style={{ fontSize: '0.85rem', marginTop: '8px', color: discount > 0 ? 'green' : 'red' }}>{couponMsg}</div>}
                </div>

                {/* Point Redemption UI */}
                {user && (
                    <div className="form-group" style={{ marginBottom: '15px', padding: '15px', background: '#fffde7', borderRadius: '6px', border: '1px solid #FFEB3B' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'bold', color: '#FBC02D' }}>
                                <div style={{ width: '20px', height: '20px', background: '#FBC02D', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>$</div>
                                Dùng Xu tích lũy
                            </label>
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    checked={usePoints}
                                    onChange={() => setUsePoints(!usePoints)}
                                    disabled={availablePoints <= 0}
                                />
                                <span className="slider round"></span>
                            </label>
                        </div>
                        <div style={{ marginTop: '10px', fontSize: '0.9rem' }}>
                            Bạn có: <strong>{availablePoints} Xu</strong>
                        </div>
                        {usePoints && availablePoints > 0 && (
                            <div style={{ marginTop: '5px', fontSize: '0.85rem', color: 'green' }}>
                                Đã dùng {Math.min(availablePoints, Math.ceil((subTotal + shippingFee - discount) / 1000))} Xu
                                (-{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Math.min(availablePoints * 1000, subTotal + shippingFee - discount))})
                            </div>
                        )}
                    </div>
                )}

                <div className="summary-row"><span>Tạm tính</span><span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(subTotal)}</span></div>

                <div className="summary-row">
                    <span>Phí vận chuyển</span>
                    <span style={{ color: shippingFee === 0 ? 'green' : 'black', fontWeight: shippingFee === 0 ? 'bold' : 'normal' }}>
                        {shippingFee === 0 ? 'Miễn phí' : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(shippingFee)}
                    </span>
                </div>

                {discount > 0 && (
                    <div className="summary-row" style={{ color: 'green' }}>
                        <span>Giảm giá (Coupon)</span>
                        <span>-{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(discount)}</span>
                    </div>
                )}
                {pointDiscount > 0 && (
                    <div className="summary-row" style={{ color: '#FBC02D', fontWeight: 'bold' }}>
                        <span>Giảm giá (Xu)</span>
                        <span>-{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(pointDiscount)}</span>
                    </div>
                )}

                <div className="summary-total summary-row">
                    <span>Tổng cộng</span>
                    <span style={{ color: '#d0021b' }}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(finalTotal)}</span>
                </div>

                {error && <div className="error-msg">{error}</div>}
                <button type="submit" form="checkoutForm" className="pay-btn" disabled={loading}>
                    {loading ? 'Đang xử lý...' : 'Thanh toán'}
                </button>
            </div>
        </div>
    );
};

export default Checkout;