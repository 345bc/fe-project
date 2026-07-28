"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import userService from "@/services/user-service";
import bookingService from "@/services/booking-service";
import paymentService from "@/services/payment-service";
import reviewService from "@/services/review-service";
import { 
  User, 
  Mail, 
  Calendar, 
  Key, 
  Shield, 
  Clock, 
  MapPin, 
  Ticket, 
  Briefcase, 
  ChevronDown, 
  ChevronUp, 
  AlertCircle, 
  CheckCircle2, 
  Compass, 
  LogOut, 
  Lock,
  CreditCard,
  Trash2,
  Star,
  Users
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProfilePage() {
  const router = useRouter();
  const { user, handleLogout } = useAuth();
  
  // States
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"info" | "bookings">("info");
  const [profile, setProfile] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [expandedBooking, setExpandedBooking] = useState<number | null>(null);

  // Form states
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Review states
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewBookingId, setReviewBookingId] = useState<number | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewedBookings, setReviewedBookings] = useState<Record<number, boolean>>({});

  // Cancellation modal states
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelBookingId, setCancelBookingId] = useState<number | null>(null);
  const [cancelTourDate, setCancelTourDate] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);

  // Feedback states
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch user data
  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      // Fetch info
      const infoRes = await userService.getMyInfo();
      if (infoRes.code === 1000) {
        setProfile(infoRes.data);
        setEmail(infoRes.data.email || "");
      } else {
        throw new Error(infoRes.message || "Không thể lấy thông tin tài khoản");
      }

      // Fetch bookings
      const bookingsData = await userService.getMyBookings();
      setBookings(bookingsData || []);

      // Check which bookings already have reviews
      const reviewedMap: Record<number, boolean> = {};
      if (bookingsData && bookingsData.length > 0) {
        for (const b of bookingsData) {
          try {
            const reviews = await reviewService.getReviewsByTourId(b.tourDetails?.tour?.id);
            // Check if there is any review matching this booking ID
            const hasReviewed = reviews.some((r: any) => r.booking?.id === b.id);
            if (hasReviewed) {
              reviewedMap[b.id] = true;
            }
          } catch (e) {
            console.error("Error loading review status for booking:", b.id, e);
          }
        }
      }
      setReviewedBookings(reviewedMap);
    } catch (err: any) {
      console.error("Fetch profile error:", err);
      setError(err.message || "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      
      if (err.message?.includes("3000") || err.message?.toLowerCase().includes("unauthenticated") || err.message?.toLowerCase().includes("expired")) {
        setTimeout(() => {
          handleLogout();
        }, 2500);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      router.push("/sign-in");
      return;
    }
    loadData();
  }, [router]);

  // Handle Profile Submit
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email.trim()) {
      setError("Email không được để trống.");
      return;
    }

    if (newPassword) {
      if (!oldPassword) {
        setError("Vui lòng nhập mật khẩu hiện tại để đổi mật khẩu mới.");
        return;
      }
      if (newPassword.length < 8) {
        setError("Mật khẩu mới phải có tối thiểu 8 ký tự.");
        return;
      }
      if (newPassword !== confirmPassword) {
        setError("Mật khẩu xác nhận không khớp.");
        return;
      }
    }

    try {
      setUpdating(true);
      const updateData: any = {
        name: profile.name,
        email: email,
      };

      if (newPassword) {
        updateData.oldPassword = oldPassword;
        updateData.newPassword = newPassword;
      }

      const res = await userService.updateMyInfo(updateData);
      
      if (res.code === 1000) {
        setProfile(res.data);
        setSuccess("Cập nhật thông tin cá nhân thành công!");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => setSuccess(""), 4000);
      } else {
        throw new Error(res.message || "Cập nhật thất bại");
      }
    } catch (err: any) {
      setError(err.message || "Đã xảy ra lỗi khi cập nhật.");
    } finally {
      setUpdating(false);
    }
  };

  // Pay Now via VNPAY
  const handlePayNow = async (bookingId: number) => {
    try {
      setError("");
      setSuccess("Đang chuyển hướng tới cổng thanh toán VNPAY...");
      const res = await paymentService.createPaymentUrl(bookingId);
      if (res && res.data && res.data.paymentUrl) {
        window.location.href = res.data.paymentUrl;
      } else {
        throw new Error("Không thể tạo URL thanh toán.");
      }
    } catch (err: any) {
      setError(err.message || "Lỗi kết nối cổng thanh toán.");
    }
  };

  // Open Cancel Request Modal
  const openCancelModal = (bookingId: number, departureDate: string, isConfirmed: boolean) => {
    if (!isConfirmed) {
      // If PENDING, cancel directly without warning modal
      confirmCancelBooking(bookingId);
    } else {
      setCancelBookingId(bookingId);
      setCancelTourDate(departureDate);
      setShowCancelModal(true);
    }
  };

  // Confirm and call API to cancel booking
  const confirmCancelBooking = async (bookingId: number) => {
    try {
      setCancelling(true);
      setError("");
      setSuccess("");
      
      const res = await bookingService.cancelBooking(bookingId);
      if (res.code === 1000) {
        setSuccess(res.message || "Đơn hàng đã được hủy thành công!");
        setShowCancelModal(false);
        // Reload list
        const bookingsData = await userService.getMyBookings();
        setBookings(bookingsData || []);
        setTimeout(() => setSuccess(""), 4000);
      } else {
        throw new Error(res.message || "Hủy đơn hàng thất bại.");
      }
    } catch (err: any) {
      setError(err.message || "Lỗi xảy ra khi thực hiện hủy đơn.");
      setShowCancelModal(false);
    } finally {
      setCancelling(false);
    }
  };

  // Open Review Dialog
  const openReviewModal = (bookingId: number) => {
    setReviewBookingId(bookingId);
    setReviewRating(5);
    setReviewComment("");
    setShowReviewModal(true);
  };

  // Submit Review API
  const handleCreateReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewBookingId) return;

    if (!reviewComment.trim()) {
      setError("Vui lòng nhập bình luận đánh giá.");
      return;
    }

    try {
      setSubmittingReview(true);
      setError("");
      setSuccess("");

      const res = await reviewService.createReview({
        booking_id: reviewBookingId,
        rating: reviewRating,
        comment: reviewComment
      });

      if (res.code === 1000) {
        setSuccess("Đánh giá chuyến đi thành công! Cảm ơn phản hồi của bạn.");
        setShowReviewModal(false);
        // Mark as reviewed
        setReviewedBookings(prev => ({ ...prev, [reviewBookingId]: true }));
        setTimeout(() => setSuccess(""), 4000);
      } else {
        throw new Error(res.message || "Gửi đánh giá thất bại.");
      }
    } catch (err: any) {
      setError(err.message || "Đã xảy ra lỗi khi gửi đánh giá.");
    } finally {
      setSubmittingReview(false);
    }
  };

  // Helper date formatter
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  // Format price
  const formatPrice = (amount: number) => {
    if (amount === undefined || amount === null) return "0đ";
    return amount.toLocaleString("vi-VN") + "đ";
  };

  // Toggle booking detail accordion
  const toggleBooking = (id: number) => {
    if (expandedBooking === id) {
      setExpandedBooking(null);
    } else {
      setExpandedBooking(id);
    }
  };

  // Get status class & label
  const getStatusDetails = (status: string) => {
    switch (status) {
      case "PENDING":
        return {
          label: "Chờ thanh toán",
          bg: "bg-amber-50 text-amber-700 border-amber-100",
          dot: "bg-amber-500",
        };
      case "CONFIRMED":
        return {
          label: "Đã xác nhận",
          bg: "bg-emerald-50 text-emerald-700 border-emerald-100",
          dot: "bg-emerald-500",
        };
      case "CANCELLED":
        return {
          label: "Đã hủy",
          bg: "bg-rose-50 text-rose-700 border-rose-100",
          dot: "bg-rose-500",
        };
      case "COMPLETED":
        return {
          label: "Hoàn thành",
          bg: "bg-blue-50 text-blue-700 border-blue-100",
          dot: "bg-blue-500",
        };
      default:
        return {
          label: status,
          bg: "bg-slate-50 text-slate-700 border-slate-100",
          dot: "bg-slate-500",
        };
    }
  };

  // Calculate refund prediction
  const getRefundPrediction = (dateStr: string | null) => {
    if (!dateStr) return { percent: 100, isAllowed: true };
    try {
      const depDate = new Date(dateStr);
      const today = new Date();
      depDate.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);
      
      if (depDate.getTime() <= today.getTime()) {
        return { percent: 0, isAllowed: false };
      }
      
      const diffTime = depDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays >= 10) {
        return { percent: 100, isAllowed: true };
      }
      return { percent: 70, isAllowed: true };
    } catch {
      return { percent: 70, isAllowed: true };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4 md:px-12 font-sans">
        <div className="container-wide w-full max-w-4xl mx-auto space-y-8 animate-pulse">
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs flex flex-col md:flex-row items-center gap-6">
            <div className="w-20 h-20 bg-slate-200 rounded-full" />
            <div className="space-y-3 flex-1">
              <div className="h-6 bg-slate-200 rounded-md w-1/3" />
              <div className="h-4 bg-slate-200 rounded-md w-1/4" />
            </div>
          </div>
          <div className="h-12 bg-white rounded-xl border border-slate-100 shadow-xs" />
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xs h-96" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans p-4">
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl max-w-md w-full text-center space-y-4">
          <AlertCircle size={48} className="text-red-500 mx-auto" />
          <h2 className="text-xl font-bold text-slate-800">Không tìm thấy thông tin tài khoản</h2>
          <p className="text-sm text-slate-500">Chúng tôi không thể lấy thông tin chi tiết của bạn vào lúc này.</p>
          <button 
            onClick={() => handleLogout()}
            className="w-full bg-primary hover:bg-primary/95 text-white font-bold py-3 px-6 rounded-full text-sm transition-all"
          >
            Đăng nhập lại
          </button>
        </div>
      </div>
    );
  }

  const roleText = profile.roles && profile.roles.includes("ADMIN") ? "Quản trị viên" : "Khách hàng";

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 md:px-12 font-sans text-text-primary">
      <div className="container-wide w-full max-w-4xl mx-auto space-y-6">
        
        {/* Alerts */}
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-3 bg-rose-50 border border-rose-100 text-rose-700 px-5 py-4 rounded-2xl text-sm z-50 relative"
            >
              <AlertCircle size={18} className="shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}
          {success && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-3 bg-emerald-50 border border-emerald-100 text-emerald-700 px-5 py-4 rounded-2xl text-sm z-50 relative"
            >
              <CheckCircle2 size={18} className="shrink-0" />
              <span>{success}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Profile Card Header */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-700 flex items-center justify-center text-white text-3xl font-extrabold shadow-md">
              {profile.name?.charAt(0).toUpperCase()}
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl font-black tracking-tight text-primary flex items-center gap-2 justify-center sm:justify-start">
                {profile.name}
              </h1>
              <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start text-xs font-semibold text-slate-500">
                <span className="flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-full text-slate-600">
                  <Shield size={12} /> {roleText}
                </span>
                <span className="flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-full text-slate-600">
                  <Calendar size={12} /> Tham gia: {formatDate(profile.createdAt)}
                </span>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => handleLogout()}
            className="flex items-center gap-2 bg-slate-50 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 border border-slate-200 text-slate-600 font-bold px-5 py-2.5 rounded-full text-sm transition-all"
          >
            <LogOut size={15} /> Đăng xuất
          </button>
        </div>

        {/* Custom Tab Bar Selector */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-1.5 flex gap-2">
          <button
            onClick={() => setActiveTab("info")}
            className={`flex-1 py-3.5 px-4 rounded-xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
              activeTab === "info"
                ? "bg-primary text-white shadow-md"
                : "text-slate-500 hover:text-primary hover:bg-slate-50"
            }`}
          >
            <User size={16} /> Thông tin cá nhân
          </button>
          
          <button
            onClick={() => setActiveTab("bookings")}
            className={`flex-1 py-3.5 px-4 rounded-xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
              activeTab === "bookings"
                ? "bg-primary text-white shadow-md"
                : "text-slate-500 hover:text-primary hover:bg-slate-50"
            }`}
          >
            <Briefcase size={16} /> Lịch sử đặt Tour ({bookings.length})
          </button>
        </div>

        {/* Main Tab Content Card */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden min-h-[400px]">
          
          {/* Personal Info Tab */}
          {activeTab === "info" && (
            <div className="p-6 md:p-8 space-y-8 animate-fade-in">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-lg font-black text-primary">Cài đặt tài khoản</h2>
                <p className="text-xs text-slate-400">Cập nhật email và thay đổi mật khẩu đăng nhập của bạn.</p>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest font-black text-primary px-1">
                      Tên đăng nhập
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-3.5 text-slate-400" size={16} />
                      <input
                        type="text"
                        disabled
                        value={profile.name || ""}
                        className="w-full rounded-full border border-slate-200 bg-slate-50 px-11 py-3 text-sm text-slate-500 outline-none cursor-not-allowed"
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 px-1 block italic">Tên đăng nhập cố định và không thể thay đổi.</span>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest font-black text-primary px-1">
                      Địa chỉ Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-3.5 text-slate-400" size={16} />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="vi-du@email.com"
                        className="w-full rounded-full border border-slate-300 bg-surface px-11 py-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="relative py-4 text-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-100"></div>
                  </div>
                  <span className="relative bg-white px-4 text-[10px] font-black text-primary uppercase tracking-widest flex items-center justify-center gap-1.5 w-fit mx-auto">
                    <Lock size={12} /> Đổi mật khẩu đăng nhập (Tùy chọn)
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest font-black text-primary px-1">
                      Mật khẩu hiện tại
                    </label>
                    <div className="relative">
                      <Key className="absolute left-4 top-3.5 text-slate-400" size={16} />
                      <input
                        type="password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full rounded-full border border-slate-300 bg-surface px-11 py-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest font-black text-primary px-1">
                      Mật khẩu mới
                    </label>
                    <div className="relative">
                      <Key className="absolute left-4 top-3.5 text-slate-400" size={16} />
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Tối thiểu 8 ký tự"
                        className="w-full rounded-full border border-slate-300 bg-surface px-11 py-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest font-black text-primary px-1">
                      Xác nhận mật khẩu mới
                    </label>
                    <div className="relative">
                      <Key className="absolute left-4 top-3.5 text-slate-400" size={16} />
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full rounded-full border border-slate-300 bg-surface px-11 py-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    disabled={updating}
                    className="w-full sm:w-auto bg-primary hover:bg-primary/95 text-white font-bold px-8 py-3.5 rounded-full text-sm shadow-md transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider"
                  >
                    {updating ? "Đang lưu thay đổi..." : "Lưu thay đổi"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Booking History Tab */}
          {activeTab === "bookings" && (
            <div className="p-6 md:p-8 animate-fade-in space-y-6">
              <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h2 className="text-lg font-black text-primary">Các tour du lịch của bạn</h2>
                  <p className="text-xs text-slate-400">Xem lại trạng thái, ngày khởi hành và thông tin thanh toán của các hành trình đã đặt.</p>
                </div>
                <div className="text-[10px] bg-slate-50 text-slate-500 border border-slate-200 px-3 py-1.5 rounded-xl font-medium w-fit shrink-0">
                  ⚠️ Đơn hàng chờ thanh toán sẽ tự động hủy sau 30 phút.
                </div>
              </div>

              {bookings.length === 0 ? (
                <div className="py-16 text-center space-y-5 max-w-sm mx-auto">
                  <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto border border-dashed border-slate-200">
                    <Compass size={28} className="animate-spin-slow" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-slate-800">Chưa có đơn đặt tour nào</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">Bạn chưa đăng ký hành trình du lịch nào với ZTravel. Hãy khám phá và chọn cho mình điểm đến yêu thích nhé!</p>
                  </div>
                  <button
                    onClick={() => router.push("/destination")}
                    className="inline-flex items-center gap-2 bg-primary hover:bg-primary/95 text-white font-bold py-3 px-6 rounded-full text-sm transition-all active:scale-95"
                  >
                    Khám phá tour ngay
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((booking) => {
                    const status = getStatusDetails(booking.status);
                    const isExpanded = expandedBooking === booking.id;
                    const tour = booking.tourDetails?.tour;
                    const departureDateStr = booking.tourDetails?.departureDate;
                    const isPending = booking.status === "PENDING";
                    const isConfirmed = booking.status === "CONFIRMED";
                    const isCompleted = booking.status === "COMPLETED";
                    const hasReviewed = !!reviewedBookings[booking.id];

                    return (
                      <div 
                        key={booking.id}
                        className="border border-slate-100 rounded-3xl overflow-hidden shadow-xs hover:border-slate-200 transition-all bg-white"
                      >
                        {/* Main header row */}
                        <div 
                          className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 select-none"
                        >
                          <div 
                            onClick={() => toggleBooking(booking.id)}
                            className="flex items-center gap-4 w-full md:w-auto cursor-pointer flex-1"
                          >
                            <div className="w-16 h-16 rounded-2xl bg-slate-100 overflow-hidden relative shrink-0">
                              <img 
                                src={booking.tourDetails?.image || tour?.image || "/images/slider-1-clean.jpg"} 
                                alt={tour?.name || "Tour"}
                                className="object-cover w-full h-full"
                              />
                            </div>
                            
                            <div className="space-y-1 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-xs font-mono text-slate-400 font-bold">#{booking.id}</span>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${status.bg}`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                                  {status.label}
                                </span>
                              </div>
                              <h3 className="font-bold text-sm text-text-primary leading-snug line-clamp-1">
                                {tour?.name || "Hành trình ZTravel"}
                              </h3>
                              <p className="text-xs text-slate-500 flex items-center gap-1.5">
                                <Clock size={12} /> {tour?.duration || "Nhiều ngày"} | Khởi hành: {formatDate(departureDateStr)}
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between md:justify-end gap-4 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                            <div className="text-left md:text-right shrink-0 cursor-pointer" onClick={() => toggleBooking(booking.id)}>
                              <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Tổng cộng</span>
                              <span className="text-base font-extrabold text-primary">
                                {formatPrice(booking.total_amount)}
                              </span>
                            </div>

                            {/* Booking Action Buttons */}
                            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
                              {isPending && (
                                <>
                                  <button
                                    onClick={() => handlePayNow(booking.id)}
                                    className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-full text-xs transition-all shadow-sm shadow-emerald-100"
                                  >
                                    <CreditCard size={13} /> Thanh toán
                                  </button>
                                  <button
                                    onClick={() => openCancelModal(booking.id, departureDateStr, false)}
                                    className="flex items-center gap-1.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 border border-slate-200 text-slate-600 font-bold px-4 py-2 rounded-full text-xs transition-all"
                                  >
                                    <Trash2 size={13} /> Hủy đơn
                                  </button>
                                </>
                              )}

                              {isConfirmed && (
                                <>
                                  <button
                                    onClick={() => openCancelModal(booking.id, departureDateStr, true)}
                                    className="flex items-center gap-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-100 text-rose-600 font-bold px-4 py-2 rounded-full text-xs transition-all"
                                  >
                                    <Trash2 size={13} /> Hủy & Hoàn tiền
                                  </button>
                                  <button
                                    onClick={() => openReviewModal(booking.id)}
                                    disabled={hasReviewed}
                                    className={`flex items-center gap-1.5 font-bold px-4 py-2 rounded-full text-xs transition-all shadow-sm ${
                                      hasReviewed
                                        ? "bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                                        : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-100"
                                    }`}
                                  >
                                    <Star size={13} fill={hasReviewed ? "none" : "currentColor"} /> 
                                    {hasReviewed ? "Đã đánh giá" : "Viết đánh giá"}
                                  </button>
                                </>
                              )}

                              {isCompleted && (
                                <button
                                  onClick={() => openReviewModal(booking.id)}
                                  disabled={hasReviewed}
                                  className={`flex items-center gap-1.5 font-bold px-4 py-2 rounded-full text-xs transition-all shadow-sm ${
                                    hasReviewed
                                      ? "bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                                      : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-100"
                                  }`}
                                >
                                  <Star size={13} fill={hasReviewed ? "none" : "currentColor"} /> 
                                  {hasReviewed ? "Đã đánh giá" : "Viết đánh giá"}
                                </button>
                              )}
                              
                              <div 
                                onClick={() => toggleBooking(booking.id)}
                                className="p-2 bg-slate-50 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer shrink-0"
                              >
                                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Accordion detail pane */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: "auto" }}
                              exit={{ height: 0 }}
                              className="overflow-hidden bg-slate-50/50 border-t border-slate-100"
                            >
                              <div className="p-5 space-y-4 text-xs leading-relaxed text-slate-600">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {/* Left Panel */}
                                  <div className="space-y-2.5">
                                    <h4 className="font-bold text-slate-700 uppercase tracking-wider text-[10px] flex items-center gap-1">
                                      <User size={12} className="text-slate-400" /> Liên hệ người đặt
                                    </h4>
                                    <div className="bg-white p-3 rounded-2xl border border-slate-100 space-y-1">
                                      <p><span className="text-slate-400">Họ tên:</span> <span className="font-semibold text-slate-700">{booking.user?.name}</span></p>
                                      <p><span className="text-slate-400">Số điện thoại:</span> <span className="font-semibold text-slate-700">{booking.phone_number || "Chưa cập nhật"}</span></p>
                                      <p><span className="text-slate-400">Email nhận vé:</span> <span className="font-semibold text-slate-700">{booking.email}</span></p>
                                    </div>
                                  </div>

                                  {/* Right Panel */}
                                  <div className="space-y-2.5">
                                    <h4 className="font-bold text-slate-700 uppercase tracking-wider text-[10px] flex items-center gap-1">
                                      <MapPin size={12} className="text-slate-400" /> Chi tiết hành trình
                                    </h4>
                                    <div className="bg-white p-3 rounded-2xl border border-slate-100 space-y-1">
                                      <p><span className="text-slate-400">Điểm khởi hành:</span> <span className="font-semibold text-slate-700">{booking.tourDetails?.departurePlace || "Liên hệ hotline"}</span></p>
                                      <p><span className="text-slate-400">Số ghế đã đặt:</span> <span className="font-semibold text-slate-700">{booking.quantity} chỗ</span></p>
                                      {booking.note && (
                                        <p><span className="text-slate-400">Ghi chú:</span> <span className="italic text-slate-700">"{booking.note}"</span></p>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {/* Passenger details list */}
                                {booking.passengers && booking.passengers.length > 0 && (
                                  <div className="space-y-2.5">
                                    <h4 className="font-bold text-slate-700 uppercase tracking-wider text-[10px] flex items-center gap-1">
                                      <Users size={12} className="text-slate-400" /> Thành viên tham gia ({booking.passengers.length})
                                    </h4>
                                    <div className="bg-white p-3 rounded-2xl border border-slate-100 divide-y divide-slate-50">
                                      {booking.passengers.map((passenger: any) => (
                                        <div key={passenger.id} className="py-2 first:pt-0 last:pb-0 flex justify-between items-center text-xs">
                                          <div>
                                            <span className="font-semibold text-slate-700">{passenger.fullName}</span>
                                            <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-md ml-2 font-bold uppercase">
                                              {passenger.type === "ADULT" ? "Người lớn" : passenger.type === "CHILDREN" ? "Trẻ em" : passenger.type === "YOUNG_CHILD" ? "Trẻ nhỏ" : "Em bé"}
                                            </span>
                                          </div>
                                          <div className="text-slate-500 flex items-center gap-2">
                                            <span>{passenger.gender === "MALE" ? "Nam" : "Nữ"}</span>
                                            <span>•</span>
                                            <span>SĐT: {passenger.phoneNumber || "Chưa nhập"}</span>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Pricing Breakdown Panel */}
                                <div className="space-y-2.5">
                                  <h4 className="font-bold text-slate-700 uppercase tracking-wider text-[10px] flex items-center gap-1">
                                    <Ticket size={12} className="text-slate-400" /> Chi tiết giá & Khuyến mãi
                                  </h4>
                                  <div className="bg-white p-4 rounded-2xl border border-slate-100 space-y-2">
                                    {booking.discount_amount > 0 && (
                                      <div className="flex justify-between items-center text-slate-600 border-b border-slate-50 pb-2">
                                        <span className="flex items-center gap-1">
                                          <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-1.5 py-0.5 rounded text-[10px] font-bold">
                                            {booking.discount?.code || "COUPON"}
                                          </span>
                                          Khuyến mãi giảm giá
                                        </span>
                                        <span className="font-bold text-emerald-600">-{formatPrice(booking.discount_amount)}</span>
                                      </div>
                                    )}
                                    <div className="flex justify-between items-center text-sm pt-1">
                                      <span className="font-bold text-slate-700">Giá trị thanh toán</span>
                                      <span className="font-extrabold text-primary">{formatPrice(booking.total_amount)}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

        </div>

      </div>

      {/* Review Dialog/Modal */}
      <AnimatePresence>
        {showReviewModal && (
          <div className="fixed inset-0 z-120 flex items-center justify-center p-4 bg-black/55 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-slate-100 space-y-5"
            >
              <div className="text-center space-y-2">
                <h3 className="text-lg font-black text-primary">Đánh giá tour du lịch</h3>
                <p className="text-xs text-slate-400 leading-relaxed">Chia sẻ cảm nhận của bạn về hành trình để giúp ZTravel cải thiện chất lượng dịch vụ tốt hơn.</p>
              </div>

              <form onSubmit={handleCreateReview} className="space-y-4">
                
                {/* Rating selection */}
                <div className="space-y-1.5 text-center">
                  <label className="text-[10px] uppercase tracking-widest font-black text-primary block">
                    Đánh giá sao
                  </label>
                  <div className="flex items-center justify-center gap-1.5 pt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className="p-1 hover:scale-110 transition-transform text-amber-400"
                      >
                        <Star size={32} fill={star <= reviewRating ? "currentColor" : "none"} strokeWidth={1.5} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Comment Textarea */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest font-black text-primary block px-1">
                    Nội dung nhận xét
                  </label>
                  <textarea
                    rows={4}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Hãy chia sẻ những kỷ niệm đẹp hoặc ý kiến đóng góp của bạn về hướng dẫn viên, đồ ăn, phòng nghỉ..."
                    className="w-full rounded-2xl border border-slate-300 bg-surface px-4 py-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
                  />
                </div>

                {/* Action buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowReviewModal(false)}
                    className="flex-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 font-bold py-3 px-5 rounded-full text-xs transition-all uppercase tracking-wider"
                  >
                    Bỏ qua
                  </button>
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="flex-1 bg-primary hover:bg-primary/95 text-white font-bold py-3 px-5 rounded-full text-xs transition-all shadow-md active:scale-95 disabled:opacity-50 uppercase tracking-wider"
                  >
                    {submittingReview ? "Đang gửi..." : "Gửi đánh giá"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Cancellation Warning Modal */}
      <AnimatePresence>
        {showCancelModal && (
          <div className="fixed inset-0 z-120 flex items-center justify-center p-4 bg-black/55 backdrop-blur-xs">
            {(() => {
              const pred = getRefundPrediction(cancelTourDate);
              return (
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-slate-100 space-y-5"
                >
                  <div className="text-center space-y-2.5">
                    <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto">
                      <AlertCircle size={26} />
                    </div>
                    <h3 className="text-lg font-black text-rose-600">Yêu cầu hủy chuyến đi</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">Bạn đang thực hiện yêu cầu hủy tour đã thanh toán. Vui lòng xác nhận chính sách hoàn tiền áp dụng dưới đây:</p>
                  </div>

                  <div className="bg-slate-50 p-4 border border-slate-200/80 rounded-2xl text-xs text-slate-600 space-y-2.5">
                    <p className="font-semibold text-slate-700 uppercase text-[9px] tracking-wider text-slate-400">Điều khoản hoàn tiền:</p>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span>Hủy trước khởi hành &ge; 10 ngày:</span>
                        <span className="font-bold text-emerald-600">Hoàn 100%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Hủy trước khởi hành &lt; 10 ngày:</span>
                        <span className="font-bold text-amber-600">Hoàn 70%</span>
                      </div>
                    </div>
                    <div className="border-t border-slate-200/60 pt-2 flex justify-between items-center text-sm">
                      <span className="font-bold text-slate-700">Mức hoàn tiền của bạn:</span>
                      <span className="font-extrabold text-blue-600">Hoàn {pred.percent}%</span>
                    </div>
                  </div>

                  {!pred.isAllowed && (
                    <div className="text-xs text-red-600 font-bold text-center">
                      ⚠️ Tour đã hoặc đang khởi hành không được phép hủy trực tuyến.
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowCancelModal(false)}
                      className="flex-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 font-bold py-3 px-5 rounded-full text-xs transition-all uppercase tracking-wider"
                    >
                      Bỏ qua
                    </button>
                    <button
                      type="button"
                      disabled={cancelling || !pred.isAllowed}
                      onClick={() => cancelBookingId && confirmCancelBooking(cancelBookingId)}
                      className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 px-5 rounded-full text-xs transition-all shadow-md active:scale-95 disabled:opacity-50 uppercase tracking-wider"
                    >
                      {cancelling ? "Đang xử lý..." : "Xác nhận hủy"}
                    </button>
                  </div>
                </motion.div>
              );
            })()}
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
