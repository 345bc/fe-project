// apps/client/components/ImageUploader.tsx
"use client";
import { useState } from "react";
import Image from "next/image";

export default function ImageUploader() {
  const [originalPreview, setOriginalPreview] = useState<string | null>(null);
  const [optimizedUrl, setOptimizedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview ảnh gốc
    setOriginalPreview(URL.createObjectURL(file));
    setLoading(true);
    setError(null);
    setOptimizedUrl(null);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("/api/optimize-image", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        setOptimizedUrl(data.url);
      } else {
        setError(data.error || "Upload failed");
      }
    } catch (err) {
      setError("Có lỗi xảy ra");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Dọn dẹp URL object khi component unmount
  const resetUpload = () => {
    if (originalPreview) URL.revokeObjectURL(originalPreview);
    setOriginalPreview(null);
    setOptimizedUrl(null);
    setError(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Resize ảnh tự động</h2>

      {/* Upload area */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">
          Chọn ảnh (JPG, PNG)
        </label>
        <input
          type="file"
          accept="image/jpeg,image/png,image/jpg"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-primary file:text-white
            hover:file:bg-primary-dark"
        />
        <p className="text-xs text-gray-400 mt-1">
          Ảnh sẽ được resize về 800px, chuyển sang WebP
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-2 text-gray-500">Đang xử lý ảnh...</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* So sánh ảnh */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Ảnh gốc */}
        {originalPreview && (
          <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
            <div className="bg-gray-100 p-3 text-sm font-medium border-b">
              📷 Ảnh gốc
            </div>
            <div className="relative h-64 w-full">
              <Image
                src={originalPreview}
                alt="Original"
                fill
                className="object-contain"
              />
            </div>
            <div className="bg-gray-50 p-3 text-xs text-gray-500">
              <a
                href={originalPreview}
                download="original.jpg"
                className="text-primary hover:underline"
              >
                ⬇️ Tải ảnh gốc
              </a>
            </div>
          </div>
        )}

        {/* Ảnh đã xử lý */}
        {optimizedUrl && (
          <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
            <div className="bg-green-50 p-3 text-sm font-medium border-b text-green-700">
              ✨ Ảnh đã tối ưu (800px WebP)
            </div>
            <div className="relative h-64 w-full">
              <Image
                src={optimizedUrl}
                alt="Optimized"
                fill
                className="object-contain"
              />
            </div>
            <div className="bg-gray-50 p-3 text-xs text-gray-500 flex justify-between items-center">
              <a
                href={optimizedUrl}
                download="optimized.webp"
                className="text-primary hover:underline"
              >
                ⬇️ Tải ảnh WebP
              </a>
              <button
                onClick={resetUpload}
                className="text-gray-400 hover:text-gray-600"
              >
                🔄 Tải ảnh mới
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Hướng dẫn */}
      {!originalPreview && (
        <div className="text-center py-12 text-gray-400 border-2 border-dashed rounded-lg mt-4">
          📸 Chọn ảnh để bắt đầu
        </div>
      )}
    </div>
  );
}
