"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import discountService from "@/services/discount-service";

export default function UpdateDiscountPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const discountId = searchParams.get("id");

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [discountValue, setDiscountValue] = useState(0);
  const [status, setStatus] = useState("ACTIVE");

  useEffect(() => {
    if (!discountId) { setError("Không tìm thấy ID"); setFetching(false); return; }
    const fetchData = async () => {
      try {
        const d = await discountService.getDiscountById(discountId);
        setCode(d.code || ""); setName(d.name || ""); setDiscountValue(d.discountValue || 0); setStatus(d.status || "ACTIVE");
      } catch (err: any) { setError(err?.message || "Không thể tải thông tin"); } finally { setFetching(false); }
    };
    fetchData();
  }, [discountId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); setLoading(true); setError(null); setSuccess(false);
    try {
      await discountService.patchDiscount(discountId, { code, name, discountValue, status });
      setSuccess(true); setTimeout(() => router.push("/discounts"), 1200);
    } catch (err: any) { setError(err?.message || "Cập nhật thất bại"); } finally { setLoading(false); }
  };

  if (fetching) {
    return (<div className="space-y-5"><div><div className="h-7 w-56 animate-pulse rounded-md bg-gray-200" /><div className="mt-2 h-4 w-80 animate-pulse rounded-md bg-gray-100" /></div><div className="rounded-xl border border-gray-200 bg-white"><div className="space-y-5 px-6 py-6">{[1,2,3,4].map(i => (<div key={i} className="space-y-2"><div className="h-4 w-28 animate-pulse rounded bg-gray-200" /><div className="h-10 w-full animate-pulse rounded-lg bg-gray-100" /></div>))}</div></div></div>);
  }

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between">
        <div><h1 className="text-xl font-semibold text-gray-900">Cập nhật mã giảm giá</h1><p className="mt-1 text-sm text-gray-500">Chỉnh sửa thông tin mã giảm giá</p></div>
        <button type="button" onClick={() => router.push("/discounts")} className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-3.5 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"><svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /></svg>Quay lại</button>
      </div>
      {success && (<div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"><p className="font-medium">Cập nhật thành công!</p></div>)}
      {error && (<div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"><p className="font-medium">Lỗi</p><p className="mt-1 text-red-600">{error}</p></div>)}
      <div className="rounded-xl border border-gray-200 bg-white">
        <form onSubmit={handleSubmit}>
          <div className="space-y-5 px-6 py-6">
            <div className="flex items-center gap-2"><span className="text-xs font-medium text-gray-500 uppercase tracking-wide">ID</span><span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">#{discountId}</span></div>
            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-1"><label className="text-sm font-medium text-gray-700">Mã</label><input value={code} onChange={e => setCode(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none" /></div>
              <div className="space-y-1"><label className="text-sm font-medium text-gray-700">Tên</label><input value={name} onChange={e => setName(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none" /></div>
            </div>
            <div className="space-y-1"><label className="text-sm font-medium text-gray-700">Giá trị giảm giá</label><input type="number" value={discountValue} onChange={e => setDiscountValue(Number(e.target.value))} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none" /></div>
            <div className="space-y-1"><label className="text-sm font-medium text-gray-700">Trạng thái</label><select value={status} onChange={e => setStatus(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none"><option value="ACTIVE">ACTIVE</option><option value="INACTIVE">INACTIVE</option><option value="EXPIRED">EXPIRED</option></select></div>
          </div>
          <div className="h-px bg-gray-200" />
          <div className="flex justify-end gap-3 px-6 py-4">
            <button type="button" onClick={() => router.push("/discounts")} className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Hủy</button>
            <button type="submit" disabled={loading||success} className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50">{loading ? "Đang cập nhật..." : "Cập nhật"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
