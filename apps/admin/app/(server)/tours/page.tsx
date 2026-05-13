import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import DeleteUserButton from "@/components/DeleteUserButton";
import Image from "next/image";

const baseURL = "http://localhost:8080";

export type Category = {
  id: number;
  name: string;
  introduce: string;
};

export type Transport = {
  id: number;
  name: string;
};

export type Tour = {
  id: number;
  name: string;
  price: number;
  status: string;
  duration: string;
  categories: Category;
  description: string;
  image: string;
  transports: Transport;
};

export default async function TourPage() {
  let data = null;
  let error = null;

  try {
    const cookieStore = cookies();
    const token = (await cookieStore).get("access_token")?.value;

    if (!token) {
      redirect("/sign-in");
    }

    const res = await fetch(`${baseURL}/tours`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (res.status === 401) {
      redirect("/sign-in");
    }

    if (!res.ok) {
      const text = await res.text();
      console.error("RESPONSE:", text);
      throw new Error("Failed to fetch tours");
    }

    data = await res.json();
  } catch (err: any) {
    // redirect() throws a special NEXT_REDIRECT error — must re-throw it
    if (err?.digest?.startsWith("NEXT_REDIRECT")) {
      throw err;
    }
    error = err instanceof Error ? err.message : "Không thể tải danh sách tour";
  }

  const tour: Tour[] = data?.data || [];

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Tours</h1>
          <p className="mt-1 text-sm text-gray-500">
            Quản lý danh sách tour trong hệ thống
          </p>
        </div>

        <Link
          href="/tours/add"
          className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
        >
          Thêm tour
        </Link>
      </div>

      {/* Error state */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <p className="font-medium">Lỗi tải dữ liệu</p>
          <p className="mt-1 text-red-600">{error}</p>
        </div>
      )}

      {/* Empty state */}
      {data && tour.length === 0 && (
        <div className="flex flex-col items-center py-16 text-center">
          <p className="text-sm font-medium text-gray-900">
            Chưa có tour dùng nào
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Bắt đầu bằng cách thêm tour dùng đầu tiên.
          </p>
          <Link
            href="/tours/add"
            className="mt-4 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
          >
            Thêm tour
          </Link>
        </div>
      )}

      {/* Table */}
      {data && tour.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Hình ảnh
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Tên
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  giá bán
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Trạng thái
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Thời gian
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Danh mục
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Mô tả
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Phương tiện
                </th>
                <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Thao tác
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 bg-white">
              {tour.map((tour: Tour) => (
                <tr
                  key={tour.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="whitespace-nowrap px-5 py-3.5 text-sm font-medium text-gray-900">
                    <Image
                      src={`/images/${tour.image}`}
                      alt="tour-images"
                      width={200}
                      height={200}
                    />
                  </td>
                  <td className="whitespace-nowrap px-5 py-3.5 text-sm font-medium text-gray-900">
                    {tour.name}
                  </td>
                  <td className="whitespace-nowrap px-5 py-3.5 text-sm text-gray-600">
                    {tour.price}
                  </td>
                  <td className="whitespace-nowrap px-5 py-3.5 text-sm text-gray-600">
                    {tour.status}
                  </td>
                  <td className="whitespace-nowrap px-5 py-3.5 text-sm text-gray-600">
                    {tour.duration}
                  </td>

                  <td className="whitespace-nowrap px-5 py-3.5">
                    {tour.categories ? (
                      <span className="inline-block rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
                        {tour.categories.name}
                      </span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>

                  <td className="whitespace-nowrap px-5 py-3.5 text-sm text-gray-600">
                    {tour.description}
                  </td>
                  <td className="whitespace-nowrap px-5 py-3.5">
                    {tour.transports ? (
                      <span className="inline-block rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
                        {tour.transports.name}
                      </span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/users/update?id=${tour.id}`}
                        className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Sửa
                      </Link>
                      <DeleteUserButton userId={tour.id} userName={tour.name} />
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
