import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductsByCollection } from '../../services/api';
import ProductCard from '../ProductCard/ProductCard';
import CollectionSidebar from './CollectionSidebar';
import './CollectionPage.css';
import { ChevronDown, ChevronUp } from 'lucide-react';

const CollectionPage = () => {
    const { slug } = useParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortOption, setSortOption] = useState('manual');

    // Mock Filters State (Expanded/Collapsed)
    const [filtersOpen, setFiltersOpen] = useState({
        brand: true,
        price: true,
        size: true
    });

    const toggleFilter = (key) => {
        setFiltersOpen(prev => ({ ...prev, [key]: !prev[key] }));
    };

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                // Fetch filtered by slug
                const data = await getProductsByCollection(slug);
                setProducts(data);
            } catch (error) {
                console.error("Failed to load collection:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [slug]);

    // Filter Selection State
    const [selectedFilters, setSelectedFilters] = useState({
        availability: false, // true = filtering for in-stock only
        price: { min: 0, max: 100000000 },
        gender: [],
        brand: [],
        size: [],
        color: [],
        material: [],
        category: [],
        discount: []
    });

    const handleFilterChange = (sectionId, value, type) => {
        setSelectedFilters(prev => {
            const newState = { ...prev };

            if (type === 'list' || type === 'color') {
                // Toggle value in array
                const currentList = newState[sectionId];
                if (currentList.includes(value)) {
                    newState[sectionId] = currentList.filter(item => item !== value);
                } else {
                    newState[sectionId] = [...currentList, value];
                }
            } else if (type === 'price') {
                // value is { min, max }
                newState.price = { ...newState.price, ...value };
            } else if (type === 'switch') {
                newState[sectionId] = !newState[sectionId];
            }

            return newState;
        });
    };

    // Derived State: Filtered & Sorted Products
    const processedProducts = products.filter(product => {
        // 1. Filter by Slug/Context (if slug is a brand name, ensure it matches, unless user selected other brands)
        // If the URL is specific to a brand (e.g., /collections/nike), we usually enforce that brand
        // unless we want to allow cross-filtering. For now, let's treat 'slug' as the base source-of-truth.
        // If slug is present and isn't 'all', we already fetched filtered data from API, so we skip this check 
        // OR we double check if API returned mixed results.

        // 2. Filter by Price
        if (product.price < selectedFilters.price.min || product.price > selectedFilters.price.max) return false;

        // 3. Filter by Availability (Assume all valid for now, mock logic)
        // if (selectedFilters.availability && !product.inStock) return false;

        // 4. Filter by Brand (Array)
        if (selectedFilters.brand.length > 0) {
            // Check if product.brand matches any selected brand (case-insensitive)
            const brandMatch = selectedFilters.brand.some(b => b.toLowerCase() === product.brand?.toLowerCase());
            if (!brandMatch) return false;
        }

        // 5. Filter by other attributes (Gender, Size, Color...) 
        // Note: db.json might not have these yet, so this will be strict if selected
        if (selectedFilters.gender.length > 0) {
            if (!selectedFilters.gender.includes(product.gender)) return false;
        }
        if (selectedFilters.category.length > 0) {
            // e.g. "shoes" vs "clothes"
            if (!selectedFilters.category.includes(product.category)) return false;
        }

        // ... add other filters as needed when data exists

        return true;
    }).sort((a, b) => {
        if (sortOption === 'price-asc') return a.price - b.price;
        if (sortOption === 'price-desc') return b.price - a.price;
        if (sortOption === 'name-asc') return a.name.localeCompare(b.name);
        if (sortOption === 'name-desc') return b.name.localeCompare(a.name);
        return 0;
    });

    if (loading) {
        return <div className="loading-screen"><div className="spinner"></div></div>;
    }

    return (
        <div className="collection-page">
            <header className="collection-header">
                <h1 className="collection-title">{slug ? slug.replace('-', ' ') : 'Tất cả sản phẩm'}</h1>
                <div className="breadcrumb">
                    <Link to="/">Trang chủ</Link> / <span>{slug ? slug.toUpperCase() : 'SẢN PHẨM'}</span>
                </div>
            </header>

            <div className="collection-layout">
                {/* Sidebar Filters */}
                <CollectionSidebar
                    filters={filtersOpen}
                    toggleFilter={toggleFilter}
                    selectedFilters={selectedFilters}
                    onFilterChange={handleFilterChange}
                />

                {/* Main Content */}
                <main className="collection-content">
                    <div className="toolbar">
                        <span className="product-count">{processedProducts.length} sản phẩm</span>
                        <div className="sort-wrapper">
                            <select
                                className="sort-select"
                                value={sortOption}
                                onChange={(e) => setSortOption(e.target.value)}
                            >
                                <option value="manual">Tùy chọn</option>
                                <option value="price-asc">Giá: Tăng dần</option>
                                <option value="price-desc">Giá: Giảm dần</option>
                                <option value="name-asc">Tên: A-Z</option>
                                <option value="name-desc">Tên: Z-A</option>
                            </select>
                        </div>
                    </div>

                    <div className="collection-products-grid">
                        {processedProducts.length > 0 ? (
                            processedProducts.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))
                        ) : (
                            <p>Không tìm thấy sản phẩm nào trong danh mục này.</p>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default CollectionPage;
