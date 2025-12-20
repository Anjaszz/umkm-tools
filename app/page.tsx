"use client";

import Link from "next/link";
import {
  SparklesIcon,
  PhotoIcon,
  ChatBubbleLeftRightIcon,
  MegaphoneIcon,
  TagIcon,
  SwatchIcon
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

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            UMKM Tools AI
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Kumpulan tools AI untuk membantu bisnis UMKM Anda berkembang lebih cepat
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {categories.map((category) => (
          <div key={category} className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
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
                      className={`group relative bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden ${isAvailable
                        ? "hover:scale-105 cursor-pointer"
                        : "cursor-not-allowed opacity-75"
                        }`}
                    >
                      <div className="p-6">
                        {/* Status Badge */}
                        {!isAvailable && (
                          <div className="absolute top-4 right-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                              Coming Soon
                            </span>
                          </div>
                        )}

                        {/* Icon */}
                        <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg mb-4 group-hover:scale-110 transition-transform duration-300">
                          <Icon className="w-6 h-6 text-white" />
                        </div>

                        {/* Content */}
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          {feature.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm">
                          {feature.description}
                        </p>

                        {/* Hover Arrow */}
                        {isAvailable && (
                          <div className="mt-4 flex items-center text-purple-600 dark:text-purple-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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

                      {/* Gradient Border Effect */}
                      {isAvailable && (
                        <div className="absolute inset-0 border-2 border-transparent group-hover:border-purple-500 rounded-xl transition-colors duration-300" />
                      )}
                    </Link>
                  );
                })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 dark:border-gray-800 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-600 dark:text-gray-400 text-sm">
            Dibuat dengan ❤️ untuk UMKM Indonesia
          </p>
        </div>
      </div>
    </div>
  );
}
