"use client";
import authService from "@/services/auth-service";

export default function LogoutButton() {
  const handleLogout = () => {
    authService.logout();
  };
  return (
    <button
      onClick={handleLogout}
      className="text-sm text-red-600 hover:underline"
    >
      Đăng xuất
    </button>
  );
}
