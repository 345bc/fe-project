"use client";
import { useEffect, useState } from "react";
import TourCard from "@/components/ui/TourCard";
import ListSlider from "@/components/ui/ListSlider";
import tourService from "@/services/tour-service";

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

interface TourRelatedSectionProps {
    tourId: number;
}

export default function TourRelatedSection({ tourId }: TourRelatedSectionProps) {
    const [tours, setTours] = useState<Tours[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTours = async () => {
            try {
                setLoading(true);
                const data = await tourService.getToursRelated(tourId);
                setTours(data || []);
            } catch (err) {
                console.error("Error fetching related tours:", err);
            } finally {
                setLoading(false);
            }
        };
        if (tourId) {
            fetchTours();
        }
    }, [tourId]);

    if (loading)
        return (
            <div className="animate-pulse flex gap-6 overflow-hidden">
                {[1, 2, 3].map((n) => (
                    <div key={n} className="flex-1 min-w-[280px] bg-slate-100 h-[400px] rounded-2xl p-5 space-y-4">
                        <div className="h-48 bg-slate-200 rounded-xl w-full"></div>
                        <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                        <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                    </div>
                ))}
            </div>
        );

    if (tours.length === 0) {
        return (
            <div className="text-center py-8 text-text-secondary text-sm">
                Không tìm thấy tour liên quan nào.
            </div>
        );
    }

    return (
        <ListSlider>
            {tours.map((tour) => (
                <TourCard
                    key={tour.id}
                    image={tour.image ? (tour.image.startsWith("http") || tour.image.startsWith("/") ? tour.image : `/images/${tour.image}`) : "/images/demo_banner.jpg"}
                    category={tour.categories?.name || "Khác"}
                    title={tour.name}
                    duration={tour.duration}
                    price={tour.price}
                    description={tour.description}
                    href={`/detail/${tour.id}`}
                />
            ))}
        </ListSlider>
    );
}

