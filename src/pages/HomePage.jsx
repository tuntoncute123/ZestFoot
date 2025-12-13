import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import CategoryBar from '../components/CategoryBar';
import BannerCarousel from '../components/BannerCarousel';
import './HomePage.css';

const HomePage = () => {

    // Dummy Data
    const brands = [
        { name: 'Nike', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg' },
        { name: 'Adidas', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg' },
        { name: 'Vans', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/90/Vans-logo.svg' },
        { name: 'Converse', logo: 'https://upload.wikimedia.org/wikipedia/commons/3/30/Converse_logo.svg' },
        { name: 'Puma', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/ae/Puma_logo.svg' },
        { name: 'New Balance', logo: 'https://upload.wikimedia.org/wikipedia/commons/e/ea/New_Balance_logo.svg' },
    ];

    const newArrivals = [
        { id: 1, name: 'Giày Nike Air Force 1 07', brand: 'Nike', price: 2929000, image: 'https://via.placeholder.com/300x300?text=Nike+AF1', isNew: true },
        { id: 2, name: 'Giày Adidas Superstar', brand: 'Adidas', price: 2400000, image: 'https://via.placeholder.com/300x300?text=Adidas+Superstar', isNew: true },
        { id: 3, name: 'Giày Vans Old Skool', brand: 'Vans', price: 1950000, image: 'https://via.placeholder.com/300x300?text=Vans+Old+Skool', isNew: true },
        { id: 4, name: 'Giày Converse Chuck 70', brand: 'Converse', price: 1800000, image: 'https://via.placeholder.com/300x300?text=Converse+Chuck+70', isNew: true },
    ];

    const saleProducts = [
        { id: 5, name: 'Giày Puma Suede Classic', brand: 'Puma', price: 2200000, salePrice: 1540000, image: 'https://via.placeholder.com/300x300?text=Puma+Suede', isSale: true },
        { id: 6, name: 'Giày New Balance 574', brand: 'New Balance', price: 2500000, salePrice: 1750000, image: 'https://via.placeholder.com/300x300?text=NB+574', isSale: true },
        { id: 7, name: 'Giày Fila Disruptor 2', brand: 'Fila', price: 1900000, salePrice: 1330000, image: 'https://via.placeholder.com/300x300?text=Fila', isSale: true },
        { id: 8, name: 'Giày Reebok Club C 85', brand: 'Reebok', price: 2100000, salePrice: 1470000, image: 'https://via.placeholder.com/300x300?text=Reebok', isSale: true },
    ];

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
