import api from './api';

const issueNoteService = {
  getAllIssueNotes: async () => {
    const response = await api.get('/issue-notes');
    return response.data;
  },

  getIssueNoteById: async (id) => {
    const response = await api.get(`/issue-notes/${id}`);
    return response.data;
  },

  getIssueNoteByRequisition: async (requisitionId) => {
    const response = await api.get(`/issue-notes/requisition/${requisitionId}`);
    return response.data;
  },

  getIssueNotesByDateRange: async (startDate, endDate) => {
    const response = await api.get('/issue-notes/date-range', {
      params: { startDate, endDate }
    });
    return response.data;
  },
};

export default issueNoteService;
