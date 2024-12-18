// src/api/api.js
import axios from 'axios';

const API = axios.create({ baseURL: process.env.REACT_APP_API_URL });

// Function to check and refresh the token
const refreshAuthToken = async () => {
  const authToken = localStorage.getItem('authToken');
  if (authToken) {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/refresh-token`,
        {},
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      const newToken = data.authToken;

      // Update tokens in localStorage
      const tokens = JSON.parse(localStorage.getItem('authTokens')) || {};
      const tokenUsername = localStorage.getItem('tokenUsername');
      tokens[tokenUsername] = newToken;
      localStorage.setItem('authTokens', JSON.stringify(tokens));
      localStorage.setItem('authToken', newToken);
    } catch (error) {
      console.error('Error refreshing token:', error);
      // If token refresh fails, log the user out
      localStorage.removeItem('authToken');
      localStorage.removeItem('authTokens');
      localStorage.removeItem('tokenUsername');
      window.location.reload();
    }
  }
};

// Add interceptors to refresh token if expired
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      await refreshAuthToken();
      const newAuthToken = localStorage.getItem('authToken');
      if (newAuthToken) {
        originalRequest.headers['Authorization'] = `Bearer ${newAuthToken}`;
        return API(originalRequest);
      }
    }
    return Promise.reject(error);
  }
);

// Add activity listener to refresh tokens proactively
let activityTimeout;
const extendSession = () => {
  clearTimeout(activityTimeout);
  activityTimeout = setTimeout(refreshAuthToken, 10 * 60 * 1000); // 10 minutes
};
['mousemove', 'keydown', 'scroll', 'click'].forEach((event) =>
  window.addEventListener(event, extendSession)
);
  
export default API;

// export const fetchProductById = async (id) => {
//     return await axios.get(`/api/products/${id}`); // Update with actual API endpoint
//   };
// export const fetchProductById = (id) => API.get(`/api/products/${id}`,{ headers: { 'Content-Type': 'multipart/form-data' } });
export const fetchProducts = () => API.get('/api/products');
// export const fetchProductById = (id) => API.get(`/api/products/${id}`);
// export const fetchProductById = async (id) => {
//   const authToken = localStorage.getItem('authToken');
//   if (!authToken) {
//     throw new Error('No auth token found');
//   }

//   return await API.get(`/api/products/${id}`, {
//     headers: {
//       Authorization: `Bearer ${authToken}`,
//     },
//   });
// };
export const fetchProductById = async (id) => {
  const authToken = localStorage.getItem('authToken');
  const headers = authToken ? { Authorization: `Bearer ${authToken}` } : {};
  
  return await API.get(`/api/products/${id}`, { headers });
};


export const addProduct = (data) => API.post('/api/products/add/products', data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateProduct = (id, data) => API.put(`/api/products/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteProduct = (id) => API.delete(`/api/products/${id}`);
// export const likeProduct = (id) => API.post(`/api/products/${id}/like`);
export const likeProduct = async (id) => {
  const authToken = localStorage.getItem('authToken');
  const response = await API.post(`/api/products/${id}/like`, {}, {
    headers: { Authorization: `Bearer ${authToken}` },
  });
  return response.data;
};

// export const addComment = (id, comment) => API.post(`/api/products/${id}/comment`, comment);
export const addComment = async (id, comment) => {
  const authToken = localStorage.getItem('authToken');
  const headers = authToken ? { Authorization: `Bearer ${authToken}` } : {};

  try {
      const response = await API.post(`/api/products/${id}/comment`, comment, { headers });
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