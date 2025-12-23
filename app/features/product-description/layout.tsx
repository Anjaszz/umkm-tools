import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Product Description Generator - Deskripsi Produk Persuasif",
    description: "Buat deskripsi produk yang menjual untuk Shopee dan Tokopedia secara otomatis. Tingkatkan konversi penjualan UMKM Anda.",
    openGraph: {
        title: "Product Description Generator - Deskripsi Produk Persuasif",
        description: "Buat deskripsi produk yang menjual untuk Shopee dan Tokopedia secara otomatis. Tingkatkan konversi penjualan UMKM Anda.",
    }
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
