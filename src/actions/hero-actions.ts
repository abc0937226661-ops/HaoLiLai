"use server";

import { db } from "@/db";
import { heroSlides } from "@/db/schema";
import { eq, desc, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// Duplicate function removed

function normalizeSlide(slide: any) {
    if (!slide) return null;
    return {
        id: slide.id,
        title: slide.title,
        subtitle: slide.subtitle,
        imageUrl: slide.imageUrl || slide.image_url, // Handle both
        isActive: slide.isActive ?? slide.is_active ?? true,
        order: slide.order ?? 0,
        // Style & Layout (Force camelCase)
        textAlign: slide.textAlign || slide.text_align || 'left',
        bgPosition: slide.bgPosition || slide.bg_position || 'center',
        titleColor: slide.titleColor || slide.title_color || '#ffffff',
        titleSize: slide.titleSize || slide.title_size || 'text-5xl',
        subtitleColor: slide.subtitleColor || slide.subtitle_color || '#e2e8f0',
        imageOffsetX: slide.imageOffsetX ?? slide.image_offset_x ?? 0,
        imageOffsetY: slide.imageOffsetY ?? slide.image_offset_y ?? 0,
        imageScale: slide.imageScale ?? slide.image_scale ?? 1,
        // Buttons: Handle parsing safely
        buttons: (function () {
            try {
                let btns = slide.buttons;
                if (typeof btns === 'string') {
                    // Try parsing once
                    const p1 = JSON.parse(btns);
                    // Handle double-encoding if it happened
                    if (typeof p1 === 'string') return JSON.parse(p1);
                    return Array.isArray(p1) ? p1 : [];
                }
                return Array.isArray(btns) ? btns : [];
            } catch { return []; }
        })()
    };
}

export async function getAdminHeroSlides() {
    const slides = await db.query.heroSlides.findMany({
        orderBy: [asc(heroSlides.order)]
    });
    return slides.map(normalizeSlide);
}

export async function getPublicHeroSlides() {
    const slides = await db.query.heroSlides.findMany({
        where: eq(heroSlides.isActive, true),
        orderBy: [asc(heroSlides.order)],
    });
    return slides.map(normalizeSlide);
}

export async function createHeroSlide(data: {
    title: string;
    subtitle: string;
    imageUrl: string;
    buttons: string;
    textAlign: string;
    bgPosition: string;
    titleColor: string;
    titleSize: string;
    subtitleColor: string;
    imageOffsetX: number;
    imageOffsetY: number;
    imageScale: number;
    order: number;
}) {
    await db.insert(heroSlides).values({
        ...data,
        isActive: true,
    });
    revalidatePath("/");
    revalidatePath("/admin/hero");
}

export async function updateHeroSlide(id: number, rawData: any) {
    const fs = require('fs');
    const path = require('path');
    const logPath = path.join(process.cwd(), 'db_debug.log');

    // Whitelist fields to avoid pollution
    const dataToUpdate = {
        title: rawData.title,
        subtitle: rawData.subtitle,
        imageUrl: rawData.imageUrl,
        buttons: rawData.buttons,
        textAlign: rawData.textAlign,
        bgPosition: rawData.bgPosition,
        titleColor: rawData.titleColor,
        titleSize: rawData.titleSize,
        subtitleColor: rawData.subtitleColor,
        imageOffsetX: Math.round(Number(rawData.imageOffsetX) || 0), // Force integer
        imageOffsetY: Math.round(Number(rawData.imageOffsetY) || 0), // Force integer
        imageScale: Number(rawData.imageScale) || 1,
        order: Number(rawData.order) || 0,
        isActive: Boolean(rawData.isActive)
    };

    const logMsg = `[${new Date().toISOString()}] UPDATE Slide ${id}: ${JSON.stringify(dataToUpdate)}\n`;
    try {
        fs.appendFileSync(logPath, logMsg);

        await db.update(heroSlides).set(dataToUpdate).where(eq(heroSlides.id, id));

        // Verify update
        const updated = await db.query.heroSlides.findFirst({ where: eq(heroSlides.id, id) });
        fs.appendFileSync(logPath, `[VERIFY] Result: ${JSON.stringify(updated)}\n\n`);

        revalidatePath("/");
        revalidatePath("/admin/hero");
    } catch (e: any) {
        fs.appendFileSync(logPath, `[ERROR] ${e.message}\n${e.stack}\n\n`);
        throw e;
    }
}

export async function deleteHeroSlide(id: number) {
    await db.delete(heroSlides).where(eq(heroSlides.id, id));
    revalidatePath("/");
    revalidatePath("/admin/hero");
}
