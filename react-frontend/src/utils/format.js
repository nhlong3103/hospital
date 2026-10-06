export const formatDate = (date) => {
  return date ? new Date(date).toLocaleDateString('vi-VN') : '-';
};

export const formatLongDate = (date) => {
  if (!date) {
    return 'Ngày ....... tháng ....... năm .......';
  }
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  return `Ngày ${day} tháng ${month} năm ${d.getFullYear()}`;
};

export const formatCurrency = (value) => {
  if (value === null || value === undefined) {
    return '-';
  }
  return Number(value).toLocaleString('vi-VN') + ' đ';
};
