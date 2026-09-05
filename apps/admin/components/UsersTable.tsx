"use client";

import { useState } from "react";
import Link from "next/link";
import DeleteUserButton from "./DeleteUserButton";
import SearchBar from "./ui/SearchBar";

export type User = {
  id: number;
  name: string;
  email: string;
  roles: any;
  status?: string;
};

export default function UsersTable({ users }: { users: User[] }) {
  const [searchQuery, setSearchQuery] = useState("");

  const formatRoles = (roles: any) => {
    if (Array.isArray(roles)) {
      return roles
        .map((r) => (typeof r === "object" && r !== null ? r.name : String(r)))
        .filter(Boolean)
        .join(", ");
    }
    if (typeof roles === "object" && roles !== null) {
      return (roles as any).name || "";
    }
    return String(roles || "");
  };

  const filteredUsers = users.filter((user) => {
    const roleStr = formatRoles(user.roles).toLowerCase();
    const query = searchQuery.toLowerCase();
    return (
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      roleStr.includes(query) ||
      (user.status || "ACTIVE").toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex items-center justify-between gap-4">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Tìm theo tên, email, vai trò..."
        />
        <span className="text-xs text-gray-500 font-medium whitespace-nowrap">
          Hiển thị {filteredUsers.length} / {users.length} người dùng
        </span>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center rounded-xl border border-gray-200 bg-white">
          <p className="text-sm font-semibold text-gray-800">Không tìm thấy người dùng</p>
          <p className="text-xs text-gray-500 mt-1">
            Không có kết quả nào khớp với từ khóa "{searchQuery}"
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-left text-xs divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 font-medium uppercase tracking-wider text-gray-500">
                  Tên
                </th>
                <th className="px-4 py-3 font-medium uppercase tracking-wider text-gray-500">
                  Email
                </th>
                <th className="px-4 py-3 font-medium uppercase tracking-wider text-gray-500">
                  Vai trò
                </th>
                <th className="px-4 py-3 font-medium uppercase tracking-wider text-gray-500">
                  Trạng thái
                </th>
                <th className="px-4 py-3 text-right font-medium uppercase tracking-wider text-gray-500">
                  Thao tác
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 bg-white">
              {filteredUsers.map((user: User) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="whitespace-nowrap px-4 py-3 font-semibold text-gray-900">
                    {user.name}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-600">
                    {user.email}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <span className="inline-block rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 border border-blue-100">
                      {formatRoles(user.roles)}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    {user.status === "DISABLED" ? (
                      <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700">
                        🔴 Đã vô hiệu hóa
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                        🟢 Hoạt động
                      </span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        href={`/users/update?id=${user.id}`}
                        className="rounded-md border border-gray-300 px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Sửa
                      </Link>
                      {user.status !== "DISABLED" && (
                        <DeleteUserButton userId={user.id} userName={user.name} />
                      )}
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
