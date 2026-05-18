"use client";
import { useEffect, useState } from "react";
import destinationService from "@/services/destination-service";
import Link from "next/link";

const baseURL = "http://localhost:8080";

export type Destinations = {
  id: number;
  name: string;
  image: string;
  introduce: string;
  destinationGroup: {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
  };
};

const domesticGroup = [
  { id: 6, name: "Miền bắc" },
  { id: 7, name: "Miền trung" },
  { id: 8, name: "Miền nam" },
];

const foreignGroup = [
  { id: 1, name: "Đông nam á" },
  { id: 2, name: "Châu á" },
  { id: 3, name: "Châu âu" },
  { id: 4, name: "Châu mỹ" },
  { id: 5, name: "Châu phi" },
];

const allGroups = [...domesticGroup, ...foreignGroup];

export default function Dropdown() {
  const [activeTab, setActiveTab] = useState("tab-first");
  const [destinationsByGroup, setDestinationsByGroup] = useState<
    Record<number, Destinations[]>
  >({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      const results = await Promise.all(
        allGroups.map((group) => destinationService.getDestinations(group.id)),
      );
      const map: Record<number, Destinations[]> = {};
      allGroups.forEach((group, index) => {
        map[group.id] = results[index];
      });
      setDestinationsByGroup(map);
      setLoading(false);
    };
    fetchAll();
  }, []);

  if (loading)
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    );

  return (
    <div className="flex flex-col items-start    bg-surface w-[20em] mr-auto h-64 ">
      <div className="group/1 relative">
        <div
          onClick={() => setActiveTab("tab-first")}
          className={`flex items-center justify-between   w-[20em]   p-4   transition-all duration-300 hover:shadow-md   ${activeTab === "tab-first" ? "bg-blue-400" : "bg-blue-100"}`}
        >
          <div
            className={`text-base font-normal  tracking-wide ${activeTab === "tab-first" ? "text-surface" : ""}   `}
          >
            Du lịch trong nước
          </div>
          <span className="material-symbols-outlined">Chevron_right</span>
        </div>

        {activeTab === "tab-first" && (
          <div className="absolute top-0 left-full flex flex-row justify-between h-64  w-[calc(100vw-20em)] bg-surface px-10  z-50 border">
            {domesticGroup.map((region) => (
              <div key={region.id} className="flex flex-col  ">
                <h4 className="text-base font-bold tracking-tight  py-4 text-text-primary   normal-case ">
                  {region.name}
                </h4>
                <div className="flex flex-col  normal-case items-start">
                  {(destinationsByGroup[region.id] ?? []).map((des) => (
                    <Link
                      key={des.id}
                      href={`/destination/${des.id}`}
                      className="text-xs text-text-secondary py-4  "
                    >
                      {des.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="group relative">
        <div
          onClick={() => setActiveTab("tab-second")}
          className={`flex items-center justify-between  p-4  w-[20em]   transition-all duration-300 hover:shadow-md   ${activeTab === "tab-second" ? "bg-blue-400" : "bg-blue-100"}`}
        >
          <div
            className={`text-base font-normal  tracking-wide ${activeTab === "tab-second" ? "text-surface" : ""}   `}
          >
            Du lịch nước ngoài
          </div>
          <span className="material-symbols-outlined">Chevron_right</span>
        </div>

        {activeTab === "tab-second" && (
          <div className="absolute top-0 -translate-y-14 left-full flex flex-row h-64 justify-between w-[calc(100vw-20em)] bg-surface px-10 z-50 border">
            {foreignGroup.map((region) => (
              <div key={region.id} className="flex flex-col">
                <h4 className="text-base font-bold tracking-tight py-4 text-text-primary normal-case">
                  {region.name}
                </h4>
                <div className="flex flex-col normal-case items-start">
                  {(destinationsByGroup[region.id] ?? []).map((des) => (
                    <Link
                      key={des.id}
                      href={`/destination/${des.id}`}
                      className="text-xs text-text-secondary py-4"
                    >
                      {des.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
