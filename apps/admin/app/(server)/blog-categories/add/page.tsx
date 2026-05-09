"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import blogCategoryService from "@/services/blog-category-service";

export default function AddBlogCategoryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    try {
      await blogCategoryService.postBlogCategory({
        name: formData.get("name"),
        slug: formData.get("slug"),
        description: formData.get("description"),
      });
      router.push("/blog-categories");
    } catch (err: any) {
      setError(err?.message || "Thêm danh mục thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Thêm danh mục bài viết</h1>
        <p className="mt-1 text-sm text-gray-500">Điền thông tin để tạo danh mục mới</p>
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
              <label className="text-sm font-medium text-gray-700">Tên danh mục</label>
              <input name="name" type="text" required placeholder="Tên danh mục" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Slug</label>
              <input name="slug" type="text" required placeholder="danh-muc-slug" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Mô tả</label>
              <textarea name="description" rows={3} placeholder="Mô tả danh mục..." className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none resize-y" />
            </div>
          </div>
          <div className="h-px bg-gray-200" />
          <div className="flex justify-end gap-3 px-6 py-4">
            <button type="button" onClick={() => router.push("/blog-categories")} className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Hủy</button>
            <button type="submit" disabled={loading} className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50">{loading ? "Đang lưu..." : "Lưu"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
