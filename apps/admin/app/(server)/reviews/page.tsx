import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ReviewsTable from "@/components/ReviewsTable";

const baseURL = "http://localhost:8080";

export default async function ReviewsPage() {
  let reviewsData = [];
  let error = null;

  try {
    const cookieStore = cookies();
    const token = (await cookieStore).get("access_token")?.value;
    if (!token) redirect("/sign-in");

    const res = await fetch(`${baseURL}/reviews`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (res.status === 401) redirect("/sign-in");
    if (!res.ok) throw new Error("Không thể tải danh sách phản hồi");

    const json = await res.json();
    reviewsData = json?.data || [];
  } catch (err: any) {
    if (err?.digest?.startsWith("NEXT_REDIRECT")) throw err;
    error = err instanceof Error ? err.message : "Đã xảy ra lỗi không xác định";
  }

  return (
    <div className="space-y-6">
      {/* Title section with premium layout */}
      <div className="flex flex-col gap-1.5 border-b border-slate-100 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Đánh giá & Phản hồi
        </h1>
        <p className="text-sm font-medium text-slate-500">
          Quản lý và kiểm duyệt các đánh giá, phản hồi trải nghiệm chuyến đi từ khách hàng.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-4 text-sm text-rose-700">
          <p className="font-bold">Lỗi đồng bộ dữ liệu hệ thống</p>
          <p className="mt-1 text-xs text-rose-600/95">{error}</p>
        </div>
      )}

      {!error && (
        <ReviewsTable initialReviews={reviewsData} />
      )}
    </div>
  );
}
