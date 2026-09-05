"use client";

import { useState } from "react";
import Link from "next/link";
import DeleteDiscountButton from "./DeleteDiscountButton";
import SearchBar from "./ui/SearchBar";

export type Discount = {
  id: number;
  code: string;
  name: string;
  discountValue: number;
  startDate: string;
  endDate: string;
  maxUsage: number | null;
  usedCount: number;
  status: string;
};

export default function DiscountsTable({
  discounts,
}: {
  discounts: Discount[];
}) {
  const [searchQuery, setSearchQuery] = useState("");

  const statusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-700";
      case "EXPIRED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const filteredDiscounts = discounts.filter((d) => {
    const query = searchQuery.toLowerCase();
    return (
      d.code.toLowerCase().includes(query) ||
      d.name.toLowerCase().includes(query) ||
      String(d.discountValue).includes(query) ||
      (d.status || "").toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex items-center justify-between gap-4">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Tìm theo mã giảm giá, tên, giá trị, trạng thái..."
        />
        <span className="text-xs text-gray-500 font-medium whitespace-nowrap">
          Hiển thị {filteredDiscounts.length} / {discounts.length} mã giảm giá
        </span>
      </div>

      {filteredDiscounts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center rounded-xl border border-gray-200 bg-white">
          <p className="text-sm font-semibold text-gray-800">Không tìm thấy mã giảm giá</p>
          <p className="text-xs text-gray-500 mt-1">
            Không có kết quả nào khớp với từ khóa "{searchQuery}"
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-left text-xs divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 font-medium uppercase tracking-wider text-gray-500 whitespace-nowrap">
                  Mã
                </th>
                <th className="px-4 py-3 font-medium uppercase tracking-wider text-gray-500">
                  Tên khuyến mãi
                </th>
                <th className="px-4 py-3 font-medium uppercase tracking-wider text-gray-500 whitespace-nowrap">
                  Giá trị
                </th>
                <th className="px-4 py-3 font-medium uppercase tracking-wider text-gray-500 whitespace-nowrap">
                  Đã dùng
                </th>
                <th className="px-4 py-3 font-medium uppercase tracking-wider text-gray-500 whitespace-nowrap">
                  Trạng thái
                </th>
                <th className="px-4 py-3 text-right font-medium uppercase tracking-wider text-gray-500 whitespace-nowrap">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {filteredDiscounts.map((d: Discount) => (
                <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                  <td className="whitespace-nowrap px-4 py-3 font-mono font-semibold text-gray-900">
                    {d.code}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-700 font-medium">
                    {d.name}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-semibold text-gray-900">
                    {Number(d.discountValue).toLocaleString("vi-VN")}₫
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-600">
                    {d.usedCount}
                    {d.maxUsage ? ` / ${d.maxUsage}` : ""}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor(
                        d.status
                      )}`}
                    >
                      {d.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        href={`/discounts/update?id=${d.id}`}
                        className="rounded-md border border-gray-300 px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Sửa
                      </Link>
                      <DeleteDiscountButton
                        discountId={d.id}
                        discountName={d.name}
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
