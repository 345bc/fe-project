"use client";
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from "next/navigation";
import blogCategoryService from "@/services/blog-category-service";

function UpdateBlogCategoryPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const catId = searchParams.get("id");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (!catId) { setError("Không tìm thấy ID"); setFetching(false); return; }
    const f = async () => {
      try {
        const c = await blogCategoryService.getBlogCategoryById(catId);
        setName(c.name||""); setSlug(c.slug||""); setDescription(c.description||"");
      } catch (err: any) { setError(err?.message||"Lỗi"); } finally { setFetching(false); }
    }; f();
  }, [catId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); setLoading(true); setError(null); setSuccess(false);
    try {
      await blogCategoryService.patchBlogCategory(catId, { name, slug, description });
      setSuccess(true); setTimeout(() => router.push("/blog-categories"), 1200);
    } catch (err: any) { setError(err?.message||"Cập nhật thất bại"); } finally { setLoading(false); }
  };

  if (fetching) return (<div className="space-y-5"><div className="h-7 w-56 animate-pulse rounded-md bg-gray-200" /></div>);

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between">
        <div><h1 className="text-xl font-semibold text-gray-900">Cập nhật danh mục</h1></div>
        <button onClick={() => router.push("/blog-categories")} className="rounded-lg border border-gray-300 px-3.5 py-2 text-sm text-gray-700 hover:bg-gray-50">Quay lại</button>
      </div>
      {success && <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 font-medium">Cập nhật thành công!</div>}
      {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      <div className="rounded-xl border border-gray-200 bg-white">
        <form onSubmit={handleSubmit}>
          <div className="space-y-5 px-6 py-6">
            <div className="space-y-1"><label className="text-sm font-medium text-gray-700">Tên</label><input value={name} onChange={e=>setName(e.target.value)} required className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none" /></div>
            <div className="space-y-1"><label className="text-sm font-medium text-gray-700">Slug</label><input value={slug} onChange={e=>setSlug(e.target.value)} required className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none" /></div>
            <div className="space-y-1"><label className="text-sm font-medium text-gray-700">Mô tả</label><textarea value={description} onChange={e=>setDescription(e.target.value)} rows={3} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none resize-y" /></div>
          </div>
          <div className="h-px bg-gray-200" />
          <div className="flex justify-end gap-3 px-6 py-4">
            <button type="button" onClick={() => router.push("/blog-categories")} className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Hủy</button>
            <button type="submit" disabled={loading||success} className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50">{loading?"Đang cập nhật...":"Cập nhật"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function UpdateBlogCategoryPage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-gray-500">Đang tải...</div>}>
      <UpdateBlogCategoryPageContent />
    </Suspense>
  );
}
