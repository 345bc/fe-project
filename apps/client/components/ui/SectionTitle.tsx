import React from "react";

interface SectionTitleProps {
  title: string;
  description?: string;
  align: String;
}

const SectionTitle = ({ title, description, align }: SectionTitleProps) => {
  return (
    <div className="flex flex-col gap-4 py-8">
      <div className={`relative ${align} inline-block w-fit`}>
        <h2 className="text-[28px] md:text-[32px] font-bold text-[#005294] uppercase tracking-wide">
          {title}
        </h2>
        <div className={`${align} h-[3px] w-1/2 bg-[#005294] mt-2`}></div>
      </div>

      {description && (
        <p
          className={`text-gray-600 text-lg ${align} leading-relaxed max-w-4xl font-bold`}
        >
          {description}
        </p>
      )}
    </div>
  );
};

export default SectionTitle;
