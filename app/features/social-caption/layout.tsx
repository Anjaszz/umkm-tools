import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Social Caption Generator - Buat Caption Viral Otomatis",
    description: "Hasilkan caption Instagram, TikTok, dan Facebook yang menarik dan viral hanya dalam hitungan detik dengan asisten AI.",
    openGraph: {
        title: "Social Caption Generator - Buat Caption Viral Otomatis",
        description: "Hasilkan caption Instagram, TikTok, dan Facebook yang menarik dan viral hanya dalam hitungan detik dengan asisten AI.",
    }
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
