"use client";

import React, { useState, use, useEffect } from "react";
import { 
  MapPin, Utensils, Calendar, Plane, Gift, 
  ChevronRight, ChevronDown, QrCode, Clock, 
  Users, Phone, Maximize2, ShieldAlert, Sparkles,
  ArrowLeft, Compass, Info, Check, ShieldCheck
} from "lucide-react";
import Link from "next/link";
import tourDetailService from "@/services/tour_detail-service";

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
  subImage: string;
  itinerary: string;
  departurePlace: string;
  departureDate: string;
  seatsAvailable: number;
  maxSeats: number;
  status: string;
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

const noticeDetailsMap: Record<string, string> = {
  "Giá tour bao gồm": "Vé máy bay khứ hồi theo chương trình, xe du lịch đời mới máy lạnh chất lượng cao suốt tuyến. Khách sạn tiêu chuẩn 3-4 sao trung tâm tiện lợi mua sắm. Các bữa ăn cao cấp theo thực đơn đặc sản địa phương. Vé tham quan tất cả các điểm du lịch trong chương trình. Hướng dẫn viên nhiệt tình vui vẻ phục vụ suốt hành trình. Bảo hiểm du lịch quốc tế tối đa 100.000.000đ/vụ.",
  "Giá tour không bao gồm": "Chi phí cá nhân (giặt ủi, nước uống trong phòng, mua sắm...), vé tham quan ngoài chương trình tự túc. Tiền tip bắt buộc cho Hướng dẫn viên và Tài xế theo thông lệ (khoảng 5-8 USD/ngày/khách). Thuế VAT suất đặc biệt và các phụ phí phòng đơn (nếu có).",
  "Lưu ý giá trẻ em": "Trẻ em dưới 2 tuổi: 30% giá người lớn (chung giường với bố mẹ). Trẻ em từ 2 đến dưới 11 tuổi: 85% giá người lớn (suất ăn riêng, ghế ngồi riêng, ngủ chung giường với bố mẹ). Trẻ em từ 11 tuổi trở lên: Tính giá như người lớn, hưởng đầy đủ dịch vụ.",
  "Điều kiện thanh toán": "Đợt 1: Đặt cọc 50% tổng giá trị tour ngay khi đăng ký để giữ chỗ chắc chắn. Đợt 2: Thanh toán phần còn lại 10 ngày trước ngày khởi hành (đối với ngày thường) hoặc 20 ngày trước ngày khởi hành (đối với dịp lễ, Tết).",
  "Điều kiện đăng ký": "Hộ chiếu còn thời hạn sử dụng tối thiểu 6 tháng tính từ ngày kết thúc chuyến đi. Khách mang quốc tịch nước ngoài tự chuẩn bị visa tái nhập cảnh Việt Nam nếu cần thiết. Phụ nữ có thai hoặc người cao tuổi từ 70 tuổi trở lên cần có giấy xác nhận sức khỏe từ cơ quan y tế.",
  "Lưu ý về chuyển hoặc hủy tour": "Tất cả yêu cầu thay đổi lịch trình hoặc hủy tour phải được gửi bằng văn bản chính thức (email hoặc ký biên bản tại văn phòng). Không hỗ trợ xử lý hủy chuyển tour qua các cuộc gọi điện thoại thông thường.",
  "Các điều kiện hủy tour đối với ngày thường": "Hủy trước 30 ngày khởi hành: Miễn phí (hoặc phí thủ tục 10%). Hủy từ 15-29 ngày trước ngày khởi hành: Phí huỷ 30% tổng giá trị tour. Hủy từ 7-14 ngày trước khởi hành: Phí huỷ 50% tổng giá trị tour. Hủy trong vòng 7 ngày trước khởi hành: Phí huỷ 100% tổng giá trị tour.",
  "Các điều kiện hủy tour đối với ngày lễ, Tết": "Hủy trước 45 ngày khởi hành: Phí huỷ 20% tổng giá trị tour. Hủy từ 25-44 ngày trước ngày khởi hành: Phí huỷ 50% tổng giá trị tour. Hủy từ 10-24 ngày trước khởi hành: Phí huỷ 75% tổng giá trị tour. Hủy trong vòng 10 ngày trước khởi hành: Phí huỷ 100% tổng giá trị tour."
};

export default function TourDetail({ params }: PageProps) {
  const { id: rawId } = use(params);
  const id = parseInt(rawId);

  const [detail, setDetail] = useState<TourDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [activeThumb, setActiveThumb] = useState<string>("");
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);
  const [expandedTimeline, setExpandedTimeline] = useState<Record<number, boolean>>({ 0: true }); // Open Day 1 by default

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

        // Attempt 1: Fetch by direct Tour Detail ID
        try {
          const detailData = await tourDetailService.getTourDetailById(id);
          if (detailData) {
            setDetail(detailData);
            setActiveThumb(getImageUrl(detailData.image || detailData.tour?.image));
            setLoading(false);
            return;
          }
        } catch (e) {
          console.log("Direct detail fetch failed, fallback to tourId query...");
        }

        // Attempt 2: Fetch by Tour ID (since homepage lists tours and links using tourId)
        const detailArray = await tourDetailService.getTourDetailByTourId(id);
        if (detailArray && Array.isArray(detailArray) && detailArray.length > 0) {
          setDetail(detailArray[0]);
          setActiveThumb(getImageUrl(detailArray[0].image || detailArray[0].tour?.image));
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
  }, [id]);

  const toggleAccordion = (index: number) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

  const toggleTimeline = (index: number) => {
    setExpandedTimeline(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString("vi-VN") + "đ";
  };

  // Loading Skeleton State
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50/50 py-8 px-4 md:px-8 animate-pulse">
        <div className="max-w-6xl mx-auto space-y-6">
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

  // Build unique thumbnails list
  const thumbnails = Array.from(new Set([
    getImageUrl(detail.image),
    getImageUrl(detail.subImage),
    getImageUrl(tour.image),
    getImageUrl(destination?.image)
  ].filter(Boolean)));

  const parsedItineraryItems = parseItinerary(detail.itinerary);
  const noticesList = Object.keys(noticeDetailsMap);

  // Marketing pricing details
  const price = tour.price;
  const oldPrice = price + 2100000;
  const promoDiscount = 2100000;
  const seatsLeft = detail.seatsAvailable;
  const isFullyBooked = seatsLeft <= 0;

  return (
    <div className="min-h-screen bg-slate-50/50 py-6 md:py-10 px-4 md:px-8 font-sans antialiased text-slate-800">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Dynamic Breadcrumbs */}
        <div className="text-xs md:text-sm text-slate-400 flex flex-wrap gap-1.5 items-center font-medium">
          <Link href="/" className="hover:text-blue-600 transition">Trang chủ</Link>
          <ChevronRight size={12} className="text-slate-300" />
          <span className="hover:text-blue-600 cursor-pointer">
            {destination?.destinationGroup?.name || "Trong nước"}
          </span>
          <ChevronRight size={12} className="text-slate-300" />
          <span className="hover:text-blue-600 cursor-pointer">
            {destination?.name || "Điểm đến"}
          </span>
          <ChevronRight size={12} className="text-slate-300" />
          <span className="text-blue-600 font-semibold truncate max-w-[200px] md:max-w-xs">
            {tour.name}
          </span>
        </div>

        {/* Tour Title Header */}
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xs border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs font-bold border border-indigo-100/50 flex items-center gap-1">
                <Sparkles size={11} /> {categories?.name}
              </span>
              <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-semibold select-all">
                Mã tour: {detail.uuid}
              </span>
            </div>
            <h1 className="text-xl md:text-3xl font-extrabold tracking-tight text-slate-900 leading-snug">
              {tour.name}
            </h1>
          </div>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Main Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Gallery Card */}
            <div className="bg-white p-4 rounded-3xl shadow-xs border border-slate-100 space-y-4">
              <div className="relative rounded-2xl overflow-hidden aspect-[16/9] bg-slate-100 group">
                <img 
                  src={activeThumb} 
                  alt="Hành trình chi tiết" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                />
                <div className="absolute top-4 left-4 bg-slate-900/60 backdrop-blur-xs text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5">
                  <Maximize2 size={13} /> Thư viện hình ảnh
                </div>
              </div>
              
              {/* Thumbnails list */}
              <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none">
                {thumbnails.map((thumb, index) => (
                  <img
                    key={index}
                    src={thumb}
                    alt={`Thumbnail ${index + 1}`}
                    className={`w-24 h-16 object-cover rounded-xl cursor-pointer border-2 transition-all flex-shrink-0 duration-200 ${
                      activeThumb === thumb 
                        ? "border-blue-600 bg-blue-50/10 scale-95 shadow-sm" 
                        : "border-transparent opacity-70 hover:opacity-100 hover:scale-[1.02]"
                    }`}
                    onClick={() => setActiveThumb(thumb)}
                  />
                ))}
              </div>
            </div>

            {/* General Highlights Grid */}
            <div className="space-y-4">
              <h2 className="text-lg md:text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <Compass className="text-blue-600" size={20} /> Điểm nhấn hành trình
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                
                <div className="bg-white p-5 rounded-2xl border border-slate-100/80 shadow-xs flex items-start gap-3.5 hover:shadow-md transition duration-200">
                  <div className="p-2 rounded-xl bg-sky-50 text-sky-500 shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h4 className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-0.5">Điểm tham quan</h4>
                    <p className="text-sm font-bold text-slate-700">{destination?.name}</p>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-100/80 shadow-xs flex items-start gap-3.5 hover:shadow-md transition duration-200">
                  <div className="p-2 rounded-xl bg-violet-50 text-violet-500 shrink-0">
                    <Clock size={20} />
                  </div>
                  <div>
                    <h4 className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-0.5">Thời gian</h4>
                    <p className="text-sm font-bold text-slate-700">{tour.duration}</p>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-100/80 shadow-xs flex items-start gap-3.5 hover:shadow-md transition duration-200">
                  <div className="p-2 rounded-xl bg-blue-50 text-blue-500 shrink-0">
                    <Plane size={20} />
                  </div>
                  <div>
                    <h4 className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-0.5">Phương tiện</h4>
                    <p className="text-sm font-bold text-slate-700">{transport?.name || "Xe du lịch"}</p>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-100/80 shadow-xs flex items-start gap-3.5 hover:shadow-md transition duration-200">
                  <div className="p-2 rounded-xl bg-orange-50 text-orange-500 shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h4 className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-0.5">Nơi khởi hành</h4>
                    <p className="text-sm font-bold text-slate-700">{detail.departurePlace}</p>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-100/80 shadow-xs flex items-start gap-3.5 hover:shadow-md transition duration-200">
                  <div className="p-2 rounded-xl bg-pink-50 text-pink-500 shrink-0">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <h4 className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-0.5">Ngày khởi hành</h4>
                    <p className="text-sm font-bold text-slate-700">{detail.departureDate}</p>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-100/80 shadow-xs flex items-start gap-3.5 hover:shadow-md transition duration-200">
                  <div className={`p-2 rounded-xl shrink-0 ${isFullyBooked ? "bg-rose-50 text-rose-500" : "bg-emerald-50 text-emerald-500"}`}>
                    <Users size={20} />
                  </div>
                  <div>
                    <h4 className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-0.5">Tình trạng chỗ</h4>
                    <p className={`text-sm font-bold ${isFullyBooked ? "text-rose-600" : "text-emerald-600"}`}>
                      {isFullyBooked ? "Hết chỗ" : `Còn ${seatsLeft} / ${detail.maxSeats}`}
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Tour Description */}
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100/80 shadow-xs space-y-4">
              <h2 className="text-lg md:text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <Info className="text-blue-600" size={20} /> Tổng quan tour
              </h2>
              <p className="text-sm md:text-base text-slate-600 leading-relaxed text-justify">
                {tour.description}
              </p>
            </div>

            {/* About the Destination Block */}
            <div className="bg-linear-to-r from-blue-50/40 to-indigo-50/40 p-6 md:p-8 rounded-3xl border border-blue-100/50 space-y-4">
              <h2 className="text-lg md:text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <Sparkles className="text-blue-600" size={20} /> Trải nghiệm văn hóa tại {destination?.name}
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed text-justify">
                {destination?.introduce}
              </p>
            </div>

            {/* Interactive Timeline */}
            <div className="space-y-4">
              <h2 className="text-lg md:text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <Calendar className="text-blue-600" size={20} /> Lịch trình chi tiết
              </h2>
              
              <div className="relative pl-6 space-y-6 before:absolute before:top-2 before:left-2.5 before:bottom-2 before:w-[2px] before:bg-slate-200">
                {parsedItineraryItems.map((item, idx) => {
                  const isExpanded = !!expandedTimeline[idx];
                  return (
                    <div key={idx} className="relative group">
                      
                      {/* Timeline dot */}
                      <span className="absolute -left-6 top-1.5 w-5 h-5 rounded-full border-4 border-white bg-blue-600 shadow-sm shrink-0 flex items-center justify-center transition duration-300 group-hover:scale-110"></span>
                      
                      {/* Content Card */}
                      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
                        <div 
                          onClick={() => toggleTimeline(idx)}
                          className="flex justify-between items-center p-4 md:p-5 cursor-pointer hover:bg-slate-50 select-none transition"
                        >
                          <div className="space-y-1">
                            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                              {item.day}
                            </span>
                            <h3 className="text-sm md:text-base font-bold text-slate-800 pt-1 leading-snug">
                              {item.content.split(",")[0]}
                            </h3>
                          </div>
                          <ChevronDown 
                            size={16} 
                            className={`text-slate-400 transition-transform duration-200 shrink-0 ${isExpanded ? "rotate-180 text-blue-600" : ""}`} 
                          />
                        </div>

                        {/* Collapsible detail */}
                        {isExpanded && (
                          <div className="px-5 pb-5 pt-1 text-sm text-slate-600 border-t border-slate-50 leading-relaxed space-y-3">
                            <p className="text-justify">{item.content}</p>
                            <div className="flex flex-wrap gap-2 text-xs font-medium text-slate-400 pt-2 border-t border-slate-100">
                              <span className="flex items-center gap-1"><Utensils size={13} /> Ăn uống: Theo lịch trình</span>
                              <span className="flex items-center gap-1"><MapPin size={13} /> Điểm đến: {destination?.name}</span>
                            </div>
                          </div>
                        )}
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>

            {/* Inclusions / Exclusions Accordion */}
            <div className="space-y-4">
              <h2 className="text-lg md:text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="text-blue-600" size={20} /> Quy định & Lưu ý dịch vụ
              </h2>
              
              <div className="space-y-3">
                {noticesList.map((notice, idx) => {
                  const isAccordionOpen = openAccordion === idx;
                  return (
                    <div key={idx} className="bg-white rounded-2xl shadow-xs border border-slate-100 overflow-hidden">
                      <div 
                        onClick={() => toggleAccordion(idx)}
                        className="flex justify-between items-center p-4 cursor-pointer hover:bg-slate-50 select-none transition"
                      >
                        <span className="text-sm md:text-base font-bold text-slate-700">{notice}</span>
                        <ChevronDown 
                          size={16} 
                          className={`text-slate-400 transition-transform duration-200 ${isAccordionOpen ? "rotate-180 text-blue-600" : ""}`} 
                        />
                      </div>
                      
                      {isAccordionOpen && (
                        <div className="p-5 bg-slate-50/50 text-sm text-slate-600 border-t border-slate-100/60 leading-relaxed text-justify">
                          {noticeDetailsMap[notice]}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Sticky Sidebar widget (Booking card) */}
          <div className="lg:sticky lg:top-10 space-y-4">
            <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-100 space-y-6">
              
              {/* Promotion Header */}
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 select-all"><QrCode size={13} /> {detail.uuid}</span>
                <div className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold border border-emerald-100/50 flex items-center gap-1">
                  <Check size={12} /> Giá tốt nhất
                </div>
              </div>

              {/* Price Details */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 line-through">Giá cũ: {formatPrice(oldPrice)}</span>
                  <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded text-[10px] font-bold">Tiết kiệm {formatPrice(promoDiscount)}</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-red-600 tracking-tight">{formatPrice(price)}</span>
                  <span className="text-sm font-medium text-slate-400">/ khách</span>
                </div>
              </div>

              {/* Promo box */}
              <div className="bg-orange-50/60 border border-orange-100 rounded-2xl p-4 flex gap-3">
                <Gift className="text-orange-500 shrink-0 mt-0.5" size={18} />
                <div className="text-xs text-orange-900 leading-relaxed">
                  Đặt ngay hôm nay để được hưởng <strong>Ưu đãi hoàn vé lên tới 10%</strong> khi thanh toán bằng thẻ tín dụng đối tác.
                </div>
              </div>

              {/* Metadata rows */}
              <div className="border-t border-slate-100 pt-4 space-y-3.5 text-xs md:text-sm">
                
                <div className="flex items-center justify-between gap-4">
                  <span className="text-slate-400 flex items-center gap-2 shrink-0"><QrCode size={15} /> Mã tour:</span>
                  <span className="font-semibold text-blue-600 break-all text-right select-all">{detail.uuid}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-2"><MapPin size={15} /> Điểm đi:</span>
                  <span className="font-bold text-slate-700">{detail.departurePlace}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-2"><Calendar size={15} /> Ngày đi:</span>
                  <span className="font-bold text-slate-700">{detail.departureDate}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-2"><Clock size={15} /> Thời lượng:</span>
                  <span className="font-bold text-slate-700">{tour.duration}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-2"><Users size={15} /> Còn trống:</span>
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
                  className={`flex-1 font-bold text-sm rounded-full transition-all duration-200 shadow-md ${
                    isFullyBooked 
                      ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none" 
                      : "bg-red-600 text-white hover:bg-red-700 hover:shadow-lg hover:shadow-red-100 active:scale-98"
                  }`}
                >
                  {isFullyBooked ? "Hết chỗ khởi hành" : "Đặt tour ngay"}
                </button>
              </div>

            </div>

            {/* Extra trust badges */}
            <div className="bg-slate-100/40 rounded-2xl p-4 border border-slate-200/50 flex items-center gap-3 text-xs text-slate-500 leading-normal">
              <ShieldCheck className="text-emerald-500 shrink-0" size={18} />
              <span>Chương trình được bảo chứng chất lượng bởi hiệp hội du lịch quốc gia, hoàn tiền 100% nếu có sai sót dịch vụ.</span>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}