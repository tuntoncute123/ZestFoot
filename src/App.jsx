import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* Add more routes primarily here */}
          <Route path="/cart" element={<div style={{ padding: '100px', textAlign: 'center' }}>Cart Page Placeholder</div>} />
          <Route path="/login" element={<div style={{ padding: '100px', textAlign: 'center' }}>Login Page Placeholder</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
