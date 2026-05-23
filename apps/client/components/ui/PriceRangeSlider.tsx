import React, { useCallback, useEffect, useState, useRef } from "react";

interface PriceRangeSliderProps {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  step?: number;
}

export default function PriceRangeSlider({
  min,
  max,
  value,
  onChange,
  step = 100000,
}: PriceRangeSliderProps) {
  const [minVal, setMinVal] = useState(value[0]);
  const [maxVal, setMaxVal] = useState(value[1]);
  const minValRef = useRef(value[0]);
  const maxValRef = useRef(value[1]);
  const rangeRef = useRef<HTMLDivElement>(null);
  const [activeThumb, setActiveThumb] = useState<"min" | "max" | null>(null);

  // Calculate dynamic zIndex when idle or active
  const getZIndex = useCallback(
    (thumb: "min" | "max") => {
      if (activeThumb === thumb) return 51;
      const isPastMidpoint = minVal > (min + max) / 2;
      if (thumb === "min") {
        return isPastMidpoint ? 50 : 30;
      } else {
        return isPastMidpoint ? 30 : 50;
      }
    },
    [activeThumb, minVal, min, max]
  );

  // Convert value to percentage
  const getPercent = useCallback(
    (value: number) => {
      if (max === min) return 0;
      return Math.round(((value - min) / (max - min)) * 100);
    },
    [min, max]
  );

  // Update visual bar from left
  useEffect(() => {
    const minPercent = getPercent(minVal);
    const maxPercent = getPercent(maxValRef.current);

    if (rangeRef.current) {
      rangeRef.current.style.left = `${minPercent}%`;
      rangeRef.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [minVal, getPercent]);

  // Update visual bar from right
  useEffect(() => {
    const minPercent = getPercent(minValRef.current);
    const maxPercent = getPercent(maxVal);

    if (rangeRef.current) {
      rangeRef.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [maxVal, getPercent]);

  // Sync external value changes
  useEffect(() => {
    setMinVal(value[0]);
    setMaxVal(value[1]);
    minValRef.current = value[0];
    maxValRef.current = value[1];
  }, [value]);

  return (
    <div className="flex flex-col w-full py-2">
      {/* Track container */}
      <div className="relative w-full h-[3px] rounded-full bg-slate-200 mt-2 mb-4">
        {/* Highlighted active range */}
        <div
          ref={rangeRef}
          className="absolute h-full rounded-full bg-[#007bef]"
        />

        {/* Left Thumb range input */}
        <input
          type="range"
          min={min}
          max={max}
          value={minVal}
          step={step}
          onChange={(event) => {
            const val = Math.min(Number(event.target.value), maxVal - step);
            setMinVal(val);
            minValRef.current = val;
            onChange([val, maxVal]);
          }}
          onMouseDown={() => setActiveThumb("min")}
          onTouchStart={() => setActiveThumb("min")}
          onMouseUp={() => setActiveThumb(null)}
          onTouchEnd={() => setActiveThumb(null)}
          className="price-slider-thumb w-full absolute h-0 pointer-events-none appearance-none outline-none top-1/2 -translate-y-1/2 left-0"
          style={{
            zIndex: getZIndex("min"),
          }}
        />

        {/* Right Thumb range input */}
        <input
          type="range"
          min={min}
          max={max}
          value={maxVal}
          step={step}
          onChange={(event) => {
            const val = Math.max(Number(event.target.value), minVal + step);
            setMaxVal(val);
            maxValRef.current = val;
            onChange([minVal, val]);
          }}
          onMouseDown={() => setActiveThumb("max")}
          onTouchStart={() => setActiveThumb("max")}
          onMouseUp={() => setActiveThumb(null)}
          onTouchEnd={() => setActiveThumb(null)}
          className="price-slider-thumb w-full absolute h-0 pointer-events-none appearance-none outline-none top-1/2 -translate-y-1/2 left-0"
          style={{
            zIndex: getZIndex("max"),
          }}
        />
      </div>

      {/* Value label display */}
      <div className="flex items-center justify-between text-base font-medium text-slate-700">
        <span className="tracking-tight">{minVal.toLocaleString("en-US")}</span>
        <span className="tracking-tight">{maxVal.toLocaleString("en-US")}</span>
      </div>
    </div>
  );
}
