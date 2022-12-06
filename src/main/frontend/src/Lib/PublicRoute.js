import React from 'react';
import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children }) => {
    const isLogin = window.localStorage.getItem("isLogin");

  return isLogin === "true" ? <Navigate to="/home"/> : children;
};

export default PublicRoute;