import { Metadata } from "next";

export const metadata: Metadata = {
    title: "AI Logo Generator - Buat Logo Brand UMKM Profesional",
    description: "Buat logo profesional untuk brand UMKM Anda dalam hitungan detik dengan teknologi AI. Mudah, cepat, dan berkualitas tinggi.",
    openGraph: {
        title: "AI Logo Generator - Buat Logo Brand UMKM Profesional",
        description: "Buat logo profesional untuk brand UMKM Anda dalam hitungan detik dengan teknologi AI. Mudah, cepat, dan berkualitas tinggi.",
    }
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
