"use client";

import React, { useState } from "react";
import authService from "@/services/auth-service";

export default function LoginPage() {
  const [error, seterror] = useState("");
  const [success, setsuccess] = useState("");
  const [loading, setloading] = useState(false);

  const HandleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    seterror("");
    setsuccess("");
    setloading(true);

    const formdata = new FormData(e.currentTarget);
    const username = formdata.get("username");
    const password = formdata.get("password");

    // Call Api
    const result = await authService.signIn({
      username: username,
      password: password,
    });

    setloading(false);

    if (result.success) {
      setsuccess("Sign-in successful! Redirecting to Home");
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    } else {
      seterror(result.message);
      setTimeout(() => seterror(""), 3000);
    }
  };

  return (
    <div className="  w-xl  mx-auto h-auto   bg-match-mist  rounded-3xl shadow-xl p-8 md:p-10 transition-all">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-slate-800">Đăng nhập</h1>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-600 text-sm text-center">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 rounded-xl bg-green-50 text-green-600 text-sm text-center">
          {success}
        </div>
      )}

      <form onSubmit={HandleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">
            Tên đăng nhập
          </label>
          <input
            name="username"
            type="text"
            required
            className="w-full px-4 py-3 rounded-xl border border-primary focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400"
            placeholder="example@gmail.com"
          />
        </div>

        {/* Password Field */}
        <div>
          <div className="flex justify-between mb-1.5 ml-1">
            <label className="text-sm font-medium text-slate-700">
              Mật khẩu
            </label>
          </div>
          <input
            name="password"
            type="password"
            required
            className="w-full px-4 py-3 rounded-xl border border-primary focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            placeholder="••••••••"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3.5 rounded-xl shadow-lg transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? "Đang xử lý..." : "Đăng nhập ngay"}
        </button>
      </form>
    </div>
  );
}
