"use server";

import { db } from "@/db";
import { games } from "@/db/schema";
import { eq, asc, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";

export async function getPublicGames() {
    return await db.query.games.findMany({
        where: eq(games.isActive, true),
        orderBy: [desc(games.isHot), asc(games.order)],
    });
}

export async function getAdminGames() {
    return await db.query.games.findMany({
        orderBy: [desc(games.isHot), asc(games.order)],
    });
}

export async function createGame(data: {
    name: string;
    category: string;
    imageUrl: string;
    isHot: boolean;
    order: number;
}) {
    await db.insert(games).values({
        id: uuidv4(),
        ...data,
        isActive: true, // Default active
    });
    revalidatePath("/");
    revalidatePath("/admin/games");
}

export async function updateGame(id: string, data: Partial<typeof games.$inferInsert>) {
    await db.update(games)
        .set(data)
        .where(eq(games.id, id));

    revalidatePath("/");
    revalidatePath("/admin/games");
}

export async function deleteGame(id: string) {
    await db.delete(games).where(eq(games.id, id));
    revalidatePath("/");
    revalidatePath("/admin/games");
}
