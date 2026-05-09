import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import DeletePassengerButton from "@/components/DeletePassengerButton";

const baseURL = "http://localhost:8080";

export type Passenger = {
  id: number;
  fullName: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: string;
  type: string;
  booking: { id: number } | null;
};

export default async function PassengersPage() {
  let data = null;
  let error = null;

  try {
    const cookieStore = cookies();
    const token = (await cookieStore).get("access_token")?.value;
    if (!token) redirect("/sign-in");

    const res = await fetch(`${baseURL}/passengers`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (res.status === 401) redirect("/sign-in");
    if (!res.ok) throw new Error("Failed to fetch passengers");

    data = await res.json();
  } catch (err: any) {
    if (err?.digest?.startsWith("NEXT_REDIRECT")) throw err;
    error = err instanceof Error ? err.message : "Không thể tải danh sách hành khách";
  }

  const passengers: Passenger[] = data?.data || [];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Hành khách</h1>
          <p className="mt-1 text-sm text-gray-500">Quản lý danh sách hành khách (được đính kèm theo booking)</p>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <p className="font-medium">Lỗi tải dữ liệu</p>
          <p className="mt-1 text-red-600">{error}</p>
        </div>
      )}

      {data && passengers.length === 0 && (
        <div className="flex flex-col items-center py-16 text-center">
          <p className="text-sm font-medium text-gray-900">Chưa có hành khách nào</p>
        </div>
      )}

      {data && passengers.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Booking</th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Họ tên</th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">SĐT</th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Loại/Giới tính</th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Ngày sinh</th>
                <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {passengers.map((p: Passenger) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="whitespace-nowrap px-5 py-3.5 text-sm font-medium text-gray-900">#{p.booking?.id || "—"}</td>
                  <td className="whitespace-nowrap px-5 py-3.5 text-sm font-medium text-gray-900">{p.fullName}</td>
                  <td className="whitespace-nowrap px-5 py-3.5 text-sm text-gray-600">{p.phoneNumber || "—"}</td>
                  <td className="whitespace-nowrap px-5 py-3.5 text-sm text-gray-600">{p.type} / {p.gender}</td>
                  <td className="whitespace-nowrap px-5 py-3.5 text-sm text-gray-600">{p.dateOfBirth || "—"}</td>
                  <td className="whitespace-nowrap px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <DeletePassengerButton passengerId={p.id} passengerName={p.fullName} />
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
