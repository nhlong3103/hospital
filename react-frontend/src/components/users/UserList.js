import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { userService } from '../../services/commonServices';
import authService from '../../services/authService';
import { ROLE_LABELS } from '../../utils/roles';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterRole, setFilterRole] = useState('');

  const currentUser = authService.getCurrentUser();

  useEffect(() => {
    loadUsers();
  }, [filterRole]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const params = filterRole ? { role: filterRole } : {};
      const data = await userService.getAllUsers(params);
      setUsers(data);
    } catch (error) {
      console.error('Error loading users:', error);
      alert('Lỗi khi tải danh sách người dùng: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'ACTIVE': { class: 'bg-success', text: 'Đang hoạt động' },
      'INACTIVE': { class: 'bg-secondary', text: 'Không hoạt động' },
      'LOCKED': { class: 'bg-danger', text: 'Bị khóa' },
    };
    const s = statusMap[status] || { class: 'bg-secondary', text: status };
    return <span className={`badge ${s.class}`}>{s.text}</span>;
  };

  const handleToggleStatus = async (user) => {
    const newStatus = user.status === 'ACTIVE' ? 'LOCKED' : 'ACTIVE';
    const message = newStatus === 'LOCKED'
      ? `Xác nhận khóa tài khoản ${user.email}?`
      : `Xác nhận mở khóa tài khoản ${user.email}?`;

    if (!window.confirm(message)) return;

    try {
      await userService.updateStatus(user.id, newStatus);
      alert('Cập nhật trạng thái thành công!');
      loadUsers();
    } catch (error) {
      alert('Lỗi: ' + (error.message || 'Unknown error'));
    }
  };

  const handleResetPassword = async (user) => {
    const newPassword = prompt(`Nhập mật khẩu mới cho ${user.email} (tối thiểu 6 ký tự):`);
    if (!newPassword) return;

    if (newPassword.length < 6) {
      alert('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    try {
      await userService.resetPassword(user.id, newPassword);
      alert('Đặt lại mật khẩu thành công!');
    } catch (error) {
      alert('Lỗi: ' + (error.message || 'Unknown error'));
    }
  };

  const handleDelete = async (user) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa người dùng ${user.email}?`)) return;

    try {
      await userService.deleteUser(user.id);
      alert('Xóa người dùng thành công!');
      loadUsers();
    } catch (error) {
      alert('Lỗi khi xóa người dùng: ' + (error.message || 'Unknown error'));
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Quản lý Người dùng</h2>
        <Link to="/users/new" className="btn btn-primary">
          <i className="bi bi-plus-circle me-2"></i>Thêm người dùng mới
        </Link>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <div className="row">
            <div className="col-md-4">
              <label className="form-label">Lọc theo vai trò:</label>
              <select
                className="form-select"
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
              >
                <option value="">Tất cả</option>
                {Object.keys(ROLE_LABELS).map(role => (
                  <option key={role} value={role}>{ROLE_LABELS[role]}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          {loading ? (
            <div className="text-center">
              <div className="spinner-border text-primary"></div>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center text-muted">
              <i className="bi bi-inbox" style={{ fontSize: '3rem' }}></i>
              <p className="mt-3">Không có người dùng nào</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Họ tên</th>
                    <th>Email</th>
                    <th>Vai trò</th>
                    <th>Khoa/Phòng</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.fullName}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className="badge bg-secondary">{ROLE_LABELS[user.role] || user.role}</span>
                      </td>
                      <td>{user.departmentName || '-'}</td>
                      <td>{getStatusBadge(user.status)}</td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          <Link
                            to={`/users/edit/${user.id}`}
                            className="btn btn-outline-primary"
                            title="Sửa"
                          >
                            <i className="bi bi-pencil"></i>
                          </Link>
                          <button
                            onClick={() => handleResetPassword(user)}
                            className="btn btn-outline-secondary"
                            title="Đặt lại mật khẩu"
                          >
                            <i className="bi bi-key"></i>
                          </button>
                          {user.id !== currentUser?.id && (
                            <>
                              <button
                                onClick={() => handleToggleStatus(user)}
                                className="btn btn-outline-warning"
                                title={user.status === 'ACTIVE' ? 'Khóa tài khoản' : 'Mở khóa'}
                              >
                                <i className={`bi ${user.status === 'ACTIVE' ? 'bi-lock' : 'bi-unlock'}`}></i>
                              </button>
                              <button
                                onClick={() => handleDelete(user)}
                                className="btn btn-outline-danger"
                                title="Xóa"
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserList;
