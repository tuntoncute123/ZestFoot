// src/components/Checkout/ProvinceSelector.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { getProvinces, calculateShipping } from '../../services/mapService';
import { MapPin, Truck } from 'lucide-react';

const ProvinceSelector = ({ onShippingChange, orderTotal, selectedProvince: initialProvince }) => {
    const [provinces, setProvinces] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState(initialProvince || '');
    const [loading, setLoading] = useState(false);
    const [shippingInfo, setShippingInfo] = useState(null);

    useEffect(() => {
        getProvinces().then(data => setProvinces(data));
    }, []);

    // Cập nhật state nếu props từ cha thay đổi (ví dụ khi load lại trang)
    useEffect(() => {
        if (initialProvince && initialProvince !== selectedProvince) {
            setSelectedProvince(initialProvince);
        }
    }, [initialProvince]);

    // Hàm gọi API tính phí
    const fetchShippingFee = useCallback(async (provinceName, total) => {
        if (!provinceName) {
            setShippingInfo(null);
            onShippingChange({ address: '', shippingFee: 0, distance: 0 });
            return;
        }

        setLoading(true);
        try {
            const info = await calculateShipping(provinceName, total);
            setShippingInfo(info);
            // Gửi kết quả về cha
            onShippingChange({
                address: provinceName,
                shippingFee: info.fee,
                distance: info.distance
            });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [onShippingChange]);

    // --- SỬA LOGIC Ở ĐÂY: Chỉ set state, KHÔNG gọi fetchShippingFee thủ công ---
    const handleSelectChange = (e) => {
        const provinceName = e.target.value;
        setSelectedProvince(provinceName);
        // Logic tính phí sẽ được useEffect bên dưới bắt được sự thay đổi của selectedProvince và tự chạy
    };

    // Tự động tính lại phí khi [Tỉnh thay đổi] HOẶC [Tổng tiền thay đổi - để check freeship]
    useEffect(() => {
        if (selectedProvince) {
            // Thêm timeout nhỏ để tránh giật lag UI (debounce)
            const timer = setTimeout(() => {
                fetchShippingFee(selectedProvince, orderTotal);
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [orderTotal, selectedProvince, fetchShippingFee]);

    return (
        <div className="form-group">
            <label>Tỉnh / Thành phố (Tính phí vận chuyển)</label>
            <div style={{ position: 'relative' }}>
                <select
                    className="form-control"
                    value={selectedProvince}
                    onChange={handleSelectChange}
                >
                    <option value="">-- Chọn Tỉnh/Thành --</option>
                    {provinces.map((p, index) => (
                        <option key={p.name || index} value={p.name}>{p.name}</option>
                    ))}
                </select>
                <MapPin size={18} style={{ position: 'absolute', right: '30px', top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
            </div>

            {loading && <div style={{fontSize: '0.9rem', color: '#666', marginTop: '5px'}}>Đang tính lại phí vận chuyển...</div>}

            {!loading && shippingInfo && (
                <div style={{
                    marginTop: '10px',
                    padding: '10px',
                    backgroundColor: shippingInfo.fee === 0 ? '#f6ffed' : '#e6f7ff',
                    borderRadius: '4px',
                    border: shippingInfo.fee === 0 ? '1px solid #b7eb8f' : '1px solid #91d5ff',
                    fontSize: '0.9rem',
                    color: shippingInfo.fee === 0 ? '#389e0d' : '#0050b3'
                }}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                        <Truck size={16}/>
                        <strong>
                            Phí vận chuyển: {shippingInfo.fee === 0
                            ? 'MIỄN PHÍ'
                            : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(shippingInfo.fee)
                        }
                        </strong>
                    </div>
                    <div style={{marginLeft: '24px', fontSize: '0.85rem', color: '#555'}}>
                        Khoảng cách: {shippingInfo.distance}km (Từ kho Linh Xuân)<br/>
                        Thời gian dự kiến: {shippingInfo.estimatedDays}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProvinceSelector;