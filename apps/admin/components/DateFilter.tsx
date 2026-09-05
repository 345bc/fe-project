"use client"


import { usePathname, useRouter, useSearchParams } from "next/navigation";

const FILTER_OPTIONS = [
    { label: "7 ngày qua", value: "7" },
    { label: "30 ngày qua", value: "30" },
    { label: "90 ngày qua", value: "90" },
    { label: "365 ngày qua", value: "365" },
];

export default function DateFilter() {
    const pathname = usePathname();
    const router = useRouter();
    const searchparams = useSearchParams();

    const current = searchparams.get("period") || "30";

    const handSelectPeriod = (value: string) => {
        const param = new URLSearchParams(searchparams.toString());
        param.set("period", value);

        router.push(`${pathname}?${param.toString()}`);
    };
    return (
        <div className="relative inline-block">
            <select
                value={current}
                onChange={(e) => handSelectPeriod(e.target.value)}
                className="appearance-none bg-white/10 backdrop-blur-md px-4 py-2 pr-8 rounded-xl text-sm font-medium border border-white/10 text-white cursor-pointer hover:bg-white/20 transition-all focus:outline-none"
            >
                {FILTER_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value} className="bg-gray-800 text-white">
                        {opt.label}
                    </option>
                ))}
            </select>
            <span className="material-symbols-outlined text-lg absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-white/80">
                calendar_month
            </span>
        </div>
    );
}