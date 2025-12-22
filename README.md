
# HKT-SHOES (ZestFoot) - Cửa Hàng Giày Dép Trực Tuyến

Chào mừng đến với **HKT-SHOES**, một nền tảng thương mại điện tử chuyên cung cấp các sản phẩm giày dép thời trang chính hãng. Dự án được xây dựng bằng **React (Vite)** và sử dụng **Supabase** làm nền tảng Backend (CSDL & Xác thực).

![HKT-SHOES Banner](public/logoHKTShoes.png)

## 🚀 Tính Năng Nổi Bật

*   **🛒 Mua Sắm Trực Tuyến:**
    *   Xem danh sách sản phẩm, hàng mới về, và các chương trình khuyến mãi.
    *   Tìm kiếm sản phẩm theo tên.
    *   Bộ lọc theo thương hiệu (Nike, Adidas, Puma, v.v.) và danh mục.
    *   Xem chi tiết sản phẩm, kích thước và hình ảnh.

*   **🔐 Tài Khoản & Bảo Mật:**
    *   Đăng ký / Đăng nhập tài khoản (Sử dụng Supabase Auth).
    *   Quản lý thông tin cá nhân (Profile).
    *   Bảo mật thông tin người dùng.

*   **🛍️ Giỏ Hàng & Đặt Hàng:**
    *   Thêm/Sửa/Xóa sản phẩm trong giỏ hàng.
    *   Giỏ hàng được lưu riêng biệt cho từng tài khoản người dùng.
    *   Quy trình thanh toán (Checkout) và xem lịch sử đơn hàng.

*   **🌐 Trải Nghiệm Người Dùng:**
    *   Giao diện Responsive (Thích ứng tốt trên Mobile và Desktop).
    *   Đa ngôn ngữ: Hỗ trợ Tiếng Việt & Tiếng Anh.
    *   Hiệu ứng chuyển động mượt mà (Animations với AOS).
    *   Tích hợp Chatbot hỗ trợ khách hàng.

## 🛠️ Công Nghệ Sử Dụng

**Frontend:**
*   **React JS**: Thư viện UI chính.
*   **Vite**: Công cụ build tool siêu tốc.
*   **React Router Dom**: Quản lý điều hướng trang.
*   **CSS / Lucide React**: Giao diện và Icon.
*   **Swiper**: Tạo các Slider/Carousel đẹp mắt.
*   **AOS (Animate On Scroll)**: Hiệu ứng khi cuộn trang.

**Backend & Database:**
*   **Supabase**: Nền tảng Backend-as-a-Service (BaaS).
    *   **PostgreSQL**: Cơ sở dữ liệu quan hệ mạnh mẽ.
    *   **Authentication**: Quản lý người dùng an toàn.

**Deploy (Triển khai):**
*   **Vercel**: Hosting cho Frontend.

## ⚙️ Cài Đặt & Chạy Dự Án

Làm theo các bước sau để chạy dự án trên máy cá nhân của bạn:

### 1. Clone dự án
```bash
git clone https://github.com/tuntoncute123/ZestFoot.git
cd ZestFoot
```

### 2. Cài đặt thư viện
```bash
npm install
```

### 3. Cấu hình biến môi trường
Tạo file `.env` tại thư mục gốc và thêm thông tin kết nối Supabase của bạn (Lấy từ Supabase Dashboard):

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Chạy dự án (Development)
```bash
npm run dev
```
Truy cập: `http://localhost:5173`

## 📂 Cấu Trúc Thư Mục

```
ZestFoot/
├── public/              # File tĩnh (Logo, favicon...)
├── scripts/             # Script hỗ trợ (Migrate data, seed data...)
├── src/
│   ├── assets/          # Hình ảnh, video, font
│   ├── components/      # Các thành phần giao diện (Header, Footer, Product, v.v.)
│   ├── context/         # React Context (Auth, Cart, Language...)
│   ├── data/            # Dữ liệu tĩnh (Locales...)
│   ├── pages/           # (Các trang chính nếu tách riêng)
│   ├── services/        # Xử lý gọi API (Supabase client...)
│   ├── utils/           # Hàm tiện ích (Format tiền tệ...)
│   └── App.jsx          # Component gốc
├── .env                 # Biến môi trường
└── package.json         # Khai báo thư viện
```

## 🤝 Đóng Góp
Mọi ý kiến đóng góp hoặc báo lỗi đều được hoan nghênh. Vui lòng tạo "New Issue" hoặc gửi "Pull Request".

---
**© 2025 HKT-SHOES Team.**