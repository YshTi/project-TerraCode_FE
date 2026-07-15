import type { Metadata } from "next";
import { Montserrat } from "next/font/google";

import "modern-normalize/modern-normalize.css";
import "@/styles/variables.css";
import "@/styles/reset.css";
import "@/styles/global.css";

import { AppShell } from "@/components/app-shell/app-shell";
import { TanStackProvider } from "@/providers/tanstack-provider";
import { AuthProvider } from "@/providers/auth-provider";
import { AppToaster } from "@/components/toaster/toaster";

import { ThemeProvider } from "@/providers/theme-provider";

const montserrat = Montserrat({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-main",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Природні Мандри",
  description: "Еко-мандри Україною для натхнення",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk" className={montserrat.variable}>
      <body>
        <ThemeProvider>
          <TanStackProvider>
            <AuthProvider>
              <AppShell>
                {children}
                <AppToaster />
              </AppShell>
            </AuthProvider>
          </TanStackProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}