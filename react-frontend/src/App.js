import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Login from './components/auth/Login';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Dashboard from './components/Dashboard';
import MaterialList from './components/materials/MaterialList';
import MaterialForm from './components/materials/MaterialForm';
import PurchasePlanList from './components/purchase-plans/PurchasePlanList';
import PurchasePlanForm from './components/purchase-plans/PurchasePlanForm';
import PurchasePlanDetail from './components/purchase-plans/PurchasePlanDetail';
import RequisitionList from './components/requisitions/RequisitionList';
import RequisitionForm from './components/requisitions/RequisitionForm';
import RequisitionDetail from './components/requisitions/RequisitionDetail';
import GoodsReceiptList from './components/goods-receipts/GoodsReceiptList';
import GoodsReceiptForm from './components/goods-receipts/GoodsReceiptForm';
import GoodsReceiptDetail from './components/goods-receipts/GoodsReceiptDetail';
import PaymentRequest from './components/goods-receipts/PaymentRequest';
import StockList from './components/stock/StockList';
import StockAlertList from './components/stock/StockAlertList';
import IssueNoteList from './components/issue-notes/IssueNoteList';
import IssueNoteDetail from './components/issue-notes/IssueNoteDetail';
import UserList from './components/users/UserList';
import UserForm from './components/users/UserForm';
import DepartmentList from './components/departments/DepartmentList';
import DepartmentForm from './components/departments/DepartmentForm';
import SupplierList from './components/suppliers/SupplierList';
import SupplierForm from './components/suppliers/SupplierForm';
import authService from './services/authService';
import { ROLES } from './utils/roles';

const WAREHOUSE_ROLES = [ROLES.ADMIN, ROLES.WAREHOUSE_KEEPER, ROLES.WAREHOUSE_MANAGER];
const MATERIAL_MANAGE_ROLES = [ROLES.ADMIN, ROLES.WAREHOUSE_KEEPER, ROLES.WAREHOUSE_MANAGER];
const RECEIPT_ROLES = [ROLES.ADMIN, ROLES.WAREHOUSE_KEEPER, ROLES.WAREHOUSE_MANAGER, ROLES.ACCOUNTANT];
const REQUISITION_ROLES = [
  ROLES.ADMIN, ROLES.WAREHOUSE_KEEPER, ROLES.WAREHOUSE_MANAGER,
  ROLES.DEPARTMENT_HEAD, ROLES.DEPARTMENT_STAFF,
];
const DEPARTMENT_ROLES = [ROLES.DEPARTMENT_HEAD, ROLES.DEPARTMENT_STAFF];

const guard = (roles, element) => (
  <ProtectedRoute roles={roles}>{element}</ProtectedRoute>
);

const MainLayout = () => {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="App">
      <Navbar />
      <Sidebar />

      <div className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />

          <Route path="/materials" element={<MaterialList />} />
          <Route path="/materials/new" element={guard(MATERIAL_MANAGE_ROLES, <MaterialForm />)} />
          <Route path="/materials/edit/:id" element={guard(MATERIAL_MANAGE_ROLES, <MaterialForm />)} />

          <Route path="/stock" element={guard(WAREHOUSE_ROLES, <StockList />)} />
          <Route path="/stock/expiring" element={guard(WAREHOUSE_ROLES, <StockAlertList key="expiring" type="expiring" />)} />
          <Route path="/stock/low" element={guard(WAREHOUSE_ROLES, <StockAlertList key="low" type="low" />)} />

          <Route path="/purchase-plans" element={guard(WAREHOUSE_ROLES, <PurchasePlanList />)} />
          <Route path="/purchase-plans/new" element={guard([ROLES.WAREHOUSE_KEEPER], <PurchasePlanForm />)} />
          <Route path="/purchase-plans/edit/:id" element={guard([ROLES.WAREHOUSE_KEEPER], <PurchasePlanForm />)} />
          <Route path="/purchase-plans/:id" element={guard(WAREHOUSE_ROLES, <PurchasePlanDetail />)} />

          <Route path="/goods-receipts" element={guard(RECEIPT_ROLES, <GoodsReceiptList />)} />
          <Route path="/goods-receipts/new" element={guard([ROLES.WAREHOUSE_KEEPER], <GoodsReceiptForm />)} />
          <Route path="/goods-receipts/:id" element={guard(RECEIPT_ROLES, <GoodsReceiptDetail />)} />
          <Route
            path="/goods-receipts/:id/payment-request"
            element={guard([ROLES.ACCOUNTANT, ROLES.WAREHOUSE_MANAGER], <PaymentRequest />)}
          />

          <Route path="/requisitions" element={guard(REQUISITION_ROLES, <RequisitionList />)} />
          <Route path="/requisitions/new" element={guard(DEPARTMENT_ROLES, <RequisitionForm />)} />
          <Route path="/requisitions/:id" element={guard(REQUISITION_ROLES, <RequisitionDetail />)} />

          <Route path="/issue-notes" element={guard(REQUISITION_ROLES, <IssueNoteList />)} />
          <Route path="/issue-notes/:id" element={guard(REQUISITION_ROLES, <IssueNoteDetail />)} />

          <Route path="/users" element={guard([ROLES.ADMIN], <UserList />)} />
          <Route path="/users/new" element={guard([ROLES.ADMIN], <UserForm />)} />
          <Route path="/users/edit/:id" element={guard([ROLES.ADMIN], <UserForm />)} />

          <Route path="/departments" element={guard([ROLES.ADMIN], <DepartmentList />)} />
          <Route path="/departments/new" element={guard([ROLES.ADMIN], <DepartmentForm />)} />
          <Route path="/departments/edit/:id" element={guard([ROLES.ADMIN], <DepartmentForm />)} />

          <Route path="/suppliers" element={guard(WAREHOUSE_ROLES, <SupplierList />)} />
          <Route path="/suppliers/new" element={guard(WAREHOUSE_ROLES, <SupplierForm />)} />
          <Route path="/suppliers/edit/:id" element={guard(WAREHOUSE_ROLES, <SupplierForm />)} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/*" element={<MainLayout />} />
      </Routes>
    </Router>
  );
}

const NotFound = () => (
  <div className="card">
    <div className="card-body text-center">
      <i className="bi bi-exclamation-triangle" style={{ fontSize: '5rem', color: '#dc3545' }}></i>
      <h3 className="mt-3">404 - Không tìm thấy trang</h3>
      <p className="text-muted">Trang bạn đang tìm không tồn tại.</p>
      <a href="/" className="btn btn-primary">Về trang chủ</a>
    </div>
  </div>
);

export default App;
