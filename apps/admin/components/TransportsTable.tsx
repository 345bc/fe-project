"use client";

import { useState } from "react";
import Link from "next/link";
import DeleteTransportButton from "./DeleteTransportButton";
import SearchBar from "./ui/SearchBar";

export type Transport = {
  id: number;
  name: string;
};

export default function TransportsTable({
  transports,
}: {
  transports: Transport[];
}) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTransports = transports.filter((t) => {
    const query = searchQuery.toLowerCase();
    return (
      t.name.toLowerCase().includes(query) ||
      t.id.toString().includes(query)
    );
  });

  return (
    <div className="space-y-4 max-w-3xl">
      {/* Search Bar */}
      <div className="flex items-center justify-between gap-4">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Tìm theo ID hoặc tên phương tiện..."
        />
        <span className="text-xs text-gray-500 font-medium whitespace-nowrap">
          Hiển thị {filteredTransports.length} / {transports.length} phương tiện
        </span>
      </div>

      {filteredTransports.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center rounded-xl border border-gray-200 bg-white">
          <p className="text-sm font-semibold text-gray-800">Không tìm thấy phương tiện</p>
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
                  ID
                </th>
                <th className="px-4 py-3 font-medium uppercase tracking-wider text-gray-500">
                  Tên phương tiện
                </th>
                <th className="px-4 py-3 text-right font-medium uppercase tracking-wider text-gray-500 whitespace-nowrap w-1/4">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {filteredTransports.map((t: Transport) => (
                <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                  <td className="whitespace-nowrap px-4 py-3 text-gray-600 font-mono">
                    #{t.id}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-semibold text-gray-900">
                    {t.name}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        href={`/transports/update?id=${t.id}`}
                        className="rounded-md border border-gray-300 px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Sửa
                      </Link>
                      <DeleteTransportButton
                        transportId={t.id}
                        transportName={t.name}
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
