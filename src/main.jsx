import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import './index.css'

import { LanguageProvider } from './context/LanguageContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Provider store={store}>
            <AuthProvider>
                <LanguageProvider>
                    <App />
                </LanguageProvider>
            </AuthProvider>
        </Provider>
    </React.StrictMode>,
)
