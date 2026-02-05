"use client";

import { useState, useEffect } from "react";
import { Music, Plus, Trash2, Edit2, GripVertical } from "lucide-react";
import { getAllVideos, createVideo, updateVideo, deleteVideo } from "@/actions/youtube-actions";

export default function MusicAdminPage() {
    const [videos, setVideos] = useState<any[]>([]);
    const [editingVideo, setEditingVideo] = useState<any | null>(null);
    const [showEditor, setShowEditor] = useState(false);

    useEffect(() => {
        loadVideos();
    }, []);

    const loadVideos = async () => {
        const data = await getAllVideos();
        setVideos(data);
    };

    const handleDelete = async (id: number) => {
        if (confirm("確定要刪除這首歌曲嗎？")) {
            await deleteVideo(id);
            loadVideos();
        }
    };

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <Music className="h-8 w-8 text-amber-400" />
                    <h1 className="text-3xl font-bold text-white">音樂管理</h1>
                </div>
                <button
                    onClick={() => {
                        setEditingVideo({ title: "", youtubeId: "", order: videos.length + 1 });
                        setShowEditor(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-black font-bold rounded-lg hover:bg-amber-600 transition-colors"
                >
                    <Plus className="h-5 w-5" />
                    新增歌曲
                </button>
            </div>

            {/* Video List */}
            <div className="grid gap-4">
                {videos.map((video) => (
                    <div
                        key={video.id}
                        className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-4"
                    >
                        <GripVertical className="h-5 w-5 text-slate-600" />

                        {/* Thumbnail */}
                        <img
                            src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                            alt={video.title}
                            className="w-32 h-20 object-cover rounded-lg"
                        />

                        {/* Info */}
                        <div className="flex-1">
                            <h3 className="text-white font-bold">{video.title}</h3>
                            <p className="text-sm text-slate-500 font-mono">ID: {video.youtubeId}</p>
                            <p className="text-xs text-slate-600">排序: {video.order}</p>
                        </div>

                        {/* Status */}
                        <div className="flex items-center gap-2">
                            {video.isActive ? (
                                <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded">啟用</span>
                            ) : (
                                <span className="px-2 py-1 bg-slate-700 text-slate-400 text-xs rounded">停用</span>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => {
                                    setEditingVideo(video);
                                    setShowEditor(true);
                                }}
                                className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                            >
                                <Edit2 className="h-4 w-4 text-white" />
                            </button>
                            <button
                                onClick={() => handleDelete(video.id)}
                                className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                            >
                                <Trash2 className="h-4 w-4 text-white" />
                            </button>
                        </div>
                    </div>
                ))}

                {videos.length === 0 && (
                    <div className="text-center py-12 text-slate-500">
                        <Music className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>尚未新增任何歌曲</p>
                    </div>
                )}
            </div>

            {/* Editor Modal */}
            {showEditor && (
                <VideoEditor
                    video={editingVideo}
                    onClose={() => {
                        setShowEditor(false);
                        setEditingVideo(null);
                    }}
                    onSave={loadVideos}
                />
            )}
        </div>
    );
}

function VideoEditor({ video, onClose, onSave }: { video: any; onClose: () => void; onSave: () => void }) {
    const [formData, setFormData] = useState(video);
    const isNew = !video.id;

    const extractYouTubeId = (url: string) => {
        const match = url.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/watch\?.+&v=))([^&\n?#]+)/);
        return match ? match[1] : url;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const youtubeId = extractYouTubeId(formData.youtubeId);

        if (isNew) {
            await createVideo({ ...formData, youtubeId });
        } else {
            await updateVideo(video.id, { ...formData, youtubeId });
        }
        onSave();
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl">
                <h2 className="text-2xl font-bold text-white mb-6">{isNew ? "新增歌曲" : "編輯歌曲"}</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">歌曲標題</label>
                        <input
                            type="text"
                            required
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="例如：背景音樂 1"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">YouTube 網址或 ID</label>
                        <input
                            type="text"
                            required
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-sm"
                            value={formData.youtubeId}
                            onChange={(e) => setFormData({ ...formData, youtubeId: e.target.value })}
                            placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                        />
                        <p className="text-xs text-slate-500 mt-1">可以貼上完整網址或只輸入影片 ID</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">排序</label>
                        <input
                            type="number"
                            required
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                            value={formData.order}
                            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="isActive"
                            checked={formData.isActive ?? true}
                            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                            className="w-4 h-4 rounded border-slate-700"
                        />
                        <label htmlFor="isActive" className="text-sm text-slate-300">啟用此歌曲</label>
                    </div>

                    {/* Preview */}
                    {formData.youtubeId && (
                        <div className="border border-slate-700 rounded-lg overflow-hidden">
                            <img
                                src={`https://img.youtube.com/vi/${extractYouTubeId(formData.youtubeId)}/mqdefault.jpg`}
                                alt="Preview"
                                className="w-full"
                            />
                        </div>
                    )}

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
                        >
                            取消
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-amber-500 text-black font-bold rounded-lg hover:bg-amber-600 transition-colors"
                        >
                            儲存
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
