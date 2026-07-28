import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import DeleteDestinationButton from "@/components/DeleteDestinationButton";
import Image from "next/image";

const baseURL = "http://localhost:8080";

export type destinations = {
  id: number;
  name: string;
  image: string;
  introduce: string;
};

export default async function DestinationPage() {
  let data = null;
  let error = null;

  try {
    const cookieStore = cookies();
    const token = (await cookieStore).get("access_token")?.value;

    if (!token) {
      redirect("/sign-in");
    }

    const res = await fetch(`${baseURL}/destinations`, {
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
    error = err instanceof Error ? err.message : "Không thể tải danh sách điểm đến";
  }

  const destinationsList: destinations[] = data?.data || [];

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Điểm đến</h1>
          <p className="mt-1 text-sm text-gray-500">
            Quản lý danh sách Điểm đến trong hệ thống
          </p>
        </div>

        <Link
          href="/destinations/add"
          className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
        >
          Thêm Điểm đến
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
      {data && destinationsList.length === 0 && (
        <div className="flex flex-col items-center py-16 text-center">
          <p className="text-sm font-medium text-gray-900">
            Chưa có Điểm đến nào
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Bắt đầu bằng cách thêm Điểm đến đầu tiên.
          </p>
          <Link
            href="/destinations/add"
            className="mt-4 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
          >
            Thêm Điểm đến
          </Link>
        </div>
      )}

      {/* Table */}
      {data && destinationsList.length > 0 && (
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
                  mô tả
                </th>
                <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Thao tác
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 bg-white">
              {destinationsList.map((item: destinations) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="whitespace-nowrap px-5 py-3.5 text-sm font-medium text-gray-900">
                    <Image
                      src={`/images/${item.image}`}
                      alt="tour-images"
                      width={100}
                      height={200}
                      //   className="w-full h-auto "
                    />
                  </td>
                  <td className="whitespace-nowrap px-5 py-3.5 text-sm font-medium text-gray-900">
                    {item.name}
                  </td>

                  <td className="whitespace-nowrap px-5 py-3.5 text-sm text-gray-600">
                    {item.introduce}
                  </td>

                  <td className="whitespace-nowrap px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/destinations/update?id=${item.id}`}
                        className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Sửa
                      </Link>
                      <DeleteDestinationButton destinationId={item.id} destinationName={item.name} />
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
