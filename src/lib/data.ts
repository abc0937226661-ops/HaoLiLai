
import { db } from '@/db';
import { users, announcements, events, documents, posts, homeSettings, siteSettings } from '@/db/schema';
import { eq, desc, and, gt, sql } from 'drizzle-orm';

// --- Data Fetching Utilities for Frontend ---

// Get Site Settings (Cached-like)
export async function getSiteSettings() {
    const data = await db.select().from(siteSettings).where(eq(siteSettings.id, 1)).get();
    return data;
}

// Get Home Settings
export async function getHomeSettings() {
    const data = await db.select().from(homeSettings).where(eq(homeSettings.id, 1)).get();
    return data;
}

// Get Active Announcements
export async function getActiveAnnouncements(limit = 5) {
    const now = new Date();
    return await db.select()
        .from(announcements)
        .where(
            and(
                eq(announcements.status, 'published'),
                // sql`${announcements.endAt} IS NULL OR ${announcements.endAt} > ${now}` // SQLite specific date logic might vary
            )
        )
        .orderBy(desc(announcements.isPinned), desc(announcements.startAt))
        .limit(limit);
}

// Get Active Short-Term Events
export async function getActiveShortEvents(limit = 3) {
    return await db.select()
        .from(events)
        .where(
            and(
                eq(events.status, 'published'),
                eq(events.type, 'short')
            )
        )
        .orderBy(desc(events.endAt))
        .limit(limit);
}

// Get Documents
export async function getDocuments() {
    return await db.select()
        .from(documents)
        .where(eq(documents.status, 'published'))
        .orderBy(desc(documents.docDate));
}
