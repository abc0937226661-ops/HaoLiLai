"use server";

import { db } from "@/db";
import { events } from "@/db/schema";
import { eq, desc, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// Data Normalization (Crucial for styling consistency)
function normalizeEvent(evt: any) {
    if (!evt) return null;
    return {
        id: evt.id,
        title: evt.title,
        // subtitle: evt.subtitle, // Schema doesn't have subtitle yet, can add later if needed
        imageUrl: evt.imageUrl || evt.image_url,
        isActive: evt.isActive ?? evt.is_active ?? true,
        order: evt.order ?? 0,
        link: evt.link,

        // Style & Layout
        textAlign: evt.textAlign || evt.text_align || 'left',
        bgPosition: evt.bgPosition || evt.bg_position || 'center',
        titleColor: evt.titleColor || evt.title_color || '#ffffff',
        titleSize: evt.titleSize || evt.title_size || 'text-5xl',
        subtitleColor: evt.subtitleColor || evt.subtitle_color || '#e2e8f0',
        imageOffsetX: evt.imageOffsetX ?? evt.image_offset_x ?? 0,
        imageOffsetY: evt.imageOffsetY ?? evt.image_offset_y ?? 0,
        imageScale: evt.imageScale ?? evt.image_scale ?? 1,

        // Buttons: Handle parsing safely
        buttons: (function () {
            try {
                let btns = evt.buttons;
                if (typeof btns === 'string') {
                    const p1 = JSON.parse(btns);
                    if (typeof p1 === 'string') return JSON.parse(p1);
                    return Array.isArray(p1) ? p1 : [];
                }
                return Array.isArray(btns) ? btns : [];
            } catch { return []; }
        })()
    };
}

export async function getAdminEvents() {
    const allEvents = await db.query.events.findMany({
        orderBy: [asc(events.order)]
    });
    return allEvents.map(normalizeEvent);
}

export async function getPublicEvents() {
    const activeEvents = await db.query.events.findMany({
        where: eq(events.isActive, true),
        orderBy: [asc(events.order)],
    });
    return activeEvents.map(normalizeEvent);
}

export async function createEvent(data: any) {
    // Whitelist and format
    const dbData = {
        title: data.title,
        imageUrl: data.imageUrl,

        buttons: typeof data.buttons === 'string' ? data.buttons : JSON.stringify(data.buttons || []),

        textAlign: data.textAlign || 'left',
        bgPosition: data.bgPosition || 'center',
        titleColor: data.titleColor || '#ffffff',
        titleSize: data.titleSize || 'text-3xl', // Default smaller for cards
        subtitleColor: data.subtitleColor || '#e2e8f0',

        imageOffsetX: Math.round(Number(data.imageOffsetX) || 0),
        imageOffsetY: Math.round(Number(data.imageOffsetY) || 0),
        imageScale: Number(data.imageScale) || 1,

        link: data.link,
        order: Number(data.order) || 0,
        isActive: true,
    };

    await db.insert(events).values(dbData);
    revalidatePath("/");
    revalidatePath("/admin/events");
}

export async function updateEvent(id: number, data: any) {
    const fs = require('fs');
    const path = require('path');
    // const logPath = path.join(process.cwd(), 'db_events_debug.log');

    const dbData = {
        title: data.title,
        imageUrl: data.imageUrl,

        buttons: typeof data.buttons === 'string' ? data.buttons : JSON.stringify(data.buttons || []),

        textAlign: data.textAlign,
        bgPosition: data.bgPosition,
        titleColor: data.titleColor,
        titleSize: data.titleSize,
        subtitleColor: data.subtitleColor,

        imageOffsetX: Math.round(Number(data.imageOffsetX) || 0),
        imageOffsetY: Math.round(Number(data.imageOffsetY) || 0),
        imageScale: Number(data.imageScale) || 1,

        link: data.link,
        order: Number(data.order),
        isActive: Boolean(data.isActive)
    };

    // try {
    //     fs.appendFileSync(logPath, `UPDATE Event ${id}: ${JSON.stringify(dbData)}\n`);
    // } catch {}

    await db.update(events).set(dbData).where(eq(events.id, id));
    revalidatePath("/");
    revalidatePath("/admin/events");
}

export async function deleteEvent(id: number) {
    await db.delete(events).where(eq(events.id, id));
    revalidatePath("/");
    revalidatePath("/admin/events");
}
