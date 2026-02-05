"use server";

import { db } from "@/db";
import { socialLinks } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getActiveSocialLinks() {
    return await db.query.socialLinks.findMany({
        where: eq(socialLinks.isActive, true),
        orderBy: [asc(socialLinks.order)],
    });
}

export async function getAllSocialLinks() {
    return await db.query.socialLinks.findMany({
        orderBy: [asc(socialLinks.order)],
    });
}

export async function updateSocialLink(id: number, data: Partial<typeof socialLinks.$inferInsert>) {
    await db.update(socialLinks)
        .set(data)
        .where(eq(socialLinks.id, id));

    revalidatePath("/");
    revalidatePath("/admin/settings");
}
