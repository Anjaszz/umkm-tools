"use client";

import Link from "next/link";
import {
    SparklesIcon,
    PhotoIcon,
    ChatBubbleLeftRightIcon,
    MegaphoneIcon,
    TagIcon,
    SwatchIcon,
    ArrowsPointingOutIcon
} from "@heroicons/react/24/outline";

interface Feature {
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    href: string;
    category: string;
    status?: "available" | "coming-soon";
}

const features: Feature[] = [
    // Konten & Branding
    {
        title: "Generator Deskripsi & judul Produk",
        description: "Buat deskripsi & judul produk yang menarik dan persuasif secara otomatis dengan AI",
        icon: SparklesIcon,
        href: "/features/product-description",
        category: "Konten & Branding",
        status: "available"
    },
    {
        title: "Generator Caption Sosmed",
        description: "Buat caption viral untuk IG, TikTok, FB dengan hashtag otomatis",
        icon: MegaphoneIcon,
        href: "/features/social-caption",
        category: "Konten & Branding",
        status: "available"
    },

    {
        title: "Generator Judul & Deskripsi dari Gambar",
        description: "Upload foto produk dan buat judul/deskripsi menarik otomatis untuk marketplace",
        icon: SparklesIcon,
        href: "/features/image-analyzer",
        category: "Konten & Branding",
        status: "available"
    },

    // Visual & Media
    {
        title: "Background Remover",
        description: "Hapus background dan ganti dengan latar yang profesional (putih, merah, dll)",
        icon: SwatchIcon,
        href: "/features/background-editor",
        category: "Visual & Media",
        status: "available"
    },
    {
        title: "Enhance Foto Produk (AI Studio)",
        description: "Ubah foto produk biasa menjadi foto studio profesional dengan teknologi AI Generatif",
        icon: PhotoIcon,
        href: "/features/photo-enhancer",
        category: "Visual & Media",
        status: "available"
    },
    {
        title: "Generator Logo Instan",
        description: "Buat logo profesional untuk brand UMKM Anda dalam hitungan detik",
        icon: SwatchIcon,
        href: "/features/logo-generator",
        category: "Visual & Media",
        status: "available"
    },
    {
        title: "Smart Mockup Creator",
        description: "Tempelkan logo/desain Anda ke produk fisik (kaos, botol, dll) secara realistis dengan AI",
        icon: ArrowsPointingOutIcon,
        href: "/features/smart-mockup",
        category: "Visual & Media",
        status: "available"
    },
    {
        title: "AI Poster & Banner Generator",
        description: "Buat poster promosi, banner media sosial, dan materi iklan dari foto produk Anda",
        icon: MegaphoneIcon,
        href: "/features/poster-generator",
        category: "Visual & Media",
        status: "available"
    },

    // Customer Service
    {
        title: "Template Customer Service",
        description: "Template balasan CS yang ramah, profesional, dan persuasif",
        icon: ChatBubbleLeftRightIcon,
        href: "/features/cs-templates",
        category: "Customer Service",
        status: "available"
    }
];

const categories = Array.from(new Set(features.map(f => f.category)));

export default function Dashboard() {
    return (
        <div className="min-h-screen bg-[#E8ECEF]">
            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="mb-10">
                    <h1 className="text-3xl font-black text-[#1a1f24] tracking-tight">
                        Pusat Kontrol <span className="text-[#2ECC71]">Tools AI</span>
                    </h1>
                    <p className="text-gray-600 font-medium">Selamat datang kembali! Pilih tool yang ingin Anda gunakan hari ini.</p>
                </div>

                {categories.map((category) => (
                    <div key={category} className="mb-12">
                        <h2 className="text-xl font-extrabold text-[#1a1f24] mb-6 flex items-center gap-2">
                            <span className="w-2 h-8 bg-[#2ECC71] rounded-full"></span>
                            {category}
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {features
                                .filter((feature) => feature.category === category)
                                .map((feature) => {
                                    const Icon = feature.icon;
                                    const isAvailable = feature.status === "available";

                                    return (
                                        <Link
                                            key={feature.title}
                                            href={isAvailable ? feature.href : "#"}
                                            className={`group relative clay-card overflow-hidden transition-all duration-300 ${isAvailable
                                                ? "hover:scale-[1.02] cursor-pointer"
                                                : "cursor-not-allowed opacity-60"
                                                }`}
                                        >
                                            <div className="p-6">
                                                {/* Status Badge */}
                                                {!isAvailable && (
                                                    <div className="absolute top-4 right-4">
                                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 shadow-sm">
                                                            Coming Soon
                                                        </span>
                                                    </div>
                                                )}

                                                {/* Icon with Clay Effect */}
                                                <div className="flex items-center justify-center w-14 h-14 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300"
                                                    style={{
                                                        background: 'linear-gradient(135deg, #2ECC71 0%, #27ae60 100%)',
                                                        boxShadow: '4px 4px 10px rgba(46, 204, 113, 0.3), -2px -2px 6px rgba(255, 255, 255, 0.8), inset 1px 1px 2px rgba(255, 255, 255, 0.4)'
                                                    }}>
                                                    <Icon className="w-7 h-7 text-white" />
                                                </div>

                                                {/* Content */}
                                                <h3 className="text-lg font-bold text-[#1a1f24] mb-2 group-hover:text-[#2ECC71] transition-colors">
                                                    {feature.title}
                                                </h3>
                                                <p className="text-gray-700 text-sm leading-relaxed font-medium">
                                                    {feature.description}
                                                </p>

                                                {/* Hover Arrow */}
                                                {isAvailable && (
                                                    <div className="mt-4 flex items-center text-[#2ECC71] text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                        Mulai Gunakan
                                                        <svg
                                                            className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M9 5l7 7-7 7"
                                                            />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                        </Link>
                                    );
                                })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
