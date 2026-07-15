import { ThemeProvider } from "@/providers/theme-provider";

type AuthLayoutProps = {
  children: React.ReactNode;
};

export default function AuthLayout({
  children,
}: AuthLayoutProps) {
  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  );
}