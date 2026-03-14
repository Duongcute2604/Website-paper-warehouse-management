import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';

// Số vòng salt cho bcrypt
const SALT_ROUNDS = 10;

// Interface cho JWT payload
export interface JwtPayload {
  userId: string;  // ID của user
  role: 'admin' | 'staff'; // Vai trò
  username: string; // Tên đăng nhập
}

// Interface cho kết quả đăng nhập
export interface LoginResult {
  token: string;
  user: {
    id: string;
    username: string;
    fullName: string;
    role: string;
  };
}

/**
 * Tạo JWT token với thời hạn 30 phút
 */
export function generateToken(userId: string, role: 'admin' | 'staff', username: string): string {
  const secret = process.env.JWT_SECRET || 'default_secret_change_in_production';
  const expiresIn = process.env.JWT_EXPIRES_IN || '30m';

  const payload: JwtPayload = { userId, role, username };
  return jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions);
}

/**
 * Verify và decode JWT token
 * Ném lỗi nếu token không hợp lệ hoặc đã hết hạn
 */
export function verifyToken(token: string): JwtPayload {
  const secret = process.env.JWT_SECRET || 'default_secret_change_in_production';
  return jwt.verify(token, secret) as JwtPayload;
}

/**
 * Hash mật khẩu bằng bcrypt với saltRounds = 10
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Đăng nhập: kiểm tra username/password, trả về JWT token
 */
export async function login(username: string, password: string): Promise<LoginResult> {
  // Tìm user theo username (không phân biệt hoa thường)
  const user = await User.findOne({ username: username.toLowerCase(), isActive: true });

  if (!user) {
    throw new Error('Tên đăng nhập hoặc mật khẩu không đúng');
  }

  // Verify mật khẩu bằng bcrypt
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Tên đăng nhập hoặc mật khẩu không đúng');
  }

  // Cập nhật thời gian đăng nhập cuối
  user.lastLogin = new Date();
  await user.save();

  // Tạo JWT token
  const token = generateToken(user._id.toString(), user.role, user.username);

  return {
    token,
    user: {
      id: user._id.toString(),
      username: user.username,
      fullName: user.fullName,
      role: user.role,
    },
  };
}

/**
 * Đăng xuất: JWT là stateless nên chỉ cần xóa token ở client.
 * Hàm này chỉ là placeholder để controller gọi.
 */
export function logout(): void {
  // Stateless JWT - client tự xóa token khỏi localStorage/sessionStorage
}

/**
 * Tạo tài khoản admin mặc định nếu chưa có
 * username: admin, password: admin123
 */
export async function createDefaultAdmin(): Promise<void> {
  const existingAdmin = await User.findOne({ username: 'admin' });
  if (existingAdmin) return;

  const hashedPassword = await hashPassword('admin123');

  await User.create({
    username: 'admin',
    password: hashedPassword,
    fullName: 'Quản Trị Viên',
    email: 'admin@paperwarehouse.com',
    role: 'admin',
    isActive: true,
  });

  console.log('✅ Đã tạo tài khoản admin mặc định (username: admin, password: admin123)');
}
