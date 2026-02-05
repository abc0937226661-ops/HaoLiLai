"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Save, X, Settings } from "lucide-react";
import {
    createFooterSection,
    updateFooterSection,
    deleteFooterSection,
    createFooterLink,
    updateFooterLink,
    deleteFooterLink,
    updateFooterConfig
} from "@/actions/footer-actions";

export default function FooterAdminPage({ initialSections, initialLinks, initialConfig }: any) {
    const [sections, setSections] = useState(initialSections);
    const [links, setLinks] = useState(initialLinks);
    const [config, setConfig] = useState(initialConfig);
    const [editingSection, setEditingSection] = useState<any>(null);
    const [editingLink, setEditingLink] = useState<any>(null);
    const [editingConfig, setEditingConfig] = useState(false);

    const handleCreateSection = () => {
        setEditingSection({
            sectionTitle: '新分類',
            order: sections.length + 1,
            isActive: true,
        });
    };

    const handleCreateLink = (sectionId: number) => {
        setEditingLink({
            sectionId,
            text: '新連結',
            link: '/',
            order: links.filter((l: any) => l.sectionId === sectionId).length + 1,
            isActive: true,
        });
    };

    const handleDeleteSection = async (id: number) => {
        if (!confirm("確定要刪除此分類嗎？此操作會同時刪除該分類下的所有連結。")) return;
        await deleteFooterSection(id);
        window.location.reload();
    };

    const handleDeleteLink = async (id: number) => {
        if (!confirm("確定要刪除此連結嗎？")) return;
        await deleteFooterLink(id);
        window.location.reload();
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">頁尾管理 (Footer)</h1>
                    <p className="text-slate-400 mt-1">管理網站底部的分類、連結和設定。</p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={() => setEditingConfig(true)} variant="outline" className="border-slate-700">
                        <Settings className="mr-2 h-4 w-4" /> 全域設定
                    </Button>
                    <Button onClick={handleCreateSection} className="bg-amber-500 text-black hover:bg-amber-600">
                        <Plus className="mr-2 h-4 w-4" /> 新增分類
                    </Button>
                </div>
            </div>

            {/* Sections and Links */}
            <div className="space-y-6">
                {sections.map((section: any) => {
                    const sectionLinks = links.filter((l: any) => l.sectionId === section.id);
                    return (
                        <div key={section.id} className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <h3 className="text-xl font-bold text-white">{section.sectionTitle}</h3>
                                    <span className={`text-xs px-2 py-1 rounded ${section.isActive ? 'bg-green-500/20 text-green-400' : 'bg-slate-700 text-slate-500'}`}>
                                        {section.isActive ? '啟用' : '隱藏'}
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    <Button type="button" size="sm" variant="ghost" onClick={() => handleCreateLink(section.id)}>
                                        <Plus className="h-4 w-4 mr-1" /> 新增連結
                                    </Button>
                                    <Button type="button" size="sm" variant="ghost" onClick={() => setEditingSection(section)}>
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button type="button" size="sm" variant="ghost" className="hover:text-red-400" onClick={() => handleDeleteSection(section.id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                {sectionLinks.length === 0 ? (
                                    <p className="text-slate-500 text-sm">此分類尚無連結</p>
                                ) : (
                                    sectionLinks.map((link: any) => (
                                        <div key={link.id} className="flex items-center justify-between bg-slate-950 border border-slate-800 rounded p-3">
                                            <div className="flex-1">
                                                <span className="text-white font-medium">{link.text}</span>
                                                <span className="text-slate-500 text-sm ml-3 font-mono">{link.link}</span>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button type="button" size="sm" variant="ghost" onClick={() => setEditingLink(link)}>
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button type="button" size="sm" variant="ghost" className="hover:text-red-400" onClick={() => handleDeleteLink(link.id)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Section Editor Modal */}
            {editingSection && (
                <SectionEditor section={editingSection} onClose={() => setEditingSection(null)} />
            )}

            {/* Link Editor Modal */}
            {editingLink && (
                <LinkEditor link={editingLink} sections={sections} onClose={() => setEditingLink(null)} />
            )}

            {/* Config Editor Modal */}
            {editingConfig && (
                <ConfigEditor config={config} onClose={() => setEditingConfig(false)} />
            )}
        </div>
    );
}

function SectionEditor({ section, onClose }: any) {
    const [formData, setFormData] = useState(section);
    const isNew = !section.id;

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isNew) {
                await createFooterSection(formData);
            } else {
                await updateFooterSection(section.id, formData);
            }
            window.location.href = window.location.pathname + '?t=' + Date.now();
        } catch (error) {
            alert("儲存失敗");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-xl shadow-2xl">
                <div className="flex items-center justify-between p-4 border-b border-slate-800">
                    <h3 className="text-lg font-bold text-white">{isNew ? '新增分類' : '編輯分類'}</h3>
                    <Button variant="ghost" size="sm" onClick={onClose}><X className="h-4 w-4" /></Button>
                </div>

                <form onSubmit={handleSave} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">分類名稱</label>
                        <input
                            type="text"
                            required
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                            value={formData.sectionTitle}
                            onChange={(e) => setFormData({ ...formData, sectionTitle: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">排序權重</label>
                        <input
                            type="number"
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                            value={formData.order}
                            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="isActive"
                            checked={formData.isActive}
                            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                            className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-amber-500"
                        />
                        <label htmlFor="isActive" className="text-sm text-white">啟用顯示</label>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                        <Button type="button" variant="ghost" onClick={onClose}>取消</Button>
                        <Button type="submit" className="bg-amber-500 text-black hover:bg-amber-600">
                            <Save className="h-4 w-4 mr-2" /> 儲存
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function LinkEditor({ link, sections, onClose }: any) {
    const [formData, setFormData] = useState(link);
    const isNew = !link.id;

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isNew) {
                await createFooterLink(formData);
            } else {
                await updateFooterLink(link.id, formData);
            }
            window.location.href = window.location.pathname + '?t=' + Date.now();
        } catch (error) {
            alert("儲存失敗");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-xl shadow-2xl">
                <div className="flex items-center justify-between p-4 border-b border-slate-800">
                    <h3 className="text-lg font-bold text-white">{isNew ? '新增連結' : '編輯連結'}</h3>
                    <Button variant="ghost" size="sm" onClick={onClose}><X className="h-4 w-4" /></Button>
                </div>

                <form onSubmit={handleSave} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">所屬分類</label>
                        <select
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                            value={formData.sectionId}
                            onChange={(e) => setFormData({ ...formData, sectionId: parseInt(e.target.value) })}
                        >
                            {sections.map((s: any) => (
                                <option key={s.id} value={s.id}>{s.sectionTitle}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">連結文字</label>
                        <input
                            type="text"
                            required
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                            value={formData.text}
                            onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">連結 URL</label>
                        <input
                            type="text"
                            required
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-sm"
                            value={formData.link}
                            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">排序權重</label>
                        <input
                            type="number"
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                            value={formData.order}
                            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="isActive"
                            checked={formData.isActive}
                            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                            className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-amber-500"
                        />
                        <label htmlFor="isActive" className="text-sm text-white">啟用顯示</label>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                        <Button type="button" variant="ghost" onClick={onClose}>取消</Button>
                        <Button type="submit" className="bg-amber-500 text-black hover:bg-amber-600">
                            <Save className="h-4 w-4 mr-2" /> 儲存
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function ConfigEditor({ config, onClose }: any) {
    const [formData, setFormData] = useState(
        config.reduce((acc: any, item: any) => {
            acc[item.key] = item.value;
            return acc;
        }, {})
    );

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            for (const [key, value] of Object.entries(formData)) {
                await updateFooterConfig(key, value as string);
            }
            window.location.href = window.location.pathname + '?t=' + Date.now();
        } catch (error) {
            alert("儲存失敗");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-xl shadow-2xl">
                <div className="flex items-center justify-between p-4 border-b border-slate-800">
                    <h3 className="text-lg font-bold text-white">全域設定</h3>
                    <Button variant="ghost" size="sm" onClick={onClose}><X className="h-4 w-4" /></Button>
                </div>

                <form onSubmit={handleSave} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Logo 文字</label>
                        <input
                            type="text"
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                            value={formData.logo_text || ''}
                            onChange={(e) => setFormData({ ...formData, logo_text: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">描述文字</label>
                        <textarea
                            rows={3}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                            value={formData.description || ''}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">版權文字</label>
                        <input
                            type="text"
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                            value={formData.copyright || ''}
                            onChange={(e) => setFormData({ ...formData, copyright: e.target.value })}
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                        <Button type="button" variant="ghost" onClick={onClose}>取消</Button>
                        <Button type="submit" className="bg-amber-500 text-black hover:bg-amber-600">
                            <Save className="h-4 w-4 mr-2" /> 儲存
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
