import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import ToursTable, { Tour } from "@/components/ToursTable";

const baseURL = "http://localhost:8080";

export default async function TourPage() {
  let data = null;
  let error = null;

  try {
    const cookieStore = cookies();
    const token = (await cookieStore).get("access_token")?.value;

    if (!token) {
      redirect("/sign-in");
    }

    const res = await fetch(`${baseURL}/tours`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (res.status === 401) {
      redirect("/sign-in");
    }

    if (!res.ok) {
      const text = await res.text();
      console.error("RESPONSE:", text);
      throw new Error("Failed to fetch tours");
    }

    data = await res.json();
  } catch (err: any) {
    // redirect() throws a special NEXT_REDIRECT error — must re-throw it
    if (err?.digest?.startsWith("NEXT_REDIRECT")) {
      throw err;
    }
    error = err instanceof Error ? err.message : "Không thể tải danh sách tour";
  }

  const tour: Tour[] = data?.data || [];

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Tours</h1>
          <p className="mt-1 text-sm text-gray-500">
            Quản lý danh sách tour trong hệ thống
          </p>
        </div>

        <Link
          href="/tours/add"
          className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
        >
          Thêm Tour
        </Link>
      </div>

      {/* Error state */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <p className="font-medium">Lỗi tải dữ liệu</p>
          <p className="mt-1 text-red-600">{error}</p>
        </div>
      )}

      {/* Empty state */}
      {data && tour.length === 0 && (
        <div className="flex flex-col items-center py-16 text-center">
          <p className="text-sm font-medium text-gray-900">Chưa có tour nào</p>
          <p className="mt-1 text-sm text-gray-500">
            Bắt đầu bằng cách thêm tour đầu tiên.
          </p>
          <Link
            href="/tours/add"
            className="mt-4 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
          >
            Thêm Tour
          </Link>
        </div>
      )}

      {/* Table Component with Live Search Bar */}
      {data && tour.length > 0 && <ToursTable tours={tour} />}
    </div>
  );
}
