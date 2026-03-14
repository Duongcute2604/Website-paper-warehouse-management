export interface Supplier {
  _id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  notes: string;
  createdAt: string;
}

export interface Expense {
  _id: string;
  type: 'labor' | 'transport' | 'other';
  amount: number;
  date: string;
  description: string;
  createdAt: string;
}

export interface Transaction {
  _id: string;
  type: 'import' | 'export';
  product: string;
  productName: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  supplier?: string;
  supplierName?: string;
  customer?: string;
  date: string;
  notes: string;
  createdAt: string;
}

export const EXPENSE_TYPE_LABELS: Record<Expense['type'], string> = {
  labor: 'Nhân công bốc hàng',
  transport: 'Tiền xe',
  other: 'Chi phí khác',
};
