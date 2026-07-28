"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from "next/navigation";
import blogService from "@/services/blog-service";
import ImageUpload from "@/components/ui/ImageUpload";

function UpdateBlogPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const blogId = searchParams.get("id");

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [contents, setContents] = useState("");
  const [image, setImage] = useState("");
  const [author, setAuthor] = useState("");
  const [categoryId, setCategoryId] = useState("");

  useEffect(() => {
    if (!blogId) {
      setError("Không tìm thấy ID bài viết");
      setFetching(false);
      return;
    }
    const fetchBlog = async () => {
      try {
        const blog = await blogService.getBlogById(blogId);
        setTitle(blog.title || "");
        setContents(blog.contents || "");
        setImage(blog.image || "");
        setAuthor(blog.author || "");
        setCategoryId(blog.blogCategories?.id ? String(blog.blogCategories.id) : "");
      } catch (err: any) {
        setError(err?.message || "Lỗi tải thông tin bài viết");
      } finally {
        setFetching(false);
      }
    };
    fetchBlog();
  }, [blogId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!image) {
      setError("Vui lòng tải ảnh lên trước khi lưu.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await blogService.patchBlog(blogId, {
        title,
        contents,
        image,
        author,
        category_id: Number(categoryId),
      });
      setSuccess(true);
      setTimeout(() => router.push("/blogs"), 1200);
    } catch (err: any) {
      setError(err?.message || "Cập nhật bài viết thất bại");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="space-y-5">
        <div className="h-7 w-56 animate-pulse rounded-md bg-gray-200" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Cập nhật bài viết</h1>
          <p className="mt-1 text-sm text-gray-500">Chỉnh sửa thông tin bài viết và lưu lại</p>
        </div>
        <button
          onClick={() => router.push("/blogs")}
          className="rounded-lg border border-gray-300 px-3.5 py-2 text-sm text-gray-700 hover:bg-gray-50"
        >
          Quay lại
        </button>
      </div>

      {success && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 font-medium">
          Cập nhật bài viết thành công!
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="rounded-xl border border-gray-200 bg-white max-w-3xl">
        <form onSubmit={handleSubmit}>
          <div className="space-y-5 px-6 py-6">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Tiêu đề</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Tiêu đề bài viết"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Nội dung</label>
              <textarea
                required
                value={contents}
                onChange={(e) => setContents(e.target.value)}
                rows={8}
                placeholder="Nội dung bài viết..."
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none resize-y"
              />
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Tác giả</label>
                <input
                  type="text"
                  required
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Tên tác giả"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">ID Danh mục bài viết</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  placeholder="ID danh mục bài viết"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none"
                />
              </div>
            </div>

            <ImageUpload value={image} onChange={setImage} label="Ảnh đại diện bài viết" />
          </div>

          <div className="h-px bg-gray-200" />
          <div className="flex justify-end gap-3 px-6 py-4">
            <button
              type="button"
              onClick={() => router.push("/blogs")}
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

export default function UpdateBlogPage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-gray-500">Đang tải...</div>}>
      <UpdateBlogPageContent />
    </Suspense>
  );
}
