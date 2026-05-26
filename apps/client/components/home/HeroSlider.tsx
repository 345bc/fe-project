"use client";

import React, { useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Autoplay,
  Pagination,
  Navigation,
  EffectCreative,
} from "swiper/modules";
import Image from "next/image";
import Link from "next/link";

// Import CSS Swiper
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-creative";

export interface SlideData {
  image: string;
  title: string;
  subtitle?: string;
  description?: string;
  buttonText?: string;
  href?: string;
}

interface SliderProps {
  images?: string[];
  slides?: SlideData[];
}

const defaultSlides: SlideData[] = [
  {
    image: "/images/slider-1-clean.jpg",
    title: "Bình Minh Vịnh Hạ Long",
    subtitle: "Du Lịch Cao Cấp",
    description: "Khám phá kỳ quan thiên nhiên thế giới với hàng ngàn hòn đảo đá vôi kỳ vĩ và làn nước xanh ngọc huyền ảo.",
    buttonText: "Bắt đầu hành trình",
    href: "/destination/1",
  },
  {
    image: "/images/slider-2-clean.jpg",
    title: "Khám Phá Tokyo Về Đêm",
    subtitle: "Trải Nghiệm Đô Thị",
    description: "Chiêm ngưỡng Tháp Tokyo rực rỡ và đắm mình vào nhịp sống hiện đại, công nghệ tương lai xen lẫn nét văn hóa truyền thống Nhật Bản.",
    buttonText: "Tìm hiểu thêm",
    href: "/destination/4",
  },
  {
    image: "/images/slider-3-clean.jpg",
    title: "Đà Lạt: Mùa Sương Mù",
    subtitle: "Nghỉ Dưỡng Lãng Mạn",
    description: "Tận hưởng không khí se lạnh, những đồi thông xanh ngắt và ly cafe ấm áp bên thung lũng sương mù mờ ảo.",
    buttonText: "Lên kế hoạch ngay",
    href: "/destination/3",
  },
];

export default function HeroSlider({ images, slides = defaultSlides }: SliderProps) {
  // Map images to slide data if provided as simple string paths
  const activeSlides = images && images.length > 0
    ? defaultSlides.map((slide, i) => ({
        ...slide,
        image: images[i] || slide.image,
      }))
    : slides;

  return (
    <div className="container-wide px-6 mt-12 md:mt-16 h-[320px] md:h-[420px] bg-gray-100 rounded-4xl overflow-hidden shadow-2xl relative">
      <Swiper
        grabCursor={true}
        effect={"creative"}
        creativeEffect={{
          prev: {
            shadow: true,
            translate: [0, 0, -400],
          },
          next: {
            translate: ["100%", 0, 0],
          },
        }}
        autoplay={{
          delay: 6000,
          disableOnInteraction: false,
        }}
        speed={800}
        loop={true}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation, EffectCreative]}
        className="mySwiper h-full w-full"
      >
        {activeSlides.map((slide, index) => (
          <SwiperSlide key={index} className="relative h-full w-full overflow-hidden">
            {/* Background Image */}
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 80vw"
              priority={index === 0}
            />

            {/* Gradient Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10" />

            {/* Text Overlay Content */}
            <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 z-20 text-white max-w-xl md:max-w-2xl select-none text-left">
              {slide.subtitle && (
                <span className="text-xs md:text-sm font-bold text-blue-400 tracking-widest uppercase mb-1.5 md:mb-2 block">
                  {slide.subtitle}
                </span>
              )}
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-black font-sans leading-tight mb-2 md:mb-4 tracking-tight drop-shadow-sm">
                {slide.title}
              </h2>
              {slide.description && (
                <p className="text-xs md:text-sm lg:text-base text-slate-200/90 leading-relaxed mb-4 md:mb-6 max-w-md md:max-w-lg hidden sm:block">
                  {slide.description}
                </p>
              )}
              {slide.buttonText && (
                <div>
                  <Link
                    href={slide.href || "/"}
                    className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 md:px-7 md:py-3.5 text-xs md:text-sm font-extrabold text-slate-900 shadow-md hover:bg-slate-100 hover:shadow-lg transition-all transform active:scale-95 duration-150 cursor-pointer"
                  >
                    <span>{slide.buttonText}</span>
                    <span className="material-symbols-outlined text-sm font-bold md:text-base">
                      arrow_forward
                    </span>
                  </Link>
                </div>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* global overrides for navigation buttons */}
      <style jsx global>{`
        .mySwiper .swiper-pagination-bullet-active {
          background: #007bef !important;
          width: 20px;
          border-radius: 4px;
        }
        .mySwiper .swiper-button-next,
        .mySwiper .swiper-button-prev {
          color: #fff;
          transform: scale(0.6);
          background: rgba(0, 0, 0, 0.2);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          backdrop-filter: blur(4px);
          transition: background 0.2s ease;
        }
        .mySwiper .swiper-button-next:hover,
        .mySwiper .swiper-button-prev:hover {
          background: rgba(0, 0, 0, 0.4);
        }
        .mySwiper .swiper-button-next:after,
        .mySwiper .swiper-button-prev:after {
          font-size: 18px;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
}
