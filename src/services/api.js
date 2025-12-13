import axios from 'axios';

const API_URL = 'http://localhost:3000';

export const getBrands = async () => {
    try {
        const response = await axios.get(`${API_URL}/brands`);
        return response.data;
    } catch (error) {
        console.error("Error fetching brands:", error);
        return [];
    }
};

export const getNewArrivals = async () => {
    try {
        const response = await axios.get(`${API_URL}/products?isNew=true`);
        return response.data;
    } catch (error) {
        console.error("Error fetching new arrivals:", error);
        return [];
    }
};

export const getSaleProducts = async () => {
    try {
        const response = await axios.get(`${API_URL}/products?isSale=true`);
        return response.data;
    } catch (error) {
        console.error("Error fetching sale products:", error);
        return [];
    }
};

export const getAllProducts = async () => {
    try {
        const response = await axios.get(`${API_URL}/products`);
        return response.data;
    } catch (error) {
        console.error("Error fetching all products:", error);
        return [];
    }
};

export const getAsicsProducts = async () => {
    try {
        const response = await axios.get(`${API_URL}/products?brand=ASICS&isAsicsExclusive=true`);
        return response.data;
    } catch (error) {
        console.error("Error fetching ASICS products:", error);
        return [];
    }
};

export const getNews = async () => {
    try {
        const response = await axios.get(`${API_URL}/news`);
        return response.data;
    } catch (error) {
        console.error("Error fetching news:", error);
        return [];
    }
};

export const getFaqs = async () => {
    try {
        const response = await axios.get(`${API_URL}/faqs`);
        return response.data;
    } catch (error) {
        console.error("Error fetching FAQs:", error);
        return [];
    }
};
