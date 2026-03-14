import { Schema, model, Document, Types } from 'mongoose';

// Interface TypeScript cho Expense document
export interface IExpense extends Document {
  type: 'labor' | 'transport' | 'other';  // Loại chi phí: nhân công, vận chuyển, khác
  amount: number;                          // Số tiền chi phí (VNĐ)
  date: Date;                              // Ngày phát sinh chi phí
  description: string;                     // Mô tả chi tiết khoản chi phí
  relatedTransaction?: Types.ObjectId;     // Giao dịch nhập/xuất kho liên quan (nếu có)
  relatedOrder?: Types.ObjectId;           // Đơn hàng liên quan (nếu có)
  createdBy: Types.ObjectId;              // Người ghi nhận chi phí (User)
  createdAt: Date;
  updatedAt: Date;
}

const ExpenseSchema = new Schema<IExpense>(
  {
    // Loại chi phí: nhân công (labor), vận chuyển (transport), khác (other)
    type: {
      type: String,
      enum: ['labor', 'transport', 'other'],
      required: [true, 'Loại chi phí là bắt buộc'],
    },

    // Số tiền chi phí - bắt buộc, phải lớn hơn 0
    amount: {
      type: Number,
      required: [true, 'Số tiền chi phí là bắt buộc'],
      min: [1, 'Số tiền chi phí phải lớn hơn 0'],
    },

    // Ngày phát sinh chi phí
    date: {
      type: Date,
      required: [true, 'Ngày phát sinh chi phí là bắt buộc'],
    },

    // Mô tả chi tiết khoản chi phí
    description: {
      type: String,
      required: [true, 'Mô tả chi phí là bắt buộc'],
      trim: true,
    },

    // Giao dịch nhập/xuất kho liên quan (không bắt buộc)
    relatedTransaction: {
      type: Schema.Types.ObjectId,
      ref: 'Transaction',
    },

    // Đơn hàng liên quan (không bắt buộc)
    relatedOrder: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
    },

    // Người ghi nhận chi phí
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Người tạo chi phí là bắt buộc'],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes để tăng tốc độ truy vấn và lọc báo cáo
ExpenseSchema.index({ type: 1 });
ExpenseSchema.index({ date: 1 });

export const Expense = model<IExpense>('Expense', ExpenseSchema);
