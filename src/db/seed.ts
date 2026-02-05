import { db } from './index';
import { users, heroSlides, games, announcements, events, siteConfig } from './schema';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

async function main() {
    console.log('Seeding database...');

    // 1. Create Admin User
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await db.insert(users).values({
        id: uuidv4(),
        username: 'admin',
        password: hashedPassword,
        name: 'Op Admin',
        role: 'admin',
    }).onConflictDoNothing();
    console.log('Admin user created');

    // 2. Hero Slides
    await db.delete(heroSlides); // Clear existing
    await db.insert(heroSlides).values([
        {
            title: "古老遺跡：黃金黎明",
            subtitle: "探索神秘森林，尋找傳說中的寶藏。本月限定活動開啟！",
            imageUrl: "/images/hero_banner_fantasy.png",
            color: "from-amber-500",
            link: "/games/fantasy",
            order: 1,
            isActive: true,
        },
        {
            title: "賽博地平線：新東京",
            subtitle: "霓虹閃爍的未來都市，建立你的商業帝國。",
            imageUrl: "/images/hero_banner_sci_fi.png",
            color: "from-cyan-500",
            link: "/games/cyberpunk",
            order: 2,
            isActive: true,
        },
    ]);
    console.log('Hero slides seeded');

    // 3. Games
    await db.delete(games);
    await db.insert(games).values([
        {
            id: "slot-001",
            name: "黃金老虎機",
            category: "電子",
            imageUrl: "/images/game_icon_slot.png",
            isHot: true,
            order: 1,
            isActive: true,
        },
        {
            id: "poker-001",
            name: "皇家撲克",
            category: "棋牌",
            imageUrl: "/images/game_icon_cards.png",
            isHot: true,
            order: 2,
            isActive: true,
        },
        {
            id: "fish-001",
            name: "深海捕魚",
            category: "捕魚",
            imageUrl: "/images/hero_banner_fantasy.png",
            isHot: false,
            order: 3,
            isActive: true,
        },
        {
            id: "cyber-001",
            name: "賽博賽車",
            category: "競速",
            imageUrl: "/images/hero_banner_sci_fi.png",
            isHot: true,
            order: 4,
            isActive: true,
        },
    ]);
    console.log('Games seeded');

    // 4. Announcements
    await db.delete(announcements);
    await db.insert(announcements).values([
        {
            title: "【維護】2026/02/10 伺服器例行性維護公告",
            content: "伺服器將於 02/10 上午 10:00 進行維護...",
            type: "system",
            date: "02/05",
            isImportant: true,
            isActive: true,
        },
        {
            title: "【活動】春節儲值加碼送，最高回饋 20%",
            content: "新春活動開啟...",
            type: "activity",
            date: "02/04",
            isImportant: true,
            isActive: true,
        },
        {
            title: "【恭喜】玩家「阿**」於《賽博賽車》中贏得 50,000 點數",
            content: "恭喜玩家...",
            type: "winner",
            date: "02/03",
            isImportant: false,
            isActive: true,
        },
    ]);
    console.log('Announcements seeded');

    // 5. Events
    await db.delete(events);
    await db.insert(events).values([
        {
            title: "新會員好禮",
            imageUrl: "/images/event_banner_new_member.png",
            link: "/events/new-member",
            order: 1,
            isActive: true,
        },
        {
            title: "VIP 專屬尊榮",
            imageUrl: "/images/event_banner_vip.png",
            link: "/vip",
            order: 2,
            isActive: true,
        },
    ]);
    console.log('Events seeded');

    // 6. Site Config
    await db.insert(siteConfig).values([
        { key: 'footer_text', value: '© 2026 好利來 Haolilai. All rights reserved.', description: '頁尾版權文字' },
        { key: 'contact_line', value: '@haolilai888', description: 'Line 客服 ID' },
    ]).onConflictDoNothing();
    console.log('Site config seeded');

    console.log('Database seeding completed!');
}

main().catch((err) => {
    console.error('Seeding failed:', err);
    process.exit(1);
});
