import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import DeleteTransportButton from "@/components/DeleteTransportButton";

const baseURL = "http://localhost:8080";

export type Transport = {
  id: number;
  name: string;
};

export default async function TransportsPage() {
  let data = null;
  let error = null;

  try {
    const cookieStore = cookies();
    const token = (await cookieStore).get("access_token")?.value;
    if (!token) redirect("/sign-in");

    const res = await fetch(`${baseURL}/transports`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (res.status === 401) redirect("/sign-in");
    if (!res.ok) throw new Error("Failed to fetch transports");

    data = await res.json();
  } catch (err: any) {
    if (err?.digest?.startsWith("NEXT_REDIRECT")) throw err;
    error = err instanceof Error ? err.message : "Không thể tải danh sách phương tiện";
  }

  const transports: Transport[] = data?.data || [];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Phương tiện</h1>
          <p className="mt-1 text-sm text-gray-500">Quản lý danh sách phương tiện</p>
        </div>
        <Link href="/transports/add" className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors">Thêm phương tiện</Link>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <p className="font-medium">Lỗi tải dữ liệu</p>
          <p className="mt-1 text-red-600">{error}</p>
        </div>
      )}

      {data && transports.length === 0 && (
        <div className="flex flex-col items-center py-16 text-center">
          <p className="text-sm font-medium text-gray-900">Chưa có phương tiện nào</p>
          <Link href="/transports/add" className="mt-4 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors">Thêm phương tiện</Link>
        </div>
      )}

      {data && transports.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-gray-200 max-w-2xl">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">ID</th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Tên</th>
                <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 w-1/4">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {transports.map((t: Transport) => (
                <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                  <td className="whitespace-nowrap px-5 py-3.5 text-sm text-gray-600">#{t.id}</td>
                  <td className="whitespace-nowrap px-5 py-3.5 text-sm font-medium text-gray-900">{t.name}</td>
                  <td className="whitespace-nowrap px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/transports/update?id=${t.id}`} className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors">Sửa</Link>
                      <DeleteTransportButton transportId={t.id} transportName={t.name} />
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
