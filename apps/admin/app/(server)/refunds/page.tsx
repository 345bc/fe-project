import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import DeleteRefundButton from "@/components/DeleteRefundButton";

const baseURL = "http://localhost:8080";

export type Refund = {
  id: number;
  amount: number;
  status: string;
  bookingId: number | null;
  createdAt: string;
};

export default async function RefundsPage() {
  let data = null;
  let error = null;

  try {
    const cookieStore = cookies();
    const token = (await cookieStore).get("access_token")?.value;
    if (!token) redirect("/sign-in");

    const res = await fetch(`${baseURL}/refunds`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (res.status === 401) redirect("/sign-in");
    if (!res.ok) throw new Error("Failed to fetch refunds");

    data = await res.json();
  } catch (err: any) {
    if (err?.digest?.startsWith("NEXT_REDIRECT")) throw err;
    error = err instanceof Error ? err.message : "Không thể tải danh sách hoàn tiền";
  }

  const refunds: Refund[] = data?.data || [];

  const statusColor = (status: string) => {
    switch (status) {
      case "PAID": return "bg-green-100 text-green-700";
      case "FAILED": return "bg-red-100 text-red-700";
      case "PENDING": return "bg-yellow-100 text-yellow-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Hoàn tiền</h1>
          <p className="mt-1 text-sm text-gray-500">Quản lý các yêu cầu hoàn tiền booking</p>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <p className="font-medium">Lỗi tải dữ liệu</p>
          <p className="mt-1 text-red-600">{error}</p>
        </div>
      )}

      {data && refunds.length === 0 && (
        <div className="flex flex-col items-center py-16 text-center">
          <p className="text-sm font-medium text-gray-900">Chưa có yêu cầu hoàn tiền nào</p>
        </div>
      )}

      {data && refunds.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">ID</th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Booking</th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Số tiền</th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Trạng thái</th>
                <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {refunds.map((r: Refund) => (
                <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                  <td className="whitespace-nowrap px-5 py-3.5 text-sm font-medium text-gray-900">#{r.id}</td>
                  <td className="whitespace-nowrap px-5 py-3.5 text-sm text-gray-600">#{r.bookingId || "—"}</td>
                  <td className="whitespace-nowrap px-5 py-3.5 text-sm font-medium text-gray-900">{Number(r.amount).toLocaleString("vi-VN")}₫</td>
                  <td className="whitespace-nowrap px-5 py-3.5">
                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor(r.status)}`}>{r.status}</span>
                  </td>
                  <td className="whitespace-nowrap px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/refunds/update?id=${r.id}`} className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors">Sửa</Link>
                      <DeleteRefundButton refundId={r.id} />
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
