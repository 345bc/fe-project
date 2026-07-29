# Hướng Dẫn Chi Tiết: Xây Dựng Logic Bộ Lọc Khoảng Thời Gian (Truy Vấn Từ Backend)

Tài liệu này hướng dẫn chi tiết cách chuyển đổi khối giao diện chọn thời gian tĩnh (`Last 30 days`) tại [page.tsx](file:///d:/Tu%E1%BA%A5n/Storage/1.%20Khai%20Ph%C3%A1%20D%E1%BB%AF%20Li%E1%BB%87u/front-end/fe-project/apps/admin/app/%28server%29/page.tsx#L118-L121) thành bộ lọc khoảng thời gian hoạt động bằng cách **gửi truy vấn trực tiếp sang Backend API (BE)**.

---

## 💡 Kiến Trúc Tổng Quan (BE Query Flow)

```
┌────────────────────────────────────────────────────────┐
│  Client Component: <DateFilter />                      │
│  - Người dùng chọn: 7 ngày / 30 ngày / 90 ngày / 1 năm │
│  - Cập nhật URL Query Params:                          │
│    ví dụ: /?period=7d hoặc /?period=90d                │
└──────────────────────────┬─────────────────────────────┘
                           │ Cập nhật URL (router.push)
                           ▼
┌────────────────────────────────────────────────────────┐
│  Server Component: AdminDashboard (page.tsx)           │
│  - Lấy `searchParams.period` (mặc định '30d')          │
│  - Gọi API Backend với query params:                   │
│    GET http://localhost:8080/bookings?period=30d       │
│    (hoặc GET http://localhost:8080/stats?period=30d)   │
└──────────────────────────┬─────────────────────────────┘
                           │ Truy vấn dữ liệu đã lọc
                           ▼
┌────────────────────────────────────────────────────────┐
│  Backend API (Golang / Node.js / Java...)              │
│  - Nhận query param `period` (hoặc `startDate/endDate`)│
│  - Thực thi SQL Query:                                 │
│    WHERE created_at >= NOW() - INTERVAL '30 days'      │
│  - Trả về dữ liệu đã lọc chính xác                     │
└────────────────────────────────────────────────────────┘
```

---

## 🛠️ Bước 1: Tạo Client Component Bộ Lọc (`DateFilter.tsx`)

Tạo file tại `apps/admin/components/DateFilter.tsx`:

```tsx
// apps/admin/components/DateFilter.tsx
"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

const FILTER_OPTIONS = [
  { label: "7 ngày qua", value: "7d" },
  { label: "30 ngày qua", value: "30d" },
  { label: "90 ngày qua", value: "90d" },
  { label: "1 năm qua", value: "365d" },
  { label: "Tất cả thời gian", value: "all" },
];

export default function DateFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Lấy giá trị khoảng thời gian hiện tại từ URL (mặc định '30d')
  const currentPeriod = searchParams.get("period") || "30d";

  const handleSelectPeriod = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("period", value);

    // Cập nhật URL -> Next.js sẽ tự kích hoạt Server Component gọi lại Backend API
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="relative inline-block">
      <select
        value={currentPeriod}
        onChange={(e) => handleSelectPeriod(e.target.value)}
        className="appearance-none bg-white/10 backdrop-blur-md px-4 py-2 pr-8 rounded-xl text-sm font-medium border border-white/10 text-white cursor-pointer hover:bg-white/20 transition-all focus:outline-none"
      >
        {FILTER_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-gray-800 text-white">
            {opt.label}
          </option>
        ))}
      </select>
      <span className="material-symbols-outlined text-lg absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-white/80">
        calendar_month
      </span>
    </div>
  );
}
```

---

## 🛠️ Bước 2: Cập Nhật Server Component Để Gửi Param Sang Backend (`page.tsx`)

Trong `apps/admin/app/(server)/page.tsx`:

1. Nhận `searchParams` trong tham số của hàm `AdminDashboard`.
2. Truyền `period` (hoặc chuyển đổi thành `startDate`/`endDate`) vào request URL gửi sang Backend API.

### Trường hợp 1: Backend nhận trực tiếp parameter `period` (`?period=30d`)

```tsx
// apps/admin/app/(server)/page.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import DateFilter from "@/components/DateFilter";

interface PageProps {
  searchParams: Promise<{ period?: string }>;
}

export default async function AdminDashboard({ searchParams }: PageProps) {
  // Lấy period từ URL (mặc định '30d')
  const { period = "30d" } = await searchParams;

  let data = {
    revenue: 0,
    bookingsCount: 0,
    usersCount: 0,
    toursCount: 0,
    reviewsCount: 0,
    recentBookings: [] as any[],
    recentReviews: [] as any[],
    chartData: [] as { label: string; value: number }[],
  };

  try {
    const cookieStore = cookies();
    const token = (await cookieStore).get("access_token")?.value;

    if (!token) {
      redirect("/sign-in");
    }

    // 🌐 TRUY VẤN TRỰC TIẾP SANG BACKEND API VỚI PARAMS `period`
    const [bookingsRes, usersRes, toursRes, reviewsRes] = await Promise.all([
      fetch(`http://localhost:8080/bookings?period=${period}`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      }).then((r) => (r.ok ? r.json() : null)),
      fetch("http://localhost:8080/users", {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      }).then((r) => (r.ok ? r.json() : null)),
      fetch("http://localhost:8080/tours", {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      }).then((r) => (r.ok ? r.json() : null)),
      fetch("http://localhost:8080/reviews", {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      }).then((r) => (r.ok ? r.json() : null)),
    ]);

    // Dữ liệu trả về từ Backend đã được lọc sẵn theo thời gian
    const bookings = bookingsRes?.data || [];
    const users = usersRes?.data || [];
    const tours = toursRes?.data || [];
    const reviews = reviewsRes?.data || [];

    data.bookingsCount = bookings.length;
    data.usersCount = users.length;
    data.toursCount = tours.length;
    data.reviewsCount = reviews.length;

    // Tính tổng doanh thu từ các đơn hàng thành công đã lọc
    const successfulBookings = bookings.filter(
      (b: any) => b.status === "CONFIRMED" || b.status === "COMPLETED"
    );
    data.revenue = successfulBookings.reduce(
      (sum: number, b: any) => sum + Number(b.total_amount || 0),
      0
    );

    data.recentBookings = [...bookings]
      .sort((a, b) => (b.id || 0) - (a.id || 0))
      .slice(0, 5);

    data.recentReviews = [...reviews]
      .sort((a, b) => (b.id || 0) - (a.id || 0))
      .slice(0, 4);

    const chartBookings = [...successfulBookings]
      .sort((a, b) => (a.id || 0) - (b.id || 0))
      .slice(-7);
    data.chartData = chartBookings.map((b: any) => ({
      label: `Đơn #${b.id}`,
      value: Number(b.total_amount || 0),
    }));
  } catch (err: any) {
    if (err?.digest?.startsWith("NEXT_REDIRECT")) throw err;
  }

  // Calculate coordinates for SVG chart
  const maxVal = Math.max(...data.chartData.map((d) => d.value), 1000000);
  const points = data.chartData.map((d, i) => {
    const x = 50 + i * 95;
    const y = 240 - (d.value / maxVal) * 180;
    return { x, y };
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 bg-gradient-to-r from-gray-900 to-gray-800 p-8 rounded-2xl shadow-xl text-white relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">
            Tổng quan hệ thống
          </h1>
          <p className="text-gray-300 font-medium">Chào mừng trở lại!</p>
        </div>
        <div className="relative z-10 flex flex-wrap items-center gap-3">
          {/* 👇 Nhúng Component DateFilter */}
          <DateFilter />

          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 transition-colors px-4 py-2 rounded-xl text-sm font-medium shadow-md cursor-pointer">
            <span className="material-symbols-outlined text-lg">download</span>
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* ... (Phần render các thẻ thống kê & biểu đồ giữ nguyên) */}
    </div>
  );
}
```

---

### Trường hợp 2: Backend yêu cầu truyền `startDate` và `endDate` chuẩn ISO/YYYY-MM-DD

Nếu Backend không nhận `period=30d` mà yêu cầu tham số ngày bắt đầu & ngày kết thúc (`?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD`), bạn tạo helper tính ngày trong Server Component:

```tsx
// Helper chuyển đổi period (ví dụ: '30d') thành Date ISO String
function getDateRange(period: string) {
  const endDate = new Date();
  const startDate = new Date();
  const days = parseInt(period.replace("d", ""), 10) || 30;

  startDate.setDate(endDate.getDate() - days);

  return {
    startDate: startDate.toISOString().split("T")[0], // YYYY-MM-DD
    endDate: endDate.toISOString().split("T")[0],     // YYYY-MM-DD
  };
}

// Gọi API Backend:
const { startDate, endDate } = getDateRange(period);
const bookingsRes = await fetch(
  `http://localhost:8080/bookings?startDate=${startDate}&endDate=${endDate}`,
  {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  }
).then((r) => (r.ok ? r.json() : null));
```

---

## ⚙️ Yêu Cầu Cần Có Ở Phía Backend API

Để bộ lọc hoạt động chuẩn xác từ Backend, API Backend (ví dụ `GET /bookings`) cần xử lý SQL lọc theo khoảng thời gian:

### Ví dụ SQL ở Backend (PostgreSQL / MySQL):

```sql
-- Nếu nhận period = 30d
SELECT * FROM bookings 
WHERE created_at >= NOW() - INTERVAL '30 days'
ORDER BY created_at DESC;

-- Nếu nhận startDate & endDate
SELECT * FROM bookings 
WHERE created_at BETWEEN '2026-06-29 00:00:00' AND '2026-07-29 23:59:59'
ORDER BY created_at DESC;
```

---

## ✅ Quy Trình Kiểm Thử (Testing)

1. Mở trang **Admin Dashboard** trên trình duyệt.
2. Mở Tab **Network** trong Developer Tools (F12).
3. Thử chuyển đổi giữa các mốc **7 ngày qua**, **30 ngày qua**, **90 ngày qua**.
4. Kiểm tra request gửi đi từ Next.js Server tới Backend API `http://localhost:8080/bookings?period=...` xem có chứa đúng parameter hay không.
