import { Types } from 'mongoose';
import { Category, ICategory } from '../models/Category';
import { Product } from '../models/Product';
import {
  NotFoundError,
  ValidationError,
  BusinessLogicError,
} from '../middleware/error.middleware';

// Hàm tạo slug từ tên tiếng Việt (dùng khi tạo/cập nhật danh mục)
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

/**
 * Lấy tất cả danh mục, sắp xếp theo tên
 */
export async function getAll(): Promise<ICategory[]> {
  return Category.find().sort({ name: 1 });
}

/**
 * Lấy chi tiết 1 danh mục theo ID
 */
export async function getById(id: string): Promise<ICategory> {
  // Kiểm tra ID hợp lệ
  if (!Types.ObjectId.isValid(id)) {
    throw new NotFoundError('Danh mục không tồn tại');
  }

  const category = await Category.findById(id);

  if (!category) {
    throw new NotFoundError('Danh mục không tồn tại');
  }

  return category;
}

/**
 * Tạo danh mục mới, tự động tạo slug từ tên
 */
export async function create(data: Partial<ICategory>): Promise<ICategory> {
  // Validate tên danh mục bắt buộc
  if (!data.name || data.name.trim() === '') {
    throw new ValidationError('Tên danh mục là bắt buộc');
  }

  // Tự động tạo slug từ tên nếu chưa có
  if (!data.slug) {
    data.slug = generateSlug(data.name.trim());
  }

  // Kiểm tra tên danh mục đã tồn tại chưa
  const existingByName = await Category.findOne({ name: data.name.trim() });
  if (existingByName) {
    throw new ValidationError('Tên danh mục đã tồn tại');
  }

  // Kiểm tra slug đã tồn tại chưa (xử lý trường hợp slug trùng)
  const existingBySlug = await Category.findOne({ slug: data.slug });
  if (existingBySlug) {
    // Thêm timestamp vào slug để tránh trùng
    data.slug = `${data.slug}-${Date.now()}`;
  }

  const category = await Category.create(data);
  return category;
}

/**
 * Cập nhật thông tin danh mục theo ID
 * Nếu tên thay đổi, tự động cập nhật slug
 */
export async function update(id: string, data: Partial<ICategory>): Promise<ICategory> {
  // Kiểm tra ID hợp lệ
  if (!Types.ObjectId.isValid(id)) {
    throw new NotFoundError('Danh mục không tồn tại');
  }

  // Nếu cập nhật tên, tự động tạo slug mới
  if (data.name && data.name.trim() !== '') {
    // Kiểm tra tên mới có trùng với danh mục khác không
    const existingByName = await Category.findOne({
      name: data.name.trim(),
      _id: { $ne: id }, // Loại trừ danh mục hiện tại
    });

    if (existingByName) {
      throw new ValidationError('Tên danh mục đã tồn tại');
    }

    // Tự động cập nhật slug khi tên thay đổi
    if (!data.slug) {
      data.slug = generateSlug(data.name.trim());
    }
  }

  const category = await Category.findByIdAndUpdate(
    id,
    { $set: data },
    { new: true, runValidators: true } // Trả về document mới sau khi cập nhật
  );

  if (!category) {
    throw new NotFoundError('Danh mục không tồn tại');
  }

  return category;
}

/**
 * Xóa danh mục theo ID
 * Kiểm tra không có sản phẩm nào thuộc danh mục này trước khi xóa
 * Nếu có sản phẩm, ném BusinessLogicError để bảo vệ tính toàn vẹn dữ liệu
 */
export async function deleteCategory(id: string): Promise<void> {
  // Kiểm tra ID hợp lệ
  if (!Types.ObjectId.isValid(id)) {
    throw new NotFoundError('Danh mục không tồn tại');
  }

  // Kiểm tra danh mục có tồn tại không
  const category = await Category.findById(id);
  if (!category) {
    throw new NotFoundError('Danh mục không tồn tại');
  }

  // Kiểm tra có sản phẩm nào thuộc danh mục này không
  const productCount = await Product.countDocuments({ category: id });

  if (productCount > 0) {
    throw new BusinessLogicError(
      `Không thể xóa danh mục "${category.name}" vì có ${productCount} sản phẩm đang thuộc danh mục này. Vui lòng chuyển hoặc xóa các sản phẩm trước.`
    );
  }

  // Xóa danh mục khỏi database
  await Category.findByIdAndDelete(id);
}
