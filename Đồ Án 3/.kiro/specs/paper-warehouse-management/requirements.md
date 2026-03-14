# Tài Liệu Yêu Cầu - Hệ Thống Quản Lý Kho Giấy

## Giới Thiệu

Hệ thống quản lý kho giấy là một ứng dụng web thương mại điện tử cho phép doanh nghiệp quản lý tồn kho các sản phẩm (giấy, vải vụn, lõi ống), theo dõi nhập xuất hàng, quản lý đơn hàng online, và cung cấp giao diện người dùng để mua sắm trực tuyến. Hệ thống bao gồm hai phần chính: Trang chủ (Frontend) dành cho khách hàng mua hàng và Trang quản trị (Admin) dành cho quản lý toàn bộ hoạt động kinh doanh.

## Thuật Ngữ

- **Hệ_Thống**: Hệ thống quản lý kho giấy bao gồm cả frontend và backend
- **Trang_Chủ**: Giao diện người dùng cuối để xem thông tin sản phẩm, mua hàng và quản lý đơn hàng
- **Trang_Quản_Trị**: Giao diện quản trị để quản lý sản phẩm, tồn kho, đơn hàng, nhà cung cấp, chi phí và báo cáo
- **Sản_Phẩm**: Các loại sản phẩm được quản lý trong kho bao gồm giấy (giấy in, giấy ảnh, giấy bìa), vải vụn, và lõi ống
- **Giao_Dịch_Nhập**: Hoạt động nhập hàng vào kho từ nhà cung cấp
- **Giao_Dịch_Xuất**: Hoạt động xuất hàng ra khỏi kho
- **Tồn_Kho**: Số lượng sản phẩm hiện có trong kho
- **Quản_Trị_Viên**: Người dùng có quyền truy cập vào Trang_Quản_Trị
- **Khách_Hàng**: Người truy cập Trang_Chủ để xem và mua sản phẩm
- **Danh_Mục**: Phân loại các Sản_Phẩm theo nhóm
- **Đơn_Vị_Tính**: Đơn vị đo lường sản phẩm (tấn, kg, ream, tờ, cuộn, v.v.)
- **Giỏ_Hàng**: Danh sách sản phẩm mà Khách_Hàng chọn mua trước khi đặt hàng
- **Đơn_Hàng**: Yêu cầu mua hàng từ Khách_Hàng bao gồm thông tin sản phẩm, số lượng, địa chỉ giao hàng và phương thức thanh toán
- **Trạng_Thái_Đơn_Hàng**: Tình trạng xử lý của Đơn_Hàng (chờ duyệt, đã duyệt, đang giao, hoàn thành, hủy)
- **Nhà_Cung_Cấp**: Đối tác cung cấp hàng hóa cho doanh nghiệp
- **Phí_Ship**: Chi phí vận chuyển hàng hóa đến địa chỉ của Khách_Hàng
- **Phiếu_Nhập_Kho**: Chứng từ ghi nhận Giao_Dịch_Nhập
- **Phiếu_Xuất_Kho**: Chứng từ ghi nhận Giao_Dịch_Xuất
- **Chi_Phí**: Các khoản chi phí phát sinh trong hoạt động kinh doanh (nhân công bốc hàng, tiền xe, chi phí khác)
- **Hóa_Đơn_VAT**: Hóa đơn giá trị gia tăng được xuất cho Khách_Hàng
- **Thanh_Toán_Chuyển_Khoản**: Phương thức thanh toán qua ngân hàng

## Yêu Cầu

### Yêu Cầu 1: Hiển Thị Danh Sách Sản Phẩm Trên Trang Chủ

**User Story:** Là một Khách_Hàng, tôi muốn xem danh sách các Sản_Phẩm có sẵn, để tôi có thể tìm hiểu và lựa chọn sản phẩm mua.

#### Tiêu Chí Chấp Nhận

1. THE Trang_Chủ SHALL hiển thị danh sách tất cả Sản_Phẩm đang có trong hệ thống
2. THE Trang_Chủ SHALL hiển thị thông tin cơ bản của mỗi Sản_Phẩm bao gồm tên, mô tả, giá, và hình ảnh
3. WHEN Khách_Hàng nhấp vào một Sản_Phẩm, THE Trang_Chủ SHALL hiển thị trang chi tiết sản phẩm
4. THE Trang_Chủ SHALL cho phép Khách_Hàng lọc sản phẩm theo Danh_Mục

### Yêu Cầu 2: Tìm Kiếm Sản Phẩm

**User Story:** Là một Khách_Hàng, tôi muốn tìm kiếm Sản_Phẩm theo tên hoặc mô tả, để tôi có thể nhanh chóng tìm thấy sản phẩm mình quan tâm.

#### Tiêu Chí Chấp Nhận

1. THE Trang_Chủ SHALL cung cấp ô tìm kiếm cho Khách_Hàng
2. WHEN Khách_Hàng nhập từ khóa tìm kiếm, THE Hệ_Thống SHALL trả về danh sách Sản_Phẩm có tên hoặc mô tả chứa từ khóa đó
3. THE Hệ_Thống SHALL hiển thị kết quả tìm kiếm trong vòng 500ms kể từ khi Khách_Hàng nhập xong từ khóa

### Yêu Cầu 3: Xác Thực Quản Trị Viên

**User Story:** Là một Quản_Trị_Viên, tôi muốn đăng nhập vào Trang_Quản_Trị, để tôi có thể quản lý hệ thống một cách an toàn.

#### Tiêu Chí Chấp Nhận

1. THE Trang_Quản_Trị SHALL yêu cầu Quản_Trị_Viên đăng nhập trước khi truy cập
2. WHEN Quản_Trị_Viên nhập thông tin đăng nhập hợp lệ, THE Hệ_Thống SHALL cho phép truy cập vào Trang_Quản_Trị
3. WHEN Quản_Trị_Viên nhập thông tin đăng nhập không hợp lệ, THE Hệ_Thống SHALL hiển thị thông báo lỗi và từ chối truy cập
4. THE Hệ_Thống SHALL tự động đăng xuất Quản_Trị_Viên sau 30 phút không hoạt động

### Yêu Cầu 4: Quản Lý Sản Phẩm

**User Story:** Là một Quản_Trị_Viên, tôi muốn thêm, sửa, và xóa Sản_Phẩm, để tôi có thể cập nhật danh mục sản phẩm.

#### Tiêu Chí Chấp Nhận

1. THE Trang_Quản_Trị SHALL cho phép Quản_Trị_Viên tạo mới Sản_Phẩm với các thông tin: tên, mô tả, Danh_Mục, Đơn_Vị_Tính, giá, và hình ảnh
2. THE Trang_Quản_Trị SHALL cho phép Quản_Trị_Viên chỉnh sửa thông tin của Sản_Phẩm đã có
3. THE Trang_Quản_Trị SHALL cho phép Quản_Trị_Viên xóa Sản_Phẩm khỏi hệ thống
4. WHEN Quản_Trị_Viên lưu thông tin Sản_Phẩm, THE Hệ_Thống SHALL xác thực rằng tất cả các trường bắt buộc đã được điền
5. IF thông tin Sản_Phẩm không hợp lệ, THEN THE Hệ_Thống SHALL hiển thị thông báo lỗi cụ thể

### Yêu Cầu 5: Quản Lý Danh Mục Sản Phẩm

**User Story:** Là một Quản_Trị_Viên, tôi muốn tạo và quản lý các Danh_Mục, để tôi có thể tổ chức Sản_Phẩm một cách logic.

#### Tiêu Chí Chấp Nhận

1. THE Trang_Quản_Trị SHALL cho phép Quản_Trị_Viên tạo mới Danh_Mục với tên và mô tả
2. THE Trang_Quản_Trị SHALL cho phép Quản_Trị_Viên chỉnh sửa thông tin Danh_Mục
3. THE Trang_Quản_Trị SHALL cho phép Quản_Trị_Viên xóa Danh_Mục không còn chứa Sản_Phẩm nào
4. IF Danh_Mục còn chứa Sản_Phẩm, THEN THE Hệ_Thống SHALL ngăn chặn việc xóa và hiển thị thông báo cảnh báo

### Yêu Cầu 6: Ghi Nhận Giao Dịch Nhập Kho

**User Story:** Là một Quản_Trị_Viên, tôi muốn ghi nhận Giao_Dịch_Nhập, để tôi có thể cập nhật Tồn_Kho khi nhập hàng mới.

#### Tiêu Chí Chấp Nhận

1. THE Trang_Quản_Trị SHALL cho phép Quản_Trị_Viên tạo Giao_Dịch_Nhập với các thông tin: Sản_Phẩm, số lượng, ngày nhập, Nhà_Cung_Cấp, và ghi chú
2. WHEN Giao_Dịch_Nhập được lưu, THE Hệ_Thống SHALL tăng Tồn_Kho của Sản_Phẩm tương ứng theo số lượng nhập
3. THE Hệ_Thống SHALL ghi lại thời gian tạo Giao_Dịch_Nhập
4. THE Hệ_Thống SHALL xác thực rằng số lượng nhập là số dương lớn hơn 0

### Yêu Cầu 7: Ghi Nhận Giao Dịch Xuất Kho

**User Story:** Là một Quản_Trị_Viên, tôi muốn ghi nhận Giao_Dịch_Xuất, để tôi có thể cập nhật Tồn_Kho khi xuất hàng.

#### Tiêu Chí Chấp Nhận

1. THE Trang_Quản_Trị SHALL cho phép Quản_Trị_Viên tạo Giao_Dịch_Xuất với các thông tin: Sản_Phẩm, số lượng, ngày xuất, Khách_Hàng, và ghi chú
2. WHEN Giao_Dịch_Xuất được lưu, THE Hệ_Thống SHALL giảm Tồn_Kho của Sản_Phẩm tương ứng theo số lượng xuất
3. IF số lượng xuất lớn hơn Tồn_Kho hiện tại, THEN THE Hệ_Thống SHALL hiển thị cảnh báo và yêu cầu xác nhận từ Quản_Trị_Viên
4. THE Hệ_Thống SHALL ghi lại thời gian tạo Giao_Dịch_Xuất
5. THE Hệ_Thống SHALL xác thực rằng số lượng xuất là số dương lớn hơn 0

### Yêu Cầu 8: Xem Lịch Sử Giao Dịch

**User Story:** Là một Quản_Trị_Viên, tôi muốn xem lịch sử các Giao_Dịch_Nhập và Giao_Dịch_Xuất, để tôi có thể theo dõi hoạt động kho hàng.

#### Tiêu Chí Chấp Nhận

1. THE Trang_Quản_Trị SHALL hiển thị danh sách tất cả các giao dịch theo thứ tự thời gian giảm dần
2. THE Trang_Quản_Trị SHALL cho phép Quản_Trị_Viên lọc giao dịch theo loại (nhập hoặc xuất)
3. THE Trang_Quản_Trị SHALL cho phép Quản_Trị_Viên lọc giao dịch theo Sản_Phẩm
4. THE Trang_Quản_Trị SHALL cho phép Quản_Trị_Viên lọc giao dịch theo khoảng thời gian

### Yêu Cầu 9: Hiển Thị Thông Tin Tồn Kho

**User Story:** Là một Quản_Trị_Viên, tôi muốn xem Tồn_Kho hiện tại của từng Sản_Phẩm, để tôi có thể quản lý hàng tồn kho hiệu quả.

#### Tiêu Chí Chấp Nhận

1. THE Trang_Quản_Trị SHALL hiển thị Tồn_Kho hiện tại của mỗi Sản_Phẩm
2. THE Trang_Quản_Trị SHALL hiển thị cảnh báo cho các Sản_Phẩm có Tồn_Kho thấp hơn mức tối thiểu
3. WHERE mức tồn kho tối thiểu được cấu hình, THE Hệ_Thống SHALL sử dụng giá trị đó để xác định cảnh báo
4. THE Trang_Quản_Trị SHALL cho phép Quản_Trị_Viên sắp xếp danh sách theo Tồn_Kho tăng dần hoặc giảm dần

### Yêu Cầu 10: Báo Cáo Tồn Kho

**User Story:** Là một Quản_Trị_Viên, tôi muốn xem báo cáo tồn kho, để tôi có thể theo dõi tình trạng hàng hóa.

#### Tiêu Chí Chấp Nhận

1. THE Trang_Quản_Trị SHALL hiển thị tổng số lượng Sản_Phẩm trong hệ thống
2. THE Trang_Quản_Trị SHALL hiển thị tổng giá trị Tồn_Kho hiện tại
3. THE Trang_Quản_Trị SHALL hiển thị số lượng Giao_Dịch_Nhập và Giao_Dịch_Xuất trong khoảng thời gian được chọn
4. THE Trang_Quản_Trị SHALL hiển thị biểu đồ thể hiện xu hướng nhập xuất theo thời gian
5. THE Trang_Quản_Trị SHALL cho phép Quản_Trị_Viên xuất báo cáo dưới dạng PDF hoặc Excel

### Yêu Cầu 11: Quản Lý Hình Ảnh Sản Phẩm

**User Story:** Là một Quản_Trị_Viên, tôi muốn tải lên và quản lý hình ảnh cho Sản_Phẩm, để Khách_Hàng có thể xem hình ảnh sản phẩm trên Trang_Chủ.

#### Tiêu Chí Chấp Nhận

1. THE Trang_Quản_Trị SHALL cho phép Quản_Trị_Viên tải lên hình ảnh cho Sản_Phẩm
2. THE Hệ_Thống SHALL chấp nhận các định dạng hình ảnh JPG, PNG, và WebP
3. THE Hệ_Thống SHALL giới hạn kích thước file hình ảnh tối đa 5MB
4. IF file tải lên không đúng định dạng hoặc vượt quá kích thước cho phép, THEN THE Hệ_Thống SHALL hiển thị thông báo lỗi
5. THE Hệ_Thống SHALL tự động tối ưu hóa hình ảnh để hiển thị nhanh trên Trang_Chủ

### Yêu Cầu 12: Responsive Design

**User Story:** Là một Khách_Hàng hoặc Quản_Trị_Viên, tôi muốn truy cập hệ thống trên các thiết bị khác nhau, để tôi có thể làm việc linh hoạt.

#### Tiêu Chí Chấp Nhận

1. THE Trang_Chủ SHALL hiển thị đúng trên màn hình desktop, tablet, và mobile
2. THE Trang_Quản_Trị SHALL hiển thị đúng trên màn hình desktop và tablet
3. THE Hệ_Thống SHALL tự động điều chỉnh layout phù hợp với kích thước màn hình
4. THE Hệ_Thống SHALL đảm bảo các chức năng chính hoạt động trên tất cả các thiết bị được hỗ trợ

### Yêu Cầu 13: Quản Lý Giỏ Hàng

**User Story:** Là một Khách_Hàng, tôi muốn thêm sản phẩm vào Giỏ_Hàng và quản lý giỏ hàng, để tôi có thể chuẩn bị đặt hàng.

#### Tiêu Chí Chấp Nhận

1. WHEN Khách_Hàng nhấp nút thêm vào giỏ hàng trên trang sản phẩm, THE Hệ_Thống SHALL thêm Sản_Phẩm đó vào Giỏ_Hàng
2. THE Trang_Chủ SHALL hiển thị số lượng sản phẩm trong Giỏ_Hàng
3. THE Trang_Chủ SHALL cho phép Khách_Hàng xem danh sách sản phẩm trong Giỏ_Hàng
4. THE Trang_Chủ SHALL cho phép Khách_Hàng cập nhật số lượng của từng sản phẩm trong Giỏ_Hàng
5. THE Trang_Chủ SHALL cho phép Khách_Hàng xóa sản phẩm khỏi Giỏ_Hàng
6. THE Hệ_Thống SHALL tính tổng giá trị của tất cả sản phẩm trong Giỏ_Hàng

### Yêu Cầu 14: Đặt Hàng Online

**User Story:** Là một Khách_Hàng, tôi muốn tạo Đơn_Hàng từ Giỏ_Hàng, để tôi có thể mua sản phẩm trực tuyến.

#### Tiêu Chí Chấp Nhận

1. WHEN Khách_Hàng nhấp nút đặt hàng từ Giỏ_Hàng, THE Hệ_Thống SHALL chuyển đến trang nhập thông tin đơn hàng
2. THE Hệ_Thống SHALL yêu cầu Khách_Hàng nhập thông tin giao hàng bao gồm: họ tên, số điện thoại, địa chỉ, và ghi chú
3. THE Hệ_Thống SHALL xác thực rằng tất cả các trường thông tin bắt buộc đã được điền
4. WHEN Khách_Hàng hoàn tất nhập thông tin, THE Hệ_Thống SHALL tạo Đơn_Hàng với Trạng_Thái_Đơn_Hàng là "chờ duyệt"
5. WHEN Đơn_Hàng được tạo thành công, THE Hệ_Thống SHALL xóa các sản phẩm khỏi Giỏ_Hàng
6. WHEN Đơn_Hàng được tạo thành công, THE Hệ_Thống SHALL hiển thị thông báo xác nhận và mã đơn hàng cho Khách_Hàng

### Yêu Cầu 15: Tính Phí Ship

**User Story:** Là một Khách_Hàng, tôi muốn biết Phí_Ship cho đơn hàng của mình, để tôi có thể biết tổng chi phí cần thanh toán.

#### Tiêu Chí Chấp Nhận

1. WHEN Khách_Hàng nhập địa chỉ giao hàng, THE Hệ_Thống SHALL tính toán Phí_Ship dựa trên địa chỉ và tổng trọng lượng đơn hàng
2. THE Hệ_Thống SHALL hiển thị Phí_Ship trước khi Khách_Hàng xác nhận đặt hàng
3. THE Hệ_Thống SHALL tính tổng thanh toán bao gồm giá trị sản phẩm và Phí_Ship
4. WHERE Khách_Hàng thay đổi địa chỉ giao hàng, THE Hệ_Thống SHALL cập nhật lại Phí_Ship

### Yêu Cầu 16: Thanh Toán Chuyển Khoản

**User Story:** Là một Khách_Hàng, tôi muốn thanh toán đơn hàng bằng Thanh_Toán_Chuyển_Khoản, để tôi có thể hoàn tất giao dịch mua hàng.

#### Tiêu Chí Chấp Nhận

1. THE Hệ_Thống SHALL hiển thị thông tin tài khoản ngân hàng để Khách_Hàng chuyển khoản
2. THE Hệ_Thống SHALL hiển thị nội dung chuyển khoản bao gồm mã đơn hàng
3. THE Hệ_Thống SHALL hiển thị tổng số tiền cần chuyển khoản bao gồm giá trị sản phẩm và Phí_Ship
4. THE Hệ_Thống SHALL lưu thông tin thanh toán vào Đơn_Hàng

### Yêu Cầu 17: Xem Trạng Thái Đơn Hàng

**User Story:** Là một Khách_Hàng, tôi muốn xem Trạng_Thái_Đơn_Hàng của mình, để tôi có thể theo dõi tiến trình xử lý đơn hàng.

#### Tiêu Chí Chấp Nhận

1. THE Trang_Chủ SHALL cho phép Khách_Hàng tra cứu đơn hàng bằng mã đơn hàng và số điện thoại
2. WHEN Khách_Hàng tra cứu đơn hàng hợp lệ, THE Hệ_Thống SHALL hiển thị thông tin chi tiết đơn hàng bao gồm: danh sách sản phẩm, tổng tiền, Phí_Ship, địa chỉ giao hàng, và Trạng_Thái_Đơn_Hàng
3. THE Hệ_Thống SHALL hiển thị lịch sử thay đổi Trạng_Thái_Đơn_Hàng
4. IF thông tin tra cứu không hợp lệ, THEN THE Hệ_Thống SHALL hiển thị thông báo lỗi

### Yêu Cầu 18: Quản Lý Đơn Hàng

**User Story:** Là một Quản_Trị_Viên, tôi muốn quản lý các Đơn_Hàng từ khách hàng, để tôi có thể xử lý đơn hàng hiệu quả.

#### Tiêu Chí Chấp Nhận

1. THE Trang_Quản_Trị SHALL hiển thị danh sách tất cả Đơn_Hàng theo thứ tự thời gian giảm dần
2. THE Trang_Quản_Trị SHALL cho phép Quản_Trị_Viên lọc đơn hàng theo Trạng_Thái_Đơn_Hàng
3. THE Trang_Quản_Trị SHALL cho phép Quản_Trị_Viên xem chi tiết Đơn_Hàng
4. THE Trang_Quản_Trị SHALL cho phép Quản_Trị_Viên cập nhật Trạng_Thái_Đơn_Hàng
5. THE Trang_Quản_Trị SHALL cho phép Quản_Trị_Viên duyệt đơn hàng (chuyển từ "chờ duyệt" sang "đã duyệt")
6. WHEN Quản_Trị_Viên duyệt đơn hàng, THE Hệ_Thống SHALL ghi lại thời gian duyệt và người duyệt
7. THE Trang_Quản_Trị SHALL cho phép Quản_Trị_Viên cập nhật Phí_Ship cho đơn hàng

### Yêu Cầu 19: Quản Lý Nhà Cung Cấp

**User Story:** Là một Quản_Trị_Viên, tôi muốn quản lý thông tin Nhà_Cung_Cấp, để tôi có thể theo dõi các đối tác cung cấp hàng hóa.

#### Tiêu Chí Chấp Nhận

1. THE Trang_Quản_Trị SHALL cho phép Quản_Trị_Viên tạo mới Nhà_Cung_Cấp với các thông tin: tên, địa chỉ, số điện thoại, email, và ghi chú
2. THE Trang_Quản_Trị SHALL cho phép Quản_Trị_Viên chỉnh sửa thông tin Nhà_Cung_Cấp
3. THE Trang_Quản_Trị SHALL cho phép Quản_Trị_Viên xem danh sách tất cả Nhà_Cung_Cấp
4. THE Trang_Quản_Trị SHALL hiển thị lịch sử Giao_Dịch_Nhập từ mỗi Nhà_Cung_Cấp
5. THE Trang_Quản_Trị SHALL tính tổng giá trị giao dịch với mỗi Nhà_Cung_Cấp

### Yêu Cầu 20: In Phiếu Nhập Kho

**User Story:** Là một Quản_Trị_Viên, tôi muốn in Phiếu_Nhập_Kho, để tôi có thể lưu trữ chứng từ giấy.

#### Tiêu Chí Chấp Nhận

1. THE Trang_Quản_Trị SHALL cho phép Quản_Trị_Viên in Phiếu_Nhập_Kho cho mỗi Giao_Dịch_Nhập
2. THE Phiếu_Nhập_Kho SHALL bao gồm các thông tin: mã phiếu, ngày nhập, Nhà_Cung_Cấp, danh sách Sản_Phẩm với số lượng và đơn giá, tổng giá trị, và người lập phiếu
3. THE Hệ_Thống SHALL định dạng Phiếu_Nhập_Kho phù hợp để in trên giấy A4
4. THE Hệ_Thống SHALL cho phép xuất Phiếu_Nhập_Kho dưới dạng PDF

### Yêu Cầu 21: In Phiếu Xuất Kho

**User Story:** Là một Quản_Trị_Viên, tôi muốn in Phiếu_Xuất_Kho, để tôi có thể lưu trữ chứng từ giấy.

#### Tiêu Chí Chấp Nhận

1. THE Trang_Quản_Trị SHALL cho phép Quản_Trị_Viên in Phiếu_Xuất_Kho cho mỗi Giao_Dịch_Xuất
2. THE Phiếu_Xuất_Kho SHALL bao gồm các thông tin: mã phiếu, ngày xuất, Khách_Hàng, danh sách Sản_Phẩm với số lượng và đơn giá, tổng giá trị, và người lập phiếu
3. THE Hệ_Thống SHALL định dạng Phiếu_Xuất_Kho phù hợp để in trên giấy A4
4. THE Hệ_Thống SHALL cho phép xuất Phiếu_Xuất_Kho dưới dạng PDF

### Yêu Cầu 22: Quản Lý Chi Phí

**User Story:** Là một Quản_Trị_Viên, tôi muốn ghi nhận các Chi_Phí phát sinh, để tôi có thể theo dõi chi phí hoạt động.

#### Tiêu Chí Chấp Nhận

1. THE Trang_Quản_Trị SHALL cho phép Quản_Trị_Viên tạo Chi_Phí với các thông tin: loại chi phí (nhân công bốc hàng, tiền xe, chi phí khác), số tiền, ngày phát sinh, và ghi chú
2. THE Trang_Quản_Trị SHALL cho phép Quản_Trị_Viên chỉnh sửa thông tin Chi_Phí
3. THE Trang_Quản_Trị SHALL cho phép Quản_Trị_Viên xóa Chi_Phí
4. THE Trang_Quản_Trị SHALL hiển thị danh sách tất cả Chi_Phí theo thứ tự thời gian giảm dần
5. THE Trang_Quản_Trị SHALL cho phép Quản_Trị_Viên lọc Chi_Phí theo loại và khoảng thời gian
6. THE Hệ_Thống SHALL xác thực rằng số tiền chi phí là số dương lớn hơn 0

### Yêu Cầu 23: Xuất Hóa Đơn VAT

**User Story:** Là một Quản_Trị_Viên, tôi muốn xuất Hóa_Đơn_VAT cho Khách_Hàng, để tôi có thể cung cấp chứng từ hợp pháp.

#### Tiêu Chí Chấp Nhận

1. THE Trang_Quản_Trị SHALL cho phép Quản_Trị_Viên xuất Hóa_Đơn_VAT cho Đơn_Hàng đã hoàn thành
2. THE Hóa_Đơn_VAT SHALL bao gồm các thông tin: số hóa đơn, ngày xuất, thông tin người bán, thông tin người mua, danh sách Sản_Phẩm với số lượng và đơn giá, tổng tiền trước thuế, thuế VAT, và tổng thanh toán
3. THE Hệ_Thống SHALL tự động tính thuế VAT theo tỷ lệ được cấu hình
4. THE Hệ_Thống SHALL định dạng Hóa_Đơn_VAT theo chuẩn quy định
5. THE Hệ_Thống SHALL cho phép xuất Hóa_Đơn_VAT dưới dạng PDF

### Yêu Cầu 24: Báo Cáo Doanh Thu

**User Story:** Là một Quản_Trị_Viên, tôi muốn xem báo cáo doanh thu, để tôi có thể đánh giá hiệu quả kinh doanh.

#### Tiêu Chí Chấp Nhận

1. THE Trang_Quản_Trị SHALL hiển thị tổng doanh thu từ các Đơn_Hàng đã hoàn thành trong khoảng thời gian được chọn
2. THE Trang_Quản_Trị SHALL hiển thị doanh thu theo từng Danh_Mục sản phẩm
3. THE Trang_Quản_Trị SHALL hiển thị biểu đồ thể hiện xu hướng doanh thu theo thời gian
4. THE Trang_Quản_Trị SHALL cho phép Quản_Trị_Viên xuất báo cáo doanh thu dưới dạng PDF hoặc Excel

### Yêu Cầu 25: Báo Cáo Chi Phí

**User Story:** Là một Quản_Trị_Viên, tôi muốn xem báo cáo chi phí, để tôi có thể kiểm soát chi phí hoạt động.

#### Tiêu Chí Chấp Nhận

1. THE Trang_Quản_Trị SHALL hiển thị tổng Chi_Phí trong khoảng thời gian được chọn
2. THE Trang_Quản_Trị SHALL hiển thị chi phí theo từng loại (nhân công bốc hàng, tiền xe, chi phí khác)
3. THE Trang_Quản_Trị SHALL hiển thị biểu đồ thể hiện cơ cấu chi phí theo loại
4. THE Trang_Quản_Trị SHALL cho phép Quản_Trị_Viên xuất báo cáo chi phí dưới dạng PDF hoặc Excel

### Yêu Cầu 26: Báo Cáo Lợi Nhuận

**User Story:** Là một Quản_Trị_Viên, tôi muốn xem báo cáo lợi nhuận, để tôi có thể đánh giá hiệu quả tài chính.

#### Tiêu Chí Chấp Nhận

1. THE Trang_Quản_Trị SHALL tính lợi nhuận bằng công thức: Doanh thu trừ Chi_Phí trừ Giá vốn hàng bán
2. THE Trang_Quản_Trị SHALL hiển thị tổng lợi nhuận trong khoảng thời gian được chọn
3. THE Trang_Quản_Trị SHALL hiển thị biểu đồ thể hiện xu hướng lợi nhuận theo thời gian
4. THE Trang_Quản_Trị SHALL hiển thị tỷ suất lợi nhuận (lợi nhuận chia cho doanh thu)
5. THE Trang_Quản_Trị SHALL cho phép Quản_Trị_Viên xuất báo cáo lợi nhuận dưới dạng PDF hoặc Excel
