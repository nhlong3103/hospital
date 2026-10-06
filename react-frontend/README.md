# HOSPITAL MATERIAL MANAGEMENT - REACT FRONTEND

Frontend application cho Hệ thống Quản lý Vật tư Tiêu hao Y tế.

## 🚀 CÔNG NGHỆ SỬ DỤNG

- **ReactJS** 18.2.0
- **React Router DOM** 6.20.0 - Routing
- **Axios** 1.6.2 - HTTP Client
- **Bootstrap 5.3.2** - UI Framework (qua CDN)
- **Bootstrap Icons** - Icons

## 📁 CẤU TRÚC PROJECT

```
src/
├── components/
│   ├── layout/
│   │   ├── Navbar.js                 ✅ Top navigation bar
│   │   └── Sidebar.js                ✅ Side menu
│   ├── materials/
│   │   ├── MaterialList.js           ✅ Danh sách vật tư + CRUD
│   │   └── MaterialForm.js           ✅ Form thêm/sửa vật tư
│   ├── requisitions/
│   │   └── RequisitionList.js        ✅ Danh sách phiếu lĩnh + Workflow
│   ├── stock/                        🔄 Đang phát triển
│   ├── goods-receipts/               🔄 Đang phát triển
│   ├── users/                        🔄 Đang phát triển
│   ├── departments/                  🔄 Đang phát triển
│   └── suppliers/                    🔄 Đang phát triển
│   └── Dashboard.js                  ✅ Trang chủ với thống kê
├── services/
│   ├── api.js                        ✅ Axios config
│   ├── materialService.js            ✅ Material APIs
│   ├── stockService.js               ✅ Stock APIs
│   ├── requisitionService.js         ✅ Requisition APIs
│   └── commonServices.js             ✅ User, Department, Supplier APIs
├── App.js                            ✅ Main app với routing
└── index.js                          ✅ Entry point
```

## 🔧 CÀI ĐẶT VÀ CHẠY

### Bước 1: Cài đặt dependencies

```bash
npm install
```

### Bước 2: Cấu hình Backend URL

Mặc định backend URL là `http://localhost:8080/api/v1`

Nếu backend của bạn chạy ở port khác, sửa trong file `src/services/api.js`:

```javascript
const API_BASE_URL = 'http://localhost:8080/api/v1';  // Đổi port nếu cần
```

### Bước 3: Chạy development server

```bash
npm start
```

Application sẽ chạy tại: **http://localhost:3000**

### Bước 4: Build cho production

```bash
npm run build
```

Build files sẽ được tạo trong folder `build/`

## 📋 TÍNH NĂNG HIỆN TẠI

### ✅ Đã hoàn thành:

#### 1. Dashboard
- Thống kê tổng quan (tổng vật tư, sắp hết hạn, sắp hết, phiếu chờ duyệt)
- Quick actions
- Responsive cards

#### 2. Quản lý Vật tư (Materials)
- ✅ Xem danh sách vật tư
- ✅ Thêm vật tư mới
- ✅ Sửa vật tư
- ✅ Xóa vật tư
- ✅ Tìm kiếm vật tư theo tên
- ✅ Hiển thị tồn kho real-time

#### 3. Quản lý Phiếu lĩnh (Requisitions)
- ✅ Xem danh sách phiếu lĩnh
- ✅ Lọc theo trạng thái
- ✅ Workflow đầy đủ:
  - Gửi phiếu (DRAFT → PENDING)
  - Xác nhận (PENDING → VERIFIED)
  - Duyệt (VERIFIED → APPROVED)
  - Từ chối (→ REJECTED)
  - Xuất kho (APPROVED → ISSUED)
- ✅ Xóa phiếu (DRAFT/REJECTED)

### 🔄 Đang phát triển:

- Tạo phiếu lĩnh mới (RequisitionForm)
- Chi tiết phiếu lĩnh (RequisitionDetail)
- Quản lý Tồn kho (Stock views)
- Quản lý Nhập kho (GoodsReceipt)
- Chứng từ xuất (IssueNote)
- Quản lý User
- Quản lý Department
- Quản lý Supplier

## 🎨 UI/UX FEATURES

### Bootstrap 5 Components sử dụng:
- **Cards** - Container cho content
- **Tables** - Hiển thị data dạng bảng
- **Forms** - Input forms với validation
- **Buttons** - Actions buttons với icons
- **Badges** - Status indicators
- **Dropdowns** - Menu actions
- **Spinners** - Loading states
- **Alerts** - Success/Error messages

### Layout:
- **Fixed Navbar** - Top navigation bar
- **Fixed Sidebar** - Side menu (250px width)
- **Main Content** - Responsive content area
- **Responsive** - Mobile-friendly

## 🔐 AUTHENTICATION (Sẽ implement)

Hiện tại authentication đang bị disabled để test dễ dàng.

Khi implement JWT:
1. Login component
2. Store token trong localStorage
3. Add token vào headers trong `api.js`
4. Implement PrivateRoute
5. Role-based access control

## 🛠️ API INTEGRATION

### Services đã tạo:

**materialService.js:**
- getAllMaterials()
- getMaterialById(id)
- createMaterial(data)
- updateMaterial(id, data)
- deleteMaterial(id)
- searchMaterials(name)

**stockService.js:**
- getStocksByMaterial(materialId)
- getTotalStock(materialId)
- getExpiringStock(daysThreshold)
- getLowStock(threshold)
- checkAvailability(materialId, quantity)

**requisitionService.js:**
- getAllRequisitions(params)
- getRequisitionById(id)
- createRequisition(data)
- deleteRequisition(id)
- submitRequisition(id)
- verifyRequisition(id, userId)
- approveRequisition(id, userId)
- rejectRequisition(id, userId)
- issueGoods(id, issuedBy, receivedBy)

**commonServices.js:**
- userService: CRUD users
- departmentService: CRUD departments
- supplierService: CRUD suppliers

## 📝 CÁCH SỬ DỤNG

### 1. Quản lý Vật tư:
- Vào menu "Quản lý Vật tư"
- Click "Thêm vật tư mới" để tạo mới
- Click icon "Sửa" để chỉnh sửa
- Click icon "Xóa" để xóa

### 2. Quản lý Phiếu lĩnh:
- Vào menu "Phiếu lĩnh"
- Lọc theo trạng thái nếu cần
- Click "Gửi" để gửi phiếu DRAFT
- Click "Xác nhận" để Thủ kho verify
- Click "Duyệt" để Trưởng khoa approve
- Click "Xuất kho" để xuất hàng

## 🐛 TROUBLESHOOTING

### Lỗi: Cannot connect to backend

**Nguyên nhân:** Backend chưa chạy hoặc URL sai

**Giải pháp:**
1. Chạy backend: `mvn spring-boot:run`
2. Verify backend đang chạy: http://localhost:8080/swagger-ui.html
3. Check URL trong `src/services/api.js`

### Lỗi: CORS policy error

**Nguyên nhân:** Backend chưa enable CORS cho localhost:3000

**Giải pháp:** Backend đã có CorsConfig cho phép tất cả origins.

### Lỗi: Module not found

**Nguyên nhân:** Dependencies chưa được cài

**Giải pháp:**
```bash
rm -rf node_modules
npm install
```

## 🚀 DEPLOYMENT

### Build production:
```bash
npm run build
```

### Deploy với Nginx:
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    root /path/to/build;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://localhost:8080;
    }
}
```

## 📚 DEVELOPMENT GUIDE

### Thêm component mới:

1. Tạo component trong folder tương ứng
2. Import các services cần thiết
3. Sử dụng React Hooks (useState, useEffect)
4. Styling với Bootstrap classes
5. Thêm route trong App.js

### Code style:
- Functional components với Hooks
- Async/await cho API calls
- Try-catch cho error handling
- Bootstrap classes cho styling
- Comments cho logic phức tạp

## 📞 SUPPORT

**GitHub:** [Link to repo]
**Documentation:** Backend Swagger UI
**Contact:** [Your contact]

## 📄 LICENSE

Internal use only - Bệnh viện Đa khoa Phú Nhuận

---

**Version:** 1.0.0  
**Last Updated:** 2026-01-10  
**Status:** In Development 🚧
