// src/api/api.js
import axios from 'axios';

const API = axios.create({ baseURL: process.env.REACT_APP_API_URL });

export const fetchProducts = () => API.get('/api/products');
export const addProduct = (data) => API.post('/api/products/add/products', data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateProduct = (id, data) => API.put(`/api/products/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteProduct = (id) => API.delete(`/api/products/${id}`);
export const likeProduct = (id) => API.post(`/api/products/${id}/like`);
export const addComment = (id, comment) => API.post(`/api/products/${id}/comment`, comment);
