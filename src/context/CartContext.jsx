import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { user } = useAuth();
    const [cartItems, setCartItems] = useState([]);

    // Load cart when user changes
    useEffect(() => {
        if (user) {
            try {
                // Key theo email hoặc ID để tách biệt giỏ hàng từng user
                const userCartKey = `cartItems_${user.email || user.id}`;
                const storedCart = localStorage.getItem(userCartKey);
                if (storedCart) {
                    setCartItems(JSON.parse(storedCart));
                } else {
                    setCartItems([]);
                }
            } catch (error) {
                console.error("Failed to load cart", error);
                setCartItems([]);
            }
        } else {
            setCartItems([]); // Clear cart (visual only) if no user, or keep it empty
        }
    }, [user]);

    // Save cart when cartItems changes (only if user logged in)
    useEffect(() => {
        if (user && cartItems.length >= 0) { // allow saving empty array
            const userCartKey = `cartItems_${user.email || user.id}`;
            localStorage.setItem(userCartKey, JSON.stringify(cartItems));
        }
    }, [cartItems, user]);

    const addToCart = (product, size, quantity = 1) => {
        if (!user) {
            alert("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!");
            // Optional: redirect logic logic here or in component
            // window.location.href = '/login'; 
            return;
        }

        setCartItems(prevItems => {
            const existingItemIndex = prevItems.findIndex(item => item.product.id === product.id && item.size === size);
            if (existingItemIndex > -1) {
                const newItems = [...prevItems];
                newItems[existingItemIndex].quantity += quantity;
                return newItems;
            } else {
                return [...prevItems, { product, size, quantity }];
            }
        });
        alert("Đã thêm vào giỏ hàng!");
    };

    const removeFromCart = (productId, size) => {
        setCartItems(prevItems => prevItems.filter(item => !(item.product.id === productId && item.size === size)));
    };

    const updateQuantity = (productId, size, newQuantity) => {
        if (newQuantity < 1) return;
        setCartItems(prevItems => prevItems.map(item =>
            (item.product.id === productId && item.size === size)
                ? { ...item, quantity: newQuantity }
                : item
        ));
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const getCartTotal = () => {
        return cartItems.reduce((total, item) => {
            const price = item.product.isSale ? item.product.salePrice : item.product.price;
            return total + (price * item.quantity);
        }, 0);
    };

    const getCartCount = () => {
        return cartItems.reduce((count, item) => count + item.quantity, 0);
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, getCartTotal, getCartCount }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
