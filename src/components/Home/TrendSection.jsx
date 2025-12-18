import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../ProductCard/ProductCard';
import './TrendSection.css';

const TrendSection = ({ trendingProducts }) => {
    return (
        <section className="section-container trend-section">
            <div className="section-head-top">
                <h2 className="section-title custom-title">
                    XU HƯỚNG TUẦN NÀY
                </h2>
                <div className="collection__view-all">
                    <Link to="/collections/puma" className="link underlined-link" aria-label="Xem toàn bộ sản phẩm trong bộ sưu tập PUMA">
                        <span>Xem thêm</span>
                    </Link>
                </div>
            </div>

            <div className="product-grid-container">
                <div className="collection">
                    <div className="loading-overlay gradient"></div>
                    <ul className="product-grid grid--5-col-desktop">
                        {trendingProducts.map((product) => (
                            <li className="grid__item" key={product.id}>
                                <ProductCard product={product} />
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
};

export default TrendSection;
