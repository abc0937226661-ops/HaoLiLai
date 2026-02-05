"use client";

import { useViewMode } from "@/contexts/ViewModeContext";
import { Monitor, Smartphone } from "lucide-react";
import { useEffect, useState } from "react";

export default function ViewModeToggle() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return <ViewModeToggleContent />;
}

function ViewModeToggleContent() {
    const { viewMode, toggleViewMode } = useViewMode();

    return (
        <button
            onClick={toggleViewMode}
            className="fixed bottom-6 left-6 z-50 flex items-center gap-3 px-6 py-4 bg-gradient-to-br from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 group"
            title={viewMode === "mobile" ? "切換到電腦版" : "切換到手機版"}
        >
            <div className="relative">
                {viewMode === "mobile" ? (
                    <Monitor className="w-6 h-6" />
                ) : (
                    <Smartphone className="w-6 h-6" />
                )}
            </div>

            <span className="font-bold text-sm">
                {viewMode === "mobile" ? "電腦版" : "手機版"}
            </span>

            {/* Status Indicator */}
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
        </button>
    );
}
