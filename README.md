# Hệ thống Quản lý Vật tư Tiêu hao Y tế — Hướng dẫn cài đặt & chạy trên máy local

Project gồm 3 phần, tất cả nằm trong cùng một thư mục:

```
hospital/
├── hospital_material_management.sql   ← Database (MySQL)
├── demo/                              ← Backend (Spring Boot, Java 17)
└── react-frontend/                    ← Frontend (ReactJS)
```

Thứ tự chạy bắt buộc: **Database → Backend → Frontend**.

| Thành phần | Địa chỉ sau khi chạy |
|---|---|
| MySQL | `localhost:3306` |
| Backend API | http://localhost:8080/api/v1 |
| Swagger (tài liệu API) | http://localhost:8080/swagger-ui.html |
| Frontend | http://localhost:3000 |

---

## 1. Cài đặt phần mềm cần thiết

| Phần mềm | Phiên bản | Ghi chú |
|---|---|---|
| **JDK** | **17** | Bắt buộc Java 17 trở lên. Kiểm tra: `java -version` |
| **MySQL** | 8.x | Hoặc dùng **XAMPP** (MySQL/MariaDB + phpMyAdmin) đều được |
| **Node.js** | 18 LTS hoặc 20 LTS | Cài kèm `npm`. Kiểm tra: `node -v` và `npm -v` |
| **IDE Java** | Eclipse hoặc Spring Tool Suite hoặc IntelliJ IDEA hoặc vsCode đã cài extension Java - Dùng để chạy backend |
| **Lombok** | — | Project dùng Lombok. **Eclipse/STS phải cài Lombok** (xem mục 3.1), IntelliJ thì đã có sẵn |

> Không cần cài Maven riêng — project đã có sẵn Maven Wrapper (`mvnw.cmd`).

---

## 2. Database (MySQL)

File SQL **không có** lệnh tạo database, nên cần **tạo database trước rồi mới import**.

- Tên database: **`hospital_material_management`**
- Collation: `utf8mb4_unicode_ci`

### Cách 1: Dùng phpMyAdmin (XAMPP)

1. Mở XAMPP Control Panel → **Start** Apache và MySQL.
2. Vào http://localhost/phpmyadmin
3. Bấm **New** (Mới) → nhập tên `hospital_material_management` → chọn collation `utf8mb4_unicode_ci` → **Create**.
4. Chọn database vừa tạo ở cột bên trái → tab **Import** → chọn file `hospital_material_management.sql` → bấm **Import** (Thực hiện).

### Cách 2: Dùng MySQL Workbench

1. Kết nối vào MySQL server local.
2. Chạy lệnh tạo database:
   ```sql
   CREATE DATABASE hospital_material_management CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
3. Menu **Server → Data Import** → chọn **Import from Self-Contained File** → chọn file `hospital_material_management.sql`.
4. Ở mục **Default Target Schema** chọn `hospital_material_management` → **Start Import**.


> ⚠️ **Import nguyên cả file một lần**, đừng copy từng đoạn ra chạy

Import xong sẽ có 12 bảng: `department`, `goods_receipt`, `goods_receipt_item`, `issue_note`, `material`, `purchase_plan`, `purchase_plan_item`, `requisition`, `requisition_item`, `stock`, `supplier`, `user`.

---

## 3. Backend (Spring Boot) — thư mục `demo`

### 3.1. (Chỉ với Eclipse/STS) Cài Lombok

Nếu không cài, IDE sẽ báo lỗi đỏ khắp nơi kiểu *"method getXxx() is undefined"*.

1. Tải `lombok.jar` tại https://projectlombok.org/download
2. Chạy file (double-click hoặc `java -jar lombok.jar`) → chọn đường dẫn tới Eclipse/STS → **Install / Update**.
3. Khởi động lại Eclipse/STS.

### 3.2. Cấu hình kết nối MySQL

Mở file `demo/src/main/resources/application.properties`, sửa cho khớp với MySQL trên máy bạn (chủ yếu chỉ cần quan tâm tới port 3306, nhưng thông thường thì đây là port mặc định rồi nên khả năng cao là máy nào cũng giống nhau):

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/hospital_material_management?zeroDateTimeBehavior=CONVERT_TO_NULL
spring.datasource.username=root
spring.datasource.password=
```

- Mặc định là user của MySQLWorkBench `root`, **mật khẩu rỗng** (giống XAMPP).
- Nếu MySQL của bạn có mật khẩu → điền vào `spring.datasource.password=...`.
- Nếu MySQL chạy port khác 3306 → sửa số port trong `url`.


### 3.3. Mở project và chạy

**Eclipse / STS:**

1. **File → Import → Maven → Existing Maven Projects** → chọn thư mục `hospital/demo` → **Finish**.
2. Đợi Maven tải thư viện xong (lần đầu có thể mất vài phút, xem thanh tiến trình góc dưới phải).
3. Mở file `demo/src/main/java/com/hospital/DemoApplication.java`
4. Chuột phải → **Run As → Java Application** (hoặc **Spring Boot App**).

**IntelliJ IDEA:**

1. **File → Open** → chọn thư mục `hospital/demo` (hoặc file `pom.xml`) → **Open as Project**.
2. Đợi Maven tải thư viện xong.
3. Mở `DemoApplication.java` → bấm nút ▶ cạnh hàm `main`.


### 3.4. Kiểm tra backend đã chạy

- Console hiện dòng `Tomcat started on port 8080` và `Started DemoApplication` là thành công.


## 4. Frontend (ReactJS) — thư mục `react-frontend`

```bash
npm install
```

```bash
npm start
```

- `npm install` chỉ cần chạy **lần đầu** (hoặc khi `package.json` thay đổi). Lần đầu mất khoảng 2–5 phút.
- Project dùng **Create React App**, nên lệnh chạy là **`npm start`**.
- Trình duyệt sẽ tự mở http://localhost:3000

Frontend gọi API tới `http://localhost:8080/api/v1`. Nếu backend chạy port khác, sửa trong `react-frontend/src/services/api.js`:

```javascript
const API_BASE_URL = 'http://localhost:8080/api/v1';
```

---

## 5. Tài khoản đăng nhập mẫu

Database mẫu có sẵn 5 tài khoản, **tất cả dùng chung một mật khẩu** là: 123456
| Email | Họ tên | Vai trò |
|---|---|---|
| `admin@hospital.vn` | Nguyễn Văn A | ADMIN — Quản trị viên |
| `warehouse@hospital.vn` | Trần Thị B | WAREHOUSE_KEEPER — Thủ kho |
| `accountant@hospital.vn` | Lê Văn C | ACCOUNTANT — Kế toán |
| `head.nk@hospital.vn` | Phạm Thị D | DEPARTMENT_HEAD — Trưởng khoa |
| `staff.nh@hospital.vn` | Hoàng Văn E | DEPARTMENT_STAFF — Nhân viên khoa |

Mỗi vai trò thấy menu và chức năng khác nhau, nên thử đăng nhập nhiều tài khoản để xem đủ luồng nghiệp vụ.

---

## 6. Các lỗi thường gặp

### Backend

| Lỗi | Nguyên nhân / Cách sửa |
|---|---|
| `Access denied for user 'root'@'localhost'` | Sai username/password MySQL → sửa trong `application.properties` (mục 3.2). |
| `Unknown database 'hospital_material_management'` | Chưa tạo database hoặc đặt sai tên → làm lại bước 2. |
| `Communications link failure` / `Connection refused` | MySQL chưa bật → Start MySQL (XAMPP hoặc MySQL Service). |
| `Schema-validation: missing table [...]` | Chưa import file SQL, hoặc import vào nhầm database. |
| `Port 8080 was already in use` | Có chương trình khác đang dùng port 8080 (thường là backend chạy 2 lần). Tắt bớt, hoặc tìm & tắt process: `netstat -ano \| findstr :8080` rồi `taskkill /PID <số PID> /F`. |
| IDE báo lỗi `getXxx()` / `builder()` is undefined | Chưa cài Lombok cho Eclipse/STS (mục 3.1). |
| `invalid target release: 17` / `release version 17 not supported` | Máy đang dùng JDK cũ hơn 17 → cài JDK 17 và chọn nó trong IDE (Eclipse: *Project → Properties → Java Build Path*; IntelliJ: *File → Project Structure → SDK*). |

### Frontend

| Lỗi | Nguyên nhân / Cách sửa |
|---|---|
| `'npm' is not recognized...` | Chưa cài Node.js, hoặc cần mở lại terminal sau khi cài. |
| `Module not found` / lỗi lạ sau khi pull code | Xóa thư mục `node_modules` và file `package-lock.json` trong `react-frontend`, rồi chạy lại `npm install`. |
| `Something is already running on port 3000` | Bấm `Y` để chạy ở port khác, hoặc tắt chương trình đang dùng port 3000. |
| Đăng nhập báo lỗi mạng / `Network Error` | Backend chưa chạy hoặc đã tắt → kiểm tra lại http://localhost:8080/swagger-ui.html |
| Đăng nhập xong bị đá về trang login liên tục | Token hết hạn hoặc không hợp lệ → đăng nhập lại; nếu vẫn bị, mở DevTools (F12) → Application → Local Storage → xóa `token` và `user`. |

---

## 7. Tóm tắt nhanh (cho lần chạy sau)

1. Bật MySQL.
2. Chạy `DemoApplication.java` trong `demo` (đợi tới khi thấy `Started DemoApplication`).
3. Trong `react-frontend` chạy `npm start`.
4. Mở http://localhost:3000 và đăng nhập.
