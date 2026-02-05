import { getPublicNews } from "@/actions/news-actions";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function NewsDetailPage({ params }: { params: { id: string } }) {
    const allNews = await getPublicNews();
    const newsItem = allNews.find((n: any) => n.id === parseInt(params.id));

    if (!newsItem) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-slate-950 pt-24 pb-16">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-bold border ${newsItem.type === 'system' ? 'border-blue-500 text-blue-400 bg-blue-500/10' :
                            newsItem.type === 'activity' ? 'border-amber-500 text-amber-400 bg-amber-500/10' :
                                'border-green-500 text-green-400 bg-green-500/10'
                            }`}>
                            {newsItem.type === 'system' ? '系統' : newsItem.type === 'activity' ? '活動' : '賀報'}
                        </span>
                        <span className="text-slate-500 font-mono text-sm">{newsItem.date}</span>
                        {newsItem.isImportant && (
                            <span className="px-2 py-0.5 bg-red-600 text-white text-xs rounded font-bold">置頂</span>
                        )}
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-2">{newsItem.title}</h1>
                </div>

                {/* Content */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-6">
                    {/* Image */}
                    {newsItem.imageUrl && (
                        <div className="rounded-xl overflow-hidden border border-slate-800">
                            <img
                                src={newsItem.imageUrl}
                                alt={newsItem.title}
                                className="w-full h-auto object-cover"
                            />
                        </div>
                    )}

                    {/* Text Content */}
                    <div className="prose prose-invert prose-slate max-w-none">
                        <div className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                            {newsItem.content || '此公告暫無詳細內容。'}
                        </div>
                    </div>

                    {/* External Link */}
                    {newsItem.link && (
                        <div className="pt-4 border-t border-slate-800">
                            <a
                                href={newsItem.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 text-black font-bold rounded-lg hover:bg-amber-600 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                                查看更多詳情
                            </a>
                        </div>
                    )}
                </div>

                {/* Back Button */}
                <div className="mt-8">
                    <a
                        href="/#news"
                        className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        返回公告列表
                    </a>
                </div>
            </div>
        </div>
    );
}
