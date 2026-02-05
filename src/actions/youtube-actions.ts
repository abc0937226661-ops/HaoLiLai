"use server";

import { db } from "@/db";
import { youtubeVideos } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getActiveVideos() {
    return await db.query.youtubeVideos.findMany({
        where: eq(youtubeVideos.isActive, true),
        orderBy: [asc(youtubeVideos.order)],
    });
}

export async function getAllVideos() {
    return await db.query.youtubeVideos.findMany({
        orderBy: [asc(youtubeVideos.order)],
    });
}

export async function createVideo(data: {
    title: string;
    youtubeId: string;
    order: number;
    isActive?: boolean;
}) {
    await db.insert(youtubeVideos).values({
        title: data.title,
        youtubeId: data.youtubeId,
        order: data.order,
        isActive: data.isActive ?? true,
    });
    revalidatePath("/");
    revalidatePath("/admin/music");
}

export async function updateVideo(id: number, data: Partial<typeof youtubeVideos.$inferInsert>) {
    await db.update(youtubeVideos)
        .set(data)
        .where(eq(youtubeVideos.id, id));

    revalidatePath("/");
    revalidatePath("/admin/music");
}

export async function deleteVideo(id: number) {
    await db.delete(youtubeVideos).where(eq(youtubeVideos.id, id));
    revalidatePath("/");
    revalidatePath("/admin/music");
}
