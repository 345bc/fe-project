import Image from "next/image";
import Link from "next/link";
import React from "react";

interface TourCardProps {
  image: string; // Tương ứng item.anhmota
  title: string; // Tương ứng item.TenTour
  category: string; // Tương ứng item.DanhMuc.TenDM
  duration: string; // Tương ứng item.ThoiGian
  description: string; // Tương ứng item.mota
  price: number;
  href: string;
}

const TourCard = ({
  image,
  title,
  category,
  duration,
  description,
  price,
  href,
}: TourCardProps) => {
  return (
    <div className="group flex flex-col items-center z-50 relative rounded-2xl overflow-hidden  shadow-lg">
      <div className="relative h-[250px] w-full overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="group-hover:scale-105 transition-all duration-500 "
        />
      </div>

      <div className="bg-ghostwhite w-full flex items-center  h-[250px] "></div>
      <div className="p-5 flex flex-col flex-1 w-[95%] bg-surface rounded-2xl absolute bottom-2">
        <div className="flex justify-between items-center mb-3 text-text-secondary  font-semibold font-sans tracking-tight text-base">
          <small className="flex items-center gap-1 whitespace-nowrap truncate max-w-[50%] shrink-0">
            <span className="material-symbols-outlined shrink-0">sell</span>
            <span className="truncate">{category}</span>
          </small>
          <small className="flex items-center gap-1 whitespace-nowrap truncate max-w-[50%] shrink-0">
            <span className="material-symbols-outlined shrink-0">schedule</span>
            <span className="truncate">{duration}</span>
          </small>
        </div>

        <h5 className="font-semibold tracking-tight text-xl  mb-2  leading-normal group-hover:text-primary transition-colors duration-300 line-clamp-2 min-h-[2.4em]">
          {title}
        </h5>

        <p className="font-normal tracking-wide text-balance  mb-2  text-sm leading-relaxed line-clamp-3 min-h-[4.8em]">
          {description}
        </p>

        <hr className="opacity-10 mt-auto" />

        <div className="flex items-center justify-between mt-2">
          <span className="text-primary text-xl font-extrabold">
            {price.toLocaleString("vi-VN")}đ
          </span>
          <Link
            href={href}
            className="bg-primary text-white px-5 py-2.5 rounded-full font-bold text-sm shadow-sm hover:bg-surface hover:shadow-md hover:text-surface-dark border border-transparent hover:border-primary transition-all active:scale-95"
          >
            Đặt ngay
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TourCard;
