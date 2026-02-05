"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function AnalyticsTracker() {
    const pathname = usePathname();
    const hasTracked = useRef(false);
    const hasEngaged = useRef(false);

    const trackVisit = async () => {
        // Avoid logging static files or api routes
        if (!pathname.startsWith("/_next") && !pathname.startsWith("/static")) {
            try {
                await fetch("/api/analytics/track", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        path: pathname,
                        userAgent: navigator.userAgent,
                    }),
                });
            } catch (error) {
                console.error("Analytics tracking failed:", error);
            }
        }
    };

    useEffect(() => {
        // Engagement detection
        const trackEngagement = () => {
            if (hasEngaged.current) return;
            hasEngaged.current = true;

            // Only track after user engagement
            if (!hasTracked.current) {
                hasTracked.current = true;
                trackVisit();
            }
        };

        // Track various engagement events
        const events = [
            'click',
            'scroll',
            'touchstart',
            'keydown',
            'mousemove'
        ];

        // Add event listeners
        events.forEach(event => {
            window.addEventListener(event, trackEngagement, { once: true, passive: true });
        });

        // Cleanup
        return () => {
            events.forEach(event => {
                window.removeEventListener(event, trackEngagement);
            });
        };
    }, [pathname]);

    return null;
}
