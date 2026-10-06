import api from './api';

const purchasePlanService = {

  getAllPurchasePlans: async (params = {}) => {
    const response = await api.get('/purchase-plans', { params });
    return response.data;
  },

  getPurchasePlanById: async (id) => {
    const response = await api.get(`/purchase-plans/${id}`);
    return response.data;
  },

  createPurchasePlan: async (planData) => {
    const response = await api.post('/purchase-plans', planData);
    return response.data;
  },

  updatePurchasePlan: async (id, planData) => {
    const response = await api.put(`/purchase-plans/${id}`, planData);
    return response.data;
  },

  deletePurchasePlan: async (id) => {
    const response = await api.delete(`/purchase-plans/${id}`);
    return response;
  },

  getRecommendedQuantity: async (materialId) => {
    const response = await api.get('/purchase-plans/recommended-quantity', {
      params: { materialId }
    });
    return response.data;
  },

  submitPurchasePlan: async (id) => {
    const response = await api.post(`/purchase-plans/${id}/submit`);
    return response.data;
  },

  approvePurchasePlan: async (id) => {
    const response = await api.post(`/purchase-plans/${id}/approve`);
    return response.data;
  },

  rejectPurchasePlan: async (id, reason) => {
    const response = await api.post(`/purchase-plans/${id}/reject`, null, {
      params: { reason }
    });
    return response.data;
  },

  placeOrder: async (id) => {
    const response = await api.post(`/purchase-plans/${id}/place-order`);
    return response.data;
  },
};

export default purchasePlanService;
