# HƯỚNG DẪN CÀI ĐẶT VÀ CHẠY REACT FRONTEND

## 📋 YÊU CẦU HỆ THỐNG

- **Node.js:** v14.0.0 trở lên
- **npm:** v6.0.0 trở lên (hoặc yarn)
- **Backend API:** Phải đang chạy ở http://localhost:8080

## 🚀 CÀI ĐẶT

### Bước 1: Extract project

Extract folder `react-frontend` vào thư mục làm việc của bạn.

### Bước 2: Mở terminal trong thư mục project

```bash
cd react-frontend
```

### Bước 3: Cài đặt dependencies

```bash
npm install
```

**Lưu ý:** Lần đầu cài đặt sẽ mất 2-5 phút tùy tốc độ internet.

### Bước 4: Kiểm tra Backend đang chạy

Mở trình duyệt và truy cập:
```
http://localhost:8080/swagger-ui.html
```

Nếu thấy Swagger UI → Backend OK!

### Bước 5: Chạy development server

```bash
npm start
```

Application sẽ tự động mở tại: **http://localhost:3000**

---

## 🎯 CẤU TRÚC PROJECT ĐÃ TẠO

```
react-frontend/
├── public/
│   └── index.html              ✅ HTML với Bootstrap 5 CDN
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.js       ✅ Top navigation
│   │   │   └── Sidebar.js      ✅ Side menu
│   │   ├── materials/
│   │   │   ├── MaterialList.js ✅ Danh sách vật tư
│   │   │   └── MaterialForm.js ✅ Form thêm/sửa
│   │   └── requisitions/
│   │       └── RequisitionList.js ✅ Danh sách phiếu lĩnh + Workflow
│   ├── services/
│   │   ├── api.js              ✅ Axios config
│   │   ├── materialService.js  ✅ Material API calls
│   │   ├── stockService.js     ✅ Stock API calls
│   │   ├── requisitionService.js ✅ Requisition API calls
│   │   └── commonServices.js   ✅ User, Dept, Supplier APIs
│   ├── App.js                  ✅ Main app + routing
│   └── index.js                ✅ Entry point
├── package.json                ✅ Dependencies
├── .gitignore                  ✅ Git ignore rules
└── README.md                   ✅ Documentation
```

---

## ✅ TÍNH NĂNG ĐÃ HOÀN THÀNH

### 1. Dashboard (/)
- ✅ Thống kê tổng quan
- ✅ Quick actions
- ✅ Loading states

### 2. Quản lý Vật tư (/materials)
- ✅ Xem danh sách vật tư
- ✅ Tìm kiếm vật tư
- ✅ Thêm vật tư mới
- ✅ Sửa vật tư
- ✅ Xóa vật tư
- ✅ Hiển thị tồn kho

### 3. Quản lý Phiếu lĩnh (/requisitions)
- ✅ Xem danh sách phiếu lĩnh
- ✅ Lọc theo trạng thái
- ✅ Workflow buttons:
  - Gửi (DRAFT → PENDING)
  - Xác nhận (PENDING → VERIFIED)
  - Duyệt (VERIFIED → APPROVED)
  - Từ chối
  - Xuất kho (APPROVED → ISSUED)
- ✅ Xóa phiếu (DRAFT/REJECTED)

---

## 🎨 UI/UX

### Giao diện:
- **Top Navbar:** Fixed, màu primary
- **Sidebar:** Fixed, width 250px
- **Main Content:** Responsive, padding 20px
- **Cards:** Shadow, rounded corners
- **Tables:** Responsive, hover effects
- **Buttons:** Bootstrap colors + icons
- **Forms:** Validation feedback
- **Status Badges:** Color-coded

### Bootstrap 5 Components:
- Cards, Tables, Forms, Buttons
- Badges, Dropdowns, Spinners
- Responsive grid system
- Utility classes

---

## 🔧 CẤU HÌNH

### 1. Backend URL

**File:** `src/services/api.js`

```javascript
const API_BASE_URL = 'http://localhost:8080/api/v1';
```

**Đổi port nếu backend chạy ở port khác.**

### 2. CORS

Backend đã có CorsConfig cho phép tất cả origins. Không cần config thêm.

---

## 📱 SỬ DỤNG APPLICATION

### Bước 1: Login (Tạm thời bỏ qua - Security disabled)

### Bước 2: Dashboard
- Xem thống kê tổng quan
- Click quick actions để thao tác nhanh

### Bước 3: Quản lý Vật tư
1. Click menu "Quản lý Vật tư"
2. Click "Thêm vật tư mới"
3. Điền form và click "Thêm mới"
4. Xem vật tư vừa tạo trong danh sách

### Bước 4: Tạo Phiếu lĩnh
1. Click menu "Phiếu lĩnh"
2. Click "Tạo phiếu lĩnh mới" (Đang phát triển)
3. Hoặc test workflow với phiếu có sẵn

### Bước 5: Workflow Phiếu lĩnh
```
DRAFT → Click "Gửi" → PENDING
PENDING → Click "Xác nhận" (nhập ID Thủ kho) → VERIFIED
VERIFIED → Click "Duyệt" (nhập ID Trưởng khoa) → APPROVED
APPROVED → Click "Xuất kho" (nhập ID Thủ kho + Người nhận) → ISSUED
```

---

## 🐛 XỬ LÝ LỖI

### Lỗi 1: "Cannot connect to backend"

**Hiện tượng:** API calls fail, network error

**Nguyên nhân:** Backend chưa chạy hoặc URL sai

**Giải pháp:**
```bash
# Terminal 1 - Chạy backend
cd /path/to/backend
mvn spring-boot:run

# Terminal 2 - Chạy frontend
cd /path/to/react-frontend
npm start
```

---

### Lỗi 2: "Module not found"

**Hiện tượng:** Import errors, module not found

**Giải pháp:**
```bash
# Xóa node_modules và cài lại
rm -rf node_modules package-lock.json
npm install
```

---

### Lỗi 3: "Port 3000 is already in use"

**Giải pháp:**
```bash
# Option 1: Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Option 2: Chạy ở port khác
PORT=3001 npm start
```

---

### Lỗi 4: "CORS policy error"

**Hiện tượng:** Browser console hiển thị CORS error

**Giải pháp:** 
- Backend đã có CorsConfig
- Restart backend
- Clear browser cache

---

## 🔄 DEVELOPMENT WORKFLOW

### 1. Thêm component mới:

```bash
# Tạo component trong folder tương ứng
src/components/[module]/[ComponentName].js
```

### 2. Thêm service mới:

```javascript
// src/services/[moduleName]Service.js
import api from './api';

const moduleService = {
  getAll: async () => {
    const response = await api.get('/endpoint');
    return response.data;
  },
  // ... other methods
};

export default moduleService;
```

### 3. Thêm route:

```javascript
// App.js
import NewComponent from './components/path/NewComponent';

// Trong <Routes>
<Route path="/new-path" element={<NewComponent />} />
```

---

## 📦 BUILD PRODUCTION

### Build:
```bash
npm run build
```

**Output:** Folder `build/` chứa static files

### Deploy:

**Option 1: Nginx**
```nginx
server {
    listen 80;
    root /var/www/build;
    index index.html;
    
    location / {
        try_files $uri /index.html;
    }
    
    location /api {
        proxy_pass http://localhost:8080;
    }
}
```

**Option 2: Serve static**
```bash
npm install -g serve
serve -s build -l 3000
```

---

## 📝 NEXT STEPS

### Tính năng cần thêm:

1. ✅ **RequisitionForm** - Form tạo phiếu lĩnh mới
2. ✅ **RequisitionDetail** - Chi tiết phiếu lĩnh
3. ✅ **Stock views** - Xem tồn kho, sắp hết hạn, sắp hết
4. ✅ **GoodsReceiptList** - Danh sách phiếu nhập + workflow
5. ✅ **GoodsReceiptForm** - Form nhập kho
6. ✅ **IssueNoteList** - Danh sách chứng từ xuất
7. ✅ **UserList** - Quản lý users
8. ✅ **DepartmentList** - Quản lý khoa/phòng
9. ✅ **SupplierList** - Quản lý nhà cung cấp

### Improvements:

1. **Authentication**
   - Login page
   - JWT token management
   - PrivateRoute component
   - Role-based access

2. **Pagination**
   - Thêm pagination cho tables
   - Page size selector
   - Total count display

3. **Advanced Search**
   - Multiple filters
   - Date range picker
   - Export to Excel

4. **Notifications**
   - Toast messages
   - Real-time updates
   - Push notifications

5. **UI Enhancements**
   - Loading skeletons
   - Better error messages
   - Confirmation modals
   - Print views

---

## 🎯 TESTING CHECKLIST

- [ ] Backend đang chạy (http://localhost:8080)
- [ ] npm install thành công
- [ ] npm start chạy không lỗi
- [ ] Dashboard hiển thị đúng
- [ ] Material List load được data
- [ ] Thêm material mới thành công
- [ ] Sửa material thành công
- [ ] Xóa material thành công
- [ ] Tìm kiếm material hoạt động
- [ ] Requisition List load được data
- [ ] Workflow buttons hoạt động
- [ ] Status badges hiển thị đúng màu
- [ ] Responsive trên mobile
- [ ] Console không có error

---

## 📞 SUPPORT

**Issue:** Báo lỗi hoặc yêu cầu feature
**Documentation:** Xem README.md
**Backend API Docs:** http://localhost:8080/swagger-ui.html

---

**Happy Coding!** 🚀
