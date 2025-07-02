// API/api.js

import axios from 'axios';

// const BASE_URL = 'http://10.0.2.2:8000'; // ← Dùng Android Emulator
// const BASE_URL = 'http://localhost:8000'; // ← Dùng trên web/iOS simulator
const BASE_URL = 'http://192.168.1.6:8000'; // ← Dùng thiết bị thật (nối chung WiFi)

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
});

// 🟢 Đăng ký người dùng
export const register = async (data) => {
    return await api.post('/register', data);
};

// 🔵 Đăng nhập
export const login = async (data) => {
    return await api.post('/login', data);
};
// 🔍 Tìm kiếm sản phẩm theo keyword
export const search = async (keyword) => {
    return await api.get(`/search?keyword=${encodeURIComponent(keyword)}`);
};


// API/api.ts
export const addToFavorites = (userId, productId) =>
    axios.post(`/favorites/${userId}/${productId}`);

