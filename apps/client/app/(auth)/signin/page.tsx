"use client";
import Image from "next/image";
import Link from "next/link";
import AuthInput from "@/components/ui/AuthInput";

export default function SigninPage() {
  return (
    <main className="flex min-h-screen bg-surface">
      <section className="relative hidden w-1/2 lg:block">
        <Image
          src="/images/auth/image_1.jpg"
          alt="Cover"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 z-10 bg-linear-to-t from-primary/80 via-transparent to-transparent" />
        <div className="relative z-20 flex h-full flex-col justify-between p-16 text-white">
          <span className="text-xl font-bold tracking-widest uppercase border-b-2 border-white/30 w-fit pb-1">
            ZTravel
          </span>
          <div className="max-w-md"></div>
          <div className="text-[10px] uppercase tracking-[0.4em] opacity-50">
            <h1 className="text-4xl  font-bold leading-tight">
              Chào mừng <br /> trở lại.
            </h1>
            <p className="mt-4 text-lg font-light italic opacity-70">
              "Hành trình vạn dặm bắt đầu từ một bước chân."
            </p>
          </div>
        </div>
      </section>

      {/* CỘT PHẢI: FORM */}
      <section className="flex w-full lg:w-1/2 justify-center p-8 md:p-16 lg:p-24 mt-10 lg:mt-0">
        <div className="w-full max-w-sm md:max-w-md h-full mx-auto flex flex-col justify-start">
          <header className="mb-10 text-center lg:text-left">
            <h2 className="text-4xl font-black text-primary py-4 tracking-tight">
              Đăng nhập
            </h2>
          </header>

          <form className="space-y-5 mt-auto">
            <AuthInput
              label="Địa chỉ Email"
              type="email"
              placeholder="vi-du@email.com"
            />
            <AuthInput
              label="Mật khẩu"
              type="password"
              placeholder="••••••••"
              rightLabel={
                <Link
                  href="#"
                  className="text-xs font-bold text-slate-400 hover:text-primary transition-colors"
                >
                  Quên?
                </Link>
              }
            />
            <button className="w-full rounded-full bg-primary py-4 text-sm font-black text-white shadow-xl shadow-primary/20 hover:scale-[1.01] active:scale-95 transition-all uppercase tracking-widest mt-4">
              Tiếp tục
            </button>
          </form>

          <div className="relative py-10 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100"></div>
            </div>
            <span className="relative bg-white px-4 text-[10px] font-black italic text-slate-300 uppercase tracking-widest">
              Hoặc
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {["Google", "Facebook"].map((p) => (
              <SocialButton key={p} provider={p as any} />
            ))}
          </div>

          <p className="text-center text-sm text-slate-500 font-medium italic mt-auto pt-12 pb-8">
            Chưa có tài khoản?{" "}
            <Link
              href="/signup"
              className="font-black text-slate-900 ml-1 hover:text-primary not-italic border-b border-slate-900/10"
            >
              Đăng ký
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}

function SocialButton({ provider }: { provider: "Google" | "Facebook" }) {
  const isG = provider === "Google";
  return (
    <button className="flex items-center justify-center gap-3 rounded-xl bg-slate-50 py-3 text-sm font-bold text-slate-700 hover:bg-slate-100 transition-all border-0 shadow-sm active:scale-95">
      <svg
        className="h-5 w-5"
        viewBox="0 0 24 24"
        fill={isG ? "none" : "#1877F2"}
      >
        {isG ? (
          <>
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </>
        ) : (
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        )}
      </svg>
      {provider}
    </button>
  );
}
