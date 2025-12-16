import React, { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes để fix lỗi kiểm tra kiểu dữ liệu

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // Kiểm tra LocalStorage khi load trang để giữ trạng thái đăng nhập
    useEffect(() => {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('currentUser', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('currentUser');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Khai báo kiểu dữ liệu cho props children để tránh lỗi ESLint
AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const useAuth = () => useContext(AuthContext);