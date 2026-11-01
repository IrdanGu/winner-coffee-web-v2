import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Newsreader } from "next/font/google";
import "./globals.css";
import { Navbar } from "../components/navbar";
import { Footer } from "../components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Winner Coffee — Kafe, Ruang Karaoke & Studio Musik Kuningan",
  description:
    "Kanal resmi informasi katalog menu serta reservasi ruang karaoke privat dan studio musik Winner Coffee di Kuningan, Jawa Barat.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${newsreader.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-[#F9F4EE] text-[#111111] font-sans antialiased selection:bg-[#108474] selection:text-white">
        <Suspense fallback={<div className="h-16 w-full bg-[#F9F4EE]" />}>
          <Navbar />
        </Suspense>
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
