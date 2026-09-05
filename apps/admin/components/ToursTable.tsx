"use client";

import { useState } from "react";
import Link from "next/link";
import DeleteTourButton from "./DeleteTourButton";
import TourImage from "./TourImage";
import SearchBar from "./ui/SearchBar";

export type Category = {
  id: number;
  name: string;
  introduce: string;
};

export type Transport = {
  id: number;
  name: string;
};

export type Tour = {
  id: number;
  name: string;
  price: number;
  status: string;
  duration: string;
  categories: Category;
  description: string;
  image: string;
  transports: Transport;
};

export default function ToursTable({ tours }: { tours: Tour[] }) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTours = tours.filter((tour) => {
    const query = searchQuery.toLowerCase();
    const catName = tour.categories?.name || "";
    const transName = tour.transports?.name || "";
    return (
      tour.name.toLowerCase().includes(query) ||
      String(tour.price).includes(query) ||
      tour.duration.toLowerCase().includes(query) ||
      catName.toLowerCase().includes(query) ||
      transName.toLowerCase().includes(query) ||
      tour.description?.toLowerCase().includes(query) ||
      (tour.status || "").toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex items-center justify-between gap-4">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Tìm theo tên tour, giá, thời gian, danh mục, phương tiện..."
        />
        <span className="text-xs text-gray-500 font-medium whitespace-nowrap">
          Hiển thị {filteredTours.length} / {tours.length} tour
        </span>
      </div>

      {filteredTours.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center rounded-xl border border-gray-200 bg-white">
          <p className="text-sm font-semibold text-gray-800">Không tìm thấy tour du lịch</p>
          <p className="text-xs text-gray-500 mt-1">
            Không có kết quả nào khớp với từ khóa "{searchQuery}"
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-left text-xs divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 font-medium uppercase tracking-wider text-gray-500 w-20">
                  Hình ảnh
                </th>
                <th className="px-4 py-3 font-medium uppercase tracking-wider text-gray-500 max-w-[180px]">
                  Tên tour
                </th>
                <th className="px-4 py-3 font-medium uppercase tracking-wider text-gray-500 whitespace-nowrap">
                  Giá bán
                </th>
                <th className="px-4 py-3 font-medium uppercase tracking-wider text-gray-500 whitespace-nowrap">
                  Trạng thái
                </th>
                <th className="px-4 py-3 font-medium uppercase tracking-wider text-gray-500 whitespace-nowrap">
                  Thời gian
                </th>
                <th className="px-4 py-3 font-medium uppercase tracking-wider text-gray-500 whitespace-nowrap">
                  Danh mục
                </th>
                <th className="px-4 py-3 font-medium uppercase tracking-wider text-gray-500 max-w-[160px]">
                  Mô tả
                </th>
                <th className="px-4 py-3 font-medium uppercase tracking-wider text-gray-500 whitespace-nowrap">
                  Phương tiện
                </th>
                <th className="px-4 py-3 text-right font-medium uppercase tracking-wider text-gray-500 whitespace-nowrap">
                  Thao tác
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 bg-white">
              {filteredTours.map((item: Tour) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-2.5">
                    <TourImage src={item.image} alt={item.name} />
                  </td>
                  <td className="px-4 py-2.5 font-semibold text-gray-900 max-w-[180px]">
                    <div className="line-clamp-2" title={item.name}>
                      {item.name}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-2.5 font-semibold text-gray-900">
                    {Number(item.price).toLocaleString("vi-VN")}₫
                  </td>
                  <td className="whitespace-nowrap px-4 py-2.5">
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
                      {item.status || "ACTIVE"}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-2.5 text-gray-600">
                    {item.duration}
                  </td>

                  <td className="whitespace-nowrap px-4 py-2.5">
                    {item.categories ? (
                      <span className="inline-block rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 border border-blue-100">
                        {item.categories.name}
                      </span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>

                  <td className="max-w-[160px] px-4 py-2.5 text-gray-500">
                    <p className="line-clamp-2" title={item.description}>
                      {item.description}
                    </p>
                  </td>
                  <td className="whitespace-nowrap px-4 py-2.5">
                    {item.transports ? (
                      <span className="inline-block rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
                        {item.transports.name}
                      </span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        href={`/tours/update?id=${item.id}`}
                        className="rounded-md border border-gray-300 px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Sửa
                      </Link>
                      <DeleteTourButton tourId={item.id} tourName={item.name} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
