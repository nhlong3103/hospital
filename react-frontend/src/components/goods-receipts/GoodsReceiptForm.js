import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import materialService from '../../services/materialService';
import goodsReceiptService from '../../services/goodsReceiptService';
import { supplierService } from '../../services/commonServices';

const emptyItem = { materialId: '', quantity: '', unitPrice: '', batchNumber: '', expiryDate: '' };

const GoodsReceiptForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    supplierId: '',
    invoiceNumber: '',
    receiptDate: new Date().toISOString().split('T')[0],
    items: [{ ...emptyItem }]
  });

  const [materials, setMaterials] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [materialsData, suppliersData] = await Promise.all([
        materialService.getAllMaterials(),
        supplierService.getAllSuppliers()
      ]);

      setMaterials(materialsData);
      setSuppliers(suppliersData);
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Lỗi khi tải dữ liệu');
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

  const validate = () => {
    if (!formData.supplierId) {
      alert('Vui lòng chọn nhà cung cấp');
      return false;
    }
    if (!formData.invoiceNumber.trim()) {
      alert('Vui lòng nhập số hóa đơn');
      return false;
    }
    if (!formData.receiptDate) {
      alert('Vui lòng chọn ngày nhập');
      return false;
    }

    for (let i = 0; i < formData.items.length; i++) {
      const item = formData.items[i];
      if (!item.materialId) {
        alert(`Vui lòng chọn vật tư cho dòng ${i + 1}`);
        return false;
      }
      if (!item.quantity || item.quantity <= 0) {
        alert(`Vui lòng nhập số lượng hợp lệ cho dòng ${i + 1}`);
        return false;
      }
      if (item.unitPrice === '' || item.unitPrice < 0) {
        alert(`Vui lòng nhập đơn giá hợp lệ cho dòng ${i + 1}`);
        return false;
      }
      if (!item.batchNumber.trim()) {
        alert(`Vui lòng nhập số lô cho dòng ${i + 1}`);
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
        supplierId: parseInt(formData.supplierId),
        invoiceNumber: formData.invoiceNumber.trim(),
        receiptDate: formData.receiptDate,
        items: formData.items.map(item => ({
          materialId: parseInt(item.materialId),
          quantity: parseInt(item.quantity),
          unitPrice: parseFloat(item.unitPrice),
          batchNumber: item.batchNumber.trim(),
          expiryDate: item.expiryDate || null
        }))
      };

      await goodsReceiptService.createGoodsReceipt(requestData);

      alert('Lập sổ kiểm nhập thành công!');
      navigate('/goods-receipts');
    } catch (error) {
      console.error('Error creating goods receipt:', error);
      alert('Lỗi: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Lập sổ kiểm nhập hàng hóa</h2>
        <button onClick={() => navigate('/goods-receipts')} className="btn btn-secondary">
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
                    Nhà cung cấp <span className="text-danger">*</span>
                  </label>
                  <select
                    name="supplierId"
                    className="form-select"
                    value={formData.supplierId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Chọn nhà cung cấp --</option>
                    {suppliers.map(supplier => (
                      <option key={supplier.id} value={supplier.id}>
                        {supplier.name} ({supplier.code})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">
                    Số hóa đơn <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="invoiceNumber"
                    className="form-control"
                    value={formData.invoiceNumber}
                    onChange={handleChange}
                    placeholder="VD: HD001"
                    required
                  />
                </div>
              </div>

              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">
                    Ngày nhập <span className="text-danger">*</span>
                  </label>
                  <input
                    type="date"
                    name="receiptDate"
                    className="form-control"
                    value={formData.receiptDate}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <hr />

            <h5 className="mb-3">Danh sách vật tư nhập</h5>

            {formData.items.map((item, index) => (
              <div key={index} className="card mb-3">
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6">
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
                            {material.name} ({material.code})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-3">
                      <label className="form-label">Số lượng <span className="text-danger">*</span></label>
                      <input
                        type="number"
                        className="form-control"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                        min="1"
                        required
                      />
                    </div>

                    <div className="col-md-3">
                      <label className="form-label">Đơn giá (đ) <span className="text-danger">*</span></label>
                      <input
                        type="number"
                        className="form-control"
                        value={item.unitPrice}
                        onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                        min="0"
                        required
                      />
                    </div>

                    <div className="col-md-5 mt-2">
                      <label className="form-label">Số lô <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        className="form-control"
                        value={item.batchNumber}
                        onChange={(e) => handleItemChange(index, 'batchNumber', e.target.value)}
                        placeholder="VD: LOT001"
                        required
                      />
                    </div>

                    <div className="col-md-5 mt-2">
                      <label className="form-label">Hạn sử dụng</label>
                      <input
                        type="date"
                        className="form-control"
                        value={item.expiryDate}
                        onChange={(e) => handleItemChange(index, 'expiryDate', e.target.value)}
                      />
                    </div>

                    <div className="col-md-2 mt-2 d-flex align-items-end">
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="btn btn-danger w-100"
                        disabled={formData.items.length === 1}
                      >
                        <i className="bi bi-trash"></i> Xóa
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
                onClick={() => navigate('/goods-receipts')}
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
                    Đang tạo...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-circle me-2"></i>
                    Tạo phiếu nhập
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

export default GoodsReceiptForm;
