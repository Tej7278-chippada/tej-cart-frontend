// PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const authToken = localStorage.getItem('authToken'); // Retrieve token from localStorage

  if (!authToken) {
    // If no token, redirect to root with a state message
    return <Navigate to="/" state={{ message: 'Please login first.' }} />;
  }

  return children; // If token exists, allow access to the children components
};

export default PrivateRoute;
