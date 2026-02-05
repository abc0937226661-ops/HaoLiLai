"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Save, X, Upload } from "lucide-react";
import { createGame, updateGame, deleteGame } from "@/actions/game-actions";
import { uploadImage } from "@/actions/upload-actions";

export default function GameAdminPage({ initialGames }: { initialGames: any[] }) {
    const [games, setGames] = useState(initialGames); // Used for optimistic UI if extended
    const [isEditing, setIsEditing] = useState(false);
    const [currentGame, setCurrentGame] = useState<any>(null);

    const handleEdit = (game: any) => {
        setCurrentGame(game);
        setIsEditing(true);
    };

    const handleCreate = () => {
        setCurrentGame({
            name: "",
            category: "電子",
            imageUrl: "",
            isHot: false,
            order: 0,
        });
        setIsEditing(true);
    };

    const closeEditor = () => {
        setIsEditing(false);
        setCurrentGame(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-white">遊戲列表管理 (Games)</h1>
                <Button onClick={handleCreate} className="bg-amber-500 text-black hover:bg-amber-600">
                    <Plus className="mr-2 h-4 w-4" /> 新增遊戲
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
                {initialGames.map((game) => (
                    <div key={game.id} className="relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900 group">
                        <div className="aspect-[3/4] w-full relative bg-slate-950">
                            {game.imageUrl ? (
                                <img src={game.imageUrl} alt={game.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="flex bg-slate-800 h-full items-center justify-center text-slate-500">No Image</div>
                            )}
                            <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
                                <span className={`px-2 py-1 rounded text-xs font-bold ${game.isActive ? 'bg-green-500/80 text-white' : 'bg-red-500/80 text-white'}`}>
                                    {game.isActive ? 'Active' : 'Inactive'}
                                </span>
                                {game.isHot && (
                                    <span className="px-2 py-1 rounded text-xs font-bold bg-red-600 text-white">
                                        HOT
                                    </span>
                                )}
                            </div>
                            <div className="absolute bottom-0 inset-x-0 bg-slate-900/90 p-3">
                                <div className="text-xs text-amber-500 font-bold mb-1">{game.category}</div>
                                <h3 className="font-bold text-white truncate">{game.name}</h3>
                            </div>
                        </div>

                        <div className="p-3 flex gap-2 border-t border-slate-800">
                            <Button type="button" size="sm" variant="outline" className="flex-1 bg-slate-800 border-slate-700 hover:text-white" onClick={() => handleEdit(game)}>
                                <Pencil className="h-4 w-4" />
                            </Button>
                            <form action={async () => {
                                if (!confirm("確定要刪除這款遊戲嗎？")) return;
                                await deleteGame(game.id);
                            }}>
                                <Button size="sm" variant="destructive" className="px-3">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </form>
                        </div>
                    </div>
                ))}
            </div>

            {isEditing && currentGame && (
                <GameEditor
                    game={currentGame}
                    onClose={closeEditor}
                />
            )}
        </div>
    );
}

function GameEditor({ game, onClose }: { game: any; onClose: () => void }) {
    const [formData, setFormData] = useState(game);
    const [uploading, setUploading] = useState(false);

    const isNew = !game.id; // Correct check for new item logic: uuid is generated on server for create, but object passed here

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isNew) {
            await createGame(formData);
        } else {
            await updateGame(game.id, formData);
        }
        onClose();
        window.location.reload();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const form = new FormData();
        form.append("file", file);

        try {
            const url = await uploadImage(form);
            if (url) {
                setFormData({ ...formData, imageUrl: url });
            }
        } catch (err) {
            alert("Upload failed");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">{isNew ? '上架新遊戲' : '編輯遊戲資訊'}</h2>
                    <Button variant="ghost" size="sm" onClick={onClose}><X className="h-5 w-5" /></Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-slate-400 mb-1">遊戲名稱</label>
                            <input
                                type="text"
                                required
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="w-1/3">
                            <label className="block text-sm font-medium text-slate-400 mb-1">分類</label>
                            <select
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            >
                                <option value="電子">電子</option>
                                <option value="棋牌">棋牌</option>
                                <option value="捕魚">捕魚</option>
                                <option value="真人">真人</option>
                                <option value="體育">體育</option>
                                <option value="競速">競速</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">遊戲圖片</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                                value={formData.imageUrl}
                                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                placeholder="/images/..."
                            />
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
                    </div>

                    <div className="flex items-center gap-6 pt-2">
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="isHot"
                                checked={formData.isHot}
                                onChange={(e) => setFormData({ ...formData, isHot: e.target.checked })}
                                className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-red-500"
                            />
                            <label htmlFor="isHot" className="text-sm text-white flex items-center gap-1">
                                熱門推薦 (HOT)
                            </label>
                        </div>

                        {!isNew && (
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                    className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-amber-500"
                                />
                                <label htmlFor="isActive" className="text-sm text-white">上架中 (Active)</label>
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">排序權重</label>
                        <input
                            type="number"
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                            value={formData.order || 0}
                            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                        />
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <Button type="button" variant="ghost" onClick={onClose} className="text-slate-400">取消</Button>
                        <Button type="submit" className="bg-amber-500 text-black hover:bg-amber-600 font-bold">
                            <Save className="h-4 w-4 mr-2" />
                            {isNew ? '確認上架' : '儲存變更'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
