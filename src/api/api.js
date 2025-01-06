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
      localStorage.removeItem('userId');
      localStorage.removeItem('currentPage');
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
export const fetchProducts = (page = 1, limit = 12) => API.get(`/api/products?page=${page}&limit=${limit}`);
export const fetchProductsFilter = () => API.get('/api/products/filter');
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

export const fetchProductStockCount = async (id) => {
  const authToken = localStorage.getItem('authToken');
  const headers = authToken ? { Authorization: `Bearer ${authToken}` } : {};
  
  return await API.get(`/api/products/${id}/stock`, { headers });
};

export const addProduct = (data) => API.post('/api/products/add/products', data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateProduct = (id, data) => API.put(`/api/products/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteProduct = (id) => API.delete(`/api/products/${id}`);
// export const likeProduct = (id) => API.post(`/api/products/${id}/like`);
export const likeProduct = async (id) => {
  const authToken = localStorage.getItem('authToken');
  const response = await API.post(`/api/likes/${id}/like`, {}, {
    headers: { Authorization: `Bearer ${authToken}` },
  });
  return response.data;
};
export const checkIfLiked = async (id) => {
  const authToken = localStorage.getItem('authToken');
  const response = await API.get(`/api/likes/${id}/isLiked`, {
    headers: { Authorization: `Bearer ${authToken}` },
  });
  return response.data.isLiked;
};
export const fetchLikesCount = async (id) => {
  const response = await API.get(`/api/likes/${id}/count`);
  return response.data.likes;
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
export const addDeliveryAddresses = async (deliveryAddresses) => {
  const authToken = localStorage.getItem('authToken');
  const headers = authToken ? { Authorization: `Bearer ${authToken}` } : {};

  try {
      const response = await API.post('/api/auth/address', deliveryAddresses, { headers });
      return response.data;
  } catch (error) {
      console.error('Error adding deliveryAddresses:', error);
      throw error;
  }
};

export const fetchUserData = async () => {
  const authToken = localStorage.getItem('authToken');
  const headers = authToken ? { Authorization: `Bearer ${authToken}` } : {};

  try {
      const response = await API.post('/api/auth', { headers });
      return response.data;
  } catch (error) {
      console.error('Error adding deliveryAddresses:', error);
      throw error;
  }
};
// src/api/api.js
// export const fetchUserData0 = async () => API.get('/api/auth');
// export const saveAddress = async (address) => API.post('/api/auth/address', address);
export const fetchUserOrders0 = async () => API.get('/api/orders/my-orders');
export const fetchUserOrders = async () => {
  const authToken = localStorage.getItem("authToken");
  const headers = authToken ? { Authorization: `Bearer ${authToken}` } : {};
  return await API.get("/api/orders/my-orders", { headers });
};
export const fetchOrderById = async (id) => {
  const authToken = localStorage.getItem('authToken');
  const headers = authToken ? { Authorization: `Bearer ${authToken}` } : {};
  
  return await API.get(`/api/orders/${id}`, { headers });
};
// export const saveOrder = async (order) => API.post('/api/orders', order);
export const saveOrder = async (order) => {
  const authToken = localStorage.getItem("authToken");
  const headers = authToken ? { Authorization: `Bearer ${authToken}` } : {};
  return await API.post("/api/orders", order, { headers });
};

// Send Order Confirmation Email
export const sendOrderConfirmationEmail = async (payload) => {
  const authToken = localStorage.getItem("authToken");
  const headers = authToken ? { Authorization: `Bearer ${authToken}` } : {};
  return await API.post("/api/orders/send-email", payload, { headers });
};

export const fetchWishlist = async () => {
  const authToken = localStorage.getItem('authToken');
  return await API.get('/api/wishlist', {
      headers: {
          Authorization: `Bearer ${authToken}`,
      },
  });
};

export const checkProductInWishlist = async (productId) => {
  const authToken = localStorage.getItem('authToken');
  const response = await API.get(`/api/wishlist/is-in-wishlist/${productId}`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
  return response.data.isInWishlist;
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

// Get seller profile details
export const getUserDetails = async (userId) => {
  try {
    const response = await API.get(`/api/auth/user/${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete seller profile
export const deleteUserProfile = async (userId) => {
  try {
    const response = await API.delete(`/api/auth/user/${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
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