"use server";

import { db } from "@/db";
import { navbarItems } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getNavbarItems() {
    return await db.query.navbarItems.findMany({
        where: eq(navbarItems.isActive, true),
        orderBy: [asc(navbarItems.order)],
    });
}

export async function getAdminNavbarItems() {
    return await db.query.navbarItems.findMany({
        orderBy: [asc(navbarItems.order)],
    });
}

export async function createNavbarItem(data: any) {
    await db.insert(navbarItems).values({
        type: data.type,
        text: data.text,
        link: data.link,
        icon: data.icon,
        order: Number(data.order) || 0,
        isActive: true,
        style: data.style ? JSON.stringify(data.style) : null,
    });
    revalidatePath("/");
    revalidatePath("/admin/navbar");
}

export async function updateNavbarItem(id: number, data: any) {
    await db.update(navbarItems).set({
        type: data.type,
        text: data.text,
        link: data.link,
        icon: data.icon,
        order: Number(data.order),
        isActive: Boolean(data.isActive),
        style: data.style ? JSON.stringify(data.style) : null,
    }).where(eq(navbarItems.id, id));

    revalidatePath("/");
    revalidatePath("/admin/navbar");
}

export async function deleteNavbarItem(id: number) {
    await db.delete(navbarItems).where(eq(navbarItems.id, id));
    revalidatePath("/");
    revalidatePath("/admin/navbar");
}

export async function reorderNavbarItems(items: { id: number; order: number }[]) {
    for (const item of items) {
        await db.update(navbarItems)
            .set({ order: item.order })
            .where(eq(navbarItems.id, item.id));
    }
    revalidatePath("/");
    revalidatePath("/admin/navbar");
}
