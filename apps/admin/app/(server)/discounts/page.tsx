import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import DeleteDiscountButton from "@/components/DeleteDiscountButton";

const baseURL = "http://localhost:8080";

export type Discount = {
  id: number;
  code: string;
  name: string;
  discountValue: number;
  startDate: string;
  endDate: string;
  maxUsage: number | null;
  usedCount: number;
  status: string;
};

export default async function DiscountsPage() {
  let data = null;
  let error = null;

  try {
    const cookieStore = cookies();
    const token = (await cookieStore).get("access_token")?.value;

    if (!token) {
      redirect("/sign-in");
    }

    const res = await fetch(`${baseURL}/discounts`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (res.status === 401) redirect("/sign-in");

    if (!res.ok) {
      const text = await res.text();
      console.error("RESPONSE:", text);
      throw new Error("Failed to fetch discounts");
    }

    data = await res.json();
  } catch (err: any) {
    if (err?.digest?.startsWith("NEXT_REDIRECT")) throw err;
    error = err instanceof Error ? err.message : "Không thể tải danh sách mã giảm giá";
  }

  const discounts: Discount[] = data?.data || [];

  const statusColor = (status: string) => {
    switch (status) {
      case "ACTIVE": return "bg-green-100 text-green-700";
      case "EXPIRED": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Mã giảm giá</h1>
          <p className="mt-1 text-sm text-gray-500">Quản lý danh sách mã giảm giá trong hệ thống</p>
        </div>
        <Link href="/discounts/add" className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors">Thêm mã giảm giá</Link>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <p className="font-medium">Lỗi tải dữ liệu</p>
          <p className="mt-1 text-red-600">{error}</p>
        </div>
      )}

      {data && discounts.length === 0 && (
        <div className="flex flex-col items-center py-16 text-center">
          <p className="text-sm font-medium text-gray-900">Chưa có mã giảm giá nào</p>
          <p className="mt-1 text-sm text-gray-500">Bắt đầu bằng cách thêm mã giảm giá đầu tiên.</p>
          <Link href="/discounts/add" className="mt-4 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors">Thêm mã giảm giá</Link>
        </div>
      )}

      {data && discounts.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Mã</th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Tên</th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Giá trị</th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Đã dùng</th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Trạng thái</th>
                <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {discounts.map((d: Discount) => (
                <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                  <td className="whitespace-nowrap px-5 py-3.5 text-sm font-mono font-medium text-gray-900">{d.code}</td>
                  <td className="whitespace-nowrap px-5 py-3.5 text-sm text-gray-600">{d.name}</td>
                  <td className="whitespace-nowrap px-5 py-3.5 text-sm text-gray-600">{Number(d.discountValue).toLocaleString("vi-VN")}₫</td>
                  <td className="whitespace-nowrap px-5 py-3.5 text-sm text-gray-600">{d.usedCount}{d.maxUsage ? `/${d.maxUsage}` : ""}</td>
                  <td className="whitespace-nowrap px-5 py-3.5">
                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor(d.status)}`}>{d.status}</span>
                  </td>
                  <td className="whitespace-nowrap px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/discounts/update?id=${d.id}`} className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors">Sửa</Link>
                      <DeleteDiscountButton discountId={d.id} discountName={d.name} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
