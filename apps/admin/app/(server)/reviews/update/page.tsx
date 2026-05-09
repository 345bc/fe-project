"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import reviewService from "@/services/review-service";

export default function UpdateReviewPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reviewId = searchParams.get("id");

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState("ACTIVE");

  useEffect(() => {
    if (!reviewId) { setError("Không tìm thấy ID"); setFetching(false); return; }
    const f = async () => {
      try {
        const d = await reviewService.getReviewById(reviewId);
        setRating(d.rating || 5); setComment(d.comment || ""); setStatus(d.status || "ACTIVE");
      } catch (err: any) { setError(err?.message || "Lỗi"); } finally { setFetching(false); }
    }; f();
  }, [reviewId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); setLoading(true); setError(null); setSuccess(false);
    try {
      await reviewService.patchReview(reviewId, { rating, comment, status });
      setSuccess(true); setTimeout(() => router.push("/reviews"), 1200);
    } catch (err: any) { setError(err?.message || "Cập nhật thất bại"); } finally { setLoading(false); }
  };

  if (fetching) return (<div className="space-y-5"><div className="h-7 w-56 animate-pulse rounded-md bg-gray-200" /></div>);

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between">
        <div><h1 className="text-xl font-semibold text-gray-900">Cập nhật Đánh giá</h1></div>
        <button onClick={() => router.push("/reviews")} className="rounded-lg border border-gray-300 px-3.5 py-2 text-sm text-gray-700 hover:bg-gray-50">Quay lại</button>
      </div>
      {success && <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 font-medium">Cập nhật thành công!</div>}
      {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      <div className="rounded-xl border border-gray-200 bg-white max-w-2xl">
        <form onSubmit={handleSubmit}>
          <div className="space-y-5 px-6 py-6">
            <div className="flex items-center gap-2"><span className="text-xs font-medium text-gray-500 uppercase tracking-wide">ID</span><span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">#{reviewId}</span></div>
            <div className="space-y-1"><label className="text-sm font-medium text-gray-700">Rating (1-5)</label><input type="number" min="1" max="5" value={rating} onChange={e=>setRating(Number(e.target.value))} required className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none" /></div>
            <div className="space-y-1"><label className="text-sm font-medium text-gray-700">Nhận xét</label><textarea value={comment} onChange={e=>setComment(e.target.value)} rows={3} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none resize-y" /></div>
            <div className="space-y-1"><label className="text-sm font-medium text-gray-700">Trạng thái</label><select value={status} onChange={e=>setStatus(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none"><option value="ACTIVE">ACTIVE</option><option value="HIDDEN">HIDDEN</option></select></div>
          </div>
          <div className="h-px bg-gray-200" />
          <div className="flex justify-end gap-3 px-6 py-4">
            <button type="button" onClick={() => router.push("/reviews")} className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Hủy</button>
            <button type="submit" disabled={loading||success} className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50">{loading?"Đang cập nhật...":"Cập nhật"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
