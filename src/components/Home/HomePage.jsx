import React, { useEffect, useState } from 'react';
import BannerCarousel from '../Banner/BannerCarousel';
import ProductCard from '../ProductCard/ProductCard';
import ProductCarousel from '../ProductCarousel';
import SocialNewsSection from '../SocialNews/SocialNewsSection';
import { getBrands, getNewArrivals, getSaleProducts, getAsicsProducts, getTrendingProducts } from '../../services/api';
import TrendSection from './TrendSection';
import ScrollingLogos from './ScrollingLogos';
import ScrollingPromotion from './ScrollingPromotion';
import './HomePage.css';

import { useLanguage } from '../../context/LanguageContext';

const HomePage = () => {
    const { t } = useLanguage();
    const [brands, setBrands] = useState([]);
    const [newArrivals, setNewArrivals] = useState([]);
    const [saleProducts, setSaleProducts] = useState([]);
    const [asicsProducts, setAsicsProducts] = useState([]);
    const [trendingProducts, setTrendingProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch all data in parallel for efficiency
                const [brandsData, newData, saleData, asicsData, trendingData] = await Promise.all([
                    getBrands(),
                    getNewArrivals(),
                    getSaleProducts(),
                    getAsicsProducts(),
                    getTrendingProducts()
                ]);

                setBrands(brandsData);
                setNewArrivals(newData);
                setSaleProducts(saleData);
                setAsicsProducts(asicsData);
                setTrendingProducts(trendingData);
            } catch (error) {
                console.error("Failed to fetch home page data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="spinner"></div>
                <p>Đang tải...</p>
            </div>
        );
    }

    return (
        <>
            {/* Hero Carousel */}
            <BannerCarousel />

            <main>
                {/* Brand Section */}
                <section className="section-container">
                    <h2 className="section-title">{t('featured_brands')}</h2>
                    <div className="brand-grid">
                        {brands.map((brand) => (
                            <div key={brand.name} className="brand-card">
                                <img src={brand.logo} alt={brand.name} />
                            </div>
                        ))}
                    </div>
                </section>

                {/* Exclusive ASICS Section */}
                <ProductCarousel
                    title={t('exclusive_asics')}
                    products={asicsProducts}
                    link="/collections/asics"
                    style={{ paddingBottom: '0' }}
                />

                {/* Scrolling Logos Section */}
                <ScrollingLogos />

                {/* Trending Section - NEW */}
                <TrendSection trendingProducts={trendingProducts} />

                {/* Scrolling Promotion Section (Green) */}
                <ScrollingPromotion />

                {/* New Arrivals */}
                <section className="section-container bg-light">
                    <h2 className="section-title">{t('new_products')}</h2>
                    <div className="product-grid">
                        {newArrivals.map((prod) => (
                            <ProductCard key={prod.id} product={prod} />
                        ))}
                    </div>
                    <div className="text-center mt-4">
                        <button className="btn btn-outline">{t('view_all')}</button>
                    </div>
                </section>

                {/* Sale Section */}
                <section className="section-container">
                    <h2 className="section-title text-red">{t('sale_products')}</h2>
                    <div className="product-grid">
                        {saleProducts.map((prod) => (
                            <ProductCard key={prod.id} product={prod} />
                        ))}
                    </div>
                </section>

                {/* Social & News Section */}
                <SocialNewsSection />

            </main>
        </>
    );
};

export default HomePage;
