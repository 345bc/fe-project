# 🚀 Hướng Dẫn Gọi API Cho Người Mới Bắt Đầu (Siêu Dễ Hiểu)

Tài liệu này giải thích cơ chế gọi API và kết nối Backend - Frontend trong dự án dành cho người mới, kèm ví dụ minh họa và sơ đồ trực quan.

---

## 💡 1. API Là Gì? (Ví Dụ Đời Thực)

Hãy tưởng tượng bạn đang đi ăn ở một **Nhà Hàng**:

- 🖥️ **Khách hàng (Frontend / React Next.js):** Là giao diện màn hình web mà bạn nhìn thấy.
- 🍳 **Nhà bếp (Backend / Spring Boot Server `http://localhost:8080`):** Nơi chứa tất cả dữ liệu thực tế (Database) và xử lý tính toán.
- 📬 **Bồi bàn (API / Axios / Fetch):** Là trung gian. Bạn không thể nhảy trực tiếp vào nhà bếp lấy thức ăn, mà bạn bảo bồi bàn *"Cho tôi danh sách Tour!"*. Bồi bàn sẽ mang yêu cầu (Request) vào bếp, nhận thức ăn (Response) và mang ra bàn cho bạn.

```mermaid
sequenceDiagram
    autonumber
    actor User as 👤 Người dùng
    participant UI as 🖥️ Frontend (React Component)
    participant API as 📬 API Service (Axios / Fetch)
    participant BE as 🍳 Backend (Spring Boot :8080)
    
    User->>UI: Mở trang Dashboard / Danh sách
    UI->>API: Gọi hàm tourService.getAllTours()
    API->>BE: Gửi HTTP GET http://localhost:8080/tours (kèm Token)
    BE-->>API: Trả về kết quả: { status: 200, data: [...] }
    API-->>UI: Nhận dữ liệu tours
    UI-->>User: Vẽ danh sách Tour đẹp mắt lên màn hình
```

---

## 🔑 2. "Vé Vào Cửa" - Token Xác Thực (JWT Bearer Token)

Giống như đi xem phim bạn phải trình **Vé**, Backend yêu cầu mỗi lần gửi lệnh lấy/sửa dữ liệu phải trình **Token xác thực** (`access_token`).

Trong dự án của chúng ta:
1. Khi bạn **Đăng nhập thành công**, Server cấp cho bạn một chuỗi Token và lưu vào **Cookie** của trình duyệt.
2. File [`lib/bearer-token.js`](file:///d:/Tu%E1%BA%A5n/Storage/1.%20Khai%20Ph%C3%A1%20D%E1%BB%AF%20Li%E1%BB%87u/front-end/fe-project/apps/admin/lib/bearer-token.js) đóng vai trò tự động lấy chiếc Vé này từ Cookie và dán vào Header:
   ```http
   Authorization: Bearer eyJhbGciOiJIUzI1Ni...
   ```
   nhờ vậy bạn không cần phải tự dán thủ công ở mỗi hàm nữa!

---

## 🏗️ 3. Quy Trình 3 Bước Thần Thánh Để Kết Nối API Mới

Khi bạn muốn hiển thị một tính năng mới (ví dụ: Danh sách Tin Tức `blogs`):

```mermaid
flowchart LR
    A["Bước 1: Tạo Service file\n(services/blog-service.js)"] --> B["Bước 2: Gọi trong Component/Page\n(app/.../page.tsx)"] --> C["Bước 3: Hiển thị giao diện\n(HTML / React JSX)"]
```

### 🔹 Bước 1: Tạo Bồi Bàn (Viết Service tại `services/blog-service.js`)

```javascript
import tokenBearer from "@/lib/bearer-token";

const baseURL = "http://localhost:8080";

const blogService = {
  // Hàm lấy danh sách bài viết từ Backend
  async getAllBlogs() {
    try {
      // 1. Gọi GET sang backend
      const res = await tokenBearer.get(`${baseURL}/blogs`);
      // 2. Nhận kết quả từ Spring Boot trả về gói res.data.data
      return res.data.data; 
    } catch (error) {
      console.error("Lỗi lấy danh sách blog:", error);
      throw error;
    }
  }
};

export default blogService;
```

---

### 🔹 Bước 2 & 3: Sử Dụng Trên Giao Diện (React Client Component)

```tsx
"use client";

import { useState, useEffect } from "react";
import blogService from "@/services/blog-service";

export default function BlogListPage() {
  // State 1: Lưu danh sách bài viết
  const [blogs, setBlogs] = useState<any[]>([]);
  // State 2: Trạng thái đang tải (Loading)
  const [loading, setLoading] = useState(true);

  // useEffect sẽ tự chạy 1 lần ngay khi mở trang
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await blogService.getAllBlogs(); // Gọi Bước 1
        setBlogs(data); // Lưu dữ liệu vào State
      } catch (err) {
        alert("Không thể tải bài viết!");
      } finally {
        setLoading(false); // Đã tải xong
      }
    }

    loadData();
  }, []);

  // Nếu đang tải thì hiển thị thông báo
  if (loading) return <p>⏳ Đang tải dữ liệu từ server...</p>;

  // Đã có dữ liệu -> Vẽ ra màn hình bằng hàm .map()
  return (
    <div>
      <h1>📰 Danh sách bài viết</h1>
      <ul>
        {blogs.map((item) => (
          <li key={item.id}>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

## 📊 4. Minh Họa Bài Toán Lọc Theo Thời Gian Trên Dashboard

Hãy xem luồng chạy thực tế khi người dùng chọn khoảng thời gian (`7 ngày`, `30 ngày`, `90 ngày`) trên trang Dashboard chính [`app/(server)/page.tsx`](file:///d:/Tu%E1%BA%A5n/Storage/1.%20Khai%20Ph%C3%A1%20D%E1%BB%AF%20Li%E1%BB%87u/front-end/fe-project/apps/admin/app/%28server%29/page.tsx):

```mermaid
sequenceDiagram
    autonumber
    actor Admin as 👨‍💼 Quản trị viên
    participant Picker as 📅 DateRange Picker
    participant URL as 🔗 URL Browser (?period=90)
    participant Page as 🖥️ Server Page (page.tsx)
    participant BE as 🍳 Backend Server

    Admin->>Picker: Chọn "Last 90 days"
    Picker->>URL: Cập nhật URL sang /?period=90
    URL->>Page: Next.js chạy lại Server Component với period = 90
    Page->>BE: Lấy dữ liệu bookings & users
    BE-->>Page: Trả về danh sách đơn hàng
    Note over Page: Page lọc đơn hàng trong 90 ngày qua<br/>Tính lại Tổng Doanh Thu & Vẽ Biểu Đồ
    Page-->>Admin: Hiển thị số liệu đã cập nhật theo 90 ngày
```

---

## 🛠️ 5. Các Lỗi Thường Gặp & Cách Khắc Phục

| Lỗi gặp phải | Nguyên nhân | Cách sửa |
| :--- | :--- | :--- |
| **Dữ liệu trả về `0` hoặc mảng rỗng `[]`** | Endpoint API viết sai URL (ví dụ `/bookings/filter` thay vì `/bookings`) hoặc Token bị hết hạn. | Kiểm tra lại đường dẫn API backend hoặc đăng nhập lại. |
| **Lỗi `NextRouter was not mounted`** | Import `useRouter` từ sai thư viện `next/router` thay vì `next/navigation`. | Đổi thành: `import { useRouter } from 'next/navigation';` |
| **Trang web trắng tinh hoặc treo** | Không bọc câu lệnh `fetch` trong `try...catch` khi gặp sự cố mạng. | Luôn bọc câu lệnh gọi API trong khối `try { ... } catch (e) { ... }`. |
