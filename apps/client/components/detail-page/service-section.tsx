"use client"

import { useEffect, useState } from "react"
import ServiceAddition from "@/services/tourService-service"
import { Car, Hotel, ShieldPlus, Wifi, Sparkles } from "lucide-react"

export interface ServiceItems {
    id: number;
    name: string;
    price: number;
    status: string;
    description: string;
}

interface ServiceSectionProps {
    selectedServices: number[];
    onToggleService: (serviceId: number) => void;
    onServicesLoad: (services: ServiceItems[]) => void;
}

// const getServiceIcon = (name: string) => {
//     const normalized = name.toLowerCase();
//     if (normalized.includes("xe") || normalized.includes("đưa đón") || normalized.includes("car")) return Car;
//     if (normalized.includes("khách sạn") || normalized.includes("hotel") || normalized.includes("phòng")) return Hotel;
//     if (normalized.includes("bảo hiểm") || normalized.includes("insurance") || normalized.includes("shield")) return ShieldPlus;
//     if (normalized.includes("sim") || normalized.includes("wifi") || normalized.includes("data") || normalized.includes("internet")) return Wifi;
//     return Sparkles;
// };

const formatPrice = (price: number) => {
    return price.toLocaleString("vi-VN") + "đ";
};

export default function ServiceSection({
    selectedServices,
    onToggleService,
    onServicesLoad
}: ServiceSectionProps) {
    const [services, setServices] = useState<ServiceItems[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        const fetchServices = async () => {
            try {
                const data = await ServiceAddition.getServiceAddtion();
                if (isMounted) {
                    const servicesData = data || [];
                    setServices(servicesData);
                    onServicesLoad(servicesData);
                }
            }
            catch (error) {
                console.error("Failed to fetch tour-details:", error);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };
        fetchServices();
        return () => {
            isMounted = false;
        };
    }, [onServicesLoad]);

    if (loading) {
        return (
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-5 animate-pulse">
                <div className="h-6 w-1/3 bg-slate-200 rounded"></div>
                <div className="space-y-4">
                    {[1, 2, 3].map(n => (
                        <div key={n} className="h-16 bg-slate-100 rounded-2xl"></div>
                    ))}
                </div>
            </div>
        );
    }

    if (services.length === 0) return null;

    return (
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-5">

            <div className="divide-y divide-slate-100">
                {services.map((service) => {
                    const isSelected = selectedServices.includes(service.id);
                    // const IconComponent = getServiceIcon(service.name);
                    return (
                        <div
                            key={service.id}
                            onClick={() => onToggleService(service.id)}
                            className="flex items-center justify-between py-4 group cursor-pointer transition-colors duration-200 hover:bg-slate-50/50 px-2 -mx-2 rounded-2xl"
                        >
                            {/* Left side: Circular Icon & Description */}
                            <div className="flex items-center gap-4 min-w-0 pr-4">
                                <div className="min-w-0">
                                    <h4 className="text-sm md:text-base font-bold text-text-primary transition-colors group-hover:text-primary">
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
                                    <span className="text-sm font-extrabold text-red-700">+{formatPrice(service.price)}</span>
                                </div>

                                {/* iOS-style toggle */}
                                <div className="relative inline-flex items-center select-none">
                                    <div className={`w-11 h-6 rounded-full transition-colors duration-300 relative ${isSelected ? "bg-primary" : "bg-slate-200"
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
    );
}