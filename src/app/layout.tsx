import "./globals.css";
import type { ReactNode } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AnalyticsTracker } from "@/components/AnalyticsTracker";
import { ViewModeProvider } from "@/contexts/ViewModeContext";
import ViewModeToggle from "@/components/ViewModeToggle";

export const metadata = {
  title: "好利來 | 遊戲幣交易首選平台",
  description: "全台最安全、快速的遊戲幣交易平台，提供多種熱門遊戲貨幣買賣服務。",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-Hant">
      <body className="flex min-h-screen flex-col font-sans antialiased bg-background text-foreground">
        <ViewModeProvider>
          <Navbar />
          <main className="flex-1 pt-16">
            {children}
          </main>
          <Footer />
          <AnalyticsTracker />
          <ViewModeToggle />
        </ViewModeProvider>
      </body>
    </html>
  );
}
