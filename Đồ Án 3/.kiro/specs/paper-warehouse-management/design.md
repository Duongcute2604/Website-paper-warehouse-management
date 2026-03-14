# Tài Liệu Thiết Kế Kỹ Thuật - Hệ Thống Quản Lý Kho Giấy

## Tổng Quan (Overview)

### Mục Đích Của Tài Liệu
Tài liệu này mô tả chi tiết thiết kế kỹ thuật cho Hệ thống Quản Lý Kho Giấy - một ứng dụng web thương mại điện tử toàn diện. Mục đích là cung cấp hướng dẫn rõ ràng cho đội ngũ phát triển để xây dựng hệ thống đáp ứng đầy đủ các yêu cầu nghiệp vụ.

### Giới Thiệu Hệ Thống
Hệ thống quản lý kho giấy là một nền tảng web cho phép:
- **Khách hàng**: Xem sản phẩm, tìm kiếm, thêm vào giỏ hàng, đặt hàng online, và theo dõi đơn hàng
- **Quản trị viên**: Quản lý sản phẩm, danh mục, tồn kho, nhập xuất hàng, đơn hàng, nhà cung cấp, chi phí, và xem các báo cáo kinh doanh

### Công Nghệ Sử Dụng

**Backend:**
- **Node.js + Express**: Framework web server nhẹ, dễ mở rộng
- **TypeScript**: Ngôn ngữ lập trình có type safety, giảm lỗi runtime
- **MongoDB**: Database NoSQL linh hoạt, phù hợp với cấu trúc dữ liệu đa dạng
- **Mongoose**: ODM (Object Data Modeling) library cho MongoDB
- **JWT (JSON Web Token)**: Xác thực và phân quyền người dùng
- **Multer**: Xử lý upload file (hình ảnh sản phẩm)
- **PDFKit**: Tạo file PDF cho phiếu nhập/xuất kho và hóa đơn

**Frontend:**
- **React**: Thư viện UI component-based, hiệu suất cao
- **TypeScript**: Type safety cho code frontend
- **React Router**: Quản lý routing giữa các trang
- **Axios**: HTTP client để gọi API
- **TailwindCSS**: Framework CSS utility-first, responsive design
- **React Query**: Quản lý state và caching cho API calls

**Lý do chọn MongoDB:**
- Cấu trúc dữ liệu linh hoạt (sản phẩm có thể có các thuộc tính khác nhau)
- Dễ mở rộng theo chiều ngang (horizontal scaling)
- Tích hợp tốt với Node.js ecosystem
- Phù hợp với dữ liệu có cấu trúc nested (đơn hàng chứa danh sách sản phẩm)



## Kiến Trúc Hệ Thống (Architecture)

### Tổng Quan Kiến Trúc
Hệ thống sử dụng kiến trúc **Client-Server** với mô hình **3-tier**:

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION TIER                         │
│  ┌──────────────────┐         ┌──────────────────┐         │
│  │   Trang Chủ      │         │  Trang Quản Trị  │         │
│  │  (React + TS)    │         │   (React + TS)   │         │
│  └──────────────────┘         └──────────────────┘         │
└─────────────────────────────────────────────────────────────┘
                            │
                    HTTP/HTTPS (REST API)
                            │
┌─────────────────────────────────────────────────────────────┐
│                    APPLICATION TIER                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         Express Server (Node.js + TypeScript)        │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐          │  │
│  │  │  Routes  │  │Controllers│  │ Services │          │  │
│  │  └──────────┘  └──────────┘  └──────────┘          │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐          │  │
│  │  │Middleware│  │Validators │  │  Utils   │          │  │
│  │  └──────────┘  └──────────┘  └──────────┘          │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                      Mongoose ODM
                            │
┌─────────────────────────────────────────────────────────────┐
│                      DATA TIER                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              MongoDB Database                        │  │
│  │  Collections: products, categories, transactions,    │  │
│  │  orders, suppliers, expenses, users                  │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Giải Thích Các Tầng

**1. Presentation Tier (Tầng Giao Diện)**
- **Chức năng**: Hiển thị giao diện người dùng, xử lý tương tác, gọi API
- **Thành phần**:
  - Trang Chủ: Dành cho khách hàng (xem sản phẩm, đặt hàng)
  - Trang Quản Trị: Dành cho admin (quản lý toàn bộ hệ thống)
- **Công nghệ**: React components, React Router, Axios

**2. Application Tier (Tầng Ứng Dụng)**
- **Chức năng**: Xử lý business logic, xác thực, phân quyền, xử lý dữ liệu
- **Thành phần**:
  - **Routes**: Định nghĩa các endpoint API (GET, POST, PUT, DELETE)
  - **Controllers**: Nhận request, gọi services, trả về response
  - **Services**: Chứa business logic chính (tính toán, xử lý dữ liệu)
  - **Middleware**: Xác thực JWT, logging, error handling
  - **Validators**: Kiểm tra dữ liệu đầu vào
  - **Utils**: Các hàm tiện ích (format date, generate PDF, etc.)

**3. Data Tier (Tầng Dữ Liệu)**
- **Chức năng**: Lưu trữ và quản lý dữ liệu
- **Công nghệ**: MongoDB với Mongoose ODM
- **Collections**: Các bảng dữ liệu (products, orders, users, etc.)



### Luồng Dữ Liệu (Data Flow)

**Ví dụ: Khách hàng đặt hàng**

```
1. Khách hàng nhấn "Đặt hàng" trên Trang Chủ
   ↓
2. Frontend gửi POST request đến /api/orders
   ↓
3. Express Server nhận request
   ↓
4. Middleware kiểm tra dữ liệu hợp lệ
   ↓
5. Controller gọi OrderService.createOrder()
   ↓
6. Service xử lý logic:
   - Kiểm tra tồn kho
   - Tính phí ship
   - Tạo đơn hàng mới
   - Cập nhật giỏ hàng
   ↓
7. Mongoose lưu dữ liệu vào MongoDB
   ↓
8. Service trả kết quả về Controller
   ↓
9. Controller trả response (JSON) về Frontend
   ↓
10. Frontend hiển thị thông báo thành công
```

### Bảo Mật (Security)

**1. Xác Thực (Authentication)**
- Sử dụng JWT (JSON Web Token) cho quản trị viên
- Token được lưu trong localStorage/sessionStorage
- Token có thời gian hết hạn (30 phút không hoạt động)

**2. Phân Quyền (Authorization)**
- Middleware kiểm tra token trước khi truy cập các route admin
- Chỉ admin mới có quyền truy cập Trang Quản Trị

**3. Bảo Vệ Dữ Liệu**
- Mật khẩu được hash bằng bcrypt
- Validate dữ liệu đầu vào để tránh injection attacks
- CORS configuration để kiểm soát cross-origin requests
- Rate limiting để tránh DDoS attacks

**4. HTTPS**
- Sử dụng HTTPS trong production để mã hóa dữ liệu truyền tải



## Các Thành Phần và Giao Diện (Components and Interfaces)

### Backend Components

#### 1. API Routes (Định Nghĩa Các Endpoint)

**Mục đích**: Định nghĩa các URL endpoint mà frontend có thể gọi

**Cấu trúc thư mục**:
```
backend/src/routes/
├── product.routes.ts      # Routes cho sản phẩm
├── category.routes.ts     # Routes cho danh mục
├── transaction.routes.ts  # Routes cho nhập/xuất kho
├── order.routes.ts        # Routes cho đơn hàng
├── supplier.routes.ts     # Routes cho nhà cung cấp
├── expense.routes.ts      # Routes cho chi phí
├── report.routes.ts       # Routes cho báo cáo
└── auth.routes.ts         # Routes cho xác thực
```

**Ví dụ Product Routes**:
```typescript
// GET /api/products - Lấy danh sách sản phẩm
// GET /api/products/:id - Lấy chi tiết 1 sản phẩm
// POST /api/products - Tạo sản phẩm mới (admin only)
// PUT /api/products/:id - Cập nhật sản phẩm (admin only)
// DELETE /api/products/:id - Xóa sản phẩm (admin only)
// GET /api/products/search?q=keyword - Tìm kiếm sản phẩm
```

#### 2. Controllers (Xử Lý Request/Response)

**Mục đích**: Nhận request từ client, gọi service xử lý, trả về response

**Cấu trúc**:
```
backend/src/controllers/
├── product.controller.ts
├── category.controller.ts
├── transaction.controller.ts
├── order.controller.ts
├── supplier.controller.ts
├── expense.controller.ts
├── report.controller.ts
└── auth.controller.ts
```

**Ví dụ Product Controller**:
```typescript
class ProductController {
  // Lấy tất cả sản phẩm
  async getAllProducts(req, res) {
    // 1. Lấy query params (filter, sort, pagination)
    // 2. Gọi ProductService.getAll()
    // 3. Trả về JSON response
  }
  
  // Tạo sản phẩm mới
  async createProduct(req, res) {
    // 1. Lấy dữ liệu từ req.body
    // 2. Gọi ProductService.create()
    // 3. Trả về sản phẩm vừa tạo
  }
}
```



#### 3. Services (Business Logic)

**Mục đích**: Chứa logic nghiệp vụ chính, xử lý dữ liệu, tương tác với database

**Cấu trúc**:
```
backend/src/services/
├── product.service.ts
├── category.service.ts
├── transaction.service.ts
├── order.service.ts
├── supplier.service.ts
├── expense.service.ts
├── report.service.ts
├── cart.service.ts
└── shipping.service.ts
```

**Ví dụ Transaction Service**:
```typescript
class TransactionService {
  // Tạo giao dịch nhập kho
  async createInbound(data) {
    // 1. Validate dữ liệu
    // 2. Tạo transaction record
    // 3. Cập nhật tồn kho (tăng số lượng)
    // 4. Ghi log
    // 5. Trả về transaction
  }
  
  // Tạo giao dịch xuất kho
  async createOutbound(data) {
    // 1. Validate dữ liệu
    // 2. Kiểm tra tồn kho đủ không
    // 3. Tạo transaction record
    // 4. Cập nhật tồn kho (giảm số lượng)
    // 5. Ghi log
    // 6. Trả về transaction
  }
}
```

**Ví dụ Shipping Service**:
```typescript
class ShippingService {
  // Tính phí ship dựa trên địa chỉ và trọng lượng
  calculateShippingFee(address: string, weight: number): number {
    // Logic tính phí ship
    // Có thể tích hợp API bên thứ 3 (GHN, GHTK, etc.)
  }
}
```

#### 4. Middleware

**Mục đích**: Xử lý các tác vụ trước khi request đến controller

**Các middleware chính**:

```typescript
// 1. Auth Middleware - Kiểm tra JWT token
async function authMiddleware(req, res, next) {
  // Lấy token từ header
  // Verify token
  // Nếu hợp lệ: gắn user info vào req và next()
  // Nếu không hợp lệ: trả về 401 Unauthorized
}

// 2. Validation Middleware - Kiểm tra dữ liệu đầu vào
function validateProduct(req, res, next) {
  // Kiểm tra req.body có đủ field không
  // Kiểm tra type của từng field
  // Nếu hợp lệ: next()
  // Nếu không: trả về 400 Bad Request
}

// 3. Error Handler Middleware - Xử lý lỗi tập trung
function errorHandler(err, req, res, next) {
  // Log error
  // Trả về response lỗi với format chuẩn
}

// 4. Upload Middleware - Xử lý upload file
const upload = multer({
  storage: diskStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});
```



### Frontend Components

#### 1. Trang Chủ (Customer-Facing)

**Cấu trúc components**:
```
frontend/src/pages/customer/
├── HomePage.tsx              # Trang chủ - hiển thị sản phẩm
├── ProductDetailPage.tsx     # Chi tiết sản phẩm
├── CartPage.tsx              # Giỏ hàng
├── CheckoutPage.tsx          # Thanh toán
└── OrderTrackingPage.tsx     # Tra cứu đơn hàng

frontend/src/components/customer/
├── ProductCard.tsx           # Card hiển thị 1 sản phẩm
├── ProductList.tsx           # Danh sách sản phẩm
├── SearchBar.tsx             # Ô tìm kiếm
├── CategoryFilter.tsx        # Bộ lọc danh mục
├── CartItem.tsx              # 1 item trong giỏ hàng
├── OrderSummary.tsx          # Tóm tắt đơn hàng
└── ShippingForm.tsx          # Form nhập địa chỉ giao hàng
```

**Chức năng chính**:
- Hiển thị danh sách sản phẩm với pagination
- Tìm kiếm và lọc sản phẩm
- Thêm/xóa/cập nhật giỏ hàng
- Đặt hàng và thanh toán
- Tra cứu trạng thái đơn hàng

#### 2. Trang Quản Trị (Admin Panel)

**Cấu trúc components**:
```
frontend/src/pages/admin/
├── LoginPage.tsx             # Đăng nhập admin
├── DashboardPage.tsx         # Trang tổng quan
├── ProductManagementPage.tsx # Quản lý sản phẩm
├── CategoryManagementPage.tsx # Quản lý danh mục
├── InventoryPage.tsx         # Quản lý tồn kho
├── TransactionPage.tsx       # Nhập/xuất kho
├── OrderManagementPage.tsx   # Quản lý đơn hàng
├── SupplierManagementPage.tsx # Quản lý nhà cung cấp
├── ExpenseManagementPage.tsx # Quản lý chi phí
└── ReportsPage.tsx           # Báo cáo

frontend/src/components/admin/
├── Sidebar.tsx               # Menu bên trái
├── Header.tsx                # Header với logout
├── DataTable.tsx             # Bảng dữ liệu có sort/filter
├── ProductForm.tsx           # Form thêm/sửa sản phẩm
├── TransactionForm.tsx       # Form nhập/xuất kho
├── OrderDetail.tsx           # Chi tiết đơn hàng
├── RevenueChart.tsx          # Biểu đồ doanh thu
├── ExpenseChart.tsx          # Biểu đồ chi phí
└── InventoryAlert.tsx        # Cảnh báo tồn kho thấp
```

**Chức năng chính**:
- CRUD operations cho tất cả entities
- Xem và cập nhật trạng thái đơn hàng
- Ghi nhận nhập/xuất kho
- Xem các báo cáo và biểu đồ
- In phiếu và xuất file PDF/Excel



### API Interfaces (Giao Diện API)

**Định dạng Response chuẩn**:
```typescript
// Success Response
{
  success: true,
  data: { ... },
  message: "Thao tác thành công"
}

// Error Response
{
  success: false,
  error: {
    code: "VALIDATION_ERROR",
    message: "Dữ liệu không hợp lệ",
    details: [...]
  }
}
```

**Các API Endpoints chính**:

**1. Products API**
```
GET    /api/products              # Lấy danh sách sản phẩm
GET    /api/products/:id          # Lấy chi tiết sản phẩm
POST   /api/products              # Tạo sản phẩm (admin)
PUT    /api/products/:id          # Cập nhật sản phẩm (admin)
DELETE /api/products/:id          # Xóa sản phẩm (admin)
GET    /api/products/search       # Tìm kiếm sản phẩm
POST   /api/products/:id/image    # Upload hình ảnh (admin)
```

**2. Categories API**
```
GET    /api/categories            # Lấy danh sách danh mục
POST   /api/categories            # Tạo danh mục (admin)
PUT    /api/categories/:id        # Cập nhật danh mục (admin)
DELETE /api/categories/:id        # Xóa danh mục (admin)
```

**3. Transactions API**
```
GET    /api/transactions          # Lấy lịch sử giao dịch (admin)
POST   /api/transactions/inbound  # Tạo phiếu nhập (admin)
POST   /api/transactions/outbound # Tạo phiếu xuất (admin)
GET    /api/transactions/:id/pdf  # Xuất PDF phiếu (admin)
```

**4. Orders API**
```
GET    /api/orders                # Lấy danh sách đơn hàng (admin)
GET    /api/orders/:id            # Lấy chi tiết đơn hàng
POST   /api/orders                # Tạo đơn hàng
PUT    /api/orders/:id/status     # Cập nhật trạng thái (admin)
GET    /api/orders/track          # Tra cứu đơn hàng (query: code, phone)
POST   /api/orders/:id/invoice    # Xuất hóa đơn VAT (admin)
```

**5. Cart API**
```
GET    /api/cart                  # Lấy giỏ hàng (session-based)
POST   /api/cart/items            # Thêm sản phẩm vào giỏ
PUT    /api/cart/items/:id        # Cập nhật số lượng
DELETE /api/cart/items/:id        # Xóa sản phẩm khỏi giỏ
DELETE /api/cart                  # Xóa toàn bộ giỏ hàng
```

**6. Suppliers API**
```
GET    /api/suppliers             # Lấy danh sách nhà cung cấp (admin)
POST   /api/suppliers             # Tạo nhà cung cấp (admin)
PUT    /api/suppliers/:id         # Cập nhật nhà cung cấp (admin)
GET    /api/suppliers/:id/transactions # Lịch sử giao dịch (admin)
```

**7. Expenses API**
```
GET    /api/expenses              # Lấy danh sách chi phí (admin)
POST   /api/expenses              # Tạo chi phí (admin)
PUT    /api/expenses/:id          # Cập nhật chi phí (admin)
DELETE /api/expenses/:id          # Xóa chi phí (admin)
```

**8. Reports API**
```
GET    /api/reports/inventory     # Báo cáo tồn kho (admin)
GET    /api/reports/revenue       # Báo cáo doanh thu (admin)
GET    /api/reports/expenses      # Báo cáo chi phí (admin)
GET    /api/reports/profit        # Báo cáo lợi nhuận (admin)
POST   /api/reports/export        # Xuất báo cáo PDF/Excel (admin)
```

**9. Auth API**
```
POST   /api/auth/login            # Đăng nhập admin
POST   /api/auth/logout           # Đăng xuất admin
GET    /api/auth/me               # Lấy thông tin user hiện tại
```



## Mô Hình Dữ Liệu (Data Models)

### Giải Thích Về MongoDB Schema

MongoDB là NoSQL database, dữ liệu được lưu dưới dạng documents (JSON-like). Chúng ta sử dụng Mongoose để định nghĩa schema (cấu trúc) cho mỗi collection.

### 1. User Schema (Người Dùng - Admin)

**Mục đích**: Lưu thông tin tài khoản quản trị viên

```typescript
interface IUser {
  _id: ObjectId;                    // ID tự động tạo bởi MongoDB
  username: string;                 // Tên đăng nhập (unique)
  password: string;                 // Mật khẩu đã hash (bcrypt)
  fullName: string;                 // Họ tên đầy đủ
  email: string;                    // Email
  role: 'admin' | 'staff';          // Vai trò (admin hoặc nhân viên)
  isActive: boolean;                // Trạng thái hoạt động
  lastLogin: Date;                  // Lần đăng nhập cuối
  createdAt: Date;                  // Thời gian tạo
  updatedAt: Date;                  // Thời gian cập nhật
}
```

**Indexes**: 
- `username` (unique)
- `email` (unique)

### 2. Category Schema (Danh Mục Sản Phẩm)

**Mục đích**: Phân loại sản phẩm (giấy, vải vụn, lõi ống, etc.)

```typescript
interface ICategory {
  _id: ObjectId;
  name: string;                     // Tên danh mục (VD: "Giấy in", "Vải vụn")
  description: string;              // Mô tả danh mục
  slug: string;                     // URL-friendly name (VD: "giay-in")
  isActive: boolean;                // Trạng thái hoạt động
  createdAt: Date;
  updatedAt: Date;
}
```

**Indexes**: 
- `slug` (unique)
- `name`



### 3. Product Schema (Sản Phẩm)

**Mục đích**: Lưu thông tin chi tiết về sản phẩm

```typescript
interface IProduct {
  _id: ObjectId;
  name: string;                     // Tên sản phẩm
  description: string;              // Mô tả chi tiết
  category: ObjectId;               // Reference đến Category
  unit: string;                     // Đơn vị tính (tấn, kg, ream, tờ, cuộn)
  price: number;                    // Giá bán (VNĐ)
  costPrice: number;                // Giá vốn (VNĐ)
  weight: number;                   // Trọng lượng (kg) - dùng để tính ship
  images: string[];                 // Mảng URL hình ảnh
  currentStock: number;             // Tồn kho hiện tại
  minStockLevel: number;            // Mức tồn kho tối thiểu (cảnh báo)
  isActive: boolean;                // Trạng thái (còn bán không)
  specifications: {                 // Thông số kỹ thuật (linh hoạt)
    [key: string]: any;             // VD: { "kích thước": "A4", "độ dày": "80gsm" }
  };
  createdAt: Date;
  updatedAt: Date;
}
```

**Indexes**: 
- `category`
- `name` (text index cho search)
- `currentStock`

**Giải thích**:
- `category` là ObjectId tham chiếu đến collection Categories
- `currentStock` được cập nhật tự động khi có giao dịch nhập/xuất
- `specifications` là object linh hoạt, mỗi sản phẩm có thể có thuộc tính khác nhau

### 4. Supplier Schema (Nhà Cung Cấp)

**Mục đích**: Lưu thông tin nhà cung cấp hàng hóa

```typescript
interface ISupplier {
  _id: ObjectId;
  name: string;                     // Tên nhà cung cấp
  contactPerson: string;            // Người liên hệ
  phone: string;                    // Số điện thoại
  email: string;                    // Email
  address: string;                  // Địa chỉ
  taxCode: string;                  // Mã số thuế
  bankAccount: {                    // Thông tin tài khoản ngân hàng
    bankName: string;
    accountNumber: string;
    accountHolder: string;
  };
  notes: string;                    // Ghi chú
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

**Indexes**: 
- `name`
- `phone`



### 5. Transaction Schema (Giao Dịch Nhập/Xuất Kho)

**Mục đích**: Ghi nhận mọi giao dịch nhập xuất hàng

```typescript
interface ITransaction {
  _id: ObjectId;
  type: 'inbound' | 'outbound';     // Loại: nhập hoặc xuất
  transactionCode: string;          // Mã phiếu (tự động: IN-20240101-001)
  date: Date;                       // Ngày giao dịch
  items: [                          // Danh sách sản phẩm
    {
      product: ObjectId;            // Reference đến Product
      productName: string;          // Tên sản phẩm (lưu lại để tránh mất dữ liệu)
      quantity: number;             // Số lượng
      unit: string;                 // Đơn vị
      unitPrice: number;            // Đơn giá
      totalPrice: number;           // Thành tiền (quantity * unitPrice)
    }
  ];
  totalAmount: number;              // Tổng giá trị giao dịch
  supplier?: ObjectId;              // Nhà cung cấp (chỉ cho inbound)
  customer?: string;                // Tên khách hàng (chỉ cho outbound)
  relatedOrder?: ObjectId;          // Đơn hàng liên quan (nếu xuất do đơn hàng)
  notes: string;                    // Ghi chú
  createdBy: ObjectId;              // Người tạo phiếu (User)
  createdAt: Date;
  updatedAt: Date;
}
```

**Indexes**: 
- `type`
- `date`
- `transactionCode` (unique)
- `supplier`
- `relatedOrder`

**Giải thích**:
- Mỗi transaction có thể chứa nhiều sản phẩm (items array)
- `productName` được lưu lại để tránh mất thông tin khi sản phẩm bị xóa
- `relatedOrder` liên kết với đơn hàng (nếu xuất kho do đơn hàng)

### 6. Order Schema (Đơn Hàng)

**Mục đích**: Lưu thông tin đơn hàng từ khách hàng

```typescript
interface IOrder {
  _id: ObjectId;
  orderCode: string;                // Mã đơn hàng (tự động: ORD-20240101-001)
  customer: {                       // Thông tin khách hàng
    fullName: string;
    phone: string;
    email?: string;
    address: string;
  };
  items: [                          // Danh sách sản phẩm
    {
      product: ObjectId;
      productName: string;
      quantity: number;
      unit: string;
      unitPrice: number;
      totalPrice: number;
    }
  ];
  subtotal: number;                 // Tổng tiền hàng
  shippingFee: number;              // Phí ship
  totalAmount: number;              // Tổng thanh toán (subtotal + shippingFee)
  status: 'pending' | 'approved' | 'shipping' | 'completed' | 'cancelled';
  paymentMethod: 'bank_transfer' | 'cod';  // Phương thức thanh toán
  paymentStatus: 'unpaid' | 'paid'; // Trạng thái thanh toán
  notes: string;                    // Ghi chú của khách hàng
  adminNotes: string;               // Ghi chú nội bộ
  statusHistory: [                  // Lịch sử thay đổi trạng thái
    {
      status: string;
      changedBy?: ObjectId;         // User thay đổi
      changedAt: Date;
      note: string;
    }
  ];
  approvedBy?: ObjectId;            // Admin duyệt đơn
  approvedAt?: Date;                // Thời gian duyệt
  createdAt: Date;
  updatedAt: Date;
}
```

**Indexes**: 
- `orderCode` (unique)
- `customer.phone`
- `status`
- `createdAt`

**Giải thích**:
- `statusHistory` lưu lại toàn bộ lịch sử thay đổi trạng thái
- Khi đơn hàng được duyệt, hệ thống có thể tự động tạo phiếu xuất kho



### 7. Expense Schema (Chi Phí)

**Mục đích**: Ghi nhận các khoản chi phí phát sinh

```typescript
interface IExpense {
  _id: ObjectId;
  type: 'labor' | 'transport' | 'other';  // Loại: nhân công, xe, khác
  amount: number;                   // Số tiền (VNĐ)
  date: Date;                       // Ngày phát sinh
  description: string;              // Mô tả chi tiết
  relatedTransaction?: ObjectId;    // Giao dịch liên quan (nếu có)
  relatedOrder?: ObjectId;          // Đơn hàng liên quan (nếu có)
  createdBy: ObjectId;              // Người tạo
  createdAt: Date;
  updatedAt: Date;
}
```

**Indexes**: 
- `type`
- `date`

### 8. Cart Schema (Giỏ Hàng)

**Mục đích**: Lưu giỏ hàng tạm thời (session-based hoặc localStorage)

**Lưu ý**: Giỏ hàng có thể được lưu ở frontend (localStorage) hoặc backend (session). Nếu lưu backend:

```typescript
interface ICart {
  _id: ObjectId;
  sessionId: string;                // Session ID (cookie-based)
  items: [
    {
      product: ObjectId;
      quantity: number;
    }
  ];
  expiresAt: Date;                  // Tự động xóa sau 7 ngày không hoạt động
  createdAt: Date;
  updatedAt: Date;
}
```

**Indexes**: 
- `sessionId` (unique)
- `expiresAt` (TTL index - tự động xóa)

**Giải thích**:
- TTL (Time To Live) index tự động xóa giỏ hàng cũ
- Có thể dùng localStorage thay vì database để giảm tải

### Relationships (Mối Quan Hệ Giữa Các Collections)

```
User (1) -----> (N) Transaction (người tạo phiếu)
User (1) -----> (N) Order (người duyệt đơn)
User (1) -----> (N) Expense (người tạo chi phí)

Category (1) -----> (N) Product

Supplier (1) -----> (N) Transaction (inbound)

Product (1) -----> (N) Transaction.items
Product (1) -----> (N) Order.items
Product (1) -----> (N) Cart.items

Order (1) -----> (0..1) Transaction (phiếu xuất kho)
Transaction (1) -----> (0..N) Expense (chi phí liên quan)
```

**Giải thích**:
- (1) -----> (N): Quan hệ một-nhiều
- (1) -----> (0..1): Quan hệ một-không hoặc một
- Reference được thực hiện qua ObjectId



## Thuộc Tính Đúng Đắn (Correctness Properties)

### Giải Thích Về Correctness Properties

**Thuộc tính đúng đắn (Correctness Property)** là một đặc tính hoặc hành vi mà hệ thống phải đảm bảo đúng trong mọi trường hợp thực thi hợp lệ. Đây là cầu nối giữa đặc tả có thể đọc được bởi con người và các đảm bảo tính đúng đắn có thể kiểm chứng bằng máy.

Mỗi property được viết dưới dạng **phát biểu phổ quát** (universal quantification) bắt đầu bằng "Với mọi" hoặc "For any", và có thể được kiểm tra tự động thông qua property-based testing.

### Các Mẫu Property Phổ Biến

1. **Round Trip (Vòng Khứ Hồi)**: Thực hiện một thao tác rồi thực hiện thao tác ngược lại sẽ trở về trạng thái ban đầu
   - Ví dụ: `serialize(deserialize(x)) == x`

2. **Invariants (Bất Biến)**: Các thuộc tính luôn được duy trì sau mỗi thao tác
   - Ví dụ: Tồn kho không bao giờ âm

3. **Idempotence (Lũy Đẳng)**: Thực hiện thao tác nhiều lần = thực hiện 1 lần
   - Ví dụ: Xóa sản phẩm 2 lần = xóa 1 lần

4. **Metamorphic**: Mối quan hệ giữa các thành phần
   - Ví dụ: `length(filter(list)) <= length(list)`

### Phân Tích Acceptance Criteria

Dưới đây là phân tích từng acceptance criteria để xác định xem có thể test được không:



**Yêu Cầu 1: Hiển Thị Danh Sách Sản Phẩm**
- 1.1: Hiển thị danh sách sản phẩm → Testable: yes - example (kiểm tra API trả về danh sách)
- 1.2: Hiển thị thông tin cơ bản → Testable: yes - property (mọi sản phẩm đều có đủ thông tin)
- 1.3: Nhấp vào sản phẩm hiển thị chi tiết → Testable: no (UI interaction)
- 1.4: Lọc theo danh mục → Testable: yes - property (kết quả lọc chỉ chứa sản phẩm thuộc danh mục đó)

**Yêu Cầu 2: Tìm Kiếm Sản Phẩm**
- 2.1: Cung cấp ô tìm kiếm → Testable: no (UI element)
- 2.2: Trả về sản phẩm chứa từ khóa → Testable: yes - property (mọi kết quả đều chứa từ khóa)
- 2.3: Hiển thị trong 500ms → Testable: no (performance test, không phù hợp unit test)

**Yêu Cầu 3: Xác Thực Quản Trị Viên**
- 3.1: Yêu cầu đăng nhập → Testable: yes - example (truy cập không token bị từ chối)
- 3.2: Thông tin hợp lệ cho phép truy cập → Testable: yes - property (token hợp lệ luôn được chấp nhận)
- 3.3: Thông tin không hợp lệ từ chối → Testable: yes - property (token không hợp lệ luôn bị từ chối)
- 3.4: Tự động đăng xuất sau 30 phút → Testable: no (time-based, khó test trong unit test)

**Yêu Cầu 4: Quản Lý Sản Phẩm**
- 4.1: Tạo sản phẩm mới → Testable: yes - property (sản phẩm được tạo có đầy đủ thông tin)
- 4.2: Chỉnh sửa sản phẩm → Testable: yes - property (cập nhật thành công, dữ liệu thay đổi)
- 4.3: Xóa sản phẩm → Testable: yes - property (sau khi xóa, không tìm thấy sản phẩm)
- 4.4: Xác thực trường bắt buộc → Testable: yes - property (thiếu trường bắt buộc bị từ chối)
- 4.5: Hiển thị lỗi cụ thể → Testable: yes - example (kiểm tra message lỗi)

**Yêu Cầu 5: Quản Lý Danh Mục**
- 5.1: Tạo danh mục → Testable: yes - property
- 5.2: Chỉnh sửa danh mục → Testable: yes - property
- 5.3: Xóa danh mục không chứa sản phẩm → Testable: yes - property
- 5.4: Ngăn xóa danh mục có sản phẩm → Testable: yes - property

**Yêu Cầu 6: Giao Dịch Nhập Kho**
- 6.1: Tạo giao dịch nhập → Testable: yes - property
- 6.2: Tăng tồn kho → Testable: yes - property (invariant: tồn kho sau = tồn kho trước + số lượng nhập)
- 6.3: Ghi lại thời gian → Testable: yes - property
- 6.4: Số lượng nhập > 0 → Testable: yes - property (số âm hoặc 0 bị từ chối)

**Yêu Cầu 7: Giao Dịch Xuất Kho**
- 7.1: Tạo giao dịch xuất → Testable: yes - property
- 7.2: Giảm tồn kho → Testable: yes - property (invariant: tồn kho sau = tồn kho trước - số lượng xuất)
- 7.3: Cảnh báo khi xuất > tồn kho → Testable: yes - property
- 7.4: Ghi lại thời gian → Testable: yes - property
- 7.5: Số lượng xuất > 0 → Testable: yes - property

**Yêu Cầu 8-12**: Chủ yếu là UI và display logic → Testable: limited (chỉ test API response)

**Yêu Cầu 13: Quản Lý Giỏ Hàng**
- 13.1: Thêm vào giỏ hàng → Testable: yes - property (sản phẩm xuất hiện trong giỏ)
- 13.2-13.6: Các thao tác giỏ hàng → Testable: yes - property

**Yêu Cầu 14: Đặt Hàng Online**
- 14.1-14.6: Quy trình đặt hàng → Testable: yes - property (đơn hàng được tạo đúng)

**Yêu Cầu 15: Tính Phí Ship**
- 15.1-15.4: Tính phí ship → Testable: yes - property (phí ship luôn >= 0)

**Yêu Cầu 16-26**: Các yêu cầu về thanh toán, báo cáo, in ấn → Testable: mixed



### Các Correctness Properties Chính

#### Property 1: Tìm Kiếm Trả Về Kết Quả Phù Hợp

*Với mọi* từ khóa tìm kiếm và danh sách sản phẩm, tất cả kết quả trả về phải chứa từ khóa đó trong tên hoặc mô tả.

**Validates: Requirements 2.2**

#### Property 2: Lọc Danh Mục Chính Xác

*Với mọi* danh mục được chọn, tất cả sản phẩm trong kết quả lọc phải thuộc danh mục đó.

**Validates: Requirements 1.4**

#### Property 3: Xác Thực Token Hợp Lệ

*Với mọi* token JWT hợp lệ và chưa hết hạn, hệ thống phải cho phép truy cập vào các route admin.

**Validates: Requirements 3.2**

#### Property 4: Từ Chối Token Không Hợp Lệ

*Với mọi* token JWT không hợp lệ hoặc đã hết hạn, hệ thống phải từ chối truy cập và trả về lỗi 401.

**Validates: Requirements 3.3**

#### Property 5: Tạo Sản Phẩm Với Đầy Đủ Thông Tin

*Với mọi* dữ liệu sản phẩm hợp lệ, khi tạo sản phẩm mới, sản phẩm được lưu phải chứa đầy đủ các trường: tên, mô tả, danh mục, đơn vị, giá.

**Validates: Requirements 4.1**

#### Property 6: Từ Chối Sản Phẩm Thiếu Thông Tin

*Với mọi* dữ liệu sản phẩm thiếu trường bắt buộc, hệ thống phải từ chối tạo sản phẩm và trả về lỗi validation.

**Validates: Requirements 4.4**

#### Property 7: Cập Nhật Sản Phẩm Thay Đổi Dữ Liệu

*Với mọi* sản phẩm hiện có và dữ liệu cập nhật hợp lệ, sau khi cập nhật, dữ liệu sản phẩm phải khớp với dữ liệu mới.

**Validates: Requirements 4.2**

#### Property 8: Xóa Sản Phẩm Loại Bỏ Khỏi Hệ Thống

*Với mọi* sản phẩm hiện có, sau khi xóa, truy vấn sản phẩm đó phải trả về lỗi "không tìm thấy".

**Validates: Requirements 4.3**

#### Property 9: Ngăn Xóa Danh Mục Có Sản Phẩm

*Với mọi* danh mục còn chứa ít nhất 1 sản phẩm, hệ thống phải từ chối xóa danh mục và trả về lỗi.

**Validates: Requirements 5.4**

#### Property 10: Nhập Kho Tăng Tồn Kho (Invariant)

*Với mọi* giao dịch nhập kho hợp lệ, tồn kho sau khi nhập phải bằng tồn kho trước khi nhập cộng với số lượng nhập.

```
stock_after = stock_before + quantity_in
```

**Validates: Requirements 6.2**

#### Property 11: Xuất Kho Giảm Tồn Kho (Invariant)

*Với mọi* giao dịch xuất kho hợp lệ, tồn kho sau khi xuất phải bằng tồn kho trước khi xuất trừ đi số lượng xuất.

```
stock_after = stock_before - quantity_out
```

**Validates: Requirements 7.2**

#### Property 12: Số Lượng Nhập Phải Dương

*Với mọi* giao dịch nhập kho, số lượng nhập phải là số dương lớn hơn 0, nếu không hệ thống phải từ chối.

**Validates: Requirements 6.4**

#### Property 13: Số Lượng Xuất Phải Dương

*Với mọi* giao dịch xuất kho, số lượng xuất phải là số dương lớn hơn 0, nếu không hệ thống phải từ chối.

**Validates: Requirements 7.5**

#### Property 14: Cảnh Báo Xuất Vượt Tồn Kho

*Với mọi* giao dịch xuất kho có số lượng lớn hơn tồn kho hiện tại, hệ thống phải hiển thị cảnh báo và yêu cầu xác nhận.

**Validates: Requirements 7.3**

#### Property 15: Thêm Vào Giỏ Hàng Tăng Số Lượng

*Với mọi* sản phẩm và giỏ hàng, sau khi thêm sản phẩm vào giỏ, số lượng item trong giỏ phải tăng lên.

**Validates: Requirements 13.1**

#### Property 16: Xóa Khỏi Giỏ Hàng Giảm Số Lượng

*Với mọi* sản phẩm trong giỏ hàng, sau khi xóa, sản phẩm đó không còn xuất hiện trong giỏ.

**Validates: Requirements 13.5**

#### Property 17: Tổng Giá Giỏ Hàng Chính Xác

*Với mọi* giỏ hàng, tổng giá trị phải bằng tổng của (giá × số lượng) của tất cả sản phẩm trong giỏ.

```
total = sum(item.price * item.quantity for all items)
```

**Validates: Requirements 13.6**

#### Property 18: Đơn Hàng Mới Có Trạng Thái "Chờ Duyệt"

*Với mọi* đơn hàng mới được tạo, trạng thái ban đầu phải là "pending" (chờ duyệt).

**Validates: Requirements 14.4**

#### Property 19: Đặt Hàng Thành Công Xóa Giỏ Hàng

*Với mọi* đơn hàng được tạo thành công, giỏ hàng phải được xóa sạch.

**Validates: Requirements 14.5**

#### Property 20: Phí Ship Không Âm

*Với mọi* địa chỉ giao hàng và trọng lượng đơn hàng, phí ship tính được phải >= 0.

**Validates: Requirements 15.1, 15.2**

#### Property 21: Tổng Thanh Toán Bao Gồm Phí Ship

*Với mọi* đơn hàng, tổng thanh toán phải bằng tổng giá trị sản phẩm cộng phí ship.

```
total_payment = subtotal + shipping_fee
```

**Validates: Requirements 15.3**

#### Property 22: Tra Cứu Đơn Hàng Với Thông Tin Đúng

*Với mọi* mã đơn hàng và số điện thoại khớp, hệ thống phải trả về thông tin đơn hàng.

**Validates: Requirements 17.2**

#### Property 23: Tra Cứu Đơn Hàng Với Thông Tin Sai

*Với mọi* mã đơn hàng hoặc số điện thoại không khớp, hệ thống phải trả về lỗi "không tìm thấy".

**Validates: Requirements 17.4**

#### Property 24: Duyệt Đơn Hàng Thay Đổi Trạng Thái

*Với mọi* đơn hàng ở trạng thái "pending", sau khi admin duyệt, trạng thái phải chuyển sang "approved".

**Validates: Requirements 18.5**

#### Property 25: Chi Phí Phải Dương

*Với mọi* chi phí được tạo, số tiền phải là số dương lớn hơn 0, nếu không hệ thống phải từ chối.

**Validates: Requirements 22.6**

#### Property 26: Upload Hình Ảnh Đúng Định Dạng

*Với mọi* file hình ảnh có định dạng JPG, PNG, hoặc WebP và kích thước <= 5MB, hệ thống phải chấp nhận upload.

**Validates: Requirements 11.2, 11.3**

#### Property 27: Từ Chối File Không Hợp Lệ

*Với mọi* file không phải JPG/PNG/WebP hoặc kích thước > 5MB, hệ thống phải từ chối và trả về lỗi.

**Validates: Requirements 11.4**



## Xử Lý Lỗi (Error Handling)

### Chiến Lược Xử Lý Lỗi Tổng Thể

Hệ thống sử dụng **centralized error handling** (xử lý lỗi tập trung) thông qua Express middleware để đảm bảo tính nhất quán.

### Các Loại Lỗi

#### 1. Validation Errors (Lỗi Xác Thực Dữ Liệu)

**Khi nào xảy ra**: Dữ liệu đầu vào không hợp lệ (thiếu trường, sai định dạng, vi phạm ràng buộc)

**HTTP Status Code**: 400 Bad Request

**Response Format**:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Dữ liệu không hợp lệ",
    "details": [
      {
        "field": "name",
        "message": "Tên sản phẩm là bắt buộc"
      },
      {
        "field": "price",
        "message": "Giá phải là số dương"
      }
    ]
  }
}
```

**Xử lý**:
- Validate dữ liệu ở middleware trước khi vào controller
- Sử dụng thư viện như `joi` hoặc `express-validator`
- Trả về danh sách chi tiết các lỗi

#### 2. Authentication Errors (Lỗi Xác Thực)

**Khi nào xảy ra**: Token không hợp lệ, hết hạn, hoặc không có token

**HTTP Status Code**: 401 Unauthorized

**Response Format**:
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Vui lòng đăng nhập để tiếp tục"
  }
}
```

**Xử lý**:
- Middleware kiểm tra JWT token
- Verify token signature và expiration
- Trả về 401 nếu không hợp lệ

#### 3. Authorization Errors (Lỗi Phân Quyền)

**Khi nào xảy ra**: User không có quyền thực hiện hành động

**HTTP Status Code**: 403 Forbidden

**Response Format**:
```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "Bạn không có quyền thực hiện hành động này"
  }
}
```

#### 4. Not Found Errors (Lỗi Không Tìm Thấy)

**Khi nào xảy ra**: Resource không tồn tại (sản phẩm, đơn hàng, etc.)

**HTTP Status Code**: 404 Not Found

**Response Format**:
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Không tìm thấy sản phẩm với ID: 12345"
  }
}
```

#### 5. Business Logic Errors (Lỗi Logic Nghiệp Vụ)

**Khi nào xảy ra**: Vi phạm quy tắc nghiệp vụ (xuất kho vượt tồn kho, xóa danh mục có sản phẩm)

**HTTP Status Code**: 422 Unprocessable Entity

**Response Format**:
```json
{
  "success": false,
  "error": {
    "code": "BUSINESS_LOGIC_ERROR",
    "message": "Không thể xuất kho: Số lượng xuất (100) vượt quá tồn kho hiện tại (50)",
    "details": {
      "requested": 100,
      "available": 50
    }
  }
}
```

#### 6. Database Errors (Lỗi Database)

**Khi nào xảy ra**: Lỗi kết nối database, duplicate key, etc.

**HTTP Status Code**: 500 Internal Server Error

**Response Format**:
```json
{
  "success": false,
  "error": {
    "code": "DATABASE_ERROR",
    "message": "Đã xảy ra lỗi khi xử lý dữ liệu. Vui lòng thử lại sau."
  }
}
```

**Xử lý**:
- Không expose chi tiết lỗi database ra ngoài (security)
- Log chi tiết lỗi vào server log
- Trả về message chung chung cho user

#### 7. File Upload Errors (Lỗi Upload File)

**Khi nào xảy ra**: File quá lớn, sai định dạng

**HTTP Status Code**: 400 Bad Request

**Response Format**:
```json
{
  "success": false,
  "error": {
    "code": "FILE_UPLOAD_ERROR",
    "message": "File không hợp lệ: Chỉ chấp nhận JPG, PNG, WebP và kích thước tối đa 5MB"
  }
}
```

### Error Handling Middleware

```typescript
// Middleware xử lý lỗi tập trung
function errorHandler(err, req, res, next) {
  // Log lỗi
  console.error(err);
  
  // Xác định loại lỗi và trả về response phù hợp
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: err.message,
        details: err.details
      }
    });
  }
  
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Vui lòng đăng nhập để tiếp tục'
      }
    });
  }
  
  // Default: Internal Server Error
  return res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Đã xảy ra lỗi. Vui lòng thử lại sau.'
    }
  });
}
```

### Logging Strategy

**Mục đích**: Ghi lại lỗi để debug và monitoring

**Công cụ**: Winston hoặc Morgan

**Log Levels**:
- **ERROR**: Lỗi nghiêm trọng (database down, uncaught exception)
- **WARN**: Cảnh báo (xuất kho vượt tồn kho, login failed)
- **INFO**: Thông tin (user login, order created)
- **DEBUG**: Chi tiết cho development

**Log Format**:
```
[2024-01-15 10:30:45] ERROR: Database connection failed
  Stack: Error: connect ECONNREFUSED 127.0.0.1:27017
  User: admin@example.com
  Request: POST /api/products
```



## Chiến Lược Kiểm Thử (Testing Strategy)

### Tổng Quan

Hệ thống sử dụng **dual testing approach** (phương pháp kiểm thử kép) kết hợp:
1. **Unit Tests**: Kiểm tra các trường hợp cụ thể, edge cases, và error conditions
2. **Property-Based Tests**: Kiểm tra các thuộc tính phổ quát trên nhiều đầu vào ngẫu nhiên

Cả hai loại test đều cần thiết và bổ sung cho nhau để đạt được độ bao phủ toàn diện.

### 1. Unit Testing

**Mục đích**: Kiểm tra các trường hợp cụ thể, ví dụ minh họa, và edge cases

**Framework**: 
- Backend: **Jest** (cho Node.js + TypeScript)
- Frontend: **Jest** + **React Testing Library**

**Phạm vi kiểm thử**:

#### Backend Unit Tests

**Services Layer**:
```typescript
// Ví dụ: product.service.test.ts
describe('ProductService', () => {
  describe('createProduct', () => {
    it('should create product with valid data', async () => {
      const productData = {
        name: 'Giấy A4',
        category: 'giay-in',
        price: 50000,
        unit: 'ream'
      };
      const result = await ProductService.create(productData);
      expect(result).toHaveProperty('_id');
      expect(result.name).toBe('Giấy A4');
    });
    
    it('should reject product with missing name', async () => {
      const productData = { price: 50000 };
      await expect(ProductService.create(productData))
        .rejects.toThrow('Tên sản phẩm là bắt buộc');
    });
    
    it('should reject product with negative price', async () => {
      const productData = { name: 'Test', price: -100 };
      await expect(ProductService.create(productData))
        .rejects.toThrow('Giá phải là số dương');
    });
  });
});
```

**Controllers Layer**:
```typescript
// Ví dụ: product.controller.test.ts
describe('ProductController', () => {
  it('GET /api/products should return 200 and product list', async () => {
    const response = await request(app).get('/api/products');
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
  });
  
  it('POST /api/products without auth should return 401', async () => {
    const response = await request(app)
      .post('/api/products')
      .send({ name: 'Test' });
    expect(response.status).toBe(401);
  });
});
```

**Transaction Logic**:
```typescript
describe('TransactionService', () => {
  it('should increase stock on inbound transaction', async () => {
    const product = await createTestProduct({ currentStock: 100 });
    await TransactionService.createInbound({
      product: product._id,
      quantity: 50
    });
    const updated = await Product.findById(product._id);
    expect(updated.currentStock).toBe(150);
  });
  
  it('should decrease stock on outbound transaction', async () => {
    const product = await createTestProduct({ currentStock: 100 });
    await TransactionService.createOutbound({
      product: product._id,
      quantity: 30
    });
    const updated = await Product.findById(product._id);
    expect(updated.currentStock).toBe(70);
  });
});
```

#### Frontend Unit Tests

**Components**:
```typescript
// Ví dụ: ProductCard.test.tsx
describe('ProductCard', () => {
  it('should render product information', () => {
    const product = {
      name: 'Giấy A4',
      price: 50000,
      image: '/images/a4.jpg'
    };
    render(<ProductCard product={product} />);
    expect(screen.getByText('Giấy A4')).toBeInTheDocument();
    expect(screen.getByText('50,000 đ')).toBeInTheDocument();
  });
  
  it('should call onAddToCart when button clicked', () => {
    const mockAddToCart = jest.fn();
    render(<ProductCard product={mockProduct} onAddToCart={mockAddToCart} />);
    fireEvent.click(screen.getByText('Thêm vào giỏ'));
    expect(mockAddToCart).toHaveBeenCalledWith(mockProduct);
  });
});
```

**Hooks và Utils**:
```typescript
describe('useCart', () => {
  it('should add item to cart', () => {
    const { result } = renderHook(() => useCart());
    act(() => {
      result.current.addItem({ id: '1', name: 'Test', quantity: 1 });
    });
    expect(result.current.items).toHaveLength(1);
  });
});
```



### 2. Property-Based Testing

**Mục đích**: Kiểm tra các thuộc tính phổ quát trên nhiều đầu vào ngẫu nhiên

**Framework**: **fast-check** (cho JavaScript/TypeScript)

**Cấu hình**: Mỗi property test chạy tối thiểu **100 iterations** (do tính ngẫu nhiên)

**Tag Format**: Mỗi test phải có comment tham chiếu đến property trong design document
```typescript
// Feature: paper-warehouse-management, Property 10: Nhập kho tăng tồn kho
```

#### Ví Dụ Property Tests

**Property 10: Nhập Kho Tăng Tồn Kho**
```typescript
import fc from 'fast-check';

// Feature: paper-warehouse-management, Property 10: Nhập kho tăng tồn kho
describe('Property 10: Inbound increases stock', () => {
  it('should increase stock by inbound quantity for any valid transaction', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 0, max: 10000 }), // initial stock
        fc.integer({ min: 1, max: 1000 }),  // inbound quantity
        async (initialStock, quantity) => {
          // Setup
          const product = await createTestProduct({ currentStock: initialStock });
          
          // Action
          await TransactionService.createInbound({
            product: product._id,
            quantity: quantity
          });
          
          // Assert
          const updated = await Product.findById(product._id);
          expect(updated.currentStock).toBe(initialStock + quantity);
        }
      ),
      { numRuns: 100 } // Chạy 100 lần với dữ liệu ngẫu nhiên
    );
  });
});
```

**Property 11: Xuất Kho Giảm Tồn Kho**
```typescript
// Feature: paper-warehouse-management, Property 11: Xuất kho giảm tồn kho
describe('Property 11: Outbound decreases stock', () => {
  it('should decrease stock by outbound quantity for any valid transaction', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 100, max: 10000 }), // initial stock (đủ để xuất)
        fc.integer({ min: 1, max: 100 }),     // outbound quantity
        async (initialStock, quantity) => {
          const product = await createTestProduct({ currentStock: initialStock });
          
          await TransactionService.createOutbound({
            product: product._id,
            quantity: quantity
          });
          
          const updated = await Product.findById(product._id);
          expect(updated.currentStock).toBe(initialStock - quantity);
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

**Property 2: Lọc Danh Mục Chính Xác**
```typescript
// Feature: paper-warehouse-management, Property 2: Lọc danh mục chính xác
describe('Property 2: Category filter accuracy', () => {
  it('should return only products from selected category for any category', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(fc.record({
          name: fc.string(),
          category: fc.constantFrom('giay-in', 'vai-vun', 'loi-ong')
        })),
        fc.constantFrom('giay-in', 'vai-vun', 'loi-ong'),
        async (products, selectedCategory) => {
          // Setup: Tạo sản phẩm test
          await Product.insertMany(products);
          
          // Action: Lọc theo danh mục
          const filtered = await ProductService.getByCategory(selectedCategory);
          
          // Assert: Tất cả kết quả phải thuộc danh mục đã chọn
          filtered.forEach(product => {
            expect(product.category).toBe(selectedCategory);
          });
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

**Property 17: Tổng Giá Giỏ Hàng Chính Xác**
```typescript
// Feature: paper-warehouse-management, Property 17: Tổng giá giỏ hàng chính xác
describe('Property 17: Cart total calculation', () => {
  it('should calculate correct total for any cart items', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(fc.record({
          price: fc.integer({ min: 1000, max: 1000000 }),
          quantity: fc.integer({ min: 1, max: 100 })
        })),
        async (items) => {
          // Setup
          const cart = await CartService.create(items);
          
          // Calculate expected total
          const expectedTotal = items.reduce(
            (sum, item) => sum + (item.price * item.quantity),
            0
          );
          
          // Assert
          expect(cart.total).toBe(expectedTotal);
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

**Property 20: Phí Ship Không Âm**
```typescript
// Feature: paper-warehouse-management, Property 20: Phí ship không âm
describe('Property 20: Shipping fee non-negative', () => {
  it('should return non-negative shipping fee for any address and weight', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string(), // address
        fc.float({ min: 0.1, max: 1000 }), // weight in kg
        async (address, weight) => {
          const shippingFee = await ShippingService.calculate(address, weight);
          expect(shippingFee).toBeGreaterThanOrEqual(0);
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

**Property 6: Từ Chối Sản Phẩm Thiếu Thông Tin**
```typescript
// Feature: paper-warehouse-management, Property 6: Từ chối sản phẩm thiếu thông tin
describe('Property 6: Reject incomplete products', () => {
  it('should reject products missing required fields', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          name: fc.option(fc.string(), { nil: undefined }),
          price: fc.option(fc.integer(), { nil: undefined }),
          category: fc.option(fc.string(), { nil: undefined })
        }),
        async (productData) => {
          // Nếu thiếu bất kỳ trường nào
          const isIncomplete = !productData.name || 
                               !productData.price || 
                               !productData.category;
          
          if (isIncomplete) {
            await expect(ProductService.create(productData))
              .rejects.toThrow();
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

### 3. Integration Testing

**Mục đích**: Kiểm tra tương tác giữa các components

**Phạm vi**:
- API endpoints (request → response)
- Database operations
- File upload flow
- Authentication flow

**Ví dụ**:
```typescript
describe('Order Creation Flow', () => {
  it('should create order, clear cart, and decrease stock', async () => {
    // 1. Tạo sản phẩm
    const product = await createTestProduct({ currentStock: 100 });
    
    // 2. Thêm vào giỏ hàng
    await CartService.addItem({ product: product._id, quantity: 10 });
    
    // 3. Đặt hàng
    const order = await OrderService.create({
      customer: { name: 'Test', phone: '0123456789' }
    });
    
    // 4. Kiểm tra kết quả
    expect(order.status).toBe('pending');
    
    const cart = await CartService.get();
    expect(cart.items).toHaveLength(0); // Giỏ hàng đã xóa
    
    const updatedProduct = await Product.findById(product._id);
    expect(updatedProduct.currentStock).toBe(90); // Tồn kho giảm
  });
});
```

### 4. Test Coverage Goals

**Mục tiêu độ bao phủ**:
- **Services**: >= 90% (logic nghiệp vụ quan trọng)
- **Controllers**: >= 80%
- **Utils**: >= 85%
- **Components**: >= 75%

**Công cụ**: Jest coverage report

**Chạy coverage**:
```bash
npm run test:coverage
```

### 5. Test Organization

**Cấu trúc thư mục**:
```
backend/
├── src/
│   ├── services/
│   │   └── product.service.ts
│   └── controllers/
│       └── product.controller.ts
└── tests/
    ├── unit/
    │   ├── services/
    │   │   └── product.service.test.ts
    │   └── controllers/
    │       └── product.controller.test.ts
    ├── property/
    │   └── transaction.property.test.ts
    └── integration/
        └── order-flow.integration.test.ts

frontend/
├── src/
│   └── components/
│       └── ProductCard.tsx
└── tests/
    └── components/
        └── ProductCard.test.tsx
```

### 6. Continuous Integration

**CI/CD Pipeline**:
1. Commit code → GitHub
2. GitHub Actions trigger
3. Run linter (ESLint)
4. Run all tests (unit + property + integration)
5. Generate coverage report
6. If all pass → Deploy to staging
7. Manual approval → Deploy to production

**GitHub Actions Config**:
```yaml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install dependencies
        run: npm install
      - name: Run tests
        run: npm test
      - name: Check coverage
        run: npm run test:coverage
```

### 7. Test Data Management

**Strategy**: Sử dụng **test fixtures** và **factories**

```typescript
// test/fixtures/product.fixture.ts
export const createTestProduct = (overrides = {}) => {
  return Product.create({
    name: 'Test Product',
    category: 'test-category',
    price: 10000,
    currentStock: 100,
    unit: 'piece',
    ...overrides
  });
};
```

**Database**: Sử dụng **in-memory MongoDB** (mongodb-memory-server) cho tests

```typescript
// test/setup.ts
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  // Xóa dữ liệu sau mỗi test
  await Promise.all(
    Object.values(mongoose.connection.collections).map(c => c.deleteMany({}))
  );
});
```

