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
        // Query param 'brand' is case-sensitive or depends on db.json structure. 
        // We'll try to match brand name broadly or handle "all" case.
        let url = `${API_URL}/products`;
        if (slug && slug !== 'all') {
            // Capitalize first letter to match db (e.g. 'nike' -> 'Nike') or just search/filter
            // json-server supports full text search with q= but filtering by brand is better.
            // Let's assume slug matches brand but lowercased.
            // We need to check if we can filter by 'brand' field case-insensitively using json-server? 
            // json-server doesn't support regex out of box easily unless custom routes.
            // We'll fetch all and filter in frontend OR map slug to exact Brand Name.

            // Just for MVP, let's fetch all and filter JS side if exact match is tricky, 
            // OR strict match if we ensure DB has "Nike" and slug is "nike".

            // Actually, let's just make a simple map or try capitalized.
            const brandName = slug.charAt(0).toUpperCase() + slug.slice(1);
            // Simple Capitalization for now: "nike" -> "Nike", "new-balance" -> "New Balance" (need logic)

            // Better approach: Get all products and filter locally for flexibility in this mock environment
            const response = await axios.get(`${API_URL}/products`);
            const all = response.data;
            return all.filter(p => p.brand.toLowerCase().replace(/\s+/g, '-') === slug.toLowerCase());
        }

        const response = await axios.get(url);
        return response.data;
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
export const registerUser = async (userData) => {
    try {
        // Bước 1: Kiểm tra xem email đã tồn tại trong db.json chưa
        const checkRes = await axios.get(`${API_URL}/users?email=${userData.email}`);

        if (checkRes.data.length > 0) {
            return { success: false, message: "Email này đã được sử dụng!" };
        }

        // Bước 2: Nếu chưa tồn tại, tạo user mới
        const createRes = await axios.post(`${API_URL}/users`, userData);
        return { success: true, data: createRes.data };

    } catch (error) {
        console.error("Error registering user:", error);
        return { success: false, message: "Lỗi kết nối server khi đăng ký" };
    }
};

// 2. Đăng nhập
export const loginUser = async (email, password) => {
    try {
        // Tìm user có email và password trùng khớp
        const response = await axios.get(`${API_URL}/users?email=${email}&password=${password}`);

        if (response.data.length > 0) {
            // Tìm thấy user -> Đăng nhập thành công
            return { success: true, user: response.data[0] };
        } else {
            // Không tìm thấy -> Sai email hoặc pass
            return { success: false, message: "Email hoặc mật khẩu không chính xác" };
        }
    } catch (error) {
        console.error("Error logging in:", error);
        return { success: false, message: "Lỗi kết nối server khi đăng nhập" };
    }
};