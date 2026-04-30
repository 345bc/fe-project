"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface BlogCardProps {
  id: number;
  title: string;
  image: string;
  date: string;
  category: string;
  description: string;
}

const BlogCard = ({
  id,
  title,
  image,
  date,
  category,
  description,
}: BlogCardProps) => {
  return (
    <div className="group relative h-[280px] w-full rounded-xl overflow-hidden cursor-pointer shadow-md bg-black">
      <Link href={`/blog/${id}`} className="block w-full h-full">
        {/* Ảnh nền với hiệu ứng Zoom và Opacity khi hover */}
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 opacity-90 group-hover:scale-110 group-hover:opacity-60"
        />

        {/* Lớp phủ Gradient đen từ dưới lên */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 z-10" />

        {/* Badge ngày tháng góc phải trên */}
        <div className="absolute top-[15px] right-[15px] bg-white/95 text-gray-800 px-2.5 py-1 rounded-md text-[0.75rem] font-bold z-20 shadow-sm">
          {date}
        </div>

        {/* Khối nội dung */}
        <div className="absolute bottom-0 left-0 w-full p-5 z-20 flex flex-col justify-end">
          {/* Danh mục (Category) */}
          <div className="text-[0.7rem] uppercase tracking-wider text-blue-400 font-bold mb-1 opacity-90">
            {category}
          </div>

          {/* Tiêu đề - Giới hạn 2 dòng */}
          <h3 className="text-white text-lg font-bold leading-tight drop-shadow-lg line-clamp-2 transition-transform duration-300 group-hover:-translate-y-1">
            {title}
          </h3>

          {/* Tóm tắt nội dung - Ẩn hiện khi hover */}
          <div className="text-white/85 text-[0.85rem] leading-relaxed max-h-0 opacity-0 overflow-hidden transition-all duration-500 group-hover:max-h-24 group-hover:opacity-100 group-hover:mt-2">
            <p className="line-clamp-3 italic">{description}</p>
          </div>

          {/* Nút Xem thêm */}
          <div className="text-white text-[0.8rem] font-semibold mt-2 flex items-center opacity-0 translate-y-2 transition-all duration-300 delay-100 group-hover:opacity-100 group-hover:translate-y-0">
            Đọc ngay{" "}
            <span className="material-symbols-outlined text-[12px] ml-1">
              chevron_right
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

import ListSlider from "../ui/ListSlider";

export default function BlogCardSection() {
  const blogData = [
    {
      id: 1,
      category: "Travel",
      date: "30/04",
      title: "Kỳ nghỉ lễ 30/4 rực rỡ tại thành phố biển Vũng Tàu",
      description:
        "Tận hưởng không khí sôi động và những bãi cát trắng trải dài trong dịp lễ lớn nhất năm...",
      image: "/images/demo.png",
    },
    {
      id: 2,
      category: "Food",
      date: "01/05",
      title: "Khám phá ẩm thực đường phố Sài Gòn về đêm",
      description:
        "Những món ăn nóng hổi, tiếng cười nói rôm rả tại các con phố sầm uất nhất...",
      image: "/images/demo.png",
    },
    {
      id: 3,
      category: "Culture",
      date: "02/05",
      title: "Nét đẹp truyền thống trong kiến trúc cổ Hội An",
      description:
        "Bước vào không gian hoài niệm với những bức tường vàng và đèn lồng đa sắc màu...",
      image: "/images/demo.png",
    },
  ];

  return (
    <>
      {/* Mobile View: Swipeable Slider */}
      <div className="block md:hidden">
        <ListSlider>
          {blogData.map((blog) => (
            <BlogCard key={blog.id} {...blog} />
          ))}
        </ListSlider>
      </div>

      {/* Desktop/Tablet View: Grid */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogData.map((blog) => (
          <BlogCard key={blog.id} {...blog} />
        ))}
      </div>
    </>
  );
}
