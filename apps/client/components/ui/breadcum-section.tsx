"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
import destinationService from "@/services/destination-service";

// Map các route cần xử lý đặc biệt
const routeHandlers: Record<string, (id: number) => Promise<string>> = {
  destination: (id) =>
    destinationService
      .getDestinationById(id)
      .then((d) => d?.name || `ID: ${id}`),
  // Thêm các route khác nếu cần
  // "tour": (id) => tourService.getTourById(id).then(t => t?.name || `ID: ${id}`),
};

export default function Breadcrumb() {
  const pathname = usePathname();
  const [dynamicName, setDynamicName] = useState<string | null>(null);

  useEffect(() => {
    const pathSegments = pathname.split("/").filter((s) => s !== "");
    const lastSegment = pathSegments[pathSegments.length - 1];
    const secondLastSegment = pathSegments[pathSegments.length - 2];

    // Kiểm tra xem có cần xử lý đặc biệt không
    if (
      secondLastSegment &&
      lastSegment &&
      routeHandlers[secondLastSegment] &&
      /^\d+$/.test(lastSegment)
    ) {
      const id = parseInt(lastSegment);
      routeHandlers[secondLastSegment](id).then(setDynamicName);
    } else {
      setDynamicName(null);
    }
  }, [pathname]);

  const pathSegments = pathname.split("/").filter((s) => s !== "");

  const breadcrumbs: { label: string; href: string; isCurrent?: boolean }[] = [
    { label: "Trang chủ", href: "/", isCurrent: pathname === "/" },
  ];

  let currentPath = "";
  for (let i = 0; i < pathSegments.length; i++) {
    const segment = pathSegments[i];
    if (!segment) continue;
    currentPath += `/${segment}`;

    let label = segment;

    // Nếu là số và có dynamic name
    if (/^\d+$/.test(segment) && dynamicName && i === pathSegments.length - 1) {
      label = dynamicName;
    } else {
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

  return (
    <nav className="flex items-center gap-2 text-sm" aria-label="Breadcrumb">
      <ol className="flex items-center flex-wrap gap-1">
        {breadcrumbs.map((item, index) => (
          <Fragment key={item.href}>
            <li>
              {item.isCurrent ? (
                <span className="text-gray-500 font-medium">{item.label}</span>
              ) : (
                <Link
                  href={item.href}
                  className="text-primary hover:underline transition"
                >
                  {item.label}
                </Link>
              )}
            </li>
            {index < breadcrumbs.length - 1 && (
              <li className="text-gray-400">/</li>
            )}
          </Fragment>
        ))}
      </ol>
    </nav>
  );
}
