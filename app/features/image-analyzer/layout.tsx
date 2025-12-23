import { Metadata } from "next";

export const metadata: Metadata = {
    title: "AI Image Analyzer - Bedah Fitur Produk dari Foto",
    description: "Analisis fitur unik dan keunggulan produk Anda hanya dengan mengunggah foto. Dapatkan insight pemasaran instan.",
    openGraph: {
        title: "AI Image Analyzer - Bedah Fitur Produk dari Foto",
        description: "Analisis fitur unik dan keunggulan produk Anda hanya dengan mengunggah foto. Dapatkan insight pemasaran instan.",
    }
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
