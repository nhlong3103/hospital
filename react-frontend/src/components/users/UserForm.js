import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { userService, departmentService } from '../../services/commonServices';
import { ROLE_LABELS } from '../../utils/roles';

const UserForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: '',
    departmentId: '',
  });
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const departmentsData = await departmentService.getAllDepartments();
      setDepartments(departmentsData);

      if (isEditMode) {
        const data = await userService.getUserById(id);
        setFormData({
          fullName: data.fullName || '',
          email: data.email || '',
          password: '',
          role: data.role || '',
          departmentId: data.departmentId || '',
        });
      }
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Lỗi khi tải dữ liệu');
      navigate('/users');
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

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Họ tên không được để trống';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email không được để trống';
    }
    if (!isEditMode && formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    if (!formData.role) {
      newErrors.role = 'Vui lòng chọn vai trò';
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
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        role: formData.role,
        departmentId: formData.departmentId ? parseInt(formData.departmentId) : null,
      };

      if (isEditMode) {
        await userService.updateUser(id, requestData);
        alert('Cập nhật người dùng thành công!');
      } else {
        await userService.createUser({ ...requestData, password: formData.password });
        alert('Thêm người dùng mới thành công!');
      }

      navigate('/users');
    } catch (error) {
      console.error('Error saving user:', error);
      alert('Lỗi: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>{isEditMode ? 'Sửa người dùng' : 'Thêm người dùng mới'}</h2>
        <button onClick={() => navigate('/users')} className="btn btn-secondary">
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
                    Họ tên <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    className={`form-control ${errors.fullName ? 'is-invalid' : ''}`}
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="VD: Nguyễn Văn A"
                  />
                  {errors.fullName && <div className="invalid-feedback">{errors.fullName}</div>}
                </div>
              </div>

              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">
                    Email <span className="text-danger">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="VD: nguyenvana@hospital.vn"
                  />
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>
              </div>

              {!isEditMode && (
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">
                      Mật khẩu <span className="text-danger">*</span>
                    </label>
                    <input
                      type="password"
                      name="password"
                      className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Tối thiểu 6 ký tự"
                    />
                    {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                  </div>
                </div>
              )}

              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">
                    Vai trò <span className="text-danger">*</span>
                  </label>
                  <select
                    name="role"
                    className={`form-select ${errors.role ? 'is-invalid' : ''}`}
                    value={formData.role}
                    onChange={handleChange}
                  >
                    <option value="">-- Chọn vai trò --</option>
                    {Object.keys(ROLE_LABELS).map(role => (
                      <option key={role} value={role}>{ROLE_LABELS[role]}</option>
                    ))}
                  </select>
                  {errors.role && <div className="invalid-feedback">{errors.role}</div>}
                </div>
              </div>

              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Khoa/Phòng</label>
                  <select
                    name="departmentId"
                    className="form-select"
                    value={formData.departmentId}
                    onChange={handleChange}
                  >
                    <option value="">-- Không thuộc khoa/phòng --</option>
                    {departments.map(dept => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name} ({dept.code})
                      </option>
                    ))}
                  </select>
                  <small className="text-muted">
                    ĐD/KTV và Trưởng khoa cần thuộc một khoa/phòng để lập phiếu lĩnh.
                  </small>
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-end gap-2">
              <button
                type="button"
                onClick={() => navigate('/users')}
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

export default UserForm;
