import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import issueNoteService from '../../services/issueNoteService';
import { formatDate } from '../../utils/format';

const IssueNoteList = () => {
  const [issueNotes, setIssueNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadIssueNotes();
  }, []);

  const loadIssueNotes = async () => {
    try {
      setLoading(true);
      const data = await issueNoteService.getAllIssueNotes();
      setIssueNotes(data);
    } catch (error) {
      console.error('Error loading issue notes:', error);
      alert('Lỗi khi tải chứng từ xuất: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Chứng từ xuất kho</h2>
      </div>

      <div className="card">
        <div className="card-body">
          {loading ? (
            <div className="text-center">
              <div className="spinner-border text-primary"></div>
            </div>
          ) : issueNotes.length === 0 ? (
            <div className="text-center text-muted">
              <i className="bi bi-inbox" style={{ fontSize: '3rem' }}></i>
              <p className="mt-3">Chưa có chứng từ xuất nào</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Số chứng từ</th>
                    <th>Ngày xuất</th>
                    <th>Phiếu lĩnh</th>
                    <th>Khoa/Phòng nhận</th>
                    <th>Người xuất</th>
                    <th>Người nhận</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {issueNotes.map((note) => (
                    <tr key={note.id}>
                      <td><strong>{note.issueNumber}</strong></td>
                      <td>{formatDate(note.issueDate)}</td>
                      <td>{note.requisitionNumber}</td>
                      <td>{note.departmentName}</td>
                      <td>{note.issuedByName}</td>
                      <td>{note.receivedByName}</td>
                      <td>
                        <Link
                          to={`/issue-notes/${note.id}`}
                          className="btn btn-outline-info btn-sm"
                          title="Xem chứng từ"
                        >
                          <i className="bi bi-eye"></i> Xem
                        </Link>
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

export default IssueNoteList;
