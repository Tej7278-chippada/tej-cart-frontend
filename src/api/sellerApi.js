// src/api/sellerApi.js
import axios from 'axios';

const API = axios.create({ baseURL: process.env.REACT_APP_API_URL });

// Function to check and refresh the token
const refreshAuthTokenSeller = async () => {
  const authTokenSeller = localStorage.getItem('authTokenSeller');
  if (authTokenSeller) {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/sellerRefresh-token`,
        {},
        { headers: { Authorization: `Bearer ${authTokenSeller}` } }
      );
      const newToken = data.authTokenSeller;

      // Update tokens in localStorage
      const tokensSeller = JSON.parse(localStorage.getItem('authTokensSeller')) || {};
      const tokenSellerUsername = localStorage.getItem('tokenSellerUsername');
      tokensSeller[tokenSellerUsername] = newToken;
      localStorage.setItem('authTokensSeller', JSON.stringify(tokensSeller));
      localStorage.setItem('authTokenSeller', newToken);
    } catch (error) {
      console.error('Error refreshing token:', error);
      // If token refresh fails, log the user out
      localStorage.removeItem('authTokenSeller');
      localStorage.removeItem('authTokensSeller');
      localStorage.removeItem('tokenSellerUsername');
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
      await refreshAuthTokenSeller();
      const newAuthToken = localStorage.getItem('authTokenSeller');
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
  activityTimeout = setTimeout(refreshAuthTokenSeller, 10 * 60 * 1000); // 10 minutes
};
['mousemove', 'keydown', 'scroll', 'click'].forEach((event) =>
  window.addEventListener(event, extendSession)
);
  
export default API;


// Seller-specific product routes
// export const fetchSellerProducts = () => {
//   const authTokenSeller = localStorage.getItem('authTokenSeller');
//   const headers = authTokenSeller ? { Authorization: `Bearer ${authTokenSeller}` } : {};
//   return API.get('/api/productSeller', { headers });
// };

// export const fetchSellerProductById = (id) => {
//   const authTokenSeller = localStorage.getItem('authTokenSeller');
//   const headers = authTokenSeller ? { Authorization: `Bearer ${authTokenSeller}` } : {};
//   return API.get(`/api/productSeller/${id}`, { headers });
// };

export const addSellerProduct = (data) => {
  const authTokenSeller = localStorage.getItem('authTokenSeller');
  const headers = {
    'Content-Type': 'multipart/form-data',
    Authorization: `Bearer ${authTokenSeller}`,
  };
  return API.post('/api/productSeller/add', data, { headers });
};

export const updateSellerProduct = (id, data) => {
  const authTokenSeller = localStorage.getItem('authTokenSeller');
  const headers = {
    'Content-Type': 'multipart/form-data',
    Authorization: `Bearer ${authTokenSeller}`,
  };
  return API.put(`/api/productSeller/${id}`, data, { headers });
};

export const deleteSellerProduct = (id) => {
  const authTokenSeller = localStorage.getItem('authTokenSeller');
  const headers = authTokenSeller ? { Authorization: `Bearer ${authTokenSeller}` } : {};
  return API.delete(`/api/productSeller/${id}`, { headers });
};

// Fetch seller's own products
export const fetchMySellerProducts = () => {
  const authTokenSeller = localStorage.getItem('authTokenSeller');
  const headers = authTokenSeller ? { Authorization: `Bearer ${authTokenSeller}` } : {};
  return API.get('/api/productSeller/my-products', { headers });
};

// Public route to fetch all products with seller details
export const fetchAllProducts = () => API.get('/api/productSeller');