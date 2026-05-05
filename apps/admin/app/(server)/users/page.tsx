import userService from "@/services/user-service";

export type User = {
  id: number;
  name: string;
  email: string;
  roles: string;
};

export default async function UsersPage() {
  let data = null;
  let error = null;

  try {
    data = await userService.getUser();
  } catch (err) {
    error =
      err instanceof Error ? err.message : "Không thể tải danh sách người dùng";
  }

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Users</h1>
          <p className="mt-1 text-sm text-gray-500">
            Quản lý danh sách người dùng trong hệ thống
          </p>
        </div>

        <button className="rounded-lg border border-gray-900 bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800">
          Thêm user
        </button>
      </div>

      {/* Error state */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <p className="font-medium">Lỗi tải dữ liệu</p>
          <p className="mt-1 text-red-600">{error}</p>
          <p className="mt-1 text-xs text-red-500">
            Kiểm tra backend tại http://localhost:8080
          </p>
        </div>
      )}

      {/* Table card */}
      {data && (
        <div className="rounded-xl border border-gray-200 bg-white">
          {/* Table header */}
          <div className="border-b border-gray-200 px-4 py-3">
            <p className="text-sm font-medium text-gray-700">
              Danh sách người dùng
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead className="bg-gray-50">
                <tr className="text-left text-sm font-medium text-gray-600">
                  <th className="px-4 py-3 border-b">Tên</th>
                  <th className="px-4 py-3 border-b">Email</th>
                  <th className="px-4 py-3 border-b">Vai trò</th>
                  <th className="px-4 py-3 border-b text-right">Thao tác</th>
                </tr>
              </thead>

              <tbody className="text-sm">
                {data.data.map((user: User) => (
                  <tr
                    key={user.id}
                    className="border-b last:border-b-0 hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {user.name}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{user.email}</td>
                    <td className="px-4 py-3 text-gray-700">{user.roles}</td>
                    <td className="px-4 py-3 text-right space-x-3">
                      <button className="text-sm text-gray-700 hover:underline">
                        Sửa
                      </button>
                      <button className="text-sm text-red-600 hover:underline">
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
