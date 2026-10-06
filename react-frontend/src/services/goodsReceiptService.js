import api from './api';

const goodsReceiptService = {

  getAllGoodsReceipts: async (params = {}) => {
    const response = await api.get('/goods-receipts', { params });
    return response.data;
  },

  getGoodsReceiptById: async (id) => {
    const response = await api.get(`/goods-receipts/${id}`);
    return response.data;
  },

  createGoodsReceipt: async (receiptData) => {
    const response = await api.post('/goods-receipts', receiptData);
    return response.data;
  },

  deleteGoodsReceipt: async (id) => {
    const response = await api.delete(`/goods-receipts/${id}`);
    return response;
  },

  confirmReceived: async (id) => {
    const response = await api.post(`/goods-receipts/${id}/confirm-received`);
    return response.data;
  },

  verifyInvoice: async (id) => {
    const response = await api.post(`/goods-receipts/${id}/verify-invoice`);
    return response.data;
  },

  finalizeReceipt: async (id) => {
    const response = await api.post(`/goods-receipts/${id}/finalize`);
    return response.data;
  },

  getPaymentRequest: async (id) => {
    const response = await api.get(`/goods-receipts/${id}/payment-request`);
    return response.data;
  },
};

export default goodsReceiptService;
