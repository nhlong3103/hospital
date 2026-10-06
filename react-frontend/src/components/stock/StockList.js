import React, { useState, useEffect } from 'react';
import materialService from '../../services/materialService';
import stockService from '../../services/stockService';
import authService from '../../services/authService';
import { ROLES, hasAnyRole } from '../../utils/roles';
import { formatDate } from '../../utils/format';

const StockList = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [batches, setBatches] = useState([]);
  const [batchLoading, setBatchLoading] = useState(false);

  const user = authService.getCurrentUser();
  const canUpdateLocation = hasAnyRole(user, [ROLES.WAREHOUSE_KEEPER, ROLES.WAREHOUSE_MANAGER]);

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
      alert('Lỗi khi tải tồn kho: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const loadBatches = async (materialId) => {
    try {
      setBatchLoading(true);
      const data = await stockService.getStocksByMaterial(materialId);
      setBatches(data);
    } catch (error) {
      console.error('Error loading batches:', error);
      alert('Lỗi khi tải chi tiết lô: ' + (error.message || 'Unknown error'));
    } finally {
      setBatchLoading(false);
    }
  };

  const toggleExpand = (materialId) => {
    if (expandedId === materialId) {
      setExpandedId(null);
      return;
    }
    setExpandedId(materialId);
    loadBatches(materialId);
  };

  const handleUpdateLocation = async (stock) => {
    const location = prompt('Nhập vị trí lưu kho mới:', stock.storageLocation || '');
    if (location === null) return;

    try {
      await stockService.updateStorageLocation(stock.id, location);
      alert('Cập nhật vị trí thành công!');
      loadBatches(expandedId);
    } catch (error) {
      alert('Lỗi: ' + (error.message || 'Unknown error'));
    }
  };

  const getExpiryBadge = (expiryDate) => {
    if (!expiryDate) {
      return <span className="text-muted">-</span>;
    }

    const days = Math.ceil((new Date(expiryDate) - new Date()) / (1000 * 60 * 60 * 24));

    if (days < 0) {
      return <span className="badge bg-danger">{formatDate(expiryDate)} (đã hết hạn)</span>;
    }
    if (days <= 30) {
      return <span className="badge bg-warning text-dark">{formatDate(expiryDate)} (còn {days} ngày)</span>;
    }
    return <span>{formatDate(expiryDate)}</span>;
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Tồn kho</h2>
      </div>

      <div className="card">
        <div className="card-body">
          {loading ? (
            <div className="text-center">
              <div className="spinner-border text-primary"></div>
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
                    <th>Tổng tồn</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {materials.map((material) => (
                    <React.Fragment key={material.id}>
                      <tr>
                        <td>{material.code}</td>
                        <td>{material.name}</td>
                        <td>{material.unit}</td>
                        <td>
                          <strong className={material.totalStock < 10 ? 'text-danger' : 'text-success'}>
                            {material.totalStock || 0}
                          </strong>
                        </td>
                        <td>
                          <button
                            onClick={() => toggleExpand(material.id)}
                            className="btn btn-outline-info btn-sm"
                          >
                            <i className={`bi ${expandedId === material.id ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
                            {' '}Theo lô
                          </button>
                        </td>
                      </tr>

                      {expandedId === material.id && (
                        <tr>
                          <td colSpan="5" className="bg-light">
                            {batchLoading ? (
                              <div className="text-center">
                                <div className="spinner-border spinner-border-sm text-primary"></div>
                              </div>
                            ) : batches.length === 0 ? (
                              <div className="text-muted">Chưa có lô hàng nào</div>
                            ) : (
                              <table className="table table-sm table-bordered mb-0">
                                <thead>
                                  <tr>
                                    <th>Số lô</th>
                                    <th>Hạn dùng</th>
                                    <th>Số lượng</th>
                                    <th>Vị trí</th>
                                    {canUpdateLocation && <th>Thao tác</th>}
                                  </tr>
                                </thead>
                                <tbody>
                                  {batches.map((stock) => (
                                    <tr key={stock.id}>
                                      <td>{stock.batchNumber}</td>
                                      <td>{getExpiryBadge(stock.expiryDate)}</td>
                                      <td>{stock.quantity}</td>
                                      <td>{stock.storageLocation || '-'}</td>
                                      {canUpdateLocation && (
                                        <td>
                                          <button
                                            onClick={() => handleUpdateLocation(stock)}
                                            className="btn btn-outline-primary btn-sm"
                                            title="Cập nhật vị trí"
                                          >
                                            <i className="bi bi-pencil"></i>
                                          </button>
                                        </td>
                                      )}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            )}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
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

export default StockList;
