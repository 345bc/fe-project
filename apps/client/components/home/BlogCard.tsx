"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface BlogCardProps {
  title: string;
  image: string;
  date: string;
  category: string;
  description: string;
  href: string;
}

const BlogCard = ({
  href,
  title,
  image,
  date,
  category,
  description,
}: BlogCardProps) => {
  return (
    <div className=" group relative h-[290px] w-full rounded-xl overflow-hidden cursor-pointer shadow-sm">
      <Link href={href} className="flex flex-col items-center w-full h-full">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        <div className="absolute top-2 right-2 bg-ghostwhite textprimary px-2.5 py-1 rounded-md text-xs font-semibold z-20 ">
          {date}
        </div>

        <div className="absolute bottom-2   backdrop-blur-xs  w-[90%] rounded-2xl  p-4 z-20 flex flex-col justify-end  group-hover:bg-surface-dark/70  ">
          <div className="flex items-center gap-1 text-sm   tracking-wide text-surface rounded-lg  max-w-full  font-normal mb-2 ">
            <span className="material-symbols-outlined text-surface  ">
              Label
            </span>
            {category}
          </div>

          <h3 className=" font-semibold tracking-tight text-xl leading-normal text-bright-white text-balance line-clamp-2 transition-transform duration-300 min-h-[3.2em]">
            {title}
          </h3>

          <div className="text-white  leading-relaxed max-h-0  overflow-hidden transition-all duration-300 group-hover:max-h-24 group-hover:opacity-100 group-hover:mt-2">
            <p className="  line-clamp-3 text-sm font-normal tracking-wide leading-normal min-h-[4.8em] italic">
              {description}
            </p>
          </div>

          <div className="text-white text-sm font-normal max-h-0 overflow-hidden group-hover:max-h-[2em]  tracking-tight  mt-2 flex items-center   transition-all duration-300 ml-auto">
            Đọc ngay
            <span className="material-symbols-outlined ">chevron_right</span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default BlogCard;
