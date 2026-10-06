import React from 'react';
import { Navigate } from 'react-router-dom';
import authService from '../../services/authService';
import { hasAnyRole } from '../../utils/roles';

const ProtectedRoute = ({ roles, children }) => {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !hasAnyRole(authService.getCurrentUser(), roles)) {
    return (
      <div className="card">
        <div className="card-body text-center">
          <i className="bi bi-shield-lock" style={{ fontSize: '5rem', color: '#dc3545' }}></i>
          <h3 className="mt-3">403 - Không có quyền truy cập</h3>
          <p className="text-muted">Tài khoản của bạn không được phép sử dụng chức năng này.</p>
          <a href="/" className="btn btn-primary">Về trang chủ</a>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
