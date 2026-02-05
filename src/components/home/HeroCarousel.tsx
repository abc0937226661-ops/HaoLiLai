"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, ArrowRight, Gamepad2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroSlide {
    id: number;
    title: string;
    subtitle: string | null;
    imageUrl: string;
    buttons: string | null; // JSON string
    textAlign: string | null;
    bgPosition: string | null;
    titleColor: string | null;
    titleSize: string | null;
    subtitleColor: string | null;
    imageOffsetX: number | null;
    imageOffsetY: number | null;
    imageScale: number | null;
    order: number;
    isActive: boolean;
}

interface HeroCarouselProps {
    data: HeroSlide[];
}

export function HeroCarousel({ data }: HeroCarouselProps) {
    const [current, setCurrent] = useState(0);

    // Auto-play
    useEffect(() => {
        if (data.length === 0) return;
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % data.length);
        }, 6000);
        return () => clearInterval(timer);
    }, [data.length]);

    const prev = () => setCurrent((curr) => (curr === 0 ? data.length - 1 : curr - 1));
    const next = () => setCurrent((curr) => (curr + 1) % data.length);

    if (!data || data.length === 0) {
        return (
            <div className="relative h-[600px] w-full overflow-hidden bg-slate-950 flex items-center justify-center text-slate-500">
                目前無輪播圖，請至後台新增。
            </div>
        );
    }

    return (
        <div className="relative h-[600px] w-full overflow-hidden bg-slate-950">
            {data.map((slide, index) => (
                <div
                    key={slide.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ${index === current ? "opacity-100" : "opacity-0 pointer-events-none"
                        }`}
                >
                    {/* Background Image Container */}
                    <div
                        className={cn(
                            "h-full w-full bg-cover transition-transform duration-[2000ms] overflow-hidden relative",
                            index === current ? "opacity-100" : "opacity-0 pointer-events-none"
                        )}
                    >
                        {/* Actual Scaled/Panned Image */}
                        <div
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-out"
                            style={{
                                backgroundImage: `url('${slide.imageUrl}')`,
                                transform: `scale(${slide.imageScale}) translate(${slide.imageOffsetX}px, ${slide.imageOffsetY}px)`
                            }}
                        />
                    </div>

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900/50 to-slate-950/90" />

                    {/* Content */}
                    <div className={cn(
                        "absolute inset-0 flex items-center",
                        slide.textAlign === 'center' ? 'justify-center text-center' :
                            slide.textAlign === 'right' ? 'justify-end text-right' : 'justify-start text-left'
                    )}>
                        <div className="container mx-auto px-4">
                            <div className={cn(
                                "max-w-2xl space-y-6",
                                slide.textAlign === 'center' ? 'mx-auto items-center' :
                                    slide.textAlign === 'right' ? 'ml-auto items-end' : 'mr-auto items-start',
                                "flex flex-col" // Ensure flex column for alignment
                            )}>
                                {/* Badge */}
                                <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-3 py-1 text-sm font-medium text-amber-500 backdrop-blur-sm border border-amber-500/20">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                                    </span>
                                    本月主打
                                </div>

                                <h1
                                    className={cn(
                                        "font-black tracking-tight leading-tight drop-shadow-2xl",
                                        slide.titleSize
                                    )}
                                    style={{ color: slide.titleColor }}
                                >
                                    {slide.title}
                                </h1>

                                <p
                                    className="text-xl font-light shadow-black drop-shadow-md"
                                    style={{ color: slide.subtitleColor }}
                                >
                                    {slide.subtitle}
                                </p>

                                <div className={cn(
                                    "flex flex-wrap gap-4 pt-4",
                                    slide.textAlign === 'center' ? 'justify-center' :
                                        slide.textAlign === 'right' ? 'justify-end' : 'justify-start'
                                )}>
                                    {/* Buttons Render Logic */}
                                    {slide.buttons && Array.isArray(slide.buttons) && slide.buttons.map((btn: any, idx: number) => {
                                        if (!btn.show) return null;
                                        if (btn.color === 'amber') {
                                            return (
                                                <Link key={idx} href={btn.link || '#'} className="group relative flex items-center gap-2 overflow-hidden rounded-full bg-white px-8 py-3 text-base font-bold text-slate-900 transition-all hover:scale-105 hover:bg-amber-400">
                                                    <span className="relative z-10">{btn.text}</span>
                                                    <ArrowRight className="relative z-10 w-4 h-4 transition-transform group-hover:translate-x-1" />
                                                </Link>
                                            );
                                        } else {
                                            return (
                                                <Link key={idx} href={btn.link || '#'} className="flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-8 py-3 text-base font-bold text-white backdrop-blur-sm transition-all hover:scale-105 hover:bg-white/10">
                                                    <Gamepad2 className="w-4 h-4" />
                                                    {btn.text}
                                                </Link>
                                            );
                                        }
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {/* Navigation Indicators */}
            <div className="absolute bottom-8 left-0 right-0 z-20">
                <div className="container mx-auto flex justify-center gap-3 px-4">
                    {data.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrent(i)}
                            className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? "w-12 bg-amber-500" : "w-2 bg-slate-700 hover:bg-slate-500"
                                }`}
                        />
                    ))}
                </div>
            </div>

            {/* Navigation Arrows */}
            <button
                onClick={prev}
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/20 p-3 text-white/50 backdrop-blur-sm transition-all hover:bg-amber-500 hover:text-white md:left-8"
            >
                <ChevronLeft className="h-6 w-6" />
            </button>
            <button
                onClick={next}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/20 p-3 text-white/50 backdrop-blur-sm transition-all hover:bg-amber-500 hover:text-white md:right-8"
            >
                <ChevronRight className="h-6 w-6" />
            </button>
        </div>
    );
}
