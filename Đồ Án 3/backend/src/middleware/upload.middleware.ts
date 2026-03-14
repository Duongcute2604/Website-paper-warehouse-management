import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';

// Thư mục lưu ảnh sản phẩm
const UPLOAD_DIR = path.join(process.cwd(), 'uploads', 'products');

// Tạo thư mục nếu chưa tồn tại
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Cấu hình lưu file vào disk
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    // Tạo tên file duy nhất: timestamp + random + extension gốc
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `product-${uniqueSuffix}${ext}`);
  },
});

// Chỉ chấp nhận JPG, PNG, WebP
function imageFileFilter(
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
): void {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Chỉ chấp nhận file ảnh JPG, PNG hoặc WebP'));
  }
}

/**
 * Middleware upload ảnh sản phẩm
 * - Lưu vào uploads/products/
 * - Chỉ chấp nhận JPG, PNG, WebP
 * - Giới hạn 5MB mỗi file
 */
export const uploadProductImage = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});
