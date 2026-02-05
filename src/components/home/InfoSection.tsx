"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Megaphone, Calendar, Gift, ChevronRight } from "lucide-react";

interface InfoSectionProps {
    newsData: any[];
    eventsData?: any[];
}

export function InfoSection({ newsData, eventsData = [] }: InfoSectionProps) {
    const [activeTab, setActiveTab] = useState<"all" | "system" | "activity">("all");

    const filteredNews = newsData.filter(
        (item) => activeTab === "all" || item.type === activeTab || (activeTab === "activity" && item.type === "winner")
    );

    return (
        <section className="py-16 bg-slate-900 border-b border-white/5">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Left Column: Permanent Events (5 columns) */}
                    <div className="lg:col-span-5 space-y-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                <Gift className="text-amber-500" />
                                常駐活動
                            </h2>
                        </div>

                        <div className="grid gap-6">
                            {eventsData && eventsData.length > 0 ? (
                                eventsData.map((event) => (
                                    <Link
                                        key={event.id}
                                        href={event.link || '#'}
                                        className="group relative block overflow-hidden rounded-2xl border border-slate-700 shadow-xl transition-all hover:scale-[1.02] hover:shadow-amber-500/10 hover:border-amber-500/50"
                                    >
                                        <div className="aspect-[21/9] w-full relative bg-slate-950 overflow-hidden">
                                            {/* Dynamic Image with Transforms */}
                                            <div
                                                className="absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                                                style={{
                                                    backgroundImage: `url('${event.imageUrl}')`,
                                                    transform: `scale(${event.imageScale || 1}) translate(${event.imageOffsetX || 0}px, ${event.imageOffsetY || 0}px)`,
                                                    backgroundPosition: event.bgPosition || 'center'
                                                }}
                                            />

                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />

                                            {/* Dynamic Text Positioning & Styling */}
                                            <div className={`absolute inset-0 flex flex-col p-6 ${event.textAlign === 'center' ? 'items-center justify-center text-center' :
                                                event.textAlign === 'right' ? 'items-end justify-end text-right' : 'items-start justify-end text-left'
                                                }`}>
                                                <h3
                                                    className="font-bold group-hover:text-amber-400 transition-colors drop-shadow-lg"
                                                    style={{
                                                        color: event.titleColor || '#ffffff',
                                                        fontSize: event.titleSize === 'text-3xl' ? '1.875rem' :
                                                            event.titleSize === 'text-2xl' ? '1.5rem' :
                                                                event.titleSize === 'text-xl' ? '1.25rem' : '2.25rem'
                                                    }}
                                                >
                                                    {event.title}
                                                </h3>
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <div className="p-8 text-center border border-dashed border-slate-700 rounded-xl text-slate-500">
                                    尚無活動
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: News Board (7 columns) */}
                    <div className="lg:col-span-7">
                        <div className="flex items-center justify-between mb-6 border-b border-slate-700 pb-2">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                <Megaphone className="text-amber-500" />
                                公告專區
                            </h2>
                            <div className="flex gap-2">
                                {(["all", "system", "activity"] as const).map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={cn(
                                            "px-4 py-1.5 rounded-full text-sm font-medium transition-all",
                                            activeTab === tab
                                                ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20"
                                                : "bg-slate-800 text-slate-400 hover:text-white"
                                        )}
                                    >
                                        {tab === "all" ? "全部" : tab === "system" ? "系統" : "活動"}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="bg-slate-950/50 rounded-2xl border border-slate-800 p-2">
                            <ul className="divide-y divide-slate-800">
                                {filteredNews.slice(0, 8).map((item) => (
                                    <Link
                                        key={item.id}
                                        href={`/news/${item.id}`}
                                        className="group flex items-center gap-4 p-4 hover:bg-slate-800/50 rounded-xl transition-colors cursor-pointer block"
                                    >
                                        <span className={cn(
                                            "px-2 py-0.5 text-xs font-bold rounded border",
                                            item.type === "system" ? "border-blue-500 text-blue-400" :
                                                item.type === "activity" ? "border-amber-500 text-amber-400" :
                                                    "border-green-500 text-green-400"
                                        )}>
                                            {item.type === "system" ? "系統" : item.type === "activity" ? "活動" : "賀報"}
                                        </span>
                                        <span className="flex-1 text-slate-200 group-hover:text-amber-400 transition-colors line-clamp-1">
                                            {item.title}
                                        </span>
                                        <span className="text-sm text-slate-500 font-mono">
                                            {item.date}
                                        </span>
                                    </Link>
                                ))}

                                {/* Empty state or fill */}
                                {filteredNews.length === 0 && (
                                    <div className="p-8 text-center text-slate-500">
                                        目前沒有相關公告
                                    </div>
                                )}
                            </ul>

                            <div className="p-4 flex justify-end">
                                <Link href="/news" className="text-sm text-slate-400 hover:text-amber-400 flex items-center gap-1 transition-colors">
                                    查看所有公告 <ChevronRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </section>
    );
}
