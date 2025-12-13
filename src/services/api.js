import { brands, products } from '../data/db';

// Simulate a network delay (fake API latency)
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getBrands = async () => {
    await delay(300); // 300ms delay
    return brands;
};

export const getNewArrivals = async () => {
    await delay(300);
    return products.filter(p => p.isNew);
};

export const getSaleProducts = async () => {
    await delay(300);
    return products.filter(p => p.isSale);
};

export const getAllProducts = async () => {
    await delay(500);
    return products;
};

export const getAsicsProducts = async () => {
    await delay(300);
    return products.filter(p => p.isAsicsExclusive);
};

// Fallback for real API if needed later
// export const api = axios.create({ ... });
