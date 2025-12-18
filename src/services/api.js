import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const getBrands = async () => {
    try {
        const response = await axios.get(`${API_URL}/brands`);
        return response.data;
    } catch (error) {
        console.error("Error fetching brands:", error);
        return [];
    }
};

export const getNewArrivals = async () => {
    try {
        const response = await axios.get(`${API_URL}/products?isNew=true`);
        return response.data;
    } catch (error) {
        console.error("Error fetching new arrivals:", error);
        return [];
    }
};

export const getSaleProducts = async () => {
    try {
        const response = await axios.get(`${API_URL}/products?isSale=true`);
        return response.data;
    } catch (error) {
        console.error("Error fetching sale products:", error);
        return [];
    }
};

export const getAllProducts = async () => {
    try {
        const response = await axios.get(`${API_URL}/products`);
        return response.data;
    } catch (error) {
        console.error("Error fetching all products:", error);
        return [];
    }
};

export const getProductById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/products/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching product by ID:", error);
        return null;
    }
};

export const getProductsByCollection = async (slug) => {
    try {
        const response = await axios.get(`${API_URL}/products`);
        const allProducts = response.data;

        if (!slug || slug === 'all') {
            return allProducts;
        }

        const lowerSlug = slug.toLowerCase();

        // 1. Check for specific Category/Gender slugs
        switch (lowerSlug) {
            case 'giay-nu':
                return allProducts.filter(p => p.gender === 'women' && p.category === 'shoes');
            case 'giay-nam':
                return allProducts.filter(p => p.gender === 'men' && p.category === 'shoes');
            case 'quan-ao':
                return allProducts.filter(p => p.category === 'apparel');
            case 'tui':
                // Check if name contains "túi" or "balo" or category matches
                return allProducts.filter(p => p.subCategory === 'bag' || p.name.toLowerCase().includes('balo') || p.name.toLowerCase().includes('túi'));
            case 'non':
                return allProducts.filter(p => p.subCategory === 'hat' || p.name.toLowerCase().includes('nón'));
            case 'vo':
                return allProducts.filter(p => p.subCategory === 'socks' || p.name.toLowerCase().includes('vớ'));
            case 'chay-bo':
                // rudimentary filter for running shoes
                return allProducts.filter(p => p.category === 'shoes' && (p.name.toLowerCase().includes('running') || p.name.toLowerCase().includes('chạy')));
            case 'doc-quyen':
                return allProducts.filter(p => p.isAsicsExclusive || p.badges?.includes('EXCLUSIVE'));
            case 'cham-soc-giay':
                return allProducts.filter(p => p.category === 'care');
        }

        // 2. Fallback: Filter by Brand (slug matching brand name)
        // Check if slug matches a brand
        const brandMatch = allProducts.filter(p => p.brand.toLowerCase().replace(/\s+/g, '-') === lowerSlug);
        if (brandMatch.length > 0) {
            return brandMatch;
        }

        // 3. Fallback: Filter by Tag/Type if needed, or return empty
        return [];

    } catch (error) {
        console.error("Error fetching collection products:", error);
        return [];
    }
};

export const getAsicsProducts = async () => {
    try {
        const response = await axios.get(`${API_URL}/products?brand=ASICS&isAsicsExclusive=true`);
        return response.data;
    } catch (error) {
        console.error("Error fetching ASICS products:", error);
        return [];
    }
};

export const getNews = async () => {
    try {
        const response = await axios.get(`${API_URL}/news`);
        return response.data;
    } catch (error) {
        console.error("Error fetching news:", error);
        return [];
    }
};

export const getFaqs = async () => {
    try {
        const response = await axios.get(`${API_URL}/faqs`);
        return response.data;
    } catch (error) {
        console.error("Error fetching FAQs:", error);
        return [];
    }
};

export const getTrendingProducts = async () => {
    try {
        const response = await axios.get(`${API_URL}/products?isTrending=true`);
        return response.data;
    } catch (error) {
        console.error("Error fetching trending products:", error);
        return [];
    }
};
