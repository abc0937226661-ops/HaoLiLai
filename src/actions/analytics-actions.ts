"use server";

import { db } from "@/db";
import { visitLogs } from "@/db/schema";
import { sql, desc, count, gte, and } from "drizzle-orm";

export async function logVisit(path: string) {
    const headers = await import("next/headers").then((m) => m.headers());
    const ip = headers.get("x-forwarded-for") || headers.get("x-real-ip") || "unknown";
    const userAgent = headers.get("user-agent") || "unknown";

    await db.insert(visitLogs).values({
        ip,
        path,
        userAgent,
        country: null,
        isEngaged: true,
    });
}

export async function getTotalVisits() {
    const result = await db.select({ count: count() }).from(visitLogs);
    return result[0]?.count || 0;
}

// Get visits by hour for today (local timezone)
export async function getVisitsByHour() {
    // Get today's date in local timezone
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTimestamp = Math.floor(today.getTime() / 1000);

    // Get tomorrow's date to filter correctly
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowTimestamp = Math.floor(tomorrow.getTime() / 1000);

    const result = await db
        .select({
            hour: sql<number>`CAST(strftime('%H', datetime(created_at, 'unixepoch', 'localtime')) AS INTEGER)`,
            visits: count(),
        })
        .from(visitLogs)
        .where(
            and(
                gte(visitLogs.createdAt, sql`${todayTimestamp}`),
                sql`${visitLogs.createdAt} < ${tomorrowTimestamp}`
            )
        )
        .groupBy(sql`strftime('%H', datetime(created_at, 'unixepoch', 'localtime'))`)
        .orderBy(sql`strftime('%H', datetime(created_at, 'unixepoch', 'localtime'))`);

    // Fill in missing hours with 0
    const hourlyData = Array.from({ length: 24 }, (_, i) => ({
        hour: i,
        count: 0,
    }));

    result.forEach((row) => {
        if (row.hour !== null && row.hour >= 0 && row.hour < 24) {
            hourlyData[row.hour] = { hour: row.hour, count: row.visits };
        }
    });

    return hourlyData;
}

// Get visits by day for last N days (local timezone)
export async function getVisitsByDay(days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);
    const startTimestamp = Math.floor(startDate.getTime() / 1000);

    const result = await db
        .select({
            date: sql<string>`date(datetime(created_at, 'unixepoch', 'localtime'))`,
            visits: count(),
        })
        .from(visitLogs)
        .where(gte(visitLogs.createdAt, sql`${startTimestamp}`))
        .groupBy(sql`date(datetime(created_at, 'unixepoch', 'localtime'))`)
        .orderBy(sql`date(datetime(created_at, 'unixepoch', 'localtime'))`);

    return result.map(r => ({ date: r.date, count: r.visits }));
}

// Get peak traffic data
export async function getPeakTraffic() {
    // Peak hour today
    const todayHourly = await getVisitsByHour();
    const peakHourToday = todayHourly.reduce((max, curr) =>
        curr.count > max.count ? curr : max
        , { hour: 0, count: 0 });

    // Peak day in last 30 days
    const dailyData = await getVisitsByDay(30);
    const peakDay = dailyData.reduce((max, curr) =>
        curr.count > max.count ? curr : max
        , { date: '', count: 0 });

    // All-time peak day (local timezone)
    const allTimePeakResult = await db
        .select({
            date: sql<string>`date(datetime(created_at, 'unixepoch', 'localtime'))`,
            visits: count(),
        })
        .from(visitLogs)
        .groupBy(sql`date(datetime(created_at, 'unixepoch', 'localtime'))`)
        .orderBy(desc(count()))
        .limit(1);

    const allTimePeak = allTimePeakResult[0]
        ? { date: allTimePeakResult[0].date, count: allTimePeakResult[0].visits }
        : { date: '', count: 0 };

    return {
        peakHourToday: {
            hour: peakHourToday.hour,
            count: peakHourToday.count,
        },
        peakDayThisMonth: {
            date: peakDay.date,
            count: peakDay.count,
        },
        allTimePeak,
    };
}

// Get recent visits
export async function getRecentVisits(limit: number = 10) {
    return await db
        .select()
        .from(visitLogs)
        .orderBy(desc(visitLogs.createdAt))
        .limit(limit);
}

// Get visits by page
export async function getVisitsByPage() {
    const result = await db
        .select({
            path: visitLogs.path,
            visits: count(),
        })
        .from(visitLogs)
        .groupBy(visitLogs.path)
        .orderBy(desc(count()))
        .limit(10);

    return result.map(r => ({ path: r.path, count: r.visits }));
}
