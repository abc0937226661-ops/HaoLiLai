"use client";

import { useState, useEffect } from "react";
import { Link as LinkIcon } from "lucide-react";
import { getAllSocialLinks, updateSocialLink } from "@/actions/social-actions";

export default function SocialLinksSettings() {
    const [links, setLinks] = useState<any[]>([]);
    const [editingLink, setEditingLink] = useState<any | null>(null);

    useEffect(() => {
        loadLinks();
    }, []);

    const loadLinks = async () => {
        const data = await getAllSocialLinks();
        setLinks(data);
    };

    const handleSave = async (link: any) => {
        await updateSocialLink(link.id, {
            url: link.url,
            isActive: link.isActive,
        });
        setEditingLink(null);
        loadLinks();
    };

    const getPlatformIcon = (platform: string) => {
        switch (platform.toLowerCase()) {
            case 'facebook':
                return '📘';
            case 'line':
                return '💬';
            case 'instagram':
                return '📷';
            default:
                return '🔗';
        }
    };

    return (
        <div className="p-8">
            <div className="flex items-center gap-3 mb-8">
                <LinkIcon className="h-8 w-8 text-amber-400" />
                <h1 className="text-3xl font-bold text-white">社群媒體連結</h1>
            </div>

            <div className="grid gap-4 max-w-2xl">
                {links.map((link) => (
                    <div
                        key={link.id}
                        className="bg-slate-900 border border-slate-800 rounded-xl p-6"
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <span className="text-4xl">{getPlatformIcon(link.platform)}</span>
                            <div className="flex-1">
                                <h3 className="text-white font-bold text-lg capitalize">
                                    {link.platform}
                                </h3>
                                <p className="text-slate-500 text-sm">浮動按鈕連結</p>
                            </div>
                            <div className="flex items-center gap-2">
                                {link.isActive ? (
                                    <span className="px-3 py-1 bg-green-500/20 text-green-400 text-sm rounded-full">
                                        啟用
                                    </span>
                                ) : (
                                    <span className="px-3 py-1 bg-slate-700 text-slate-400 text-sm rounded-full">
                                        停用
                                    </span>
                                )}
                            </div>
                        </div>

                        {editingLink?.id === link.id ? (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">
                                        連結網址
                                    </label>
                                    <input
                                        type="url"
                                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white"
                                        value={editingLink.url}
                                        onChange={(e) =>
                                            setEditingLink({ ...editingLink, url: e.target.value })
                                        }
                                        placeholder="https://..."
                                    />
                                </div>

                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id={`active-${link.id}`}
                                        checked={editingLink.isActive}
                                        onChange={(e) =>
                                            setEditingLink({ ...editingLink, isActive: e.target.checked })
                                        }
                                        className="w-4 h-4 rounded border-slate-700"
                                    />
                                    <label htmlFor={`active-${link.id}`} className="text-sm text-slate-300">
                                        啟用此連結
                                    </label>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setEditingLink(null)}
                                        className="flex-1 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
                                    >
                                        取消
                                    </button>
                                    <button
                                        onClick={() => handleSave(editingLink)}
                                        className="flex-1 px-4 py-2 bg-amber-500 text-black font-bold rounded-lg hover:bg-amber-600 transition-colors"
                                    >
                                        儲存
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-slate-500 text-sm">網址:</span>
                                    <a
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-amber-400 hover:text-amber-500 text-sm truncate"
                                    >
                                        {link.url}
                                    </a>
                                </div>
                                <button
                                    onClick={() => setEditingLink(link)}
                                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    編輯連結
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
