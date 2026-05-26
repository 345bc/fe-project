"use client";
import { useEffect, useState } from "react";
import ListSlider from "./ui/ListSlider";
import TourCard from "./ui/TourCard";
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

// const baseURL = "http://localhost:8080";
export default function TourSection() {
  const [tours, setTours] = useState<Tours[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTours = async () => {
      const data = await tourService.getTours();
      setTours(data);
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

  return (
    <ListSlider>
      {tours.map((tour) => (
        <TourCard
          key={tour.id}
          image={`/images/${tour.image}`}
          category={tour.categories.name}
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
