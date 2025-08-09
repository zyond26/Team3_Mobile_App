import axios from 'axios';

export const BASE_URL = "https://pricewiseapp.onrender.com";

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
});

export const getAllProductPlatforms = () => axios.get(BASE_URL);
export const getProductPlatformById = (id: number) => axios.get(`${BASE_URL}/${id}`);
export const createProductPlatform = (data: any) => axios.post(BASE_URL, data);
export const updateProductPlatform = (id: number, data: any) => axios.put(`${BASE_URL}/${id}`, data);
export const deleteProductPlatform = (id: number) => axios.delete(`${BASE_URL}/${id}`);

// Tìm kiếm sản phẩm theo keyword
export const search = async (keyword) => {
  return await api.get(`/search?keyword=${encodeURIComponent(keyword)}`);
};

// Thêm sản phẩm vào danh sách yêu thích
export const addToFavorites = (productId: number, userId: number, productPlatformId: number) => {
  return axios.post(`${BASE_URL}/favorites/add`, {
    product_id: productId,
    user_id: userId,
    product_platform_id: productPlatformId,
  });
};

// export const removeFromFavorites = (productId: number, userId: number, productPlatformId: number) => {
//   return axios.delete(`${BASE_URL}/favorites/remove`, {
//     data: {
//       product_id: productId,
//       user_id: userId,
//       product_platform_id: productPlatformId,
//     },
//   });
// };

export const removeFromFavorites = (productId: number, userId: number, productPlatformId: number) => {
  return axios.delete(`${BASE_URL}/favorites/remove`, {
    params: {
      product_id: productId,
      user_id: userId,
      product_platform_id: productPlatformId,
    },
  });
};

