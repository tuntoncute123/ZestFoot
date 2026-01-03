# 👟 ZestFoot (HKT-SHOES) - Nền Tảng Thương Mại Điện Tử Giày Dép

![React](https://img.shields.io/badge/React-18.2.0-blue?logo=react)
![Vite](https://img.shields.io/badge/Vite-5.0.0-purple?logo=vite)
![Supabase](https://img.shields.io/badge/Supabase-Client-green?logo=supabase)
![License](https://img.shields.io/badge/License-MIT-yellow)

Chào mừng đến với **ZestFoot** (hay HKT-SHOES), một ứng dụng thương mại điện tử hiện đại chuyên về giày dép thể thao và thời trang. Dự án được xây dựng với **React JS** kết hợp với **Supabase** để mang lại trải nghiệm mua sắm nhanh chóng, mượt mà và an toàn.

![Banner Dự Án](./public/logoHKTShoes.png)

---

## 🌟 Tính Năng Chính

Dự án bao gồm đầy đủ các tính năng của một sàn thương mại điện tử hoàn chỉnh:

### �️ Mua Sắm & Sản Phẩm
*   **Trang Chủ Hiện Đại:** Banner động (Carousel), danh mục nổi bật, sản phẩm mới về và đang giảm giá.
*   **Danh Mục Sản Phẩm:** Lọc sản phẩm theo Thương hiệu (Adidas, Nike, Puma...), Danh mục (Nam, Nữ, Phụ kiện) và Bộ sưu tập.
*   **Chi Tiết Sản Phẩm:** Xem hình ảnh chi tiết, chọn kích thước (Size), xem mô tả và đánh giá.
*   **Tìm Kiếm Thông Minh:** Tìm kiếm sản phẩm theo tên hoặc từ khóa liên quan.
*   **Giỏ Hàng:** Thêm/Sửa/Xóa sản phẩm, tự động tính tổng tiền.

### 👤 Người Dùng & Tài Khoản
*   **Đăng Ký / Đăng Nhập:** Xác thực người dùng an toàn qua Email/Password (Sử dụng Supabase Auth).
*   **Quản Lý Hồ Sơ:** Cập nhật thông tin cá nhân, avatar.
*   **Sổ Địa Chỉ:** Quản lý danh sách địa chỉ giao hàng.
*   **Lịch Sử Đơn Hàng:** Xem lại các đơn hàng đã mua và trạng thái vận chuyển.

### 💳 Thanh Toán & Đơn Hàng
*   **Checkout (Thanh Toán):** Quy trình thanh toán đơn giản bao gồm chọn địa chỉ và phương thức thanh toán.
*   **Quản Lý Đơn Hàng:** Theo dõi trạng thái đơn hàng realtime.

### � Tiện Ích & Tương Tác
*   **Hệ Thống Thành Viên (Membership):** Các hạng thành viên và ưu đãi đi kèm.
*   **Tích Điểm & Đổi Quà (Reward Hub):** Trung tâm đổi điểm thưởng.
*   **Tin Tức & Blog:** Cập nhật xu hướng thời trang mới nhất.
*   **ChatBot AI:** Hỗ trợ giải đáp thắc mắc khách hàng tự động.
*   **Yêu Thích (Wishlist):** Lưu các sản phẩm quan tâm.

---

## 🛠️ Công Nghệ Sử Dụng

### Frontend (Client-side)
*   **Core:** [React JS](https://react.dev/) (v18)
*   **Build Tool:** [Vite](https://vitejs.dev/) - Tối ưu hóa tốc độ phát triển và build.
*   **Routing:** [React Router Dom](https://reactrouter.com/) (v6+) - Quản lý điều hướng SPA.
*   **HTTP Client:** [Axios](https://axios-http.com/) - Xử lý call API.
*   **Styling:** CSS3 thuần túy kết hợp thiết kế Responsive Design.
*   **UI Libraries:**
    *   `swiper`: Tạo slider/carousel mượt mà.
    *   `aos` (Animate On Scroll): Hiệu ứng animation khi cuộn trang.
    *   `lucide-react`: Bộ icon hiện đại, nhẹ nhàng.

### Backend & Database (Server-side)
*   **Platform:** [Supabase](https://supabase.com/) (Backend-as-a-Service).
*   **Database:** PostgreSQL - Lưu trữ dữ liệu quan hệ (Sản phẩm, Đơn hàng...).
*   **Authentication:** Supabase Auth - Quản lý phiên đăng nhập và bảo mật người dùng.
*   **Storage:** Supabase Storage - Lưu trữ hình ảnh sản phẩm, avatar (nếu có).

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Dự Án

Làm theo các bước sau để chạy dự án trên máy cục bộ của bạn.

### 1. Yêu Cầu Tiên Quyết
*   [Node.js](https://nodejs.org/) (Phiên bản khuyến nghị: 16.x hoặc 18.x trở lên).
*   Tài khoản [Supabase](https://supabase.com/) (để kết nối database).

### 2. Clone Dự Án
```bash
git clone https://github.com/tuntoncute123/ZestFoot.git
cd zestfoot
```

### 3. Cài Đặt Thư Viện
Sử dụng npm để cài đặt các dependencies:
```bash
npm install
```

### 4. Cấu Hình Biến Môi Trường
Tạo file `.env` tại thư mục gốc của dự án (`/zestfoot/.env`) và điền thông tin Supabase của bạn vào:

```env
VITE_SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```
*(Bạn có thể lấy các thông tin này trong phần Project Settings > API trên Supabase Dashboard)*

### 5. Chạy Dự Án (Development)
Khởi chạy server dev của Vite:
```bash
npm run dev
```
Truy cập trình duyệt tại địa chỉ: `http://localhost:5173`

---

## 📂 Cấu Trúc Thư Mục

```
zestfoot/
├── .env                 # Biến môi trường (Cần tự tạo)
├── public/              # Tài nguyên tĩnh (Logo, favicon)
├── scripts/             # Các script tiện ích (Migrate, Seed data)
└── src/
    ├── assets/          # Hình ảnh, Font chữ, Media
    ├── components/      # (QUAN TRỌNG) Các thành phần UI
    │   ├── Home/        # Components trang chủ
    │   ├── Navbar/      # Thanh điều hướng
    │   ├── ProductDetail/
    │   ├── Cart/        # Xử lý giỏ hàng
    │   ├── Checkout/    # Xử lý thanh toán
    │   ├── Auth/        # Đăng ký/Đăng nhập
    │   └── ...các component khác
    ├── context/         # React Context (Auth, Cart, Wishlist...)
    ├── services/        # Các hàm gọi API (Supabase Client)
    ├── utils/           # Các hàm tiện ích chung
    └── App.jsx          # Component gốc, cấu hình Routes
    └── main.jsx         # Điểm khởi chạy ứng dụng
```

---

## 📜 Các Tập Lệnh (Scripts)

Trong quá trình phát triển, bạn có thể sử dụng các lệnh sau trong Terminal:

*   `npm run dev`: Chạy dự án ở chế độ Development (Hot reload).
*   `npm run build`: Đóng gói dự án ra thư mục `dist` để chuẩn bị Deploy.
*   `npm run lint`: Kiểm tra lỗi cú pháp và quy chuẩn code với ESLint.
*   `npm run preview`: Chạy thử bản build production trên máy local.

---

## 🤝 Đóng Góp (Contributing)

Mọi sự đóng góp đều được hoan nghênh! Nếu bạn muốn cải thiện dự án:

1.  Fork repository này.
2.  Tạo nhánh tính năng mới (`git checkout -b feature/AmazingFeature`).
3.  Commit thay đổi của bạn (`git commit -m 'Add some AmazingFeature'`).
4.  Push lên nhánh (`git push origin feature/AmazingFeature`).
5.  Tạo một Pull Request.

---

## 📞 Liên Hệ

Nếu bạn có câu hỏi hoặc cần hỗ trợ về dự án, vui lòng liên hệ:

*   **Tác giả:** TunTonCute123
*   **Email:** (Thêm email của bạn nếu muốn)
*   **GitHub:** [github.com/tuntoncute123](https://github.com/tuntoncute123)

---
**© 2026 ZestFoot Development Team.**