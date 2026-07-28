"use client";
import { useEffect, useState } from "react";
import ListSlider from "./ui/ListSlider";
import ComboTourCard from "./ui/ComboTourCard";
import tourService from "@/services/tour-service";
import dataminingService from "@/services/datamining-service";

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

export default function ComboTourSection() {
  const [tours, setTours] = useState<Tours[]>([]);
  const [tourCombos, setTourCombos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tourData, aprioriData] = await Promise.all([
          tourService.getTours(),
          dataminingService.getAprioriResults(0.05, 0.3)
        ]);
        setTours(tourData || []);
        setTourCombos(aprioriData?.tourCombos || []);
      } catch (err) {
        console.error("Error fetching combo tours data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading)
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    );

  // Lọc chỉ giữ lại các tour thực sự có combo tương ứng từ tourCombos (đạt độ tin cậy >= 20%)
  const toursWithCombos = tours.filter(tour => 
    tourCombos.some(combo => combo.tourName === tour.name)
  );

  // Nếu không có tour nào có combo đạt chuẩn tin cậy, hiển thị dòng thông báo cập nhật
  if (toursWithCombos.length === 0) {
    return (
      <div className="text-center py-8 text-slate-400 text-sm">
        Đang cập nhật danh sách Combo siêu hot...
      </div>
    );
  }

  return (
    <ListSlider>
      {toursWithCombos.map((tour) => {
        // Tìm combo của tour tương ứng (tourCombos đã được backend sắp xếp theo độ tin cậy giảm dần)
        const combo = tourCombos.find(c => c.tourName === tour.name);
        if (!combo) return null;

        const originalPrice = tour.price + combo.totalPrice;
        const comboPrice = tour.price + combo.discountedPrice;
        const savingAmount = combo.totalPrice - combo.discountedPrice;

        return (
          <ComboTourCard
            key={tour.id}
            image={`/images/${tour.image}`}
            category={tour.categories.name}
            title={tour.name}
            duration={tour.duration}
            description={tour.description}
            originalPrice={originalPrice}
            comboPrice={comboPrice}
            savingAmount={savingAmount}
            comboName={combo.name}
            includedServices={combo.services}
            href={`/detail/${tour.id}?preselectServices=${combo.services.map((s: any) => s.id).join(",")}`}
          />
        );
      })}
    </ListSlider>
  );
}
