import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "AI Poster Generator - Buat Desain Promosi Instan",
    description: "Buat poster, banner, dan gambar promosi profesional untuk UMKM dengan bantuan AI. Cukup masukkan detail produk dan pilih gaya desain.",
};

export default function PosterGeneratorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
