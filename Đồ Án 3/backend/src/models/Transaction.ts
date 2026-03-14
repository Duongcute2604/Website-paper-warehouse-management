import { Schema, model, Document, Types } from 'mongoose';

// Interface cho từng dòng sản phẩm trong giao dịch
export interface ITransactionItem {
  product: Types.ObjectId;   // Tham chiếu đến sản phẩm
  productName: string;       // Tên sản phẩm (lưu lại để tránh mất dữ liệu khi xóa SP)
  quantity: number;          // Số lượng
  unit: string;              // Đơn vị tính
  unitPrice: number;         // Đơn giá
  totalPrice: number;        // Thành tiền (quantity * unitPrice)
}

// Interface TypeScript cho Transaction document
export interface ITransaction extends Document {
  type: 'inbound' | 'outbound';   // Loại giao dịch: nhập kho hoặc xuất kho
  transactionCode: string;         // Mã phiếu tự động (VD: IN-20240101-001)
  date: Date;                      // Ngày giao dịch
  items: ITransactionItem[];       // Danh sách sản phẩm trong giao dịch
  totalAmount: number;             // Tổng giá trị giao dịch
  supplier?: Types.ObjectId;       // Nhà cung cấp (chỉ dùng cho nhập kho)
  customer?: string;               // Tên khách hàng (chỉ dùng cho xuất kho)
  relatedOrder?: Types.ObjectId;   // Đơn hàng liên quan (xuất kho theo đơn hàng)
  notes?: string;                  // Ghi chú
  createdBy: Types.ObjectId;       // Người tạo phiếu (User)
  createdAt: Date;
  updatedAt: Date;
}

// Schema cho từng dòng sản phẩm trong giao dịch (embedded document)
const TransactionItemSchema = new Schema<ITransactionItem>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Sản phẩm là bắt buộc'],
    },
    productName: {
      type: String,
      required: [true, 'Tên sản phẩm là bắt buộc'],
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, 'Số lượng là bắt buộc'],
      min: [1, 'Số lượng phải lớn hơn 0'],
    },
    unit: {
      type: String,
      required: [true, 'Đơn vị tính là bắt buộc'],
      trim: true,
    },
    unitPrice: {
      type: Number,
      required: [true, 'Đơn giá là bắt buộc'],
      min: [0, 'Đơn giá không được âm'],
    },
    totalPrice: {
      type: Number,
      required: [true, 'Thành tiền là bắt buộc'],
      min: [0, 'Thành tiền không được âm'],
    },
  },
  { _id: false }
);

const TransactionSchema = new Schema<ITransaction>(
  {
    // Loại giao dịch: nhập kho (inbound) hoặc xuất kho (outbound)
    type: {
      type: String,
      enum: ['inbound', 'outbound'],
      required: [true, 'Loại giao dịch là bắt buộc'],
    },

    // Mã phiếu - tự động sinh theo format IN-YYYYMMDD-001 hoặc OUT-YYYYMMDD-001
    transactionCode: {
      type: String,
      required: [true, 'Mã phiếu là bắt buộc'],
      unique: true,
      trim: true,
    },

    // Ngày giao dịch
    date: {
      type: Date,
      required: [true, 'Ngày giao dịch là bắt buộc'],
    },

    // Danh sách sản phẩm trong giao dịch
    items: {
      type: [TransactionItemSchema],
      required: true,
      validate: {
        validator: (v: ITransactionItem[]) => v.length > 0,
        message: 'Giao dịch phải có ít nhất 1 sản phẩm',
      },
    },

    // Tổng giá trị giao dịch
    totalAmount: {
      type: Number,
      default: 0,
      min: [0, 'Tổng tiền không được âm'],
    },

    // Nhà cung cấp - chỉ dùng cho giao dịch nhập kho
    supplier: {
      type: Schema.Types.ObjectId,
      ref: 'Supplier',
    },

    // Tên khách hàng - chỉ dùng cho giao dịch xuất kho
    customer: {
      type: String,
      trim: true,
    },

    // Đơn hàng liên quan (khi xuất kho theo đơn hàng)
    relatedOrder: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
    },

    // Ghi chú nội bộ
    notes: {
      type: String,
      trim: true,
    },

    // Người tạo phiếu
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Người tạo phiếu là bắt buộc'],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes để tăng tốc độ truy vấn
TransactionSchema.index({ type: 1 });
TransactionSchema.index({ date: 1 });
TransactionSchema.index({ transactionCode: 1 }, { unique: true });
TransactionSchema.index({ supplier: 1 });

export const Transaction = model<ITransaction>('Transaction', TransactionSchema);
