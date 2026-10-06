export const ROLES = {
  ADMIN: 'ADMIN',
  WAREHOUSE_KEEPER: 'WAREHOUSE_KEEPER',
  DEPARTMENT_HEAD: 'DEPARTMENT_HEAD',
  DEPARTMENT_STAFF: 'DEPARTMENT_STAFF',
  WAREHOUSE_MANAGER: 'WAREHOUSE_MANAGER',
  ACCOUNTANT: 'ACCOUNTANT',
};

export const ROLE_LABELS = {
  ADMIN: 'Quản trị viên',
  WAREHOUSE_KEEPER: 'Thủ kho',
  DEPARTMENT_HEAD: 'Trưởng khoa/phòng',
  DEPARTMENT_STAFF: 'Nhân viên khoa/phòng (ĐD/KTV)',
  WAREHOUSE_MANAGER: 'Trưởng phòng VTTBYT',
  ACCOUNTANT: 'Kế toán (P.TCKT)',
};

export const hasAnyRole = (user, roles) => {
  return !!user && roles.includes(user.role);
};
