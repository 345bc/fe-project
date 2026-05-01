"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface CategoryCardProps {
  image: string;
  title: string;
  href: string;
}

const CategoryCard = ({ image, title, href }: CategoryCardProps) => (
  <Link
    href={href}
    className="group relative block w-full h-[280px] md:h-[320px] overflow-hidden rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-500 transform-gpu"
  >
    {/* Image Layer */}
    <Image
      src={image}
      alt={title}
      fill
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      className="object-cover transition-transform duration-1000 group-hover:scale-110"
    />

    {/* Overlay Layer: Đậm dần về phía đáy để làm nổi bật văn bản trắng */}
    <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />

    {/* Content Layer */}
    <div className="absolute inset-x-0 bottom-0 p-6 md:p-10 flex justify-center">
      <h3 className="text-white text-center font-extrabold text-lg md:text-xl uppercase tracking-wider leading-tight">
        {title}
      </h3>
    </div>
  </Link>
);

export default CategoryCard;

// export default function CategoryCardSection() {
//   const categories = [
//     {
//       title: "Tour trải nghiệm cao cấp",
//       image: "/images/demo.png",
//       href: "/danh-muc/cao-cap",
//     },
//     {
//       title: "Kỳ nghỉ mùa hè Châu Âu",
//       image: "/images/demo.png",

//       href: "/danh-muc/chau-au",
//     },
//     {
//       title: "Du lịch thế hệ mới ESG & LEI",
//       image: "/images/demo.png",

//       href: "/danh-muc/ben-vung",
//     },
//   ];

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 md:px-0">
//       {categories.map((cat, index) => (
//         <CategoryCard
//           key={index}
//           title={cat.title}
//           image={cat.image}
//           href={cat.href}
//         />
//       ))}
//     </div>
//   );
// }
