"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import transportService from "@/services/transport-service";

export default function UpdateTransportPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const transportId = searchParams.get("id");

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [name, setName] = useState("");

  useEffect(() => {
    if (!transportId) { setError("Không tìm thấy ID"); setFetching(false); return; }
    const f = async () => {
      try {
        const c = await transportService.getTransportById(transportId);
        setName(c.name || "");
      } catch (err: any) { setError(err?.message || "Lỗi"); } finally { setFetching(false); }
    }; f();
  }, [transportId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); setLoading(true); setError(null); setSuccess(false);
    try {
      await transportService.patchTransport(transportId, { name });
      setSuccess(true); setTimeout(() => router.push("/transports"), 1200);
    } catch (err: any) { setError(err?.message || "Cập nhật thất bại"); } finally { setLoading(false); }
  };

  if (fetching) return (<div className="space-y-5"><div className="h-7 w-56 animate-pulse rounded-md bg-gray-200" /></div>);

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between">
        <div><h1 className="text-xl font-semibold text-gray-900">Cập nhật phương tiện</h1></div>
        <button onClick={() => router.push("/transports")} className="rounded-lg border border-gray-300 px-3.5 py-2 text-sm text-gray-700 hover:bg-gray-50">Quay lại</button>
      </div>
      {success && <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 font-medium">Cập nhật thành công!</div>}
      {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      <div className="rounded-xl border border-gray-200 bg-white max-w-2xl">
        <form onSubmit={handleSubmit}>
          <div className="space-y-5 px-6 py-6">
            <div className="space-y-1"><label className="text-sm font-medium text-gray-700">Tên</label><input value={name} onChange={e=>setName(e.target.value)} required className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none" /></div>
          </div>
          <div className="h-px bg-gray-200" />
          <div className="flex justify-end gap-3 px-6 py-4">
            <button type="button" onClick={() => router.push("/transports")} className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Hủy</button>
            <button type="submit" disabled={loading||success} className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50">{loading?"Đang cập nhật...":"Cập nhật"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
