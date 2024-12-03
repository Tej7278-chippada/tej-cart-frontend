// src/api/api.js
import axios from 'axios';

const API = axios.create({ baseURL: process.env.REACT_APP_API_URL });

export const fetchProducts = () => API.get('/api/products');
export const addProduct = (data) => API.post('/api/products/add/products', data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateProduct = (id, data) => API.put(`/api/products/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteProduct = (id) => API.delete(`/api/products/${id}`);
export const likeProduct = (id) => API.post(`/api/products/${id}/like`);
// export const addComment = (id, comment) => API.post(`/api/products/${id}/comment`, comment);
export const addComment = async (id, comment) => {
    try {
      const response = await API.post(`/api/products/${id}/comment`, comment);
      return response.data;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  };
  export const fetchProducts1 = async (id) => {
    try {
      const response = await API.get(`/api/products/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  };
export const addToWishlist = (data) => API.post('/api/wishlist/add', data);
export const removeFromWishlist = (data) => API.post('/api/wishlist/remove', data);
export const fetchWishlist = (userId) => API.get(`/api/wishlist/${userId}`);

// export const fetchWishlist = async () => {
//   const response = await fetch('/api/wishlist', {
//     headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
//   });
//   if (!response.ok) throw new Error('Failed to fetch wishlist');
//   return response.json();
// };

// export const getOffers = () => API.get('/api/offers');
// export const addOffer = (data) => API.post('/api/offers', data, { headers: { 'Content-Type': 'multipart/form-data' } });
// export const updateOffer = (id, data) => API.put(`/api/offers/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
// export const deleteOffer = (id) => API.delete(`/api/offers/${id}`);

// Offers-related APIs
// export const getOffers = () => API.get('/api/offers');
// // export const addOffer = (data) => API.post('/api/offers', data, { headers: { 'Content-Type': 'multipart/form-data' } });
// export const updateOffer = (id, data) => API.put(`/api/offers/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
// export const deleteOffer = (id) => API.delete(`/api/offers/${id}`);
// export const addOffer = async (offer) => {
//   const response = await axios.post("/api/offers/add/offer", offer);
//   return response;
// };