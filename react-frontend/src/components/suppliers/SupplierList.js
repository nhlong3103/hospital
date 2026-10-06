import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supplierService } from '../../services/commonServices';
import authService from '../../services/authService';
import { ROLES, hasAnyRole } from '../../utils/roles';

const SupplierList = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const user = authService.getCurrentUser();
  const canDelete = hasAnyRole(user, [ROLES.ADMIN, ROLES.WAREHOUSE_MANAGER]);

  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    try {
      setLoading(true);
      const data = await supplierService.getAllSuppliers();
      setSuppliers(data);
    } catch (error) {
      console.error('Error loading suppliers:', error);
      alert('Lỗi khi tải danh sách nhà cung cấp: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      loadSuppliers();
      return;
    }

    try {
      setLoading(true);
      const data = await supplierService.searchSuppliers(searchTerm);
      setSuppliers(data);
    } catch (error) {
      console.error('Error searching suppliers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa nhà cung cấp này?')) return;

    try {
      await supplierService.deleteSupplier(id);
      alert('Xóa nhà cung cấp thành công!');
      loadSuppliers();
    } catch (error) {
      alert('Lỗi khi xóa nhà cung cấp: ' + (error.message || 'Unknown error'));
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Quản lý Nhà cung cấp</h2>
        <Link to="/suppliers/new" className="btn btn-primary">
          <i className="bi bi-plus-circle me-2"></i>Thêm nhà cung cấp mới
        </Link>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <form onSubmit={handleSearch} className="row g-3">
            <div className="col-md-10">
              <input
                type="text"
                className="form-control"
                placeholder="Tìm kiếm nhà cung cấp theo tên..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="col-md-2">
              <button type="submit" className="btn btn-primary w-100">
                <i className="bi bi-search me-2"></i>Tìm
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          {loading ? (
            <div className="text-center">
              <div className="spinner-border text-primary"></div>
            </div>
          ) : suppliers.length === 0 ? (
            <div className="text-center text-muted">
              <i className="bi bi-inbox" style={{ fontSize: '3rem' }}></i>
              <p className="mt-3">Không có nhà cung cấp nào</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Mã</th>
                    <th>Tên nhà cung cấp</th>
                    <th>Điện thoại</th>
                    <th>Email</th>
                    <th>Địa chỉ</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {suppliers.map((supplier) => (
                    <tr key={supplier.id}>
                      <td>{supplier.code}</td>
                      <td>{supplier.name}</td>
                      <td>{supplier.phoneNumber || '-'}</td>
                      <td>{supplier.email || '-'}</td>
                      <td>{supplier.address || '-'}</td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          <Link
                            to={`/suppliers/edit/${supplier.id}`}
                            className="btn btn-outline-primary"
                            title="Sửa"
                          >
                            <i className="bi bi-pencil"></i>
                          </Link>
                          {canDelete && (
                            <button
                              onClick={() => handleDelete(supplier.id)}
                              className="btn btn-outline-danger"
                              title="Xóa"
                            >
                              <i className="bi bi-trash"></i>
                            </button>
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

export default SupplierList;
