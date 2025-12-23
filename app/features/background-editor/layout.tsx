import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Background Remover - Hapus & Ganti Latar Belakang Foto",
    description: "Hapus latar belakang foto produk yang berantakan dengan rapi dan cepat. Ganti dengan warna estetik untuk jualan.",
    openGraph: {
        title: "Background Remover - Hapus & Ganti Latar Belakang Foto",
        description: "Hapus latar belakang foto produk yang berantakan dengan rapi dan cepat. Ganti dengan warna estetik untuk jualan.",
    }
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
