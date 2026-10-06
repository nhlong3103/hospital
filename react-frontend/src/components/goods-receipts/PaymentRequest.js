import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import goodsReceiptService from '../../services/goodsReceiptService';
import { formatDate, formatCurrency } from '../../utils/format';

const PaymentRequest = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPaymentRequest();
  }, [id]);

  const loadPaymentRequest = async () => {
    try {
      setLoading(true);
      const data = await goodsReceiptService.getPaymentRequest(id);
      setPayment(data);
    } catch (error) {
      console.error('Error loading payment request:', error);
      alert('Lỗi: ' + (error.message || 'Unknown error'));
      navigate(`/goods-receipts/${id}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !payment) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4 d-print-none">
        <h2>Phiếu đề nghị thanh toán</h2>
        <div className="d-flex gap-2">
          <button onClick={() => window.print()} className="btn btn-primary">
            <i className="bi bi-printer me-2"></i>In phiếu
          </button>
          <button onClick={() => navigate(`/goods-receipts/${id}`)} className="btn btn-secondary">
            <i className="bi bi-arrow-left me-2"></i>Quay lại
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="text-center mb-4">
            <h4 className="mb-1">PHIẾU ĐỀ NGHỊ THANH TOÁN</h4>
            <div className="text-muted">Ngày {formatDate(payment.requestDate)}</div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <div><strong>Nhà cung cấp:</strong> {payment.supplierName} ({payment.supplierCode})</div>
              <div><strong>Địa chỉ:</strong> {payment.supplierAddress || '-'}</div>
              <div><strong>Điện thoại:</strong> {payment.supplierPhoneNumber || '-'}</div>
            </div>
            <div className="col-md-6">
              <div><strong>Số hóa đơn:</strong> {payment.invoiceNumber}</div>
              <div><strong>Ngày nhập kho:</strong> {formatDate(payment.receiptDate)}</div>
              <div><strong>Chứng từ kèm theo:</strong> Hóa đơn, phiếu nhập kho, phiếu đề nghị thanh toán</div>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-bordered">
              <thead className="table-light">
                <tr>
                  <th>STT</th>
                  <th>Mã</th>
                  <th>Tên vật tư</th>
                  <th>Đơn vị</th>
                  <th>Số lượng</th>
                  <th>Đơn giá</th>
                  <th>Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {payment.items.map((item, index) => (
                  <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td>{item.materialCode}</td>
                    <td>{item.materialName}</td>
                    <td>{item.materialUnit}</td>
                    <td>{item.quantity}</td>
                    <td>{formatCurrency(item.unitPrice)}</td>
                    <td>{formatCurrency(item.amount)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="6" className="text-end"><strong>TỔNG SỐ TIỀN ĐỀ NGHỊ THANH TOÁN</strong></td>
                  <td><strong>{formatCurrency(payment.totalAmount)}</strong></td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="row text-center mt-5">
            <div className="col-md-6">
              <strong>Người duyệt nhập kho</strong>
              <div className="text-muted">(Trưởng phòng VTTBYT)</div>
              <div className="mt-5">{payment.finalizedByName}</div>
            </div>
            <div className="col-md-6">
              <strong>Người lập phiếu</strong>
              <div className="text-muted">(Kế toán dược)</div>
              <div className="mt-5">{payment.preparedByName}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentRequest;
