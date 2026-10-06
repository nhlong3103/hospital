import React, { useState, useEffect } from 'react';
import stockService from '../../services/stockService';
import { formatDate } from '../../utils/format';

const StockAlertList = ({ type }) => {
  const isExpiring = type === 'expiring';

  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [threshold, setThreshold] = useState(isExpiring ? 30 : 10);

  useEffect(() => {
    loadStocks();
  }, [threshold]);

  const loadStocks = async () => {
    try {
      setLoading(true);
      const data = isExpiring
        ? await stockService.getExpiringStock(threshold)
        : await stockService.getLowStock(threshold);
      setStocks(data);
    } catch (error) {
      console.error('Error loading stocks:', error);
      alert('Lỗi khi tải dữ liệu: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const isExpired = (expiryDate) => {
    return expiryDate && new Date(expiryDate) < new Date();
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>{isExpiring ? 'Vật tư sắp hết hạn' : 'Vật tư sắp hết'}</h2>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <div className="row">
            <div className="col-md-4">
              <label className="form-label">
                {isExpiring ? 'Hết hạn trong vòng (ngày):' : 'Số lượng dưới:'}
              </label>
              <input
                type="number"
                className="form-control"
                value={threshold}
                min="1"
                onChange={(e) => setThreshold(parseInt(e.target.value) || 1)}
              />
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
          ) : stocks.length === 0 ? (
            <div className="text-center text-muted">
              <i className="bi bi-check-circle" style={{ fontSize: '3rem' }}></i>
              <p className="mt-3">Không có lô hàng nào cần chú ý</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Mã</th>
                    <th>Tên vật tư</th>
                    <th>Số lô</th>
                    <th>Hạn dùng</th>
                    <th>Số lượng</th>
                    <th>Vị trí</th>
                  </tr>
                </thead>
                <tbody>
                  {stocks.map((stock) => (
                    <tr key={stock.id}>
                      <td>{stock.material?.code}</td>
                      <td>{stock.material?.name}</td>
                      <td>{stock.batchNumber}</td>
                      <td>
                        {isExpired(stock.expiryDate) ? (
                          <span className="badge bg-danger">{formatDate(stock.expiryDate)} (đã hết hạn)</span>
                        ) : (
                          formatDate(stock.expiryDate)
                        )}
                      </td>
                      <td>
                        <strong className={stock.quantity < 10 ? 'text-danger' : ''}>
                          {stock.quantity}
                        </strong>
                      </td>
                      <td>{stock.storageLocation || '-'}</td>
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

export default StockAlertList;
