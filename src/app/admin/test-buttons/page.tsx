"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

export default function SimpleTestPage() {
    const [message, setMessage] = useState("尚未點擊");
    const [count, setCount] = useState(0);

    const handleClick = () => {
        setMessage("按鈕有效！");
        setCount(count + 1);
        alert("測試成功！");
    };

    return (
        <div className="p-8 bg-slate-950 min-h-screen">
            <h1 className="text-2xl font-bold text-white mb-8">按鈕功能測試</h1>

            <div className="space-y-6">
                {/* Test 1: Native button */}
                <div className="bg-slate-900 p-6 rounded-lg">
                    <h2 className="text-white font-bold mb-4">測試 1: 原生按鈕</h2>
                    <button
                        onClick={() => alert("原生按鈕有效！")}
                        className="px-4 py-2 bg-blue-500 text-white rounded"
                    >
                        點我 (原生按鈕)
                    </button>
                </div>

                {/* Test 2: UI Button component */}
                <div className="bg-slate-900 p-6 rounded-lg">
                    <h2 className="text-white font-bold mb-4">測試 2: UI Button 組件</h2>
                    <Button onClick={handleClick} variant="outline">
                        點我 (UI Button)
                    </Button>
                    <p className="text-white mt-2">狀態: {message}</p>
                    <p className="text-slate-400">點擊次數: {count}</p>
                </div>

                {/* Test 3: Button with type="button" */}
                <div className="bg-slate-900 p-6 rounded-lg">
                    <h2 className="text-white font-bold mb-4">測試 3: type="button" 的 UI Button</h2>
                    <Button
                        type="button"
                        onClick={() => alert("type=button 有效！")}
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>
                </div>

                {/* Test 4: Button in form */}
                <div className="bg-slate-900 p-6 rounded-lg">
                    <h2 className="text-white font-bold mb-4">測試 4: Form 內的按鈕</h2>
                    <form onSubmit={(e) => { e.preventDefault(); alert("Form submitted"); }}>
                        <div className="flex gap-2">
                            <Button
                                type="button"
                                onClick={() => alert("編輯按鈕有效！")}
                                variant="ghost"
                                size="sm"
                            >
                                <Pencil className="h-4 w-4 mr-2" />
                                編輯
                            </Button>
                            <button type="submit" className="px-4 py-2 bg-red-500 text-white rounded">
                                提交
                            </button>
                        </div>
                    </form>
                </div>

                {/* Test 5: Simulating actual admin structure */}
                <div className="bg-slate-900 p-6 rounded-lg">
                    <h2 className="text-white font-bold mb-4">測試 5: 模擬實際後台結構</h2>
                    <TestAdminStructure />
                </div>
            </div>
        </div>
    );
}

function TestAdminStructure() {
    const [isEditing, setIsEditing] = useState(false);
    const [currentItem, setCurrentItem] = useState<any>(null);

    const handleEdit = (item: any) => {
        console.log("handleEdit called with:", item);
        setCurrentItem(item);
        setIsEditing(true);
        alert(`編輯: ${item.title}`);
    };

    const testData = [
        { id: 1, title: "測試項目 1" },
        { id: 2, title: "測試項目 2" },
    ];

    return (
        <div>
            {testData.map((item) => (
                <div key={item.id} className="flex items-center gap-2 mb-2 p-2 bg-slate-800 rounded">
                    <span className="text-white flex-1">{item.title}</span>
                    <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-slate-400 hover:text-white"
                        onClick={() => handleEdit(item)}
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>
                </div>
            ))}
            {isEditing && (
                <div className="mt-4 p-4 bg-green-900 rounded">
                    <p className="text-white">編輯模式開啟！</p>
                    <p className="text-slate-300">當前項目: {currentItem?.title}</p>
                    <Button onClick={() => setIsEditing(false)} className="mt-2">
                        關閉
                    </Button>
                </div>
            )}
        </div>
    );
}
