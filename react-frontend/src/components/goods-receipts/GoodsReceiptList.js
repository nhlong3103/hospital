import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import goodsReceiptService from '../../services/goodsReceiptService';
import authService from '../../services/authService';
import { ROLES, hasAnyRole } from '../../utils/roles';
import { formatDate, formatCurrency } from '../../utils/format';

const GoodsReceiptList = () => {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');

  const user = authService.getCurrentUser();
  const isKeeper = hasAnyRole(user, [ROLES.WAREHOUSE_KEEPER]);

  useEffect(() => {
    loadReceipts();
  }, [filterStatus]);

  const loadReceipts = async () => {
    try {
      setLoading(true);
      const params = filterStatus ? { status: filterStatus } : {};
      const data = await goodsReceiptService.getAllGoodsReceipts(params);
      setReceipts(data);
    } catch (error) {
      console.error('Error loading goods receipts:', error);
      alert('Lỗi khi tải danh sách phiếu nhập: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'DRAFT': { class: 'bg-secondary', text: 'Nháp' },
      'RECEIVED': { class: 'bg-warning', text: 'Chờ kiểm tra hóa đơn' },
      'VERIFIED': { class: 'bg-info', text: 'Chờ hoàn tất nhập kho' },
      'FINALIZED': { class: 'bg-success', text: 'Đã nhập kho' },
    };
    const s = statusMap[status] || { class: 'bg-secondary', text: status };
    return <span className={`badge ${s.class}`}>{s.text}</span>;
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Xác nhận xóa phiếu nhập này?')) return;

    try {
      await goodsReceiptService.deleteGoodsReceipt(id);
      alert('Xóa thành công!');
      loadReceipts();
    } catch (error) {
      alert('Lỗi: ' + (error.message || 'Unknown error'));
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Quản lý Phiếu nhập kho</h2>
        {isKeeper && (
          <Link to="/goods-receipts/new" className="btn btn-primary">
            <i className="bi bi-plus-circle me-2"></i>Lập sổ kiểm nhập mới
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
                <option value="RECEIVED">Chờ kiểm tra hóa đơn</option>
                <option value="VERIFIED">Chờ hoàn tất nhập kho</option>
                <option value="FINALIZED">Đã nhập kho</option>
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
          ) : receipts.length === 0 ? (
            <div className="text-center text-muted">
              <i className="bi bi-inbox" style={{ fontSize: '3rem' }}></i>
              <p className="mt-3">Không có phiếu nhập nào</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Số hóa đơn</th>
                    <th>Ngày nhập</th>
                    <th>Nhà cung cấp</th>
                    <th>Người lập</th>
                    <th>Tổng tiền</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {receipts.map((receipt) => (
                    <tr key={receipt.id}>
                      <td><strong>{receipt.invoiceNumber}</strong></td>
                      <td>{formatDate(receipt.receiptDate)}</td>
                      <td>{receipt.supplierName}</td>
                      <td>{receipt.receivedByName}</td>
                      <td>{formatCurrency(receipt.totalAmount)}</td>
                      <td>{getStatusBadge(receipt.status)}</td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          <Link
                            to={`/goods-receipts/${receipt.id}`}
                            className="btn btn-outline-info"
                            title="Xem chi tiết"
                          >
                            <i className="bi bi-eye"></i>
                          </Link>
                          {isKeeper && receipt.status === 'DRAFT' && (
                            <button
                              onClick={() => handleDelete(receipt.id)}
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

export default GoodsReceiptList;
