import React, { useEffect, useState } from 'react';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import ProductCard from '../ProductCard/ProductCard';
import CategoryBar from '../CategoryBar/CategoryBar';
import BannerCarousel from '../Banner/BannerCarousel'; // Update path if needed
import ProductCarousel from '../ProductCarousel'; // Flat file in components
import { getBrands, getNewArrivals, getSaleProducts, getAsicsProducts } from '../../services/api';
import './HomePage.css';

const HomePage = () => {
    const [brands, setBrands] = useState([]);
    const [newArrivals, setNewArrivals] = useState([]);
    const [saleProducts, setSaleProducts] = useState([]);
    const [asicsProducts, setAsicsProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch all data in parallel for efficiency
                const [brandsData, newData, saleData, asicsData] = await Promise.all([
                    getBrands(),
                    getNewArrivals(),
                    getSaleProducts(),
                    getAsicsProducts()
                ]);

                setBrands(brandsData);
                setNewArrivals(newData);
                setSaleProducts(saleData);
                setAsicsProducts(asicsData);
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
            <Navbar />
            <CategoryBar />

            {/* Hero Carousel */}
            <BannerCarousel />

            <main>
                {/* Brand Section */}
                <section className="section-container">
                    <h2 className="section-title">THƯƠNG HIỆU NỔI BẬT</h2>
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
                    title="EXCLUSIVE - ASICS LIFEWALKER"
                    products={asicsProducts}
                    link="/collections/asics"
                />

                {/* New Arrivals */}
                <section className="section-container bg-light">
                    <h2 className="section-title">HÀNG MỚI VỀ</h2>
                    <div className="product-grid">
                        {newArrivals.map((prod) => (
                            <ProductCard key={prod.id} product={prod} />
                        ))}
                    </div>
                    <div className="text-center mt-4">
                        <button className="btn btn-outline">XEM TẤT CẢ</button>
                    </div>
                </section>

                {/* Sale Section */}
                <section className="section-container">
                    <h2 className="section-title text-red">KHUYẾN MÃI HOT</h2>
                    <div className="product-grid">
                        {saleProducts.map((prod) => (
                            <ProductCard key={prod.id} product={prod} />
                        ))}
                    </div>
                </section>

            </main>

            <Footer />
        </>
    );
};

export default HomePage;
