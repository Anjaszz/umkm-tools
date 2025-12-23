import { Metadata } from "next";

export const metadata: Metadata = {
    title: "AI Smart Mockup - Tempel Logo ke Produk Realistis",
    description: "Buat mockup produk profesional hanya dengan mengunggah desain dan foto produk polos Anda. AI akan menggabungkannya secara sempurna.",
    openGraph: {
        title: "AI Smart Mockup - Tempel Logo ke Produk Realistis",
        description: "Buat mockup produk profesional hanya dengan mengunggah desain dan foto produk polos Anda. AI akan menggabungkannya secara sempurna.",
    }
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
