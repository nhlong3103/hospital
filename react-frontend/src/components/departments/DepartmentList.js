import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { departmentService } from '../../services/commonServices';

const DepartmentList = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    try {
      setLoading(true);
      const data = await departmentService.getAllDepartments();
      setDepartments(data);
    } catch (error) {
      console.error('Error loading departments:', error);
      alert('Lỗi khi tải danh sách khoa/phòng: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa khoa/phòng này?')) return;

    try {
      await departmentService.deleteDepartment(id);
      alert('Xóa khoa/phòng thành công!');
      loadDepartments();
    } catch (error) {
      alert('Lỗi khi xóa khoa/phòng: ' + (error.message || 'Unknown error'));
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Quản lý Khoa/Phòng</h2>
        <Link to="/departments/new" className="btn btn-primary">
          <i className="bi bi-plus-circle me-2"></i>Thêm khoa/phòng mới
        </Link>
      </div>

      <div className="card">
        <div className="card-body">
          {loading ? (
            <div className="text-center">
              <div className="spinner-border text-primary"></div>
            </div>
          ) : departments.length === 0 ? (
            <div className="text-center text-muted">
              <i className="bi bi-inbox" style={{ fontSize: '3rem' }}></i>
              <p className="mt-3">Không có khoa/phòng nào</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Mã</th>
                    <th>Tên khoa/phòng</th>
                    <th>Điện thoại</th>
                    <th>Trưởng khoa/phòng</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {departments.map((dept) => (
                    <tr key={dept.id}>
                      <td>{dept.code}</td>
                      <td>{dept.name}</td>
                      <td>{dept.phoneNumber || '-'}</td>
                      <td>{dept.headUserName || '-'}</td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          <Link
                            to={`/departments/edit/${dept.id}`}
                            className="btn btn-outline-primary"
                            title="Sửa"
                          >
                            <i className="bi bi-pencil"></i>
                          </Link>
                          <button
                            onClick={() => handleDelete(dept.id)}
                            className="btn btn-outline-danger"
                            title="Xóa"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
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

export default DepartmentList;
