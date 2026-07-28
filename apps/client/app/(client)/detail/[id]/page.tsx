"use client";

import React, { useState, use, useEffect } from "react";
import {
  MapPin, Utensils, Calendar, Plane, Gift,
  ChevronRight, ChevronDown, QrCode, Clock,
  Users, Phone, Maximize2, ShieldAlert,
  ArrowLeft, Compass, Info, Check, ShieldCheck,
  Car, Wifi, ShieldPlus, Hotel, Star
} from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import tourDetailService from "@/services/tour_detail-service";
import Breadcrumb from "@/components/ui/breadcum";
import Image from "next/image";
import { getUser } from "@/utils/auth";
import ItinerarySection from "@/components/itinerary-section";
import RuleAndNoteSection from "@/components/RuleAndNoteSection";
import InformationSecion from "@/components/detail-page/trip-information";
import ServiceSection, { ServiceItems } from "@/components/detail-page/service-section";
import TourRelatedSection from "@/components/detail-page/tour-related-section";
import reviewService from "@/services/review-service";
import dataminingService from "@/services/datamining-service";

// Define TypeScript interfaces matching the API structure
interface DestinationGroup {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

interface Destination {
  id: number;
  name: string;
  image: string;
  introduce: string;
  destinationGroup: DestinationGroup;
}

interface Category {
  id: number;
  name: string;
  introduce: string;
  image: string;
}

interface Transport {
  id: number;
  name: string;
}

interface Tour {
  id: number;
  name: string;
  price: number;
  status: string;
  duration: string;
  destination: Destination;
  categories: Category;
  image: string;
  description: string;
  transports: Transport;
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


interface TourDetailItems {
  id: number,
  uuid: string,
  tour: {
    id: number,
    name: string,
    price: number,
    status: string,
    duration: string,
    destination: {
      id: number,
      name: string,
      image: string,
      introduce: string,
      destinationGroup: {
        id: number,
        name: string,
        created_at: string,
        updated_at: string
      }
    },
    categories: {
      id: number,
      name: string,
      introduce: string,
      image: string
    },
    image: string,
    description: string,
    transports: {
      id: number,
      name: string
    }
  },
  image: string,
  departurePlace: string,
  departureDate: string,
  seatsAvailable: number,
  maxSeats: number,
  status: string
}



interface PageProps {
  params: Promise<{ id: string }>;
}

// Helper to format image paths safely
const getImageUrl = (imageName?: string) => {
  if (!imageName) return "/images/demo_banner.jpg";
  if (imageName.startsWith("http") || imageName.startsWith("/")) {
    return imageName;
  }
  return `/images/${imageName}`;
};

// Parser to split raw itinerary text into days
const parseItinerary = (itineraryStr: string) => {
  if (!itineraryStr) return [];
  // Split at lookahead for Day/Ngày prefix
  const days = itineraryStr.split(/(?=Ngày \d+:)/g);
  return days.map((dayStr) => {
    const trimStr = dayStr.trim();
    const match = trimStr.match(/^(Ngày \d+)\s*:\s*(.*)$/);
    if (match) {
      return {
        day: match[1],
        content: (match[2] || "").replace(/\s*\.\s*$/, "").trim(),
      };
    }
    return {
      day: "Lịch trình",
      content: trimStr,
    };
  }).filter(item => item.content.length > 0);
};





// Ngưỡng Support và Confidence tối thiểu cho khai phá dữ liệu Tour (dễ cấu hình tại đây)
const MIN_SUPPORT_THRESHOLD = 0.40;
const MIN_CONFIDENCE_THRESHOLD = 0.60;

export default function TourDetail({ params }: PageProps) {
  const { id: rawId } = use(params);
  const id = parseInt(rawId);
  const searchParams = useSearchParams();
  const router = useRouter();
  const detailIdParam = searchParams.get("detailId");

  const [detail, setDetail] = useState<TourDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const [activeThumb, setActiveThumb] = useState<string>("");
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const [services, setServices] = useState<ServiceItems[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [subImages, setSubImages] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [aprioriData, setAprioriData] = useState<any>({ rules: [], passengerRules: [], combos: [], tourCombos: [], tourServiceRules: [] });
  const [activePassengerTab, setActivePassengerTab] = useState<string>("all");

  useEffect(() => {
    const loadApriori = async () => {
      try {
        const data = await dataminingService.getAprioriResults(0.05, 0.3);
        setAprioriData(data || { rules: [], passengerRules: [], combos: [], tourCombos: [], tourServiceRules: [] });
      } catch (err) {
        console.error("Error loading Apriori analysis:", err);
      }
    };
    loadApriori();
  }, []);

  useEffect(() => {
    const user = getUser();
    setIsLoggedIn(!!user);
  }, []);

  useEffect(() => {
    const preselected = searchParams.get("preselectServices");
    if (preselected) {
      const ids = preselected
        .split(",")
        .map((s) => parseInt(s.trim()))
        .filter((n) => !isNaN(n));
      setSelectedServices(ids);
    }
  }, [searchParams]);

  const handleToggleService = (serviceId: number) => {
    setSelectedServices(prev =>
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };


  useEffect(() => {
    const fetchDetailData = async () => {
      if (isNaN(id)) {
        setError("Mã tour không hợp lệ. Vui lòng kiểm tra lại đường dẫn.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch details by Tour ID (since URL path parameter is always the Tour ID)
        const detailArray = await tourDetailService.getTourDetailByTourId(id);
        if (detailArray && Array.isArray(detailArray) && detailArray.length > 0) {
          // If a specific detailId is provided in the query params, find it
          let selectedDetail = detailArray[0];
          if (detailIdParam) {
            const parsedDetailId = parseInt(detailIdParam);
            const foundDetail = detailArray.find(d => d.id === parsedDetailId);
            if (foundDetail) {
              selectedDetail = foundDetail;
            }
          }

          setDetail(selectedDetail);
          setActiveThumb(getImageUrl(selectedDetail.image || selectedDetail.tour?.image));

          // Fetch sub-images using SubImagesController via service
          try {
            const subImagesData = await tourDetailService.getSubImagesByTourDetailId(selectedDetail.id);
            setSubImages(subImagesData || []);
          } catch (subErr) {
            console.error("Error loading sub images:", subErr);
          }
        } else {
          setError("Không tìm thấy thông tin hành trình chi tiết cho tour này.");
        }
      } catch (err: any) {
        console.error("Error loading tour details:", err);
        setError(err?.message || "Đã xảy ra lỗi khi tải dữ liệu từ máy chủ.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetailData();
  }, [id, detailIdParam]);

  useEffect(() => {
    const fetchReviews = async () => {
      if (isNaN(id)) return;
      try {
        setReviewsLoading(true);
        const data = await reviewService.getReviewsByTourId(id);
        setReviews(data || []);
      } catch (err) {
        console.error("Error loading tour reviews:", err);
      } finally {
        setReviewsLoading(false);
      }
    };
    fetchReviews();
  }, [id]);

  const toggleAccordion = (index: number) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };


  const formatPrice = (price: number) => {
    return price.toLocaleString("vi-VN") + "đ";
  };

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

  // Smooth redirect overlay when not logged in
  if (isRedirecting) {
    return (
      <div
        className="min-h-screen bg-slate-50 flex items-center justify-center font-sans relative overflow-hidden"
        style={{ animation: "fadeIn 0.25s ease-out" }}
      >
        <style>{`
          @keyframes fadeIn { from { opacity: 0; transform: scale(0.97); } to { opacity: 1; transform: scale(1); } }
          @keyframes slideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes progressBar { from { width: 0%; } to { width: 100%; } }
        `}</style>
        <div className="absolute top-1/3 left-1/2 -translate-x-[260px] w-72 h-72 bg-blue-100/60 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 translate-x-[80px] w-56 h-56 bg-indigo-100/50 rounded-full blur-3xl pointer-events-none" />
        <div
          className="relative bg-white rounded-3xl p-10 shadow-xl border border-slate-100 max-w-sm w-full mx-4 text-center space-y-5"
          style={{ animation: "slideUp 0.35s ease-out" }}
        >
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
          <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
              style={{ animation: "progressBar 0.65s ease-in-out forwards" }}
            />
          </div>
        </div>
      </div>
    );
  }

  // Loading Skeleton State
  if (loading) {
    return (
      <div className="min-h-screen   animate-pulse">
        <div className="container-main">
          <div className="h-4 w-64 bg-slate-200 rounded"></div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 space-y-3">
            <div className="h-8 w-3/4 bg-slate-200 rounded"></div>
            <div className="h-4 w-1/3 bg-slate-200 rounded"></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-4 rounded-2xl border border-slate-100 space-y-4">
                <div className="aspect-[16/9] w-full bg-slate-200 rounded-xl"></div>
                <div className="flex gap-3">
                  {[1, 2, 3, 4].map(n => (
                    <div key={n} className="w-20 h-14 bg-slate-200 rounded-lg"></div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map(n => (
                  <div key={n} className="h-20 bg-slate-100 rounded-xl"></div>
                ))}
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 h-[420px] space-y-6">
              <div className="h-6 w-1/3 bg-slate-200 rounded ml-auto"></div>
              <div className="h-10 w-2/3 bg-slate-200 rounded"></div>
              <div className="h-16 bg-orange-50 rounded-xl"></div>
              <div className="space-y-3">
                {[1, 2, 3, 4].map(n => (
                  <div key={n} className="h-4 bg-slate-200 rounded"></div>
                ))}
              </div>
              <div className="h-12 bg-slate-200 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error boundary State
  if (error || !detail) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center border border-slate-100 space-y-6">
          <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto">
            <ShieldAlert size={36} />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 mb-2">Không tải được thông tin</h2>
            <p className="text-sm text-slate-500 leading-relaxed">{error || "Sản phẩm không khả dụng hoặc đã bị gỡ bỏ."}</p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-full text-sm transition-all shadow-md shadow-blue-200"
          >
            <ArrowLeft size={16} /> Quay về Trang chủ
          </Link>
        </div>
      </div>
    );
  }

  // Loaded Content Variables
  const tour = detail.tour;
  const destination = tour.destination;
  const categories = tour.categories;
  const transport = tour.transports;

  // Build unique thumbnails list using subImages state populated from SubImagesController
  const thumbnails = Array.from(new Set([
    getImageUrl(detail.image || tour.image),
    ...subImages.map((img) => getImageUrl(img.subImage))
  ].filter(Boolean)));


  // Marketing pricing details
  const price = tour.price;
  const oldPrice = price + 2100000;
  const promoDiscount = 2100000;
  const seatsLeft = detail.seatsAvailable;
  const isFullyBooked = seatsLeft <= 0;

  const addOnTotal = services
    .filter(s => selectedServices.includes(s.id))
    .reduce((sum, s) => sum + s.price, 0);

  // Calculate combo discount
  const specificCombos = aprioriData.tourCombos?.filter(
    (c: any) => c.tourName === tour.name && c.confidence >= MIN_CONFIDENCE_THRESHOLD
  ) || [];
  const selectedCombos = specificCombos.filter((combo: any) => {
    const comboServiceIds = combo.services.map((s: any) => s.id);
    return comboServiceIds.every((id: number) => selectedServices.includes(id));
  });

  const discountedServiceIds = new Set<number>();
  selectedCombos.forEach((combo: any) => {
    combo.services.forEach((s: any) => {
      discountedServiceIds.add(s.id);
    });
  });

  const comboDiscount = services
    .filter(s => discountedServiceIds.has(s.id))
    .reduce((sum, s) => sum + Math.round(s.price * 0.1), 0);

  const finalPrice = price + addOnTotal - comboDiscount;



  return (
    <div className="min-h-screen bg-light  font-sans  pt-4  text-primary ">
      <div className="container-main space-y-6  md:pb-40">
        {/* Dynamic Breadcrumbs */}
        <Breadcrumb classname="text-text-secondary py-4 " />

        {/* Tour Title Header */}
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xs   md:flex-row md:items-center ">
          <h1 className="text-xl md:text-xl font-bold tracking-normal font-sans text-text-primary text-balance leading-normal">
            {tour.name}
          </h1>
        </div>


        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Main Content */}
          <div className="lg:col-span-2 space-y-16 ">

            {/* Gallery Card */}
            <div className="bg-surface p-4 rounded-3xl shadow-xs  space-y-4">
              <div
                className="relative rounded-2xl overflow-hidden aspect-[16/9] bg-slate-100 group cursor-pointer"
                onClick={() => setIsOpen(true)}
              >
                <Image
                  alt={tour.name}
                  fill
                  src={activeThumb}
                  className="transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 bg-slate-900/60 backdrop-blur-xs text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5">
                  <Maximize2 size={20} /> Thư viện hình ảnh
                </div>
              </div>

              {/* Modal */}
              {isOpen && (
                <div
                  className="fixed inset-0 z-110 flex items-center justify-center bg-black/80"
                  onClick={() => setIsOpen(false)}
                >
                  <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-4 right-4 text-white text-3xl hover:text-gray-300 cursor-pointer"
                  >
                    ✕
                  </button>
                  <div onClick={(e) => e.stopPropagation()}>
                    <Image
                      src={activeThumb}
                      alt={tour.name}
                      width={1200}
                      height={900}
                      className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg"
                    />
                  </div>
                </div>
              )}

              {/* Thumbnails list */}
              <div className="flex justify-center gap-3 overflow-x-auto pb-1 scrollbar-none">
                {thumbnails.map((thumb, index) => (
                  <img
                    key={index}
                    src={thumb}
                    alt={`Thumbnail ${index + 1}`}
                    className={`w-24 h-16 object-cover rounded-xl cursor-pointer border-2 transition-all flex-shrink-0 duration-200 ${activeThumb === thumb
                      ? "border-blue-600 bg-blue-50/10 scale-95 shadow-sm"
                      : "border-transparent opacity-70 hover:opacity-100 hover:scale-[1.02]"
                      }`}
                    onClick={() => setActiveThumb(thumb)}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-4 font-sans">
              <h2 className="text-lg md:text-xl font-bold text-text-primary flex items-center gap-2">
                <div className="text-primary" /> Thông tin về chuyến đi
              </h2>
              <InformationSecion id={detail.id} tour_id={tour.id} />
            </div>

            {/* Tour Description */}
            <div className=" font-sans  space-y-4">
              <h2 className="text-lg md:text-xl font-bold text-text-primary flex items-center gap-2">
                <div className="text-primary" /> Tổng quan tour
              </h2>
              <p className="bg-white p-6 md:p-6 rounded-3xl shadow-xs text-sm md:text-base font-normal text-text-secondary tracking-normal text-justify">
                {tour.description}
              </p>
            </div>

            {/* About the Destination Block
            <div className="bg-linear-to-r from-blue-50/40 to-indigo-50/40 p-6 md:p-8 rounded-3xl border border-blue-100/50 space-y-4">
              <h2 className="text-lg md:text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <Sparkles className="text-blue-600" size={20} /> Trải nghiệm văn hóa tại {destination?.name}
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed text-justify">
                {destination?.introduce}
              </p>
            </div> */}

            {/* Interactive Timeline */}
            <div className="space-y-4">
              <h2 className="text-lg md:text-xl font-bold font-sans text-text-primary flex items-center gap-2">
                Lịch trình chi tiết
              </h2>
              <ItinerarySection tourDetailId={detail.id} />
            </div>


            <div className="space-y-4">
              <h2 className="text-lg md:text-xl font-bold font-sans text-text-primary flex items-center gap-2">
                Quy định và dịch vụ
              </h2>
              <RuleAndNoteSection />
            </div>
            <div className="space-y-4">
              <h2 className="text-lg md:text-xl font-bold font-sans text-text-primary flex items-center gap-2">
                Dịch vụ cộng thêm
              </h2>
              <ServiceSection
                selectedServices={selectedServices}
                onToggleService={handleToggleService}
                onServicesLoad={setServices}
                tourName={tour.name}
                tourServiceRules={aprioriData.tourServiceRules}
              />
            </div>

            {/* Combo & Recommendation from Data Mining */}
            {aprioriData && (
              aprioriData.tourCombos?.some((c: any) => c.tourName === tour.name && c.confidence >= MIN_CONFIDENCE_THRESHOLD)
            ) && (
                <div className="bg-white/90 border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4 font-sans">
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="text-base font-extrabold text-primary flex items-center gap-2">
                      <span className="material-symbols-outlined text-blue-600">
                        auto_awesome
                      </span>
                      Gợi ý Combo từ ZTravel AI
                    </h3>
                    <p className="text-xs text-slate-400">Các gói dịch vụ phổ biến được tối ưu dựa trên phân tích dữ liệu mua sắm của hàng trăm du khách.</p>
                  </div>

                  {/* Popular Combos list */}
                  {(() => {
                    // Lọc các combo riêng cho tour này đạt độ tin cậy >= minconf
                    const specificCombos = aprioriData.tourCombos?.filter((c: any) => c.tourName === tour.name && c.confidence >= MIN_CONFIDENCE_THRESHOLD) || [];
                    const combosSlice = specificCombos.slice(0, 4);

                    if (combosSlice.length === 0) return null;

                    // Lấy danh sách các combo đang được chọn đầy đủ dịch vụ
                    const selectedCombos = combosSlice.filter((combo: any) => {
                      const comboServiceIds = combo.services.map((s: any) => s.id);
                      return comboServiceIds.every((id: number) => selectedServices.includes(id));
                    });
                    const isAnyComboSelected = selectedCombos.length > 0;
                    const displayCombos = isAnyComboSelected ? selectedCombos : combosSlice;

                    return (
                      <div className="space-y-3">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                          {isAnyComboSelected ? "Combo dịch vụ đang chọn (Giảm 10%):" : "Combo dịch vụ khuyên dùng (Giảm 10%):"}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {displayCombos.map((combo: any) => {
                            const originalIdx = combosSlice.indexOf(combo);
                            const comboServiceIds = combo.services.map((s: any) => s.id);
                            const isComboSelected = comboServiceIds.every((id: number) => selectedServices.includes(id));

                            return (
                              <div
                                key={originalIdx}
                                className={`border rounded-2xl p-4 transition-all duration-300 flex flex-col justify-between space-y-3 bg-slate-50/40 ${isComboSelected
                                  ? "border-emerald-500 bg-emerald-50/10 shadow-xs"
                                  : "border-slate-100 hover:border-blue-400 hover:shadow-xs"
                                  }`}
                              >
                                <div className="space-y-1">
                                  <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                    Gợi ý cho Tour
                                  </span>
                                  <h5 className="font-bold text-xs text-slate-800 leading-snug pt-1">{combo.name}</h5>
                                  <p className="text-[10px] text-slate-400">
                                    Được lựa chọn bởi {Math.round(combo.confidence * 100)}% du khách đi tour này
                                  </p>
                                </div>

                                <div className="flex justify-between items-end pt-1">
                                  <div>
                                    <span className="text-[10px] text-slate-400 line-through block leading-none">{formatPrice(combo.totalPrice)}</span>
                                    <span className="text-sm font-extrabold text-emerald-600 leading-none">{formatPrice(combo.discountedPrice)}</span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (isComboSelected) {
                                        // Bỏ chọn tất cả dịch vụ trong combo
                                        setSelectedServices(prev => prev.filter(id => !comboServiceIds.includes(id)));
                                      } else {
                                        // Chọn tất cả dịch vụ trong combo
                                        setSelectedServices(prev => Array.from(new Set([...prev, ...comboServiceIds])));
                                      }
                                    }}
                                    className={`px-3 py-1.5 rounded-full font-bold text-[10px] transition-all active:scale-95 cursor-pointer ${isComboSelected
                                      ? "bg-emerald-600 text-white hover:bg-emerald-700"
                                      : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                                      }`}
                                  >
                                    {isComboSelected ? "Đã chọn" : "Chọn Combo"}
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()}

                  {/* Intelligent upsell based on rules */}
                  {(() => {
                    if (!aprioriData.rules || aprioriData.rules.length === 0) return null;

                    // Find rules where the antecedent services are fully selected, but the consequent is NOT selected yet
                    const activeRules = aprioriData.rules.filter((rule: any) => {
                      if (rule.tourName !== tour.name) return false;
                      const antecedentIds = rule.antecedent.map((s: any) => s.id);
                      const consequentIds = rule.consequent.map((s: any) => s.id);
                      const hasAntecedent = antecedentIds.every((id: number) => selectedServices.includes(id));
                      const lacksConsequent = consequentIds.some((id: number) => !selectedServices.includes(id));
                      return hasAntecedent && lacksConsequent;
                    });

                    if (activeRules.length === 0) return null;

                    return (
                      <div className="space-y-2.5 pt-2 border-t border-slate-100">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">💡 Gợi ý cho bạn:</h4>
                        <div className="space-y-2">
                          {activeRules.slice(0, 2).map((rule: any, idx: number) => {
                            const consequentIds = rule.consequent.map((s: any) => s.id);
                            return (
                              <div key={idx} className="flex justify-between items-center bg-blue-50/20 border border-blue-100/30 p-3 rounded-xl text-xs text-slate-700 gap-3">
                                <span className="font-semibold text-slate-600 leading-normal flex-1">
                                  {rule.displayText}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedServices(prev => Array.from(new Set([...prev, ...consequentIds])));
                                  }}
                                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1.5 rounded-full text-[10px] shrink-0 active:scale-95 transition-all cursor-pointer"
                                >
                                  Thêm ngay
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

            {/* Passenger-specific Suggestions from Data Mining */}
            {aprioriData && aprioriData.passengerRules && aprioriData.passengerRules.some((r: any) => r.tourName === tour.name && r.confidence >= MIN_CONFIDENCE_THRESHOLD && r.consequent?.length >= 2) && (
              <div className="bg-white/90 border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4 font-sans">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-base font-extrabold text-primary flex items-center gap-2">
                    <span className="material-symbols-outlined text-indigo-600">
                      diversity_3
                    </span>
                    Gợi ý theo Nhóm hành khách
                  </h3>
                  <p className="text-xs text-slate-400">Gợi ý dịch vụ gia tăng được thiết kế và tối ưu riêng theo đối tượng khách đi cùng.</p>
                </div>

                {/* Tab selector */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-50">
                  {[
                    { id: "all", label: "Tất cả nhóm" },
                    { id: "solo", label: "👤 Đi lẻ (Solo)" },
                    { id: "couple", label: "👥 Cặp đôi" },
                    { id: "family", label: "👨‍👩‍👧‍👦 Gia đình" },
                    { id: "group", label: "🚌 Đoàn đông" }
                  ].map(tab => {
                    const isActive = activePassengerTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActivePassengerTab(tab.id)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer border active:scale-95 ${isActive
                          ? "bg-indigo-600 border-indigo-600 text-white shadow-xs"
                          : "bg-slate-50 border-slate-150 text-slate-600 hover:bg-slate-100"
                          }`}
                      >
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                {/* Rules List / Grid */}
                {(() => {
                  const filteredPassengerRules = aprioriData.passengerRules.filter((rule: any) => {
                    if (rule.tourName !== tour.name) return false;
                    if (rule.confidence < MIN_CONFIDENCE_THRESHOLD) return false;
                    if (!rule.consequent || rule.consequent.length < 2) return false;
                    if (activePassengerTab === "all") return true;
                    const antecedentStrings = rule.antecedent.map((ant: any) => ant.data || "");
                    if (activePassengerTab === "solo") {
                      return antecedentStrings.some((str: string) => str.includes("Solo") || str.includes("lẻ"));
                    }
                    if (activePassengerTab === "couple") {
                      return antecedentStrings.some((str: string) => str.includes("Cặp đôi") || str.includes("2 người"));
                    }
                    if (activePassengerTab === "family") {
                      return antecedentStrings.some((str: string) =>
                        str.includes("Gia đình") ||
                        str.includes("Trẻ em") ||
                        str.includes("Em bé") ||
                        str.includes("Trẻ nhỏ")
                      );
                    }
                    if (activePassengerTab === "group") {
                      return antecedentStrings.some((str: string) => str.includes("Đoàn đông") || str.includes("5+"));
                    }
                    return true;
                  });

                  if (filteredPassengerRules.length === 0) {
                    return (
                      <div className="text-center py-6 text-slate-400 text-xs">
                        Chưa có gợi ý dịch vụ phù hợp cho nhóm đối tượng này.
                      </div>
                    );
                  }

                  const rulesSlice = filteredPassengerRules.slice(0, 4);
                  // Find passenger rules that are currently fully selected
                  const selectedRules = rulesSlice.filter((rule: any) => {
                    const consequentServiceIds = rule.consequent.map((c: any) => c.data?.id).filter(Boolean);
                    return consequentServiceIds.every((id: number) => selectedServices.includes(id));
                  });
                  const isAnyRuleSelected = selectedRules.length > 0;
                  const displayRules = isAnyRuleSelected ? selectedRules : rulesSlice;

                  return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {displayRules.map((rule: any) => {
                        const originalIdx = filteredPassengerRules.indexOf(rule);
                        const consequentServiceIds = rule.consequent.map((c: any) => c.data?.id).filter(Boolean);
                        const areAllSelected = consequentServiceIds.every((id: number) => selectedServices.includes(id));

                        return (
                          <div
                            key={originalIdx}
                            className={`border rounded-2xl p-4 transition-all duration-300 flex flex-col justify-between space-y-3 bg-slate-50/40 ${areAllSelected
                              ? "border-emerald-500 bg-emerald-50/10 shadow-xs"
                              : "border-slate-100 hover:border-indigo-400 hover:shadow-xs"
                              }`}
                          >
                            <div className="space-y-2">
                              {/* Antecedents */}
                              <div className="flex flex-wrap gap-1 items-center">
                                {rule.antecedent.map((ant: any, aIdx: number) => {
                                  let badgeColor = "bg-slate-100 text-slate-700 border-slate-200";
                                  if (ant.data.includes("Solo")) {
                                    badgeColor = "bg-blue-50 text-blue-700 border-blue-150";
                                  } else if (ant.data.includes("Cặp đôi")) {
                                    badgeColor = "bg-pink-50 text-pink-700 border-pink-150";
                                  } else if (ant.data.includes("Gia đình") || ant.data.includes("Trẻ") || ant.data.includes("Bé")) {
                                    badgeColor = "bg-violet-50 text-violet-700 border-violet-150";
                                  } else if (ant.data.includes("Đoàn đông")) {
                                    badgeColor = "bg-amber-50 text-amber-700 border-amber-150";
                                  }
                                  return (
                                    <span key={aIdx} className={`inline-flex items-center text-[10px] font-extrabold px-2 py-0.5 rounded-md border ${badgeColor}`}>
                                      {ant.data}
                                    </span>
                                  );
                                })}
                                <span className="text-[10px] font-extrabold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full ml-auto uppercase tracking-wider">
                                  Tin cậy: {Math.round(rule.confidence * 100)}%
                                </span>
                              </div>

                              {/* Service suggestions title */}
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pt-1">💡 Các dịch vụ đề xuất đi kèm:</p>

                              {/* Consequents */}
                              <div className="space-y-1.5">
                                {rule.consequent.map((cons: any, cIdx: number) => {
                                  const service = cons.data;
                                  if (!service) return null;
                                  const isServiceSelected = selectedServices.includes(service.id);
                                  return (
                                    <div
                                      key={cIdx}
                                      className={`flex justify-between items-center px-2.5 py-1.5 rounded-xl border text-[11px] font-semibold transition-all ${isServiceSelected
                                        ? "bg-emerald-500/10 border-emerald-300 text-slate-750"
                                        : "bg-white border-slate-100 text-slate-700 hover:border-slate-200"
                                        }`}
                                    >
                                      <span className="truncate pr-2">{service.name}</span>
                                      <div className="flex items-center gap-2 shrink-0">
                                        <span className="text-slate-500 font-bold">{formatPrice(service.price)}</span>
                                        <button
                                          type="button"
                                          onClick={() => handleToggleService(service.id)}
                                          className={`w-4 h-4 rounded-full flex items-center justify-center transition-all cursor-pointer ${isServiceSelected
                                            ? "bg-emerald-600 text-white hover:bg-emerald-700"
                                            : "bg-slate-100 hover:bg-blue-600 hover:text-white"
                                            }`}
                                        >
                                          {isServiceSelected ? (
                                            <Check size={8} strokeWidth={4} />
                                          ) : (
                                            <span className="text-[10px] leading-none">+</span>
                                          )}
                                        </button>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Select All Toggle */}
                            <div className="flex justify-between items-center pt-2.5 border-t border-slate-100 text-[10px] font-semibold text-slate-400">
                              <span>Tỉ lệ chọn: {Math.round(rule.support * 100)}%</span>
                              <button
                                type="button"
                                onClick={() => {
                                  if (areAllSelected) {
                                    setSelectedServices(prev => prev.filter(id => !consequentServiceIds.includes(id)));
                                  } else {
                                    setSelectedServices(prev => Array.from(new Set([...prev, ...consequentServiceIds])));
                                  }
                                }}
                                className={`px-3 py-1 rounded-full font-bold transition-all active:scale-95 cursor-pointer ${areAllSelected
                                  ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm"
                                  : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm"
                                  }`}
                              >
                                {areAllSelected ? "Đã áp dụng" : "Áp dụng gợi ý"}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Reviews Section */}
            <div className="space-y-6 pt-6 font-sans">
              <h2 className="text-lg md:text-xl font-bold text-text-primary flex items-center gap-2">
                Đánh giá từ du khách ({reviews.length})
              </h2>

              {reviews.length === 0 ? (
                <div className="bg-white p-8 rounded-3xl border border-slate-100 text-center text-slate-400 space-y-3">
                  <Star className="mx-auto text-slate-300 animate-pulse" size={32} />
                  <p className="text-xs">Chưa có đánh giá nào cho tour du lịch này. Hãy là người đầu tiên trải nghiệm và chia sẻ cảm nhận!</p>
                </div>
              ) : (
                (() => {
                  const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
                  const distribution = [0, 0, 0, 0, 0];
                  reviews.forEach(r => {
                    const idx = Math.min(4, Math.max(0, Math.floor(r.rating) - 1));
                    if (distribution[idx] !== undefined) {
                      distribution[idx]++;
                    }
                  });

                  return (
                    <div className="space-y-6">
                      {/* Summary Block */}
                      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs flex flex-col md:flex-row items-center gap-6">
                        <div className="text-center md:border-r md:border-slate-100 md:pr-10 shrink-0 space-y-1">
                          <span className="text-5xl font-black text-primary">{avg.toFixed(1)}</span>
                          <div className="flex items-center justify-center text-amber-400 gap-0.5">
                            {[1, 2, 3, 4, 5].map(star => (
                              <Star key={star} size={15} fill={star <= Math.round(avg) ? "currentColor" : "none"} strokeWidth={star <= Math.round(avg) ? 0 : 1.5} />
                            ))}
                          </div>
                          <span className="text-[10px] text-slate-400 font-bold block uppercase">{reviews.length} đánh giá</span>
                        </div>

                        <div className="flex-1 w-full space-y-2">
                          {[5, 4, 3, 2, 1].map((stars) => {
                            const count = distribution[stars - 1] || 0;
                            const percent = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                            return (
                              <div key={stars} className="flex items-center gap-3 text-xs text-slate-500">
                                <span className="w-10 shrink-0 font-bold text-right">{stars} sao</span>
                                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                  <div className="h-full bg-amber-400 rounded-full" style={{ width: `${percent}%` }} />
                                </div>
                                <span className="w-8 shrink-0 text-slate-400 text-right">{count}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Review List */}
                      <div className="space-y-4">
                        {reviews.map((rev) => (
                          <div key={rev.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                                  {rev.booking?.user?.name?.charAt(0).toUpperCase() || "D"}
                                </div>
                                <div>
                                  <span className="font-bold text-slate-800 text-xs block">{rev.booking?.user?.name || "Du khách"}</span>
                                  <span className="text-[10px] text-slate-400 font-medium">{formatDate(rev.createdAt)}</span>
                                </div>
                              </div>
                              <div className="flex items-center text-amber-400 gap-0.5">
                                {[1, 2, 3, 4, 5].map(star => (
                                  <Star key={star} size={13} fill={star <= rev.rating ? "currentColor" : "none"} strokeWidth={star <= rev.rating ? 0 : 1.5} />
                                ))}
                              </div>
                            </div>
                            <p className="text-slate-600 text-xs leading-relaxed pl-1">{rev.comment}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()
              )}
            </div>

          </div>

          {/* Sticky Sidebar widget (Booking card) */}
          <div className="lg:col-span-1 lg:sticky lg:top-26 self-start space-y-4">
            <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-100 space-y-6 ">
              {/* Price Details */}
              <div className="space-y-1.5">
                <div className="flex items-baseline gap-1 font-bold text-primary font-sans">
                  Giá từ:
                  <span className="text-3xl font-extrabold text-red-600 tracking-tight">{formatPrice(finalPrice)}</span>
                </div>
              </div>

              {/* Selected Add-ons breakdown */}
              {selectedServices.length > 0 && (
                <div className="bg-slate-50 border border-slate-100/80 rounded-2xl p-3.5 space-y-2">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tiện ích chọn thêm:</div>
                  <div className="space-y-1.5">
                    {services
                      .filter(s => selectedServices.includes(s.id))
                      .map(service => (
                        <div key={service.id} className="flex justify-between items-center text-xs">
                          <span className="text-slate-600 font-medium truncate max-w-[160px]">{service.name}</span>
                          <span className="text-slate-500 font-semibold shrink-0">+{formatPrice(service.price)}</span>
                        </div>
                      ))}
                    {comboDiscount > 0 && (
                      <div className="flex justify-between items-center text-xs border-t border-dashed border-slate-200 pt-1.5 text-emerald-600 font-bold">
                        <span>Chiết khấu Combo (Giảm 10%):</span>
                        <span>-{formatPrice(comboDiscount)}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Promo box
              <div className="bg-orange-50/60 border border-orange-100 rounded-2xl p-4 flex gap-3">
                <Gift className="text-orange-500 shrink-0 mt-0.5" size={18} />
                <div className="text-xs text-orange-900 leading-relaxed">
                  Đặt ngay hôm nay để được hưởng <strong>Ưu đãi hoàn vé lên tới 10%</strong> khi thanh toán bằng thẻ tín dụng đối tác.
                </div>
              </div> */}

              {/* Metadata rows */}
              <div className="border-t border-slate-100 pt-4 space-y-3.5 text-xs md:text-sm font-sans font-bold text-primary">

                <div className="flex items-center justify-between gap-4 truncate">
                  <span className=" flex items-center gap-2 shrink-0"><QrCode size={15} /> Mã tour:</span>
                  <span className="font-semibold text-blue-600 break-all text-right select-all">{detail.uuid}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className=" flex items-center gap-2"><Users size={15} /> Còn trống:</span>
                  <span className={`font-bold ${isFullyBooked ? "text-red-600" : "text-emerald-600"}`}>
                    {isFullyBooked ? "Đã hết chỗ" : `${seatsLeft} chỗ`}
                  </span>
                </div>

              </div>

              {/* Buttons booking call */}
              <div className="flex gap-3 pt-2">
                <a
                  href="tel:19001800"
                  className="w-12 h-12 bg-blue-50 text-blue-600 border border-blue-100 rounded-full flex items-center justify-center hover:bg-blue-600 hover:text-white transition shrink-0 shadow-sm"
                  title="Gọi hotline tư vấn miễn phí"
                >
                  <Phone size={18} />
                </a>

                <button
                  disabled={isFullyBooked}
                  onClick={() => {
                    const servicesQuery = selectedServices.length > 0 ? `&services=${selectedServices.join(",")}` : "";
                    if (!isLoggedIn) {
                      setIsRedirecting(true);
                      const redirectPath = `/booking?detailId=${detail!.id}${servicesQuery}`;
                      setTimeout(() => {
                        router.push(`/sign-in?redirect=${encodeURIComponent(redirectPath)}`);
                      }, 700);
                    } else {
                      router.push(`/booking?detailId=${detail!.id}${servicesQuery}`);
                    }
                  }}
                  className={`flex-1 font-bold text-sm rounded-full transition-all duration-200 shadow-md ${isFullyBooked
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                    : "bg-red-600 text-white hover:bg-red-700 hover:shadow-lg hover:shadow-red-100 active:scale-98"
                    }`}
                >
                  {isFullyBooked ? "Hết chỗ khởi hành" : isLoggedIn ? "Đặt tour ngay" : "Đăng nhập để đặt tour"}
                </button>
              </div>

            </div>

          </div>

        </div>
        <div className="space-y-4 font-sans pt-10">
          <h2 className="text-lg md:text-xl font-bold text-text-primary flex items-center gap-2">
            <div className="text-primary" /> Các chương trình khác
          </h2>
          <TourRelatedSection tourId={id} />
        </div>
      </div>
    </div>
  );
}