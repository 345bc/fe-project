import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import DeleteBlogCategoryButton from "@/components/DeleteBlogCategoryButton";

const baseURL = "http://localhost:8080";

export type BlogCategory = {
  id: number;
  name: string;
  slug: string;
  description: string;
};

export default async function BlogCategoriesPage() {
  let data = null;
  let error = null;

  try {
    const cookieStore = cookies();
    const token = (await cookieStore).get("access_token")?.value;

    if (!token) redirect("/sign-in");

    const res = await fetch(`${baseURL}/blog-categories`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (res.status === 401) redirect("/sign-in");

    if (!res.ok) {
      const text = await res.text();
      console.error("RESPONSE:", text);
      throw new Error("Failed to fetch blog categories");
    }

    data = await res.json();
  } catch (err: any) {
    if (err?.digest?.startsWith("NEXT_REDIRECT")) throw err;
    error = err instanceof Error ? err.message : "Không thể tải danh sách danh mục bài viết";
  }

  const categories: BlogCategory[] = data?.data || [];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Danh mục bài viết</h1>
          <p className="mt-1 text-sm text-gray-500">Quản lý danh mục bài viết trong hệ thống</p>
        </div>
        <Link href="/blog-categories/add" className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors">Thêm danh mục</Link>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <p className="font-medium">Lỗi tải dữ liệu</p>
          <p className="mt-1 text-red-600">{error}</p>
        </div>
      )}

      {data && categories.length === 0 && (
        <div className="flex flex-col items-center py-16 text-center">
          <p className="text-sm font-medium text-gray-900">Chưa có danh mục nào</p>
          <p className="mt-1 text-sm text-gray-500">Bắt đầu bằng cách thêm danh mục đầu tiên.</p>
          <Link href="/blog-categories/add" className="mt-4 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors">Thêm danh mục</Link>
        </div>
      )}

      {data && categories.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Tên</th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Slug</th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Mô tả</th>
                <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {categories.map((cat: BlogCategory) => (
                <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                  <td className="whitespace-nowrap px-5 py-3.5 text-sm font-medium text-gray-900">{cat.name}</td>
                  <td className="whitespace-nowrap px-5 py-3.5 text-sm font-mono text-gray-600">{cat.slug}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-600 max-w-[300px] truncate">{cat.description || "—"}</td>
                  <td className="whitespace-nowrap px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/blog-categories/update?id=${cat.id}`} className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors">Sửa</Link>
                      <DeleteBlogCategoryButton categoryId={cat.id} categoryName={cat.name} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
