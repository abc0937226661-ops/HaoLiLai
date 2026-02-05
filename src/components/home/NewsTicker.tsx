"use client";

import { Megaphone } from "lucide-react";

interface NewsTickerProps {
    data: any[];
}

export function NewsTicker({ data }: NewsTickerProps) {
    return (
        <div className="flex h-12 items-center overflow-hidden bg-slate-900 border-b border-white/5">
            <div className="container mx-auto px-4 flex items-center">
                <div className="flex items-center gap-2 pr-4 text-amber-500 font-bold shrink-0 z-10 bg-slate-900">
                    <Megaphone className="w-5 h-5" />
                    <span>最新公告</span>
                </div>

                {/* Simple scrolling text animation */}
                <div className="flex-1 overflow-hidden relative">
                    <div className="animate-marquee whitespace-nowrap text-sm text-slate-300">
                        {data.map((item, i) => (
                            <span key={item.id} className="mx-8">{item.title}</span>
                        ))}
                        {data.length === 0 && <span className="mx-8">暫無最新公告...</span>}
                    </div>
                </div>
            </div>
        </div>
    );
}
