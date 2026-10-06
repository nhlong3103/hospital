import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import purchasePlanService from '../../services/purchasePlanService';
import authService from '../../services/authService';
import { ROLES, hasAnyRole } from '../../utils/roles';
import { formatDate, formatCurrency } from '../../utils/format';

const PurchasePlanDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  const user = authService.getCurrentUser();
  const isKeeper = hasAnyRole(user, [ROLES.WAREHOUSE_KEEPER]);
  const isManager = hasAnyRole(user, [ROLES.WAREHOUSE_MANAGER]);

  useEffect(() => {
    loadPlan();
  }, [id]);

  const loadPlan = async () => {
    try {
      setLoading(true);
      const data = await purchasePlanService.getPurchasePlanById(id);
      setPlan(data);
    } catch (error) {
      console.error('Error loading purchase plan:', error);
      alert('Lỗi khi tải kế hoạch: ' + (error.message || 'Unknown error'));
      navigate('/purchase-plans');
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

  const runAction = async (action, successMessage) => {
    try {
      await action();
      alert(successMessage);
      loadPlan();
    } catch (error) {
      alert('Lỗi: ' + (error.message || 'Unknown error'));
    }
  };

  const handleSubmit = () => {
    if (!window.confirm('Xác nhận gửi kế hoạch này để duyệt?')) return;
    runAction(() => purchasePlanService.submitPurchasePlan(id), 'Gửi kế hoạch thành công!');
  };

  const handleApprove = () => {
    if (!window.confirm('Xác nhận duyệt kế hoạch đặt hàng này?')) return;
    runAction(() => purchasePlanService.approvePurchasePlan(id), 'Duyệt kế hoạch thành công!');
  };

  const handleReject = () => {
    const reason = prompt('Nhập lý do từ chối:');
    if (reason === null) return;
    runAction(() => purchasePlanService.rejectPurchasePlan(id, reason), 'Đã từ chối kế hoạch');
  };

  const handlePlaceOrder = () => {
    if (!window.confirm('Xác nhận đặt hàng theo kế hoạch này?')) return;
    runAction(() => purchasePlanService.placeOrder(id), 'Đặt hàng thành công!');
  };

  const handleDelete = async () => {
    if (!window.confirm('Xác nhận xóa kế hoạch này?')) return;

    try {
      await purchasePlanService.deletePurchasePlan(id);
      alert('Xóa thành công!');
      navigate('/purchase-plans');
    } catch (error) {
      alert('Lỗi: ' + (error.message || 'Unknown error'));
    }
  };

  const renderActions = () => {
    const { status } = plan;

    return (
      <div className="d-flex gap-2">
        {isKeeper && status === 'DRAFT' && (
          <>
            <button onClick={handleSubmit} className="btn btn-primary">
              <i className="bi bi-send me-2"></i>Gửi duyệt
            </button>
            <Link to={`/purchase-plans/edit/${id}`} className="btn btn-outline-primary">
              <i className="bi bi-pencil me-2"></i>Sửa
            </Link>
          </>
        )}

        {isManager && status === 'PENDING' && (
          <>
            <button onClick={handleApprove} className="btn btn-success">
              <i className="bi bi-check-circle me-2"></i>Duyệt
            </button>
            <button onClick={handleReject} className="btn btn-outline-danger">
              <i className="bi bi-x-circle me-2"></i>Từ chối
            </button>
          </>
        )}

        {isKeeper && status === 'APPROVED' && (
          <button onClick={handlePlaceOrder} className="btn btn-primary">
            <i className="bi bi-cart-check me-2"></i>Đặt hàng
          </button>
        )}

        {isKeeper && (status === 'DRAFT' || status === 'REJECTED') && (
          <button onClick={handleDelete} className="btn btn-outline-danger">
            <i className="bi bi-trash me-2"></i>Xóa
          </button>
        )}
      </div>
    );
  };

  if (loading || !plan) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Kế hoạch đặt hàng KH-{plan.id}</h2>
        <button onClick={() => navigate('/purchase-plans')} className="btn btn-secondary">
          <i className="bi bi-arrow-left me-2"></i>Quay lại
        </button>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="row mb-3">
            <div className="col-md-3">
              <small className="text-muted">Ngày lập</small>
              <div>{formatDate(plan.planDate)}</div>
            </div>
            <div className="col-md-3">
              <small className="text-muted">Người lập</small>
              <div>{plan.createdByName}</div>
            </div>
            <div className="col-md-3">
              <small className="text-muted">Người duyệt</small>
              <div>{plan.approvedByName || '-'}</div>
            </div>
            <div className="col-md-3">
              <small className="text-muted">Trạng thái</small>
              <div>{getStatusBadge(plan.status)}</div>
            </div>
          </div>

          {plan.notes && (
            <div className="mb-3">
              <small className="text-muted">Ghi chú</small>
              <div style={{ whiteSpace: 'pre-line' }}>{plan.notes}</div>
            </div>
          )}

          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th>Mã</th>
                  <th>Tên vật tư</th>
                  <th>Đơn vị</th>
                  <th>Số lượng đặt</th>
                  <th>Giá dự kiến</th>
                  <th>Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {plan.items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.materialCode}</td>
                    <td>{item.materialName}</td>
                    <td>{item.materialUnit}</td>
                    <td>{item.requestedQuantity}</td>
                    <td>{formatCurrency(item.estimatedPrice)}</td>
                    <td>{formatCurrency(item.estimatedAmount)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="5" className="text-end"><strong>Tổng giá trị dự kiến</strong></td>
                  <td><strong>{formatCurrency(plan.totalEstimatedAmount)}</strong></td>
                </tr>
              </tfoot>
            </table>
          </div>

          {renderActions()}
        </div>
      </div>
    </div>
  );
};

export default PurchasePlanDetail;
