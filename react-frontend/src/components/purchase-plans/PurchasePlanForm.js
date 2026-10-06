import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import purchasePlanService from '../../services/purchasePlanService';
import materialService from '../../services/materialService';

const emptyItem = { materialId: '', requestedQuantity: '', estimatedPrice: '' };

const PurchasePlanForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    planDate: new Date().toISOString().split('T')[0],
    notes: '',
    items: [{ ...emptyItem }]
  });

  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const materialsData = await materialService.getAllMaterials();
      setMaterials(materialsData);

      if (isEditMode) {
        const plan = await purchasePlanService.getPurchasePlanById(id);

        if (plan.status !== 'DRAFT') {
          alert('Chỉ có thể sửa kế hoạch ở trạng thái Nháp');
          navigate('/purchase-plans');
          return;
        }

        setFormData({
          planDate: plan.planDate,
          notes: plan.notes || '',
          items: plan.items.map(item => ({
            materialId: item.materialId,
            requestedQuantity: item.requestedQuantity,
            estimatedPrice: item.estimatedPrice !== null ? item.estimatedPrice : ''
          }))
        });
      }
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Lỗi khi tải dữ liệu: ' + (error.message || 'Unknown error'));
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
      items: [...prev.items, { ...emptyItem }]
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

  const handleRecommend = async (index) => {
    const materialId = formData.items[index].materialId;
    if (!materialId) {
      alert('Vui lòng chọn vật tư trước');
      return;
    }

    try {
      const recommended = await purchasePlanService.getRecommendedQuantity(materialId);
      if (recommended > 0) {
        handleItemChange(index, 'requestedQuantity', recommended);
      } else {
        alert('Tồn kho hiện đủ dùng, không cần đặt thêm theo mức tiêu thụ 30 ngày gần nhất.');
      }
    } catch (error) {
      alert('Lỗi: ' + (error.message || 'Unknown error'));
    }
  };

  const validate = () => {
    if (!formData.planDate) {
      alert('Vui lòng chọn ngày lập kế hoạch');
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
        planDate: formData.planDate,
        notes: formData.notes,
        items: formData.items.map(item => ({
          materialId: parseInt(item.materialId),
          requestedQuantity: parseInt(item.requestedQuantity),
          estimatedPrice: item.estimatedPrice !== '' ? parseFloat(item.estimatedPrice) : null
        }))
      };

      if (isEditMode) {
        await purchasePlanService.updatePurchasePlan(id, requestData);
        alert('Cập nhật kế hoạch thành công!');
      } else {
        await purchasePlanService.createPurchasePlan(requestData);
        alert('Lập kế hoạch đặt hàng thành công!');
      }

      navigate('/purchase-plans');
    } catch (error) {
      console.error('Error saving purchase plan:', error);
      alert('Lỗi: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>{isEditMode ? 'Sửa kế hoạch đặt hàng' : 'Lập kế hoạch đặt hàng'}</h2>
        <button onClick={() => navigate('/purchase-plans')} className="btn btn-secondary">
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
                    Ngày lập <span className="text-danger">*</span>
                  </label>
                  <input
                    type="date"
                    name="planDate"
                    className="form-control"
                    value={formData.planDate}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="col-md-12">
                <div className="mb-3">
                  <label className="form-label">Ghi chú</label>
                  <textarea
                    name="notes"
                    className="form-control"
                    rows="2"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="VD: Dự trù đặt hàng tháng 10"
                  />
                </div>
              </div>
            </div>

            <hr />

            <h5 className="mb-3">Danh sách vật tư cần đặt</h5>

            {formData.items.map((item, index) => (
              <div key={index} className="card mb-3">
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-5">
                      <label className="form-label">Vật tư <span className="text-danger">*</span></label>
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
                    </div>

                    <div className="col-md-3">
                      <label className="form-label">Số lượng <span className="text-danger">*</span></label>
                      <div className="input-group">
                        <input
                          type="number"
                          className="form-control"
                          value={item.requestedQuantity}
                          onChange={(e) => handleItemChange(index, 'requestedQuantity', e.target.value)}
                          min="1"
                          required
                        />
                        <button
                          type="button"
                          className="btn btn-outline-info"
                          onClick={() => handleRecommend(index)}
                          title="Gợi ý theo mức tiêu thụ 30 ngày và tồn kho"
                        >
                          <i className="bi bi-lightbulb"></i>
                        </button>
                      </div>
                    </div>

                    <div className="col-md-3">
                      <label className="form-label">Giá dự kiến (đ)</label>
                      <input
                        type="number"
                        className="form-control"
                        value={item.estimatedPrice}
                        onChange={(e) => handleItemChange(index, 'estimatedPrice', e.target.value)}
                        min="0"
                      />
                    </div>

                    <div className="col-md-1 d-flex align-items-end">
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

            <button type="button" onClick={addItem} className="btn btn-secondary mb-3">
              <i className="bi bi-plus-circle me-2"></i>Thêm vật tư
            </button>

            <hr />

            <div className="d-flex justify-content-end gap-2">
              <button
                type="button"
                onClick={() => navigate('/purchase-plans')}
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
                    {isEditMode ? 'Cập nhật' : 'Lập kế hoạch'}
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

export default PurchasePlanForm;
