"use server";

import { db } from "@/db";
import { announcements } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getPublicNews() {
    return await db.query.announcements.findMany({
        where: eq(announcements.isActive, true),
        orderBy: [desc(announcements.isImportant), desc(announcements.date)],
        limit: 20,
    });
}

export async function getAdminNews() {
    return await db.query.announcements.findMany({
        orderBy: [desc(announcements.date)],
    });
}

export async function createNews(data: {
    title: string;
    content: string;
    type: string;
    date: string;
    imageUrl?: string;
    link?: string;
    isImportant: boolean;
}) {
    await db.insert(announcements).values({
        ...data,
        isActive: true,
    });
    revalidatePath("/");
    revalidatePath("/admin/news");
}

export async function updateNews(id: number, data: Partial<typeof announcements.$inferInsert>) {
    await db.update(announcements)
        .set(data)
        .where(eq(announcements.id, id));

    revalidatePath("/");
    revalidatePath("/admin/news");
}

export async function deleteNews(id: number) {
    await db.delete(announcements).where(eq(announcements.id, id));
    revalidatePath("/");
    revalidatePath("/admin/news");
}
