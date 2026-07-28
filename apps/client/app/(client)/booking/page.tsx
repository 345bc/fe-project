"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  User, Phone, Mail, Home, Minus, Plus,
  ChevronDown, ChevronUp, AlertCircle, ArrowLeft,
  Check, QrCode, ChevronRight
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import tourDetailService from "@/services/tour_detail-service";
import bookingService from "@/services/booking-service";
import paymentService from "@/services/payment-service";
import ServiceAddition from "@/services/tourService-service";
import { getUser } from "@/utils/auth";

interface Tour {
  id: number;
  name: string;
  price: number;
  status: string;
  duration: string;
  image: string;
  description: string;
  transports: {
    id: number;
    name: string;
  };
  destination: {
    id: number;
    name: string;
  };
}

interface TourDetailData {
  id: number;
  uuid: string;
  tour: Tour;
  image: string;
  departurePlace: string;
  departureDate: string;
  seatsAvailable: number;
  maxSeats: number;
  status: string;
}

function BookingPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const detailIdParam = searchParams.get("detailId");
  const detailId = detailIdParam ? parseInt(detailIdParam) : null;
  const servicesParam = searchParams.get("services");

  const [detail, setDetail] = useState<TourDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [selectedServices, setSelectedServices] = useState<any[]>([]);
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Contact Info State
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactAddress, setContactAddress] = useState("");

  // Passenger Quantities
  const [adultCount, setAdultCount] = useState(1);
  const [childCount, setChildCount] = useState(0);
  const [youngChildCount, setYoungChildCount] = useState(0);
  const [infantCount, setInfantCount] = useState(0);

  // Accordion Toggles
  const [isVehicleOpen, setIsVehicleOpen] = useState(false);
  const [isCostOpen, setIsCostOpen] = useState(true);

  // Passenger Details
  interface PassengerInput {
    fullName: string;
    phoneNumber: string;
    dateOfBirth: string;
    gender: "MALE" | "FEMALE";
  }
  const [passengers, setPassengers] = useState<PassengerInput[]>([
    { fullName: "", phoneNumber: "", dateOfBirth: "", gender: "MALE" }
  ]);

  // Discount code & Notes
  const [couponCode, setCouponCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [notes, setNotes] = useState("");

  // Terms agree checkbox
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showErrors, setShowErrors] = useState(false);

  // Dynamic pricing state managed by backend
  const [prices, setPrices] = useState({
    adultPrice: 0,
    childPrice: 0,
    youngChildPrice: 0,
    infantPrice: 0,
    totalAdultCost: 0,
    totalChildCost: 0,
    totalYoungChildCost: 0,
    totalInfantCost: 0,
    subTotalAmount: 0,
    discountAmount: 0,
    comboDiscount: 0,
    discountId: null as number | null,
    finalPrice: 0,
  });

  useEffect(() => {
    // Check logged in user
    const user = getUser() as any;
    if (!user) {
      const redirectPath = `/booking${detailIdParam ? `?detailId=${detailIdParam}` : ""}${servicesParam ? `&services=${servicesParam}` : ""}`;
      setIsRedirecting(true);
      const timer = setTimeout(() => {
        router.push(`/sign-in?redirect=${encodeURIComponent(redirectPath)}`);
      }, 700);
      return () => clearTimeout(timer);
    } else {
      setCurrentUser(user);
      setContactName(user.sub || "");
      setContactEmail(user.email || "");
    }
  }, [detailIdParam, servicesParam, router]);

  useEffect(() => {
    const fetchServices = async () => {
      if (!servicesParam) return;
      try {
        const ids = servicesParam.split(",").map(id => parseInt(id)).filter(id => !isNaN(id));
        if (ids.length === 0) return;
        const allServices = await ServiceAddition.getServiceAddtion();
        if (allServices && Array.isArray(allServices)) {
          const filtered = allServices.filter((s: any) => ids.includes(s.id));
          setSelectedServices(filtered);
        }
      } catch (err) {
        console.error("Error fetching services details:", err);
      }
    };
    fetchServices();
  }, [servicesParam]);

  useEffect(() => {
    const fetchTourDetail = async () => {
      if (!detailId) {
        setError("Mã lịch trình tour không hợp lệ. Vui lòng quay lại.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const detailData = await tourDetailService.getTourDetailById(detailId);
        if (detailData) {
          setDetail(detailData);
          // Initialize prices based on base price
          const basePrice = detailData.tour.price;
          setPrices(prev => ({
            ...prev,
            adultPrice: basePrice,
            childPrice: basePrice * 0.5,
            youngChildPrice: basePrice * 0.25,
            infantPrice: basePrice * 0,
            totalAdultCost: basePrice,
            subTotalAmount: basePrice,
            finalPrice: basePrice,
          }));
        } else {
          setError("Không tìm thấy thông tin lịch trình tour.");
        }
      } catch (err: any) {
        console.error("Error fetching detail for booking:", err);
        setError(err.message || "Đã xảy ra lỗi khi tải dữ liệu từ máy chủ.");
      } finally {
        setLoading(false);
      }
    };
    fetchTourDetail();
  }, [detailId]);

  // Sync passenger states when quantities change
  const totalPassengers = adultCount + childCount + youngChildCount + infantCount;

  useEffect(() => {
    setPassengers(prev => {
      const next = [...prev];
      if (next.length < totalPassengers) {
        while (next.length < totalPassengers) {
          next.push({ fullName: "", phoneNumber: "", dateOfBirth: "", gender: "MALE" });
        }
      } else if (next.length > totalPassengers) {
        next.splice(totalPassengers);
      }
      return next;
    });
  }, [totalPassengers]);

  // Reactively fetch calculated price from backend when options change
  useEffect(() => {
    const fetchCalculatedPrice = async () => {
      if (!detailId) return;
      try {
        const ids = servicesParam ? servicesParam.split(",").map(id => parseInt(id)).filter(id => !isNaN(id)) : [];
        const result = await bookingService.calculatePrice({
          tour_detail_id: detailId,
          adultCount,
          childCount,
          youngChildCount,
          infantCount,
          couponCode: isCouponApplied ? couponCode.trim() : "",
          serviceIds: ids,
        });
        if (result.data) {
          setPrices(result.data);
        }
      } catch (err) {
        console.error("Error calculating price from backend:", err);
      }
    };

    fetchCalculatedPrice();
  }, [detailId, adultCount, childCount, youngChildCount, infantCount, isCouponApplied, couponCode, servicesParam]);

  const formatPrice = (price: number) => {
    return price.toLocaleString("vi-VN") + "đ";
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponError(null);
    try {
      const ids = servicesParam ? servicesParam.split(",").map(id => parseInt(id)).filter(id => !isNaN(id)) : [];
      const result = await bookingService.calculatePrice({
        tour_detail_id: detailId,
        adultCount,
        childCount,
        youngChildCount,
        infantCount,
        couponCode: couponCode.trim(),
        serviceIds: ids,
      });
      if (result.data) {
        setPrices(result.data);
        if (result.data.discountAmount > 0) {
          setIsCouponApplied(true);
          setDiscountAmount(result.data.discountAmount);
          setCouponError(null);
        } else {
          setCouponError("Mã giảm giá không hợp lệ hoặc không đủ điều kiện.");
          setIsCouponApplied(false);
          setDiscountAmount(0);
        }
      }
    } catch (err: any) {
      console.error(err);
      setCouponError(err.message || "Lỗi kiểm tra mã giảm giá.");
      setIsCouponApplied(false);
      setDiscountAmount(0);
    }
  };

  if (isRedirecting) {
    return (
      <div
        className="min-h-screen bg-slate-50 flex items-center justify-center font-sans"
        style={{ animation: "fadeIn 0.25s ease-out" }}
      >
        <style>{`
          @keyframes fadeIn { from { opacity: 0; transform: scale(0.97); } to { opacity: 1; transform: scale(1); } }
          @keyframes slideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        `}</style>

        {/* Decorative blur shapes */}
        <div className="absolute top-1/3 left-1/2 -translate-x-[260px] w-72 h-72 bg-blue-100/60 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 translate-x-[80px] w-56 h-56 bg-indigo-100/50 rounded-full blur-3xl pointer-events-none" />

        <div
          className="relative bg-white rounded-3xl p-10 shadow-xl border border-slate-100 max-w-sm w-full mx-4 text-center space-y-5"
          style={{ animation: "slideUp 0.35s ease-out" }}
        >
          {/* Animated ring spinner */}
          <div className="relative w-16 h-16 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-blue-100" />
            <div className="absolute inset-0 rounded-full border-4 border-t-blue-600 border-r-transparent border-b-transparent border-l-transparent animate-spin" />
            <div className="absolute inset-2 bg-blue-50 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
          </div>

          <div className="space-y-1.5">
            <h2 className="text-lg font-extrabold text-slate-900">Vui lòng đăng nhập</h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              Bạn cần đăng nhập để tiếp tục đặt tour.<br />
              Đang chuyển đến trang đăng nhập...
            </p>
          </div>

          {/* Animated progress bar */}
          <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
              style={{ animation: "progressBar 0.65s ease-in-out forwards" }}
            />
          </div>
          <style>{`@keyframes progressBar { from { width: 0%; } to { width: 100%; } }`}</style>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-slate-200 h-10 w-10"></div>
          <div className="flex-1 space-y-6 py-1">
            <div className="h-2 bg-slate-200 rounded w-36"></div>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4">
                <div className="h-2 bg-slate-200 rounded col-span-2"></div>
                <div className="h-2 bg-slate-200 rounded col-span-1"></div>
              </div>
              <div className="h-2 bg-slate-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !detail) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center border border-slate-100 space-y-6">
          <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle size={36} />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 mb-2">Không thể tải thông tin</h2>
            <p className="text-sm text-slate-500 leading-relaxed">{error || "Lịch trình tour không khả dụng."}</p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-full text-sm transition-all shadow-md"
          >
            <ArrowLeft size={16} /> Quay về Trang chủ
          </Link>
        </div>
      </div>
    );
  }

  const tour = detail.tour;

  // Form Validation
  const emailError = contactEmail.trim() === ""
    ? (showErrors ? "Email liên hệ không được để trống" : "")
    : (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail.trim())
      ? "Địa chỉ email không hợp lệ (ví dụ: name@example.com)"
      : "");

  const phoneError = contactPhone.trim() === ""
    ? (showErrors ? "Số điện thoại liên hệ không được để trống" : "")
    : (!/^[0-9]{10}$/.test(contactPhone.trim())
      ? "Số điện thoại phải gồm 10 chữ số"
      : "");

  const nameError = contactName.trim() === "" && showErrors
    ? "Họ tên liên hệ không được để trống"
    : "";

  const getPassengerErrors = (p: PassengerInput) => {
    const errors = { fullName: "", phoneNumber: "", dateOfBirth: "" };
    const hasAnyInput = p.fullName.trim() !== "" || p.phoneNumber.trim() !== "" || p.dateOfBirth.trim() !== "";
    
    if (showErrors || hasAnyInput) {
      if (p.fullName.trim() === "") {
        errors.fullName = "Họ tên không được để trống";
      }
      if (p.phoneNumber.trim() === "") {
        errors.phoneNumber = "Số điện thoại không được để trống";
      } else if (!/^[0-9]{10}$/.test(p.phoneNumber.trim())) {
        errors.phoneNumber = "Số điện thoại phải gồm 10 chữ số";
      }
      if (p.dateOfBirth.trim() === "") {
        errors.dateOfBirth = "Ngày sinh không được để trống";
      }
    }
    return errors;
  };

  const isFormValid =
    contactName.trim().length > 0 &&
    contactPhone.trim().length > 0 &&
    contactEmail.trim().length > 0 &&
    !emailError &&
    !phoneError &&
    passengers.every(p => 
      p.fullName.trim().length > 0 && 
      p.phoneNumber.trim().match(/^[0-9]{10}$/) && 
      p.dateOfBirth.trim().length > 0
    );

  const handleBookingSubmit = async () => {
    if (!detail) return;
    if (!isFormValid) return;

    try {
      setSubmitting(true);
      const ids = servicesParam ? servicesParam.split(",").map(id => parseInt(id)).filter(id => !isNaN(id)) : [];

      const passengersList = passengers.map((p, index) => {
        let type = "ADULT";
        if (index >= adultCount && index < adultCount + childCount) {
          type = "CHILDREN";
        } else if (index >= adultCount + childCount && index < adultCount + childCount + youngChildCount) {
          type = "YOUNG_CHILD";
        } else if (index >= adultCount + childCount + youngChildCount) {
          type = "BABY";
        }
        return {
          fullName: p.fullName.trim(),
          type: type,
          phoneNumber: p.phoneNumber.trim(),
          dateOfBirth: p.dateOfBirth,
          gender: p.gender,
        };
      });

      const bookingRequest = {
        tour_detail_id: detail.id,
        user_id: currentUser?.userId,
        quantity: totalPassengers,
        total_amount: prices.finalPrice,
        note: `Liên hệ: ${contactName} - SĐT: ${contactPhone} - Địa chỉ: ${contactAddress}. Ghi chú khách hàng: ${notes}`,
        phone_number: contactPhone,
        email: contactEmail,
        discount_id: prices.discountId,
        discount_amount: prices.discountAmount,
        adultCount,
        childCount,
        youngChildCount,
        infantCount,
        couponCode: isCouponApplied ? couponCode.trim() : "",
        serviceIds: ids,
        passengers: passengersList,
      };

      const res = await bookingService.createBooking(bookingRequest);
      const bookingId = res.data?.id;
      if (!bookingId) {
        throw new Error("Không lấy được mã đơn hàng từ hệ thống.");
      }

      // Generate VNPay URL
      const paymentRes = await paymentService.createPaymentUrl(bookingId);
      const paymentUrl = paymentRes.data?.paymentUrl;
      if (paymentUrl) {
        window.location.href = paymentUrl;
      } else {
        throw new Error("Không thể tạo liên kết thanh toán VNPay.");
      }
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Đã xảy ra lỗi trong quá trình đặt tour. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  // Helper to generate passenger label
  const getPassengerLabel = (index: number) => {
    if (index < adultCount) return `Người lớn #${index + 1}`;
    const childIndex = index - adultCount;
    if (childIndex < childCount) return `Trẻ em #${childIndex + 1}`;
    const youngIndex = childIndex - childCount;
    if (youngIndex < youngChildCount) return `Trẻ nhỏ #${youngIndex + 1}`;
    const infantIndex = youngIndex - youngChildCount;
    return `Em bé #${infantIndex + 1}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20 pt-6">
      <div className="max-w-[1200px] mx-auto px-4">
        {/* Stepper indicator matching return page */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-4 bg-white border border-slate-100/80 rounded-2xl px-5 py-3 w-fit shadow-xs text-sm font-sans font-bold">
            {/* Step 1: Active */}
            <div className="flex items-center gap-2 text-primary">
              <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-black ring-4 ring-blue-100">1</span>
              <span>Nhập thông tin</span>
            </div>

            {/* Divider */}
            <ChevronRight size={14} className="text-slate-400 shrink-0" />

            {/* Step 2: Pending */}
            <div className="flex items-center gap-2 text-slate-400">
              <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-xs font-black">2</span>
              <span>Thanh toán</span>
            </div>

            {/* Divider */}
            <ChevronRight size={14} className="text-slate-400 shrink-0" />

            {/* Step 3: Pending */}
            <div className="flex items-center gap-2 text-slate-400">
              <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-xs font-black">3</span>
              <span>Hoàn tất</span>
            </div>
          </div>
        </div>

        {/* Navigation Breadcrumb / Title */}


        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Side: Booking Forms */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xs   md:flex-row md:items-center gap-2 grid grid-cols-1 ">
              <h1 className="text-xl md:text-3xl font-bold tracking-normal font-sans text-text-primary  text-balance leading-normal">
                Đặt tour của bạn
              </h1>
              <h1 className="text-xl md:text-sm font-semibold tracking-normal font-sans text-text-secondary  text-balance leading-tight">
                Hãy đảm bảo tất cả thông tin chi tiết trên trang này đã chính xác trước khi tiến hành thanh toán.
              </h1>
            </div>


            {/* Contact Info Card */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  Thông tin liên lạc
                </h2>
              </div>

              {/* Grid Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Họ tên
                    <span className="text-red-700"> (*)</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 " size={16} />
                    <input
                      type="text"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="Nguyễn Văn A"
                      className={`w-full bg-slate-50/70 border rounded-2xl pl-11 pr-4 py-3 text-sm focus:bg-white focus:ring-1 outline-none transition ${nameError ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500" : "border-slate-200/80 focus:border-blue-500 focus:ring-blue-500"}`}
                    />
                  </div>
                  {nameError && (
                    <p className="text-[11px] font-semibold text-rose-500 ml-1">{nameError}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Số điện thoại                    <span className="text-red-700"> (*)</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={16} />
                    <input
                      type="text"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="0123456789"
                      className={`w-full bg-slate-50/70 border rounded-2xl pl-11 pr-4 py-3 text-sm focus:bg-white focus:ring-1 outline-none transition ${phoneError ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500" : "border-slate-200/80 focus:border-blue-500 focus:ring-blue-500"
                        }`}
                    />
                  </div>
                  {phoneError && (
                    <p className="text-[11px] font-semibold text-rose-500 ml-1">{phoneError}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email                     <span className="text-red-700"> (*)</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="email@example.com"
                      className={`w-full bg-slate-50/70 border rounded-2xl pl-11 pr-4 py-3 text-sm focus:bg-white focus:ring-1 outline-none transition ${emailError ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500" : "border-slate-200/80 focus:border-blue-500 focus:ring-blue-500"
                        }`}
                    />
                  </div>
                  {emailError && (
                    <p className="text-[11px] font-semibold text-rose-500 ml-1">{emailError}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Địa chỉ</label>
                  <div className="relative">
                    <Home className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      type="text"
                      value={contactAddress}
                      onChange={(e) => setContactAddress(e.target.value)}
                      placeholder="190 Pasteur, Quận 3, TP.HCM"
                      className="w-full bg-slate-50/70 border border-slate-200/80 rounded-2xl pl-11 pr-4 py-3 text-sm focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Passenger Quantities Card */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-lg font-bold text-slate-900">Hành khách</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Adults */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div>
                    <div className="font-semibold text-slate-800 text-sm">Người lớn</div>
                    <div className="text-[11px] text-slate-400">Từ 12 tuổi trở lên</div>
                  </div>
                  <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-2 py-1 shadow-sm">
                    <button
                      type="button"
                      onClick={() => setAdultCount(Math.max(1, adultCount - 1))}
                      className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-blue-600 transition"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="font-bold text-slate-800 w-4 text-center text-sm">{adultCount}</span>
                    <button
                      type="button"
                      onClick={() => setAdultCount(adultCount + 1)}
                      className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-blue-600 transition"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                {/* Children */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div>
                    <div className="font-semibold text-slate-800 text-sm">Trẻ em</div>
                    <div className="text-[11px] text-slate-400">Từ 5 - 11 tuổi</div>
                  </div>
                  <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-2 py-1 shadow-sm">
                    <button
                      type="button"
                      onClick={() => setChildCount(Math.max(0, childCount - 1))}
                      className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-blue-600 transition"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="font-bold text-slate-800 w-4 text-center text-sm">{childCount}</span>
                    <button
                      type="button"
                      onClick={() => setChildCount(childCount + 1)}
                      className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-blue-600 transition"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                {/* Young Children */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div>
                    <div className="font-semibold text-slate-800 text-sm">Trẻ nhỏ</div>
                    <div className="text-[11px] text-slate-400">Từ 2 - 4 tuổi</div>
                  </div>
                  <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-2 py-1 shadow-sm">
                    <button
                      type="button"
                      onClick={() => setYoungChildCount(Math.max(0, youngChildCount - 1))}
                      className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-blue-600 transition"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="font-bold text-slate-800 w-4 text-center text-sm">{youngChildCount}</span>
                    <button
                      type="button"
                      onClick={() => setYoungChildCount(youngChildCount + 1)}
                      className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-blue-600 transition"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                {/* Infants */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div>
                    <div className="font-semibold text-slate-800 text-sm">Em bé</div>
                    <div className="text-[11px] text-slate-400">Dưới 2 tuổi</div>
                  </div>
                  <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-2 py-1 shadow-sm">
                    <button
                      type="button"
                      onClick={() => setInfantCount(Math.max(0, infantCount - 1))}
                      className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-blue-600 transition"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="font-bold text-slate-800 w-4 text-center text-sm">{infantCount}</span>
                    <button
                      type="button"
                      onClick={() => setInfantCount(infantCount + 1)}
                      className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-blue-600 transition"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Passenger Information Forms */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-lg font-bold text-slate-900">Thông tin hành khách</h2>
              </div>

              {/* Dynamic passenger fields */}
              <div className="space-y-6 pt-2">
                {Array.from({ length: totalPassengers }).map((_, index) => {
                  const label = getPassengerLabel(index);
                  const pErrors = getPassengerErrors(passengers[index] || { fullName: "", phoneNumber: "", dateOfBirth: "", gender: "MALE" });
                  return (
                    <div key={index} className="bg-slate-50/50 border border-slate-100 rounded-2xl p-4 space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-sm font-extrabold text-primary flex items-center gap-1.5">
                          <User size={16} /> #{index + 1} {label}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Name input */}
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-400">
                            Họ và tên <span className="text-red-700">(*)</span>
                          </label>
                          <input
                            type="text"
                            placeholder="Nhập họ tên hành khách"
                            value={passengers[index]?.fullName || ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              setPassengers(prev => {
                                const next = [...prev];
                                const current = next[index] || { fullName: "", phoneNumber: "", dateOfBirth: "", gender: "MALE" };
                                next[index] = { ...current, fullName: val };
                                return next;
                              });
                            }}
                            className={`w-full bg-white border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-1 transition ${
                              pErrors.fullName ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500" : "border-slate-200/80 focus:border-blue-500 focus:ring-blue-500"
                            }`}
                          />
                          {pErrors.fullName && (
                            <p className="text-[11px] font-semibold text-rose-500 ml-1">{pErrors.fullName}</p>
                          )}
                        </div>

                        {/* Phone input */}
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-400">
                            Số điện thoại <span className="text-red-700">(*)</span>
                          </label>
                          <input
                            type="text"
                            placeholder="0123456789"
                            value={passengers[index]?.phoneNumber || ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              setPassengers(prev => {
                                const next = [...prev];
                                const current = next[index] || { fullName: "", phoneNumber: "", dateOfBirth: "", gender: "MALE" };
                                next[index] = { ...current, phoneNumber: val };
                                return next;
                              });
                            }}
                            className={`w-full bg-white border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-1 transition ${
                              pErrors.phoneNumber ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500" : "border-slate-200/80 focus:border-blue-500 focus:ring-blue-500"
                            }`}
                          />
                          {pErrors.phoneNumber && (
                            <p className="text-[11px] font-semibold text-rose-500 ml-1">{pErrors.phoneNumber}</p>
                          )}
                        </div>

                        {/* Date of Birth input */}
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-400">
                            Ngày sinh <span className="text-red-700">(*)</span>
                          </label>
                          <input
                            type="date"
                            value={passengers[index]?.dateOfBirth || ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              setPassengers(prev => {
                                const next = [...prev];
                                const current = next[index] || { fullName: "", phoneNumber: "", dateOfBirth: "", gender: "MALE" };
                                next[index] = { ...current, dateOfBirth: val };
                                return next;
                              });
                            }}
                            className={`w-full bg-white border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-1 transition text-slate-700 ${
                              pErrors.dateOfBirth ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500" : "border-slate-200/80 focus:border-blue-500 focus:ring-blue-500"
                            }`}
                          />
                          {pErrors.dateOfBirth && (
                            <p className="text-[11px] font-semibold text-rose-500 ml-1">{pErrors.dateOfBirth}</p>
                          )}
                        </div>

                        {/* Gender input */}
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-400">
                            Giới tính <span className="text-red-700">(*)</span>
                          </label>
                          <select
                            value={passengers[index]?.gender || "MALE"}
                            onChange={(e) => {
                              const val = e.target.value as "MALE" | "FEMALE";
                              setPassengers(prev => {
                                const next = [...prev];
                                const current = next[index] || { fullName: "", phoneNumber: "", dateOfBirth: "", gender: "MALE" };
                                next[index] = { ...current, gender: val };
                                return next;
                              });
                            }}
                            className="w-full bg-white border border-slate-200/80 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition text-slate-700"
                          >
                            <option value="MALE">Nam</option>
                            <option value="FEMALE">Nữ</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Discount Code Card */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-4">
              <h2 className="text-lg font-bold text-slate-900">Mã ưu đãi</h2>
              <div className="flex gap-3 max-w-md">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => {
                    setCouponCode(e.target.value);
                    setCouponError(null);
                    setIsCouponApplied(false);
                  }}
                  placeholder="ZTRAVEL500"
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="bg-slate-200 text-slate-700 px-6 py-2.5 rounded-2xl text-sm font-bold hover:bg-blue-600 hover:text-white transition active:scale-95 shrink-0"
                >
                  Áp dụng
                </button>
              </div>
              {isCouponApplied && prices.discountAmount > 0 && (
                <div className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                  <Check size={14} /> Áp dụng thành công! Đã giảm {formatPrice(prices.discountAmount)}.
                </div>
              )}
              {couponError && (
                <div className="text-xs font-bold text-rose-600 flex items-center gap-1">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{couponError}</span>
                </div>
              )}
            </div>

            {/* Notes Card */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-4">
              <h2 className="text-lg font-bold text-slate-900">Ghi chú</h2>
              <textarea
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ví dụ: Bữa ăn chay, phòng gia đình gần nhau, khách đi trễ..."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition resize-none"
              />
            </div>

          </div>

          {/* Right Side: Order Summary sticky widget */}
          <div className="lg:col-span-1 lg:sticky lg:top-24 space-y-4">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-6">
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Tóm tắt đơn hàng</h2>

              {/* Tour card header */}
              <div className="flex gap-4 items-start">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                  <Image
                    src={detail.image ? (detail.image.startsWith("http") || detail.image.startsWith("/") ? detail.image : `/images/${detail.image}`) : "/images/demo_banner.jpg"}
                    alt={tour.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-800 text-xs leading-normal line-clamp-2">{tour.name}</h3>
                  <div className="text-[10px] text-blue-600 font-semibold flex items-center gap-1">
                    <QrCode size={11} /> {detail.uuid}
                  </div>
                </div>
              </div>

              {/* Accordions */}
              <div className="border-t border-slate-100 pt-4 space-y-2.5">
                {/* Vehicle Accordion */}
                <div className="border border-slate-100 rounded-2xl overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setIsVehicleOpen(!isVehicleOpen)}
                    className="w-full flex justify-between items-center px-4 py-3 bg-slate-50/50 hover:bg-slate-50 text-left text-xs font-bold text-slate-600 transition"
                  >
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined">
                        info
                      </span>
                      Thông tin chuyến đi</span>
                    {isVehicleOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                  {isVehicleOpen && (
                    <div className="p-4 border-t border-slate-100 text-xs text-slate-500 space-y-2 bg-white">
                      <div className="flex justify-between">
                        <span>Khởi hành từ:</span>
                        <span className="font-semibold text-slate-700">{detail.departurePlace}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Ngày khởi hành:</span>
                        <span className="font-semibold text-slate-700">{detail.departureDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Phương tiện:</span>
                        <span className="font-semibold text-slate-700">{tour.transports?.name || "N/A"}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Cost breakdown Accordion */}
                <div className="border border-slate-100 rounded-2xl overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setIsCostOpen(!isCostOpen)}
                    className="w-full flex justify-between items-center px-4 py-3 bg-slate-50/50 hover:bg-slate-50 text-left text-xs font-bold text-slate-600 transition"
                  >
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined">
                        payments
                      </span>
                      Chi tiết chi phí</span>
                    {isCostOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                  {isCostOpen && (
                    <div className="p-4 border-t border-slate-100 text-xs text-slate-500 space-y-2.5 bg-white">
                      {adultCount > 0 && (
                        <div className="flex justify-between">
                          <span>Người lớn ({adultCount} x {formatPrice(prices.adultPrice)})</span>
                          <span className="font-semibold text-slate-700">{formatPrice(prices.totalAdultCost)}</span>
                        </div>
                      )}
                      {childCount > 0 && (
                        <div className="flex justify-between">
                          <span>Trẻ em ({childCount} x {formatPrice(prices.childPrice)})</span>
                          <span className="font-semibold text-slate-700">{formatPrice(prices.totalChildCost)}</span>
                        </div>
                      )}
                      {youngChildCount > 0 && (
                        <div className="flex justify-between">
                          <span>Trẻ nhỏ ({youngChildCount} x {formatPrice(prices.youngChildPrice)})</span>
                          <span className="font-semibold text-slate-700">{formatPrice(prices.totalYoungChildCost)}</span>
                        </div>
                      )}
                      {infantCount > 0 && (
                        <div className="flex justify-between">
                          <span>Em bé ({infantCount} x {formatPrice(prices.infantPrice)})</span>
                          <span className="font-semibold text-slate-700">{formatPrice(prices.totalInfantCost)}</span>
                        </div>
                      )}
                      {selectedServices.length > 0 && (
                        <div className="border-t border-dashed border-slate-100 pt-2.5 space-y-2">
                          <div className="font-bold text-slate-700 text-[11px] uppercase tracking-wider mb-1">Dịch vụ cộng thêm</div>
                          {selectedServices.map(service => (
                            <div key={service.id} className="flex justify-between pl-1">
                              <span>+ {service.name}</span>
                              <span className="font-semibold text-slate-700">{formatPrice(service.price)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      {prices.comboDiscount > 0 && (
                        <div className="flex justify-between text-emerald-600 font-bold">
                          <span>Chiết khấu Combo (Giảm 10%)</span>
                          <span>-{formatPrice(prices.comboDiscount)}</span>
                        </div>
                      )}
                      {isCouponApplied && (
                        <div className="flex justify-between text-emerald-600 font-bold">
                          <span>Mã giảm giá áp dụng</span>
                          <span>-{formatPrice(prices.discountAmount)}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Total amount */}
              <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                <span className="font-bold text-slate-800 text-sm">Tổng tiền</span>
                <span className="text-2xl font-black text-red-600 tracking-tight">{formatPrice(prices.finalPrice)}</span>
              </div>



              {/* Submit / Status Button */}
              <button
                type="button"
                disabled={submitting}
                onClick={() => {
                  if (!isFormValid) {
                    setShowErrors(true);
                    return;
                  }
                  handleBookingSubmit();
                }}
                className={`w-full py-4 rounded-full font-bold text-sm text-center tracking-wide shadow-md transition-all duration-200 ${
                  submitting
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
                    : "bg-red-600 text-white hover:bg-red-700 hover:shadow-lg active:scale-98 cursor-pointer"
                }`}
              >
                {submitting ? "Đang xử lý..." : "Đặt tour ngay"}
              </button>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-500 font-semibold text-sm">Đang tải trang đặt tour...</div>
      </div>
    }>
      <BookingPageContent />
    </Suspense>
  );
}
