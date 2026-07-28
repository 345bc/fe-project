"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, XCircle, ChevronRight, Home, Compass } from "lucide-react";
import Link from "next/link";
import paymentService from "@/services/payment-service";

function VnPayReturnContent() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [status, setStatus]   = useState<any>(null);

  useEffect(() => {
    const verify = async () => {
      try {
        const params: Record<string, string> = {};
        searchParams.forEach((v, k) => { params[k] = v; });
        const result = await paymentService.verifyPayment(params);
        setStatus(result.data);
      } catch {
        setStatus({ success: false, message: "Không thể kết nối máy chủ để xác thực giao dịch." });
      } finally {
        setLoading(false);
      }
    };
    verify();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-slate-50 flex items-center justify-center font-sans">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-[3px] border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-slate-500">Đang xác thực giao dịch...</p>
        </div>
      </div>
    );
  }

  const isSuccess    = !!status?.success;
  const amount       = searchParams.get("vnp_Amount") ? parseInt(searchParams.get("vnp_Amount")!) / 100 : 0;
  const txnRef       = searchParams.get("vnp_TxnRef") || "";
  const bookingId    = status?.bookingId || txnRef.split("_")[0];
  const bankCode     = searchParams.get("vnp_BankCode") || "";
  const txnNo        = searchParams.get("vnp_TransactionNo") || "";
  const payDate      = searchParams.get("vnp_PayDate") || "";

  const fmtPrice = (n: number) => n.toLocaleString("vi-VN") + "đ";
  const fmtDate  = (s: string) => {
    if (!s || s.length < 14) return s;
    return `${s.slice(6,8)}/${s.slice(4,6)}/${s.slice(0,4)}  ${s.slice(8,10)}:${s.slice(10,12)}`;
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50 font-sans flex flex-col items-center justify-center py-10 px-4">

      {/* Stepper — matches booking page exactly */}
      <div className="flex items-center gap-4 bg-white border border-slate-100 rounded-2xl px-5 py-3 shadow-xs text-sm font-bold mb-6">
        <span className="flex items-center gap-2 text-emerald-600">
          <span className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-xs">✓</span>
          Nhập thông tin
        </span>
        <ChevronRight size={14} className="text-slate-300" />
        <span className="flex items-center gap-2 text-emerald-600">
          <span className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-xs">✓</span>
          Thanh toán
        </span>
        <ChevronRight size={14} className="text-slate-300" />
        <span className="flex items-center gap-2 text-primary">
          <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-black ring-4 ring-blue-100">3</span>
          Hoàn tất
        </span>
      </div>

      {/* Main receipt card */}
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden">

        {/* Status header */}
        <div className={`px-8 pt-8 pb-6 text-center border-b border-slate-100 ${isSuccess ? "" : ""}`}>
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
            isSuccess ? "bg-emerald-50 text-emerald-500" : "bg-rose-50 text-rose-500"
          }`}>
            {isSuccess
              ? <CheckCircle2 size={32} strokeWidth={1.5} />
              : <XCircle      size={32} strokeWidth={1.5} />}
          </div>

          <h1 className="text-xl font-extrabold text-text-primary mb-1.5">
            {isSuccess ? "Thanh toán thành công!" : "Thanh toán thất bại"}
          </h1>
          <p className="text-sm text-text-secondary leading-relaxed">
            {isSuccess
              ? "Đơn đặt tour đã được xác nhận. Chi tiết hành trình sẽ được gửi vào email của bạn."
              : (status?.message || "Giao dịch không thành công hoặc đã bị hủy. Vui lòng thử lại.")}
          </p>
        </div>

        {/* Transaction rows */}
        <div className="px-8 py-5 space-y-0 divide-y divide-slate-100">

          <div className="flex justify-between items-center py-3.5">
            <span className="text-sm text-slate-500">Mã đặt tour</span>
            <span className="text-sm font-bold text-text-primary">#{bookingId}</span>
          </div>

          <div className="flex justify-between items-center py-3.5">
            <span className="text-sm text-slate-500">Số tiền</span>
            <span className={`text-base font-extrabold ${isSuccess ? "text-emerald-600" : "text-rose-600"}`}>
              {fmtPrice(amount)}
            </span>
          </div>

          {bankCode && (
            <div className="flex justify-between items-center py-3.5">
              <span className="text-sm text-slate-500">Ngân hàng</span>
              <span className="text-sm font-semibold text-text-primary">{bankCode}</span>
            </div>
          )}

          {txnNo && (
            <div className="flex justify-between items-center py-3.5">
              <span className="text-sm text-slate-500">Mã giao dịch</span>
              <span className="text-sm font-mono text-text-secondary">{txnNo}</span>
            </div>
          )}

          {payDate && (
            <div className="flex justify-between items-center py-3.5">
              <span className="text-sm text-slate-500">Thời gian</span>
              <span className="text-sm font-semibold text-text-primary">{fmtDate(payDate)}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="px-8 pb-8 pt-2 flex flex-col sm:flex-row gap-3">
          <Link
            href="/"
            className="flex-1 inline-flex justify-center items-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold px-5 py-3 rounded-full text-sm shadow-md transition-all active:scale-[.98]"
          >
            <Home size={15} /> Về trang chủ
          </Link>
          <Link
            href="/destination"
            className="flex-1 inline-flex justify-center items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold px-5 py-3 rounded-full text-sm transition-all active:scale-[.98]"
          >
            <Compass size={15} /> Khám phá tour
          </Link>
        </div>

      </div>
    </div>
  );
}

export default function VnPayReturnPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans">
        <p className="text-sm text-slate-500">Đang tải...</p>
      </div>
    }>
      <VnPayReturnContent />
    </Suspense>
  );
}
