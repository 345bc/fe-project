"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import blogService from "@/services/blog-service";

export default function AddBlogPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    try {
      await blogService.postBlog({
        title: formData.get("title"),
        contents: formData.get("contents"),
        image: formData.get("image"),
        author: formData.get("author"),
        category_id: Number(formData.get("category_id")),
      });
      router.push("/blogs");
    } catch (err: any) {
      setError(err?.message || "Thêm bài viết thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Thêm bài viết mới</h1>
        <p className="mt-1 text-sm text-gray-500">Điền thông tin để tạo bài viết</p>
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
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Tiêu đề</label>
              <input name="title" type="text" required placeholder="Tiêu đề bài viết" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Nội dung</label>
              <textarea name="contents" required rows={6} placeholder="Nội dung bài viết..." className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none resize-y" />
            </div>
            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Tên ảnh</label>
                <input name="image" type="text" required placeholder="image.jpg" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Tác giả</label>
                <input name="author" type="text" required placeholder="Tên tác giả" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">ID Danh mục</label>
              <input name="category_id" type="number" required min="1" placeholder="ID danh mục bài viết" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none" />
            </div>
          </div>
          <div className="h-px bg-gray-200" />
          <div className="flex justify-end gap-3 px-6 py-4">
            <button type="button" onClick={() => router.push("/blogs")} className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Hủy</button>
            <button type="submit" disabled={loading} className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50">{loading ? "Đang lưu..." : "Lưu"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
