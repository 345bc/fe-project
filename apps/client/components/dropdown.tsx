import React from "react";

interface Dropdownprops {
  column?: number;
  label?: string; // Tương ứng item.TenTour
  category?: string; // Tương ứng item.DanhMuc.TenDM
  duration?: string; // Tương ứng item.ThoiGian
  description?: string; // Tương ứng item.mota
  price?: number;
  href?: string;
}

const Dropdown = ({
  category = "Category",
  duration = "Duration",
  description = "Description",
  price = 0,
  href = "/",
}: Dropdownprops) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="group relative bg-white px-4 py-3 rounded-lg cursor-pointer hover:bg-gray-50">
        <div className="text-sm font-medium text-gray-600">
          Du lịch trong nước
        </div>
        <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border hidden group-hover:block z-50">
          <a href="#" className="block px-4 py-2 hover:bg-gray-100">
            Miền Bắc
          </a>
          <a href="#" className="block px-4 py-2 hover:bg-gray-100">
            Miền Trung
          </a>
          <a href="#" className="block px-4 py-2 hover:bg-gray-100">
            Miền Nam
          </a>
        </div>
      </div>

      <div className="group relative bg-white px-4 py-3 rounded-lg cursor-pointer hover:bg-gray-50">
        <div className="text-sm font-medium text-gray-600">
          Du lịch nước ngoài
        </div>
        <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border hidden group-hover:block z-50">
          <a href="#" className="block px-4 py-2 hover:bg-gray-100">
            Đông Nam Á
          </a>
          <a href="#" className="block px-4 py-2 hover:bg-gray-100">
            Châu Âu
          </a>
          <a href="#" className="block px-4 py-2 hover:bg-gray-100">
            Châu Á
          </a>
        </div>
      </div>
    </div>
  );
};

export default Dropdown;
