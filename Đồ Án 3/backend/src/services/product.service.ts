import { Types } from 'mongoose';
import { Product, IProduct } from '../models/Product';
import { NotFoundError, ValidationError } from '../middleware/error.middleware';

// Interface cho bộ lọc danh sách sản phẩm
export interface ProductFilters {
  category?: string;   // Lọc theo ID danh mục
  isActive?: boolean;  // Lọc theo trạng thái
}

// Interface cho tùy chọn phân trang và sắp xếp
export interface PaginationOptions {
  page?: number;   // Trang hiện tại (bắt đầu từ 1)
  limit?: number;  // Số lượng mỗi trang
  sortBy?: string; // Trường sắp xếp (VD: "name", "price", "createdAt")
  sortOrder?: 'asc' | 'desc'; // Chiều sắp xếp
}

// Interface kết quả phân trang
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Lấy danh sách sản phẩm với bộ lọc, phân trang và sắp xếp
 */
export async function getAll(
  filters: ProductFilters = {},
  pagination: PaginationOptions = {}
): Promise<PaginatedResult<IProduct>> {
  const { category, isActive } = filters;
  const { page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc' } = pagination;

  // Xây dựng query filter
  const query: Record<string, unknown> = {};

  if (category) {
    // Kiểm tra category ID hợp lệ
    if (!Types.ObjectId.isValid(category)) {
      throw new ValidationError('ID danh mục không hợp lệ');
    }
    query.category = new Types.ObjectId(category);
  }

  if (isActive !== undefined) {
    query.isActive = isActive;
  }

  // Tính offset cho phân trang
  const skip = (page - 1) * limit;

  // Xây dựng sort object
  const sort: Record<string, 1 | -1> = {
    [sortBy]: sortOrder === 'asc' ? 1 : -1,
  };

  // Thực hiện query song song để tối ưu hiệu suất
  const [data, total] = await Promise.all([
    Product.find(query)
      .populate('category', 'name slug') // Populate thông tin danh mục
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    Product.countDocuments(query),
  ]);

  return {
    data: data as unknown as IProduct[],
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

/**
 * Lấy chi tiết 1 sản phẩm theo ID, populate thông tin danh mục
 */
export async function getById(id: string): Promise<IProduct> {
  // Kiểm tra ID hợp lệ
  if (!Types.ObjectId.isValid(id)) {
    throw new NotFoundError('Sản phẩm không tồn tại');
  }

  const product = await Product.findById(id)
    .populate('category', 'name slug description'); // Populate đầy đủ thông tin danh mục

  if (!product) {
    throw new NotFoundError('Sản phẩm không tồn tại');
  }

  return product;
}

/**
 * Tìm kiếm sản phẩm full-text theo tên hoặc mô tả
 */
export async function search(keyword: string): Promise<IProduct[]> {
  if (!keyword || keyword.trim() === '') {
    return [];
  }

  // Sử dụng text index đã định nghĩa trong ProductSchema
  const results = await Product.find(
    {
      $text: { $search: keyword.trim() },
      isActive: true, // Chỉ tìm sản phẩm đang hoạt động
    },
    {
      score: { $meta: 'textScore' }, // Điểm relevance
    }
  )
    .populate('category', 'name slug')
    .sort({ score: { $meta: 'textScore' } }) // Sắp xếp theo độ phù hợp
    .limit(50); // Giới hạn kết quả

  return results;
}

/**
 * Tạo sản phẩm mới, validate các trường bắt buộc
 */
export async function create(data: Partial<IProduct>): Promise<IProduct> {
  // Validate các trường bắt buộc
  const requiredFields: (keyof IProduct)[] = ['name', 'category', 'unit', 'price'];
  const missingFields = requiredFields.filter((field) => !data[field]);

  if (missingFields.length > 0) {
    throw new ValidationError(
      `Thiếu các trường bắt buộc: ${missingFields.join(', ')}`
    );
  }

  // Kiểm tra giá không âm
  if (data.price !== undefined && data.price < 0) {
    throw new ValidationError('Giá bán không được âm');
  }

  if (data.costPrice !== undefined && data.costPrice < 0) {
    throw new ValidationError('Giá vốn không được âm');
  }

  // Tạo sản phẩm mới
  const product = await Product.create(data);

  // Populate category trước khi trả về
  await product.populate('category', 'name slug');

  return product;
}

/**
 * Cập nhật thông tin sản phẩm theo ID
 */
export async function update(id: string, data: Partial<IProduct>): Promise<IProduct> {
  // Kiểm tra ID hợp lệ
  if (!Types.ObjectId.isValid(id)) {
    throw new NotFoundError('Sản phẩm không tồn tại');
  }

  // Kiểm tra giá không âm nếu có cập nhật
  if (data.price !== undefined && data.price < 0) {
    throw new ValidationError('Giá bán không được âm');
  }

  if (data.costPrice !== undefined && data.costPrice < 0) {
    throw new ValidationError('Giá vốn không được âm');
  }

  const product = await Product.findByIdAndUpdate(
    id,
    { $set: data },
    { new: true, runValidators: true } // Trả về document mới sau khi cập nhật
  ).populate('category', 'name slug');

  if (!product) {
    throw new NotFoundError('Sản phẩm không tồn tại');
  }

  return product;
}

/**
 * Xóa mềm sản phẩm (soft delete): đặt isActive = false
 * Không xóa khỏi database để giữ lịch sử giao dịch
 */
export async function deleteProduct(id: string): Promise<void> {
  // Kiểm tra ID hợp lệ
  if (!Types.ObjectId.isValid(id)) {
    throw new NotFoundError('Sản phẩm không tồn tại');
  }

  const product = await Product.findByIdAndUpdate(
    id,
    { $set: { isActive: false } },
    { new: true }
  );

  if (!product) {
    throw new NotFoundError('Sản phẩm không tồn tại');
  }
}

/**
 * Thêm URL hình ảnh vào danh sách hình ảnh của sản phẩm
 */
export async function addImage(id: string, imagePath: string): Promise<IProduct> {
  // Kiểm tra ID hợp lệ
  if (!Types.ObjectId.isValid(id)) {
    throw new NotFoundError('Sản phẩm không tồn tại');
  }

  if (!imagePath || imagePath.trim() === '') {
    throw new ValidationError('Đường dẫn hình ảnh không được để trống');
  }

  // Thêm URL vào mảng images
  const product = await Product.findByIdAndUpdate(
    id,
    { $push: { images: imagePath.trim() } },
    { new: true }
  ).populate('category', 'name slug');

  if (!product) {
    throw new NotFoundError('Sản phẩm không tồn tại');
  }

  return product;
}

/**
 * Lấy danh sách sản phẩm có tồn kho thấp hơn mức tối thiểu (minStockLevel)
 * Dùng để cảnh báo admin cần nhập thêm hàng
 */
export async function getLowStock(): Promise<IProduct[]> {
  // Tìm sản phẩm đang hoạt động có currentStock < minStockLevel
  const products = await Product.find({
    isActive: true,
    $expr: { $lt: ['$currentStock', '$minStockLevel'] },
  })
    .populate('category', 'name slug')
    .sort({ currentStock: 1 }); // Sắp xếp theo tồn kho tăng dần (ít nhất lên đầu)

  return products;
}
