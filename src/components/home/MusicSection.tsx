import { getActiveVideos } from "@/actions/youtube-actions";
import YouTubePlayer from "./YouTubePlayer";

export default async function MusicSection() {
    const videos = await getActiveVideos();

    if (videos.length === 0) return null;

    return (
        <section className="py-20 px-4 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
            <div className="container mx-auto max-w-6xl">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-3 px-6 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full mb-4">
                        <svg className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                        </svg>
                        <span className="text-amber-400 font-bold text-sm">MUSIC ZONE</span>
                    </div>
                    <h2 className="text-4xl font-bold text-white mb-3 bg-gradient-to-r from-white via-amber-200 to-white bg-clip-text text-transparent">
                        音樂專區
                    </h2>
                    <p className="text-slate-400 text-lg">享受遊戲的同時，聆聽美妙音樂</p>
                </div>
                <YouTubePlayer videos={videos} />
            </div>
        </section>
    );
}
