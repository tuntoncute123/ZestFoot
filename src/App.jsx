import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/Home/HomePage';
import Login from './components/LogIn_SignUp/Login';
import SignUp from './components/LogIn_SignUp/SignUp';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* Add more routes primarily here */}
          <Route path="/cart" element={<div style={{ padding: '100px', textAlign: 'center' }}>Cart Page Placeholder</div>} />
            <Route path="/register" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
