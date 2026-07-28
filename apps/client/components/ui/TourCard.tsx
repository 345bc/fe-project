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
  badgeText?: string;
}

const TourCard = ({
  image,
  title,
  category,
  duration,
  description,
  price,
  href,
  badgeText,
}: TourCardProps) => {
  const [imgSrc, setImgSrc] = React.useState(image);

  React.useEffect(() => {
    setImgSrc(image);
  }, [image]);

  return (
    <div className="group flex flex-col items-center z-50 relative rounded-2xl overflow-hidden shadow-lg">
      <div className="relative h-[180px] w-full overflow-hidden">
        <Image
          src={imgSrc || "/images/demo_banner.jpg"}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-all duration-500"
          onError={() => setImgSrc("/images/demo_banner.jpg")}
        />
        {badgeText && (
          <div className="absolute top-3 left-3 bg-red-600 text-white font-bold text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider shadow-md z-10 animate-pulse">
            {badgeText}
          </div>
        )}
      </div>

      <div className="bg-ghostwhite w-full flex items-center h-[210px] "></div>
      <div className="p-4 flex flex-col flex-1 w-[95%] bg-surface rounded-2xl absolute bottom-2">
        <div className="flex justify-between items-center mb-2.5 text-text-secondary font-semibold font-sans tracking-tight text-sm">
          <small className="flex items-center gap-1.5 whitespace-nowrap truncate max-w-[50%] shrink-0">
            <span className="material-symbols-outlined shrink-0 text-[18px]">sell</span>
            <span className="truncate">{category}</span>
          </small>
          <small className="flex items-center gap-1.5 whitespace-nowrap truncate max-w-[50%] shrink-0">
            <span className="material-symbols-outlined shrink-0 text-[18px]">schedule</span>
            <span className="truncate">{duration}</span>
          </small>
        </div>

        <h5 className="font-semibold tracking-tight text-base md:text-lg mb-1.5 group-hover:text-primary transition-colors duration-300 line-clamp-2 h-[2.4em] leading-snug">
          {title}
        </h5>

        <p className="font-normal tracking-wide text-balance mb-2 text-xs md:text-sm leading-relaxed line-clamp-2 min-h-[2.8em]">
          {description}
        </p>

        <hr className="opacity-10 mt-auto" />

        <div className="flex items-center justify-between mt-2">
          <span className="text-primary text-lg md:text-xl font-extrabold">
            {price.toLocaleString("vi-VN")}đ
          </span>
          <Link
            href={href}
            className="bg-primary text-white px-4 py-2 rounded-full font-bold text-xs md:text-sm shadow-sm hover:bg-surface hover:shadow-md hover:text-surface-dark border border-transparent hover:border-primary transition-all active:scale-95"
          >
            Đặt ngay
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TourCard;
