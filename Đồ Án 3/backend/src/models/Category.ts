import { Schema, model, Document } from 'mongoose';

// Interface TypeScript cho Category document
export interface ICategory extends Document {
  name: string;         // Tên danh mục (VD: "Giấy in", "Vải vụn", "Lõi ống")
  description?: string; // Mô tả chi tiết về danh mục
  slug: string;         // Đường dẫn thân thiện URL (VD: "giay-in"), tự động tạo từ name
  isActive: boolean;    // Trạng thái hiển thị (ẩn/hiện)
  createdAt: Date;
  updatedAt: Date;
}

// Hàm tạo slug từ tên tiếng Việt
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Bỏ dấu tiếng Việt
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

const CategorySchema = new Schema<ICategory>(
  {
    // Tên danh mục - bắt buộc, duy nhất
    name: {
      type: String,
      required: [true, 'Tên danh mục là bắt buộc'],
      unique: true,
      trim: true,
    },

    // Mô tả danh mục - không bắt buộc
    description: {
      type: String,
      trim: true,
    },

    // Slug URL - tự động tạo từ name nếu không cung cấp
    slug: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
    },

    // Trạng thái hiển thị - mặc định là true
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Tự động tạo slug từ name trước khi lưu
CategorySchema.pre('save', function (next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = generateSlug(this.name);
  }
  next();
});

// Index để tăng tốc độ truy vấn
CategorySchema.index({ slug: 1 });
CategorySchema.index({ name: 1 });

export const Category = model<ICategory>('Category', CategorySchema);
