"use client";

import { useState } from "react";
import Link from "next/link";
import reviewService from "@/services/review-service";

export type Review = {
  id: number;
  rating: number;
  comment: string;
  status: string;
  createdAt: string;
  bookingId?: number | null;
  booking: {
    id: number;
    email: string;
    phone_number: string;
    user: {
      id: number;
      name: string;
      email: string;
    } | null;
    tourDetails: {
      departurePlace: string;
      departureDate: string;
      tour: {
        id: number;
        name: string;
        price: number;
      } | null;
    } | null;
  } | null;
};

interface ReviewsTableProps {
  initialReviews: Review[];
}

export default function ReviewsTable({ initialReviews }: ReviewsTableProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const handleToggleStatus = async (reviewId: number, currentStatus: string) => {
    const newStatus = currentStatus === "ACTIVE" ? "HIDDEN" : "ACTIVE";
    const loadingKey = `status-${reviewId}`;
    setActionLoading(loadingKey);
    try {
      const updated = await reviewService.patchReview(reviewId, { status: newStatus });
      setReviews((prev) =>
        prev.map((r) => (r.id === reviewId ? { ...r, status: updated.status } : r))
      );
    } catch (err: any) {
      alert(err.message || "Không thể cập nhật trạng thái đánh giá");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (reviewId: number) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa đánh giá #${reviewId}?`)) return;
    const loadingKey = `delete-${reviewId}`;
    setActionLoading(loadingKey);
    try {
      await reviewService.deleteReview(reviewId);
      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
    } catch (err: any) {
      alert(err.message || "Không thể xóa đánh giá");
    } finally {
      setActionLoading(null);
    }
  };

  const filteredReviews = reviews.filter((r) => {
    const tourName = r.booking?.tourDetails?.tour?.name || "";
    const customerName = r.booking?.user?.name || "";
    const customerEmail = r.booking?.email || "";
    const commentText = r.comment || "";
    const matchSearch =
      r.id.toString().includes(searchQuery) ||
      (r.booking?.id?.toString() || "").includes(searchQuery) ||
      tourName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      commentText.toLowerCase().includes(searchQuery.toLowerCase());

    const matchStatus = statusFilter === "ALL" || r.status === statusFilter;

    return matchSearch && matchStatus;
  });

  const getStatusBadge = (status: string) => {
    return status === "ACTIVE"
      ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
      : "bg-slate-100 text-slate-600 border border-slate-200/60";
  };

  const getStatusLabel = (status: string) => {
    return status === "ACTIVE" ? "Hiển thị" : "Bị ẩn";
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-md flex-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Tìm theo ID, booking, tên khách, tour, nhận xét..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-sm font-normal text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-slate-400 focus:bg-white"
          />
        </div>

        <div className="flex overflow-x-auto rounded-xl border border-slate-200 bg-slate-50/40 p-1">
          {["ALL", "ACTIVE", "HIDDEN"].map((status) => (
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

      {filteredReviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="rounded-full bg-slate-100 p-4 text-slate-400">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <p className="mt-4 text-sm font-semibold text-slate-800">Không tìm thấy đánh giá</p>
          <p className="mt-1 text-xs text-slate-400">Không có phản hồi nào khớp với từ khóa tìm kiếm.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50/60">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Đánh giá</th>
                <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Khách hàng</th>
                <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Tour & Chuyến đi</th>
                <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Rating</th>
                <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Nhận xét</th>
                <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Trạng thái</th>
                <th className="px-5 py-3 text-right text-xs font-bold uppercase tracking-wider text-slate-400">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredReviews.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="whitespace-nowrap px-5 py-4 text-sm font-bold text-slate-900">
                    #{r.id}
                    <div className="text-[10px] text-slate-400 font-normal">
                      Đơn #{r.booking?.id || r.bookingId || "—"}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="text-sm font-semibold text-slate-800">
                      {r.booking?.user?.name || "Khách vãng lai"}
                    </div>
                    <div className="text-xs text-slate-400 truncate max-w-[150px]">
                      {r.booking?.email || "—"}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="text-sm font-medium text-slate-800 line-clamp-1 max-w-[200px]">
                      {r.booking?.tourDetails?.tour?.name || "Tour không tồn tại"}
                    </div>
                    <div className="text-xs text-slate-400">
                      KH: {r.booking?.tourDetails?.departureDate || "—"}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">
                    <div className="flex items-center text-amber-400">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <span key={idx} className="text-sm">
                          {idx < r.rating ? "★" : "☆"}
                        </span>
                      ))}
                      <span className="ml-1 text-xs font-semibold text-slate-600">({r.rating})</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-xs text-slate-600 max-w-[250px] font-medium leading-relaxed italic">
                    <p className="line-clamp-2" title={r.comment}>
                      "{r.comment || "Không có nhận xét"}"
                    </p>
                  </td>
                  <td className="whitespace-nowrap px-5 py-4">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide ${getStatusBadge(
                        r.status
                      )}`}
                    >
                      {getStatusLabel(r.status)}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        disabled={actionLoading === `status-${r.id}`}
                        onClick={() => handleToggleStatus(r.id, r.status)}
                        className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all border ${
                          r.status === "ACTIVE"
                            ? "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                            : "bg-emerald-50 text-emerald-700 border-emerald-200/50 hover:bg-emerald-100"
                        }`}
                      >
                        {actionLoading === `status-${r.id}`
                          ? "Đang lưu..."
                          : r.status === "ACTIVE"
                          ? "Ẩn"
                          : "Hiện"}
                      </button>
                      <Link
                        href={`/reviews/update?id=${r.id}`}
                        className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all"
                      >
                        Sửa
                      </Link>
                      <button
                        disabled={actionLoading === `delete-${r.id}`}
                        onClick={() => handleDelete(r.id)}
                        className="rounded-lg border border-rose-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-all disabled:opacity-50"
                      >
                        {actionLoading === `delete-${r.id}` ? "Đang xóa..." : "Xóa"}
                      </button>
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
