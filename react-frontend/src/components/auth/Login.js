import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import authService from '../../services/authService';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (authService.isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email.trim() || !formData.password) {
      setErrorMessage('Vui lòng nhập email và mật khẩu');
      return;
    }

    try {
      setLoading(true);
      await authService.login(formData.email.trim(), formData.password);
      window.location.href = '/';
    } catch (error) {
      console.error('Error logging in:', error);
      setErrorMessage(error.message || 'Đăng nhập thất bại');
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}
    >
      <div className="card" style={{ width: '420px' }}>
        <div className="card-body p-4">
          <div className="text-center mb-4">
            <i className="bi bi-hospital text-primary" style={{ fontSize: '3rem' }}></i>
            <h4 className="mt-2">Hospital Material Management</h4>
            <p className="text-muted mb-0">Đăng nhập để tiếp tục</p>
          </div>

          {errorMessage && (
            <div className="alert alert-danger" role="alert">
              <i className="bi bi-exclamation-triangle me-2"></i>
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
                placeholder="VD: warehouse@hospital.vn"
                autoFocus
              />
            </div>

            <div className="mb-4">
              <label className="form-label">Mật khẩu</label>
              <input
                type="password"
                name="password"
                className="form-control"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Đang đăng nhập...
                </>
              ) : (
                <>
                  <i className="bi bi-box-arrow-in-right me-2"></i>
                  Đăng nhập
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
