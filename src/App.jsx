import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import HomePage from './components/Home/HomePage';
import CollectionPage from './components/Collection/CollectionPage';
import ProductDetail from './components/ProductDetail/ProductDetail';
import Login from './components/LogIn_SignUp/Login';
import SignUp from './components/LogIn_SignUp/SignUp';
import ForgotPassword from './components/LogIn_SignUp/ForgotPassword';

import Checkout from './components/Checkout/Checkout';
import Cart from './components/Cart/Cart';
import PaymentGateway from './components/Payment/PaymentGateway';
import OrderHistory from './components/Order/OrderHistory';
import OrderDetail from './components/Order/OrderDetail';
import Profile from './components/Profile/Profile';
import Addresses from './components/Profile/Addresses';

import BlogPage from './components/Blog/BlogPage';
import ArticleDetail from './components/Blog/ArticleDetail';

import SearchPage from './components/Search/SearchPage';
import { WishlistProvider } from './context/WishlistContext';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import ChatBot from './components/ChatBot/ChatBot';

function App() {
  return (
    <WishlistProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<HomePage />} />

              <Route path="/search" element={<SearchPage />} />

              <Route path="/checkout" element={<Checkout />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/addresses" element={<Addresses />} />

              <Route path="/Home/thuong-hieu" element={<div style={{ padding: '50px', textAlign: 'center' }}><h2>Danh sách Thương Hiệu</h2></div>} />
              <Route path="/collections/:slug" element={<CollectionPage />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/blogs/news" element={<BlogPage />} />
              <Route path="/blogs/news/:id" element={<ArticleDetail />} />
              <Route path="/Home/he-thong-cua-hang-abc-mart" element={<div style={{ padding: '50px', textAlign: 'center' }}><h2>Hệ thống cửa hàng</h2></div>} />


              <Route path="/cart" element={<Cart />} />
              <Route path="/orders" element={<OrderHistory />} />
              <Route path="/orders/:id" element={<OrderDetail />} />

              <Route path="/payment-gateway/:method" element={<PaymentGateway />} />
            </Route>

            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<SignUp />} />
            <Route path="/forgot" element={<ForgotPassword />} />
          </Routes>
          <ScrollToTop />
          <ChatBot />
        </div>
      </Router>
    </WishlistProvider>
  );
}

export default App;
