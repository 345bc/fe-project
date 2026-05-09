import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import DeleteBookingButton from "@/components/DeleteBookingButton";

const baseURL = "http://localhost:8080";

export type Booking = {
  id: number;
  quantity: number;
  total_amount: number;
  status: string;
  note: string;
  phone_number: string;
  email: string;
  cancelled_at: string | null;
};

export default async function BookingsPage() {
  let data = null;
  let error = null;

  try {
    const cookieStore = cookies();
    const token = (await cookieStore).get("access_token")?.value;

    if (!token) {
      redirect("/sign-in");
    }

    const res = await fetch(`${baseURL}/bookings`, {
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
      throw new Error("Failed to fetch bookings");
    }

    data = await res.json();
  } catch (err: any) {
    if (err?.digest?.startsWith("NEXT_REDIRECT")) {
      throw err;
    }
    error = err instanceof Error ? err.message : "Không thể tải danh sách booking";
  }

  const bookings: Booking[] = data?.data || [];

  const statusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED": return "bg-green-100 text-green-700";
      case "CANCELLED": return "bg-red-100 text-red-700";
      case "COMPLETED": return "bg-blue-100 text-blue-700";
      default: return "bg-yellow-100 text-yellow-700";
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Booking</h1>
          <p className="mt-1 text-sm text-gray-500">
            Quản lý danh sách đặt tour trong hệ thống
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <p className="font-medium">Lỗi tải dữ liệu</p>
          <p className="mt-1 text-red-600">{error}</p>
        </div>
      )}

      {data && bookings.length === 0 && (
        <div className="flex flex-col items-center py-16 text-center">
          <p className="text-sm font-medium text-gray-900">Chưa có booking nào</p>
          <p className="mt-1 text-sm text-gray-500">Chưa có đơn đặt tour nào trong hệ thống.</p>
        </div>
      )}

      {data && bookings.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">ID</th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Số lượng</th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Tổng tiền</th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Trạng thái</th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">SĐT</th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Email</th>
                <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {bookings.map((booking: Booking) => (
                <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                  <td className="whitespace-nowrap px-5 py-3.5 text-sm font-medium text-gray-900">#{booking.id}</td>
                  <td className="whitespace-nowrap px-5 py-3.5 text-sm text-gray-600">{booking.quantity}</td>
                  <td className="whitespace-nowrap px-5 py-3.5 text-sm text-gray-600">{Number(booking.total_amount).toLocaleString("vi-VN")}₫</td>
                  <td className="whitespace-nowrap px-5 py-3.5">
                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-5 py-3.5 text-sm text-gray-600">{booking.phone_number || "—"}</td>
                  <td className="whitespace-nowrap px-5 py-3.5 text-sm text-gray-600">{booking.email || "—"}</td>
                  <td className="whitespace-nowrap px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/bookings/update?id=${booking.id}`} className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors">Sửa</Link>
                      <DeleteBookingButton bookingId={booking.id} />
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
