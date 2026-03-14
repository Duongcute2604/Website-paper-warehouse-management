import { Schema, model, Document } from 'mongoose';

// Interface TypeScript cho User document
export interface IUser extends Document {
  username: string;       // Tên đăng nhập (duy nhất)
  password: string;       // Mật khẩu đã hash bằng bcrypt
  fullName: string;       // Họ tên đầy đủ
  email: string;          // Địa chỉ email (duy nhất)
  role: 'admin' | 'staff'; // Vai trò: quản trị viên hoặc nhân viên
  isActive: boolean;      // Trạng thái tài khoản (đang hoạt động hay bị khóa)
  lastLogin?: Date;       // Thời điểm đăng nhập lần cuối
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    // Tên đăng nhập - bắt buộc, duy nhất, không phân biệt hoa thường
    username: {
      type: String,
      required: [true, 'Tên đăng nhập là bắt buộc'],
      unique: true,
      trim: true,
      lowercase: true,
    },

    // Mật khẩu - bắt buộc, sẽ được hash trước khi lưu
    password: {
      type: String,
      required: [true, 'Mật khẩu là bắt buộc'],
    },

    // Họ tên đầy đủ của người dùng
    fullName: {
      type: String,
      required: [true, 'Họ tên là bắt buộc'],
      trim: true,
    },

    // Email - duy nhất, không bắt buộc nhưng nếu có phải hợp lệ
    email: {
      type: String,
      unique: true,
      sparse: true, // Cho phép nhiều document có email = null/undefined
      trim: true,
      lowercase: true,
    },

    // Vai trò: admin có toàn quyền, staff có quyền hạn chế
    role: {
      type: String,
      enum: ['admin', 'staff'],
      default: 'staff',
    },

    // Trạng thái hoạt động - mặc định là true (đang hoạt động)
    isActive: {
      type: Boolean,
      default: true,
    },

    // Thời điểm đăng nhập lần cuối - cập nhật mỗi khi đăng nhập thành công
    lastLogin: {
      type: Date,
    },
  },
  {
    // Tự động thêm createdAt và updatedAt
    timestamps: true,
  }
);

// Index để tăng tốc độ truy vấn theo username và email
UserSchema.index({ username: 1 });
UserSchema.index({ email: 1 });

export const User = model<IUser>('User', UserSchema);
