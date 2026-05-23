"use client";
import React, { useState, use, useEffect } from "react";
import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/ui/breadcum";
import Image from "next/image";
import {
  Search,
  MapPin,
  Calendar,
  Compass,
  SlidersHorizontal,
  Grid,
  List,
  ChevronDown,
  Leaf,
} from "lucide-react";
import destinationService from "@/services/destination-service";
import tourService from "@/services/tour-service";
import TourCard from "@/components/ui/TourCard";
import CustomSelect, { Option } from "@/components/ui/CustomSelect";

const attractionOptions: Option[] = [
  { id: 1, name: "Vinpearl Safari" },
  { id: 2, name: "Chợ Đêm" },
  { id: 3, name: "Hồ Tuyền Lâm" },
  { id: 4, name: "Bà Nà Hills" },
  { id: 5, name: "Fansipan" },
];

export type Tours = {
  id: number;
  name: string;
  price: number;
  duration: string;
  image: string;
  description: string;
  categories: {
    id: number;
    name: string;
    introduce: string;
    image: string;
  };
  destination: {
    id: number;
    name: string;
  };
  transports: {
    id: number;
    name: string;
  };
};

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

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function DestinationPage({ params }: PageProps) {
  const { id: rawId } = use(params);
  const id = parseInt(rawId);
  const [destination, setDestination] = useState<Destinations | null>(null);
  const [tours, setTours] = useState<Tours[]>([]);
  const [loading, setLoading] = useState(true);
  const [allDestinations, setAllDestinations] = useState<Option[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      if (isNaN(id)) return;
      try {
        const [destData, toursData, allDestData] = await Promise.all([
          destinationService.getDestinationById(id),
          tourService.getTourByDestination(id),
          destinationService.getAll(),
        ]);
        setDestination(destData);
        setTours(toursData);
        if (allDestData && Array.isArray(allDestData)) {
          setAllDestinations(
            allDestData.map((d: any) => ({ id: d.id, name: d.name })),
          );
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const [isEsgActive, setIsEsgActive] = useState(false);

  if (loading)
    return (
      <div className="animate-pulse py-4">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    );

  if (isNaN(id)) {
    return <div>ID không hợp lệ: {rawId}</div>;
  }

  return (
    <div className="min-h-screen bg-surface font-sans  antialiased">
      {/* 1. HERO BANNER */}
      <section className="relative h-[320px] w-full overflow-hidden  text-white">
        <Image
          alt={destination?.name || "destination"}
          src={`/images/${destination?.image}`}
          loading="eager"
          fill
        />
        <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent" />
        <div className="relative mx-auto flex h-full container-main flex-col justify-between px-4 py-8 md:px-6">
          <Breadcrumb />
          <div className="mb-4 max-w-full flex flex-col items-center">
            <h1 className="mb-4 text-center text-4xl font-extrabold tracking-wide uppercase md:text-5xl lg:text-4xl">
              {destination?.name}
            </h1>

            <p className="text-sm  font-semibold max-w-[70vw] tracking-tight leading-normal text-balance  text-center md:text-lg">
              {destination?.introduce || ""}
            </p>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <main className="container-main md:px-6">
        {/* 2. FLOATING SEARCH BAR */}
        <div className="relative  mb-12 rounded-2xl bg-white p-4 shadow-xl border border-slate-100">
          {/* <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
          </div> */}
        </div>

        {/* 3. SIDEBAR + RESULTS */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* SIDEBAR */}
          <aside className="space-y-6 lg:col-span-1 lg:sticky lg:top-32 self-start hidden md:block">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
              <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="flex items-center gap-2 font-bold font-sans tracking-tight  text-text-primary text-lg">
                  <SlidersHorizontal className="h-4 w-4 text-slate-500 " />
                  Bộ lọc tìm kiếm
                </h2>
                <button className="text-sm font-medium text-zinc-300 hover:text-primary hover:font-bold">
                  Đặt lại
                </button>
              </div>

              {/* ESG Toggle
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
              </div> */}

              <div className="space-y-4 ">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold font-sans text-text-secondary  tracking-wider">
                    Điểm đến
                  </label>
                  <CustomSelect
                    options={allDestinations}
                    placeholder="Chọn điểm đến"
                    onChange={(val) => {
                      if (val) {
                        router.push(`/destination/${val.id}`);
                      }
                    }}
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold font-sans text-text-secondary  tracking-wider">
                    Điểm tham quan
                  </label>
                  <CustomSelect
                    options={attractionOptions}
                    placeholder="Chọn điểm tham quan"
                    onChange={(val) => console.log("Selected attr:", val)}
                  />
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
                <span className="font-bold text-slate-900 text-lg">
                  {tours.length}
                </span>{" "}
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
              {tours.map((tour) => (
                <TourCard
                  key={tour.id}
                  image={`/images/${tour.image}`}
                  category={tour.categories.name}
                  title={tour.name}
                  duration={tour.duration}
                  price={tour.price}
                  description={tour.description}
                  href="/"
                />
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
