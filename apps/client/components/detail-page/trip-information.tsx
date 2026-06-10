"use client"

import tourDetailService from "@/services/tour_detail-service"
import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

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
    const [isOpen, setIsOpen] = useState(false);

    const [loading, setLoading] = useState(true);

    const dropdownRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();

    useEffect(() => {
        const handleRouteChange = () => {
            setIsOpen(false);
        };

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

                    <div className="bg-surface p-4 rounded-3xl     hover:shadow-md transition duration-200">
                        <div className="    pb-2  gap-2 flex   items-center text-primary shrink-0">
                            <span className="material-symbols-outlined">
                                calendar_month
                            </span>
                            <h4 className="text-sm font-bold uppercase font-sans  ">Ngày khởi hành</h4>
                        </div>
                        <div className="   gap-2 flex justify-between   items-center text-primary shrink-0">
                            <p className="text-sm font-semibold tracking-tight text-text-secondary font-sans">{items.departureDate}</p>
                            <button onClick={() => setIsOpen(!isOpen)}
                                className="rounded-3xl p-2 bg-blue-400 text-surface font-bold text-sm relative group">Thay đổi
                                {isOpen && (
                                    <div className="absolute translate-x-2 left-full p-4 rounded-3xl top-0 z-100 bg-primary ">
                                        <div className="grid grid-cols-3">
                                            {tours.map((items) => (
                                                <div key={items.id} className="col-span-1"> <div className="flex justify-between">
                                                    {items.departureDate}
                                                    <Link href={`/detail/${tour_id}?detailId=${items.id}`} scroll={false}>Chọn</Link>
                                                </div></div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </button>

                        </div>

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