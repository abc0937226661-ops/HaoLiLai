import { HeroCarousel } from "@/components/home/HeroCarousel";
import { NewsTicker } from "@/components/home/NewsTicker";
import { GameGrid } from "@/components/home/GameGrid";
import { InfoSection } from "@/components/home/InfoSection";
import MusicSection from "@/components/home/MusicSection";
import SocialMediaFloat from "@/components/home/SocialMediaFloat";
import { getPublicHeroSlides } from "@/actions/hero-actions";
import { getPublicGames } from "@/actions/game-actions";
import { getPublicNews } from "@/actions/news-actions";
import { getPublicEvents } from "@/actions/event-actions";

export const dynamic = "force-dynamic"; // Ensure fresh data

export default async function Home() {
  try {
    const heroSlides = await getPublicHeroSlides();
    const games = await getPublicGames();
    const news = await getPublicNews();
    const events = await getPublicEvents();

    return (
      <div className="flex flex-col min-h-screen bg-slate-950">
        <HeroCarousel data={heroSlides} />
        <NewsTicker data={news} />
        <InfoSection newsData={news} eventsData={events} />
        <MusicSection />

        {/* Main Content Area */}
        <main className="flex-1 bg-slate-950 pb-20">
          <GameGrid data={games} />
        </main>

        {/* Floating Social Media Buttons */}
        <SocialMediaFloat />
      </div>
    );
  } catch (error) {
    console.error("Homepage error:", error);
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">載入錯誤</h1>
          <p className="text-slate-400">請稍後再試或聯繫管理員</p>
          <p className="text-red-400 text-sm mt-2">{error instanceof Error ? error.message : '未知錯誤'}</p>
        </div>
      </div>
    );
  }
}
