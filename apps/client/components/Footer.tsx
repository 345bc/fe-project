import Link from "next/link";
import React from "react";

export default function Footer() {
  return (
    <footer className="bg-surface-container-low text-slate-900 pb-12 overflow-hidden border-t border-slate-200 mt-20">
      <div className="container-main mx-auto relative px-4 md:px-0">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 md:gap-12 border-t border-slate-200 pt-12 md:pt-16">
          {/* Cột 1: Thông tin thương hiệu & Social */}
          <div className="lg:col-span-4 space-y-6 md:space-y-8">
            <div className="text-3xl md:text-4xl font-black tracking-tighter">
              ZTravel<span className="text-primary">.</span>
            </div>
            <p className="text-slate-500 leading-relaxed font-body italic max-w-sm text-sm md:text-base">
              "Chúng tôi không chỉ bán những chuyến đi, chúng tôi kiến tạo những
              chương mới trong cuốn sách cuộc đời bạn."
            </p>

            {/* Social Icons */}
            <div className="flex gap-4 md:gap-6 items-center">
              <Link
                href="#"
                className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-50 text-[#1877F2] hover:bg-[#1877F2] hover:text-white transition-all duration-300"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24V15.563H7.078V12.073H10.125V9.413C10.125 6.387 11.916 4.71 14.658 4.71C15.971 4.71 17.344 4.945 17.344 4.945V7.913H15.836C14.346 7.913 13.875 8.845 13.875 9.799V12.073H17.203L16.671 15.563H13.875V24C19.612 23.094 24 18.1 24 12.073Z" />
                </svg>
              </Link>
              <Link
                href="#"
                className="w-10 h-10 rounded-full flex items-center justify-center bg-pink-50 text-[#E4405F] hover:bg-[#E4405F] hover:text-white transition-all duration-300"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 0C8.741 0 8.333 0.014 7.053 0.072C2.695 0.272 0.273 2.69 0.073 7.052C0.014 8.333 0 8.741 0 12C0 15.259 0.014 15.667 0.072 16.947C0.272 21.306 2.69 23.728 7.052 23.927C8.333 23.986 8.741 24 12 24C15.259 24 15.668 23.986 16.948 23.927C21.302 23.727 23.73 21.31 23.927 16.948C23.986 15.668 24 15.259 24 12C24 8.741 23.986 8.333 23.927 7.053C23.732 2.699 21.311 0.273 16.949 0.073C15.668 0.014 15.259 0 12 0ZM12 2.163C15.204 2.163 15.584 2.175 16.85 2.233C20.102 2.381 21.621 3.924 21.769 7.152C21.827 8.417 21.838 8.797 21.838 12.001C21.838 15.204 21.826 15.584 21.769 16.85C21.62 20.077 20.101 21.622 16.85 21.769C15.584 21.827 15.204 21.838 12 21.838C8.796 21.838 8.416 21.826 7.151 21.769C3.93 21.621 2.38 20.082 2.232 16.851C2.174 15.584 2.163 15.204 2.163 12.001C2.163 8.797 2.175 8.417 2.233 7.151C2.381 3.924 3.924 2.38 7.151 2.232C8.417 2.174 8.796 2.163 12 2.163ZM12 5.838C8.597 5.838 5.838 8.597 5.838 12C5.838 15.403 8.597 18.162 12 18.162C15.403 18.162 18.162 15.403 18.162 12C18.162 8.597 15.403 5.838 12 5.838ZM12 16C9.791 16 8 14.209 8 12C8 9.791 9.791 8 12 8C14.209 8 16 9.791 16 12C16 14.209 14.209 16 12 16ZM18.406 4.337C17.61 4.337 16.963 4.984 16.963 5.78C16.963 6.577 17.61 7.224 18.406 7.224C19.203 7.224 19.85 6.577 19.85 5.78C19.85 4.984 19.203 4.337 18.406 4.337Z" />
                </svg>
              </Link>
              <Link
                href="#"
                className="w-10 h-10 rounded-full flex items-center justify-center bg-red-50 text-[#FF0000] hover:bg-[#FF0000] hover:text-white transition-all duration-300"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M23.498 6.186C23.224 5.163 22.416 4.355 21.393 4.081C19.52 3.58 12 3.58 12 3.58C12 3.58 4.48 3.58 2.607 4.081C1.584 4.355 0.776 5.163 0.502 6.186C0 8.06 0 12 0 12C0 12 0 15.94 0.502 17.814C0.776 18.837 1.584 19.645 2.607 19.919C4.48 20.42 12 20.42 12 20.42C12 20.42 19.52 20.42 21.393 19.919C22.416 19.645 23.224 18.837 23.498 17.814C24 15.94 24 12 24 12C24 12 24 8.06 23.498 6.186ZM9.6 15.6V8.4L15.84 12L9.6 15.6Z" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Cột 2: Điều hướng lớn */}
          <div className="lg:col-span-2 lg:col-start-6">
            <h4 className="font-bold mb-6 md:mb-8 text-xs uppercase tracking-[0.2em] text-slate-400">
              Danh mục
            </h4>
            <ul className="space-y-3 md:space-y-4 font-bold text-base md:text-lg font-headline">
              {["Miền Bắc", "Miền Trung", "Miền Tây", "Nước Ngoài"].map(
                (item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="hover:underline decoration-primary decoration-2 underline-offset-4 md:underline-offset-8 transition-all"
                    >
                      {item}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* Cột 3: Liên kết hỗ trợ */}
          <div className="lg:col-span-2">
            <h4 className="font-bold mb-6 md:mb-8 text-xs uppercase tracking-[0.2em] text-slate-400">
              Hỗ trợ
            </h4>
            <ul className="space-y-3 md:space-y-4 font-medium text-slate-600 font-body text-sm">
              {["Về Zella", "Tuyển dụng", "Blog du lịch", "Chính sách"].map(
                (item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="hover:text-primary transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* Cột 4: Thông tin văn phòng */}
          <div className="lg:col-span-3 space-y-6">
            <h4 className="font-bold mb-6 md:mb-8 text-xs uppercase tracking-[0.2em] text-slate-400">
              Liên hệ
            </h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-[18px] md:text-xl">
                  location_on
                </span>
                <p className="text-slate-600 text-xs md:text-sm leading-relaxed">
                  140 Lê Trọng Tấn, Tây Thạnh <br />
                  Tân Phú, TP. Hồ Chí Minh
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-[18px] md:text-xl">
                  call
                </span>
                <span className="text-slate-900 font-black text-base md:text-lg">
                  1900 1833
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-[18px] md:text-xl">
                  mail
                </span>
                <span className="text-slate-600 text-xs md:text-sm font-medium">
                  contact@ztravel.com
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer Bar */}
        <div className="mt-12 md:mt-24 pt-6 md:pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
          <div className="text-center md:text-left">
            © 2026 Zella Ecosystem — ZTravel Studio
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <div className="flex gap-3 grayscale opacity-40 hover:grayscale-0 transition-all">
              <div className="px-2 py-1 bg-surface border border-slate-200 rounded text-[8px]">
                VISA
              </div>
              <div className="px-2 py-1 bg-surface border border-slate-200 rounded text-[8px]">
                MASTER
              </div>
              <div className="px-2 py-1 bg-surface border border-slate-200 rounded text-[8px]">
                MOMO
              </div>
            </div>
            <div className="flex gap-4">
              <Link href="#" className="hover:text-slate-900">
                Privacy
              </Link>
              <Link href="#" className="hover:text-slate-900">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
