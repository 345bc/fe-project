import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import BookingsTable from "@/components/BookingsTable";

const baseURL = "http://localhost:8080";

export default async function BookingsPage() {
  let bookingsData = [];
  let reviewsData = [];
  let refundsData = [];
  let error = null;

  try {
    const cookieStore = cookies();
    const token = (await cookieStore).get("access_token")?.value;

    if (!token) {
      redirect("/sign-in");
    }

    // Fetch Bookings, Reviews, and Refunds in parallel
    const [bookingsRes, reviewsRes, refundsRes] = await Promise.all([
      fetch(`${baseURL}/bookings`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      }),
      fetch(`${baseURL}/reviews`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      }),
      fetch(`${baseURL}/refunds`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      }),
    ]);

    if (bookingsRes.status === 401 || reviewsRes.status === 401 || refundsRes.status === 401) {
      redirect("/sign-in");
    }

    if (!bookingsRes.ok) throw new Error("Không thể tải danh sách bookings");
    if (!reviewsRes.ok) throw new Error("Không thể tải danh sách reviews");
    if (!refundsRes.ok) throw new Error("Không thể tải danh sách refunds");

    const [bookingsJson, reviewsJson, refundsJson] = await Promise.all([
      bookingsRes.json(),
      reviewsRes.json(),
      refundsRes.json(),
    ]);

    bookingsData = bookingsJson?.data || [];
    reviewsData = reviewsJson?.data || [];
    refundsData = refundsJson?.data || [];
  } catch (err: any) {
    if (err?.digest?.startsWith("NEXT_REDIRECT")) {
      throw err;
    }
    error = err instanceof Error ? err.message : "Đã xảy ra lỗi không xác định";
  }

  return (
    <div className="space-y-6">
      {/* Title section with premium visual hierarchy */}
      <div className="flex flex-col gap-1.5 border-b border-slate-100 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Quản lý Booking Chuyến đi
        </h1>
        <p className="text-sm font-medium text-slate-500">
          Xem thông tin khách hàng đặt tour, danh sách hành khách đi cùng, xử lý yêu cầu hoàn tiền và kiểm duyệt đánh giá tour trực tiếp.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-4 text-sm text-rose-700">
          <p className="font-bold">Lỗi đồng bộ dữ liệu hệ thống</p>
          <p className="mt-1 text-xs text-rose-600/95">{error}</p>
        </div>
      )}

      {!error && (
        <BookingsTable
          initialBookings={bookingsData}
          initialReviews={reviewsData}
          initialRefunds={refundsData}
        />
      )}
    </div>
  );
}
