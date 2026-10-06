import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import materialService from '../../services/materialService';

const MaterialForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    unit: '',
    manufacturer: '',
    category: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditMode) {
      loadMaterial();
    }
  }, [id]);

  const loadMaterial = async () => {
    try {
      const data = await materialService.getMaterialById(id);
      setFormData({
        code: data.code || '',
        name: data.name || '',
        unit: data.unit || '',
        manufacturer: data.manufacturer || '',
        category: data.category || '',
      });
    } catch (error) {
      console.error('Error loading material:', error);
      alert('Lỗi khi tải thông tin vật tư');
      navigate('/materials');
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
      newErrors.code = 'Mã vật tư không được để trống';
    }
    if (!formData.name.trim()) {
      newErrors.name = 'Tên vật tư không được để trống';
    }
    if (!formData.unit.trim()) {
      newErrors.unit = 'Đơn vị không được để trống';
    }
    if (!formData.category.trim()) {
      newErrors.category = 'Loại không được để trống';
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
        await materialService.updateMaterial(id, formData);
        alert('Cập nhật vật tư thành công!');
      } else {
        await materialService.createMaterial(formData);
        alert('Thêm vật tư mới thành công!');
      }
      
      navigate('/materials');
    } catch (error) {
      console.error('Error saving material:', error);
      alert('Lỗi: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>{isEditMode ? 'Sửa vật tư' : 'Thêm vật tư mới'}</h2>
        <button onClick={() => navigate('/materials')} className="btn btn-secondary">
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
                    Mã vật tư <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="code"
                    className={`form-control ${errors.code ? 'is-invalid' : ''}`}
                    value={formData.code}
                    onChange={handleChange}
                    placeholder="VD: VT001"
                    disabled={isEditMode}
                  />
                  {errors.code && <div className="invalid-feedback">{errors.code}</div>}
                </div>
              </div>

              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">
                    Tên vật tư <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="VD: Găng tay y tế"
                  />
                  {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>
              </div>

              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">
                    Đơn vị <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="unit"
                    className={`form-control ${errors.unit ? 'is-invalid' : ''}`}
                    value={formData.unit}
                    onChange={handleChange}
                    placeholder="VD: Hộp, Chiếc, Cái"
                  />
                  {errors.unit && <div className="invalid-feedback">{errors.unit}</div>}
                </div>
              </div>

              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Nhà sản xuất</label>
                  <input
                    type="text"
                    name="manufacturer"
                    className="form-control"
                    value={formData.manufacturer}
                    onChange={handleChange}
                    placeholder="VD: ABC Medical"
                  />
                </div>
              </div>

              <div className="col-md-12">
                <div className="mb-3">
                  <label className="form-label">
                    Loại <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="category"
                    className={`form-control ${errors.category ? 'is-invalid' : ''}`}
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="VD: Bảo hộ, Tiêu hao, Dụng cụ"
                  />
                  {errors.category && <div className="invalid-feedback">{errors.category}</div>}
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-end gap-2">
              <button 
                type="button" 
                onClick={() => navigate('/materials')} 
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

export default MaterialForm;
