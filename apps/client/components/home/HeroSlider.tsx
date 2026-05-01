"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Autoplay,
  Pagination,
  Navigation,
  EffectCreative,
} from "swiper/modules";

import Image from "next/image";

// Import CSS Swiper
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-creative";

interface SliderProps {
  images?: string[];
}
const imagesilder = [
  "/images/demo.png",
  "/images/demo.png",
  "/images/demo.png",
];

export default function HeroSlider({ images = imagesilder }: SliderProps) {
  return (
    <div className="container-wide px-6 mt-12 md:mt-16 h-[300px] md:h-[400px] bg-gray-100 rounded-4xl overflow-hidden shadow-2xl">
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
        {images.map((src, index) => (
          <SwiperSlide key={index} className="relative">
            <Image
              src={src}
              alt={`Slide ${index + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 80vw"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* CSS giữ nguyên */}
      <style jsx global>{`
        .mySwiper .swiper-pagination-bullet-active {
          background: #000 !important;
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
