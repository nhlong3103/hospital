import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { departmentService, userService } from '../../services/commonServices';

const DepartmentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    phoneNumber: '',
    headUserId: '',
  });
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditMode) {
      loadDepartment();
    }
  }, [id]);

  const loadDepartment = async () => {
    try {
      const [data, membersData] = await Promise.all([
        departmentService.getDepartmentById(id),
        userService.getAllUsers({ departmentId: id })
      ]);

      setFormData({
        code: data.code || '',
        name: data.name || '',
        phoneNumber: data.phoneNumber || '',
        headUserId: data.headUserId || '',
      });
      setMembers(membersData);
    } catch (error) {
      console.error('Error loading department:', error);
      alert('Lỗi khi tải thông tin khoa/phòng');
      navigate('/departments');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.code.trim()) {
      newErrors.code = 'Mã khoa/phòng không được để trống';
    }
    if (!formData.name.trim()) {
      newErrors.name = 'Tên khoa/phòng không được để trống';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      setLoading(true);

      const requestData = {
        code: formData.code.trim(),
        name: formData.name.trim(),
        phoneNumber: formData.phoneNumber.trim(),
      };

      if (isEditMode) {
        await departmentService.updateDepartment(id, requestData);
        if (formData.headUserId) {
          await departmentService.assignHead(id, formData.headUserId);
        }
        alert('Cập nhật khoa/phòng thành công!');
      } else {
        await departmentService.createDepartment(requestData);
        alert('Thêm khoa/phòng mới thành công!');
      }

      navigate('/departments');
    } catch (error) {
      console.error('Error saving department:', error);
      alert('Lỗi: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>{isEditMode ? 'Sửa khoa/phòng' : 'Thêm khoa/phòng mới'}</h2>
        <button onClick={() => navigate('/departments')} className="btn btn-secondary">
          <i className="bi bi-arrow-left me-2"></i>Quay lại
        </button>
      </div>

      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">
                    Mã khoa/phòng <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="code"
                    className={`form-control ${errors.code ? 'is-invalid' : ''}`}
                    value={formData.code}
                    onChange={handleChange}
                    placeholder="VD: KNK"
                  />
                  {errors.code && <div className="invalid-feedback">{errors.code}</div>}
                </div>
              </div>

              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">
                    Tên khoa/phòng <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="VD: Khoa Nội"
                  />
                  {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>
              </div>

              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Điện thoại</label>
                  <input
                    type="text"
                    name="phoneNumber"
                    className="form-control"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="VD: 0901234567"
                  />
                </div>
              </div>

              {isEditMode && (
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Trưởng khoa/phòng</label>
                    <select
                      name="headUserId"
                      className="form-select"
                      value={formData.headUserId}
                      onChange={handleChange}
                    >
                      <option value="">-- Chưa chọn --</option>
                      {members.map(member => (
                        <option key={member.id} value={member.id}>
                          {member.fullName} ({member.email})
                        </option>
                      ))}
                    </select>
                    <small className="text-muted">Chỉ chọn được người đã thuộc khoa/phòng này.</small>
                  </div>
                </div>
              )}
            </div>

            <div className="d-flex justify-content-end gap-2">
              <button
                type="button"
                onClick={() => navigate('/departments')}
                className="btn btn-secondary"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-circle me-2"></i>
                    {isEditMode ? 'Cập nhật' : 'Thêm mới'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DepartmentForm;
