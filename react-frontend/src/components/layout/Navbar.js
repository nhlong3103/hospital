import React from 'react';
import authService from '../../services/authService';
import { userService } from '../../services/commonServices';
import { ROLE_LABELS } from '../../utils/roles';

const Navbar = () => {
  const user = authService.getCurrentUser();

  const handleChangePassword = async () => {
    const oldPassword = prompt('Nhập mật khẩu hiện tại:');
    if (!oldPassword) return;

    const newPassword = prompt('Nhập mật khẩu mới (tối thiểu 6 ký tự):');
    if (!newPassword) return;

    if (newPassword.length < 6) {
      alert('Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }

    try {
      await userService.changePassword(user.id, oldPassword, newPassword);
      alert('Đổi mật khẩu thành công!');
    } catch (error) {
      alert('Lỗi: ' + (error.message || 'Unknown error'));
    }
  };

  const handleLogout = () => {
    authService.logout();
    window.location.href = '/login';
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
      <div className="container-fluid">
        <a className="navbar-brand" href="/">
          <i className="bi bi-hospital me-2"></i>
          Hospital Material Management
        </a>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#!"
                id="userDropdown"
                role="button"
                data-bs-toggle="dropdown"
              >
                <i className="bi bi-person-circle"></i> {user?.fullName}
                <small className="ms-2 opacity-75">({ROLE_LABELS[user?.role] || user?.role})</small>
              </a>
              <ul className="dropdown-menu dropdown-menu-end">
                <li><span className="dropdown-item-text text-muted">{user?.email}</span></li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <button className="dropdown-item" onClick={handleChangePassword}>
                    <i className="bi bi-key me-2"></i>Đổi mật khẩu
                  </button>
                </li>
                <li>
                  <button className="dropdown-item" onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right me-2"></i>Đăng xuất
                  </button>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
