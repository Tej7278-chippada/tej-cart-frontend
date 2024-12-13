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
  
export const fetchWishlist = async () => {
  const authToken = localStorage.getItem('authToken');
  return await API.get('/api/wishlist', {
      headers: {
          Authorization: `Bearer ${authToken}`,
      },
  });
};

export const addToWishlist = async (productId) => {
    const authToken = localStorage.getItem('authToken');
    return await API.post('/api/wishlist/add', { productId }, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        },
    });
};

export const removeFromWishlist = async (productId) => {
    const authToken = localStorage.getItem('authToken');
    return await API.post('/api/wishlist/remove', { productId }, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        },
    });
};

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