import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import DeleteCategoryButton from "@/components/DeleteCategoryButton";

const baseURL = "http://localhost:8080";

export type Category = {
  id: number;
  name: string;
  introduce: string;
};

export default async function CategoriesPage() {
  let data = null;
  let error = null;

  try {
    const cookieStore = cookies();
    const token = (await cookieStore).get("access_token")?.value;
    if (!token) redirect("/sign-in");

    const res = await fetch(`${baseURL}/categories`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (res.status === 401) redirect("/sign-in");
    if (!res.ok) throw new Error("Failed to fetch categories");

    data = await res.json();
  } catch (err: any) {
    if (err?.digest?.startsWith("NEXT_REDIRECT")) throw err;
    error = err instanceof Error ? err.message : "Không thể tải danh sách danh mục";
  }

  const categories: Category[] = data?.data || [];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Danh mục Tour</h1>
          <p className="mt-1 text-sm text-gray-500">Quản lý danh sách danh mục tour</p>
        </div>
        <Link href="/categories/add" className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors">Thêm danh mục</Link>
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
          <Link href="/categories/add" className="mt-4 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors">Thêm danh mục</Link>
        </div>
      )}

      {data && categories.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 w-1/4">Tên</th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Mô tả</th>
                <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 w-1/6">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {categories.map((c: Category) => (
                <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                  <td className="whitespace-nowrap px-5 py-3.5 text-sm font-medium text-gray-900">{c.name}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-600 max-w-[400px] truncate">{c.introduce || "—"}</td>
                  <td className="whitespace-nowrap px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/categories/update?id=${c.id}`} className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors">Sửa</Link>
                      <DeleteCategoryButton categoryId={c.id} categoryName={c.name} />
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
