import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import requisitionService from '../../services/requisitionService';
import authService from '../../services/authService';
import { ROLES, hasAnyRole } from '../../utils/roles';

const RequisitionList = () => {
  const [requisitions, setRequisitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');

  const user = authService.getCurrentUser();
  const isDepartment = hasAnyRole(user, [ROLES.DEPARTMENT_STAFF, ROLES.DEPARTMENT_HEAD]);
  const isKeeper = hasAnyRole(user, [ROLES.WAREHOUSE_KEEPER]);
  const isDepartmentHead = hasAnyRole(user, [ROLES.DEPARTMENT_HEAD]);

  useEffect(() => {
    loadRequisitions();
  }, [filterStatus]);

  const loadRequisitions = async () => {
    try {
      setLoading(true);
      const params = filterStatus ? { status: filterStatus } : {};
      const data = await requisitionService.getAllRequisitions(params);
      setRequisitions(data);
    } catch (error) {
      console.error('Error loading requisitions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'DRAFT': { class: 'bg-secondary', text: 'Nháp' },
      'PENDING': { class: 'bg-warning', text: 'Chờ xác nhận' },
      'VERIFIED': { class: 'bg-info', text: 'Chờ duyệt' },
      'APPROVED': { class: 'bg-success', text: 'Đã duyệt' },
      'REJECTED': { class: 'bg-danger', text: 'Từ chối' },
      'ISSUED': { class: 'bg-primary', text: 'Đã xuất' },
    };
    const s = statusMap[status] || { class: 'bg-secondary', text: status };
    return <span className={`badge ${s.class}`}>{s.text}</span>;
  };

  const handleSubmit = async (id) => {
    if (!window.confirm('Xác nhận gửi phiếu lĩnh này để duyệt?')) return;

    try {
      await requisitionService.submitRequisition(id);
      alert('Gửi phiếu lĩnh thành công!');
      loadRequisitions();
    } catch (error) {
      alert('Lỗi: ' + (error.message || 'Unknown error'));
    }
  };

  const handleVerify = async (id) => {
    if (!window.confirm('Xác nhận phiếu lĩnh này? Số lượng thực cấp sẽ được điều chỉnh theo tồn kho.')) return;

    try {
      await requisitionService.verifyRequisition(id);
      alert('Xác nhận thành công! Số lượng thực cấp đã được điều chỉnh.');
      loadRequisitions();
    } catch (error) {
      alert('Lỗi: ' + (error.message || 'Unknown error'));
    }
  };

  const handleApprove = async (id) => {
    if (!window.confirm('Xác nhận duyệt phiếu lĩnh này?')) return;

    try {
      await requisitionService.approveRequisition(id);
      alert('Duyệt phiếu lĩnh thành công!');
      loadRequisitions();
    } catch (error) {
      alert('Lỗi: ' + (error.message || 'Unknown error'));
    }
  };

  const handleReject = async (id) => {
    const reason = prompt('Nhập lý do từ chối:');
    if (reason === null) return;

    try {
      await requisitionService.rejectRequisition(id, reason);
      alert('Đã từ chối phiếu lĩnh');
      loadRequisitions();
    } catch (error) {
      alert('Lỗi: ' + (error.message || 'Unknown error'));
    }
  };

  const handleIssue = async (id) => {
    if (!window.confirm('Xác nhận xuất kho? Tồn kho sẽ được cập nhật và chứng từ xuất sẽ được tạo.')) return;

    try {
      await requisitionService.issueGoods(id);
      alert('Xuất kho thành công! Tồn kho đã được cập nhật.');
      loadRequisitions();
    } catch (error) {
      alert('Lỗi: ' + (error.message || 'Unknown error'));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Xác nhận xóa phiếu lĩnh này?')) return;

    try {
      await requisitionService.deleteRequisition(id);
      alert('Xóa thành công!');
      loadRequisitions();
    } catch (error) {
      alert('Lỗi: ' + (error.message || 'Unknown error'));
    }
  };

  const renderActions = (requisition) => {
    const { id, status } = requisition;

    return (
      <div className="btn-group-vertical btn-group-sm">
        <Link to={`/requisitions/${id}`} className="btn btn-outline-info btn-sm mb-1">
          <i className="bi bi-eye"></i> Xem
        </Link>

        {isDepartment && status === 'DRAFT' && (
          <>
            <button onClick={() => handleSubmit(id)} className="btn btn-outline-primary btn-sm mb-1">
              <i className="bi bi-send"></i> Gửi
            </button>
            <button onClick={() => handleDelete(id)} className="btn btn-outline-danger btn-sm">
              <i className="bi bi-trash"></i> Xóa
            </button>
          </>
        )}

        {isKeeper && status === 'PENDING' && (
          <>
            <button onClick={() => handleVerify(id)} className="btn btn-outline-success btn-sm mb-1">
              <i className="bi bi-check"></i> Xác nhận
            </button>
            <button onClick={() => handleReject(id)} className="btn btn-outline-danger btn-sm">
              <i className="bi bi-x"></i> Từ chối
            </button>
          </>
        )}

        {isDepartmentHead && status === 'VERIFIED' && (
          <>
            <button onClick={() => handleApprove(id)} className="btn btn-outline-success btn-sm mb-1">
              <i className="bi bi-check-circle"></i> Duyệt
            </button>
            <button onClick={() => handleReject(id)} className="btn btn-outline-danger btn-sm">
              <i className="bi bi-x"></i> Từ chối
            </button>
          </>
        )}

        {isKeeper && status === 'APPROVED' && (
          <button onClick={() => handleIssue(id)} className="btn btn-outline-primary btn-sm">
            <i className="bi bi-box-arrow-right"></i> Xuất kho
          </button>
        )}

        {isDepartment && status === 'REJECTED' && (
          <button onClick={() => handleDelete(id)} className="btn btn-outline-danger btn-sm">
            <i className="bi bi-trash"></i> Xóa
          </button>
        )}
      </div>
    );
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Quản lý Phiếu lĩnh</h2>
        {isDepartment && (
          <Link to="/requisitions/new" className="btn btn-primary">
            <i className="bi bi-plus-circle me-2"></i>Tạo phiếu lĩnh mới
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
                <option value="PENDING">Chờ xác nhận</option>
                <option value="VERIFIED">Chờ duyệt</option>
                <option value="APPROVED">Đã duyệt</option>
                <option value="REJECTED">Từ chối</option>
                <option value="ISSUED">Đã xuất</option>
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
          ) : requisitions.length === 0 ? (
            <div className="text-center text-muted">
              <i className="bi bi-inbox" style={{ fontSize: '3rem' }}></i>
              <p className="mt-3">Không có phiếu lĩnh nào</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Số phiếu</th>
                    <th>Ngày</th>
                    <th>Khoa/Phòng</th>
                    <th>Người tạo</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {requisitions.map((req) => (
                    <tr key={req.id}>
                      <td><strong>{req.requisitionNumber}</strong></td>
                      <td>{new Date(req.requisitionDate).toLocaleDateString('vi-VN')}</td>
                      <td>{req.departmentName}</td>
                      <td>{req.createdByName}</td>
                      <td>{getStatusBadge(req.status)}</td>
                      <td>{renderActions(req)}</td>
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

export default RequisitionList;
