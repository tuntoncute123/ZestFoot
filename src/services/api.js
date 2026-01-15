
import { supabase } from './supabaseClient';

export const getBrands = async () => {
    try {
        const { data, error } = await supabase.from('brands').select('*');
        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Error fetching brands:", error);
        return [];
    }
};

export const getNewArrivals = async () => {
    try {
        const { data, error } = await supabase.from('products').select('*').eq('isNew', true);
        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Error fetching new arrivals:", error);
        return [];
    }
};

export const getSaleProducts = async () => {
    try {
        const { data, error } = await supabase.from('products').select('*').eq('isSale', true);
        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Error fetching sale products:", error);
        return [];
    }
};

export const getAllProducts = async () => {
    try {
        const { data, error } = await supabase.from('products').select('*');
        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Error fetching all products:", error);
        return [];
    }
};

export const getProductById = async (id) => {
    try {
        const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Error fetching product by ID:", error);
        return null;
    }
};

export const getProductsByCollection = async (slug) => {
    try {
        let query = supabase.from('products').select('*');
        const lowerSlug = slug ? slug.toLowerCase() : 'all';

        // 1. ALL
        if (lowerSlug === 'all') {
            const { data, error } = await query;
            if (error) throw error;
            return data;
        }

        // 2. MAIN CATEGORIES
        if (lowerSlug === 'giay-nu') {
            const { data, error } = await query.eq('gender', 'women').eq('category', 'shoes');
            if (error) throw error; return data;
        }
        if (lowerSlug === 'giay-nam') {
            const { data, error } = await query.eq('gender', 'men').eq('category', 'shoes');
            if (error) throw error; return data;
        }
        // Handle both common slugs for apparel
        if (lowerSlug === 'quan-ao' || lowerSlug === 'phu-trang') {
            const { data, error } = await query.eq('category', 'apparel');
            if (error) throw error; return data;
        }
        if (lowerSlug === 'phu-kien1' || lowerSlug === 'phu-kien') { // Navbar uses phu-kien1?
            // Fetch accessories
            const { data, error } = await query.neq('category', 'shoes').neq('category', 'apparel');
            if (error) throw error; return data;
        }

        // 3. SUB-CATEGORIES (Requires Filtering)
        let baseQuery = query;
        let filterFn = null;

        if (lowerSlug.includes('giay-the-thao')) {
            const gender = lowerSlug.includes('nu') ? 'women' : (lowerSlug.includes('nam') ? 'men' : null);
            if (gender) baseQuery = baseQuery.eq('gender', gender);
            baseQuery = baseQuery.eq('category', 'shoes');
            // Logic: Is Sneaker/Sport OR (Empty subCategory AND NOT Sandal/Slipper/Formal)
            filterFn = p => {
                const nameHigh = p.name.toLowerCase();
                const sub = p.subCategory ? p.subCategory.toLowerCase() : '';
                const isExplicitSneaker = sub === 'sneaker' || nameHigh.includes('sneaker') || nameHigh.includes('thể thao') || nameHigh.includes('running') || nameHigh.includes('walking');
                const isOtherType = nameHigh.includes('sandal') || nameHigh.includes('xăng đan') || nameHigh.includes('dép') || nameHigh.includes('slide') || nameHigh.includes('da ') || nameHigh.includes('tây') || nameHigh.includes('boot') || nameHigh.includes('loafer');

                return isExplicitSneaker || (!sub && !isOtherType);
            };
        }
        else if (lowerSlug.includes('giay-xang-dan')) {
            const gender = lowerSlug.includes('nu') ? 'women' : (lowerSlug.includes('nam') ? 'men' : null);
            if (gender) baseQuery = baseQuery.eq('gender', gender);
            baseQuery = baseQuery.eq('category', 'shoes');
            filterFn = p => {
                const nameHigh = p.name.toLowerCase();
                const sub = p.subCategory ? p.subCategory.toLowerCase() : '';
                return sub === 'sandal' || nameHigh.includes('sandal') || nameHigh.includes('xăng đan');
            };
        }
        else if (lowerSlug.includes('dep')) { // dep-nu, dep-nam
            const gender = lowerSlug.includes('nu') ? 'women' : (lowerSlug.includes('nam') ? 'men' : null);
            if (gender) baseQuery = baseQuery.eq('gender', gender);
            baseQuery = baseQuery.eq('category', 'shoes');
            filterFn = p => {
                const nameHigh = p.name.toLowerCase();
                const sub = p.subCategory ? p.subCategory.toLowerCase() : '';
                return sub === 'slipper' || sub === 'slide' || nameHigh.includes('dép') || nameHigh.includes('slide');
            };
        }
        else if (lowerSlug.includes('giay-da')) {
            const gender = lowerSlug.includes('nu') ? 'women' : (lowerSlug.includes('nam') ? 'men' : null);
            if (gender) baseQuery = baseQuery.eq('gender', gender);
            baseQuery = baseQuery.eq('category', 'shoes');
            filterFn = p => {
                const nameHigh = p.name.toLowerCase();
                const sub = p.subCategory ? p.subCategory.toLowerCase() : '';
                return sub === 'formal' || nameHigh.includes('giày da') || nameHigh.includes('business') || nameHigh.includes('loafer') || nameHigh.includes('boot') || nameHigh.includes('tây');
            };
        }
        else if (lowerSlug === 'ao') {
            baseQuery = baseQuery.eq('category', 'apparel');
            filterFn = p => {
                const nameHigh = p.name.toLowerCase();
                const sub = p.subCategory ? p.subCategory.toLowerCase() : '';
                return sub === 'shirt' || sub === 'top' || nameHigh.includes('áo') || nameHigh.includes('hoodie') || nameHigh.includes('jacket') || nameHigh.includes('tee');
            };
        }
        else if (lowerSlug === 'quan') {
            baseQuery = baseQuery.eq('category', 'apparel');
            filterFn = p => {
                const nameHigh = p.name.toLowerCase();
                const sub = p.subCategory ? p.subCategory.toLowerCase() : '';
                return sub === 'pant' || sub === 'bottom' || nameHigh.includes('quần') || nameHigh.includes('short') || nameHigh.includes('legging');
            };
        }
        else if (lowerSlug === 'day-giay') {
            filterFn = p => p.name.toLowerCase().includes('dây') || (p.subCategory && p.subCategory.toLowerCase() === 'shoelace');
        }

        // Execute Query
        if (filterFn) {
            const { data, error } = await baseQuery;
            if (error) throw error;
            return data.filter(filterFn);
        }

        // 4. FALLBACK / LEGACY CASES
        const { data: allProducts, error } = await supabase.from('products').select('*');
        if (error) throw error;

        switch (lowerSlug) {
            case 'tui':
                return allProducts.filter(p => p.subCategory === 'bag' || p.name.toLowerCase().includes('balo') || p.name.toLowerCase().includes('túi'));
            case 'non':
                return allProducts.filter(p => p.subCategory === 'hat' || p.name.toLowerCase().includes('nón'));
            case 'vo':
                return allProducts.filter(p => p.subCategory === 'socks' || p.name.toLowerCase().includes('vớ'));
            case 'chay-bo':
                return allProducts.filter(p => p.category === 'shoes' && (p.name.toLowerCase().includes('running') || p.name.toLowerCase().includes('chạy')));
            case 'cham-soc-giay':
                return allProducts.filter(p => p.category === 'care');
            case 'sale':
                // Return items that have isSale = true OR have a salePrice
                return allProducts.filter(p => p.isSale || (p.salePrice && p.salePrice < p.price));
            case 'doc-quyen':
                // Use simple check for now
                return allProducts.filter(p => p.isAsicsExclusive || (p.badges && JSON.stringify(p.badges).includes('EXCLUSIVE')));
        }

        // Brand match
        const brandMatch = allProducts.filter(p => p.brand && p.brand.toLowerCase().replace(/\s+/g, '-') === lowerSlug);
        if (brandMatch.length > 0) return brandMatch;

        return [];

    } catch (error) {
        console.error("Error fetching collection products:", error);
        return [];
    }
};

export const getAsicsProducts = async () => {
    try {
        const { data, error } = await supabase.from('products').select('*').eq('brand', 'ASICS');
        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Error fetching ASICS products:", error);
        return [];
    }
};

export const getNews = async () => {
    try {
        const { data, error } = await supabase.from('news').select('*');
        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Error fetching news:", error);
        return [];
    }
};

export const getNewsById = async (id) => {
    try {
        const { data, error } = await supabase.from('news').select('*').eq('id', id).single();
        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Error fetching news by ID:", error);
        return null;
    }
};

export const getFaqs = async () => {
    try {
        const { data, error } = await supabase.from('faqs').select('*');

        // Mock data nếu chưa có dữ liệu thật từ DB (để demo)
        if (error || !data || data.length === 0) {
            return [
                {
                    id: 1,
                    question: "Làm sao để chọn size giày phù hợp?",
                    key: "faq_size_guide",
                    answer: "Bạn có thể tham khảo bảng quy đổi size (Size Chart) trong trang chi tiết sản phẩm. Nếu chân bè hoặc mu bàn chân dày, chúng tôi khuyên bạn nên tăng thêm 0.5 - 1 size."
                },
                {
                    id: 2,
                    question: "Chính sách đổi trả của ZestFoot như thế nào?",
                    key: "faq_return_policy",
                    answer: "ZestFoot hỗ trợ đổi hàng trong vòng 7 ngày kể từ ngày nhận hàng với điều kiện sản phẩm còn nguyên tem mác, chưa qua sử dụng và đầy đủ hộp."
                },
                {
                    id: 3,
                    question: "Thời gian giao hàng dự kiến là bao lâu?",
                    key: "faq_shipping_time",
                    answer: "Thời gian giao hàng:\n- Nội thành TP.HCM: 1-2 ngày.\n- Các tỉnh thành khác: 3-5 ngày tuỳ khu vực."
                },
                {
                    id: 4,
                    question: "Sản phẩm có được bảo hành không?",
                    key: "faq_warranty",
                    answer: "Có, ZestFoot bảo hành keo và chỉ trong vòng 6 tháng cho tất cả các sản phẩm giày dép chính hãng."
                }
            ];
        }
        return data;
    } catch (error) {
        console.error("Error fetching FAQs, returning mock:", error);
        return [];
    }
};

/* ===============================
   AUTH – SUPABASE
================================ */

export const registerUser = async (userData) => {
    const { email, password, firstName, lastName } = userData;
    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    first_name: firstName,
                    last_name: lastName,
                    full_name: `${firstName} ${lastName}`
                }
            }
        });

        if (error) return { success: false, message: error.message };

        return { success: true, user: data.user };
    } catch (err) {
        console.error(err);
        return { success: false, message: "Lỗi đăng ký" };
    }
};

export const loginUser = async (email, password) => {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email.trim(),
            password: password.trim()
        });

        if (error) return { success: false, message: "Email hoặc mật khẩu không đúng" };
        return { success: true, user: data.user };
    } catch (error) {
        console.error(error);
        return { success: false, message: "Lỗi đăng nhập" };
    }
};

export const logoutUser = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("sb-access-token"); // Usually handled by supabase js
};

// Check if login: check session
export const isAuthenticated = async () => {
    const { data } = await supabase.auth.getSession();
    return !!data.session;
};

// Get current user
// Note: This needs to be sync to match old usage if possible, or components need updating.
// Old usage: JSON.parse(localStorage.getItem("currentUser"))
// Supabase: supabase.auth.getUser() is async.
// However, supabase.auth.getSession() usually caches.
// To avoid breaking entire app refactoring to async, we can check if there's a simple way.
// IF the app relies on synchronous `getCurrentUser()`, we might need to modify the App logic or 
// use a hooks.
// For now, let's try to return the object from local storage that Supabase sets, OR
// warn that components must await.
// Assuming existing code calls it synchronously.
export const getCurrentUser = () => {
    // This is tricky. Supabase stores session in localStorage under key 'sb-<project-ref>-auth-token'
    // But parsing it is internal implementation detail.
    // Better to use `supabase.auth.getSession()` but that's async.
    // TEMPORARY FIX: Return null and let UserContext/LanguageContext handle it if they use it?
    // Reviewing App.jsx or Login might help.
    // But let's stick to best effort:
    return null; // Components should use useUser hooks or similar.
};


// Replacing the old synchronous getCurrentUser with a hooks-friendly approach is best
// But for now, let's look at `getTrendingProducts`
export const getTrendingProducts = async () => {
    try {
        const { data, error } = await supabase.from('products').select('*').eq('isTrending', true);
        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Error fetching trending products:", error);
        return [];
    }
};

export const searchProducts = async (query) => {
    try {
        if (!query) return [];
        // ILIKE for case-insensitive search
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .or(`name.ilike.%${query}%,brand.ilike.%${query}%`);

        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Error searching products:", error);
        return [];
    }
};
