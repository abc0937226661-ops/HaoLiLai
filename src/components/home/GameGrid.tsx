"use client";

import Link from "next/link";
import { ArrowRight, Flame } from "lucide-react";

interface GameProps {
    data: any[];
}

export function GameGrid({ data }: GameProps) {
    return (
        <section className="py-20 bg-slate-950">
            <div className="container mx-auto px-4">
                <div className="mb-12 flex items-end justify-between">
                    <h2 className="text-3xl font-black text-white md:text-4xl">
                        熱門遊戲
                        <span className="ml-3 text-lg font-medium text-amber-500">POPULAR GAMES</span>
                    </h2>
                    <Link href="/games" className="group flex items-center text-slate-400 hover:text-white">
                        查看更多 <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>

                <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                    {data.map((game) => (
                        <Link key={game.id} href={`/games/${game.id}`} className="group relative block aspect-[3/4] overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 transition-all hover:scale-[1.02] hover:shadow-2xl hover:shadow-amber-500/10 hover:border-amber-500/50">
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                                style={{ backgroundImage: `url('${game.imageUrl}')` }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 transition-opacity group-hover:opacity-90" />

                            <div className="absolute inset-x-0 bottom-0 p-6 translate-y-2 transition-transform duration-300 group-hover:translate-y-0">
                                <div className="mb-2 flex items-center justify-between">
                                    <span className="inline-block rounded bg-amber-500/20 px-2 py-1 text-xs font-bold text-amber-500 backdrop-blur-md">
                                        {game.category}
                                    </span>
                                    {game.isHot && (
                                        <span className="flex items-center text-xs font-bold text-red-500">
                                            <Flame className="mr-1 h-3 w-3 fill-current" /> HOT
                                        </span>
                                    )}
                                </div>
                                <h3 className="text-xl font-bold text-white group-hover:text-amber-500 transition-colors">
                                    {game.name}
                                </h3>
                            </div>
                        </Link>
                    ))}

                    {data.length === 0 && (
                        <div className="col-span-full py-12 text-center text-slate-500">
                            目前沒有熱門遊戲，請至後台新增。
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
