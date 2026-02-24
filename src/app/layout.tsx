import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const playfair = Playfair_Display({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "700"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Karatas Antik — Prabangūs juvelyriniai dirbiniai",
  description:
    "Karatas Antik — auksiniai ir sidabriniai juvelyrikos dirbiniai, antikvariatas. Vilnius, Lietuva.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="lt" className={`${playfair.variable} ${inter.variable}`}>
      <body className="antialiased bg-[#0f0f0f] text-gray-100 font-inter">
        <Header />
        {/* Spacer to clear the fixed header */}
        <div className="h-16 md:h-[148px]" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
