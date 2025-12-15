# ZestFoot - E-commerce Website (ABC Mart Clone)

## 📝 Giới thiệu
**ZestFoot** là một dự án Front-end xây dựng trang web thương mại điện tử chuyên về giày dép và phụ kiện thể thao. Giao diện và trải nghiệm người dùng (UX/UI) được lấy cảm hứng từ **ABC Mart Việt Nam**, hướng tới phong cách hiện đại, năng động và tối ưu hóa trải nghiệm mua sắm trực tuyến.

Dự án này là minh chứng cho kỹ năng xây dựng giao diện phức tạp với ReactJS, quản lý trạng thái, tích hợp API và xử lý đa ngôn ngữ.

## 🚀 Tính năng nổi bật

### 1. Giao diện (UI/UX)
*   **Responsive Design**: Tương thích hoàn toàn trên Desktop, Tablet và Mobile.
*   **Banner Carousel**: Slider trình chiếu ảnh và video mượt mà (sử dụng *SwiperJS*), hỗ trợ điều hướng và autoplay.
*   **Mega Menu**: Hệ thống menu điều hướng đa cấp, hiển thị danh sách thương hiệu, danh mục sản phẩm và hình ảnh trực quan.
*   **Product Cards**: Thẻ sản phẩm chi tiết với hình ảnh, giá bán, giá giảm, và các nhãn (badges) như "New", "Sale", "Exclusive".

### 2. Chức năng (Functionality)
*   **Đa ngôn ngữ (i18n)**: Hỗ trợ chuyển đổi tức thì giữa **Tiếng Việt** và **Tiếng Anh** sử dụng *Context API*.
*   **Dữ liệu động**: Toàn bộ dữ liệu hiển thị (Sản phẩm, Thương hiệu, Tin tức, FAQ) đều được fetch từ API.
*   **Giả lập Backend**: Sử dụng `json-server` để tạo REST API giả lập, cho phép thực hiện các thao tác GET dữ liệu như một hệ thống thực thụ.

### 3. Các Section chính
*   **Hero Section**: Banner quảng cáo lớn, thu hút.
*   **Brand Grid**: Lưới logo các thương hiệu nổi tiếng (Nike, Adidas, Puma, ASICS...).
*   **Exclusive Collections**: Khu vực dành riêng cho các dòng sản phẩm độc quyền (ví dụ: ASICS Lifewalker).
*   **Social & News**: Tích hợp feed bài viết tin tức và các liên kết mạng xã hội chính thức với icon SVG chuẩn.
*   **Footer**: Thông tin liên hệ và chính sách cửa hàng.

## 🛠️ Công nghệ sử dụng

*   **Core**: [React](https://reactjs.org/) (Vite)
*   **Language**: JavaScript (ES6+)
*   **Styling**: CSS3 (Custom CSS Modules/BEM naming convention)
*   **Fonts**: Google Fonts (Oswald, Inter)
*   **Icons**: [Lucide React](https://lucide.dev/)
*   **Slider Library**: [Swiper](https://swiperjs.com/)
*   **HTTP Client**: [Axios](https://axios-http.com/)
*   **Mock Backend**: [JSON Server](https://github.com/typicode/json-server)

## ⚙️ Hướng dẫn Cài đặt & Chạy dự án

Để chạy dự án trên máy cục bộ, hãy làm theo các bước sau:

### Bước 1: Clone dự án
```bash
git clone https://github.com/username/zestfoot.git
cd zestfoot
```

### Bước 2: Cài đặt dependencies
Đảm bảo bạn đã cài đặt [Node.js](https://nodejs.org/).
```bash
npm install
```

### Bước 3: Khởi động Mock Server và Frontend
Dự án cần chạy song song 2 tiến trình: **JSON Server** (đóng vai trò Backend) và **Vite Dev Server** (Frontend).

**Mở Terminal 1 (Chạy Server giả):**
```bash
npm run server
```
*Server sẽ khởi chạy tại: `http://localhost:3000`*

**Mở Terminal 2 (Chạy React App):**
```bash
npm run dev
```
*Ứng dụng sẽ khởi chạy tại: `http://localhost:5173` (hoặc port hiển thị trên terminal)*

## 📂 Cấu trúc thư mục

```
zestfoot/
├── public/                 # Tài nguyên tĩnh (favicon, robots.txt...)
├── src/
│   ├── assets/             # Hình ảnh, logo, media
│   ├── components/         # Các UI Components tái sử dụng
│   │   ├── Banner/         # Banner Carousel
│   │   ├── Navbar/         # Thanh điều hướng & Mega Menu
│   │   ├── ProductCard/    # Component hiển thị sản phẩm
│   │   ├── SocialNews/     # Section Tin tức & Mạng xã hội
│   │   └── ...
│   ├── context/            # React Context (LanguageContext...)
│   ├── data/               # File cấu hình locales, db.js (backup)
│   ├── services/           # Cấu hình Axios & gọi API
│   ├── utils/              # Các hàm tiện ích (format currency...)
│   ├── App.jsx             # Component gốc
│   └── main.jsx            # Entry point
├── db.json                 # Cơ sở dữ liệu cho JSON Server
├── package.json            # Khai báo thư viện & scripts
└── README.md               # Tài liệu dự án
```

## 🤝 Đóng góp (Contributing)
Dự án được xây dựng với mục đích học tập và rèn luyện kỹ năng. Mọi ý kiến đóng góp, báo lỗi hoặc yêu cầu tính năng mới đều được hoan nghênh. Vui lòng tạo [Issue](https://github.com/username/zestfoot/issues) hoặc gửi Pull Request.

---
*© 2025 ZestFoot Project.*