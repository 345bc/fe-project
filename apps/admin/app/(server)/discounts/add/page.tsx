"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import discountService from "@/services/discount-service";

export default function AddDiscountPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    try {
      await discountService.postDiscount({
        code: formData.get("code"),
        name: formData.get("name"),
        discountValue: Number(formData.get("discountValue")),
        startDate: formData.get("startDate"),
        endDate: formData.get("endDate"),
        maxUsage: formData.get("maxUsage") ? Number(formData.get("maxUsage")) : null,
        minQuantity: formData.get("minQuantity") ? Number(formData.get("minQuantity")) : null,
        minTotal: formData.get("minTotal") ? Number(formData.get("minTotal")) : null,
      });
      router.push("/discounts");
    } catch (err: any) {
      setError(err?.message || "Thêm mã giảm giá thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Thêm mã giảm giá mới</h1>
        <p className="mt-1 text-sm text-gray-500">Điền thông tin để tạo mã giảm giá</p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <p className="font-medium">Lỗi</p>
          <p className="mt-1 text-red-600">{error}</p>
        </div>
      )}

      <div className="rounded-xl border border-gray-200 bg-white">
        <form onSubmit={handleSubmit}>
          <div className="space-y-5 px-6 py-6">
            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Mã giảm giá</label>
                <input name="code" type="text" required placeholder="VD: SALE50" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Tên</label>
                <input name="name" type="text" required placeholder="Tên mã giảm giá" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Giá trị giảm giá</label>
              <input name="discountValue" type="number" required min="0" placeholder="0" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none" />
            </div>
            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Ngày bắt đầu</label>
                <input name="startDate" type="datetime-local" required className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Ngày kết thúc</label>
                <input name="endDate" type="datetime-local" required className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-5">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Số lần dùng tối đa</label>
                <input name="maxUsage" type="number" min="0" placeholder="Không giới hạn" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Số lượng tối thiểu</label>
                <input name="minQuantity" type="number" min="0" placeholder="0" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Tổng tiền tối thiểu</label>
                <input name="minTotal" type="number" min="0" placeholder="0" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none" />
              </div>
            </div>
          </div>
          <div className="h-px bg-gray-200" />
          <div className="flex justify-end gap-3 px-6 py-4">
            <button type="button" onClick={() => router.push("/discounts")} className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Hủy</button>
            <button type="submit" disabled={loading} className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50">{loading ? "Đang lưu..." : "Lưu"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
