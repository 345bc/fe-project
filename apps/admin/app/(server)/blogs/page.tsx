import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import BlogsTable, { Blog } from "@/components/BlogsTable";

const baseURL = "http://localhost:8080";

export default async function BlogsPage() {
  let data = null;
  let error = null;

  try {
    const cookieStore = cookies();
    const token = (await cookieStore).get("access_token")?.value;

    if (!token) redirect("/sign-in");

    const res = await fetch(`${baseURL}/blogs`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (res.status === 401) redirect("/sign-in");

    if (!res.ok) {
      const text = await res.text();
      console.error("RESPONSE:", text);
      throw new Error("Failed to fetch blogs");
    }

    data = await res.json();
  } catch (err: any) {
    if (err?.digest?.startsWith("NEXT_REDIRECT")) throw err;
    error = err instanceof Error ? err.message : "Không thể tải danh sách bài viết";
  }

  const blogs: Blog[] = data?.data || [];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Bài viết</h1>
          <p className="mt-1 text-sm text-gray-500">Quản lý danh sách bài viết trong hệ thống</p>
        </div>
        <Link href="/blogs/add" className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors">Thêm bài viết</Link>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <p className="font-medium">Lỗi tải dữ liệu</p>
          <p className="mt-1 text-red-600">{error}</p>
        </div>
      )}

      {data && blogs.length === 0 && (
        <div className="flex flex-col items-center py-16 text-center">
          <p className="text-sm font-medium text-gray-900">Chưa có bài viết nào</p>
          <p className="mt-1 text-sm text-gray-500">Bắt đầu bằng cách thêm bài viết đầu tiên.</p>
          <Link href="/blogs/add" className="mt-4 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors">Thêm bài viết</Link>
        </div>
      )}

      {/* Table Component with Live Search Bar */}
      {data && blogs.length > 0 && (
        <BlogsTable blogs={blogs} />
      )}
    </div>
  );
}
