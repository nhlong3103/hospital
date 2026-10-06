import api from './api';

const stockService = {
  getStocksByMaterial: async (materialId) => {
    const response = await api.get(`/stocks/material/${materialId}`);
    return response.data;
  },

  getTotalStock: async (materialId) => {
    const response = await api.get(`/stocks/material/${materialId}/total`);
    return response.data;
  },

  getExpiringStock: async (daysThreshold = 30) => {
    const response = await api.get('/stocks/expiring-soon', {
      params: { daysThreshold }
    });
    return response.data;
  },

  getLowStock: async (threshold = 10) => {
    const response = await api.get('/stocks/low-stock', {
      params: { threshold }
    });
    return response.data;
  },

  checkAvailability: async (materialId, requiredQuantity) => {
    const response = await api.get('/stocks/check-availability', {
      params: { materialId, requiredQuantity }
    });
    return response.data;
  },

  updateStorageLocation: async (stockId, location) => {
    const response = await api.patch(`/stocks/${stockId}/location`, null, {
      params: { location }
    });
    return response.data;
  },
};

export default stockService;
