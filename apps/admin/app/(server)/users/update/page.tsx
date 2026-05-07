"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import userService from "@/services/user-service";

export default function UpdateUserPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("id");

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roles, setRoles] = useState<string[]>(["USER"]);

  // Fetch existing user data
  useEffect(() => {
    if (!userId) {
      setError("Không tìm thấy ID người dùng");
      setFetching(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const user = await userService.getUserById(userId);
        setName(user.name || "");
        setEmail(user.email || "");
        setRoles(
          Array.isArray(user.roles)
            ? user.roles
            : user.roles
              ? [user.roles]
              : ["USER"],
        );
      } catch (err: any) {
        setError(err?.message || "Không thể tải thông tin người dùng");
      } finally {
        setFetching(false);
      }
    };

    fetchUser();
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await userService.patchUser(userId, { name, email, password, roles });
      setSuccess(true);
      setTimeout(() => router.push("/users"), 1200);
    } catch (err: any) {
      setError(err?.message || "Cập nhật người dùng thất bại");
    } finally {
      setLoading(false);
    }
  };

  // Loading skeleton
  if (fetching) {
    return (
      <div className="space-y-5">
        <div>
          <div className="h-7 w-56 animate-pulse rounded-md bg-gray-200" />
          <div className="mt-2 h-4 w-80 animate-pulse rounded-md bg-gray-100" />
        </div>
        <div className="rounded-xl border border-gray-200 bg-white">
          <div className="space-y-5 px-6 py-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-28 animate-pulse rounded bg-gray-200" />
                <div className="h-10 w-full animate-pulse rounded-lg bg-gray-100" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Cập nhật người dùng
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Chỉnh sửa thông tin tài khoản người dùng
          </p>
        </div>

        <button
          type="button"
          onClick={() => router.push("/users")}
          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-3.5 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
            />
          </svg>
          Quay lại
        </button>
      </div>

      {/* Success toast */}
      {success && (
        <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 animate-fade-in">
          <svg
            className="h-4 w-4 text-green-500"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m4.5 12.75 6 6 9-13.5"
            />
          </svg>
          <p className="font-medium">
            Cập nhật thành công! Đang chuyển hướng...
          </p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <p className="font-medium">Lỗi</p>
          <p className="mt-1 text-red-600">{error}</p>
        </div>
      )}

      {/* Form card */}
      <div className="rounded-xl border border-gray-200 bg-white">
        <form onSubmit={handleSubmit}>
          <div className="space-y-5 px-6 py-6">
            {/* User ID badge */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                User ID
              </span>
              <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
                #{userId}
              </span>
            </div>

            <div className="space-y-1">
              <label
                htmlFor="name"
                className="text-sm font-medium text-gray-700"
              >
                Tên người dùng
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nhập tên người dùng"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                Mật khẩu mới
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Để trống nếu không đổi mật khẩu"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none transition-colors"
              />
              <p className="text-xs text-gray-400">
                Bỏ trống nếu bạn không muốn thay đổi mật khẩu
              </p>
            </div>

            <div className="space-y-1">
              <label
                htmlFor="roles"
                className="text-sm font-medium text-gray-700"
              >
                Vai trò
              </label>
              <select
                id="roles"
                name="roles"
                value={roles[0]}
                onChange={(e) => setRoles([e.target.value])}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none transition-colors"
              >
                <option value="ADMIN">Admin</option>
                <option value="USER">User</option>
                <option value="EMPLOYEE">Employee</option>
              </select>
            </div>
          </div>

          <div className="h-px bg-gray-200" />

          {/* Footer */}
          <div className="flex justify-end gap-3 px-6 py-4">
            <button
              type="button"
              onClick={() => router.push("/users")}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading || success}
              className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50 transition-colors"
            >
              {loading ? "Đang cập nhật..." : "Cập nhật"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
