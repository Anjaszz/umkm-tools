import { Metadata } from "next";

export const metadata: Metadata = {
    title: "CS Template Generator - Balas Chat Customer Lebih Cepat",
    description: "Template balasan chat customer yang ramah, profesional, dan persuasif untuk meningkatkan layanan pelanggan UMKM.",
    openGraph: {
        title: "CS Template Generator - Balas Chat Customer Lebih Cepat",
        description: "Template balasan chat customer yang ramah, profesional, dan persuasif untuk meningkatkan layanan pelanggan UMKM.",
    }
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
