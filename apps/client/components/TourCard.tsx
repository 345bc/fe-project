import Image from "next/image";
import Link from "next/link";
import React from "react";

interface TourCardProps {
  image: string; // Tương ứng item.anhmota
  title: string; // Tương ứng item.TenTour
  category: string; // Tương ứng item.DanhMuc.TenDM
  location: string; // Tương ứng item.DiaDiem.ThanhPho
  duration: string; // Tương ứng item.ThoiGian
  description: string; // Tương ứng item.mota
  price: string; // Tương ứng item.Gia
  id: string; // Tương ứng item.MaTour
}

const TourCard = ({
  image,
  title,
  category,
  location,
  duration,
  description,
  price,
  id,
}: TourCardProps) => {
  return (
    /* .packages-item & .package-card */
    <div className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border-0">
      {/* .package-img-wrapper */}
      <div className="relative h-[230px] w-full overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* .category-badge */}
        <div className="absolute top-[15px] left-[15px] bg-white/90 backdrop-blur-sm text-[#13357B] px-3 py-1.5 rounded-full text-[0.8rem] font-bold uppercase z-10 shadow-sm flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px]">sell</span>
          {category}
        </div>
      </div>

      {/* .card-body & d-flex flex-column */}
      <div className="p-5 flex flex-col flex-1">
        {/* .package-meta */}
        <div className="flex justify-between items-center mb-3 text-gray-500 text-[0.9rem]">
          <small className="flex items-center gap-1">
            <span className="material-symbols-outlined text-primary text-[16px]">
              location_on
            </span>
            {location}
          </small>
          <small className="flex items-center gap-1">
            <span className="material-symbols-outlined text-primary text-[16px]">
              schedule
            </span>
            {duration}
          </small>
        </div>

        {/* card-title */}
        <h5 className="text-[1.25rem] font-bold text-gray-900 mb-3 leading-tight group-hover:text-primary transition-colors line-clamp-2 min-h-[2.4em]">
          {title}
        </h5>

        {/* card-text & .text-clamp-3 */}
        <p className="text-gray-500 mb-4 text-[0.95rem] leading-[1.6] line-clamp-3 min-h-[4.8em]">
          {description}
        </p>

        <hr className="opacity-10 mt-auto" />

        {/* Footer (Giá + Nút) */}
        <div className="flex items-center justify-between mt-4">
          <div>
            <small className="text-gray-400 block text-[0.8rem]">
              Giá chỉ từ
            </small>
            <span className="text-[#13357B] text-[1.4rem] font-extrabold">
              {price} đ
            </span>
          </div>
          <Link
            href={`/tour/${id}`}
            className="bg-primary text-white px-5 py-2.5 rounded-full font-bold text-sm shadow-sm hover:bg-[var(--color-surface)] hover:shadow-md hover:text-[var(--color-surface-dark)] hover:border hover:border-[var(--color-primary)] transition-all active:scale-95"
          >
            Đặt ngay
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TourCard;
