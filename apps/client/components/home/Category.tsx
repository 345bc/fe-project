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
    className="relative group block   overflow-hidden h-[300px] md:h-[260px] rounded-2xl "
  >
    <Image
      src={image}
      alt={title}
      fill
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      className="hover:scale-105 transition-all duration-300 "
    />

    <div className="translate-x-full  absolute  group-hover:-translate-x-1 rounded-lg    transition-transform duration-300 bg-ghostwhite right-2 top-2   overflow-hidden">
      <span className="text-base font-medium   tracking-tight   p-2 ">
        {title}
      </span>
    </div>
  </Link>
);

export default CategoryCard;
