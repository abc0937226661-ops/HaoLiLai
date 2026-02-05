"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Save, X, Upload } from "lucide-react";
import { createEvent, updateEvent, deleteEvent } from "@/actions/event-actions";
import { uploadImage } from "@/actions/upload-actions";
import Cropper from "react-easy-crop";
import type { Point, Area } from "react-easy-crop/types";

export default function EventsAdminPage({ initialEvents }: { initialEvents: any[] }) {
    const [events, setEvents] = useState(initialEvents);
    const [isEditing, setIsEditing] = useState(false);
    const [currentEvent, setCurrentEvent] = useState<any>(null);

    const handleEdit = (evt: any) => {
        setCurrentEvent(evt);
        setIsEditing(true);
    };

    const handleCreate = () => {
        setCurrentEvent({
            title: "新活動標題",
            imageUrl: "",
            buttons: [],
            textAlign: "left",
            bgPosition: "center",
            titleColor: "#ffffff",
            titleSize: "text-3xl",
            subtitleColor: "#e2e8f0",
            imageOffsetX: 0,
            imageOffsetY: 0,
            imageScale: 1,
            order: 0,
            isActive: true,
        });
        setIsEditing(true);
    };

    const closeEditor = () => {
        setIsEditing(false);
        setCurrentEvent(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-white">常駐活動管理 (Events Section)</h1>
                <Button onClick={handleCreate} className="bg-amber-500 text-black hover:bg-amber-600">
                    <Plus className="mr-2 h-4 w-4" /> 新增活動
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {initialEvents.map((evt) => (
                    <div key={evt.id} className="group relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900 transition-all hover:border-amber-500/50">
                        {/* Preview Card */}
                        <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-950">
                            {evt.imageUrl ? (
                                <div
                                    className="h-full w-full bg-cover bg-center transition-transform duration-500"
                                    style={{
                                        backgroundImage: `url('${evt.imageUrl}')`,
                                        transform: `scale(${evt.imageScale || 1}) translate(${evt.imageOffsetX || 0}px, ${evt.imageOffsetY || 0}px)`
                                    }}
                                />
                            ) : (
                                <div className="flex h-full items-center justify-center text-slate-500">No Image</div>
                            )}

                            {/* Text Overlay Preview */}
                            <div className={`absolute inset-0 flex flex-col p-4 ${evt.textAlign === 'center' ? 'items-center justify-center text-center' :
                                evt.textAlign === 'right' ? 'items-end justify-end text-right' : 'items-start justify-end text-left'
                                }`}>
                                <h3
                                    className="font-bold drop-shadow-md"
                                    style={{ color: evt.titleColor, fontSize: '1.2rem' }}
                                >
                                    {evt.title}
                                </h3>
                            </div>

                            <div className="absolute top-2 right-2">
                                <span className={`px-2 py-1 rounded text-xs font-bold ${evt.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                    {evt.isActive ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                        </div>

                        <div className="p-4 space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-slate-500">排序: {evt.order}</span>
                            </div>

                            <div className="flex gap-2 pt-2">
                                <Button type="button" size="sm" variant="outline" className="flex-1 bg-slate-800 border-slate-700 hover:text-white" onClick={() => handleEdit(evt)}>
                                    <Pencil className="h-4 w-4 mr-1" /> 編輯
                                </Button>
                                <form action={async () => {
                                    if (!confirm("確定要刪除嗎？")) return;
                                    await deleteEvent(evt.id);
                                    window.location.reload();
                                }}>
                                    <Button size="sm" variant="destructive" className="px-3">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </form>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {isEditing && currentEvent && (
                <EventEditor
                    evt={currentEvent}
                    onClose={closeEditor}
                />
            )}
        </div>
    );
}

function EventEditor({ evt, onClose }: { evt: any; onClose: () => void }) {
    const [formData, setFormData] = useState(evt);
    const [uploading, setUploading] = useState(false);

    // Crop state
    const [crop, setCrop] = useState<Point>({ x: evt.imageOffsetX, y: evt.imageOffsetY });
    const [zoom, setZoom] = useState(evt.imageScale);

    const isNew = !evt.id;

    const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
        // We use crop x/y as translate values directly for simple CSS transform
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const dataToSave = {
            ...formData,
            imageOffsetX: Number(crop.x),
            imageOffsetY: Number(crop.y),
            imageScale: Number(zoom),
            buttons: JSON.stringify(formData.buttons)
        };

        if (isNew) {
            await createEvent(dataToSave);
        } else {
            await updateEvent(evt.id, dataToSave);
        }
        window.location.href = window.location.pathname + '?t=' + Date.now();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        const form = new FormData();
        form.append("file", file);
        try {
            const url = await uploadImage(form);
            if (url) setFormData({ ...formData, imageUrl: url });
        } catch (err) { alert("Upload failed"); }
        finally { setUploading(false); }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 text-left overflow-y-auto">
            <div className="w-full max-w-5xl rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl my-8 flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between p-6 border-b border-slate-800">
                    <h2 className="text-xl font-bold text-white">{isNew ? '新增活動' : '編輯活動'}</h2>
                    <Button variant="ghost" size="sm" onClick={onClose}><X className="h-5 w-5" /></Button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left: Cropper */}
                        <div className="space-y-4">
                            <label className="block text-sm font-medium text-slate-400">圖片編輯 (拖曳移動 / 滾輪縮放)</label>
                            <div className="relative w-full aspect-[4/3] bg-slate-950 rounded-lg overflow-hidden border border-slate-700">
                                {formData.imageUrl ? (
                                    <Cropper
                                        image={formData.imageUrl}
                                        crop={crop}
                                        zoom={zoom}
                                        aspect={4 / 3}
                                        onCropChange={setCrop}
                                        onCropComplete={onCropComplete}
                                        onZoomChange={setZoom}
                                        objectFit="cover"
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center text-slate-500">No Image</div>
                                )}
                            </div>

                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm"
                                    value={formData.imageUrl}
                                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                    placeholder="圖片網址..."
                                />
                                <div className="relative">
                                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileChange} accept="image/*" />
                                    <Button type="button" variant="outline" className="border-slate-700" disabled={uploading}><Upload className="h-4 w-4" /></Button>
                                </div>
                            </div>
                            <div className="text-xs text-slate-500 text-center">
                                縮放: {zoom.toFixed(2)}x | 位移: X:{crop.x.toFixed(0)}, Y:{crop.y.toFixed(0)}
                            </div>
                        </div>

                        {/* Right: Form */}
                        <form id="event-form" onSubmit={handleSave} className="space-y-6">
                            <div className="space-y-4 border-b border-slate-800 pb-4">
                                <h3 className="text-sm font-bold text-amber-500 uppercase tracking-wider">活動設定</h3>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">標題</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            required
                                            className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        />
                                        <input type="color" className="w-10 h-10 bg-transparent cursor-pointer" value={formData.titleColor || '#ffffff'} onChange={(e) => setFormData({ ...formData, titleColor: e.target.value })} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">文字大小</label>
                                        <select
                                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                                            value={formData.titleSize || 'text-3xl'}
                                            onChange={(e) => setFormData({ ...formData, titleSize: e.target.value })}
                                        >
                                            <option value="text-xl">小 (XL)</option>
                                            <option value="text-2xl">中 (2XL)</option>
                                            <option value="text-3xl">大 (3XL)</option>
                                            <option value="text-4xl">特大 (4XL)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">對齊方式</label>
                                        <select
                                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                                            value={formData.textAlign || 'left'}
                                            onChange={(e) => setFormData({ ...formData, textAlign: e.target.value })}
                                        >
                                            <option value="left">靠左 (底)</option>
                                            <option value="center">置中</option>
                                            <option value="right">靠右 (底)</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">全卡連結 (可選)</label>
                                    <input
                                        type="text"
                                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                                        value={formData.link || ''}
                                        onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                                        placeholder="/games/slot"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-between items-center pt-4">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="isActive"
                                        checked={formData.isActive}
                                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                        className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-amber-500"
                                    />
                                    <label htmlFor="isActive" className="text-sm text-white">啟用顯示</label>

                                    <div className="ml-4 flex items-center gap-2">
                                        <label className="text-sm text-slate-400">排序:</label>
                                        <input
                                            type="number"
                                            className="w-16 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-white text-sm"
                                            value={formData.order || 0}
                                            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <Button type="button" variant="ghost" onClick={onClose} className="text-slate-400">取消</Button>
                                    <Button type="submit" className="bg-amber-500 text-black hover:bg-amber-600 font-bold min-w-[120px]">
                                        <Save className="h-4 w-4 mr-2" /> 儲存變更
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
