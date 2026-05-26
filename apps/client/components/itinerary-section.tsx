"use client"
import { useEffect, useState } from "react";
import itineraryService from "@/services/itinerary-service"
import { ChevronDown } from "lucide-react";

interface itineraryProps {
    tourDetailId: number,
}
interface ItineraryItem {
    id: number;
    tourDetailId: number;
    title: string;
    description: string;
    dayNumber: number;
}

export default function itinerary({ tourDetailId }: itineraryProps) {
    const [itineraries, setItineraries] = useState<ItineraryItem[]>([]);
    const [loading, setLoading] = useState(true);

    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    useEffect(() => {
        const fetchItineraries = async () => {
            try {
                const data = await itineraryService.getItinerary(tourDetailId);
                setItineraries(data);
            } catch (error) {
                console.error("Failed to fetch itineraries:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchItineraries();
    }, [tourDetailId]);
    return (
        <div className="relative pl-6 space-y-6 before:absolute before:top-2 before:left-2.5 before:bottom-2 before:w-[2px] before:bg-slate-200">
            <div
                className="relative group:">
                {itineraries.map((item, index) => (
                    <div key={index} className="bg-white hover:bg-slate-50 rounded-3xl  mb-2 p-2">
                        <div onClick={() => toggle(index)} className="flex justify-between  font-sans text-base font-bold text-text-primary items-center p-4 md:p-5 cursor-pointer  select-none transition">
                            <div className="flex gap-2 items-baseline">
                                Ngày {item.dayNumber}:
                                <h3 className="text-sm md:text-base font-bold text-slate-800 pt-1 leading-snug">
                                    {item.title}
                                </h3>
                            </div>
                            <ChevronDown
                                size={16}
                                className={`text-slate-400 transition-transform duration-200 shrink-0 ${openIndex === index ? "rotate-180" : ""
                                    }`}
                            />
                        </div>
                        <div
                            className={`overflow-hidden transition-all duration-300 ${openIndex === index ? "max-h-[500px] p-4" : "max-h-0"
                                }`}
                        >
                            <p className="text-text-secondary font-sans text-sm font-medium">{item.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div >
    );

}