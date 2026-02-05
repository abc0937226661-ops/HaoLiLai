import Link from "next/link";
import {
    LayoutDashboard,
    Images,
    Gamepad2,
    Megaphone,
    Settings,
    LogOut,
    Menu,
    Activity,
    ScrollText,
    Gift,
    Music,
} from "lucide-react";
import { signOut } from "@/auth";
import { Button } from "@/components/ui/button";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-slate-950 text-slate-200">
            {/* Sidebar */}
            <aside className="w-64 border-r border-slate-800 bg-slate-900 flex flex-col">
                <div className="p-6 border-b border-slate-800">
                    <Link href="/admin/dashboard" className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-bold">
                            H
                        </div>
                        <span className="text-xl font-bold text-white tracking-tight">
                            HAOLILAI ADMIN
                        </span>
                    </Link>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    <NavItem href="/admin/dashboard" icon={<LayoutDashboard />} label="總覽儀表板" />
                    <NavItem href="/admin/navbar" icon={<Menu />} label="導航列管理" />
                    <NavItem href="/admin/hero" icon={<Images />} label="輪播圖管理" />
                    <NavItem href="/admin/events" icon={<Gift />} label="常駐活動管理" />
                    <NavItem href="/admin/games" icon={<Gamepad2 />} label="遊戲列表管理" />
                    <NavItem href="/admin/news" icon={<Megaphone />} label="公告與活動" />
                    <NavItem href="/admin/music" icon={<Music />} label="音樂管理" />
                    <NavItem href="/admin/footer" icon={<Settings />} label="頁尾管理" />
                    <NavItem href="/admin/logs" icon={<ScrollText />} label="流量瀏覽紀錄" />
                    <NavItem href="/admin/settings" icon={<Settings />} label="網站全域設定" />
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <form
                        action={async () => {
                            "use server";
                            await signOut();
                        }}
                    >
                        <Button
                            variant="outline"
                            className="w-full justify-start gap-2 border-slate-700 bg-slate-800/50 hover:bg-red-900/20 hover:text-red-400 hover:border-red-900"
                        >
                            <LogOut className="h-4 w-4" />
                            登出系統
                        </Button>
                    </form>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto bg-slate-950">
                <div className="h-full p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}

function NavItem({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
    return (
        <Link
            href={href}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-400 transition-all hover:bg-slate-800 hover:text-amber-400"
        >
            <span className="h-5 w-5">{icon}</span>
            <span className="font-medium">{label}</span>
        </Link>
    );
}
