"use client";
import React, { useState, use, useEffect } from "react";
import Breadcrumb from "@/components/ui/breadcum";
import {
  Search,
  MapPin,
  Calendar,
  Compass,
  SlidersHorizontal,
  Grid,
  List,
  Star,
  Heart,
  ChevronDown,
  Leaf,
} from "lucide-react";
import destinationService from "@/services/destination-service";

export type Destinations = {
  id: number;
  name: string;
  image: string;
  introduce: string;
  destinationGroup: {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
  };
};
const TOURS_DATA = [
  {
    id: 1,
    title: "Tour Khám Phá Paris Cổ Kính & Cung Điện Versailles",
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80",
    tag: "Tiêu chuẩn",
    tagColor: "bg-blue-600",
    rating: 4.9,
    reviews: 128,
    duration: "7 Ngày 6 Đêm",
    price: "45.900.000",
  },
  {
    id: 2,
    title: "Hành Trình Về Miền Quê Pháp & Làng Cổ Tích Colmar",
    image:
      "https://images.unsplash.com/photo-1549144511-f099e773c147?auto=format&fit=crop&w=600&q=80",
    tag: "Giá tốt",
    tagColor: "bg-emerald-600",
    rating: 4.8,
    reviews: 94,
    duration: "8 Ngày 7 Đêm",
    price: "39.900.000",
  },
  {
    id: 3,
    title: "Du Thuyền Sông Seine & Ngắm Hoàng Hôn Miền Nam Nước Pháp",
    image:
      "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=600&q=80",
    tag: "Giá tốt",
    tagColor: "bg-emerald-600",
    rating: 4.7,
    reviews: 62,
    duration: "6 Ngày 5 Đêm",
    price: "34.500.000",
  },
];

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function DestinationPage({ params }: PageProps) {
  const { id: rawId } = use(params);
  const id = parseInt(rawId);
  const [destinations, setDestinations] = useState<Destinations[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTours = async () => {
      const data = await destinationService.getDestinationById();
      setDestinations(data);
      setLoading(false);
    };
    fetchTours();
  }, []);

  if (loading)
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    );

  const [isEsgActive, setIsEsgActive] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);

  const toggleFavorite = (tourId: number) => {
    setFavorites((prev) =>
      prev.includes(tourId)
        ? prev.filter((item) => item !== tourId)
        : [...prev, tourId],
    );
  };

  if (isNaN(id)) {
    return <div>ID không hợp lệ: {rawId}</div>;
  }

  return (
    <div className="min-h-screen bg-surface font-sans text-slate-800 antialiased">
      {/* 1. HERO BANNER */}
      <section className="relative h-[440px] w-full overflow-hidden bg-slate-900 text-white">
        <img
          src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1920&q=80"
          alt="France Destination"
          className="absolute inset-0 h-full w-full object-cover opacity-60 mix-blend-multiply"
        />
        <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent" />

        <div className="relative mx-auto flex h-full container-main flex-col justify-between px-4 py-8 md:px-6">
          <div className="[&_a]:text-slate-300 [&_span]:text-white [&_li]:text-slate-400 [&_a:hover]:text-white">
            <Breadcrumb />
          </div>

          <div className="mb-16 max-w-3xl">
            <h1 className="mb-4 text-4xl font-extrabold tracking-wide md:text-5xl lg:text-6xl">
              PHÁP
            </h1>
            <p className="text-base leading-relaxed text-slate-200 md:text-lg">
              Pháp luôn được xem là đất nước lãng mạn nhất thế giới, một quốc
              gia giàu truyền thống văn hóa, lịch sử.
            </p>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <main className="container-main md:px-6">
        {/* 2. FLOATING SEARCH BAR */}
        <div className="relative -mt-10 z-10 mb-12 rounded-2xl bg-white p-4 shadow-xl border border-slate-100">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-3 border-b pb-2 sm:border-b-0 sm:border-r sm:pb-0 sm:pr-4 border-slate-100">
              <Compass className="h-5 w-5 text-blue-600 shrink-0" />
              <div className="w-full">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Loại hình
                </label>
                <select className="w-full bg-transparent font-medium text-slate-700 outline-none cursor-pointer">
                  <option>Tất cả các tour</option>
                  <option>Tour trọn gói</option>
                  <option>Tour gia đình</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3 border-b pb-2 sm:border-b-0 lg:border-r sm:pb-0 lg:pr-4 border-slate-100">
              <MapPin className="h-5 w-5 text-blue-600 shrink-0" />
              <div className="w-full">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Khởi hành từ
                </label>
                <select className="w-full bg-transparent font-medium text-slate-700 outline-none cursor-pointer">
                  <option>Tất cả địa điểm</option>
                  <option>TP. Hồ Chí Minh</option>
                  <option>Hà Nội</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3 border-b pb-2 sm:border-b-0 sm:border-r sm:pb-0 sm:pr-4 border-slate-100">
              <Calendar className="h-5 w-5 text-blue-600 shrink-0" />
              <div className="w-full">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Ngày khởi hành
                </label>
                <input
                  type="date"
                  defaultValue="2026-05-16"
                  className="w-full bg-transparent font-medium text-slate-700 outline-none cursor-pointer"
                />
              </div>
            </div>

            <div className="flex items-center justify-center lg:pl-4">
              <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white transition hover:bg-blue-700 shadow-md shadow-blue-200">
                <Search className="h-5 w-5" />
                <span>Đổi tìm kiếm</span>
              </button>
            </div>
          </div>
        </div>

        {/* 3. SIDEBAR + RESULTS */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* SIDEBAR */}
          <aside className="space-y-6 lg:col-span-1">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
              <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="flex items-center gap-2 font-bold text-slate-900 text-lg">
                  <SlidersHorizontal className="h-4 w-4 text-slate-500" />
                  Bộ lọc tìm kiếm
                </h2>
                <button className="text-sm font-medium text-blue-600 hover:underline">
                  Đặt lại
                </button>
              </div>

              {/* ESG Toggle */}
              <div className="mb-6 rounded-xl bg-emerald-50/50 p-3.5 border border-emerald-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Leaf className="h-5 w-5 text-emerald-600" />
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      ESG & LEI Tour
                    </p>
                    <p className="text-xs text-emerald-700">Du lịch bền vững</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsEsgActive(!isEsgActive)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    isEsgActive ? "bg-emerald-600" : "bg-slate-200"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      isEsgActive ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Điểm đến
                  </label>
                  <div className="relative">
                    <select className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-2.5 pr-10 font-medium text-slate-700 outline-none transition focus:border-blue-500">
                      <option>Chọn điểm đến</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 pointer-events-none text-slate-400" />
                  </div>
                </div>

                <div className="pt-2">
                  <label className="mb-2 block text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Dòng tour
                  </label>
                  <div className="space-y-2.5">
                    {["Giá Tốt", "Tiêu chuẩn"].map((label) => (
                      <label
                        key={label}
                        className="flex items-center justify-between cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm font-medium text-slate-700">
                            {label}
                          </span>
                        </div>
                        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-500">
                          13
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* RESULTS */}
          <section className="lg:col-span-3">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-slate-500 text-sm">
                Kết quả:{" "}
                <span className="font-bold text-slate-900 text-lg">31</span>{" "}
                chương trình tour
              </p>

              <div className="flex items-center gap-4 self-end sm:self-auto">
                <div className="flex items-center gap-2 bg-white border border-slate-200 p-1.5 rounded-xl shadow-sm">
                  <button className="rounded-lg bg-slate-100 p-1.5 text-blue-600">
                    <Grid className="h-4 w-4" />
                  </button>
                  <button className="rounded-lg p-1.5 text-slate-400 hover:text-slate-600">
                    <List className="h-4 w-4" />
                  </button>
                </div>

                <select className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 outline-none shadow-sm cursor-pointer">
                  <option>Ngày khởi hành gần nhất</option>
                  <option>Giá từ thấp đến cao</option>
                  <option>Giá từ cao đến thấp</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {TOURS_DATA.map((tour) => (
                <article
                  key={tour.id}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="relative aspect-4/3 w-full overflow-hidden bg-slate-100">
                    <img
                      src={tour.image}
                      alt={tour.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <span
                      className={`absolute left-3 top-3 rounded-lg px-3 py-1 text-xs font-bold text-white shadow-sm ${tour.tagColor}`}
                    >
                      {tour.tag}
                    </span>
                    <button
                      onClick={() => toggleFavorite(tour.id)}
                      className="absolute right-3 top-3 rounded-full bg-white/90 p-2 text-slate-600 backdrop-blur-sm transition hover:bg-white hover:text-rose-600 shadow-sm"
                    >
                      <Heart
                        className={`h-4 w-4 transition-colors ${
                          favorites.includes(tour.id)
                            ? "fill-rose-600 text-rose-600"
                            : ""
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex flex-1 flex-col p-4">
                    <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-slate-500">
                      <div className="flex items-center gap-0.5 text-amber-500">
                        <Star className="h-3.5 w-3.5 fill-current" />
                        <span className="font-bold text-slate-800">
                          {tour.rating}
                        </span>
                      </div>
                      <span>•</span>
                      <span>({tour.reviews} đánh giá)</span>
                    </div>

                    <h3 className="mb-2 line-clamp-2 text-base font-bold text-slate-900 group-hover:text-blue-600 transition">
                      {tour.title}
                    </h3>

                    <p className="mb-4 text-xs font-semibold text-slate-400 uppercase tracking-wide">
                      Thời gian:{" "}
                      <span className="text-slate-600 normal-case">
                        {tour.duration}
                      </span>
                    </p>

                    <div className="mt-auto border-t border-slate-100 pt-3 flex items-center justify-between">
                      <div>
                        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Giá từ
                        </span>
                        <span className="text-lg font-black text-rose-600">
                          {tour.price} đ
                        </span>
                      </div>
                      <button className="rounded-xl bg-slate-100 px-4 py-2 text-xs font-bold text-blue-600 transition hover:bg-blue-600 hover:text-white">
                        Xem chi tiết
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
