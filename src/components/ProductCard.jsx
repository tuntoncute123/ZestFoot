import React from 'react';
import './ProductCard.css';
import { formatCurrency } from '../utils/format';

const ProductCard = ({ product }) => {
    return (
        <div className="product-card">
            <div className="product-image-container">
                <img src={product.image} alt={product.name} className="product-image" />
                {product.isNew && <span className="badge new">NEW</span>}
                {product.isSale && <span className="badge sale">SALE</span>}
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
        </div>
    );
};

export default ProductCard;
