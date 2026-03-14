# Kế Hoạch Triển Khai - Hệ Thống Quản Lý Kho Giấy

## Tổng Quan

Xây dựng hệ thống quản lý kho giấy với kiến trúc 3-tier: Frontend (React + TypeScript), Backend (Node.js + Express + TypeScript), Database (MongoDB). Hệ thống bao gồm Trang Chủ cho khách hàng và Trang Quản Trị cho admin.

## Danh Sách Công Việc

- [x] 1. Khởi tạo dự án và cấu trúc cơ bản
  - Tạo cấu trúc thư mục backend và frontend
  - Cài đặt dependencies (Express, React, TypeScript, MongoDB, Mongoose)
  - Cấu hình TypeScript, ESLint, và môi trường development
  - _Yêu cầu: Tất cả_

- [x] 2. Thiết lập database và models
  - [x] 2.1 Tạo Mongoose schemas cho User, Category, Product, Supplier
    - Định nghĩa interfaces và schemas với validation
    - Tạo indexes cho performance
    - _Yêu cầu: 3.1, 4.1, 5.1, 19.1_
  
  - [ ]* 2.2 Viết property test cho Product model
    - **Property 5: Tạo sản phẩm với đầy đủ thông tin**
    - **Validates: Yêu cầu 4.1**
  
  - [x] 2.3 Tạo schemas cho Transaction, Order, Expense, Cart
    - Định nghĩa schemas với embedded documents và references
    - _Yêu cầu: 6.1, 7.1, 14.1, 22.1_
  
  - [ ]* 2.4 Viết property test cho Transaction model
    - **Property 10: Nhập kho tăng tồn kho**
    - **Property 11: Xuất kho giảm tồn kho**
    - **Validates: Yêu cầu 6.2, 7.2_

- [x] 3. Xây dựng authentication và middleware
  - [x] 3.1 Implement JWT authentication
    - Tạo auth service với login/logout
    - Hash password bằng bcrypt
    - _Yêu cầu: 3.1, 3.2, 3.3_
  
  - [ ]* 3.2 Viết property test cho authentication
    - **Property 3: Xác thực token hợp lệ**
    - **Property 4: Từ chối token không hợp lệ**
    - **Validates: Yêu cầu 3.2, 3.3**
  
  - [x] 3.3 Tạo middleware cho validation, error handling, file upload
    - Auth middleware kiểm tra JWT
    - Validation middleware với express-validator
    - Error handler middleware tập trung
    - Multer middleware cho upload hình ảnh
    - _Yêu cầu: 4.4, 11.1, 11.2, 11.3_

- [ ] 4. Xây dựng services layer (business logic)
  - [ ] 4.1 Implement ProductService và CategoryService
    - CRUD operations cho sản phẩm và danh mục
    - Tìm kiếm và lọc sản phẩm
    - Upload và quản lý hình ảnh
    - _Yêu cầu: 1.1, 1.2, 1.4, 2.2, 4.1, 4.2, 4.3, 5.1, 5.2, 5.3, 11.1_
  
  - [ ]* 4.2 Viết property tests cho Product và Category
    - **Property 2: Lọc danh mục chính xác**
    - **Property 6: Từ chối sản phẩm thiếu thông tin**
    - **Property 9: Ngăn xóa danh mục có sản phẩm**
    - **Validates: Yêu cầu 1.4, 4.4, 5.4**
  
  - [ ] 4.3 Implement TransactionService
    - Tạo giao dịch nhập/xuất kho
    - Cập nhật tồn kho tự động
    - Validate số lượng và tồn kho
    - _Yêu cầu: 6.1, 6.2, 6.3, 6.4, 7.1, 7.2, 7.3, 7.4, 7.5_
  
  - [ ]* 4.4 Viết property tests cho Transaction
    - **Property 12: Số lượng nhập phải dương**
    - **Property 13: Số lượng xuất phải dương**
    - **Property 14: Cảnh báo xuất vượt tồn kho**
    - **Validates: Yêu cầu 6.4, 7.3, 7.5**

- [ ] 5. Checkpoint - Kiểm tra backend core
  - Đảm bảo tất cả tests pass
  - Hỏi user nếu có thắc mắc

- [ ] 6. Xây dựng cart và order services
  - [ ] 6.1 Implement CartService
    - Thêm/xóa/cập nhật sản phẩm trong giỏ
    - Tính tổng giá trị giỏ hàng
    - _Yêu cầu: 13.1, 13.3, 13.4, 13.5, 13.6_
  
  - [ ]* 6.2 Viết property tests cho Cart
    - **Property 15: Thêm vào giỏ hàng tăng số lượng**
    - **Property 16: Xóa khỏi giỏ hàng giảm số lượng**
    - **Property 17: Tổng giá giỏ hàng chính xác**
    - **Validates: Yêu cầu 13.1, 13.5, 13.6**
  
  - [ ] 6.3 Implement OrderService và ShippingService
    - Tạo đơn hàng từ giỏ hàng
    - Tính phí ship dựa trên địa chỉ và trọng lượng
    - Quản lý trạng thái đơn hàng
    - Tra cứu đơn hàng
    - _Yêu cầu: 14.1, 14.2, 14.3, 14.4, 14.5, 14.6, 15.1, 15.2, 15.3, 15.4, 17.1, 17.2, 17.4, 18.1, 18.4, 18.5_
  
  - [ ]* 6.4 Viết property tests cho Order
    - **Property 18: Đơn hàng mới có trạng thái "Chờ duyệt"**
    - **Property 19: Đặt hàng thành công xóa giỏ hàng**
    - **Property 20: Phí ship không âm**
    - **Property 21: Tổng thanh toán bao gồm phí ship**
    - **Validates: Yêu cầu 14.4, 14.5, 15.1, 15.3**

- [ ] 7. Xây dựng supplier, expense và report services
  - [ ] 7.1 Implement SupplierService và ExpenseService
    - CRUD operations cho nhà cung cấp và chi phí
    - Validate số tiền chi phí > 0
    - _Yêu cầu: 19.1, 19.2, 19.3, 22.1, 22.2, 22.3, 22.6_
  
  - [ ]* 7.2 Viết property test cho Expense
    - **Property 25: Chi phí phải dương**
    - **Validates: Yêu cầu 22.6**
  
  - [ ] 7.3 Implement ReportService
    - Báo cáo tồn kho, doanh thu, chi phí, lợi nhuận
    - Xuất báo cáo PDF/Excel
    - _Yêu cầu: 9.1, 9.2, 10.1, 10.2, 10.3, 24.1, 24.2, 25.1, 25.2, 26.1, 26.2_

- [ ] 8. Xây dựng API routes và controllers
  - [ ] 8.1 Tạo routes và controllers cho Product, Category, Auth
    - Định nghĩa endpoints với HTTP methods
    - Controllers xử lý request/response
    - Áp dụng auth middleware cho admin routes
    - _Yêu cầu: 1.1, 1.2, 2.1, 2.2, 3.1, 4.1, 4.2, 4.3, 5.1, 5.2, 5.3_
  
  - [ ] 8.2 Tạo routes và controllers cho Transaction, Order, Cart
    - Endpoints cho nhập/xuất kho, đơn hàng, giỏ hàng
    - _Yêu cầu: 6.1, 7.1, 8.1, 8.2, 8.3, 8.4, 13.1, 13.3, 13.4, 13.5, 14.1, 17.1, 18.1, 18.2, 18.3, 18.4_
  
  - [ ] 8.3 Tạo routes và controllers cho Supplier, Expense, Report
    - Endpoints cho nhà cung cấp, chi phí, báo cáo
    - _Yêu cầu: 19.1, 19.2, 19.3, 19.4, 22.1, 22.2, 22.3, 22.4, 22.5, 10.5, 24.4, 25.4, 26.5_

- [ ] 9. Checkpoint - Kiểm tra backend hoàn chỉnh
  - Test tất cả API endpoints
  - Đảm bảo authentication và authorization hoạt động
  - Hỏi user nếu có vấn đề

- [x] 10. Xây dựng frontend - Trang Chủ (Customer)
  - [x] 10.1 Tạo layout và routing cho Trang Chủ
    - Setup React Router với các pages
    - Tạo Header, Footer components
    - Responsive design với TailwindCSS
    - _Yêu cầu: 12.1, 12.3, 12.4_
  
  - [x] 10.2 Implement trang danh sách sản phẩm
    - ProductList, ProductCard components
    - SearchBar và CategoryFilter
    - Pagination
    - _Yêu cầu: 1.1, 1.2, 1.4, 2.1, 2.2_
  
  - [x] 10.3 Implement trang chi tiết sản phẩm
    - Hiển thị thông tin đầy đủ
    - Nút thêm vào giỏ hàng
    - _Yêu cầu: 1.3, 13.1_
  
  - [x] 10.4 Implement giỏ hàng và checkout
    - CartPage với danh sách sản phẩm
    - Cập nhật số lượng, xóa sản phẩm
    - CheckoutPage với form thông tin giao hàng
    - Hiển thị phí ship và tổng thanh toán
    - _Yêu cầu: 13.2, 13.3, 13.4, 13.5, 13.6, 14.1, 14.2, 14.3, 14.4, 14.5, 14.6, 15.1, 15.2, 15.3, 15.4, 16.1, 16.2, 16.3_
  
  - [x] 10.5 Implement tra cứu đơn hàng
    - Form nhập mã đơn hàng và số điện thoại
    - Hiển thị chi tiết và trạng thái đơn hàng
    - _Yêu cầu: 17.1, 17.2, 17.3, 17.4_

- [-] 11. Xây dựng frontend - Trang Quản Trị (Admin)
  - [x] 11.1 Tạo layout và authentication cho Admin
    - LoginPage với form đăng nhập
    - Sidebar navigation và Header
    - Protected routes với auth check
    - _Yêu cầu: 3.1, 3.2, 3.3, 12.2, 12.3, 12.4_
  
  - [~] 11.2 Implement quản lý sản phẩm và danh mục
    - DataTable với sort/filter/pagination
    - ProductForm và CategoryForm
    - Upload hình ảnh
    - _Yêu cầu: 4.1, 4.2, 4.3, 4.4, 4.5, 5.1, 5.2, 5.3, 5.4, 11.1, 11.2, 11.3, 11.4, 11.5_
  
  - [~] 11.3 Implement quản lý tồn kho và giao dịch
    - InventoryPage hiển thị tồn kho và cảnh báo
    - TransactionForm cho nhập/xuất kho
    - Lịch sử giao dịch với filter
    - In phiếu nhập/xuất PDF
    - _Yêu cầu: 6.1, 6.2, 6.3, 6.4, 7.1, 7.2, 7.3, 7.4, 7.5, 8.1, 8.2, 8.3, 8.4, 9.1, 9.2, 9.3, 9.4, 20.1, 20.2, 20.3, 20.4, 21.1, 21.2, 21.3, 21.4_
  
  - [~] 11.4 Implement quản lý đơn hàng
    - Danh sách đơn hàng với filter theo trạng thái
    - OrderDetail component
    - Cập nhật trạng thái và phí ship
    - Xuất hóa đơn VAT
    - _Yêu cầu: 18.1, 18.2, 18.3, 18.4, 18.5, 18.6, 18.7, 23.1, 23.2, 23.3, 23.4, 23.5_
  
  - [~] 11.5 Implement quản lý nhà cung cấp và chi phí
    - SupplierManagementPage với CRUD
    - ExpenseManagementPage với filter
    - _Yêu cầu: 19.1, 19.2, 19.3, 19.4, 19.5, 22.1, 22.2, 22.3, 22.4, 22.5, 22.6_
  
  - [~] 11.6 Implement dashboard và báo cáo
    - DashboardPage với tổng quan
    - ReportsPage với biểu đồ
    - Xuất báo cáo PDF/Excel
    - _Yêu cầu: 10.1, 10.2, 10.3, 10.4, 10.5, 24.1, 24.2, 24.3, 24.4, 25.1, 25.2, 25.3, 25.4, 26.1, 26.2, 26.3, 26.4, 26.5_

- [ ] 12. Tích hợp và kiểm thử tổng thể
  - [ ] 12.1 Kết nối frontend với backend API
    - Setup Axios với base URL và interceptors
    - Implement API calls trong React Query
    - Xử lý loading states và errors
    - _Yêu cầu: Tất cả_
  
  - [ ]* 12.2 Viết integration tests
    - Test luồng đặt hàng end-to-end
    - Test luồng nhập/xuất kho
    - _Yêu cầu: 14.1-14.6, 6.1-7.5_
  
  - [ ] 12.3 Kiểm tra responsive design
    - Test trên desktop, tablet, mobile
    - Fix UI issues
    - _Yêu cầu: 12.1, 12.2, 12.3, 12.4_

- [ ] 13. Checkpoint cuối - Hoàn thiện hệ thống
  - Chạy tất cả tests (unit + property + integration)
  - Kiểm tra tất cả chức năng hoạt động
  - Hỏi user về deployment và các yêu cầu bổ sung

## Ghi Chú

- Tasks đánh dấu `*` là optional (tests) - có thể bỏ qua để triển khai nhanh hơn
- Mỗi task tham chiếu đến requirements cụ thể để dễ truy vết
- Property tests giúp đảm bảo tính đúng đắn của logic nghiệp vụ
- Checkpoints để review tiến độ và giải đáp thắc mắc
