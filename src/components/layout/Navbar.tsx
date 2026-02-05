import Link from "next/link";
import { getNavbarItems } from "@/actions/navbar-actions";
import { Menu, Gift, Coins, Phone, Crown, Home, Download, Gamepad2, Headphones, CreditCard } from "lucide-react";

// Map string icon names to Lucide components
const IconMap: any = {
    Home,
    Gamepad2,
    Coins,
    Phone,
    Gift,
    Crown,
    Download,
    Headphones,
    CreditCard
};

export async function Navbar() {
    const items = await getNavbarItems();

    // Separate items by type
    const logo = items.find(i => i.type === 'logo') || { text: 'HAOLILAI', link: '/' };
    const links = items.filter(i => i.type === 'link');
    const ctas = items.filter(i => i.type === 'cta');

    return (
        <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-md">
            <div className="container mx-auto flex h-20 items-center justify-between px-4">
                {/* Logo */}
                <Link href={logo.link || '/'} className="flex items-center gap-2">
                    <div className="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-600">
                        {logo.text}
                    </div>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8 text-sm font-bold tracking-wide text-slate-300">
                    {links.map((item) => {
                        const Icon = item.icon ? IconMap[item.icon] : null;
                        return (
                            <Link key={item.id} href={item.link || '#'} className="hover:text-amber-400 transition-colors flex items-center gap-1">
                                {Icon && <Icon className="w-4 h-4" />}
                                {item.text}
                            </Link>
                        );
                    })}
                </nav>

                {/* Action Button */}
                <div className="hidden md:flex items-center gap-4">
                    {ctas.map((item) => {
                        const Icon = item.icon ? IconMap[item.icon] : null;
                        return (
                            <Link
                                key={item.id}
                                href={item.link || '#'}
                                className="flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-yellow-600 px-6 py-2.5 text-sm font-bold text-black shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 transition-all hover:scale-105"
                            >
                                {Icon && <Icon className="w-4 h-4" />}
                                {item.text}
                            </Link>
                        );
                    })}
                </div>

                {/* Mobile Menu Button - Placeholders for now */}
                <button className="md:hidden p-2 text-slate-300">
                    <Menu className="h-6 w-6" />
                </button>
            </div>
        </header>
    );
}
