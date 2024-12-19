// PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const SellerPrivateRoute = ({ children }) => {
  const authTokenSeller = localStorage.getItem('authTokenSeller'); // Retrieve token from localStorage

  if (!authTokenSeller) {
    // If no token, redirect to root with a state message
    return <Navigate to="/SellerLogin" state={{ message: 'Please login first.' }} />;
  }

  return children; // If token exists, allow access to the children components
};

export default SellerPrivateRoute;