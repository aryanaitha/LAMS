import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "LAMS — Land Acquisition Monitoring System | Government of India",
  description:
    "National platform for end-to-end digital monitoring and decision support of land acquisition (Ministry of Rural Development, Dept. of Land Resources).",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased selection:bg-amber-500 selection:text-white">
        <AuthProvider>
          <LanguageProvider>
            <Navbar />
            <main className="flex-1 flex flex-col">{children}</main>
            <Footer />
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
