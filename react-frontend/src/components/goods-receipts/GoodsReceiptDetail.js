import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import goodsReceiptService from '../../services/goodsReceiptService';
import authService from '../../services/authService';
import { ROLES, hasAnyRole } from '../../utils/roles';
import { formatDate, formatCurrency } from '../../utils/format';

const GoodsReceiptDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(true);

  const user = authService.getCurrentUser();
  const isKeeper = hasAnyRole(user, [ROLES.WAREHOUSE_KEEPER]);
  const isAccountant = hasAnyRole(user, [ROLES.ACCOUNTANT]);
  const isManager = hasAnyRole(user, [ROLES.WAREHOUSE_MANAGER]);

  useEffect(() => {
    loadReceipt();
  }, [id]);

  const loadReceipt = async () => {
    try {
      setLoading(true);
      const data = await goodsReceiptService.getGoodsReceiptById(id);
      setReceipt(data);
    } catch (error) {
      console.error('Error loading goods receipt:', error);
      alert('Lỗi khi tải phiếu nhập: ' + (error.message || 'Unknown error'));
      navigate('/goods-receipts');
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

  const runAction = async (action, successMessage) => {
    try {
      await action();
      alert(successMessage);
      loadReceipt();
    } catch (error) {
      alert('Lỗi: ' + (error.message || 'Unknown error'));
    }
  };

  const handleConfirmReceived = () => {
    if (!window.confirm('Xác nhận giao phiếu kiểm nhập (kèm hóa đơn) cho kế toán?')) return;
    runAction(() => goodsReceiptService.confirmReceived(id), 'Đã giao phiếu kiểm nhập cho kế toán!');
  };

  const handleVerifyInvoice = () => {
    if (!window.confirm('Xác nhận hóa đơn hợp lệ và chính xác?')) return;
    runAction(() => goodsReceiptService.verifyInvoice(id), 'Kiểm tra hóa đơn thành công!');
  };

  const handleFinalize = () => {
    if (!window.confirm('Xác nhận hoàn tất nhập kho? Tồn kho sẽ được cập nhật.')) return;
    runAction(() => goodsReceiptService.finalizeReceipt(id), 'Hoàn tất nhập kho! Tồn kho đã được cập nhật.');
  };

  const handleDelete = async () => {
    if (!window.confirm('Xác nhận xóa phiếu nhập này?')) return;

    try {
      await goodsReceiptService.deleteGoodsReceipt(id);
      alert('Xóa thành công!');
      navigate('/goods-receipts');
    } catch (error) {
      alert('Lỗi: ' + (error.message || 'Unknown error'));
    }
  };

  const renderActions = () => {
    const { status } = receipt;

    return (
      <div className="d-flex gap-2">
        {isKeeper && status === 'DRAFT' && (
          <>
            <button onClick={handleConfirmReceived} className="btn btn-primary">
              <i className="bi bi-send me-2"></i>Giao kế toán
            </button>
            <button onClick={handleDelete} className="btn btn-outline-danger">
              <i className="bi bi-trash me-2"></i>Xóa
            </button>
          </>
        )}

        {isAccountant && status === 'RECEIVED' && (
          <button onClick={handleVerifyInvoice} className="btn btn-success">
            <i className="bi bi-check-circle me-2"></i>Kiểm tra hóa đơn
          </button>
        )}

        {isManager && status === 'VERIFIED' && (
          <button onClick={handleFinalize} className="btn btn-success">
            <i className="bi bi-box-arrow-in-down me-2"></i>Hoàn tất nhập kho
          </button>
        )}

        {(isAccountant || isManager) && status === 'FINALIZED' && (
          <Link to={`/goods-receipts/${id}/payment-request`} className="btn btn-primary">
            <i className="bi bi-cash-coin me-2"></i>Lập phiếu đề nghị thanh toán
          </Link>
        )}
      </div>
    );
  };

  if (loading || !receipt) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Phiếu nhập kho - HĐ {receipt.invoiceNumber}</h2>
        <button onClick={() => navigate('/goods-receipts')} className="btn btn-secondary">
          <i className="bi bi-arrow-left me-2"></i>Quay lại
        </button>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="row mb-3">
            <div className="col-md-3">
              <small className="text-muted">Ngày nhập</small>
              <div>{formatDate(receipt.receiptDate)}</div>
            </div>
            <div className="col-md-3">
              <small className="text-muted">Nhà cung cấp</small>
              <div>{receipt.supplierName}</div>
            </div>
            <div className="col-md-3">
              <small className="text-muted">Trạng thái</small>
              <div>{getStatusBadge(receipt.status)}</div>
            </div>
            <div className="col-md-3">
              <small className="text-muted">Tổng tiền</small>
              <div><strong>{formatCurrency(receipt.totalAmount)}</strong></div>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-3">
              <small className="text-muted">Người lập (Thủ kho)</small>
              <div>{receipt.receivedByName}</div>
            </div>
            <div className="col-md-3">
              <small className="text-muted">Người kiểm tra hóa đơn (Kế toán)</small>
              <div>{receipt.verifiedByName || '-'}</div>
            </div>
            <div className="col-md-3">
              <small className="text-muted">Người hoàn tất (Trưởng P.VTTBYT)</small>
              <div>{receipt.finalizedByName || '-'}</div>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th>Mã</th>
                  <th>Tên vật tư</th>
                  <th>Đơn vị</th>
                  <th>Số lô</th>
                  <th>Hạn dùng</th>
                  <th>Số lượng</th>
                  <th>Đơn giá</th>
                  <th>Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {receipt.items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.materialCode}</td>
                    <td>{item.materialName}</td>
                    <td>{item.materialUnit}</td>
                    <td>{item.batchNumber}</td>
                    <td>{formatDate(item.expiryDate)}</td>
                    <td>{item.quantity}</td>
                    <td>{formatCurrency(item.unitPrice)}</td>
                    <td>{formatCurrency(item.amount)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="7" className="text-end"><strong>Tổng thành tiền</strong></td>
                  <td><strong>{formatCurrency(receipt.totalAmount)}</strong></td>
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

export default GoodsReceiptDetail;
