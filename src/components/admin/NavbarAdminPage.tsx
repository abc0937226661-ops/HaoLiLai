"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Save, X, GripVertical, Check, Info } from "lucide-react";
import { createNavbarItem, updateNavbarItem, deleteNavbarItem } from "@/actions/navbar-actions";
import * as Icons from "lucide-react"; // For icon picker

export default function NavbarAdminPage({ initialItems }: { initialItems: any[] }) {
    const [items, setItems] = useState(initialItems);
    const [isEditing, setIsEditing] = useState(false);
    const [currentItem, setCurrentItem] = useState<any>(null);

    const handleEdit = (item: any) => {
        setCurrentItem(item);
        setIsEditing(true);
    };

    const handleCreate = () => {
        setCurrentItem({
            type: 'link',
            text: '新連結',
            link: '/',
            icon: '',
            order: items.length + 1,
            isActive: true,
        });
        setIsEditing(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm("確定要刪除嗎？")) return;
        await deleteNavbarItem(id);
        window.location.reload();
    };

    const closeEditor = () => {
        setIsEditing(false);
        setCurrentItem(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">導航列管理 (Navbar)</h1>
                    <p className="text-slate-400 mt-1">管理網站頂部的 Logo、選單連結和按鈕。</p>
                </div>
                <Button onClick={handleCreate} className="bg-amber-500 text-black hover:bg-amber-600">
                    <Plus className="mr-2 h-4 w-4" /> 新增項目
                </Button>
            </div>

            <div className="space-y-4">
                {/* Header Row */}
                <div className="grid grid-cols-12 gap-4 px-4 py-2 text-sm font-bold text-slate-500 uppercase border-b border-slate-800">
                    <div className="col-span-1">類型</div>
                    <div className="col-span-3">顯示文字</div>
                    <div className="col-span-4">連結</div>
                    <div className="col-span-2 text-center">狀態</div>
                    <div className="col-span-2 text-right">操作</div>
                </div>

                {items.map((item) => (
                    <div key={item.id} className="grid grid-cols-12 gap-4 items-center bg-slate-900 border border-slate-800 rounded-lg p-4 hover:border-slate-700 transition-colors">
                        <div className="col-span-1">
                            <span className={`inline-block px-2 py-1 text-xs rounded font-bold ${item.type === 'logo' ? 'bg-purple-500/20 text-purple-400' :
                                item.type === 'cta' ? 'bg-amber-500/20 text-amber-400' :
                                    'bg-blue-500/20 text-blue-400'
                                }`}>
                                {item.type === 'logo' ? 'Logo' : item.type === 'cta' ? '按鈕' : '連結'}
                            </span>
                        </div>
                        <div className="col-span-3 font-bold text-white flex items-center gap-2">
                            {/* @ts-ignore */}
                            {item.icon && Icons[item.icon] && <item.icon className="w-4 h-4 text-slate-500" />}
                            {item.text}
                        </div>
                        <div className="col-span-4 text-slate-400 font-mono text-sm truncate">
                            {item.link}
                        </div>
                        <div className="col-span-2 text-center">
                            <span className={`text-xs font-bold ${item.isActive ? 'text-green-400' : 'text-slate-600'}`}>
                                {item.isActive ? '啟用' : '隱藏'}
                            </span>
                        </div>
                        <div className="col-span-2 flex justify-end gap-2">
                            <Button type="button" size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => handleEdit(item)}>
                                <Pencil className="h-4 w-4" />
                            </Button>
                            {item.type !== 'logo' && (
                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:text-red-400" onClick={() => handleDelete(item.id)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {isEditing && currentItem && (
                <NavbarItemEditor
                    item={currentItem}
                    onClose={closeEditor}
                />
            )}
        </div>
    );
}

function NavbarItemEditor({ item, onClose }: { item: any; onClose: () => void }) {
    const [formData, setFormData] = useState(item);
    const isNew = !item.id;

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isNew) {
                await createNavbarItem(formData);
            } else {
                await updateNavbarItem(item.id, formData);
            }
            window.location.href = window.location.pathname + '?t=' + Date.now();
        } catch (error) {
            console.error("Failed to save:", error);
            alert("儲存失敗");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-slate-800">
                    <h3 className="text-lg font-bold text-white">{isNew ? '新增項目' : '編輯項目'}</h3>
                    <Button variant="ghost" size="sm" onClick={onClose}><X className="h-4 w-4" /></Button>
                </div>

                <form onSubmit={handleSave} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">類型</label>
                            <select
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            >
                                <option value="link">一般連結</option>
                                <option value="cta">CTA 按鈕</option>
                                <option value="logo">Logo (文字)</option>
                            </select>
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
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">顯示文字</label>
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
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-sm"
                            value={formData.link || ''}
                            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">圖示代碼 (Lucide Icon Name)</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-sm"
                                value={formData.icon || ''}
                                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                placeholder="如: Home, Gift, Phone..."
                            />
                            <a href="https://lucide.dev/icons" target="_blank" rel="noreferrer" className="flex items-center justify-center px-3 border border-slate-700 rounded-lg hover:bg-slate-800 text-slate-400">
                                <Info className="h-4 w-4" />
                            </a>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                        <input
                            type="checkbox"
                            id="isActive"
                            checked={formData.isActive}
                            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                            className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-amber-500"
                        />
                        <label htmlFor="isActive" className="text-sm text-white">啟用顯示</label>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-800 mt-4">
                        <Button type="button" variant="ghost" onClick={onClose}>取消</Button>
                        <Button type="submit" className="bg-amber-500 text-black hover:bg-amber-600 font-bold">
                            <Save className="h-4 w-4 mr-2" /> 儲存變更
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
