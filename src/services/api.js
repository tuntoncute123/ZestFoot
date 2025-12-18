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
/* ===============================
   AUTH – LOCALSTORAGE ONLY
   (NO BACKEND, NO JSON-SERVER)
================================ */
export const registerUser = async (userData) => {
    const { email, password } = userData;

    // validate password
    if (!password || password.length < 6) {
        return {
            success: false,
            message: "Mật khẩu phải có ít nhất 6 ký tự"
        };
    }

    try {
        // 1️⃣ kiểm tra email đã tồn tại chưa
        const checkRes = await axios.get(
            `${API_URL}/users?email=${email.trim()}`
        );

        if (checkRes.data.length > 0) {
            return {
                success: false,
                message: "Email này đã được sử dụng!"
            };
        }

        // 2️⃣ tạo user mới
        const createRes = await axios.post(`${API_URL}/users`, {
            ...userData,
            email: email.trim(),
            password: password.trim()
        });

        // 3️⃣ auto login
        localStorage.setItem(
            "currentUser",
            JSON.stringify(createRes.data)
        );

        return { success: true, user: createRes.data };
    } catch (err) {
        console.error(err);
        return {
            success: false,
            message: "Không kết nối được server"
        };
    }
};

// Đăng nhập
export const loginUser = async (email, password) => {
    try {
        const res = await axios.get(
            `${API_URL}/users?email=${email.trim()}`
        );

        if (res.data.length === 0) {
            return { success: false, message: "Email không tồn tại" };
        }

        const user = res.data[0];

        if (user.password !== password.trim()) {
            return { success: false, message: "Mật khẩu không đúng" };
        }

        localStorage.setItem("currentUser", JSON.stringify(user));

        return { success: true, user };
    } catch (error) {
        console.error(error);
        return { success: false, message: "Lỗi kết nối server" };
    }
};


// Logout
export const logoutUser = () => {
    localStorage.removeItem("currentUser");
};

// Kiểm tra đã login chưa (dùng để chặn route)
export const isAuthenticated = () => {
    return !!localStorage.getItem("currentUser");
};

// Lấy user hiện tại
export const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem("currentUser"));
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
