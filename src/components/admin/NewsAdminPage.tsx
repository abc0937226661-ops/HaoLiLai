"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Save, X, Megaphone } from "lucide-react";
import { createNews, updateNews, deleteNews } from "@/actions/news-actions";

export default function NewsAdminPage({ initialNews }: { initialNews: any[] }) {
    const [newsList, setNewsList] = useState(initialNews);
    const [isEditing, setIsEditing] = useState(false);
    const [currentNews, setCurrentNews] = useState<any>(null);

    const handleEdit = (news: any) => {
        setCurrentNews(news);
        setIsEditing(true);
    };

    const handleCreate = () => {
        const today = new Date();
        const dateString = `${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}`;

        setCurrentNews({
            title: "",
            content: "",
            type: "system",
            date: dateString,
            isImportant: false,
        });
        setIsEditing(true);
    };

    const closeEditor = () => {
        setIsEditing(false);
        setCurrentNews(null);
    };

    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'system': return '系統';
            case 'activity': return '活動';
            case 'winner': return '賀報';
            default: return type;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-white">公告與活動管理 (News)</h1>
                <Button onClick={handleCreate} className="bg-amber-500 text-black hover:bg-amber-600">
                    <Plus className="mr-2 h-4 w-4" /> 發布新公告
                </Button>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden">
                <table className="w-full text-left text-sm text-slate-400">
                    <thead className="bg-slate-950 text-slate-200 uppercase">
                        <tr>
                            <th className="px-6 py-4 font-bold w-24">日期</th>
                            <th className="px-6 py-4 font-bold w-24">類型</th>
                            <th className="px-6 py-4 font-bold">標題</th>
                            <th className="px-6 py-4 font-bold w-32">操作</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {initialNews.map((news) => (
                            <tr key={news.id} className="hover:bg-slate-800/50 transition-colors">
                                <td className="px-6 py-4 font-mono">
                                    {news.date}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold border ${news.type === 'system' ? 'border-blue-500 text-blue-400' : news.type === 'activity' ? 'border-amber-500 text-amber-400' : 'border-green-500 text-green-400'}`}>
                                        {getTypeLabel(news.type)}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="max-w-lg truncate font-medium text-white flex items-center gap-2">
                                        {news.title}
                                        {news.isImportant && <span className="text-xs bg-red-600 text-white px-1.5 rounded">置頂</span>}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-2">
                                        <Button type="button" size="sm" variant="ghost" className="h-8 w-8 p-0 text-slate-400 hover:text-white" onClick={() => handleEdit(news)}>
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <form action={async () => {
                                            if (!confirm("確定要刪除此公告嗎？")) return;
                                            await deleteNews(news.id);
                                        }}>
                                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-slate-400 hover:text-red-500">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isEditing && currentNews && (
                <NewsEditor
                    news={currentNews}
                    onClose={closeEditor}
                />
            )}
        </div>
    );
}

function NewsEditor({ news, onClose }: { news: any; onClose: () => void }) {
    const [formData, setFormData] = useState(news);
    const isNew = !news.id;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isNew) {
            await createNews(formData);
        } else {
            await updateNews(news.id, formData);
        }
        onClose();
        window.location.reload();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">{isNew ? '發布新公告' : '編輯公告'}</h2>
                    <Button variant="ghost" size="sm" onClick={onClose}><X className="h-5 w-5" /></Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex gap-4">
                        <div className="w-1/3">
                            <label className="block text-sm font-medium text-slate-400 mb-1">日期 (例如 02/05)</label>
                            <input
                                type="text"
                                required
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-slate-400 mb-1">公告類型</label>
                            <select
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            >
                                <option value="system">系統公告 (System)</option>
                                <option value="activity">活動消息 (Activity)</option>
                                <option value="winner">賀報/中獎 (Winner)</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">標題</label>
                        <input
                            type="text"
                            required
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">內容詳情</label>
                        <textarea
                            rows={5}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">公告圖片（選填）</label>
                        <div className="space-y-2">
                            {formData.imageUrl ? (
                                <div className="relative rounded-lg overflow-hidden border border-slate-700">
                                    <img src={formData.imageUrl} alt="Preview" className="w-full h-48 object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, imageUrl: '' })}
                                        className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-lg hover:bg-red-700"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            ) : (
                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-700 rounded-lg cursor-pointer hover:border-amber-500 transition-colors bg-slate-950">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <svg className="w-8 h-8 mb-2 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                        </svg>
                                        <p className="text-sm text-slate-500">點擊上傳圖片</p>
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                const reader = new FileReader();
                                                reader.onloadend = () => {
                                                    setFormData({ ...formData, imageUrl: reader.result as string });
                                                };
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                    />
                                </label>
                            )}
                        </div>
                        <p className="text-xs text-slate-500 mt-1">在公告詳細頁面顯示的圖片</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">外部連結（選填）</label>
                        <input
                            type="url"
                            placeholder="https://example.com"
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-sm"
                            value={formData.link || ''}
                            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                        />
                        <p className="text-xs text-slate-500 mt-1">相關活動或詳情的外部連結</p>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                        <input
                            type="checkbox"
                            id="isImportant"
                            checked={formData.isImportant}
                            onChange={(e) => setFormData({ ...formData, isImportant: e.target.checked })}
                            className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-red-500"
                        />
                        <label htmlFor="isImportant" className="text-sm text-white">設為重要/置頂 (Important)</label>
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <Button type="button" variant="ghost" onClick={onClose} className="text-slate-400">取消</Button>
                        <Button type="submit" className="bg-amber-500 text-black hover:bg-amber-600 font-bold">
                            <Save className="h-4 w-4 mr-2" />
                            {isNew ? '確認發布' : '儲存變更'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
