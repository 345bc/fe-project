"use client";

import { useState } from "react";
import Link from "next/link";
import DeleteBlogCategoryButton from "./DeleteBlogCategoryButton";
import SearchBar from "./ui/SearchBar";

export type BlogCategory = {
  id: number;
  name: string;
  slug: string;
  description: string;
};

export default function BlogCategoriesTable({
  categories,
}: {
  categories: BlogCategory[];
}) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = categories.filter((cat) => {
    const query = searchQuery.toLowerCase();
    return (
      cat.name.toLowerCase().includes(query) ||
      cat.slug.toLowerCase().includes(query) ||
      cat.description?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex items-center justify-between gap-4">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Tìm theo tên danh mục, slug, mô tả..."
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
                <th className="px-4 py-3 font-medium uppercase tracking-wider text-gray-500">
                  Tên danh mục
                </th>
                <th className="px-4 py-3 font-medium uppercase tracking-wider text-gray-500 whitespace-nowrap">
                  Slug
                </th>
                <th className="px-4 py-3 font-medium uppercase tracking-wider text-gray-500 max-w-[300px]">
                  Mô tả
                </th>
                <th className="px-4 py-3 text-right font-medium uppercase tracking-wider text-gray-500 whitespace-nowrap">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {filteredCategories.map((cat: BlogCategory) => (
                <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                  <td className="whitespace-nowrap px-4 py-3 font-semibold text-gray-900">
                    {cat.name}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-gray-600">
                    {cat.slug}
                  </td>
                  <td className="px-4 py-3 text-gray-600 max-w-[300px]">
                    <p className="line-clamp-2" title={cat.description}>
                      {cat.description || "—"}
                    </p>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        href={`/blog-categories/update?id=${cat.id}`}
                        className="rounded-md border border-gray-300 px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Sửa
                      </Link>
                      <DeleteBlogCategoryButton
                        categoryId={cat.id}
                        categoryName={cat.name}
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
