import React from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css';
import { formatCurrency } from '../../utils/format.js';
import { useLanguage } from '../../context/LanguageContext';

const ProductCard = ({ product }) => {
    const { t } = useLanguage();
    return (
        <Link to={`/products/${product.id}`} className="product-card">
            <div className="product-image-container">
                <img src={product.image} alt={product.name} className="product-image" />

                {/* 12.12 Overlay if needed - user sample had it */}
                <div className="overlay-frame">
                    <img src="//abc-mart.com.vn/cdn/shop/files/Frame_12.12_e1130ee7-7228-4486-b037-c8d76cced9b3.png?v=1765419611" alt="frame" className="frame-img" />
                </div>

                <div className="badge-container">
                    {product.badges && product.badges.map((b, i) => (
                        <span key={i} className={`badge ${b.toLowerCase()}`}>{b}</span>
                    ))}
                    {!product.badges && product.isNew && <span className="badge new">{t('new')}</span>}
                    {!product.badges && product.isSale && <span className="badge sale">{t('sale_badge')}</span>}
                </div>
            </div>
            <div className="product-info">
                <h4 className="product-brand">{product.brand}</h4>
                <h3 className="product-name">{product.name}</h3>
                <div className="product-price">
                    {product.salePrice ? (
                        <>
                            <span className="price-current">{formatCurrency(product.salePrice)}</span>
                            <span className="price-old">{formatCurrency(product.price)}</span>
                        </>
                    ) : (
                        <span className="price-current">{formatCurrency(product.price)}</span>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
