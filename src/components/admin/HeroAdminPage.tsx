"use client";

import { useState, useTransition, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Save, X, Upload } from "lucide-react";
import { createHeroSlide, updateHeroSlide, deleteHeroSlide } from "@/actions/hero-actions";
import { uploadImage } from "@/actions/upload-actions";
import Cropper from "react-easy-crop";
// import { Point, Area } from "react-easy-crop/types"; // Fix: Types are likely inferred or imported differently
// Using 'any' for now to prevent build blockers if types are hard to resolve
type Point = { x: number, y: number };
type Area = { x: number, y: number, width: number, height: number };

export default function HeroAdminPage({ initialSlides }: { initialSlides: any[] }) {
    const [slides, setSlides] = useState(initialSlides);
    const [isEditing, setIsEditing] = useState(false);
    const [currentSlide, setCurrentSlide] = useState<any>(null);

    const handleEdit = (slide: any) => {
        setCurrentSlide(slide);
        setIsEditing(true);
    };

    const handleCreate = () => {
        setCurrentSlide({
            title: "",
            subtitle: "",
            imageUrl: "",
            buttons: [
                { text: "立即遊玩", link: "/", color: "amber", show: true },
                { text: "查看詳情", link: "/games", color: "white", show: true }
            ],
            textAlign: "left",
            bgPosition: "center",
            titleColor: "#ffffff",
            titleSize: "text-5xl",
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
        setCurrentSlide(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-white">輪播圖管理 (Hero Banner)</h1>
                <Button onClick={handleCreate} className="bg-amber-500 text-black hover:bg-amber-600">
                    <Plus className="mr-2 h-4 w-4" /> 新增輪播圖
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {initialSlides.map((slide) => (
                    <div key={slide.id} className="group relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900 transition-all hover:border-amber-500/50">
                        <div className="aspect-video w-full relative bg-slate-950 overflow-hidden">
                            {slide.imageUrl ? (
                                <div
                                    className="w-full h-full bg-cover bg-center"
                                    style={{
                                        backgroundImage: `url('${slide.imageUrl}')`,
                                        transform: `scale(${slide.imageScale || 1}) translate(${slide.imageOffsetX || 0}px, ${slide.imageOffsetY || 0}px)`
                                    }}
                                />
                            ) : (
                                <div className="flex bg-slate-800 h-full items-center justify-center text-slate-500">No Image</div>
                            )}
                            <div className="absolute top-2 right-2">
                                <span className={`px-2 py-1 rounded text-xs font-bold ${slide.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                    {slide.isActive ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                        </div>

                        <div className="p-4 space-y-2">
                            <h3 className="font-bold text-white truncate">{slide.title}</h3>
                            <p className="text-sm text-slate-400 truncate">{slide.subtitle || "No subtitle"}</p>

                            <div className="pt-4 flex gap-2">
                                <Button type="button" size="sm" variant="outline" className="flex-1 bg-slate-800 border-slate-700 hover:text-white" onClick={() => handleEdit(slide)}>
                                    <Pencil className="h-4 w-4 mr-1" /> 編輯
                                </Button>
                                <form action={async () => {
                                    if (!confirm("確定要刪除嗎？")) return;
                                    await deleteHeroSlide(slide.id);
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

            {isEditing && currentSlide && (
                <SlideEditor
                    slide={currentSlide}
                    onClose={closeEditor}
                />
            )}
        </div>
    );
}

function SlideEditor({ slide, onClose }: { slide: any; onClose: () => void }) {
    // Data is now pre-normalized by server action
    const [formData, setFormData] = useState(slide); // Simple!

    const [uploading, setUploading] = useState(false);

    const [crop, setCrop] = useState<Point>({
        x: slide.imageOffsetX,
        y: slide.imageOffsetY
    });
    const [zoom, setZoom] = useState(slide.imageScale);

    const isNew = !slide.id;

    const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
        // We don't need actual pixel cropping for CSS verify, just the offset/zoom values
        // But react-easy-crop gives us x/y offsets in pixels relative to the container
        // To enable simple CSS transform, we can just save the 'crop' point directly if we assume the container size is fixed or consistent ratios
        // However, react-easy-crop's 'crop' state is essentially translation X/Y in pixels. Perfect for transform: translate(x,y)
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const dataToSave = {
            ...formData,
            // Ensure explicit types
            imageOffsetX: Number(crop.x),
            imageOffsetY: Number(crop.y),
            imageScale: Number(zoom),
            buttons: JSON.stringify(formData.buttons) // Save as string
        };

        console.log("Saving:", dataToSave); // Debug log

        if (isNew) {
            await createHeroSlide(dataToSave);
        } else {
            await updateHeroSlide(slide.id, dataToSave);
        }
        // Hard reload with cache busting
        window.location.href = window.location.pathname + '?t=' + Date.now();
    };

    const handleButtonChange = (index: number, field: string, value: any) => {
        const newButtons = [...formData.buttons];
        newButtons[index] = { ...newButtons[index], [field]: value };
        setFormData({ ...formData, buttons: newButtons });
    };

    const addButton = () => {
        setFormData({
            ...formData,
            buttons: [...formData.buttons, { text: "新按鈕", link: "#", color: "white", show: true }]
        });
    };

    const removeButton = (index: number) => {
        const newButtons = formData.buttons.filter((_: any, i: number) => i !== index);
        setFormData({ ...formData, buttons: newButtons });
    };

    // ... (handleFileChange remains same)
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
                {/* ... Header ... */}
                <div className="flex items-center justify-between p-6 border-b border-slate-800">
                    <h2 className="text-xl font-bold text-white">{isNew ? '新增輪播圖' : '編輯輪播圖'}</h2>
                    <Button variant="ghost" size="sm" onClick={onClose}><X className="h-5 w-5" /></Button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left: Cropper */}
                        <div className="space-y-4">
                            <label className="block text-sm font-medium text-slate-400">圖片編輯 (拖曳移動 / 滾輪縮放)</label>
                            <div className="relative w-full aspect-video bg-slate-950 rounded-lg overflow-hidden border border-slate-700">
                                {formData.imageUrl ? (
                                    <Cropper
                                        image={formData.imageUrl}
                                        crop={crop}
                                        zoom={zoom}
                                        aspect={16 / 9}
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
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm"
                                        value={formData.imageUrl}
                                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                        placeholder="圖片網址..."
                                    />
                                </div>
                                <div className="relative">
                                    <input
                                        type="file"
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        onChange={handleFileChange}
                                        accept="image/*"
                                    />
                                    <Button type="button" variant="outline" className="border-slate-700" disabled={uploading}>
                                        <Upload className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                            <div className="text-xs text-slate-500 text-center">
                                縮放: {zoom.toFixed(2)}x | 位移: X:{crop.x.toFixed(0)}, Y:{crop.y.toFixed(0)}
                            </div>
                        </div>

                        {/* Right: Form */}
                        <form id="slide-form" onSubmit={handleSave} className="space-y-6">
                            {/* Text Settings */}
                            <div className="space-y-4 border-b border-slate-800 pb-4">
                                <h3 className="text-sm font-bold text-amber-500 uppercase tracking-wider">文字設定</h3>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">主標題</label>
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
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">副標題</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                                            value={formData.subtitle || ''}
                                            onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                                        />
                                        <input type="color" className="w-10 h-10 bg-transparent cursor-pointer" value={formData.subtitleColor || '#e2e8f0'} onChange={(e) => setFormData({ ...formData, subtitleColor: e.target.value })} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">文字大小</label>
                                        <select
                                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                                            value={formData.titleSize || 'text-5xl'}
                                            onChange={(e) => setFormData({ ...formData, titleSize: e.target.value })}
                                        >
                                            <option value="text-3xl">小 (3XL)</option>
                                            <option value="text-5xl">中 (5XL)</option>
                                            <option value="text-7xl">大 (7XL)</option>
                                            <option value="text-9xl">特大 (9XL)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">對齊方式</label>
                                        <select
                                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                                            value={formData.textAlign || 'left'}
                                            onChange={(e) => setFormData({ ...formData, textAlign: e.target.value })}
                                        >
                                            <option value="left">靠左</option>
                                            <option value="center">置中</option>
                                            <option value="right">靠右</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Button Settings */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-bold text-amber-500 uppercase tracking-wider">按鈕列表</h3>
                                    <Button type="button" size="sm" variant="outline" onClick={addButton} className="text-xs h-7">
                                        <Plus className="w-3 h-3 mr-1" /> 新增按鈕
                                    </Button>
                                </div>

                                <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2">
                                    {formData.buttons && formData.buttons.map((btn: any, idx: number) => (
                                        <div key={idx} className="flex gap-2 items-start bg-slate-950 p-3 rounded-lg border border-slate-800">
                                            <div className="grid grid-cols-2 gap-2 flex-1">
                                                <input
                                                    placeholder="文字"
                                                    className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                                                    value={btn.text}
                                                    onChange={(e) => handleButtonChange(idx, 'text', e.target.value)}
                                                />
                                                <input
                                                    placeholder="連結"
                                                    className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                                                    value={btn.link}
                                                    onChange={(e) => handleButtonChange(idx, 'link', e.target.value)}
                                                />
                                                <select
                                                    className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                                                    value={btn.color}
                                                    onChange={(e) => handleButtonChange(idx, 'color', e.target.value)}
                                                >
                                                    <option value="amber">黃色 (Primary)</option>
                                                    <option value="white">白色 (Secondary)</option>
                                                    <option value="blue">藍色</option>
                                                    <option value="red">紅色</option>
                                                </select>
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={btn.show}
                                                        onChange={(e) => handleButtonChange(idx, 'show', e.target.checked)}
                                                        className="rounded border-slate-700 bg-slate-900"
                                                    />
                                                    <span className="text-xs text-slate-400">顯示</span>
                                                </div>
                                            </div>
                                            <Button type="button" variant="ghost" size="sm" onClick={() => removeButton(idx)} className="text-red-500 hover:bg-red-950/20 h-auto self-stretch">
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Footer actions */}
                <div className="p-6 border-t border-slate-800 flex justify-between items-center">
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
                        <Button type="submit" form="slide-form" className="bg-amber-500 text-black hover:bg-amber-600 font-bold min-w-[120px]">
                            <Save className="h-4 w-4 mr-2" />
                            儲存變更
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
