"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type ViewMode = "mobile" | "desktop";

interface ViewModeContextType {
    viewMode: ViewMode;
    toggleViewMode: () => void;
}

const ViewModeContext = createContext<ViewModeContextType | undefined>(undefined);

export function ViewModeProvider({ children }: { children: ReactNode }) {
    const [viewMode, setViewMode] = useState<ViewMode>("desktop");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Load saved preference from localStorage
        const saved = localStorage.getItem("viewMode") as ViewMode;
        if (saved) {
            setViewMode(saved);
        } else {
            // Auto-detect based on screen size
            const isMobile = window.innerWidth < 768;
            setViewMode(isMobile ? "mobile" : "desktop");
        }
    }, []);

    useEffect(() => {
        if (!mounted) return;

        // Save preference to localStorage
        localStorage.setItem("viewMode", viewMode);

        // Apply viewport changes
        const viewport = document.querySelector('meta[name="viewport"]');
        if (viewport) {
            if (viewMode === "mobile") {
                viewport.setAttribute("content", "width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes");
            } else {
                viewport.setAttribute("content", "width=1200, initial-scale=1");
            }
        }

        // Force layout recalculation
        document.body.style.width = viewMode === "mobile" ? "100%" : "1200px";
        document.body.style.minWidth = viewMode === "mobile" ? "auto" : "1200px";
        document.body.style.margin = viewMode === "mobile" ? "0" : "0 auto";

    }, [viewMode, mounted]);

    const toggleViewMode = () => {
        setViewMode((prev) => (prev === "mobile" ? "desktop" : "mobile"));
    };

    if (!mounted) {
        return <>{children}</>;
    }

    return (
        <ViewModeContext.Provider value={{ viewMode, toggleViewMode }}>
            <div
                className={viewMode === "mobile" ? "mobile-view" : "desktop-view"}
                style={{
                    width: viewMode === "mobile" ? "100%" : "1200px",
                    minWidth: viewMode === "mobile" ? "auto" : "1200px",
                    margin: "0 auto",
                }}
            >
                {children}
            </div>
        </ViewModeContext.Provider>
    );
}

export function useViewMode() {
    const context = useContext(ViewModeContext);
    if (!context) {
        throw new Error("useViewMode must be used within ViewModeProvider");
    }
    return context;
}
