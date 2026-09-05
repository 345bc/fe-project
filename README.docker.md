# Hướng dẫn Build & Deploy với Docker

Tài liệu hướng dẫn đóng gói và chạy dự án Front-end Monorepo (`apps/client` và `apps/admin`) bằng Docker và Docker Compose.

---

## 1. Yêu cầu môi trường
- Đã cài đặt [Docker Desktop](https://www.docker.com/products/docker-desktop/) (hoặc Docker Engine & Docker Compose trên Linux).

---

## 2. Cấu trúc thiết lập Docker

```
fe-project/
├── .dockerignore              # Bỏ qua node_modules, .next, cache khi build
├── docker-compose.yml         # File quản lý chạy đồng thời client và admin
├── .env.docker.example        # File mẫu cấu hình biến môi trường
├── apps/
│   ├── client/
│   │   ├── Dockerfile         # Dockerfile multi-stage cho ứng dụng Client
│   │   └── next.config.js     # Đã cấu hình output: 'standalone'
│   └── admin/
│       ├── Dockerfile         # Dockerfile multi-stage cho ứng dụng Admin
│       └── next.config.js     # Đã cấu hình output: 'standalone'
```

---

## 3. Khởi chạy bằng Docker Compose (Khuyên dùng)

### Bước 1: Tạo file biến môi trường (nếu cần đổi API URL)
Sao chép `.env.docker.example` thành `.env`:
```bash
cp .env.docker.example .env
```
Chỉnh sửa `NEXT_PUBLIC_API_URL` trỏ tới backend server của bạn (mặc định là `http://localhost:8080`).

### Bước 2: Build và khởi động các container
Tại thư mục gốc `fe-project`:
```bash
docker compose up -d --build
```

### Bước 3: Truy cập ứng dụng
- **Client App**: [http://localhost:3001](http://localhost:3001)
- **Admin App**: [http://localhost:3000](http://localhost:3000)

### Các lệnh quản lý thường dùng:
- Xem log:
  ```bash
  docker compose logs -f
  # Hoặc xem riêng từng service:
  docker compose logs -f client
  docker compose logs -f admin
  ```
- Dừng toàn bộ:
  ```bash
  docker compose down
  ```
- Restart một service:
  ```bash
  docker compose restart client
  ```

---

## 4. Build từng Docker Image độc lập

> **LƯU Ý QUAN TRỌNG:** Vì đây là dự án **Turborepo Monorepo**, context build của Docker **bắt buộc phải là thư mục gốc** (`fe-project`), không được `cd` vào trong `apps/client` để build.

### Build và chạy Client:
```bash
# 1. Build image từ root:
docker build -f apps/client/Dockerfile -t fe-client .

# Có thể truyền API URL lúc build:
# docker build -f apps/client/Dockerfile --build-arg NEXT_PUBLIC_API_URL=https://api.domain.com -t fe-client .

# 2. Chạy container:
docker run -d -p 3001:3000 --name fe-client fe-client
```

### Build và chạy Admin:
```bash
# 1. Build image từ root:
docker build -f apps/admin/Dockerfile -t fe-admin .

# Có thể truyền API URL lúc build:
# docker build -f apps/admin/Dockerfile --build-arg NEXT_PUBLIC_API_URL=https://api.domain.com -t fe-admin .

# 2. Chạy container:
docker run -d -p 3000:3000 --name fe-admin fe-admin
```

---

## 5. Cơ chế tối ưu hóa (Multi-stage Build & Standalone)
- **Turbo Prune**: Dockerfile sử dụng `turbo prune <app> --docker` để chỉ copy các package phụ thuộc cần thiết (`@repo/ui`, etc.), giảm thời gian cache và kích thước build context.
- **Next.js Standalone**: Kích hoạt `output: 'standalone'` trong `next.config.js`. Chỉ những file Node modules thực sự được dùng mới được gom vào image cuối.
- **Bảo mật**: Container chạy bằng user không có quyền root (`nextjs:nodejs`), an toàn cho môi trường production.
- **Kích thước Image**: Image thành phẩm chỉ ~150MB - 200MB thay vì > 1.5GB như thông thường.
