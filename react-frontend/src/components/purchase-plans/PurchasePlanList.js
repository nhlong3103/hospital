import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import purchasePlanService from '../../services/purchasePlanService';
import authService from '../../services/authService';
import { ROLES, hasAnyRole } from '../../utils/roles';
import { formatDate, formatCurrency } from '../../utils/format';

const PurchasePlanList = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');

  const user = authService.getCurrentUser();
  const isKeeper = hasAnyRole(user, [ROLES.WAREHOUSE_KEEPER]);

  useEffect(() => {
    loadPlans();
  }, [filterStatus]);

  const loadPlans = async () => {
    try {
      setLoading(true);
      const params = filterStatus ? { status: filterStatus } : {};
      const data = await purchasePlanService.getAllPurchasePlans(params);
      setPlans(data);
    } catch (error) {
      console.error('Error loading purchase plans:', error);
      alert('Lỗi khi tải danh sách kế hoạch: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'DRAFT': { class: 'bg-secondary', text: 'Nháp' },
      'PENDING': { class: 'bg-warning', text: 'Chờ duyệt' },
      'APPROVED': { class: 'bg-success', text: 'Đã duyệt' },
      'REJECTED': { class: 'bg-danger', text: 'Từ chối' },
      'COMPLETED': { class: 'bg-primary', text: 'Đã đặt hàng' },
    };
    const s = statusMap[status] || { class: 'bg-secondary', text: status };
    return <span className={`badge ${s.class}`}>{s.text}</span>;
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Xác nhận xóa kế hoạch này?')) return;

    try {
      await purchasePlanService.deletePurchasePlan(id);
      alert('Xóa thành công!');
      loadPlans();
    } catch (error) {
      alert('Lỗi: ' + (error.message || 'Unknown error'));
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Kế hoạch đặt hàng</h2>
        {isKeeper && (
          <Link to="/purchase-plans/new" className="btn btn-primary">
            <i className="bi bi-plus-circle me-2"></i>Lập kế hoạch mới
          </Link>
        )}
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <div className="row">
            <div className="col-md-4">
              <label className="form-label">Lọc theo trạng thái:</label>
              <select
                className="form-select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">Tất cả</option>
                <option value="DRAFT">Nháp</option>
                <option value="PENDING">Chờ duyệt</option>
                <option value="APPROVED">Đã duyệt</option>
                <option value="REJECTED">Từ chối</option>
                <option value="COMPLETED">Đã đặt hàng</option>
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
          ) : plans.length === 0 ? (
            <div className="text-center text-muted">
              <i className="bi bi-inbox" style={{ fontSize: '3rem' }}></i>
              <p className="mt-3">Không có kế hoạch đặt hàng nào</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Mã KH</th>
                    <th>Ngày lập</th>
                    <th>Người lập</th>
                    <th>Số mặt hàng</th>
                    <th>Giá trị dự kiến</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {plans.map((plan) => (
                    <tr key={plan.id}>
                      <td><strong>KH-{plan.id}</strong></td>
                      <td>{formatDate(plan.planDate)}</td>
                      <td>{plan.createdByName}</td>
                      <td>{plan.items.length}</td>
                      <td>{formatCurrency(plan.totalEstimatedAmount)}</td>
                      <td>{getStatusBadge(plan.status)}</td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          <Link
                            to={`/purchase-plans/${plan.id}`}
                            className="btn btn-outline-info"
                            title="Xem chi tiết"
                          >
                            <i className="bi bi-eye"></i>
                          </Link>
                          {isKeeper && plan.status === 'DRAFT' && (
                            <Link
                              to={`/purchase-plans/edit/${plan.id}`}
                              className="btn btn-outline-primary"
                              title="Sửa"
                            >
                              <i className="bi bi-pencil"></i>
                            </Link>
                          )}
                          {isKeeper && (plan.status === 'DRAFT' || plan.status === 'REJECTED') && (
                            <button
                              onClick={() => handleDelete(plan.id)}
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

export default PurchasePlanList;
