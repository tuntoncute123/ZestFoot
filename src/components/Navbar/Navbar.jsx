import React, { useEffect, useRef, useState } from 'react';
import { Search, User, ShoppingBag, Menu, X, CheckCircle, Truck, CreditCard, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import logo from '../../assets/logo.jpg';
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('active-tab-1');

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  // Language State
  const [language, setLanguage] = useState('VI');
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const langMenuRef = useRef(null);

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setIsLangMenuOpen(false);
    // Here you would typically trigger i18n change
    console.log(`Language changed to ${lang}`);
  };

  // --- MỚI: Xử lý click ra ngoài để đóng menu ---
  useEffect(() => {
    const handleClickOutside = (event) => {
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
  const navLinks = [
    {
      name: "THƯƠNG HIỆU",
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
      name: "DANH MỤC",
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
      name: "HÀNG MỚI",
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
        'active-tab-2': [],
        'active-tab-3': [],
        'active-tab-4': [],
      }
    },
    { name: "+ SALE +", path: "/collections/sale-item", className: "text-red" },
    { name: "BÀI VIẾT", path: "/blogs/news" },
    { name: "CỬA HÀNG", path: "/Home/he-thong-cua-hang-abc-mart" },
  ];

  return (
    <div className="navbar-wrapper">
      {/* Top Bar */}
      <div className="top-bar">
        <div className="top-bar-content">
          <div className="top-bar-item">
            <CheckCircle size={16} className="top-bar-icon" />
            <span>Hàng chính hãng 100%</span>
          </div>
          <div className="top-bar-item">
            <Truck size={16} className="top-bar-icon" />
            <span>Miễn phí ship cho đơn hàng từ 3 triệu</span>
          </div>
          <div className="top-bar-item">
            <CreditCard size={16} className="top-bar-icon" />
            <span>Trở thành hội viên nhận ngay voucher 200K</span>
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
              style={{ width: 'auto', height: '70px' }}
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
            />
            <Search size={23} className="search-icon" />
          </div>

          {/* Icons */}
          <div className="header-icons">
            {/* --- MỚI: Bắt đầu phần USER MENU --- */}
            <div className="icon-item user-menu-container" ref={userMenuRef}>
              <div
                className="user-icon-wrapper"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              >
                <User size={25} className="icon" />
              </div>

              {/* Menu con thả xuống */}
              {isUserMenuOpen && (
                <div className="user-dropdown">
                  <Link
                    to="/login"
                    className="user-dropdown-item"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    to="/register"
                    className="user-dropdown-item"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    Tạo tài khoản
                  </Link>
                </div>
              )}
            </div>
            <Link to="/cart" className="icon-item cart-item">
              <ShoppingBag size={25} className="icon" />
              <span className="cart-badge">0</span>
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
                    onClick={(e) => { e.stopPropagation(); handleLanguageChange('VI'); }}
                  >
                    <img src="https://upload.wikimedia.org/wikipedia/commons/2/21/Flag_of_Vietnam.svg" alt="VI" className="flag-icon-sm" />
                    <span>Tiếng Việt</span>
                  </div>
                  <div
                    className="lang-dropdown-item"
                    onClick={(e) => { e.stopPropagation(); handleLanguageChange('EN'); }}
                  >
                    <img src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Flag_of_the_United_States.svg" alt="EN" className="flag-icon-sm" />
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
