import { Schema, model, Document } from 'mongoose';

// Interface cho thông tin tài khoản ngân hàng
export interface IBankAccount {
  bankName?: string;       // Tên ngân hàng (VD: "Vietcombank", "BIDV")
  accountNumber?: string;  // Số tài khoản
  accountHolder?: string;  // Tên chủ tài khoản
}

// Interface TypeScript cho Supplier document
export interface ISupplier extends Document {
  name: string;              // Tên nhà cung cấp (VD: "Công ty TNHH Giấy ABC")
  contactPerson?: string;    // Tên người liên hệ trực tiếp
  phone?: string;            // Số điện thoại liên hệ
  email?: string;            // Địa chỉ email
  address?: string;          // Địa chỉ trụ sở / kho hàng
  taxCode?: string;          // Mã số thuế doanh nghiệp
  bankAccount?: IBankAccount; // Thông tin tài khoản ngân hàng để thanh toán
  notes?: string;            // Ghi chú thêm về nhà cung cấp
  isActive: boolean;         // Trạng thái hợp tác (đang hợp tác hay đã ngừng)
  createdAt: Date;
  updatedAt: Date;
}

// Schema cho thông tin tài khoản ngân hàng (embedded document)
const BankAccountSchema = new Schema<IBankAccount>(
  {
    // Tên ngân hàng
    bankName: {
      type: String,
      trim: true,
    },

    // Số tài khoản ngân hàng
    accountNumber: {
      type: String,
      trim: true,
    },

    // Tên chủ tài khoản (phải khớp với tên đăng ký ngân hàng)
    accountHolder: {
      type: String,
      trim: true,
    },
  },
  { _id: false } // Không tạo _id riêng cho embedded document
);

const SupplierSchema = new Schema<ISupplier>(
  {
    // Tên nhà cung cấp - bắt buộc
    name: {
      type: String,
      required: [true, 'Tên nhà cung cấp là bắt buộc'],
      trim: true,
    },

    // Người liên hệ trực tiếp tại nhà cung cấp
    contactPerson: {
      type: String,
      trim: true,
    },

    // Số điện thoại liên hệ
    phone: {
      type: String,
      trim: true,
    },

    // Email liên hệ
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },

    // Địa chỉ nhà cung cấp
    address: {
      type: String,
      trim: true,
    },

    // Mã số thuế - dùng cho xuất hóa đơn VAT
    taxCode: {
      type: String,
      trim: true,
    },

    // Thông tin tài khoản ngân hàng để chuyển khoản thanh toán
    bankAccount: {
      type: BankAccountSchema,
    },

    // Ghi chú nội bộ về nhà cung cấp
    notes: {
      type: String,
      trim: true,
    },

    // Trạng thái hợp tác - mặc định là true (đang hợp tác)
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index để tăng tốc độ tìm kiếm theo tên và số điện thoại
SupplierSchema.index({ name: 1 });
SupplierSchema.index({ phone: 1 });

export const Supplier = model<ISupplier>('Supplier', SupplierSchema);
