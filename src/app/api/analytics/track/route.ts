import { logVisit } from "@/actions/analytics-actions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { path } = body;

        if (!path) {
            return NextResponse.json(
                { error: "Path is required" },
                { status: 400 }
            );
        }

        await logVisit(path);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Analytics tracking error:", error);
        return NextResponse.json(
            { error: "Failed to track visit" },
            { status: 500 }
        );
    }
}
