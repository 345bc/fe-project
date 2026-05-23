"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
import destinationService from "@/services/destination-service";
import tourService from "@/services/tour-service";

// Map các pattern và service tương ứng
const patternHandlers: Record<
  string,
  { handler: (id: number) => Promise<string>; pattern: RegExp }
> = {
  destination: {
    pattern: /^\/destination\/(\d+)$/,
    handler: async (id) => {
      const dest = await destinationService.getDestinationById(id);
      return dest?.name || `Điểm đến ${id}`;
    },
  },
  tour: {
    pattern: /^\/tour\/(\d+)$/,
    handler: async (id) => {
      const tour = await tourService.getTourById(id);
      return tour?.name || `Tour ${id}`;
    },
  },
};

export default function Breadcrumb() {
  const pathname = usePathname();
  const [dynamicNames, setDynamicNames] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  // Lấy tên động cho các segment là số
  useEffect(() => {
    const fetchDynamicNames = async () => {
      setLoading(true);
      const names: Record<string, string> = {};

      const pathSegments = pathname.split("/").filter((s) => s !== "");

      for (let i = 0; i < pathSegments.length; i++) {
        const segment = pathSegments[i];
        if (!segment) continue;
        if (/^\d+$/.test(segment)) {
          const id = parseInt(segment);
          const fullPath = "/" + pathSegments.slice(0, i + 1).join("/");

          // Kiểm tra xem path có match pattern nào không
          let found = false;
          for (const [key, { pattern, handler }] of Object.entries(
            patternHandlers,
          )) {
            if (pattern.test(fullPath)) {
              try {
                const name = await handler(id);
                names[fullPath] = name;
                found = true;
                break;
              } catch (error) {
                console.error(`Failed to fetch ${key}:`, error);
              }
            }
          }

          if (!found) {
            names[fullPath] = `ID: ${id}`;
          }
        }
      }

      setDynamicNames(names);
      setLoading(false);
    };

    fetchDynamicNames();
  }, [pathname]);

  const pathSegments = pathname.split("/").filter((segment) => segment !== "");

  const breadcrumbs: { label: string; href: string; isCurrent?: boolean }[] = [
    { label: "Trang chủ", href: "/", isCurrent: pathname === "/" },
  ];

  let currentPath = "";
  for (let i = 0; i < pathSegments.length; i++) {
    const segment = pathSegments[i];
    if (!segment) continue;
    currentPath += `/${segment}`;

    let label = segment;

    // Nếu segment là số, lấy từ dynamicNames
    if (/^\d+$/.test(segment)) {
      label = dynamicNames[currentPath] || `Đang tải...`;
      if (loading && !dynamicNames[currentPath]) {
        label = "...";
      }
    } else {
      // Chuyển slug thành label đẹp
      label = segment
        .replace(/-/g, " ")
        .replace(/_/g, " ")
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    }

    breadcrumbs.push({
      label,
      href: currentPath,
      isCurrent: i === pathSegments.length - 1,
    });
  }

  if (loading && breadcrumbs.some((b) => b.label === "...")) {
    return (
      <nav className="flex items-center gap-2 text-sm">
        <div className="animate-pulse flex gap-1">
          <div className="h-4 w-16 bg-gray-200 rounded"></div>
          <div className="h-4 w-4 bg-gray-200 rounded"></div>
          <div className="h-4 w-20 bg-gray-200 rounded"></div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="flex items-center gap-2 text-sm" aria-label="Breadcrumb">
      <ol className="flex items-center flex-wrap gap-1">
        {breadcrumbs.map((item, index) => (
          <Fragment key={item.href}>
            <li>
              {item.isCurrent ? (
                <span className="text-surface font-bold text-sm tracking-tight">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="text-surface font-bold  text-sm tracking-tight hover:underline hover:text-blue-400 transition-colors duration-100"
                >
                  {item.label}
                </Link>
              )}
            </li>
            {index < breadcrumbs.length - 1 && (
              <li className="text-surface text-sm select-none">/</li>
            )}
          </Fragment>
        ))}
      </ol>
    </nav>
  );
}
