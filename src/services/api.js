import axios from 'axios';

const API_URL = 'http://localhost:8080/api'; // Example Spring Boot URL

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getProducts = async () => {
    // Placeholder for real API call
    // const response = await api.get('/products');
    // return response.data;
    return [];
};
