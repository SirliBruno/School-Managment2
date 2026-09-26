import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { ToastProvider } from "@/context/ToastContext";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "600", "700", "800", "900"],
  variable: "--font-cairo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "منصة الغياب والمساءلات الإدارية | نظام الإدارة المدرسية",
  description: "المنصة الإدارية الموحدة لإدارة ورصد غياب وتأخر المعلمات وإصدار المساءلات وقرارات الحسم",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={cairo.variable}>
      <body className="font-cairo antialiased bg-slate-50 text-slate-900 min-h-screen">
        <ErrorBoundary>
          <QueryProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </QueryProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
