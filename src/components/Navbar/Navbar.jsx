import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Search, User, ShoppingBag, Menu, X, CheckCircle, Truck, CreditCard, ChevronDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { searchProducts } from '../../services/api';
import './Navbar.css';
import logo from '../../assets/logoHKTShoes.png';
import '../LogIn_SignUp/Auth.css';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('active-tab-1');

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  // Language Context
  const { language, setLanguage, t } = useLanguage();
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const langMenuRef = useRef(null);
  const { user, logout } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setIsMenuOpen(false);
      setShowSuggestions(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleInputChange = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim().length > 1) {
      try {
        const results = await searchProducts(value);
        setSuggestions(results.slice(0, 5)); // Limit to 5 suggestions
        setShowSuggestions(true);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setIsLangMenuOpen(false);
  };

  // --- MỚI: Xử lý click ra ngoài để đóng menu ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.search-bar')) {
        setShowSuggestions(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
      if (langMenuRef.current && !langMenuRef.current.contains(event.target)) {
        setIsLangMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Navigation Links with Mega Menu Data
  const navLinks = useMemo(() => [
    {
      name: t('brands'),
      path: "/Home/thuong-hieu",
      type: "list", // Grid/List of brands
      data: [
        { name: "TẤT CẢ", path: "/collections/all" },
        { name: "NIKE", path: "/collections/nike" },
        { name: "JORDAN", path: "/collections/jordan" },
        { name: "ADIDAS", path: "/collections/adidas" },
        { name: "NEW BALANCE", path: "/collections/new-balance" },
        { name: "ASICS", path: "/collections/asics" },
        { name: "PUMA", path: "/collections/puma" },
        { name: "CONVERSE", path: "/collections/converse" },
        { name: "CROCS", path: "/collections/crocs" },
        { name: "FILA", path: "/collections/fila" },
        { name: "PATRICK", path: "/collections/patrick" },
        { name: "STEFANO ROSSI", path: "/collections/stefano-rossi" },
        { name: "HAWKINS", path: "/collections/hawkins" },
        { name: "K-SWISS", path: "/collections/k-swiss" },
        { name: "ABC SELECT", path: "/collections/abc-select" },
        { name: "ON", path: "/collections/on" },
        { name: "WHAT IT ISNT", path: "/collections/what-it-isnt" },
      ]
    },
    {
      name: t('categories'),
      path: "/collections/all",
      type: "columns",
      data: [
        {
          title: "GIÀY NỮ",
          path: "/collections/giay-nu",
          items: [
            { name: "GIÀY THỂ THAO", path: "/collections/giay-the-thao-nu" },
            { name: "GIÀY XĂNG ĐAN", path: "/collections/giay-xang-dan-nu" },
            { name: "DÉP", path: "/collections/dep-nu" },
            { name: "GIÀY DA", path: "/collections/giay-da-nu" },
          ]
        },
        {
          title: "GIÀY NAM",
          path: "/collections/giay-nam",
          items: [
            { name: "GIÀY THỂ THAO", path: "/collections/giay-the-thao-nam" },
            { name: "GIÀY XĂNG ĐAN", path: "/collections/giay-xang-dan-nam" },
            { name: "DÉP", path: "/collections/dep-nam" },
            { name: "GIÀY DA", path: "/collections/giay-da-nam" },
          ]
        },
        {
          title: "PHỤ TRANG",
          path: "/collections/phu-trang",
          items: [
            { name: "ÁO", path: "/collections/ao" },
            { name: "QUẦN", path: "/collections/quan" },
            { name: "KHÁC", path: "/collections/phu-trang" },
          ]
        },
        {
          title: "PHỤ KIỆN",
          path: "/collections/phu-kien1",
          items: [
            { name: "TÚI", path: "/collections/tui" },
            { name: "NÓN", path: "/collections/non" },
            { name: "VỚ", path: "/collections/vo" },
          ]
        },
        {
          title: "CHĂM SÓC GIÀY",
          path: "/collections/cham-soc-giay",
          items: [
            { name: "CHĂM SÓC GIÀY", path: "/collections/cham-soc-giay" },
            { name: "DÂY GIÀY", path: "/collections/day-giay" },
          ]
        },
      ]
    },
    {
      name: t('new_arrivals'),
      path: "/collections/hang-moi",
      type: "tabs",
      tabs: [
        { id: 'active-tab-1', label: "BỘ SƯU TẬP", path: "/collections/puma" },
        { id: 'active-tab-2', label: "HÀNG MỚI", path: "/collections/hang-moi" },
        { id: 'active-tab-3', label: "ĐỘC QUYỀN", path: "/collections/doc-quyen" },
        { id: 'active-tab-4', label: "XẾP HẠNG", path: "/collections/xep-hang" },
      ],
      content: {
        'active-tab-1': [
          { title: "NEW BALANCE", img: "//abc-mart.com.vn/cdn/shop/collections/4_-_New_Balance_collection.jpg?v=1760514203&width=535", link: "/collections/new-balance" },
          { title: "PUMA", img: "//abc-mart.com.vn/cdn/shop/collections/PUMA.jpg?v=1763689996&width=535", link: "/collections/puma" },
          { title: "ASICS", img: "//abc-mart.com.vn/cdn/shop/collections/asics_kayano_rafflebanner_mobile.jpg?v=1764125320&width=535", link: "/collections/asics" },
        ],
        'active-tab-2': [
          { title: "ADIDAS SAMBA", img: "https://abc-mart.com.vn/cdn/shop/files/H-STREET_HERO_BANNER.jpg?v=1765601397&width=535", link: "/products/adidas-samba" },
          { title: "NIKE DUNK LOW", img: "https://abc-mart.com.vn/cdn/shop/files/12.12_EC.jpg?v=1765419048&width=535", link: "/products/nike-dunk-low" },
          { title: "FILA RAY TRACER", img: "https://abc-mart.com.vn/cdn/shop/collections/4_-_New_Balance_collection.jpg?v=1760514203&width=535", link: "/products/fila-ray" },
        ],
        'active-tab-3': [
          { title: "ABC SELECT X PUMA", img: "https://abc-mart.com.vn/cdn/shop/files/BANNER_SPEEDCAT_SMU.png?v=1763630030&width=1500", link: "/collections/abc-select" },
          { title: "ASICS GEL-1130", img: "https://abc-mart.com.vn/cdn/shop/collections/asics_kayano_rafflebanner_mobile.jpg?v=1764125320&width=535", link: "/collections/asics" },
          { title: "VANS EXCLUSIVE", img: "https://abc-mart.com.vn/cdn/shop/collections/PUMA.jpg?v=1763689996&width=535", link: "/collections/vans-exclusive" },
        ],
        'active-tab-4': [
          { title: "NO.1 BEST SELLER", img: "https://abc-mart.com.vn/cdn/shop/files/asics_life_walker.jpg?v=1765421454&width=1500", link: "/collections/best-seller" },
          { title: "NO.2 TRENDING", img: "https://abc-mart.com.vn/cdn/shop/files/12.12_EC.jpg?v=1765419048&width=535", link: "/collections/trending" },
          { title: "NO.3 RISING STAR", img: "https://abc-mart.com.vn/cdn/shop/collections/4_-_New_Balance_collection.jpg?v=1760514203&width=535", link: "/collections/rising-star" },
        ],
      }
    },
    { name: t('sale'), path: "/collections/sale-item", className: "text-red" },
    { name: t('blogs'), path: "/blogs/news" },
    { name: "SĂN XU", path: "/rewards", className: "text-green" },
  ], [t]);

  return (
    <div className="navbar-wrapper">
      {/* Top Bar */}
      <div className="top-bar">
        <div className="top-bar-content">
          <div className="top-bar-item">
            <CheckCircle size={16} className="top-bar-icon" />
            <span>{t('authentic')}</span>
          </div>
          <div className="top-bar-item">
            <Truck size={16} className="top-bar-icon" />
            <span>{t('free_ship')}</span>
          </div>
          <div className="top-bar-item">
            <CreditCard size={16} className="top-bar-icon" />
            <span>{t('member_voucher')}</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="main-header">
        <div className="header-container">

          {/* Logo */}
          <Link to="/" className="logo-wrapper">
            <img
              src={logo}
              alt="ABC-MART Việt Nam"
              className="logo-main"
            />
          </Link>



          {/* Desktop Nav */}
          <nav className={`desktop-nav ${isMenuOpen ? 'open' : ''}`}>
            <div className="mobile-header">
              <span>Menu</span>
              <button className="close-menu-btn" onClick={() => setIsMenuOpen(false)}>
                <X size={36} /> {/* 24 * 1.5 */}
              </button>
            </div>
            {navLinks.map((link) => (
              <div key={link.name} className="nav-item-wrapper">
                <Link
                  to={link.path}
                  className={`nav-link ${link.className || ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.prefix && <span className="text-red">{link.prefix}</span>}
                  {link.name}
                  {link.suffix && <span className="text-red">{link.suffix}</span>}
                  {link.type && <ChevronDown size={16} className="nav-arrow" />}
                </Link>

                {/* Dropdowns */}
                {link.type === 'list' && (
                  <div className="mega-menu mega-menu-list">
                    {link.data.map(item => (
                      <Link key={item.name} to={item.path} className="mega-menu-item">{item.name}</Link>
                    ))}
                  </div>
                )}

                {link.type === 'columns' && (
                  <div className="mega-menu mega-menu-columns">
                    {link.data.map(col => (
                      <div key={col.title} className="mega-menu-column">
                        <Link to={col.path} className="column-title">{col.title}</Link>
                        <div className="column-items">
                          {col.items.map(item => (
                            <Link key={item.name} to={item.path} className="column-item">{item.name}</Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {link.type === 'tabs' && (
                  <div className="mega-menu mega-menu-tabs">
                    <div className="tabs-header">
                      {link.tabs.map(tab => (
                        <span
                          key={tab.id}
                          className={`tab-link ${activeTab === tab.id ? 'active' : ''}`}
                          onMouseEnter={() => setActiveTab(tab.id)}
                        >
                          {tab.label}
                        </span>
                      ))}
                    </div>
                    <div className="tab-content">
                      {link.content[activeTab]?.map((item, idx) => (
                        <Link key={idx} to={item.link} className="tab-card">
                          <div className="img-wrapper">
                            <img src={item.img} alt={item.title} />
                          </div>
                          <span className="card-title">{item.title}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            ))}
          </nav>

          {/* Mobile Menu Button  */}
          <div className="mobile-header-controls">

          </div>


          {/* Search Bar */}
          <div className="search-bar">
            <input
              type="text"
              placeholder="Tìm kiếm"
              className="search-input"
              value={searchTerm}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={() => {
                if (searchTerm.length > 1 && suggestions.length > 0) setShowSuggestions(true);
              }}
            />
            <Search size={23} className="search-icon" onClick={handleSearch} style={{ cursor: 'pointer' }} />

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="search-suggestions">
                {suggestions.map(product => (
                  <Link
                    to={`/products/${product.id}`}
                    key={product.id}
                    className="suggestion-item"
                    onClick={() => {
                      setShowSuggestions(false);
                      setSearchTerm(''); // Optional: clear search on selection
                    }}
                  >
                    <img src={product.image} alt={product.name} className="suggestion-image" />
                    <div className="suggestion-info">
                      <span className="suggestion-name">{product.name}</span>
                      <span className="suggestion-price">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.salePrice || product.price)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Icons */}
          <div className="header-icons">
            {/* --- MỚI: Bắt đầu phần USER MENU --- */}
            <div className="icon-item user-menu-container" ref={userMenuRef}>
              <div
                className="user-icon-wrapper"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
              >
                <User size={25} className="icon" />
                {/* Hiển thị tên nếu đã đăng nhập */}
                {user && <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>
                  {user.user_metadata?.last_name || user.lastName || "Khách"}
                </span>}
              </div>

              {/* Menu con thả xuống */}
              {isUserMenuOpen && (
                <div className="user-dropdown" style={{ paddingTop: '20px' }}>

                  {user ? (
                    // Giao diện KHI ĐÃ ĐĂNG NHẬP
                    <>
                      <div className="user-dropdown-item" style={{ color: '#84cc16' }}>
                        Xin chào, {user.user_metadata?.first_name || user.firstName} {user.user_metadata?.last_name || user.lastName}
                      </div>
                      <Link to="/profile" className="user-dropdown-item">
                        Thông tin tài khoản
                      </Link>
                      <Link to="/orders" className="user-dropdown-item">
                        Đơn hàng của tôi
                      </Link>
                      <div
                        className="user-dropdown-item"
                        onClick={() => {
                          logout();
                          setIsUserMenuOpen(false);
                        }}
                        style={{ cursor: 'pointer', borderTop: '1px solid #eee' }}
                      >
                        Đăng xuất
                      </div>
                    </>
                  ) : (
                    // Giao diện KHI CHƯA ĐĂNG NHẬP (Cũ)
                    <>
                      <div className="user-dropdown-item">Theo dõi đơn hàng và thanh toán dễ dàng hơn</div>
                      <Link
                        to="/login"
                        className="user-dropdown-item"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <button className="auth-btn">Đăng nhập</button>
                      </Link>
                      <Link
                        to="/register"
                        className="user-dropdown-item"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <button className="cancel-btn">Tạo tài khoản</button>
                      </Link>
                    </>
                  )}

                </div>
              )}
            </div>
            <Link to="/cart" className="icon-item cart-item">
              <ShoppingBag size={25} className="icon" />
              <span className="cart-badge">{getCartCount()}</span>
            </Link>
            <div className="lang-select" ref={langMenuRef} onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}>
              <img
                src={language === 'VI' ? "https://upload.wikimedia.org/wikipedia/commons/2/21/Flag_of_Vietnam.svg" : "https://upload.wikimedia.org/wikipedia/commons/a/a4/Flag_of_the_United_States.svg"}
                alt={language}
                className="flag-icon"
              />
              <span className="lang-code">{language}</span>

              {isLangMenuOpen && (
                <div className="lang-dropdown">
                  <div
                    className="lang-dropdown-item"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLanguageChange('VI');
                    }}
                  >
                    <img src="https://upload.wikimedia.org/wikipedia/commons/2/21/Flag_of_Vietnam.svg" alt="VI"
                      className="flag-icon-sm" />
                    <span>Tiếng Việt</span>
                  </div>
                  <div
                    className="lang-dropdown-item"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLanguageChange('EN');
                    }}
                  >
                    <img src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Flag_of_the_United_States.svg"
                      alt="EN" className="flag-icon-sm" />
                    <span>English</span>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button className="mobile-menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <Menu size={32} />
            </button>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Navbar;
