import React, { useState, useEffect } from 'react';
import materialService from '../services/materialService';
import stockService from '../services/stockService';
import requisitionService from '../services/requisitionService';
import authService from '../services/authService';
import { ROLES, hasAnyRole } from '../utils/roles';

const Dashboard = () => {
  const user = authService.getCurrentUser();

  const [stats, setStats] = useState({
    totalMaterials: 0,
    expiringItems: 0,
    lowStockItems: 0,
    pendingRequisitions: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      
      const [materials, expiringStock, lowStock, requisitions] = await Promise.all([
        materialService.getAllMaterials(),
        stockService.getExpiringStock(30),
        stockService.getLowStock(10),
        requisitionService.getAllRequisitions({ status: 'PENDING' }),
      ]);

      setStats({
        totalMaterials: materials.length || 0,
        expiringItems: expiringStock.length || 0,
        lowStockItems: lowStock.length || 0,
        pendingRequisitions: requisitions.length || 0,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="mb-4">Dashboard</h2>
      
      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          <div className="row">
            <div className="col-md-3">
              <div className="card text-white bg-primary mb-3">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h5 className="card-title">Tổng vật tư</h5>
                      <h2>{stats.totalMaterials}</h2>
                    </div>
                    <i className="bi bi-box-seam" style={{ fontSize: '3rem' }}></i>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card text-white bg-warning mb-3">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h5 className="card-title">Sắp hết hạn</h5>
                      <h2>{stats.expiringItems}</h2>
                    </div>
                    <i className="bi bi-exclamation-triangle" style={{ fontSize: '3rem' }}></i>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card text-white bg-danger mb-3">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h5 className="card-title">Sắp hết</h5>
                      <h2>{stats.lowStockItems}</h2>
                    </div>
                    <i className="bi bi-box-arrow-down" style={{ fontSize: '3rem' }}></i>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card text-white bg-info mb-3">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h5 className="card-title">Phiếu chờ duyệt</h5>
                      <h2>{stats.pendingRequisitions}</h2>
                    </div>
                    <i className="bi bi-file-earmark-text" style={{ fontSize: '3rem' }}></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Thao tác nhanh</h5>
            </div>
            <div className="card-body">
              <div className="row">
                {hasAnyRole(user, [ROLES.ADMIN, ROLES.WAREHOUSE_KEEPER, ROLES.WAREHOUSE_MANAGER]) && (
                  <div className="col-md-3">
                    <a href="/materials/new" className="btn btn-outline-primary w-100 mb-2">
                      <i className="bi bi-plus-circle me-2"></i>
                      Thêm vật tư
                    </a>
                  </div>
                )}
                {hasAnyRole(user, [ROLES.DEPARTMENT_STAFF, ROLES.DEPARTMENT_HEAD]) && (
                  <div className="col-md-3">
                    <a href="/requisitions/new" className="btn btn-outline-success w-100 mb-2">
                      <i className="bi bi-file-earmark-plus me-2"></i>
                      Tạo phiếu lĩnh
                    </a>
                  </div>
                )}
                {hasAnyRole(user, [ROLES.WAREHOUSE_KEEPER]) && (
                  <>
                    <div className="col-md-3">
                      <a href="/purchase-plans/new" className="btn btn-outline-warning w-100 mb-2">
                        <i className="bi bi-clipboard-check me-2"></i>
                        Lập kế hoạch đặt hàng
                      </a>
                    </div>
                    <div className="col-md-3">
                      <a href="/goods-receipts/new" className="btn btn-outline-info w-100 mb-2">
                        <i className="bi bi-box-arrow-in-down me-2"></i>
                        Nhập kho
                      </a>
                    </div>
                  </>
                )}
                {hasAnyRole(user, [ROLES.ADMIN, ROLES.WAREHOUSE_KEEPER, ROLES.WAREHOUSE_MANAGER]) && (
                  <div className="col-md-3">
                    <a href="/stock" className="btn btn-outline-secondary w-100 mb-2">
                      <i className="bi bi-boxes me-2"></i>
                      Xem tồn kho
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
