import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../services/auth.service';

/**
 * Middleware xác thực JWT
 * - Lấy token từ Authorization header (Bearer <token>)
 * - Verify token và gắn thông tin user vào req.user
 * - Trả về 401 nếu không có token hoặc token không hợp lệ
 */
export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  // Kiểm tra header có tồn tại và đúng định dạng Bearer
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Không có token xác thực. Vui lòng đăng nhập.',
      },
    });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify và decode token
    const decoded = verifyToken(token);
    req.user = decoded; // Gắn thông tin user vào request
    next();
  } catch {
    // Token không hợp lệ hoặc đã hết hạn
    res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.',
      },
    });
  }
}

/**
 * Middleware kiểm tra quyền admin
 * Phải dùng sau authMiddleware
 */
export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json({
      success: false,
      error: {
        code: 'FORBIDDEN',
        message: 'Bạn không có quyền thực hiện thao tác này.',
      },
    });
    return;
  }
  next();
}
