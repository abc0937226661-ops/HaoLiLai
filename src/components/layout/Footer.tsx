import Link from "next/link";
import { Rocket } from "lucide-react";
import { getFooterData } from "@/actions/footer-actions";

export async function Footer() {
    const { sections, config } = await getFooterData();

    return (
        <footer className="border-t bg-white dark:bg-slate-950">
            <div className="container mx-auto px-4 py-12 md:py-16">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                    {/* Logo and Description */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-xl font-bold text-primary">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
                                <Rocket className="h-5 w-5" />
                            </div>
                            <span>{config.logo_text || '好利來'}</span>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            {config.description || '您值得信賴的遊戲幣交易平台。安全、快速、透明。'}
                        </p>
                    </div>

                    {/* Dynamic Sections */}
                    {sections.map((section: any) => (
                        <div key={section.id}>
                            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-100">
                                {section.sectionTitle}
                            </h3>
                            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                                {section.links.map((link: any) => (
                                    <li key={link.id}>
                                        <Link href={link.link} className="hover:text-primary">
                                            {link.text}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Copyright */}
                <div className="mt-12 border-t pt-8 text-center text-sm text-slate-500">
                    <p>&copy; {new Date().getFullYear()} {config.copyright || '好利來 Haolilai. All rights reserved.'}</p>
                </div>
            </div>
        </footer>
    );
}
