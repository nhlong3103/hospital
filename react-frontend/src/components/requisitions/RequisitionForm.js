import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import requisitionService from '../../services/requisitionService';
import materialService from '../../services/materialService';
import authService from '../../services/authService';
import { departmentService } from '../../services/commonServices';

const RequisitionForm = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  const [formData, setFormData] = useState({
    departmentId: user?.departmentId || '',
    requisitionDate: new Date().toISOString().split('T')[0],
    items: [{ materialId: '', requestedQuantity: '' }]
  });

  const [materials, setMaterials] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setDataLoading(true);
      setError(null);

      let materialsData = [];
      try {
        const materialsResponse = await materialService.getAllMaterials();

        if (Array.isArray(materialsResponse)) {
          materialsData = materialsResponse;
        } else if (materialsResponse && Array.isArray(materialsResponse.data)) {
          materialsData = materialsResponse.data;
        }
      } catch (err) {
        console.error('Error loading materials:', err);
      }

      let departmentsData = [];
      try {
        const departmentsResponse = await departmentService.getAllDepartments();

        if (Array.isArray(departmentsResponse)) {
          departmentsData = departmentsResponse;
        } else if (departmentsResponse && Array.isArray(departmentsResponse.data)) {
          departmentsData = departmentsResponse.data;
        }
      } catch (err) {
        console.error('Error loading departments:', err);
      }

      setMaterials(materialsData);
      setDepartments(departmentsData);

      if (materialsData.length === 0) {
        setError('Không có dữ liệu vật tư. Vui lòng kiểm tra database.');
      } else if (departmentsData.length === 0) {
        setError('Không có dữ liệu khoa/phòng. Vui lòng kiểm tra database.');
      }

    } catch (error) {
      console.error('Error loading data:', error);
      setError('Lỗi khi tải dữ liệu: ' + (error.message || 'Unknown error'));
    } finally {
      setDataLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    setFormData(prev => ({
      ...prev,
      items: newItems
    }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { materialId: '', requestedQuantity: '' }]
    }));
  };

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      const newItems = formData.items.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        items: newItems
      }));
    }
  };

  const validate = () => {
    if (!formData.departmentId) {
      alert('Tài khoản của bạn chưa thuộc khoa/phòng nào, vui lòng liên hệ quản trị viên');
      return false;
    }
    if (!formData.requisitionDate) {
      alert('Vui lòng chọn ngày lĩnh');
      return false;
    }

    for (let i = 0; i < formData.items.length; i++) {
      const item = formData.items[i];
      if (!item.materialId) {
        alert(`Vui lòng chọn vật tư cho dòng ${i + 1}`);
        return false;
      }
      if (!item.requestedQuantity || item.requestedQuantity <= 0) {
        alert(`Vui lòng nhập số lượng hợp lệ cho dòng ${i + 1}`);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      setLoading(true);

      const requestData = {
        departmentId: parseInt(formData.departmentId),
        requisitionDate: formData.requisitionDate,
        items: formData.items.map(item => ({
          materialId: parseInt(item.materialId),
          requestedQuantity: parseInt(item.requestedQuantity)
        }))
      };

      await requisitionService.createRequisition(requestData);

      alert('Tạo phiếu lĩnh thành công!');
      navigate('/requisitions');
    } catch (error) {
      console.error('Error creating requisition:', error);
      alert('Lỗi khi tạo phiếu lĩnh: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  if (dataLoading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Tạo phiếu lĩnh mới</h2>
        <button onClick={() => navigate('/requisitions')} className="btn btn-secondary">
          <i className="bi bi-arrow-left me-2"></i>Quay lại
        </button>
      </div>

      {error && (
        <div className="alert alert-warning alert-dismissible fade show" role="alert">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
          <button type="button" className="btn-close" onClick={() => setError(null)}></button>
        </div>
      )}

      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Khoa/Phòng</label>
                  <select
                    name="departmentId"
                    className="form-select"
                    value={formData.departmentId}
                    onChange={handleChange}
                    disabled
                  >
                    <option value="">-- Chưa có khoa/phòng --</option>
                    {departments.map(dept => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name} ({dept.code})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Người lập</label>
                  <input
                    type="text"
                    className="form-control"
                    value={user?.fullName || ''}
                    disabled
                  />
                </div>
              </div>

              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">
                    Ngày lĩnh <span className="text-danger">*</span>
                  </label>
                  <input
                    type="date"
                    name="requisitionDate"
                    className="form-control"
                    value={formData.requisitionDate}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <hr />

            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">Danh sách vật tư</h5>
              <button type="button" onClick={addItem} className="btn btn-sm btn-secondary">
                <i className="bi bi-plus-circle me-1"></i>Thêm vật tư
              </button>
            </div>

            {formData.items.map((item, index) => (
              <div key={index} className="card mb-3 border">
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6">
                      <label className="form-label">
                        Vật tư <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-select"
                        value={item.materialId}
                        onChange={(e) => handleItemChange(index, 'materialId', e.target.value)}
                        required
                      >
                        <option value="">-- Chọn vật tư --</option>
                        {materials.map(material => (
                          <option key={material.id} value={material.id}>
                            {material.name} ({material.code}) - Tồn: {material.totalStock || 0}
                          </option>
                        ))}
                      </select>
                      {materials.length === 0 && (
                        <small className="text-danger">Không có dữ liệu vật tư</small>
                      )}
                    </div>

                    <div className="col-md-4">
                      <label className="form-label">
                        Số lượng <span className="text-danger">*</span>
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        value={item.requestedQuantity}
                        onChange={(e) => handleItemChange(index, 'requestedQuantity', e.target.value)}
                        min="1"
                        placeholder="Nhập số lượng"
                        required
                      />
                    </div>

                    <div className="col-md-2 d-flex align-items-end">
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="btn btn-danger w-100"
                        disabled={formData.items.length === 1}
                        title="Xóa vật tư này"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <hr />

            <div className="d-flex justify-content-end gap-2">
              <button
                type="button"
                onClick={() => navigate('/requisitions')}
                className="btn btn-secondary"
              >
                <i className="bi bi-x-circle me-2"></i>
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
                    Đang tạo...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-circle me-2"></i>
                    Tạo phiếu lĩnh
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

export default RequisitionForm;
