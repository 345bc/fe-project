"use client";

import { useState, useEffect } from "react";

export default function TourImage({ src, alt }: { src?: string; alt: string }) {
  const getInitialUrl = (imagePath?: string) => {
    if (!imagePath) return "/images/demo_banner.jpg";
    if (imagePath.startsWith("http") || imagePath.startsWith("/")) {
      return imagePath;
    }
    return `/images/${imagePath}`;
  };

  const [imgSrc, setImgSrc] = useState<string>(getInitialUrl(src));

  useEffect(() => {
    setImgSrc(getInitialUrl(src));
  }, [src]);

  return (
    <div className="relative h-12 w-16 overflow-hidden rounded-lg bg-gray-100 border border-gray-200 shrink-0">
      <img
        src={imgSrc}
        alt={alt}
        className="h-full w-full object-cover"
        onError={() => setImgSrc("/images/demo_banner.jpg")}
      />
    </div>
  );
}
