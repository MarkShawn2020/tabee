import DeployButton from "@/components/deploy-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import HeaderAuth from "@/components/header-auth";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import { Suspense } from "react";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Tabee - 智能表格阅读助手",
  description: "让手机端Excel表格阅读变得简单高效，支持智能重排和多工作表切换",
  keywords: "Excel, 表格阅读, 移动端优化, 智能重排",
};

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="w-screen min-h-screen flex flex-col items-center">
            <div className="flex-1 w-full flex flex-col gap-8 items-center">
              <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16 backdrop-blur-sm bg-background/80 fixed top-0 z-50">
                <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5">
                  <div className="flex gap-5 items-center">
                    <Link href={"/"} className="flex items-center gap-2">
                      <span className="font-bold text-xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Tabee</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary hidden sm:inline-block">Beta</span>
                    </Link>
                  </div>
                  <div className="flex items-center gap-4">
                    <ThemeSwitcher />
                    {!hasEnvVars ? (
                      <EnvVarWarning />
                    ) : (
                      <Suspense fallback={<div>Loading...</div>}>
                        <HeaderAuth />
                      </Suspense>
                    )}
                  </div>
                </div>
              </nav>
              <div className="w-full flex flex-col gap-8 max-w-5xl p-5 mt-16">
                {children}
              </div>

              <footer className="w-full border-t bg-muted/30">
                <div className="max-w-5xl mx-auto py-8 px-5">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                    <div className="space-y-3">
                      <h3 className="font-semibold">关于 Tabee</h3>
                      <p className="text-sm text-muted-foreground">专注于优化手机端Excel表格阅读体验的智能工具，让数据阅读更轻松。</p>
                    </div>
                    <div className="space-y-3">
                      <h3 className="font-semibold">功能特性</h3>
                      <ul className="text-sm text-muted-foreground space-y-2">
                        <li>✨ 智能表格重排</li>
                        <li>📱 移动优先设计</li>
                        <li>🔄 多工作表切换</li>
                        <li>🎨 深色模式支持</li>
                      </ul>
                    </div>
                    <div className="space-y-3">
                      <h3 className="font-semibold">联系我们</h3>
                      <div className="text-sm text-muted-foreground space-y-2">
                        <p>
                          <a href="https://github.com/markshawn2020" target="_blank" rel="noreferrer" className="hover:underline">
                            GitHub
                          </a>
                        </p>
                        <p>Created by AI超级川</p>
                      </div>
                    </div>
                  </div>
                </div>
              </footer>
            </div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
