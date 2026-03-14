import { JwtPayload } from '../services/auth.service';

// Mở rộng Express Request để thêm thông tin user sau khi xác thực JWT
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload; // Thông tin user được gắn vào request sau khi verify token
    }
  }
}
