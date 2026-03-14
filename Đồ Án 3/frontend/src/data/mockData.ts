import type { Category, Product, Order } from '../types';
import type { Supplier, Expense, Transaction } from '../types/admin';

export const mockCategories: Category[] = [
  { _id: 'cat1', name: 'Giấy in', description: 'Các loại giấy in văn phòng', slug: 'giay-in', isActive: true },
  { _id: 'cat2', name: 'Giấy ảnh', description: 'Giấy in ảnh chất lượng cao', slug: 'giay-anh', isActive: true },
  { _id: 'cat3', name: 'Giấy bìa', description: 'Giấy bìa cứng các loại', slug: 'giay-bia', isActive: true },
  { _id: 'cat4', name: 'Vải vụn', description: 'Vải vụn tái chế', slug: 'vai-vun', isActive: true },
  { _id: 'cat5', name: 'Lõi ống', description: 'Lõi ống giấy các kích thước', slug: 'loi-ong', isActive: true },
];

export const mockProducts: Product[] = [
  {
    _id: 'p1', name: 'Giấy A4 80gsm', description: 'Giấy in A4 định lượng 80gsm, 500 tờ/ream',
    category: mockCategories[0], unit: 'ream', price: 85000, costPrice: 65000,
    weight: 2.5, images: [], currentStock: 250, minStockLevel: 50, isActive: true,
  },
  {
    _id: 'p2', name: 'Giấy A3 80gsm', description: 'Giấy in A3 định lượng 80gsm, 250 tờ/ream',
    category: mockCategories[0], unit: 'ream', price: 145000, costPrice: 110000,
    weight: 2.5, images: [], currentStock: 80, minStockLevel: 30, isActive: true,
  },
  {
    _id: 'p3', name: 'Giấy ảnh bóng A4', description: 'Giấy in ảnh bóng 200gsm, 20 tờ/gói',
    category: mockCategories[1], unit: 'gói', price: 55000, costPrice: 38000,
    weight: 0.5, images: [], currentStock: 15, minStockLevel: 20, isActive: true,
  },
  {
    _id: 'p4', name: 'Giấy bìa màu A4', description: 'Giấy bìa màu 230gsm, 100 tờ/gói',
    category: mockCategories[2], unit: 'gói', price: 75000, costPrice: 55000,
    weight: 1.2, images: [], currentStock: 120, minStockLevel: 25, isActive: true,
  },
  {
    _id: 'p5', name: 'Vải vụn cotton', description: 'Vải vụn cotton tái chế, đóng gói 10kg',
    category: mockCategories[3], unit: 'kg', price: 25000, costPrice: 15000,
    weight: 10, images: [], currentStock: 500, minStockLevel: 100, isActive: true,
  },
  {
    _id: 'p6', name: 'Lõi ống 3 inch', description: 'Lõi ống giấy đường kính 3 inch, dài 30cm',
    category: mockCategories[4], unit: 'cái', price: 8000, costPrice: 5000,
    weight: 0.1, images: [], currentStock: 8, minStockLevel: 50, isActive: true,
  },
  {
    _id: 'p7', name: 'Giấy A4 70gsm', description: 'Giấy in A4 định lượng 70gsm, 500 tờ/ream',
    category: mockCategories[0], unit: 'ream', price: 72000, costPrice: 55000,
    weight: 2.2, images: [], currentStock: 180, minStockLevel: 50, isActive: true,
  },
  {
    _id: 'p8', name: 'Giấy ảnh mờ A4', description: 'Giấy in ảnh mờ 180gsm, 20 tờ/gói',
    category: mockCategories[1], unit: 'gói', price: 48000, costPrice: 33000,
    weight: 0.4, images: [], currentStock: 45, minStockLevel: 15, isActive: true,
  },
];

export const mockSuppliers: Supplier[] = [
  {
    _id: 's1', name: 'Công ty TNHH Giấy Việt', phone: '0901234567',
    email: 'contact@giayviet.vn', address: '123 Nguyễn Văn Linh, Q.7, TP.HCM',
    notes: 'Nhà cung cấp chính giấy in', createdAt: '2024-01-10T08:00:00Z',
  },
  {
    _id: 's2', name: 'Xưởng Giấy Phú Mỹ', phone: '0912345678',
    email: 'phumy@gmail.com', address: '456 Lê Văn Việt, Q.9, TP.HCM',
    notes: 'Cung cấp giấy bìa và lõi ống', createdAt: '2024-01-15T08:00:00Z',
  },
  {
    _id: 's3', name: 'Vải Vụn Miền Nam', phone: '0923456789',
    email: 'vaivun@miennam.vn', address: '789 Quốc lộ 1A, Bình Dương',
    notes: 'Chuyên cung cấp vải vụn tái chế', createdAt: '2024-02-01T08:00:00Z',
  },
];

export const mockExpenses: Expense[] = [
  { _id: 'e1', type: 'labor', amount: 500000, date: '2024-12-01', description: 'Bốc hàng nhập kho lô giấy A4', createdAt: '2024-12-01T09:00:00Z' },
  { _id: 'e2', type: 'transport', amount: 350000, date: '2024-12-03', description: 'Xe tải giao hàng Q.7', createdAt: '2024-12-03T10:00:00Z' },
  { _id: 'e3', type: 'other', amount: 120000, date: '2024-12-05', description: 'Mua dây buộc và bao bì', createdAt: '2024-12-05T11:00:00Z' },
  { _id: 'e4', type: 'labor', amount: 450000, date: '2024-12-08', description: 'Bốc hàng xuất kho đơn lớn', createdAt: '2024-12-08T09:00:00Z' },
  { _id: 'e5', type: 'transport', amount: 280000, date: '2024-12-10', description: 'Xe máy giao hàng nội thành', createdAt: '2024-12-10T14:00:00Z' },
  { _id: 'e6', type: 'other', amount: 200000, date: '2024-12-12', description: 'Sửa chữa kệ kho', createdAt: '2024-12-12T08:00:00Z' },
];

export const mockTransactions: Transaction[] = [
  {
    _id: 't1', type: 'import', product: 'p1', productName: 'Giấy A4 80gsm',
    quantity: 100, unit: 'ream', unitPrice: 65000, totalPrice: 6500000,
    supplier: 's1', supplierName: 'Công ty TNHH Giấy Việt',
    date: '2024-12-01', notes: 'Nhập lô hàng tháng 12', createdAt: '2024-12-01T08:00:00Z',
  },
  {
    _id: 't2', type: 'export', product: 'p1', productName: 'Giấy A4 80gsm',
    quantity: 30, unit: 'ream', unitPrice: 85000, totalPrice: 2550000,
    customer: 'Công ty ABC', date: '2024-12-03', notes: 'Xuất theo đơn ORD001', createdAt: '2024-12-03T10:00:00Z',
  },
  {
    _id: 't3', type: 'import', product: 'p5', productName: 'Vải vụn cotton',
    quantity: 200, unit: 'kg', unitPrice: 15000, totalPrice: 3000000,
    supplier: 's3', supplierName: 'Vải Vụn Miền Nam',
    date: '2024-12-05', notes: 'Nhập vải vụn đợt 2', createdAt: '2024-12-05T09:00:00Z',
  },
  {
    _id: 't4', type: 'export', product: 'p4', productName: 'Giấy bìa màu A4',
    quantity: 20, unit: 'gói', unitPrice: 75000, totalPrice: 1500000,
    customer: 'Trường THPT Nguyễn Du', date: '2024-12-07', notes: '', createdAt: '2024-12-07T14:00:00Z',
  },
  {
    _id: 't5', type: 'import', product: 'p6', productName: 'Lõi ống 3 inch',
    quantity: 100, unit: 'cái', unitPrice: 5000, totalPrice: 500000,
    supplier: 's2', supplierName: 'Xưởng Giấy Phú Mỹ',
    date: '2024-12-10', notes: 'Nhập lõi ống bổ sung', createdAt: '2024-12-10T08:00:00Z',
  },
];

export const mockOrders: Order[] = [
  {
    _id: 'o1', orderCode: 'ORD-2412001',
    customer: { fullName: 'Nguyễn Văn An', phone: '0901111111', email: 'an@gmail.com', address: '123 Lê Lợi, Q.1, TP.HCM' },
    items: [
      { product: 'p1', productName: 'Giấy A4 80gsm', quantity: 10, unit: 'ream', unitPrice: 85000, totalPrice: 850000 },
      { product: 'p4', productName: 'Giấy bìa màu A4', quantity: 5, unit: 'gói', unitPrice: 75000, totalPrice: 375000 },
    ],
    subtotal: 1225000, shippingFee: 30000, totalAmount: 1255000,
    status: 'pending', paymentMethod: 'bank_transfer', paymentStatus: 'unpaid',
    notes: 'Giao giờ hành chính', statusHistory: [{ status: 'pending', changedAt: '2024-12-15T08:00:00Z', note: 'Đơn hàng mới' }],
    createdAt: '2024-12-15T08:00:00Z',
  },
  {
    _id: 'o2', orderCode: 'ORD-2412002',
    customer: { fullName: 'Trần Thị Bình', phone: '0902222222', email: 'binh@company.vn', address: '456 Nguyễn Huệ, Q.1, TP.HCM' },
    items: [
      { product: 'p2', productName: 'Giấy A3 80gsm', quantity: 20, unit: 'ream', unitPrice: 145000, totalPrice: 2900000 },
    ],
    subtotal: 2900000, shippingFee: 50000, totalAmount: 2950000,
    status: 'approved', paymentMethod: 'bank_transfer', paymentStatus: 'paid',
    notes: '', statusHistory: [
      { status: 'pending', changedAt: '2024-12-14T09:00:00Z', note: 'Đơn hàng mới' },
      { status: 'approved', changedAt: '2024-12-14T10:00:00Z', note: 'Đã duyệt' },
    ],
    createdAt: '2024-12-14T09:00:00Z',
  },
  {
    _id: 'o3', orderCode: 'ORD-2412003',
    customer: { fullName: 'Lê Văn Cường', phone: '0903333333', email: '', address: '789 Đinh Tiên Hoàng, Q.Bình Thạnh, TP.HCM' },
    items: [
      { product: 'p5', productName: 'Vải vụn cotton', quantity: 50, unit: 'kg', unitPrice: 25000, totalPrice: 1250000 },
    ],
    subtotal: 1250000, shippingFee: 80000, totalAmount: 1330000,
    status: 'shipping', paymentMethod: 'cod', paymentStatus: 'unpaid',
    notes: 'Gọi trước khi giao', statusHistory: [
      { status: 'pending', changedAt: '2024-12-13T08:00:00Z', note: '' },
      { status: 'approved', changedAt: '2024-12-13T09:00:00Z', note: '' },
      { status: 'shipping', changedAt: '2024-12-14T07:00:00Z', note: 'Đã giao cho shipper' },
    ],
    createdAt: '2024-12-13T08:00:00Z',
  },
  {
    _id: 'o4', orderCode: 'ORD-2412004',
    customer: { fullName: 'Phạm Thị Dung', phone: '0904444444', email: 'dung@school.edu.vn', address: '321 Cách Mạng Tháng 8, Q.3, TP.HCM' },
    items: [
      { product: 'p3', productName: 'Giấy ảnh bóng A4', quantity: 10, unit: 'gói', unitPrice: 55000, totalPrice: 550000 },
      { product: 'p8', productName: 'Giấy ảnh mờ A4', quantity: 5, unit: 'gói', unitPrice: 48000, totalPrice: 240000 },
    ],
    subtotal: 790000, shippingFee: 25000, totalAmount: 815000,
    status: 'completed', paymentMethod: 'bank_transfer', paymentStatus: 'paid',
    notes: '', statusHistory: [
      { status: 'pending', changedAt: '2024-12-10T08:00:00Z', note: '' },
      { status: 'approved', changedAt: '2024-12-10T09:00:00Z', note: '' },
      { status: 'shipping', changedAt: '2024-12-11T07:00:00Z', note: '' },
      { status: 'completed', changedAt: '2024-12-12T15:00:00Z', note: 'Giao thành công' },
    ],
    createdAt: '2024-12-10T08:00:00Z',
  },
  {
    _id: 'o5', orderCode: 'ORD-2412005',
    customer: { fullName: 'Hoàng Minh Đức', phone: '0905555555', email: '', address: '654 Võ Văn Tần, Q.3, TP.HCM' },
    items: [
      { product: 'p7', productName: 'Giấy A4 70gsm', quantity: 15, unit: 'ream', unitPrice: 72000, totalPrice: 1080000 },
    ],
    subtotal: 1080000, shippingFee: 30000, totalAmount: 1110000,
    status: 'cancelled', paymentMethod: 'cod', paymentStatus: 'unpaid',
    notes: 'Khách hủy do đổi ý', statusHistory: [
      { status: 'pending', changedAt: '2024-12-09T10:00:00Z', note: '' },
      { status: 'cancelled', changedAt: '2024-12-09T14:00:00Z', note: 'Khách yêu cầu hủy' },
    ],
    createdAt: '2024-12-09T10:00:00Z',
  },
];

export function formatVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('vi-VN');
}
