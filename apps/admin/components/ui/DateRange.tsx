'use client';

import { useState } from 'react';
import { DateRangeInput } from '@astryxdesign/core/DateRangeInput';
import type { DateRange } from '@astryxdesign/core/DateRangeInput';
import type { ISODateString } from '@astryxdesign/core/Calendar';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

function daysAgo(n: number): ISODateString {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return d.toISOString().slice(0, 10) as ISODateString;
}

function today(): ISODateString {
    return new Date().toISOString().slice(0, 10) as ISODateString;
}

const presets = [
    { label: 'Last 7 days', getRange: () => ({ start: daysAgo(7), end: today() }) },
    { label: 'Last 30 days', getRange: () => ({ start: daysAgo(30), end: today() }) },
    { label: 'Last 90 days', getRange: () => ({ start: daysAgo(90), end: today() }) },
];

export default function DateRangeInputWithPresets() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [range, setRange] = useState<DateRange | null>(null);

    const handleRangeChange = (newRange: DateRange | null) => {
        setRange(newRange);
        if (newRange?.start && newRange?.end) {
            const start = new Date(newRange.start);
            const end = new Date(newRange.end);
            const diffTime = Math.abs(end.getTime() - start.getTime());
            const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24)) || 30;

            const param = new URLSearchParams(searchParams.toString());
            param.set("period", String(diffDays));
            router.push(`${pathname}?${param.toString()}`);
        } else if (!newRange) {
            const param = new URLSearchParams(searchParams.toString());
            param.delete("period");
            const newQuery = param.toString();
            router.push(newQuery ? `${pathname}?${newQuery}` : pathname);
        }
    };

    return (
        <DateRangeInput
            label=""
            placeholder="Select date range"
            value={range}
            onChange={handleRangeChange}
            presets={presets}
        />
    );
}
