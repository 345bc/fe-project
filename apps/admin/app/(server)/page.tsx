// apps/admin/app/page.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
interface PageProps {
  searchParams: Promise<{ period?: string }>;
}
export default async function AdminDashboard({ searchParams }: PageProps) {
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
  let error = null;

  try {
    const cookieStore = cookies();
    const token = (await cookieStore).get("access_token")?.value;

    if (!token) {
      redirect("/sign-in");
    }

    const [bookingsRes, usersRes, toursRes, reviewsRes] = await Promise.all([
      fetch("http://localhost:8080/bookings", {
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

    const bookings = bookingsRes?.data || [];
    const users = usersRes?.data || [];
    const tours = toursRes?.data || [];
    const reviews = reviewsRes?.data || [];

    data.bookingsCount = bookings.length;
    data.usersCount = users.length;
    data.toursCount = tours.length;
    data.reviewsCount = reviews.length;

    // Calculate total revenue from CONFIRMED or COMPLETED bookings
    const successfulBookings = bookings.filter(
      (b: any) => b.status === "CONFIRMED" || b.status === "COMPLETED"
    );
    data.revenue = successfulBookings.reduce(
      (sum: number, b: any) => sum + Number(b.total_amount || 0),
      0
    );

    // Recent bookings (last 5)
    data.recentBookings = [...bookings]
      .sort((a, b) => (b.id || 0) - (a.id || 0))
      .slice(0, 5);

    // Recent reviews (last 4)
    data.recentReviews = [...reviews]
      .sort((a, b) => (b.id || 0) - (a.id || 0))
      .slice(0, 4);

    // Prepare chart data (last 7 successful bookings)
    const chartBookings = [...successfulBookings]
      .sort((a, b) => (a.id || 0) - (b.id || 0))
      .slice(-7);
    data.chartData = chartBookings.map((b: any) => ({
      label: `Đơn #${b.id}`,
      value: Number(b.total_amount || 0),
    }));
  } catch (err: any) {
    if (err?.digest?.startsWith("NEXT_REDIRECT")) {
      throw err;
    }
    error =
      err instanceof Error ? err.message : "Không thể tải dữ liệu thống kê";
  }

  // Calculate coordinates for SVG chart
  const maxVal = Math.max(...data.chartData.map((d) => d.value), 1000000);
  const points = data.chartData.map((d, i) => {
    const x = 50 + i * 95;
    // Calculate Y where 240 is chart height baseline and y=40 is top edge
    const y = 240 - (d.value / maxVal) * 180;
    return { x, y };
  });
  const firstPoint = points[0];
  const lastPoint = points[points.length - 1];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 bg-gradient-to-r from-gray-900 to-gray-800 p-8 rounded-2xl shadow-xl text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/5 blur-3xl"></div>
        <div className="absolute bottom-0 right-32 mb-8 w-32 h-32 rounded-full bg-blue-500/20 blur-2xl"></div>

        <div className="relative z-10">
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">
            Tổng quan hệ thống
          </h1>
          <p className="text-gray-300 font-medium">
            Chào mừng trở lại!
          </p>
        </div>
        <div className="relative z-10 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl text-sm font-medium border border-white/10">
            <span className="material-symbols-outlined text-lg">calendar_month</span>
            <span>Last 30 days</span>
          </div>
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 transition-colors px-4 py-2 rounded-xl text-sm font-medium shadow-md cursor-pointer">
            <span className="material-symbols-outlined text-lg">download</span>
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Doanh thu */}
        <div className="group relative bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-gray "></div>
          <div className="flex justify-between items-start mb-4">

            <div className="w-1/2 truncate" title={`${data.revenue.toLocaleString("vi-VN")} ₫`}>
              <p className="text-sm font-medium text-gray-500 mb-1">Doanh thu</p>
              <h3 className="text-2xl font-bold text-gray-900 tracking-tight truncate">
                {data.revenue.toLocaleString("vi-VN")} ₫
              </h3>
            </div>
            <div className="p-3 bg-white/10 border-2  rounded-xl text-blue-gray group-hover:scale-110 transition-transform duration-300">
              <span className="material-symbols-outlined">
                attach_money
              </span>
            </div>
          </div>

        </div>

        {/* Đơn đặt tour */}
        <div className="group relative bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-gray"></div>
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Đơn đặt tour</p>
              <h3 className="text-2xl font-bold text-gray-900 tracking-tight">
                {data.bookingsCount}
              </h3>
            </div>
            <div className="p-3 bg-white/10 border-2  rounded-xl text-blue-gray group-hover:scale-110 transition-transform duration-300">
              <span className="material-symbols-outlined">
                order_approve
              </span>
            </div>
          </div>

        </div>

        {/* Người dùng */}
        <div className="group relative bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-gray"></div>
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Người dùng</p>
              <h3 className="text-2xl font-bold text-gray-900 tracking-tight">
                {data.usersCount}
              </h3>
            </div>
            <div className="p-3 bg-white/10 border-2  rounded-xl text-blue-gray group-hover:scale-110 transition-transform duration-300">
              <span className="material-symbols-outlined">
                person
              </span>
            </div>
          </div>

        </div>

        {/* Tours du lịch */}
        <div className="group relative bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-gray"></div>
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Tours hoạt động</p>
              <h3 className="text-2xl font-bold text-gray-900 tracking-tight">
                {data.toursCount}
              </h3>
            </div>
            <div className="p-3 bg-white/10 border-2  rounded-xl text-blue-gray group-hover:scale-110 transition-transform duration-300">
              <span className="material-symbols-outlined">
                Label
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Charts & Detail Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart Area */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">
              Biến động doanh thu theo đơn hàng gần đây
            </h2>
            <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full">
              Thực tế
            </span>
          </div>

          <div className="w-full relative overflow-x-auto">
            {data.chartData.length > 0 ? (
              <div className="min-w-[650px] p-2">
                <svg className="w-full h-72" viewBox="0 0 650 290">
                  <defs>
                    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                    </linearGradient>
                    <filter id="lineGlow" x="-10%" y="-10%" width="120%" height="120%">
                      <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#3b82f6" floodOpacity="0.3" />
                    </filter>
                  </defs>

                  {/* Horizontal Guidlines */}
                  <line x1="50" y1="60" x2="620" y2="60" stroke="#f8fafc" strokeWidth="1.5" />
                  <line x1="50" y1="120" x2="620" y2="120" stroke="#f8fafc" strokeWidth="1.5" />
                  <line x1="50" y1="180" x2="620" y2="180" stroke="#f8fafc" strokeWidth="1.5" />
                  <line x1="50" y1="240" x2="620" y2="240" stroke="#e2e8f0" strokeWidth="1.5" />

                  {/* Area path */}
                  {firstPoint && lastPoint && (
                    <>
                      <path
                        d={`M ${firstPoint.x} 240 L ${points.map((p) => `${p.x} ${p.y}`).join(" L ")} L ${lastPoint.x} 240 Z`}
                        fill="url(#areaGrad)"
                      />

                      {/* Line path */}
                      <path
                        d={`M ${firstPoint.x} ${firstPoint.y} L ${points.map((p) => `${p.x} ${p.y}`).join(" L ")}`}
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        filter="url(#lineGlow)"
                      />
                    </>
                  )}

                  {/* Nodes & Tooltips */}
                  {points.map((p, i) => (
                    <g key={i} className="group cursor-pointer">
                      {/* Vertical line indicator on hover */}
                      <line
                        x1={p.x}
                        y1={p.y}
                        x2={p.x}
                        y2="240"
                        stroke="#93c5fd"
                        strokeWidth="1"
                        strokeDasharray="3"
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      />

                      {/* Interactive dot */}
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r="6"
                        fill="#3b82f6"
                        stroke="#ffffff"
                        strokeWidth="2.5"
                        className="transition-all duration-200 group-hover:r-8"
                      />

                      {/* Tooltip Card */}
                      <g className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                        <rect
                          x={p.x - 60}
                          y={p.y - 40}
                          width="120"
                          height="26"
                          rx="6"
                          fill="#0f172a"
                        />
                        <text
                          x={p.x}
                          y={p.y - 23}
                          textAnchor="middle"
                          fill="#ffffff"
                          className="text-[10px] font-bold"
                        >
                          {data.chartData[i]?.value?.toLocaleString("vi-VN")}₫
                        </text>
                      </g>
                    </g>
                  ))}

                  {/* X Axis Labels */}
                  {points.map((p, i) => (
                    <text
                      key={i}
                      x={p.x}
                      y="265"
                      textAnchor="middle"
                      className="text-[11px] font-semibold fill-gray-400"
                    >
                      {data.chartData[i]?.label || ""}
                    </text>
                  ))}
                </svg>
              </div>
            ) : (
              <div className="h-72 w-full flex items-center justify-center border border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                <p className="text-sm text-gray-400 font-medium">Chưa có đủ đơn đặt thành công để vẽ biểu đồ</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Bookings (Thế chỗ Hoạt động gần đây) */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">
                Đơn đặt tour mới nhất
              </h2>
              <Link href="/bookings" className="text-blue-600 text-sm font-semibold hover:text-blue-700">
                Xem tất cả
              </Link>
            </div>

            <div className="space-y-4">
              {data.recentBookings.length > 0 ? (
                data.recentBookings.map((booking, i) => (
                  <div key={booking.id} className="flex items-center justify-between p-3.5 hover:bg-gray-50 rounded-xl transition duration-200 border border-gray-50">
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-gray-900">Đơn hàng #{booking.id}</p>
                      <p className="text-xs text-gray-500 font-medium truncate max-w-[150px]">
                        {booking.phone_number || booking.email || "Khách vãng lai"}
                      </p>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="text-sm font-bold text-blue-600">
                        {Number(booking.total_amount || 0).toLocaleString("vi-VN")}₫
                      </p>
                      <span className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded-full ${booking.status === "CONFIRMED" || booking.status === "COMPLETED"
                        ? "bg-green-50 text-green-700"
                        : booking.status === "CANCELLED"
                          ? "bg-red-50 text-red-700"
                          : "bg-yellow-50 text-yellow-700"
                        }`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400 py-10 text-center">Chưa có đơn đặt tour nào</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Area: Recent Reviews */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900">
            Phản hồi & Đánh giá gần đây
          </h2>
          <Link href="/reviews" className="text-blue-600 text-sm font-semibold hover:text-blue-700">
            Xem tất cả
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.recentReviews.length > 0 ? (
            data.recentReviews.map((review) => (
              <div key={review.id} className="p-5 bg-slate-50/50 hover:bg-slate-50 transition border border-gray-100 rounded-xl flex flex-col justify-between h-40">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-gray-400">Đơn #{review.booking?.id || "—"}</span>
                    <div className="flex items-center text-yellow-400 text-sm">
                      <span className="font-extrabold mr-0.5">{review.rating}</span>★
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 font-medium line-clamp-3 italic">
                    "{review.comment || "Không có nội dung nhận xét."}"
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-gray-200/50 flex justify-between items-center text-[10px] text-gray-400 font-medium">
                  <span>Mã đánh giá: #{review.id}</span>
                  <span className={`px-1.5 py-0.5 rounded font-bold ${review.status === "ACTIVE" ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-500"
                    }`}>{review.status}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-8 text-center">
              <p className="text-sm text-gray-400 font-medium">Chưa nhận được phản hồi đánh giá nào</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
