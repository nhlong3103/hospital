import api from './api';

const materialService = {
  getAllMaterials: async () => {
    const response = await api.get('/materials');
    return response.data;
  },

  getMaterialById: async (id) => {
    const response = await api.get(`/materials/${id}`);
    return response.data;
  },

  createMaterial: async (materialData) => {
    const response = await api.post('/materials', materialData);
    return response.data;
  },

  updateMaterial: async (id, materialData) => {
    const response = await api.put(`/materials/${id}`, materialData);
    return response.data;
  },

  deleteMaterial: async (id) => {
    const response = await api.delete(`/materials/${id}`);
    return response;
  },

  searchMaterials: async (name) => {
    const response = await api.get(`/materials/search`, { params: { name } });
    return response.data;
  },

  getMaterialsByCategory: async (category) => {
    const response = await api.get(`/materials/category/${category}`);
    return response.data;
  },
};

export default materialService;
