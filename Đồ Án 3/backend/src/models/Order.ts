import { Schema, model, Document, Types } from 'mongoose';

// Interface cho thông tin khách hàng trong đơn hàng
export interface IOrderCustomer {
  fullName: string;   // Họ tên đầy đủ
  phone: string;      // Số điện thoại liên hệ
  email?: string;     // Email (không bắt buộc)
  address: string;    // Địa chỉ giao hàng
}

// Interface cho từng dòng sản phẩm trong đơn hàng
export interface IOrderItem {
  product: Types.ObjectId;   // Tham chiếu đến sản phẩm
  productName: string;       // Tên sản phẩm (lưu lại để tránh mất dữ liệu)
  quantity: number;          // Số lượng đặt
  unit: string;              // Đơn vị tính
  unitPrice: number;         // Đơn giá tại thời điểm đặt hàng
  totalPrice: number;        // Thành tiền (quantity * unitPrice)
}

// Interface cho lịch sử thay đổi trạng thái đơn hàng
export interface IStatusHistory {
  status: string;              // Trạng thái mới
  changedBy?: Types.ObjectId;  // Admin thực hiện thay đổi
  changedAt: Date;             // Thời điểm thay đổi
  note?: string;               // Ghi chú khi thay đổi trạng thái
}

// Interface TypeScript cho Order document
export interface IOrder extends Document {
  orderCode: string;                  // Mã đơn hàng tự động (VD: ORD-20240101-001)
  customer: IOrderCustomer;           // Thông tin khách hàng
  items: IOrderItem[];                // Danh sách sản phẩm đặt
  subtotal: number;                   // Tổng tiền hàng (chưa tính phí ship)
  shippingFee: number;                // Phí vận chuyển
  totalAmount: number;                // Tổng thanh toán (subtotal + shippingFee)
  status: 'pending' | 'approved' | 'shipping' | 'completed' | 'cancelled';
  paymentMethod: 'bank_transfer' | 'cod';  // Phương thức thanh toán
  paymentStatus: 'unpaid' | 'paid';        // Trạng thái thanh toán
  notes?: string;                     // Ghi chú của khách hàng
  adminNotes?: string;                // Ghi chú nội bộ của admin
  statusHistory: IStatusHistory[];    // Lịch sử thay đổi trạng thái
  approvedBy?: Types.ObjectId;        // Admin duyệt đơn hàng
  approvedAt?: Date;                  // Thời điểm duyệt đơn
  createdAt: Date;
  updatedAt: Date;
}

// Schema cho thông tin khách hàng (embedded document)
const OrderCustomerSchema = new Schema<IOrderCustomer>(
  {
    fullName: {
      type: String,
      required: [true, 'Họ tên khách hàng là bắt buộc'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Số điện thoại là bắt buộc'],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    address: {
      type: String,
      required: [true, 'Địa chỉ giao hàng là bắt buộc'],
      trim: true,
    },
  },
  { _id: false }
);

// Schema cho từng dòng sản phẩm trong đơn hàng (embedded document)
const OrderItemSchema = new Schema<IOrderItem>(
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

// Schema cho lịch sử thay đổi trạng thái (embedded document)
const StatusHistorySchema = new Schema<IStatusHistory>(
  {
    status: {
      type: String,
      required: [true, 'Trạng thái là bắt buộc'],
    },
    changedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    changedAt: {
      type: Date,
      default: Date.now,
    },
    note: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    // Mã đơn hàng - tự động sinh theo format ORD-YYYYMMDD-001
    orderCode: {
      type: String,
      required: [true, 'Mã đơn hàng là bắt buộc'],
      unique: true,
      trim: true,
    },

    // Thông tin khách hàng đặt hàng
    customer: {
      type: OrderCustomerSchema,
      required: [true, 'Thông tin khách hàng là bắt buộc'],
    },

    // Danh sách sản phẩm trong đơn hàng
    items: {
      type: [OrderItemSchema],
      required: true,
      validate: {
        validator: (v: IOrderItem[]) => v.length > 0,
        message: 'Đơn hàng phải có ít nhất 1 sản phẩm',
      },
    },

    // Tổng tiền hàng (chưa tính phí ship)
    subtotal: {
      type: Number,
      default: 0,
      min: [0, 'Tổng tiền hàng không được âm'],
    },

    // Phí vận chuyển
    shippingFee: {
      type: Number,
      default: 0,
      min: [0, 'Phí vận chuyển không được âm'],
    },

    // Tổng thanh toán = subtotal + shippingFee
    totalAmount: {
      type: Number,
      default: 0,
      min: [0, 'Tổng thanh toán không được âm'],
    },

    // Trạng thái đơn hàng - mặc định là chờ xử lý
    status: {
      type: String,
      enum: ['pending', 'approved', 'shipping', 'completed', 'cancelled'],
      default: 'pending',
    },

    // Phương thức thanh toán - mặc định là chuyển khoản
    paymentMethod: {
      type: String,
      enum: ['bank_transfer', 'cod'],
      default: 'bank_transfer',
    },

    // Trạng thái thanh toán - mặc định là chưa thanh toán
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'paid'],
      default: 'unpaid',
    },

    // Ghi chú của khách hàng
    notes: {
      type: String,
      trim: true,
    },

    // Ghi chú nội bộ của admin
    adminNotes: {
      type: String,
      trim: true,
    },

    // Lịch sử thay đổi trạng thái đơn hàng
    statusHistory: {
      type: [StatusHistorySchema],
      default: [],
    },

    // Admin duyệt đơn hàng
    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },

    // Thời điểm duyệt đơn hàng
    approvedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes để tăng tốc độ truy vấn
OrderSchema.index({ orderCode: 1 }, { unique: true });
OrderSchema.index({ 'customer.phone': 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ createdAt: 1 });

export const Order = model<IOrder>('Order', OrderSchema);
