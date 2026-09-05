"use client";

import { useState } from "react";
import Link from "next/link";
import DeleteDestinationButton from "./DeleteDestinationButton";
import TourImage from "./TourImage";
import SearchBar from "./ui/SearchBar";

export type Destination = {
  id: number;
  name: string;
  image: string;
  introduce: string;
};

export default function DestinationsTable({
  destinations,
}: {
  destinations: Destination[];
}) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDestinations = destinations.filter((item) => {
    const query = searchQuery.toLowerCase();
    return (
      item.name.toLowerCase().includes(query) ||
      item.introduce?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex items-center justify-between gap-4">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Tìm theo tên điểm đến, mô tả giới thiệu..."
        />
        <span className="text-xs text-gray-500 font-medium whitespace-nowrap">
          Hiển thị {filteredDestinations.length} / {destinations.length} điểm đến
        </span>
      </div>

      {filteredDestinations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center rounded-xl border border-gray-200 bg-white">
          <p className="text-sm font-semibold text-gray-800">Không tìm thấy điểm đến</p>
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
                  Tên điểm đến
                </th>
                <th className="px-4 py-3 font-medium uppercase tracking-wider text-gray-500">
                  Mô tả / Giới thiệu
                </th>
                <th className="px-4 py-3 text-right font-medium uppercase tracking-wider text-gray-500 whitespace-nowrap">
                  Thao tác
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 bg-white">
              {filteredDestinations.map((item: Destination) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-2.5">
                    <TourImage src={item.image} alt={item.name} />
                  </td>
                  <td className="px-4 py-2.5 font-semibold text-gray-900 max-w-[180px]">
                    <div className="line-clamp-2" title={item.name}>
                      {item.name}
                    </div>
                  </td>

                  <td className="px-4 py-2.5 text-gray-600 max-w-md">
                    <p className="line-clamp-2" title={item.introduce}>
                      {item.introduce}
                    </p>
                  </td>

                  <td className="whitespace-nowrap px-4 py-2.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        href={`/destinations/update?id=${item.id}`}
                        className="rounded-md border border-gray-300 px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Sửa
                      </Link>
                      <DeleteDestinationButton
                        destinationId={item.id}
                        destinationName={item.name}
                      />
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
