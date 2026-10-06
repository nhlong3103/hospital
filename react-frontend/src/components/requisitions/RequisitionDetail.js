import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import requisitionService from '../../services/requisitionService';
import issueNoteService from '../../services/issueNoteService';
import { formatLongDate } from '../../utils/format';

const MIN_ROWS = 9;

const RequisitionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [requisition, setRequisition] = useState(null);
  const [issueNote, setIssueNote] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRequisition();
  }, [id]);

  const loadRequisition = async () => {
    try {
      setLoading(true);
      const data = await requisitionService.getRequisitionById(id);
      setRequisition(data);

      if (data.status === 'ISSUED') {
        try {
          const note = await issueNoteService.getIssueNoteByRequisition(id);
          setIssueNote(note);
        } catch (error) {
          console.error('Error loading issue note:', error);
        }
      }
    } catch (error) {
      console.error('Error loading requisition:', error);
      alert('Lỗi khi tải phiếu lĩnh: ' + (error.message || 'Unknown error'));
      navigate('/requisitions');
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

  const getNote = (item) => {
    if (item.issuedQuantity !== null && item.issuedQuantity !== undefined
      && item.issuedQuantity < item.requestedQuantity) {
      return 'Thiếu tồn kho';
    }
    return '';
  };

  if (loading || !requisition) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  const emptyRows = Math.max(0, MIN_ROWS - requisition.items.length);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4 d-print-none">
        <div className="d-flex align-items-center gap-3">
          <h2 className="mb-0">Phiếu lĩnh {requisition.requisitionNumber}</h2>
          {getStatusBadge(requisition.status)}
        </div>
        <div className="d-flex gap-2">
          {issueNote && (
            <Link to={`/issue-notes/${issueNote.id}`} className="btn btn-outline-primary">
              <i className="bi bi-file-earmark-check me-2"></i>Xem chứng từ xuất
            </Link>
          )}
          <button onClick={() => window.print()} className="btn btn-primary">
            <i className="bi bi-printer me-2"></i>In phiếu
          </button>
          <button onClick={() => navigate('/requisitions')} className="btn btn-secondary">
            <i className="bi bi-arrow-left me-2"></i>Quay lại
          </button>
        </div>
      </div>

      <div className="paper">
        <div className="paper-header">
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.8rem' }}>SỞ Y TẾ TP.HỒ CHÍ MINH</div>
            <div><strong>BỆNH VIỆN QUẬN PHÚ NHUẬN</strong></div>
            <div className="mt-2">Khoa: <strong>{requisition.departmentName}</strong></div>
          </div>

          <div className="paper-center" style={{ flex: 1.4 }}>
            <div className="paper-title">PHIẾU LĨNH VẬT DỤNG Y TẾ TIÊU HAO</div>
            <div style={{ fontSize: '0.9rem' }}>{formatLongDate(requisition.requisitionDate)}</div>
          </div>

          <div style={{ flex: 1, fontSize: '0.9rem' }}>
            <div>MS: ………</div>
            <div>Số: <strong>{requisition.requisitionNumber}</strong></div>
          </div>
        </div>

        <table className="paper-table">
          <thead>
            <tr>
              <th rowSpan="2" style={{ width: '8%' }}>Số TT</th>
              <th rowSpan="2" style={{ width: '10%' }}>Mã</th>
              <th rowSpan="2">Tên vật dụng y tế tiêu hao</th>
              <th rowSpan="2" style={{ width: '10%' }}>Đơn vị</th>
              <th colSpan="2">Số lượng</th>
              <th rowSpan="2" style={{ width: '16%' }}>Ghi chú</th>
            </tr>
            <tr>
              <th style={{ width: '10%' }}>Yêu cầu</th>
              <th style={{ width: '10%' }}>Phát</th>
            </tr>
          </thead>
          <tbody>
            {requisition.items.map((item, index) => (
              <tr key={item.id}>
                <td className="center">{index + 1}</td>
                <td className="center">{item.materialCode}</td>
                <td>{item.materialName}</td>
                <td className="center">{item.materialUnit}</td>
                <td className="center">{item.requestedQuantity}</td>
                <td className="center">
                  {item.issuedQuantity === null || item.issuedQuantity === undefined
                    ? ''
                    : item.issuedQuantity}
                </td>
                <td>{getNote(item)}</td>
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
          </tbody>
        </table>

        <div className="text-end fst-italic mt-4">{formatLongDate(requisition.requisitionDate)}</div>

        <div className="paper-sign">
          <div>
            <div className="sign-title">Trưởng P.VTTBYT</div>
            <div className="sign-note">(ký, ghi rõ họ tên)</div>
            <div className="sign-space"></div>
          </div>
          <div>
            <div className="sign-title">Người phát</div>
            <div className="sign-note">(ký, ghi rõ họ tên)</div>
            <div className="sign-space"></div>
            <div className="sign-name">{issueNote ? issueNote.issuedByName : ''}</div>
          </div>
          <div>
            <div className="sign-title">Người lĩnh</div>
            <div className="sign-note">(ký, ghi rõ họ tên)</div>
            <div className="sign-space"></div>
            <div className="sign-name">{requisition.createdByName}</div>
          </div>
          <div>
            <div className="sign-title">Trưởng khoa</div>
            <div className="sign-note">(ký, ghi rõ họ tên)</div>
            <div className="sign-space"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequisitionDetail;
