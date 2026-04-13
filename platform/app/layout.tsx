import "./globals.css";
import CloudflareAnalytics from "../components/CloudflareAnalytics";

import { AuthProvider } from "@/lib/auth-context";

export const metadata = {
  title: "PathGen Developer Platform",
  description: "Professional-grade Fortnite replay parsing, real-time telemetry, and advanced analytics for developers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col" style={{ margin: 0, padding: 0 }}>
        <AuthProvider>
          {children}
        </AuthProvider>
        <CloudflareAnalytics />
      </body>
    </html>
  );
}
