import { Request, Response, NextFunction } from 'express';

// Các lớp lỗi tùy chỉnh để phân loại lỗi

/** Lỗi validation dữ liệu đầu vào (400) */
export class ValidationError extends Error {
  details?: unknown[];
  constructor(message: string, details?: unknown[]) {
    super(message);
    this.name = 'ValidationError';
    this.details = details;
  }
}

/** Lỗi xác thực / không có quyền truy cập (401) */
export class UnauthorizedError extends Error {
  constructor(message = 'Không có quyền truy cập') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

/** Lỗi không tìm thấy tài nguyên (404) */
export class NotFoundError extends Error {
  constructor(message = 'Không tìm thấy tài nguyên') {
    super(message);
    this.name = 'NotFoundError';
  }
}

/** Lỗi logic nghiệp vụ (422) */
export class BusinessLogicError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BusinessLogicError';
  }
}

/**
 * Middleware xử lý lỗi tập trung
 * Phải được đăng ký CUỐI CÙNG trong Express app
 */
export function errorMiddleware(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Log lỗi ra console (trong production nên dùng logger như winston)
  console.error(`[Error] ${err.name}: ${err.message}`);

  // Xử lý ValidationError (400 Bad Request)
  if (err instanceof ValidationError) {
    res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: err.message,
        ...(err.details && { details: err.details }),
      },
    });
    return;
  }

  // Xử lý UnauthorizedError (401 Unauthorized)
  if (err instanceof UnauthorizedError) {
    res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: err.message,
      },
    });
    return;
  }

  // Xử lý NotFoundError (404 Not Found)
  if (err instanceof NotFoundError) {
    res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: err.message,
      },
    });
    return;
  }

  // Xử lý BusinessLogicError (422 Unprocessable Entity)
  if (err instanceof BusinessLogicError) {
    res.status(422).json({
      success: false,
      error: {
        code: 'BUSINESS_LOGIC_ERROR',
        message: err.message,
      },
    });
    return;
  }

  // Lỗi chung không xác định (500 Internal Server Error)
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Lỗi server nội bộ. Vui lòng thử lại sau.',
    },
  });
}
