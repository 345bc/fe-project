"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import bookingService from "@/services/booking-service";

export default function UpdateBookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("id");

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [status, setStatus] = useState("PENDING");
  const [quantity, setQuantity] = useState(0);
  const [note, setNote] = useState("");

  useEffect(() => {
    if (!bookingId) { setError("Không tìm thấy ID booking"); setFetching(false); return; }
    const fetchBooking = async () => {
      try {
        const booking = await bookingService.getBookingById(bookingId);
        setStatus(booking.status || "PENDING");
        setQuantity(booking.quantity || 0);
        setNote(booking.note || "");
      } catch (err: any) { setError(err?.message || "Không thể tải thông tin booking"); } finally { setFetching(false); }
    };
    fetchBooking();
  }, [bookingId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); setLoading(true); setError(null); setSuccess(false);
    try {
      await bookingService.patchBooking(bookingId, { status, quantity, note });
      setSuccess(true);
      setTimeout(() => router.push("/bookings"), 1200);
    } catch (err: any) { setError(err?.message || "Cập nhật booking thất bại"); } finally { setLoading(false); }
  };

  if (fetching) {
    return (
      <div className="space-y-5">
        <div><div className="h-7 w-56 animate-pulse rounded-md bg-gray-200" /><div className="mt-2 h-4 w-80 animate-pulse rounded-md bg-gray-100" /></div>
        <div className="rounded-xl border border-gray-200 bg-white"><div className="space-y-5 px-6 py-6">{[1,2,3].map(i => (<div key={i} className="space-y-2"><div className="h-4 w-28 animate-pulse rounded bg-gray-200" /><div className="h-10 w-full animate-pulse rounded-lg bg-gray-100" /></div>))}</div></div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between">
        <div><h1 className="text-xl font-semibold text-gray-900">Cập nhật booking</h1><p className="mt-1 text-sm text-gray-500">Chỉnh sửa trạng thái đơn đặt tour</p></div>
        <button type="button" onClick={() => router.push("/bookings")} className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-3.5 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /></svg>Quay lại
        </button>
      </div>

      {success && (<div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"><p className="font-medium">Cập nhật thành công! Đang chuyển hướng...</p></div>)}
      {error && (<div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"><p className="font-medium">Lỗi</p><p className="mt-1 text-red-600">{error}</p></div>)}

      <div className="rounded-xl border border-gray-200 bg-white">
        <form onSubmit={handleSubmit}>
          <div className="space-y-5 px-6 py-6">
            <div className="flex items-center gap-2"><span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Booking ID</span><span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">#{bookingId}</span></div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Trạng thái</label>
              <select value={status} onChange={e => setStatus(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none">
                <option value="PENDING">PENDING</option><option value="CONFIRMED">CONFIRMED</option><option value="COMPLETED">COMPLETED</option><option value="CANCELLED">CANCELLED</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Số lượng</label>
              <input type="number" value={quantity} onChange={e => setQuantity(Number(e.target.value))} min="1" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Ghi chú</label>
              <textarea value={note} onChange={e => setNote(e.target.value)} rows={3} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none resize-y" />
            </div>
          </div>
          <div className="h-px bg-gray-200" />
          <div className="flex justify-end gap-3 px-6 py-4">
            <button type="button" onClick={() => router.push("/bookings")} className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">Hủy</button>
            <button type="submit" disabled={loading || success} className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50 transition-colors">{loading ? "Đang cập nhật..." : "Cập nhật"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
