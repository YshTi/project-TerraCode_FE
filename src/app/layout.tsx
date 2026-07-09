import type { Metadata } from "next";
import { Montserrat } from "next/font/google";

import "modern-normalize/modern-normalize.css";
import "@/styles/variables.css";
import "@/styles/reset.css";
import "@/styles/global.css";

import { AuthProvider } from "@/contexts/auth-context";
import { Header } from "@/components/header/header";
import { Footer } from "@/components/footer/footer";

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
        <AuthProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}