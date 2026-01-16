import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setWishlist, selectWishlistItems } from '../redux/wishlistSlice';

const useWishlistSync = () => {
    const dispatch = useDispatch();
    const wishlistItems = useSelector(selectWishlistItems);

    // Load effect removed - handled in slice initial state
    // keeping only save effect

    // Save to local storage on change
    useEffect(() => {
        localStorage.setItem('wishlist_redux', JSON.stringify(wishlistItems));
        // Also keep the old key updated to not lose data if switching back for some reason, 
        // or just let it become obsolete. Let's stick to new key mainly.
    }, [wishlistItems]);
};

export default useWishlistSync;
