"use client";

import { useState } from "react";
import Link from "next/link";
import DeleteCategoryButton from "./DeleteCategoryButton";
import SearchBar from "./ui/SearchBar";

export type Category = {
  id: number;
  name: string;
  introduce: string;
};

export default function CategoriesTable({
  categories,
}: {
  categories: Category[];
}) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = categories.filter((c) => {
    const query = searchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(query) ||
      c.introduce?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex items-center justify-between gap-4">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Tìm theo tên danh mục, mô tả..."
        />
        <span className="text-xs text-gray-500 font-medium whitespace-nowrap">
          Hiển thị {filteredCategories.length} / {categories.length} danh mục
        </span>
      </div>

      {filteredCategories.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center rounded-xl border border-gray-200 bg-white">
          <p className="text-sm font-semibold text-gray-800">Không tìm thấy danh mục</p>
          <p className="text-xs text-gray-500 mt-1">
            Không có kết quả nào khớp với từ khóa "{searchQuery}"
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-left text-xs divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 font-medium uppercase tracking-wider text-gray-500 w-1/4">
                  Tên danh mục
                </th>
                <th className="px-4 py-3 font-medium uppercase tracking-wider text-gray-500">
                  Mô tả
                </th>
                <th className="px-4 py-3 text-right font-medium uppercase tracking-wider text-gray-500 whitespace-nowrap">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {filteredCategories.map((c: Category) => (
                <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                  <td className="whitespace-nowrap px-4 py-3 font-semibold text-gray-900">
                    {c.name}
                  </td>
                  <td className="px-4 py-3 text-gray-600 max-w-[400px]">
                    <p className="line-clamp-2" title={c.introduce}>
                      {c.introduce || "—"}
                    </p>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        href={`/categories/update?id=${c.id}`}
                        className="rounded-md border border-gray-300 px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Sửa
                      </Link>
                      <DeleteCategoryButton
                        categoryId={c.id}
                        categoryName={c.name}
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
