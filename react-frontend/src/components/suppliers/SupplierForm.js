import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supplierService } from '../../services/commonServices';

const SupplierForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    phoneNumber: '',
    email: '',
    address: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditMode) {
      loadSupplier();
    }
  }, [id]);

  const loadSupplier = async () => {
    try {
      const data = await supplierService.getSupplierById(id);
      setFormData({
        code: data.code || '',
        name: data.name || '',
        phoneNumber: data.phoneNumber || '',
        email: data.email || '',
        address: data.address || '',
      });
    } catch (error) {
      console.error('Error loading supplier:', error);
      alert('Lỗi khi tải thông tin nhà cung cấp');
      navigate('/suppliers');
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
      newErrors.code = 'Mã nhà cung cấp không được để trống';
    }
    if (!formData.name.trim()) {
      newErrors.name = 'Tên nhà cung cấp không được để trống';
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

      if (isEditMode) {
        await supplierService.updateSupplier(id, formData);
        alert('Cập nhật nhà cung cấp thành công!');
      } else {
        await supplierService.createSupplier(formData);
        alert('Thêm nhà cung cấp mới thành công!');
      }

      navigate('/suppliers');
    } catch (error) {
      console.error('Error saving supplier:', error);
      alert('Lỗi: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>{isEditMode ? 'Sửa nhà cung cấp' : 'Thêm nhà cung cấp mới'}</h2>
        <button onClick={() => navigate('/suppliers')} className="btn btn-secondary">
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
                    Mã nhà cung cấp <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="code"
                    className={`form-control ${errors.code ? 'is-invalid' : ''}`}
                    value={formData.code}
                    onChange={handleChange}
                    placeholder="VD: NCC001"
                  />
                  {errors.code && <div className="invalid-feedback">{errors.code}</div>}
                </div>
              </div>

              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">
                    Tên nhà cung cấp <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="VD: Công ty TNHH Thiết bị Y tế ABC"
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
                    placeholder="VD: 0281234567"
                  />
                </div>
              </div>

              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="VD: abc@medical.vn"
                  />
                </div>
              </div>

              <div className="col-md-12">
                <div className="mb-3">
                  <label className="form-label">Địa chỉ</label>
                  <input
                    type="text"
                    name="address"
                    className="form-control"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="VD: 123 Nguyễn Văn Cừ, Q5, TP.HCM"
                  />
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-end gap-2">
              <button
                type="button"
                onClick={() => navigate('/suppliers')}
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

export default SupplierForm;
