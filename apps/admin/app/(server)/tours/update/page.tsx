"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from "next/navigation";
import tourService from "@/services/tour-service";
import tokenBearer from "@/lib/bearer-token";
import ImageUpload from "@/components/ui/ImageUpload";

function UpdateTourPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tourId = searchParams.get("id");

  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState("");
  const [duration, setDuration] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [destinationId, setDestinationId] = useState("");
  const [transId, setTransId] = useState("");

  // Options states
  const [categories, setCategories] = useState<any[]>([]);
  const [destinations, setDestinations] = useState<any[]>([]);
  const [transports, setTransports] = useState<any[]>([]);

  const tourStatuses = [
    "DRAFT",
    "PENDING",
    "ACTIVE",
    "SCHEDULED",
    "SOLD_OUT",
    "CANCELLED",
    "COMPLETED",
    "ARCHIVED",
  ];

  useEffect(() => {
    if (!tourId) {
      setError("Không tìm thấy mã Tour");
      setFetching(false);
      return;
    }

    const loadData = async () => {
      try {
        const [catRes, destRes, transRes, tourData] = await Promise.all([
          tokenBearer.get("/categories"),
          tokenBearer.get("/destinations"),
          tokenBearer.get("/transports"),
          tourService.getTourById(Number(tourId)),
        ]);

        setCategories(catRes.data.data || []);
        setDestinations(destRes.data.data || []);
        setTransports(transRes.data.data || []);

        if (tourData) {
          setName(tourData.name || "");
          setPrice(String(tourData.price || ""));
          setStatus(tourData.status || "");
          setDuration(tourData.duration || "");
          setDescription(tourData.description || "");
          setImage(tourData.image || "");
          setCategoryId(String(tourData.categories?.id || ""));
          setDestinationId(String(tourData.destination?.id || ""));
          setTransId(String(tourData.transports?.id || ""));
        }
      } catch (err: any) {
        console.error("Lỗi tải thông tin Tour:", err);
        setError("Không thể tải thông tin tour hoặc danh sách cấu hình.");
      } finally {
        setFetching(false);
      }
    };

    loadData();
  }, [tourId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!image) {
      setError("Vui lòng tải ảnh lên trước khi lưu.");
      return;
    }
    if (!categoryId || !destinationId || !transId) {
      setError("Vui lòng chọn đầy đủ Danh mục, Điểm đến và Phương tiện.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await tourService.patchTour(Number(tourId), {
        name,
        price: Number(price),
        status,
        duration,
        description,
        image,
        category_id: Number(categoryId),
        destination_id: Number(destinationId),
        trans_id: Number(transId),
      });
      setSuccess(true);
      setTimeout(() => router.push("/tours"), 1200);
    } catch (err: any) {
      setError(err?.message || "Cập nhật tour thất bại");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="space-y-5">
        <div className="h-7 w-48 animate-pulse rounded-md bg-gray-200" />
        <div className="h-96 w-full animate-pulse rounded-xl bg-gray-100" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Cập nhật Tour</h1>
          <p className="mt-1 text-sm text-gray-500">Chỉnh sửa thông tin chi tiết tour du lịch</p>
        </div>
        <button
          onClick={() => router.push("/tours")}
          className="rounded-lg border border-gray-300 px-3.5 py-2 text-sm text-gray-700 hover:bg-gray-50"
        >
          Quay lại
        </button>
      </div>

      {success && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 font-medium">
          Cập nhật Tour thành công!
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <p className="font-medium">Lỗi</p>
          <p className="mt-1 text-red-600">{error}</p>
        </div>
      )}

      <div className="rounded-xl border border-gray-200 bg-white max-w-3xl">
        <form onSubmit={handleSubmit}>
          <div className="space-y-5 px-6 py-6">
            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-1 col-span-2">
                <label className="text-sm font-medium text-gray-700">Tên Tour</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tên Tour"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Giá bán (VNĐ)</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Giá bán"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Trạng thái hoạt động</label>
                <select
                  required
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:border-gray-900 focus:outline-none"
                >
                  {tourStatuses.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Thời gian hành trình</label>
                <input
                  type="text"
                  required
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="Ví dụ: 3 ngày 2 đêm"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Danh mục Tour</label>
                <select
                  required
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:border-gray-900 focus:outline-none"
                >
                  <option value="">-- Chọn danh mục --</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Điểm đến</label>
                <select
                  required
                  value={destinationId}
                  onChange={(e) => setDestinationId(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:border-gray-900 focus:outline-none"
                >
                  <option value="">-- Chọn điểm đến --</option>
                  {destinations.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Phương tiện di chuyển</label>
                <select
                  required
                  value={transId}
                  onChange={(e) => setTransId(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:border-gray-900 focus:outline-none"
                >
                  <option value="">-- Chọn phương tiện --</option>
                  {transports.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Mô tả Tour</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Mô tả tóm tắt lịch trình..."
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none resize-y"
              />
            </div>

            <ImageUpload value={image} onChange={setImage} label="Ảnh đại diện Tour" />
          </div>

          <div className="h-px bg-gray-200" />
          <div className="flex justify-end gap-3 px-6 py-4">
            <button
              type="button"
              onClick={() => router.push("/tours")}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading || success}
              className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
            >
              {loading ? "Đang cập nhật..." : "Cập nhật"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function UpdateTourPage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-gray-500">Đang tải...</div>}>
      <UpdateTourPageContent />
    </Suspense>
  );
}
