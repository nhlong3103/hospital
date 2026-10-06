import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import issueNoteService from '../../services/issueNoteService';
import { formatDate, formatLongDate } from '../../utils/format';

const MIN_ROWS = 4;

const IssueNoteDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [issueNote, setIssueNote] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadIssueNote();
  }, [id]);

  const loadIssueNote = async () => {
    try {
      setLoading(true);
      const data = await issueNoteService.getIssueNoteById(id);
      setIssueNote(data);
    } catch (error) {
      console.error('Error loading issue note:', error);
      alert('Lỗi khi tải chứng từ xuất: ' + (error.message || 'Unknown error'));
      navigate('/issue-notes');
    } finally {
      setLoading(false);
    }
  };

  if (loading || !issueNote) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  const emptyRows = Math.max(0, MIN_ROWS - issueNote.items.length);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4 d-print-none">
        <h2 className="mb-0">Chứng từ xuất {issueNote.issueNumber}</h2>
        <div className="d-flex gap-2">
          <Link to={`/requisitions/${issueNote.requisitionId}`} className="btn btn-outline-primary">
            <i className="bi bi-file-earmark-text me-2"></i>Xem phiếu lĩnh
          </Link>
          <button onClick={() => window.print()} className="btn btn-primary">
            <i className="bi bi-printer me-2"></i>In chứng từ
          </button>
          <button onClick={() => navigate('/issue-notes')} className="btn btn-secondary">
            <i className="bi bi-arrow-left me-2"></i>Quay lại
          </button>
        </div>
      </div>

      <div className="paper">
        <div className="paper-header">
          <div>
            <strong>BỆNH VIỆN QUẬN PHÚ NHUẬN</strong>
          </div>
          <div className="paper-center">
            <div><strong>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</strong></div>
            <div><strong><u>Độc lập - Tự do - Hạnh phúc</u></strong></div>
          </div>
        </div>

        <div className="paper-title mt-4 mb-4">CHỨNG TỪ XUẤT KHO</div>

        <div className="paper-info">
          <div>Số chứng từ: <strong>{issueNote.issueNumber}</strong></div>
          <div>Ngày chứng từ: <strong>{formatDate(issueNote.issueDate)}</strong></div>
        </div>
        <div className="mt-3">
          Hình thức xuất: Xuất theo phiếu lĩnh <strong>{issueNote.requisitionNumber}</strong>
        </div>
        <div className="paper-info">
          <div>Kho xuất: Kho vật tư tiêu hao y tế</div>
          <div>Phòng nhận: <strong>{issueNote.departmentName}</strong></div>
        </div>

        <table className="paper-table">
          <thead>
            <tr>
              <th style={{ width: '7%' }}>STT</th>
              <th style={{ width: '13%' }}>Mã hàng</th>
              <th>Tên mặt hàng</th>
              <th style={{ width: '11%' }}>Đơn vị tính</th>
              <th style={{ width: '11%' }}>Số lượng</th>
              <th style={{ width: '13%' }}>Đơn giá</th>
              <th style={{ width: '15%' }}>Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {issueNote.items.map((item, index) => (
              <tr key={item.materialId}>
                <td className="center">{index + 1}</td>
                <td className="center">{item.materialCode}</td>
                <td>{item.materialName}</td>
                <td className="center">{item.materialUnit}</td>
                <td className="center">{item.quantity}</td>
                <td className="right"></td>
                <td className="right"></td>
              </tr>
            ))}
            {Array.from({ length: emptyRows }).map((_, index) => (
              <tr key={`empty-${index}`} className="empty-row">
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            ))}
            <tr>
              <td colSpan="3" style={{ border: 'none' }}></td>
              <td colSpan="3" style={{ fontWeight: 'bold' }}>TỔNG THÀNH TIỀN</td>
              <td></td>
            </tr>
          </tbody>
        </table>

        <div className="paper-sign" style={{ marginTop: '32px' }}>
          <div>
            <div className="sign-title">Người phát</div>
            <div className="sign-note">(ký, ghi rõ họ tên)</div>
            <div className="sign-space"></div>
            <div className="sign-name">{issueNote.issuedByName}</div>
          </div>
          <div>
            <div className="sign-title">Người lĩnh</div>
            <div className="sign-note">(ký, ghi rõ họ tên)</div>
            <div className="sign-space"></div>
            <div className="sign-name">{issueNote.receivedByName}</div>
          </div>
          <div>
            <div className="fst-italic">{formatLongDate(issueNote.issueDate)}</div>
            <div className="sign-title">Phòng Vật tư, thiết bị y tế</div>
            <div className="sign-note">(ký, ghi rõ họ tên)</div>
            <div className="sign-space"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueNoteDetail;
