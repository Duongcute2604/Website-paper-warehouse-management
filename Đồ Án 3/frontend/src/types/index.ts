export interface Category {
  _id: string;
  name: string;
  description: string;
  slug: string;
  isActive: boolean;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  category: Category;
  unit: string;
  price: number;
  costPrice: number;
  weight: number;
  images: string[];
  currentStock: number;
  minStockLevel: number;
  isActive: boolean;
  specifications?: Record<string, string | number>;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  product: string;
  productName: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
}

export interface StatusHistory {
  status: string;
  changedAt: string;
  note: string;
}

export interface Order {
  _id: string;
  orderCode: string;
  customer: {
    fullName: string;
    phone: string;
    email?: string;
    address: string;
  };
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
  status: 'pending' | 'approved' | 'shipping' | 'completed' | 'cancelled';
  paymentMethod: 'bank_transfer' | 'cod';
  paymentStatus: 'unpaid' | 'paid';
  notes: string;
  statusHistory: StatusHistory[];
  createdAt: string;
}
