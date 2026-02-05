"use server";

import { db } from "@/db";
import { games, announcements, visitLogs } from "@/db/schema";
import { sql, desc } from "drizzle-orm";

export async function getDashboardStats() {
    // Use raw sql for count queries for better performance/simplicity in SQLite
    const totalGames = await db.select({ count: sql<number>`count(*)` }).from(games);
    const totalNews = await db.select({ count: sql<number>`count(*)` }).from(announcements);
    const totalVisits = await db.select({ count: sql<number>`count(*)` }).from(visitLogs);

    // Basic "Today" filter for SQLite
    // strftime('%Y-%m-%d', created_at, 'unixepoch') == strftime('%Y-%m-%d', 'now')
    // Note: timestamps are stored as seconds (unixepoch)
    const todayVisits = await db.run(sql`
    SELECT count(*) as count FROM visit_logs 
    WHERE date(created_at, 'unixepoch') = date('now')
  `);

    return {
        gamesCount: totalGames[0].count,
        newsCount: totalNews[0].count,
        visitsTotal: totalVisits[0].count,
        visitsToday: (todayVisits as any).rows?.[0]?.count || 0, // Better-sqlite3 result structure might vary, handle safely
    };
}

export async function getRecentLogs() {
    return await db.select()
        .from(visitLogs)
        .orderBy(desc(visitLogs.createdAt))
        .limit(50);
}
