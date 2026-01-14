import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import useCartSync from './hooks/useCartSync'; // Import hook
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
// Profile Components
import ProfileLayout from './components/Profile/ProfileLayout';
import UserProfile from './components/Profile/UserProfile';
import NotificationPage from './components/Profile/NotificationPage';
import Addresses from './components/Profile/Addresses';
import ChangePassword from './components/Profile/ChangePassword';

import BlogPage from './components/Blog/BlogPage';
import ArticleDetail from './components/Blog/ArticleDetail';

import SearchPage from './components/Search/SearchPage';
import Favorites from './components/Favorites/Favorites';
import { WishlistProvider } from './context/WishlistContext';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import ChatBot from './components/ChatBot/ChatBot';
import StoreLocator from './components/StoreLocator/StoreLocator';
import Membership from './components/Membership/Membership';
import RewardHub from './components/Rewards/RewardHub';
import LuckyWheel from './components/Rewards/LuckyWheel';
import SnakeGame from './components/Rewards/SnakeGame';
import ShoeMatchGame from './components/Rewards/ShoeMatchGame';
import TetrisGame from './components/Rewards/TetrisGame';

function App() {
  useCartSync(); // Sync cart
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      offset: 100,
    });
  }, []);

  return (
    <WishlistProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<HomePage />} />

              <Route path="/search" element={<SearchPage />} />

              <Route path="/checkout" element={<Checkout />} />

              {/* Profile Routes with Nested Layout */}
              <Route path="/profile" element={<ProfileLayout />}>
                <Route index element={<UserProfile />} />
                <Route path="notifications" element={<NotificationPage />} />
              </Route>

              {/* These remain top-level for now as they haven't been refactored into the layout */}
              <Route path="/addresses" element={<Addresses />} />
              <Route path="/change-password" element={<ChangePassword />} />

              <Route path="/Home/thuong-hieu" element={<div style={{ padding: '50px', textAlign: 'center' }}><h2>Danh sách Thương Hiệu</h2></div>} />
              <Route path="/collections/:slug" element={<CollectionPage />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/blogs/news" element={<BlogPage />} />
              <Route path="/blogs/news/:id" element={<ArticleDetail />} />
              <Route path="/stores" element={<StoreLocator />} />
              <Route path="/Home/he-thong-cua-hang-abc-mart" element={<StoreLocator />} />
              <Route path="/rewards" element={<RewardHub />} />
              <Route path="/rewards/lucky-wheel" element={<LuckyWheel onClose={() => window.history.back()} />} />
              <Route path="/rewards/snake" element={<SnakeGame onClose={() => window.history.back()} />} />
              <Route path="/rewards/shoe-match" element={<ShoeMatchGame onClose={() => window.history.back()} />} />
              <Route path="/rewards/tetris" element={<TetrisGame onClose={() => window.history.back()} />} />
              <Route path="/favorites" element={<Favorites />} />


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
          <Membership />
        </div>
      </Router>
    </WishlistProvider>
  );
}

export default App;
