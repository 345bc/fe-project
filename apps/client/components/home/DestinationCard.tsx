"use client";
import Image from "next/image";
import React from "react";

// 1. Component con: DestinationCard
interface DestinationCardProps {
  image: string;
  title: string;
  className?: string;
}

const DestinationCard = ({ image, title, className }: DestinationCardProps) => {
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl cursor-pointer w-full h-full min-h-[250px] ${className}`}
    >
      <Image
        src={image}
        alt={title}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover transition-transform duration-700 group-hover:scale-110"
      />
      {/* Overlay gradient tối nhẹ để chữ nổi bật */}
      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />

      {/* Title ở chính giữa */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <h3 className="text-white font-black text-xl md:text-2xl uppercase tracking-widest text-center drop-shadow-lg">
          {title}
        </h3>
      </div>
    </div>
  );
};

// 2. Component chính: DestinationGrid
export default function DestinationGrid() {
  // Mảng dữ liệu danh mục
  const destinations = [
    {
      title: "Quảng Ninh",
      image: "/images/quang-ninh.jpg",
      className: "md:col-span-2 md:row-span-2",
    },
    {
      title: "Hà Giang",
      image: "/images/ha-giang.jpg",
      className: "md:col-span-1 md:row-span-1",
    },
    {
      title: "Lào Cai",
      image: "/images/lao-cai.jpg",
      className: "md:col-span-2 md:row-span-1",
    },
    {
      title: "Sơn La",
      image: "/images/son-la.jpg",
      className: "md:col-span-1 md:row-span-2",
    },
    {
      title: "Ninh Bình",
      image: "/images/ninh-binh.jpg",
      className: "md:col-span-1 md:row-span-1",
    },
    {
      title: "Yên Bái",
      image: "/images/yen-bai.jpg",
      className: "md:col-span-2 md:row-span-1",
    },
    {
      title: "Cao Bằng",
      image: "/images/cao-bang.jpg",
      className: "md:col-span-2",
    },
    {
      title: "Hải Phòng",
      image: "/images/hai-phong.jpg",
      className: "md:col-span-2",
    },
    {
      title: "Hà Nội",
      image: "/images/ha-noi.jpg",
      className: "md:col-span-2",
    },
  ];

  return (
    <section className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4 auto-rows-[250px]">
      {destinations.map((dest, index) => (
        <DestinationCard
          key={index}
          title={dest.title}
          image={dest.image}
          className={dest.className}
        />
      ))}
    </section>
  );
}
