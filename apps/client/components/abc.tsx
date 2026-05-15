import { ChevronDown } from "lucide-react";
export default function Dropdown() {
  return (
    <div className="grid grid-cols-2 gap-0  bg-surface max-w-2xl mx-auto   ">
      <div className="group/1 relative">
        <div className="flex items-center justify-between  p-2  gap-1 cursor-pointer rounded-xl transition-all duration-300 hover:shadow-md  hover:bg-zinc-200/10">
          <span className="text-sm font-normal text-zinc-400 group-hover/1:text-primary tracking-tight">
            Du lịch trong nước
          </span>
          <ChevronDown className="w-4 h-4 text-gray-400 transition-transform duration-300 group-hover/1:rotate-180 group-hover/1:text-blue-500" />
        </div>

        <div className="absolute top-full  left-0  w-48 bg-surface   shadow-xl   rounded-b-xl opacity-0 invisible  transition-all duration-300 group-hover/1:opacity-100 group-hover/1:visible  z-50 overflow-hidden">
          <div className="p-2">
            {["Miền Bắc", "Miền Trung", "Miền Nam"].map((region) => (
              <a
                key={region}
                href="#"
                className="block p-2  text-sm text-primary hover:bg-zinc-400/20 rounded-xl transition-colors duration-100"
              >
                {region}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="group relative">
        <div className="flex items-center justify-between  p-2  gap-1 cursor-pointer rounded-xl transition-all duration-300 hover:shadow-md  hover:bg-zinc-200/10">
          <span className="text-sm font-normal text-zinc-400 group-hover:text-primary tracking-tight">
            Du lịch nước ngoài
          </span>
          <ChevronDown className="w-4 h-4 text-gray-400 transition-transform duration-300 group-hover:rotate-180 group-hover:text-blue-500" />
        </div>

        <div className="absolute top-full left-0 w-48 bg-surface  rounded-b-xl shadow-xl  opacity-0 invisible  transition-all duration-300 group-hover:opacity-100 group-hover:visible  z-50 overflow-hidden">
          <div className="p-2">
            {[
              { label: "Đông Nam Á", hot: true },
              { label: "Châu Âu", hot: false },
              { label: "Châu Á", hot: false },
            ].map((item) => (
              <a
                key={item.label}
                href="#"
                className="block p-2  text-sm text-primary hover:bg-zinc-400/20 rounded-xl transition-colors duration-100"
              >
                {item.label}
                {/* {item.hot && (
                  <span className="text-[10px] bg-red-100 text-red-500 px-1.5 py-0.5 rounded font-bold uppercase group-hover:bg-white/20 group-hover:text-white">
                    Hot
                  </span> */}
                {/* )} */}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
