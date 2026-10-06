import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import materialService from '../../services/materialService';
import authService from '../../services/authService';
import { ROLES, hasAnyRole } from '../../utils/roles';

const MaterialList = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState(null);

  const user = authService.getCurrentUser();
  const canManage = hasAnyRole(user, [ROLES.ADMIN, ROLES.WAREHOUSE_KEEPER, ROLES.WAREHOUSE_MANAGER]);
  const canDelete = hasAnyRole(user, [ROLES.ADMIN, ROLES.WAREHOUSE_MANAGER]);

  useEffect(() => {
    loadMaterials();
  }, []);

  const loadMaterials = async () => {
    try {
      setLoading(true);
      const data = await materialService.getAllMaterials();
      setMaterials(data);
    } catch (error) {
      console.error('Error loading materials:', error);
      alert('Lỗi khi tải danh sách vật tư: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      loadMaterials();
      return;
    }
    
    try {
      setLoading(true);
      const data = await materialService.searchMaterials(searchTerm);
      setMaterials(data);
    } catch (error) {
      console.error('Error searching materials:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa vật tư này?')) {
      return;
    }
    
    try {
      await materialService.deleteMaterial(id);
      alert('Xóa vật tư thành công!');
      loadMaterials();
    } catch (error) {
      console.error('Error deleting material:', error);
      alert('Lỗi khi xóa vật tư: ' + (error.message || 'Unknown error'));
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Quản lý Vật tư</h2>
        {canManage && (
          <Link to="/materials/new" className="btn btn-primary">
            <i className="bi bi-plus-circle me-2"></i>
            Thêm vật tư mới
          </Link>
        )}
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <form onSubmit={handleSearch} className="row g-3">
            <div className="col-md-10">
              <input
                type="text"
                className="form-control"
                placeholder="Tìm kiếm vật tư theo tên..."
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
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : materials.length === 0 ? (
            <div className="text-center text-muted">
              <i className="bi bi-inbox" style={{ fontSize: '3rem' }}></i>
              <p className="mt-3">Không có vật tư nào</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Mã</th>
                    <th>Tên vật tư</th>
                    <th>Đơn vị</th>
                    <th>Nhà sản xuất</th>
                    <th>Loại</th>
                    <th>Tồn kho</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {materials.map((material) => (
                    <tr key={material.id}>
                      <td>{material.code}</td>
                      <td>{material.name}</td>
                      <td>{material.unit}</td>
                      <td>{material.manufacturer || '-'}</td>
                      <td>
                        <span className="badge bg-secondary">{material.category}</span>
                      </td>
                      <td>
                        <strong className={material.totalStock < 10 ? 'text-danger' : 'text-success'}>
                          {material.totalStock || 0}
                        </strong>
                      </td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          <Link 
                            to={`/materials/${material.id}`} 
                            className="btn btn-outline-info"
                            title="Xem chi tiết"
                          >
                            <i className="bi bi-eye"></i>
                          </Link>
                          {canManage && (
                            <Link
                              to={`/materials/edit/${material.id}`}
                              className="btn btn-outline-primary"
                              title="Sửa"
                            >
                              <i className="bi bi-pencil"></i>
                            </Link>
                          )}
                          {canDelete && (
                            <button
                              onClick={() => handleDelete(material.id)}
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

export default MaterialList;
