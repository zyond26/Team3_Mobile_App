// API/api.js
import axios from 'axios';

const BASE_URL = 'http://192.168.1.6:8000'; // ← IP máy backend + thiết bị thật cùng WiFi

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

// Thêm sản phẩm vào danh sách yêu thích
export const addToFavorites = async (userId, productId, platformId) => {
    return await api.post(
        '/api/favorite',
        {
            product_id: Number(productId),
            platform_id: Number(platformId),
        },
        {
            params: { user_id: Number(userId) },
        }
    );
};


// 🟡 Lấy danh sách sản phẩm yêu thích
export const getFavorites = async (userId) =>
    api.get(`/api/getFavorites`, { params: { user_id: userId } });

// remove 
export const removeFromFavorites = async (userId, productId) => {
    return await api.delete('/api/removeFavorite', {
        params: { user_id: userId, product_id: productId },
    });
};

// 👤 Lấy thông tin người dùng
export const getUserInfo = (userId) =>
    api.get('/api/getUserInfo', { params: { user_id: userId } });


// 🛠️ Cập nhật thông tin người dùng
export const updateUserInfo = (userId, payload) =>
    api.put(`/users/${userId}`, payload);


// 📥 Lưu lịch sử tìm kiếm
export const saveSearch = async (query, token) => {
    return await api.post('/history', { query }, {
        params: { token }
    });
};

// 📤 Lấy lịch sử
export const getHistory = async (token) => {
    return await api.get('/history', {
        params: { token }
    });
};


export default api;