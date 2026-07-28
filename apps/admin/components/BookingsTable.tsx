"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import bookingService from "@/services/booking-service";
import reviewService from "@/services/review-service";
import tokenBearer from "@/lib/bearer-token";

export type Booking = {
  id: number;
  quantity: number;
  total_amount: number;
  status: string;
  note: string;
  phone_number: string;
  email: string;
  cancelled_at: string | null;
  createdAt: string;
  user: {
    id: number;
    name: string;
    email: string;
  } | null;
  tourDetails: {
    id: number;
    departurePlace: string;
    departureDate: string;
    seatsAvailable: number;
    maxSeats: number;
    status: string;
    image: string;
    tour: {
      id: number;
      name: string;
      price: number;
      image: string;
    } | null;
  } | null;
  passengers: Array<{
    id: number;
    fullName: string;
    phoneNumber: string;
    dateOfBirth: string;
    gender: string;
    type: string | null;
  }>;
  discount: {
    id: number;
    code: string;
    name: string;
    discountValue: number;
  } | null;
  discount_amount: number;
};

export type Review = {
  id: number;
  rating: number;
  comment: string;
  status: string;
  booking: { id: number } | null;
  bookingId: number | null;
  createdAt: string;
};

export type Refund = {
  id: number;
  amount: number;
  status: string;
  bookingId: number | null;
  createdAt: string;
};

interface BookingsTableProps {
  initialBookings: Booking[];
  initialReviews: Review[];
  initialRefunds: Refund[];
}

export default function BookingsTable({
  initialBookings,
  initialReviews,
  initialRefunds,
}: BookingsTableProps) {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [refunds, setRefunds] = useState<Refund[]>(initialRefunds);

  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isPending, startTransition] = useTransition();
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Quick booking status update
  const handleUpdateStatus = async (bookingId: number, newStatus: string) => {
    const loadingKey = `booking-${bookingId}-${newStatus}`;
    setActionLoading(loadingKey);
    try {
      let updated: Booking;
      if (newStatus === "CANCELLED") {
        // Use full cancellation PUT logic to restore seats & issue refund
        const res = await tokenBearer.put(`/bookings/${bookingId}/cancel`);
        updated = res.data.data;
        // Fetch new refunds list in background
        const refRes = await tokenBearer.get("/refunds");
        if (refRes.data?.data) {
          setRefunds(refRes.data.data);
        }
      } else {
        updated = await bookingService.patchBooking(bookingId, { status: newStatus });
      }

      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, ...updated } : b))
      );
    } catch (err: any) {
      alert(err.message || `Cập nhật trạng thái sang ${newStatus} thất bại`);
    } finally {
      setActionLoading(null);
    }
  };

  // Quick review status toggle
  const handleToggleReviewStatus = async (reviewId: number, currentStatus: string) => {
    const newStatus = currentStatus === "ACTIVE" ? "HIDDEN" : "ACTIVE";
    const loadingKey = `review-${reviewId}`;
    setActionLoading(loadingKey);
    try {
      const updated = await reviewService.patchReview(reviewId, { status: newStatus });
      setReviews((prev) =>
        prev.map((r) => (r.id === reviewId ? { ...r, status: updated.status } : r))
      );
    } catch (err: any) {
      alert(err.message || "Thay đổi trạng thái đánh giá thất bại");
    } finally {
      setActionLoading(null);
    }
  };

  // Quick delete booking handler
  const handleDeleteBooking = async (bookingId: number) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa đơn đặt hàng #${bookingId}?`)) return;
    const loadingKey = `delete-${bookingId}`;
    setActionLoading(loadingKey);
    try {
      await bookingService.deleteBooking(bookingId);
      setBookings((prev) => prev.filter((b) => b.id !== bookingId));
      if (expandedId === bookingId) setExpandedId(null);
    } catch (err: any) {
      alert(err.message || "Xóa booking thất bại");
    } finally {
      setActionLoading(null);
    }
  };

  // Filters
  const filteredBookings = bookings.filter((booking) => {
    const customerName = booking.user?.name || "";
    const customerEmail = booking.email || "";
    const customerPhone = booking.phone_number || "";
    const tourName = booking.tourDetails?.tour?.name || "";
    const matchSearch =
      booking.id.toString().includes(searchQuery) ||
      customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customerPhone.includes(searchQuery) ||
      tourName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchStatus = statusFilter === "ALL" || booking.status === statusFilter;

    return matchSearch && matchStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-emerald-50 text-emerald-700 border border-emerald-200/60";
      case "CANCELLED":
        return "bg-rose-50 text-rose-700 border border-rose-200/60";
      case "COMPLETED":
        return "bg-indigo-50 text-indigo-700 border border-indigo-200/60";
      default:
        return "bg-amber-50 text-amber-700 border border-amber-200/60";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "Đã xác nhận";
      case "CANCELLED":
        return "Đã hủy";
      case "COMPLETED":
        return "Hoàn thành";
      default:
        return "Chờ thanh toán";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header controls with modern typography and rhythm */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-md flex-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Tìm theo ID, tên khách, email, SĐT hoặc tên tour..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-sm font-normal text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-slate-400 focus:bg-white"
          />
        </div>

        {/* Filter status tabs */}
        <div className="flex overflow-x-auto rounded-xl border border-slate-200 bg-slate-50/40 p-1">
          {["ALL", "PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`whitespace-nowrap rounded-lg px-4 py-1.5 text-xs font-semibold tracking-wide transition-all ${
                statusFilter === status
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {status === "ALL" ? "Tất cả" : getStatusLabel(status)}
            </button>
          ))}
        </div>
      </div>

      {filteredBookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="rounded-full bg-slate-100 p-4 text-slate-400">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p className="mt-4 text-sm font-semibold text-slate-800">Không tìm thấy booking</p>
          <p className="mt-1 text-xs text-slate-400">Không có đơn đặt tour nào khớp với bộ lọc hiện tại.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50/60">
              <tr>
                <th className="w-12 px-4 py-3"></th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Đơn hàng</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Khách hàng</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Tour đặt</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Tổng thanh toán</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Trạng thái</th>
                <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider text-slate-400">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBookings.map((booking) => {
                const isExpanded = expandedId === booking.id;
                const associatedReview = reviews.find(
                  (r) => r.bookingId === booking.id || r.booking?.id === booking.id
                );
                const associatedRefund = refunds.find((rf) => rf.bookingId === booking.id);

                return (
                  <React.Fragment key={booking.id}>
                    {/* Row header */}
                    <tr
                      onClick={() => toggleExpand(booking.id)}
                      className={`cursor-pointer transition-colors hover:bg-slate-50/80 ${
                        isExpanded ? "bg-slate-50/50" : ""
                      }`}
                    >
                      <td className="px-4 py-4 text-center">
                        <button className="text-slate-400 hover:text-slate-600">
                          <svg
                            className={`h-4 w-4 transform transition-transform duration-200 ${
                              isExpanded ? "rotate-180" : ""
                            }`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      </td>
                      <td className="whitespace-nowrap px-4 py-4">
                        <div className="text-sm font-bold text-slate-900">#{booking.id}</div>
                        <div className="text-[10px] text-slate-400">
                          {booking.createdAt ? new Date(booking.createdAt).toLocaleDateString("vi-VN") : "—"}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm font-semibold text-slate-800">
                          {booking.user?.name || "Khách vãng lai"}
                        </div>
                        <div className="text-xs text-slate-400 truncate max-w-[180px]">
                          {booking.email || "—"}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm font-medium text-slate-800 truncate max-w-[220px]">
                          {booking.tourDetails?.tour?.name || "Chưa chọn Tour"}
                        </div>
                        <div className="text-xs text-slate-400">
                          {booking.quantity} người • KH: {booking.tourDetails?.departureDate || "—"}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-4">
                        <div className="text-sm font-bold text-slate-900">
                          {Number(booking.total_amount).toLocaleString("vi-VN")}₫
                        </div>
                        {booking.discount_amount > 0 && (
                          <div className="text-[10px] font-semibold text-emerald-600">
                            Đã giảm {Number(booking.discount_amount).toLocaleString("vi-VN")}₫
                          </div>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4">
                        <span
                          className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide ${getStatusBadge(
                            booking.status
                          )}`}
                        >
                          {getStatusLabel(booking.status)}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/bookings/update?id=${booking.id}`}
                            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-all"
                          >
                            Sửa
                          </Link>
                          <button
                            disabled={actionLoading === `delete-${booking.id}`}
                            onClick={() => handleDeleteBooking(booking.id)}
                            className="rounded-lg border border-rose-200 bg-white px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-all disabled:opacity-50"
                          >
                            {actionLoading === `delete-${booking.id}` ? "Đang xóa..." : "Xóa"}
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Collapsible Details - Progressive Disclosure */}
                    {isExpanded && (
                      <tr>
                        <td colSpan={7} className="p-0 bg-slate-50/30">
                          <div className="border-t border-slate-100 px-6 py-6 transition-all duration-300">
                            {/* Modern multi-column layout without redundant panels */}
                            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                              
                              {/* Left Panel - Tour & Customer info */}
                              <div className="space-y-6 lg:col-span-8">
                                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                  
                                  {/* Tour Details Box */}
                                  <div className="rounded-xl border border-slate-200/80 bg-white p-4.5">
                                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                      Thông tin Chuyến đi
                                    </div>
                                    <div className="mt-3 flex gap-3">
                                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-100 border border-slate-200">
                                        <img
                                          src={
                                            booking.tourDetails?.image
                                              ? `/images/${booking.tourDetails.image}`
                                              : booking.tourDetails?.tour?.image
                                              ? `/images/${booking.tourDetails.tour.image}`
                                              : "/images/placeholder.jpg"
                                          }
                                          alt="Tour image"
                                          className="h-full w-full object-cover"
                                          onError={(e) => {
                                            (e.target as HTMLImageElement).src = "/images/placeholder.jpg";
                                          }}
                                        />
                                      </div>
                                      <div>
                                        <h4 className="text-sm font-bold text-slate-800 line-clamp-1">
                                          {booking.tourDetails?.tour?.name || "Chưa có tên tour"}
                                        </h4>
                                        <p className="mt-1 text-xs text-slate-500">
                                          Điểm đi: <span className="font-semibold text-slate-700">{booking.tourDetails?.departurePlace || "—"}</span>
                                        </p>
                                        <p className="text-xs text-slate-500">
                                          Khởi hành: <span className="font-semibold text-slate-700">{booking.tourDetails?.departureDate || "—"}</span>
                                        </p>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Contact Profile Box */}
                                  <div className="rounded-xl border border-slate-200/80 bg-white p-4.5">
                                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                      Thông tin Người liên hệ
                                    </div>
                                    <div className="mt-3 space-y-1.5 text-xs">
                                      <div className="flex justify-between">
                                        <span className="text-slate-400">Tên tài khoản:</span>
                                        <span className="font-semibold text-slate-700">{booking.user?.name || "Khách vãng lai"}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-slate-400">Email liên hệ:</span>
                                        <span className="font-semibold text-slate-700 select-all">{booking.email || "—"}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-slate-400">Số điện thoại:</span>
                                        <span className="font-semibold text-slate-700 select-all">{booking.phone_number || "—"}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Passengers List Box */}
                                <div className="rounded-xl border border-slate-200/80 bg-white p-5">
                                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                    Danh sách Hành khách đi cùng ({booking.passengers?.length || 0})
                                  </h4>
                                  {booking.passengers && booking.passengers.length > 0 ? (
                                    <div className="mt-3 overflow-hidden rounded-lg border border-slate-100">
                                      <table className="min-w-full divide-y divide-slate-100 text-left text-xs">
                                        <thead className="bg-slate-50/50">
                                          <tr>
                                            <th className="px-3 py-2 font-bold text-slate-500">Họ tên</th>
                                            <th className="px-3 py-2 font-bold text-slate-500">Số điện thoại</th>
                                            <th className="px-3 py-2 font-bold text-slate-500">Giới tính</th>
                                            <th className="px-3 py-2 font-bold text-slate-500">Ngày sinh</th>
                                            <th className="px-3 py-2 font-bold text-slate-500">Loại vé</th>
                                          </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                          {booking.passengers.map((p) => (
                                            <tr key={p.id} className="hover:bg-slate-50/30">
                                              <td className="px-3 py-2.5 font-semibold text-slate-800">{p.fullName}</td>
                                              <td className="px-3 py-2.5 text-slate-500">{p.phoneNumber || "—"}</td>
                                              <td className="px-3 py-2.5 text-slate-500">{p.gender}</td>
                                              <td className="px-3 py-2.5 text-slate-500">{p.dateOfBirth || "—"}</td>
                                              <td className="px-3 py-2.5 text-slate-500">
                                                <span className="inline-block rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600">
                                                  {p.type || "Vé thường"}
                                                </span>
                                              </td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  ) : (
                                    <p className="mt-3 text-xs text-slate-400 italic">Không có danh sách hành khách đi kèm.</p>
                                  )}
                                </div>
                              </div>

                              {/* Right Panel - Payments, Discounts, Refunds & Reviews */}
                              <div className="space-y-6 lg:col-span-4">
                                
                                {/* Payments & Discount Box */}
                                <div className="rounded-xl border border-slate-200/80 bg-white p-5 space-y-4">
                                  <div>
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                      Thanh toán & Chiết khấu
                                    </h4>
                                    <div className="mt-3 space-y-2 text-xs">
                                      <div className="flex justify-between">
                                        <span className="text-slate-400">Số lượng ghế:</span>
                                        <span className="font-semibold text-slate-800">{booking.quantity} người</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-slate-400">Đơn giá Tour:</span>
                                        <span className="font-semibold text-slate-800">
                                          {Number(booking.tourDetails?.tour?.price || 0).toLocaleString("vi-VN")}₫
                                        </span>
                                      </div>
                                      {booking.discount && (
                                        <div className="flex justify-between text-emerald-600 font-medium">
                                          <span>Mã KM ({booking.discount.code}):</span>
                                          <span>-{Number(booking.discount_amount).toLocaleString("vi-VN")}₫</span>
                                        </div>
                                      )}
                                      <div className="h-px bg-slate-100" />
                                      <div className="flex justify-between text-sm font-bold text-slate-900">
                                        <span>Tổng tiền:</span>
                                        <span>{Number(booking.total_amount).toLocaleString("vi-VN")}₫</span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Refund status box if cancelled */}
                                  {associatedRefund && (
                                    <div className="rounded-lg bg-orange-50 border border-orange-200/50 p-3">
                                      <div className="text-[10px] font-bold uppercase tracking-wider text-orange-600">
                                        Yêu cầu Hoàn tiền
                                      </div>
                                      <div className="mt-1.5 flex items-center justify-between text-xs">
                                        <span className="font-bold text-orange-700">
                                          {Number(associatedRefund.amount).toLocaleString("vi-VN")}₫
                                        </span>
                                        <span
                                          className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
                                            associatedRefund.status === "PAID"
                                              ? "bg-green-100 text-green-800"
                                              : associatedRefund.status === "FAILED"
                                              ? "bg-red-100 text-red-800"
                                              : "bg-yellow-100 text-yellow-800"
                                          }`}
                                        >
                                          {associatedRefund.status === "PAID"
                                            ? "Đã hoàn tiền"
                                            : associatedRefund.status === "FAILED"
                                            ? "Thất bại"
                                            : "Đang chờ duyệt"}
                                        </span>
                                      </div>
                                    </div>
                                  )}
                                </div>

                                {/* Review Box */}
                                <div className="rounded-xl border border-slate-200/80 bg-white p-5">
                                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                    Đánh giá & Nhận xét
                                  </h4>
                                  {associatedReview ? (
                                    <div className="mt-3 space-y-3">
                                      <div className="flex items-center gap-2">
                                        <div className="flex text-amber-400">
                                          {Array.from({ length: 5 }).map((_, i) => (
                                            <span key={i} className="text-sm">
                                              {i < associatedReview.rating ? "★" : "☆"}
                                            </span>
                                          ))}
                                        </div>
                                        <span className="text-xs font-semibold text-slate-600">
                                          ({associatedReview.rating}/5)
                                        </span>
                                      </div>
                                      <p className="text-xs text-slate-600 bg-slate-50 rounded-lg p-2.5 italic">
                                        "{associatedReview.comment || "Không có nội dung nhận xét"}"
                                      </p>
                                      
                                      {/* Quick review status approval toggle */}
                                      <div className="flex items-center justify-between">
                                        <span className="text-[11px] text-slate-400">
                                          Trạng thái hiển thị:{" "}
                                          <span
                                            className={`font-semibold ${
                                              associatedReview.status === "ACTIVE"
                                                ? "text-emerald-600"
                                                : "text-slate-500"
                                            }`}
                                          >
                                            {associatedReview.status === "ACTIVE" ? "Đang Hiện" : "Đang Ẩn"}
                                          </span>
                                        </span>
                                        <button
                                          disabled={actionLoading === `review-${associatedReview.id}`}
                                          onClick={() =>
                                            handleToggleReviewStatus(
                                              associatedReview.id,
                                              associatedReview.status
                                            )
                                          }
                                          className={`rounded-lg px-2.5 py-1 text-[10px] font-bold transition-all border ${
                                            associatedReview.status === "ACTIVE"
                                              ? "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                                              : "bg-emerald-50 text-emerald-700 border-emerald-200/50 hover:bg-emerald-100"
                                          }`}
                                        >
                                          {actionLoading === `review-${associatedReview.id}`
                                            ? "Đang lưu..."
                                            : associatedReview.status === "ACTIVE"
                                            ? "Ẩn phản hồi"
                                            : "Hiện phản hồi"}
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <p className="mt-3 text-xs text-slate-400 italic">Chưa có đánh giá nào cho chuyến đi này.</p>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Divider & Direct inline booking controls */}
                            <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                              <div className="text-xs text-slate-400">
                                Ghi chú khách đặt: <span className="font-medium text-slate-600 italic">"{booking.note || "Không có ghi chú"}"</span>
                              </div>
                              <div className="flex items-center gap-2">
                                {booking.status === "PENDING" && (
                                  <>
                                    <button
                                      disabled={actionLoading !== null}
                                      onClick={() => handleUpdateStatus(booking.id, "CONFIRMED")}
                                      className="rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 transition-all disabled:opacity-50"
                                    >
                                      {actionLoading === `booking-${booking.id}-CONFIRMED`
                                        ? "Đang lưu..."
                                        : "Xác nhận Thanh toán"}
                                    </button>
                                    <button
                                      disabled={actionLoading !== null}
                                      onClick={() => handleUpdateStatus(booking.id, "CANCELLED")}
                                      className="rounded-lg bg-rose-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-rose-700 transition-all disabled:opacity-50"
                                    >
                                      {actionLoading === `booking-${booking.id}-CANCELLED`
                                        ? "Đang hủy..."
                                        : "Hủy đơn hàng"}
                                    </button>
                                  </>
                                )}

                                {booking.status === "CONFIRMED" && (
                                  <>
                                    <button
                                      disabled={actionLoading !== null}
                                      onClick={() => handleUpdateStatus(booking.id, "COMPLETED")}
                                      className="rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-indigo-700 transition-all disabled:opacity-50"
                                    >
                                      {actionLoading === `booking-${booking.id}-COMPLETED`
                                        ? "Đang lưu..."
                                        : "Hoàn thành chuyến đi"}
                                    </button>
                                    <button
                                      disabled={actionLoading !== null}
                                      onClick={() => handleUpdateStatus(booking.id, "CANCELLED")}
                                      className="rounded-lg bg-rose-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-rose-700 transition-all disabled:opacity-50"
                                    >
                                      {actionLoading === `booking-${booking.id}-CANCELLED`
                                        ? "Đang hủy..."
                                        : "Hủy đơn hàng"}
                                    </button>
                                  </>
                                )}

                                {booking.status === "CANCELLED" && (
                                  <span className="text-xs font-semibold text-rose-500 bg-rose-50 border border-rose-100 rounded-lg px-2.5 py-1">
                                    Đơn đặt đã bị hủy
                                  </span>
                                )}

                                {booking.status === "COMPLETED" && (
                                  <span className="text-xs font-semibold text-indigo-500 bg-indigo-50 border border-indigo-100 rounded-lg px-2.5 py-1">
                                    Chuyến đi đã hoàn tất thành công
                                  </span>
                                )}
                              </div>
                            </div>

                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// Global React import fix for older TypeScript setups if needed
import React from "react";
