import { Schema, model, Document, Types } from 'mongoose';

// Interface TypeScript cho Product document
export interface IProduct extends Document {
  name: string;                          // Tên sản phẩm (VD: "Giấy A4 80gsm")
  description?: string;                  // Mô tả chi tiết sản phẩm
  category: Types.ObjectId;              // Tham chiếu đến danh mục (Category)
  unit: string;                          // Đơn vị tính: tấn, kg, ream, tờ, cuộn
  price: number;                         // Giá bán (VNĐ)
  costPrice?: number;                    // Giá vốn (VNĐ) - dùng tính lợi nhuận
  weight?: number;                       // Trọng lượng (kg) - dùng tính phí ship
  images: string[];                      // Mảng URL hình ảnh sản phẩm
  currentStock: number;                  // Số lượng tồn kho hiện tại
  minStockLevel: number;                 // Mức tồn kho tối thiểu (cảnh báo khi dưới mức này)
  isActive: boolean;                     // Trạng thái bán hàng (còn bán hay ngừng)
  specifications?: Map<string, unknown>; // Thông số kỹ thuật linh hoạt (VD: kích thước, độ dày)
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    // Tên sản phẩm - bắt buộc
    name: {
      type: String,
      required: [true, 'Tên sản phẩm là bắt buộc'],
      trim: true,
    },

    // Mô tả chi tiết - không bắt buộc
    description: {
      type: String,
      trim: true,
    },

    // Danh mục sản phẩm - bắt buộc, tham chiếu đến collection categories
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Danh mục sản phẩm là bắt buộc'],
    },

    // Đơn vị tính - bắt buộc (tấn, kg, ream, tờ, cuộn)
    unit: {
      type: String,
      required: [true, 'Đơn vị tính là bắt buộc'],
      trim: true,
    },

    // Giá bán - bắt buộc, không được âm
    price: {
      type: Number,
      required: [true, 'Giá bán là bắt buộc'],
      min: [0, 'Giá bán không được âm'],
    },

    // Giá vốn - không bắt buộc, không được âm
    costPrice: {
      type: Number,
      min: [0, 'Giá vốn không được âm'],
    },

    // Trọng lượng (kg) - dùng để tính phí vận chuyển
    weight: {
      type: Number,
      min: [0, 'Trọng lượng không được âm'],
    },

    // Danh sách URL hình ảnh sản phẩm
    images: {
      type: [String],
      default: [],
    },

    // Số lượng tồn kho hiện tại - tự động cập nhật khi có giao dịch nhập/xuất
    currentStock: {
      type: Number,
      default: 0,
      min: [0, 'Tồn kho không được âm'],
    },

    // Mức tồn kho tối thiểu - hệ thống cảnh báo khi tồn kho xuống dưới mức này
    minStockLevel: {
      type: Number,
      default: 10,
    },

    // Trạng thái bán hàng - mặc định là true (đang bán)
    isActive: {
      type: Boolean,
      default: true,
    },

    // Thông số kỹ thuật linh hoạt - mỗi sản phẩm có thể có thuộc tính khác nhau
    // VD: { "kích thước": "A4", "độ dày": "80gsm", "màu sắc": "trắng" }
    specifications: {
      type: Map,
      of: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

// Text index cho tìm kiếm full-text theo tên và mô tả sản phẩm
ProductSchema.index({ name: 'text', description: 'text' });

// Index thông thường để tăng tốc độ truy vấn
ProductSchema.index({ category: 1 });
ProductSchema.index({ currentStock: 1 });
ProductSchema.index({ isActive: 1 });

export const Product = model<IProduct>('Product', ProductSchema);
