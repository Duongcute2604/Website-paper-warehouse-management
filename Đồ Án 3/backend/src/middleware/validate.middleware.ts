import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';
import { ValidationError } from './error.middleware';

/**
 * Helper tạo validation middleware từ mảng các ValidationChain
 * Sử dụng express-validator để kiểm tra dữ liệu đầu vào
 *
 * Cách dùng:
 * router.post('/products', validate([
 *   body('name').notEmpty().withMessage('Tên sản phẩm là bắt buộc'),
 *   body('price').isNumeric().withMessage('Giá phải là số'),
 * ]), productController.create);
 */
export function validate(validations: ValidationChain[]) {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    // Chạy tất cả các validation
    for (const validation of validations) {
      await validation.run(req);
    }

    // Lấy kết quả validation
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // Có lỗi validation - ném ValidationError để error middleware xử lý
      const details = errors.array().map((err) => ({
        field: err.type === 'field' ? err.path : undefined,
        message: err.msg,
      }));

      return next(new ValidationError('Dữ liệu không hợp lệ', details));
    }

    next();
  };
}
