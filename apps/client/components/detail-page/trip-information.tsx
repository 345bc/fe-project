"use client"

import tourDetailService from "@/services/tour_detail-service"
import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const firstPart = dateStr.split(" ")[0];
    if (!firstPart) return dateStr;
    const cleanDate = firstPart.split("T")[0];
    if (!cleanDate) return dateStr;
    const parts = cleanDate.split("-");
    if (parts.length === 3) {
        const y = parts[0];
        const m = parts[1];
        const d = parts[2];
        if (y && m && d) {
            return `${d.padStart(2, '0')}/${m.padStart(2, '0')}/${y}`;
        }
    }
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
        const d = String(date.getDate()).padStart(2, '0');
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const y = date.getFullYear();
        return `${d}/${m}/${y}`;
    }
    return dateStr;
};


interface InfomationItems {
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

interface InformationProps { id?: number, tour_id?: number }


export default function InformationSecion({ id, tour_id }: InformationProps) {
    const [information, setInformation] = useState<InfomationItems[]>([]);
    const [tours, setTours] = useState<InfomationItems[]>([]);
    const [isOpen, setIsOpen] = useState(true);

    const [loading, setLoading] = useState(true);

    const dropdownRef = useRef<HTMLDivElement>(null);
    const isFirstRender = useRef(true);
    const pathname = usePathname();

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        setIsOpen(false);
    }, [pathname]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const fetchDetailData = async () => {
            try {
                const data = await tourDetailService.getTourDetailById(id);
                setInformation(data ? [data] : []);
                setLoading(false)
            } catch (error) {
                console.error("Failed to fetch tour-details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDetailData();
    }, [id]);

    useEffect(() => {
        const fetchToursData = async () => {
            try {
                const data = await tourDetailService.getTourDetailByTourId(tour_id);
                setTours(data);
                setLoading(false)
            } catch (error) {
                console.error("Failed to fetch tour-details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchToursData();
    }, [id]);


    return (
        <div>
            {information.map((items) => (
                <div key={items.id} className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="bg-surface p-4 rounded-3xl     hover:shadow-md transition duration-200">
                        <div className="    pb-2  gap-2 flex   items-center text-primary shrink-0">
                            <span className="material-symbols-outlined">
                                schedule
                            </span>
                            <h4 className="text-sm text-primary font-bold uppercase font-sans  ">Thời gian</h4>

                        </div>
                        <div>
                            <p className="text-sm font-semibold tracking-tight text-text-secondary font-sans">{items.tour.duration}</p>
                        </div>
                    </div>

                    <div className="bg-surface p-4 rounded-3xl     hover:shadow-md transition duration-200">
                        <div className="    pb-2  gap-2 flex   items-center text-primary shrink-0">
                            <span className="material-symbols-outlined bg-surface">
                                flight
                            </span>
                            <h4 className="text-sm font-bold uppercase font-sans  ">Phương tiện</h4>

                        </div>
                        <div>
                            <p className="text-sm font-semibold tracking-tight text-text-secondary font-sans">{items.tour.transports.name}</p>
                        </div>
                    </div>


                    <div className="bg-surface p-4 rounded-3xl     hover:shadow-md transition duration-200">
                        <div className="    pb-2  gap-2 flex   items-center text-primary shrink-0">
                            <span className="material-symbols-outlined">
                                distance
                            </span>
                            <h4 className="text-sm font-bold uppercase font-sans  ">Điểm khởi hành</h4>

                        </div>
                        <div>
                            <p className="text-sm font-semibold tracking-tight text-text-secondary font-sans">{items.departurePlace}</p>
                        </div>
                    </div>

                    <div className="bg-surface p-4 rounded-3xl hover:shadow-md transition duration-200 relative" ref={dropdownRef}>
                        <div className="pb-2 gap-2 flex items-center text-primary shrink-0">
                            <span className="material-symbols-outlined">
                                calendar_month
                            </span>
                            <h4 className="text-sm font-bold uppercase font-sans">Ngày khởi hành</h4>
                        </div>
                        <div className="gap-2 flex justify-between items-center text-primary shrink-0">
                            <p className="text-sm font-semibold tracking-tight text-text-secondary font-sans">
                                {formatDate(items.departureDate)}
                            </p>
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="rounded-3xl px-3 py-1.5 bg-blue-400 hover:bg-blue-500 text-surface font-bold text-sm transition-colors duration-200 shrink-0"
                            >
                                Thay đổi
                            </button>
                        </div>

                        {isOpen && (
                            <div className="absolute left-0 top-full mt-2 z-50 bg-surface shadow-2xl border border-slate-100 p-5 rounded-3xl w-[calc(100vw-32px)] sm:w-[500px] md:w-[600px]">
                                <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-1">
                                    {tours.map((item) => (
                                        <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-slate-50/50 hover:bg-slate-50 rounded-2xl border border-slate-100/80 transition-all duration-200">
                                            <div className="flex items-center gap-2.5">
                                                {/* Date Badge */}
                                                <span className="bg-blue-50 text-blue-600 font-semibold px-3 py-1.5 rounded-full text-xs sm:text-sm font-sans tracking-wide shrink-0">
                                                    {formatDate(item.departureDate)}
                                                </span>

                                                <div className="flex items-center gap-1 text-text-secondary text-xs font-mono font-medium bg-slate-100/80 px-2.5 py-1 rounded-lg">
                                                    <span className="material-symbols-outlined text-[14px] shrink-0">confirmation_number</span>
                                                    <span className="truncate max-w-[120px] sm:max-w-[180px]">{item.uuid}</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between sm:justify-end gap-4">
                                                {/* Price */}
                                                <span className="text-primary font-extrabold text-sm sm:text-base whitespace-nowrap">
                                                    {item.tour.price.toLocaleString("vi-VN")}đ
                                                </span>

                                                {/* Select link */}
                                                <Link
                                                    href={`/detail/${tour_id}?detailId=${item.id}`}
                                                    scroll={false}
                                                    onClick={() => setIsOpen(false)}
                                                    className="bg-slate-100 hover:bg-primary hover:text-white text-text-primary px-4 py-1.5 rounded-full font-bold text-xs transition-all active:scale-95 duration-200"
                                                >
                                                    Chọn
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>





                    {/* <div className="bg-white p-5 rounded-2xl border border-slate-100/80 shadow-xs flex items-start gap-3.5 hover:shadow-md transition duration-200">
                        <div className={`p-2 rounded-xl shrink-0 ${isFullyBooked ? "bg-rose-50 text-rose-500" : "bg-emerald-50 text-emerald-500"}`}>
                            <Users size={20} />
                        </div>
                        <div>
                            <h4 className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-0.5">Tình trạng chỗ</h4>
                            <p className={`text-sm font-bold ${isFullyBooked ? "text-rose-600" : "text-emerald-600"}`}>
                                {isFullyBooked ? "Hết chỗ" : `Còn ${seatsLeft} / ${detail.maxSeats}`}
                            </p>
                        </div>
                    </div> */}

                </div >

            ))
            }

        </div >



    );

}