import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import HomePage from './components/Home/HomePage';
import CollectionPage from './components/Collection/CollectionPage';
import ProductDetail from './components/ProductDetail/ProductDetail';
import Login from './components/LogIn_SignUp/Login';
import SignUp from './components/LogIn_SignUp/SignUp';
import ForgotPassword from './components/LogIn_SignUp/ForgotPassword';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Routes with Navbar & Footer */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />

            {/* Placeholders for links in Navbar */}
            <Route path="/Home/thuong-hieu" element={<div style={{ padding: '50px', textAlign: 'center' }}><h2>Danh sách Thương Hiệu</h2></div>} />
            <Route path="/collections/:slug" element={<CollectionPage />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/blogs/news" element={<div style={{ padding: '50px', textAlign: 'center' }}><h2>Tin tức & Sự kiện</h2></div>} />
            <Route path="/Home/he-thong-cua-hang-abc-mart" element={<div style={{ padding: '50px', textAlign: 'center' }}><h2>Hệ thống cửa hàng</h2></div>} />
            <Route path="/cart" element={<div style={{ padding: '50px', textAlign: 'center' }}><h2>Giỏ hàng của bạn</h2></div>} />
          </Route>

          {/* Auth Routes (Standalone) */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<SignUp />} />
          <Route path="/forgot" element={<ForgotPassword />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
