import { Metadata } from "next";

export const metadata: Metadata = {
    title: "AI Photo Studio - Ubah Foto Produk HP Jadi Profesional",
    description: "Ubah foto produk Anda yang biasa saja menjadi kualitas studio profesional dengan AI. Cocok untuk katalog Shopee, Tokopedia, dan Instagram.",
    openGraph: {
        title: "AI Photo Studio - Ubah Foto Produk HP Jadi Profesional",
        description: "Ubah foto produk Anda yang biasa saja menjadi kualitas studio profesional dengan AI. Cocok untuk katalog Shopee, Tokopedia, dan Instagram.",
    }
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
