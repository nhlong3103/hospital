import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import authService from '../../services/authService';
import { ROLES, hasAnyRole } from '../../utils/roles';

const Sidebar = () => {
  const location = useLocation();
  const user = authService.getCurrentUser();

  const menuItems = [
    {
      title: 'Dashboard',
      icon: 'bi-speedometer2',
      path: '/',
    },
    {
      title: 'Quản lý Vật tư',
      icon: 'bi-box-seam',
      path: '/materials',
    },
    {
      title: 'Tồn kho',
      icon: 'bi-boxes',
      path: '/stock',
      roles: [ROLES.ADMIN, ROLES.WAREHOUSE_KEEPER, ROLES.WAREHOUSE_MANAGER],
      children: [
        { title: 'Xem tồn kho', path: '/stock' },
        { title: 'Sắp hết hạn', path: '/stock/expiring' },
        { title: 'Sắp hết', path: '/stock/low' },
      ]
    },
    {
      title: 'Kế hoạch đặt hàng',
      icon: 'bi-clipboard-check',
      path: '/purchase-plans',
      roles: [ROLES.ADMIN, ROLES.WAREHOUSE_KEEPER, ROLES.WAREHOUSE_MANAGER],
    },
    {
      title: 'Nhập kho',
      icon: 'bi-box-arrow-in-down',
      path: '/goods-receipts',
      roles: [ROLES.ADMIN, ROLES.WAREHOUSE_KEEPER, ROLES.WAREHOUSE_MANAGER, ROLES.ACCOUNTANT],
    },
    {
      title: 'Phiếu lĩnh',
      icon: 'bi-file-earmark-text',
      path: '/requisitions',
      roles: [
        ROLES.ADMIN, ROLES.WAREHOUSE_KEEPER, ROLES.WAREHOUSE_MANAGER,
        ROLES.DEPARTMENT_HEAD, ROLES.DEPARTMENT_STAFF,
      ],
    },
    {
      title: 'Chứng từ xuất',
      icon: 'bi-file-earmark-check',
      path: '/issue-notes',
      roles: [
        ROLES.ADMIN, ROLES.WAREHOUSE_KEEPER, ROLES.WAREHOUSE_MANAGER,
        ROLES.DEPARTMENT_HEAD, ROLES.DEPARTMENT_STAFF,
      ],
    },
    {
      title: 'Người dùng',
      icon: 'bi-people',
      path: '/users',
      roles: [ROLES.ADMIN],
    },
    {
      title: 'Khoa/Phòng',
      icon: 'bi-building',
      path: '/departments',
      roles: [ROLES.ADMIN],
    },
    {
      title: 'Nhà cung cấp',
      icon: 'bi-truck',
      path: '/suppliers',
      roles: [ROLES.ADMIN, ROLES.WAREHOUSE_KEEPER, ROLES.WAREHOUSE_MANAGER],
    },
  ];

  const visibleItems = menuItems.filter(item => !item.roles || hasAnyRole(user, item.roles));

  const isActive = (item) => {
    if (location.pathname === item.path) return true;
    return !item.children && item.path !== '/' && location.pathname.startsWith(item.path + '/');
  };

  return (
    <div className="sidebar">
      <div className="p-3">
        <h6 className="text-muted text-uppercase fw-bold mb-3">Menu</h6>
        <nav className="nav flex-column">
          {visibleItems.map((item, index) => (
            <div key={index}>
              <Link
                to={item.path}
                className={`nav-link ${isActive(item) ? 'active' : ''}`}
              >
                <i className={`bi ${item.icon}`}></i>
                {item.title}
              </Link>

              {item.children && (
                <div className="ms-3">
                  {item.children.map((child, childIndex) => (
                    <Link
                      key={childIndex}
                      to={child.path}
                      className={`nav-link nav-link-sm ${location.pathname === child.path ? 'active' : ''}`}
                    >
                      {child.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
