import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Sparkles, Check } from "lucide-react";

interface ComboTourCardProps {
  image: string;
  title: string;
  category: string;
  duration: string;
  description: string;
  originalPrice: number;
  comboPrice: number;
  savingAmount: number;
  comboName: string;
  includedServices: Array<{ id: number; name: string }>;
  href: string;
}

const ComboTourCard = ({
  image,
  title,
  category,
  duration,
  description,
  originalPrice,
  comboPrice,
  savingAmount,
  comboName,
  includedServices,
  href,
}: ComboTourCardProps) => {
  const [imgSrc, setImgSrc] = React.useState(image);

  React.useEffect(() => {
    setImgSrc(image);
  }, [image]);

  return (
    <div className="group flex flex-col items-center z-50 relative rounded-2xl overflow-hidden shadow-lg border border-slate-100/50 bg-white transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      {/* Gallery / Image container */}
      <div className="relative h-[200px] w-full overflow-hidden">
        <Image
          src={imgSrc || "/images/demo_banner.jpg"}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-all duration-500"
          onError={() => setImgSrc("/images/demo_banner.jpg")}
        />
        {/* Hot Combo Badge */}
        <div className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-extrabold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md flex items-center gap-1 animate-pulse">
          <Sparkles size={11} /> Combo Siêu Hot
        </div>
        {/* Saving amount badge */}
        <div className="absolute top-3 right-3 bg-red-600 text-white font-extrabold text-[10px] px-2.5 py-1 rounded-md shadow-md">
          Tiết kiệm {savingAmount.toLocaleString("vi-VN")}đ
        </div>
      </div>

      {/* Spacer to match layout height */}
      <div className="bg-ghostwhite w-full flex items-center h-[260px] "></div>
      
      {/* Content wrapper */}
      <div className="p-4 flex flex-col flex-1 w-[95%] bg-white rounded-2xl absolute bottom-2 shadow-sm border border-slate-50">
        <div className="flex justify-between items-center mb-2 text-text-secondary font-semibold font-sans tracking-tight text-xs">
          <small className="flex items-center gap-1 whitespace-nowrap truncate max-w-[50%] shrink-0">
            <span className="material-symbols-outlined shrink-0 text-[16px]">sell</span>
            <span className="truncate">{category}</span>
          </small>
          <small className="flex items-center gap-1 whitespace-nowrap truncate max-w-[50%] shrink-0">
            <span className="material-symbols-outlined shrink-0 text-[16px]">schedule</span>
            <span className="truncate">{duration}</span>
          </small>
        </div>

        {/* Tour Name */}
        <h5 className="font-bold tracking-tight text-slate-800 text-sm md:text-base mb-1.5 group-hover:text-primary transition-colors duration-300 line-clamp-2 h-[2.4em] leading-snug">
          {title}
        </h5>

        {/* Dynamic Combo name and list of included services */}
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-2.5 mb-2.5 space-y-1.5 text-[11px]">
          <div className="font-extrabold text-blue-600 uppercase tracking-wide truncate">{comboName}</div>
          <div className="flex flex-wrap gap-1">
            {includedServices.map((service, index) => (
              <span 
                key={service.id} 
                className="bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-md px-1.5 py-0.5 flex items-center gap-0.5 font-medium whitespace-nowrap"
              >
                <Check size={10} className="shrink-0" />
                {service.name}
              </span>
            ))}
          </div>
        </div>

        {/* Tour Description */}
        <p className="font-normal tracking-wide text-slate-500 mb-2.5 text-xs leading-relaxed line-clamp-2 min-h-[2.8em]">
          {description}
        </p>

        <hr className="opacity-10 mt-auto mb-2" />

        {/* Price layout */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 line-through leading-none mb-1">
              Giá gốc: {originalPrice.toLocaleString("vi-VN")}đ
            </span>
            <span className="text-primary text-base md:text-lg font-extrabold leading-none">
              {comboPrice.toLocaleString("vi-VN")}đ
            </span>
          </div>
          <Link
            href={href}
            className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-4 py-2.5 rounded-full font-bold text-xs shadow-sm hover:shadow-md transition-all active:scale-95"
          >
            Mua Combo
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ComboTourCard;
