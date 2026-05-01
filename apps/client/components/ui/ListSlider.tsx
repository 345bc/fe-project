"use client";
import React, { useRef, useState, useEffect } from "react";

interface ListSliderProps {
  children: React.ReactNode;
}

const ListSlider = ({ children }: ListSliderProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  // Hàm kiểm tra trạng thái cuộn để ẩn/hiện nút
  const checkScrollLimits = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeft(scrollLeft > 10); // Hiện nút trái nếu đã cuộn qua 10px
      setShowRight(scrollLeft + clientWidth < scrollWidth - 10); // Hiện nút phải nếu chưa tới cuối
    }
  };

  // Hàm cuộn chính xác 1 card
  const scrollOneCard = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const firstCard = container.firstChild as HTMLElement;
      if (!firstCard) return;

      const cardWidth = firstCard.offsetWidth;
      const gap = 24; // Khoảng cách gap-6 (24px) bạn đã đặt
      const scrollAmount =
        direction === "left" ? -(cardWidth + gap) : cardWidth + gap;

      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const currentRef = scrollRef.current;
    if (currentRef) {
      currentRef.addEventListener("scroll", checkScrollLimits);
      // Kiểm tra lần đầu khi mount
      checkScrollLimits();
    }
    return () => currentRef?.removeEventListener("scroll", checkScrollLimits);
  }, []);

  return (
    <div className="relative group w-full">
      {/* Hide arrows on mobile, show on md and up */}
      <div
        className={`hidden md:block absolute left-0 top-1/2 -translate-y-1/2 z-20 transition-opacity duration-300 ${showLeft ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      >
        <button
          onClick={() => scrollOneCard("left")}
          className="btn-nav-slider w-14 h-14 -ml-7 shadow-lg"
          aria-label="Previous slide"
        >
          <span className="material-symbols-outlined text-4xl">
            chevron_left
          </span>
        </button>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 md:gap-6 flex-nowrap overflow-x-auto no-scrollbar snap-x-mandatory scroll-smooth pb-8 pt-4 -mt-4"
      >
        {React.Children.map(children, (child) => (
          /* Use flex-none and specific widths to prevent Flexbox layout shifts. 
             On mobile, use w-[85%] so the next card peeks in to encourage swiping. */
          <div className="flex-none h-full w-[85%] md:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] snap-start">
            {child}
          </div>
        ))}
      </div>

      <div
        className={`hidden md:block absolute right-0 top-1/2 -translate-y-1/2 z-20 transition-opacity duration-300 ${showRight ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      >
        <button
          onClick={() => scrollOneCard("right")}
          className="btn-nav-slider w-14 h-14 -mr-7 shadow-lg"
          aria-label="Next slide"
        >
          <span className="material-symbols-outlined text-4xl">
            chevron_right
          </span>
        </button>
      </div>
    </div>
  );
};

export default ListSlider;
