import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import './index.css'

import { LanguageProvider } from './context/LanguageContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <AuthProvider>
            <LanguageProvider>
                <CartProvider>
                    <App />
                </CartProvider>
            </LanguageProvider>
        </AuthProvider>
    </React.StrictMode>,
)
