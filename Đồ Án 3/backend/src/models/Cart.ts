import { Schema, model, Document, Types } from 'mongoose';

// Interface cho từng sản phẩm trong giỏ hàng
export interface ICartItem {
  product: Types.ObjectId;   // Tham chiếu đến sản phẩm
  quantity: number;          // Số lượng muốn mua
}

// Interface TypeScript cho Cart document
export interface ICart extends Document {
  sessionId: string;         // Session ID của khách hàng (cookie-based)
  items: ICartItem[];        // Danh sách sản phẩm trong giỏ
  expiresAt: Date;           // Thời điểm hết hạn (tự động xóa sau 7 ngày)
  createdAt: Date;
  updatedAt: Date;
}

// Schema cho từng sản phẩm trong giỏ hàng (embedded document)
const CartItemSchema = new Schema<ICartItem>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Sản phẩm là bắt buộc'],
    },
    quantity: {
      type: Number,
      required: [true, 'Số lượng là bắt buộc'],
      min: [1, 'Số lượng phải lớn hơn 0'],
    },
  },
  { _id: false }
);

const CartSchema = new Schema<ICart>(
  {
    // Session ID - định danh duy nhất cho giỏ hàng của mỗi khách
    sessionId: {
      type: String,
      required: [true, 'Session ID là bắt buộc'],
      unique: true,
      trim: true,
    },

    // Danh sách sản phẩm trong giỏ hàng
    items: {
      type: [CartItemSchema],
      default: [],
    },

    // Thời điểm hết hạn - mặc định 7 ngày từ lúc tạo
    // MongoDB TTL index sẽ tự động xóa document khi quá thời hạn này
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  },
  {
    timestamps: true,
  }
);

// Index unique cho sessionId để tìm kiếm nhanh
CartSchema.index({ sessionId: 1 }, { unique: true });

// TTL index - MongoDB tự động xóa giỏ hàng sau khi expiresAt đã qua
// Giúp dọn dẹp dữ liệu cũ mà không cần cron job
CartSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Cart = model<ICart>('Cart', CartSchema);
