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
    className="relative block  hover:scale-105 overflow-hidden h-[300px] md:h-[260px] rounded-4xl transition-all duration-300"
  >
    <Image
      src={image}
      alt={title}
      fill
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />

    <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />

    <div className="absolute inset-x-0 bottom-0 p-6 md:p-10 flex justify-center">
      <h3 className="text-white text-center font-bold tracking-tight  md:text-xl   leading-tight">
        {title}
      </h3>
    </div>
  </Link>
);

export default CategoryCard;
