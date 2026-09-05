# Hướng Dẫn Gọi & Lấy API bằng Code (API Integration Guide)

Tài liệu này hướng dẫn chi tiết cách kết nối, khai báo và sử dụng API trong ứng dụng **Admin (Next.js)** dựa trên kiến trúc thực tế của dự án.

---

## 1. Kiến Trúc & Cấu Hình API Trong Dự Án

### 1.1 HTTP Client Được Cấu Hình Sẵn (`tokenBearer`)
Hệ thống sử dụng **Axios** được cấu hình làm HTTP Client mặc định tại file [`lib/bearer-token.js`](file:///d:/Tu%E1%BA%A5n/Storage/1.%20Khai%20Ph%C3%A1%20D%E1%BB%AF%20Li%E1%BB%87u/front-end/fe-project/apps/admin/lib/bearer-token.js).

**Đặc điểm của `tokenBearer`:**
- **Base URL:** `http://localhost:8080` (Spring Boot API Server).
- **Tự động gắn Token xác thực:** Interceptor đọc `access_token` từ `document.cookie` và gắn vào Header:
  ```http
  Authorization: Bearer <access_token>
  ```
- **Ngoại lệ Authentication:** Tự động bỏ qua gắn Header `Authorization` cho các endpoint đăng nhập (`/auth/sign-in`, `/auth/admin/sign-in`) để tránh lỗi JWT hết hạn khi cố đăng nhập lại.

---

## 2. Cách Tạo Service Mới Trích Xuất API (Service Layer)

Tất cả các hàm tương tác với API được tổ chức theo thư mục [`services/`](file:///d:/Tu%E1%BA%A5n/Storage/1.%20Khai%20Ph%C3%A1%20D%E1%BB%AF%20Li%E1%BB%87u/front-end/fe-project/apps/admin/services).

### Mẫu Service CRUD Chuẩn (`example-service.js`)

Khi tạo một service mới (ví dụ: quản lý sản phẩm `product-service.js`), làm theo mẫu bên dưới:

```javascript
import tokenBearer from "@/lib/bearer-token";

const baseURL = "http://localhost:8080";

const productService = {
  // 1. Lấy danh sách (GET ALL)
  async getAllProducts() {
    try {
      const res = await tokenBearer.get(`${baseURL}/products`, {
        withCredentials: true,
      });
      // Response trả về từ Spring Boot có dạng { data: { data: [...] } }
      return res.data.data;
    } catch (e) {
      const message = e.response?.data?.message || 'Lấy danh sách sản phẩm thất bại';
      throw new Error(message);
    }
  },

  // 2. Lấy thông tin theo ID (GET BY ID)
  async getProductById(id) {
    try {
      const res = await tokenBearer.get(`${baseURL}/products/${id}`, {
        withCredentials: true,
      });
      return res.data.data;
    } catch (e) {
      const message = e.response?.data?.message || 'Không tìm thấy sản phẩm';
      throw new Error(message);
    }
  },

  // 3. Tạo mới sản phẩm (POST)
  async postProduct(requestData) {
    try {
      const res = await tokenBearer.post(`${baseURL}/products`, requestData, { 
        withCredentials: true 
      });
      return res.data.data;
    } catch (e) {
      const message = e.response?.data?.message || 'Tạo sản phẩm thất bại';
      throw new Error(message);
    }
  },

  // 4. Cập nhật một phần dữ liệu (PATCH/PUT)
  async patchProduct(id, requestData) {
    try {
      const res = await tokenBearer.patch(`${baseURL}/products/${id}`, requestData);
      return res.data.data;
    } catch (e) {
      const message = e.response?.data?.message || 'Cập nhật sản phẩm thất bại';
      throw new Error(message);
    }
  },

  // 5. Xóa dữ liệu (DELETE)
  async deleteProduct(id) {
    try {
      const res = await tokenBearer.delete(`${baseURL}/products/${id}`);
      return res.data.data;
    } catch (e) {
      const message = e.response?.data?.message || 'Xóa sản phẩm thất bại';
      throw new Error(message);
    }
  }
};

export default productService;
```

---

## 3. Cách Sử Dụng API Trong Component / Page (React & Next.js)

### 3.1 Lấy Dữ Liệu Khi Component Mount (`useEffect`)

Ví dụ lấy danh sách Tour hoặc hỗ trợ tải danh mục kết hợp `Promise.all` (Tham khảo tại [`app/(server)/tours/add/page.tsx`](file:///d:/Tu%E1%BA%A5n/Storage/1.%20Khai%20Ph%C3%A1%20D%E1%BB%AF%20Li%E1%BB%87u/front-end/fe-project/apps/admin/app/%28server%29/tours/add/page.tsx)):

```tsx
"use client";

import { useState, useEffect } from "react";
import tourService from "@/services/tour-service";
import tokenBearer from "@/lib/bearer-token";

export default function TourListPage() {
  const [tours, setTours] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Gọi thông qua Service
        const data = await tourService.getAllTours();
        setTours(data);
      } catch (err: any) {
        setError(err.message || "Lỗi tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Đang tải dữ liệu...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <ul>
      {tours.map((tour) => (
        <li key={tour.id}>{tour.name} - {tour.price} VNĐ</li>
      ))}
    </ul>
  );
}
```

---

### 3.2 Gọi API Lưu / Gửi Form (Form Submission)

```tsx
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError(null);

  try {
    const result = await tourService.postTour({
      name: name,
      price: Number(price),
      duration: duration,
      description: description,
      image: imageUrl,
      category_id: Number(categoryId),
      destination_id: Number(destinationId),
      trans_id: Number(transId),
    });

    console.log("Tạo mới thành công:", result);
    router.push("/tours");
  } catch (err: any) {
    setError(err?.message || "Thêm tour mới thất bại");
  } finally {
    setLoading(false);
  }
};
```

---

### 3.3 Gọi Nhiều API Song Song (`Promise.all`)

Khi cần lấy dữ liệu từ nhiều nguồn API cùng một lúc trước khi render UI:

```tsx
useEffect(() => {
  const fetchMultipleOptions = async () => {
    try {
      const [catRes, destRes, transRes] = await Promise.all([
        tokenBearer.get("/categories"),
        tokenBearer.get("/destinations"),
        tokenBearer.get("/transports"),
      ]);

      setCategories(catRes.data.data || []);
      setDestinations(destRes.data.data || []);
      setTransports(transRes.data.data || []);
    } catch (err: any) {
      console.error("Lỗi khi lấy dữ liệu cấu hình:", err);
    }
  };

  fetchMultipleOptions();
}, []);
```

---

## 4. Hướng Dẫn Sử Dụng Native `fetch` (Javascript Vanilla / Node.js)

Nếu bạn muốn viết một đoạn script thuần không dùng Axios hoặc Service layer của dự án:

### 4.1 Lấy Dữ Liệu GET bằng Native `fetch`
```javascript
async function fetchToursNative() {
  // Lấy token từ Cookie (trên trình duyệt)
  const token = document.cookie
    .split(';')
    .find(row => row.trim().startsWith('access_token='))
    ?.split('=')[1];

  try {
    const response = await fetch("http://localhost:8080/tours", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    const result = await response.json();
    console.log("Dữ liệu trả về:", result.data);
    return result.data;
  } catch (error) {
    console.error("Lỗi khi gọi API:", error);
  }
}
```

### 4.2 Gửi Dữ Liệu POST bằng Native `fetch`
```javascript
async function createCategoryNative(categoryData) {
  const token = getCookie("access_token");

  try {
    const response = await fetch("http://localhost:8080/categories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(categoryData)
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Tạo thất bại");
    }

    return result.data;
  } catch (error) {
    console.error("Lỗi POST API:", error.message);
  }
}
```

---

## 5. Các Quy Tắc & Best Practices Cần Tuân Thủ

1. **Luôn bọc trong `try...catch`:** Tất cả các lệnh gọi API bất đồng bộ (`async/await`) phải được xử lý lỗi đầy đủ.
2. **Luôn sử dụng Service Layer:** Hạn chế viết trực tiếp đường dẫn URL (`http://localhost:8080/...`) vào trong Component. Hãy định nghĩa hàm trong file service tương ứng trong `services/`.
3. **Cấu trúc Dữ Liệu Bọc của Backend (Response Envelope):** Spring Boot trả về dữ liệu có dạng `{ status, message, data }`. Hãy nhớ lấy qua `.data.data` (đối với Axios) hoặc `.json().then(res => res.data)` (đối với Native Fetch).
4. **Trích xuất thông báo lỗi chính xác:**
   ```javascript
   const message = error.response?.data?.message || 'Thông báo mặc định';
   ```
5. **Cấu hình Đăng nhập & Auth Token:** Khi đăng nhập thành công tại [`services/auth-service.js`](file:///d:/Tu%E1%BA%A5n/Storage/1.%20Khai%20Ph%C3%A1%20D%E1%BB%AF%20Li%E1%BB%87u/front-end/fe-project/apps/admin/services/auth-service.js), token được lưu vào Cookie:
   ```javascript
   document.cookie = `access_token=${springData.token}; path=/`;
   ```
