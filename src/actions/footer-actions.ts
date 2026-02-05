"use server";

import { db } from "@/db";
import { footerSections, footerLinks, footerConfig } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// ===== Footer Sections =====
export async function getFooterSections() {
    return await db.query.footerSections.findMany({
        where: eq(footerSections.isActive, true),
        orderBy: [asc(footerSections.order)],
    });
}

export async function getAdminFooterSections() {
    return await db.query.footerSections.findMany({
        orderBy: [asc(footerSections.order)],
    });
}

export async function createFooterSection(data: any) {
    await db.insert(footerSections).values({
        sectionTitle: data.sectionTitle,
        order: Number(data.order) || 0,
        isActive: true,
    });
    revalidatePath("/");
    revalidatePath("/admin/footer");
}

export async function updateFooterSection(id: number, data: any) {
    await db.update(footerSections).set({
        sectionTitle: data.sectionTitle,
        order: Number(data.order),
        isActive: Boolean(data.isActive),
    }).where(eq(footerSections.id, id));

    revalidatePath("/");
    revalidatePath("/admin/footer");
}

export async function deleteFooterSection(id: number) {
    // Also delete all links in this section
    await db.delete(footerLinks).where(eq(footerLinks.sectionId, id));
    await db.delete(footerSections).where(eq(footerSections.id, id));
    revalidatePath("/");
    revalidatePath("/admin/footer");
}

// ===== Footer Links =====
export async function getFooterLinks(sectionId?: number) {
    if (sectionId) {
        return await db.query.footerLinks.findMany({
            where: eq(footerLinks.sectionId, sectionId),
            orderBy: [asc(footerLinks.order)],
        });
    }
    return await db.query.footerLinks.findMany({
        orderBy: [asc(footerLinks.order)],
    });
}

export async function getAdminFooterLinks() {
    return await db.query.footerLinks.findMany({
        orderBy: [asc(footerLinks.order)],
    });
}

export async function createFooterLink(data: any) {
    await db.insert(footerLinks).values({
        sectionId: Number(data.sectionId),
        text: data.text,
        link: data.link,
        order: Number(data.order) || 0,
        isActive: true,
    });
    revalidatePath("/");
    revalidatePath("/admin/footer");
}

export async function updateFooterLink(id: number, data: any) {
    await db.update(footerLinks).set({
        sectionId: Number(data.sectionId),
        text: data.text,
        link: data.link,
        order: Number(data.order),
        isActive: Boolean(data.isActive),
    }).where(eq(footerLinks.id, id));

    revalidatePath("/");
    revalidatePath("/admin/footer");
}

export async function deleteFooterLink(id: number) {
    await db.delete(footerLinks).where(eq(footerLinks.id, id));
    revalidatePath("/");
    revalidatePath("/admin/footer");
}

// ===== Footer Config =====
export async function getFooterConfig() {
    const configs = await db.query.footerConfig.findMany();
    return configs.reduce((acc: any, item: any) => {
        acc[item.key] = item.value;
        return acc;
    }, {});
}

export async function getAdminFooterConfig() {
    return await db.query.footerConfig.findMany();
}

export async function updateFooterConfig(key: string, value: string) {
    await db.insert(footerConfig).values({ key, value, description: '' })
        .onConflictDoUpdate({
            target: footerConfig.key,
            set: { value }
        });
    revalidatePath("/");
    revalidatePath("/admin/footer");
}

// ===== Combined Data for Frontend =====
export async function getFooterData() {
    const sections = await getFooterSections();
    const allLinks = await db.query.footerLinks.findMany({
        where: eq(footerLinks.isActive, true),
        orderBy: [asc(footerLinks.order)],
    });
    const config = await getFooterConfig();

    // Group links by section
    const sectionsWithLinks = sections.map(section => ({
        ...section,
        links: allLinks.filter(link => link.sectionId === section.id)
    }));

    return {
        sections: sectionsWithLinks,
        config
    };
}
