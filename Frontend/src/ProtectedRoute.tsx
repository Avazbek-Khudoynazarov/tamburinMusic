import React, { useRef } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

function ProtectedRoute({ isAuthenticated, redirectPath = '/auth/login' }) {
  const alerted = useRef(false);

  if (!isAuthenticated && !alerted.current) {
    alerted.current = true;
    alert("회원 전용 페이지 입니다.");
    return <Navigate to={redirectPath} replace />;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to={redirectPath} replace />;
}

export default ProtectedRoute;