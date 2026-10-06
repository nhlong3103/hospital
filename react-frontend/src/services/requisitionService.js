import api from './api';

const requisitionService = {
  
  getAllRequisitions: async (params = {}) => {
    const response = await api.get('/requisitions', { params });
    return response.data;
  },

  getRequisitionById: async (id) => {
    const response = await api.get(`/requisitions/${id}`);
    return response.data;
  },

  createRequisition: async (requisitionData) => {
    const response = await api.post('/requisitions', requisitionData);
    return response.data;
  },

  deleteRequisition: async (id) => {
    const response = await api.delete(`/requisitions/${id}`);
    return response;
  },

  getRequisitionsByDateRange: async (startDate, endDate) => {
    const response = await api.get('/requisitions/date-range', {
      params: { startDate, endDate }
    });
    return response.data;
  },

  submitRequisition: async (id) => {
    const response = await api.post(`/requisitions/${id}/submit`);
    return response.data;
  },

  verifyRequisition: async (id) => {
    const response = await api.post(`/requisitions/${id}/verify`);
    return response.data;
  },

  approveRequisition: async (id) => {
    const response = await api.post(`/requisitions/${id}/approve`);
    return response.data;
  },

  rejectRequisition: async (id, reason) => {
    const response = await api.post(`/requisitions/${id}/reject`, null, {
      params: { reason }
    });
    return response.data;
  },

  issueGoods: async (id) => {
    const response = await api.post(`/requisitions/${id}/issue`);
    return response.data;
  },

  checkAvailability: async (id) => {
    const response = await api.get(`/requisitions/${id}/check-availability`);
    return response.data;
  },
};

export default requisitionService;
