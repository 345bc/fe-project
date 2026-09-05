"use client";

import { useState } from "react";
import Link from "next/link";
import DeleteBlogButton from "./DeleteBlogButton";
import SearchBar from "./ui/SearchBar";

export type Blog = {
  id: number;
  title: string;
  author: string;
  image: string;
  views: number;
  created_at: string;
  blogCategories: { id: number; name: string } | null;
};

export default function BlogsTable({ blogs }: { blogs: Blog[] }) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBlogs = blogs.filter((blog) => {
    const query = searchQuery.toLowerCase();
    const catName = blog.blogCategories?.name || "";
    return (
      blog.title.toLowerCase().includes(query) ||
      blog.author.toLowerCase().includes(query) ||
      catName.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex items-center justify-between gap-4">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Tìm theo tiêu đề bài viết, tác giả, danh mục..."
        />
        <span className="text-xs text-gray-500 font-medium whitespace-nowrap">
          Hiển thị {filteredBlogs.length} / {blogs.length} bài viết
        </span>
      </div>

      {filteredBlogs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center rounded-xl border border-gray-200 bg-white">
          <p className="text-sm font-semibold text-gray-800">Không tìm thấy bài viết</p>
          <p className="text-xs text-gray-500 mt-1">
            Không có kết quả nào khớp với từ khóa "{searchQuery}"
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-left text-xs divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 font-medium uppercase tracking-wider text-gray-500 max-w-[240px]">
                  Tiêu đề
                </th>
                <th className="px-4 py-3 font-medium uppercase tracking-wider text-gray-500 whitespace-nowrap">
                  Tác giả
                </th>
                <th className="px-4 py-3 font-medium uppercase tracking-wider text-gray-500 whitespace-nowrap">
                  Danh mục
                </th>
                <th className="px-4 py-3 font-medium uppercase tracking-wider text-gray-500 whitespace-nowrap">
                  Lượt xem
                </th>
                <th className="px-4 py-3 text-right font-medium uppercase tracking-wider text-gray-500 whitespace-nowrap">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {filteredBlogs.map((blog: Blog) => (
                <tr key={blog.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-semibold text-gray-900 max-w-[240px]">
                    <div className="line-clamp-2" title={blog.title}>
                      {blog.title}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-600">
                    {blog.author}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    {blog.blogCategories ? (
                      <span className="inline-block rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 border border-blue-100">
                        {blog.blogCategories.name}
                      </span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-600 font-medium">
                    {blog.views}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        href={`/blogs/update?id=${blog.id}`}
                        className="rounded-md border border-gray-300 px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Sửa
                      </Link>
                      <DeleteBlogButton blogId={blog.id} blogTitle={blog.title} />
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
