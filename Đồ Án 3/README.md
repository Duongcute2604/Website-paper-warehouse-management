# Hệ Thống Quản Lý Kho Giấy

Ứng dụng web quản lý kho giấy với Trang Chủ cho khách hàng và Trang Quản Trị cho admin.

## Công Nghệ

- **Backend**: Node.js + Express + TypeScript + MongoDB
- **Frontend**: React + TypeScript + Vite + TailwindCSS

## Cài Đặt

```bash
# Cài dependencies cho cả 2
npm run install:all

# Hoặc cài riêng
cd backend && npm install
cd frontend && npm install
```

## Cấu Hình

```bash
# Tạo file .env từ mẫu
cp backend/.env.example backend/.env
# Chỉnh sửa các giá trị trong backend/.env
```

## Chạy Dự Án

```bash
# Chạy cả backend và frontend cùng lúc
npm run dev

# Chạy riêng
npm run dev:backend   # http://localhost:5000
npm run dev:frontend  # http://localhost:5173
```

## Cấu Trúc Dự Án

```
├── backend/          # Express + TypeScript API
│   └── src/
│       ├── controllers/
│       ├── services/
│       ├── models/
│       ├── routes/
│       ├── middleware/
│       ├── utils/
│       └── index.ts
└── frontend/         # React + TypeScript UI
    └── src/
        ├── components/
        ├── pages/
        ├── hooks/
        ├── services/
        └── main.tsx
```

## API

Backend chạy tại `http://localhost:5000/api`

Kiểm tra: `GET /api/health`
