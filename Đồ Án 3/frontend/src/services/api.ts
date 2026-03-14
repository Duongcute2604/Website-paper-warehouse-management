import axios from 'axios';
import type { Product, Category, Order } from '../types';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// ─── Mock Data ────────────────────────────────────────────────────────────────

export const mockCategories: Category[] = [
  { _id: 'cat1', name: 'Giấy', description: 'Các loại giấy in, giấy ảnh, giấy bìa', slug: 'giay', isActive: true },
  { _id: 'cat2', name: 'Vải Vụn', description: 'Vải vụn các loại', slug: 'vai-vun', isActive: true },
  { _id: 'cat3', name: 'Lõi Ống', description: 'Lõi ống giấy các kích thước', slug: 'loi-ong', isActive: true },
];

export const mockProducts: Product[] = [
  {
    _id: 'p1',
    name: 'Giấy In A4 80gsm',
    description: 'Giấy in văn phòng A4 độ dày 80gsm, trắng sáng, phù hợp cho máy in laser và inkjet.',
    category: mockCategories[0],
    unit: 'ream',
    price: 85000,
    costPrice: 65000,
    weight: 2.5,
    images: [],
    currentStock: 150,
    minStockLevel: 20,
    isActive: true,
    specifications: { 'Kích thước': 'A4 (210x297mm)', 'Độ dày': '80gsm', 'Số tờ/ream': 500 },
  },
  {
    _id: 'p2',
    name: 'Giấy Bìa Cứng 300gsm',
    description: 'Giấy bìa cứng 300gsm màu trắng, dùng để đóng bìa sách, làm hộp carton.',
    category: mockCategories[0],
    unit: 'tờ',
    price: 5500,
    costPrice: 4000,
    weight: 0.3,
    images: [],
    currentStock: 0,
    minStockLevel: 50,
    isActive: true,
    specifications: { 'Kích thước': 'A3 (297x420mm)', 'Độ dày': '300gsm' },
  },
  {
    _id: 'p3',
    name: 'Vải Vụn Cotton',
    description: 'Vải vụn cotton tái chế, sạch, phù hợp làm giẻ lau công nghiệp.',
    category: mockCategories[1],
    unit: 'kg',
    price: 15000,
    costPrice: 10000,
    weight: 1,
    images: [],
    currentStock: 500,
    minStockLevel: 100,
    isActive: true,
    specifications: { 'Chất liệu': 'Cotton 100%', 'Màu sắc': 'Hỗn hợp' },
  },
  {
    _id: 'p4',
    name: 'Vải Vụn Polyester',
    description: 'Vải vụn polyester tổng hợp, bền, không thấm nước.',
    category: mockCategories[1],
    unit: 'kg',
    price: 12000,
    costPrice: 8000,
    weight: 1,
    images: [],
    currentStock: 320,
    minStockLevel: 80,
    isActive: true,
    specifications: { 'Chất liệu': 'Polyester', 'Màu sắc': 'Hỗn hợp' },
  },
  {
    _id: 'p5',
    name: 'Lõi Ống Giấy 3 inch',
    description: 'Lõi ống giấy đường kính 3 inch, dài 30cm, dùng để cuộn giấy, vải.',
    category: mockCategories[2],
    unit: 'cái',
    price: 8000,
    costPrice: 5500,
    weight: 0.15,
    images: [],
    currentStock: 200,
    minStockLevel: 30,
    isActive: true,
    specifications: { 'Đường kính': '3 inch (76mm)', 'Chiều dài': '30cm', 'Độ dày thành': '3mm' },
  },
  {
    _id: 'p6',
    name: 'Lõi Ống Giấy 6 inch',
    description: 'Lõi ống giấy đường kính 6 inch, dài 50cm, chịu tải trọng cao.',
    category: mockCategories[2],
    unit: 'cái',
    price: 18000,
    costPrice: 13000,
    weight: 0.4,
    images: [],
    currentStock: 85,
    minStockLevel: 20,
    isActive: true,
    specifications: { 'Đường kính': '6 inch (152mm)', 'Chiều dài': '50cm', 'Độ dày thành': '5mm' },
  },
];

export const mockOrders: Order[] = [
  {
    _id: 'ord1',
    orderCode: 'ORD-20240115-001',
    customer: {
      fullName: 'Nguyễn Văn An',
      phone: '0901234567',
      address: '123 Nguyễn Huệ, Quận 1, TP.HCM',
    },
    items: [
      { product: 'p1', productName: 'Giấy In A4 80gsm', quantity: 10, unit: 'ream', unitPrice: 85000, totalPrice: 850000 },
      { product: 'p5', productName: 'Lõi Ống Giấy 3 inch', quantity: 20, unit: 'cái', unitPrice: 8000, totalPrice: 160000 },
    ],
    subtotal: 1010000,
    shippingFee: 30000,
    totalAmount: 1040000,
    status: 'shipping',
    paymentMethod: 'bank_transfer',
    paymentStatus: 'paid',
    notes: 'Giao giờ hành chính',
    statusHistory: [
      { status: 'pending', changedAt: '2024-01-15T08:00:00Z', note: 'Đơn hàng mới' },
      { status: 'approved', changedAt: '2024-01-15T09:30:00Z', note: 'Đã duyệt đơn' },
      { status: 'shipping', changedAt: '2024-01-15T14:00:00Z', note: 'Đang giao hàng' },
    ],
    createdAt: '2024-01-15T08:00:00Z',
  },
  {
    _id: 'ord2',
    orderCode: 'ORD-20240116-002',
    customer: {
      fullName: 'Trần Thị Bình',
      phone: '0912345678',
      address: '456 Lê Lợi, Quận 3, TP.HCM',
    },
    items: [
      { product: 'p3', productName: 'Vải Vụn Cotton', quantity: 50, unit: 'kg', unitPrice: 15000, totalPrice: 750000 },
    ],
    subtotal: 750000,
    shippingFee: 50000,
    totalAmount: 800000,
    status: 'pending',
    paymentMethod: 'bank_transfer',
    paymentStatus: 'unpaid',
    notes: '',
    statusHistory: [
      { status: 'pending', changedAt: '2024-01-16T10:00:00Z', note: 'Đơn hàng mới' },
    ],
    createdAt: '2024-01-16T10:00:00Z',
  },
];

// ─── Mock API functions ───────────────────────────────────────────────────────

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const mockApi = {
  getProducts: async (params?: { search?: string; categoryId?: string; page?: number; limit?: number }) => {
    await delay(300);
    let products = [...mockProducts];
    if (params?.search) {
      const q = params.search.toLowerCase();
      products = products.filter(
        (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
    }
    if (params?.categoryId && params.categoryId !== 'all') {
      products = products.filter((p) => p.category._id === params.categoryId);
    }
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 12;
    const total = products.length;
    const data = products.slice((page - 1) * limit, page * limit);
    return { data, total, page, totalPages: Math.ceil(total / limit) };
  },

  getProduct: async (id: string) => {
    await delay(200);
    const product = mockProducts.find((p) => p._id === id);
    if (!product) throw new Error('Không tìm thấy sản phẩm');
    return product;
  },

  getCategories: async () => {
    await delay(200);
    return mockCategories;
  },

  trackOrder: async (orderCode: string, phone: string) => {
    await delay(500);
    const order = mockOrders.find(
      (o) => o.orderCode === orderCode && o.customer.phone === phone
    );
    if (!order) throw new Error('Không tìm thấy đơn hàng. Vui lòng kiểm tra lại mã đơn hàng và số điện thoại.');
    return order;
  },

  createOrder: async (data: Omit<Order, '_id' | 'orderCode' | 'status' | 'paymentStatus' | 'statusHistory' | 'createdAt'>) => {
    await delay(800);
    const orderCode = `ORD-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(Math.floor(Math.random() * 999) + 1).padStart(3, '0')}`;
    const order: Order = {
      ...data,
      _id: `ord_${Date.now()}`,
      orderCode,
      status: 'pending',
      paymentStatus: 'unpaid',
      statusHistory: [{ status: 'pending', changedAt: new Date().toISOString(), note: 'Đơn hàng mới' }],
      createdAt: new Date().toISOString(),
    };
    return order;
  },
};
