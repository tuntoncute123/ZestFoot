import React, { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
    // Store array of product IDs
    const [wishlist, setWishlist] = useState(() => {
        const stored = localStorage.getItem('wishlist');
        return stored ? JSON.parse(stored) : [];
    });

    useEffect(() => {
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }, [wishlist]);

    const addToWishlist = (productId) => {
        if (!wishlist.includes(productId)) {
            setWishlist((prev) => [...prev, productId]);
        }
    };

    const removeFromWishlist = (productId) => {
        setWishlist((prev) => prev.filter((id) => id !== productId));
    };

    const isInWishlist = (productId) => {
        return wishlist.includes(productId);
    };

    const toggleWishlist = (productId) => {
        if (isInWishlist(productId)) {
            removeFromWishlist(productId);
        } else {
            addToWishlist(productId);
        }
    };

    return (
        <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist, toggleWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
};
