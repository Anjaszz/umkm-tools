import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "UMKM Tools AI - Solusi Cerdas Bisnis Digital",
    template: "%s | UMKM Tools AI"
  },
  description: "Gunakan kecerdasan buatan untuk meningkatkan jualan UMKM Anda. Buat caption viral, deskripsi produk otomatis, hingga edit foto produk kualitas studio dengan mudah.",
  keywords: ["UMKM", "AI", "Bisnis Digital", "Foto Produk", "Caption Instagram", "Deskripsi Produk", "Shopee", "Tokopedia", "TikTok", "Background Remover", "Indonesia", "Kecerdasan Buatan"],
  authors: [{ name: "Anjaszz" }],
  creator: "Anjaszz",
  publisher: "Anjaszz",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://umkm-tools-ai.vercel.app'), // Placeholder, replace with actual URL if known
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "UMKM Tools AI - Solusi Cerdas Bisnis Digital",
    description: "Tingkatkan jualan UMKM Anda dengan kekuatan asisten AI terintegrasi.",
    url: 'https://umkm-tools-ai.vercel.app',
    siteName: 'UMKM Tools AI',
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "UMKM Tools AI - Solusi Cerdas Bisnis Digital",
    description: "Tingkatkan jualan UMKM Anda dengan kekuatan asisten AI terintegrasi.",
    creator: '@anjaszz',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport = {
  themeColor: '#2ECC71',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
