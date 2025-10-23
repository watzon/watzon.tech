import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AppLayout from "@/components/layout/AppLayout";
import { PhosphorProvider } from "@/contexts/PhosphorContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Watzon - Senior Software Engineer",
  description: "Terminal-style portfolio of a Senior Software Engineer specializing in Rust, Go, and distributed systems",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-mono antialiased`}>
        <PhosphorProvider>
          <AppLayout>
            {children}
          </AppLayout>
        </PhosphorProvider>
      </body>
    </html>
  );
}
