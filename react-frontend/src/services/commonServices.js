import api from './api';

export const userService = {
  getAllUsers: async (params = {}) => {
    const response = await api.get('/users', { params });
    return response.data;
  },

  getUserById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  createUser: async (userData) => {
    const response = await api.post('/users', userData);
    return response.data;
  },

  updateUser: async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  deleteUser: async (id) => {
    await api.delete(`/users/${id}`);
  },

  changePassword: async (id, oldPassword, newPassword) => {
    await api.post(`/users/${id}/change-password`, null, {
      params: { oldPassword, newPassword }
    });
  },

  updateStatus: async (id, status) => {
    const response = await api.patch(`/users/${id}/status`, null, {
      params: { status }
    });
    return response.data;
  },

  resetPassword: async (id, newPassword) => {
    await api.post(`/users/${id}/reset-password`, null, {
      params: { newPassword }
    });
  },
};

export const departmentService = {
  getAllDepartments: async () => {
    const response = await api.get('/departments');
    return response.data;
  },

  getDepartmentById: async (id) => {
    const response = await api.get(`/departments/${id}`);
    return response.data;
  },

  createDepartment: async (deptData) => {
    const response = await api.post('/departments', deptData);
    return response.data;
  },

  updateDepartment: async (id, deptData) => {
    const response = await api.put(`/departments/${id}`, deptData);
    return response.data;
  },

  deleteDepartment: async (id) => {
    await api.delete(`/departments/${id}`);
  },

  assignHead: async (departmentId, userId) => {
    const response = await api.patch(`/departments/${departmentId}/head/${userId}`);
    return response.data;
  },
};

export const supplierService = {
  getAllSuppliers: async () => {
    const response = await api.get('/suppliers');
    return response.data;
  },

  getSupplierById: async (id) => {
    const response = await api.get(`/suppliers/${id}`);
    return response.data;
  },

  createSupplier: async (supplierData) => {
    const response = await api.post('/suppliers', supplierData);
    return response.data;
  },

  updateSupplier: async (id, supplierData) => {
    const response = await api.put(`/suppliers/${id}`, supplierData);
    return response.data;
  },

  deleteSupplier: async (id) => {
    await api.delete(`/suppliers/${id}`);
  },

  searchSuppliers: async (name) => {
    const response = await api.get('/suppliers/search', { params: { name } });
    return response.data;
  },
};
