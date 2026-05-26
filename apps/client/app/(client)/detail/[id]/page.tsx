"use client";

import React, { useState, use, useEffect } from "react";
import {
  MapPin, Utensils, Calendar, Plane, Gift,
  ChevronRight, ChevronDown, QrCode, Clock,
  Users, Phone, Maximize2, ShieldAlert, Sparkles,
  ArrowLeft, Compass, Info, Check, ShieldCheck,
  Car, Wifi, ShieldPlus, Hotel
} from "lucide-react";
import Link from "next/link";
import tourDetailService from "@/services/tour_detail-service";
import Breadcrumb from "@/components/ui/breadcum";
import Image from "next/image";
import ItinerarySection from "@/components/itinerary-section";
import RuleAndNoteSection from "@/components/RuleAndNoteSection";

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



const additionalServices = [
  {
    id: 1,
    name: "Xe đưa đón sân bay 2 chiều",
    description: "Xe riêng đón tiễn từ nhà đến sân bay và ngược lại, xe đời mới rộng rãi, lái xe chuyên nghiệp.",
    price: 500000,
    icon: Car
  },
  {
    id: 2,
    name: "Nâng cấp khách sạn 4 sao",
    description: "Nâng cấp hạng phòng lên tiêu chuẩn 4 sao sang trọng, bao gồm ăn sáng buffet và hồ bơi vô cực.",
    price: 1200000,
    icon: Hotel
  },
  {
    id: 3,
    name: "Bảo hiểm du lịch mở rộng",
    description: "Tăng mức bồi thường bảo hiểm lên tối đa 500.000.000đ/vụ cùng hỗ trợ y tế khẩn cấp 24/7.",
    price: 150000,
    icon: ShieldPlus
  },
  {
    id: 4,
    name: "Sim data 4G & Thiết bị phát Wifi",
    description: "Sim 4G tốc độ cao không giới hạn dung lượng, nhận sim ngay tại sân bay ga đi.",
    price: 200000,
    icon: Wifi
  }
];

export default function TourDetail({ params }: PageProps) {
  const { id: rawId } = use(params);
  const id = parseInt(rawId);

  const [detail, setDetail] = useState<TourDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeThumb, setActiveThumb] = useState<string>("");
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const [isOpen, setIsOpen] = useState(false);

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


  const formatPrice = (price: number) => {
    return price.toLocaleString("vi-VN") + "đ";
  };

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

  // // Build unique thumbnails list
  // const thumbnails = Array.from(new Set([
  //   getImageUrl(detail.image),
  //   getImageUrl(detail.subImage),
  //   getImageUrl(tour.image),
  //   getImageUrl(destination?.image)
  // ].filter(Boolean)));


  // Marketing pricing details
  const price = tour.price;
  const oldPrice = price + 2100000;
  const promoDiscount = 2100000;
  const seatsLeft = detail.seatsAvailable;
  const isFullyBooked = seatsLeft <= 0;

  const addOnTotal = additionalServices
    .filter(s => selectedServices.includes(s.id))
    .reduce((sum, s) => sum + s.price, 0);
  const finalPrice = price + addOnTotal;



  return (
    <div className="min-h-screen bg-light  font-sans antialiased pt-4 text-primary">
      <div className="container-main space-y-6">
        {/* Dynamic Breadcrumbs */}
        <Breadcrumb classname="text-text-secondary py-4 " />

        {/* Tour Title Header */}
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xs   md:flex-row md:items-center ">
          <h1 className="text-xl md:text-xl font-bold tracking-normal font-sans text-text-primary text-balance leading-normal">
            {tour.name}
          </h1>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* Left Main Content */}
          <div className="lg:col-span-2 space-y-8">

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
              {/* <div className="flex justify-center gap-3 overflow-x-auto pb-1 scrollbar-none">
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
              </div> */}
            </div>

            <div className="space-y-4 font-sans">
              <h2 className="text-lg md:text-xl font-bold text-text-primary flex items-center gap-2">
                <div className="text-primary" /> Thông tin về chuyến đi
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




            {/* Additional Services Section (Sleek List Layout + iOS Switches) */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-2 border-b border-slate-50">
                <div className="space-y-1">
                  <h3 className="text-base md:text-lg font-extrabold text-slate-950 flex items-center gap-2">
                    <Sparkles className="text-blue-500 animate-pulse" size={18} /> Nâng tầm trải nghiệm chuyến đi
                  </h3>
                  <p className="text-xs text-slate-400">
                    Tùy chọn các tiện ích chất lượng cao thiết kế riêng cho hành trình của bạn.
                  </p>
                </div>
                <span className="text-xs font-semibold bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full border border-blue-100/30 shrink-0">
                  Tùy chọn
                </span>
              </div>

              <div className="divide-y divide-slate-100">
                {additionalServices.map((service) => {
                  const isSelected = selectedServices.includes(service.id);
                  const IconComponent = service.icon;
                  return (
                    <div
                      key={service.id}
                      onClick={() => handleToggleService(service.id)}
                      className="flex items-center justify-between py-4 group cursor-pointer transition-colors duration-200 hover:bg-slate-50/50 px-2 -mx-2 rounded-2xl"
                    >
                      {/* Left side: Circular Icon & Description */}
                      <div className="flex items-center gap-4 min-w-0 pr-4">
                        <div className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${isSelected
                          ? "bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-sm shadow-blue-200"
                          : "bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500"
                          }`}>
                          <IconComponent size={20} />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-sm md:text-base font-bold text-slate-800 transition-colors group-hover:text-blue-600">
                            {service.name}
                          </h4>
                          <p className="text-xs text-slate-400 mt-0.5 line-clamp-1 group-hover:text-slate-500 transition-colors text-justify">
                            {service.description}
                          </p>
                        </div>
                      </div>

                      {/* Right side: Price Add-on & iOS Toggle */}
                      <div className="flex items-center gap-4 shrink-0">
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 block font-medium uppercase tracking-wider">Phụ phí</span>
                          <span className="text-sm font-extrabold text-blue-600">+{formatPrice(service.price)}</span>
                        </div>

                        {/* iOS-style toggle */}
                        <div className="relative inline-flex items-center select-none">
                          <div className={`w-11 h-6 rounded-full transition-colors duration-300 relative ${isSelected ? "bg-blue-600" : "bg-slate-200"
                            }`}>
                            <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-xs transition-transform duration-300 ${isSelected ? "translate-x-5" : "translate-x-0"
                              } left-0.5`}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Sticky Sidebar widget (Booking card) */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-10 space-y-4">
              <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-100 space-y-6 ">
                {/* Price Details */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 line-through">Giá cũ: {formatPrice(oldPrice + addOnTotal)}</span>
                    <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded text-[10px] font-bold">Tiết kiệm {formatPrice(promoDiscount)}</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-red-600 tracking-tight">{formatPrice(finalPrice)}</span>
                    <span className="text-sm font-medium text-slate-400">/ khách</span>
                  </div>
                </div>

                {/* Selected Add-ons breakdown */}
                {selectedServices.length > 0 && (
                  <div className="bg-slate-50 border border-slate-100/80 rounded-2xl p-3.5 space-y-2">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tiện ích chọn thêm:</div>
                    <div className="space-y-1.5">
                      {additionalServices
                        .filter(s => selectedServices.includes(s.id))
                        .map(service => (
                          <div key={service.id} className="flex justify-between items-center text-xs">
                            <span className="text-slate-600 font-medium truncate max-w-[160px]">{service.name}</span>
                            <span className="text-slate-500 font-semibold shrink-0">+{formatPrice(service.price)}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

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
                    onClick={() => alert(`Đặt tour thành công!\nTổng giá trị: ${formatPrice(finalPrice)}` + (selectedServices.length > 0 ? `\nDịch vụ chọn thêm: ${additionalServices.filter(s => selectedServices.includes(s.id)).map(s => s.name).join(", ")}` : ""))}
                    className={`flex-1 font-bold text-sm rounded-full transition-all duration-200 shadow-md ${isFullyBooked
                      ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                      : "bg-red-600 text-white hover:bg-red-700 hover:shadow-lg hover:shadow-red-100 active:scale-98"
                      }`}
                  >
                    {isFullyBooked ? "Hết chỗ khởi hành" : "Đặt tour ngay"}
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}