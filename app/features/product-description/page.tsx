"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeftIcon, SparklesIcon } from "@heroicons/react/24/outline";

interface StyleOption {
    id: string;
    label: string;
    description: string;
    promptPart: string;
}

// Layer untuk Judul
const titleStyles: StyleOption[] = [
    {
        id: "title-seo",
        label: "SEO Marketplace",
        description: "Optimasi pencarian",
        promptPart: "Buatkan 5 variasi judul produk yang SEO friendly. Judul harus: mengandung kata kunci penting, jelas menjelaskan produk, maksimal 100 karakter, mudah dicari pembeli.",
    },
    {
        id: "title-catchy",
        label: "Catchy & Menarik",
        description: "Eye-catching dengan emoji",
        promptPart: "Buatkan 5 variasi judul produk yang catchy dan menarik perhatian. Judul harus: unik, memorable, menggambarkan value produk, membuat penasaran. Boleh pakai emoji yang pas.",
    },
    {
        id: "title-professional",
        label: "Profesional & Formal",
        description: "Elegan dan premium",
        promptPart: "Buatkan 5 variasi judul produk yang profesional dan formal. Judul harus: elegan, menunjukkan kualitas premium, tanpa emoji, maksimal 100 karakter.",
    },
    {
        id: "title-promo",
        label: "Promo & Diskon",
        description: "Emphasis value/diskon",
        promptPart: "Buatkan 5 variasi judul produk yang menekankan promo/value. Judul harus: menarik perhatian dengan value proposition, mengandung kata seperti 'PROMO', 'DISKON', 'MURAH', atau emphasis benefit lainnya.",
    }
];

// Layer 1: Platform/Marketplace
const platformStyles: StyleOption[] = [
    {
        id: "platform-shopee",
        label: "Shopee",
        description: "Format Shopee dengan emoji",
        promptPart: "Format deskripsi untuk Shopee: Gunakan emoji yang relevan, bahasa persuasif tapi natural, highlight produk (3-5 poin), spesifikasi detail, keunggulan produk, call to action.",
    },
    {
        id: "platform-tokopedia",
        label: "Tokopedia",
        description: "Format profesional Tokopedia",
        promptPart: "Format deskripsi untuk Tokopedia: Deskripsi singkat produk, fitur utama (bullet points), spesifikasi teknis, informasi penting. Gunakan bahasa formal tapi tetap menarik.",
    },
    {
        id: "platform-tiktok",
        label: "TikTok Shop",
        description: "Caption catchy + hashtag",
        promptPart: "Format caption untuk TikTok Shop: Opening yang catchy, keunggulan produk (singkat dan menarik), promo/call to action, hashtag relevan (5-8 hashtag). Gunakan bahasa gaul anak muda dan emoji yang fun.",
    },
    {
        id: "platform-lazada",
        label: "Lazada",
        description: "Format Lazada",
        promptPart: "Format deskripsi untuk Lazada: Struktur jelas dengan bullet points, fokus pada benefit dan value, spesifikasi lengkap, informasi pengiriman dan garansi.",
    },
    {
        id: "platform-blibli",
        label: "Blibli",
        description: "Format Blibli",
        promptPart: "Format deskripsi untuk Blibli: Profesional dan informatif, highlight keunggulan produk, spesifikasi detail, informasi brand dan kualitas.",
    }
];

// Layer 2: Bahasa
const languageStyles: StyleOption[] = [
    {
        id: "lang-indonesia",
        label: "Bahasa Indonesia",
        description: "Bahasa Indonesia standar",
        promptPart: "Gunakan bahasa Indonesia yang baik dan benar, mudah dipahami, dan profesional.",
    },
    {
        id: "lang-jawa",
        label: "Bahasa Jawa",
        description: "Kromo Inggil (halus)",
        promptPart: "Gunakan bahasa Jawa Kromo Inggil yang halus dan sopan. Jelaskan produk dengan detail, keunggulan, dan kegunaan. Sertakan terjemahan Indonesia di bagian akhir dalam format: [--- Terjemahan Indonesia ---].",
    },
    {
        id: "lang-sunda",
        label: "Bahasa Sunda",
        description: "Bahasa Sunda sopan",
        promptPart: "Gunakan bahasa Sunda yang sopan dan akrab. Jelaskan produk dengan detail, keunggulan, dan kegunaan. Sertakan terjemahan Indonesia di bagian akhir dalam format: [--- Terjemahan Indonesia ---].",
    },
    {
        id: "lang-betawi",
        label: "Bahasa Betawi",
        description: "Gaya Betawi khas",
        promptPart: "Gunakan bahasa Betawi yang khas dan friendly. Jelaskan produk dengan santai dan akrab tapi tetap informatif. Sertakan terjemahan Indonesia di bagian akhir dalam format: [--- Terjemahan Indonesia ---].",
    },
    {
        id: "lang-english",
        label: "English",
        description: "International market",
        promptPart: "Use professional English suitable for international marketplace. Clear, concise, and persuasive.",
    }
];

// Layer 3: Gaya Penulisan
const writingStyles: StyleOption[] = [
    {
        id: "style-formal",
        label: "Formal",
        description: "Profesional dan resmi",
        promptPart: "Gaya penulisan formal dan profesional, cocok untuk produk premium atau korporat.",
    },
    {
        id: "style-casual",
        label: "Casual/Santai",
        description: "Seperti teman",
        promptPart: "Gaya penulisan santai dan friendly, seolah-olah merekomendasikan ke teman. Gunakan bahasa sehari-hari yang natural.",
    },
    {
        id: "style-storytelling",
        label: "Storytelling",
        description: "Cerita menarik",
        promptPart: "Gaya storytelling yang menarik: ceritakan latar belakang produk, siapa yang cocok menggunakan, situasi penggunaan, manfaat emosional. Buat cerita yang relate dan menyentuh hati.",
    },
    {
        id: "style-testimonial",
        label: "Testimoni",
        description: "Seperti review pembeli",
        promptPart: "Gaya testimoni/review dari pembeli yang sangat puas. Seolah-olah ditulis oleh pembeli yang sudah menggunakan produk. Jelaskan pengalaman menggunakan, kelebihan yang dirasakan.",
    },
    {
        id: "style-luxury",
        label: "Premium/Luxury",
        description: "Eksklusif dan mewah",
        promptPart: "Gaya premium dan eksklusif: gunakan bahasa yang elegan, fokus pada kualitas tinggi, keunikan, dan value. Buat produk terlihat sophisticated dan desirable.",
    },
    {
        id: "style-benefit",
        label: "Fokus Manfaat",
        description: "Benefit-oriented",
        promptPart: "Fokus pada manfaat dan value: jelaskan masalah apa yang dipecahkan, manfaat yang didapat pembeli, mengapa harus beli sekarang. Pendekatan benefit-oriented, bukan hanya fitur.",
    },
    {
        id: "style-spec",
        label: "Spesifikasi Detail",
        description: "Teknis lengkap",
        promptPart: "Fokus pada spesifikasi detail: bahan/material, ukuran/dimensi, warna, fitur teknis, cara penggunaan, isi paket. Format dengan bullet points yang rapi.",
    }
];

export default function ProductDescriptionGenerator() {
    // Input States
    const [productName, setProductName] = useState("");
    const [productCategory, setProductCategory] = useState("");
    const [productFeatures, setProductFeatures] = useState("");
    const [additionalInfo, setAdditionalInfo] = useState("");

    // States untuk Judul
    const [selectedTitleStyle, setSelectedTitleStyle] = useState<string | null>(null);
    const [customTitlePrompt, setCustomTitlePrompt] = useState("");
    const [generatedTitle, setGeneratedTitle] = useState<string | null>(null);

    // States untuk Deskripsi (Multi-layer selection)
    const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
    const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
    const [selectedWritingStyle, setSelectedWritingStyle] = useState<string | null>(null);
    const [customDescPrompt, setCustomDescPrompt] = useState("");
    const [generatedDesc, setGeneratedDesc] = useState<string | null>(null);

    const [loading, setLoading] = useState<'title' | 'description' | 'both' | null>(null);
    const [error, setError] = useState("");
    const [showCopyNotif, setShowCopyNotif] = useState(false);

    const buildBasePrompt = () => {
        return `
Informasi Produk:
- Nama Produk: ${productName}
- Kategori: ${productCategory || "-"}
- Fitur/Keunggulan: ${productFeatures}
- Informasi Tambahan: ${additionalInfo || "-"}
    `.trim();
    };

    const buildDescriptionPrompt = (): string => {
        const parts: string[] = [];

        // Header instruction
        parts.push("PENTING: Jangan gunakan kata pembuka seperti 'tentu', 'baik', 'berikut adalah', atau kalimat pendahuluan apapun. Langsung mulai dengan deskripsi produk.");

        // Product Info
        parts.push(buildBasePrompt());

        // Main instruction
        parts.push("\nBuatkan deskripsi produk berdasarkan informasi di atas dengan kombinasi style berikut:");

        // Add platform style if selected
        if (selectedPlatform) {
            const platform = platformStyles.find(p => p.id === selectedPlatform);
            if (platform) parts.push(`\nPLATFORM: ${platform.promptPart}`);
        }

        // Add language style if selected
        if (selectedLanguage) {
            const language = languageStyles.find(l => l.id === selectedLanguage);
            if (language) parts.push(`\nBAHASA: ${language.promptPart}`);
        }

        // Add writing style if selected
        if (selectedWritingStyle) {
            const style = writingStyles.find(s => s.id === selectedWritingStyle);
            if (style) parts.push(`\nGAYA PENULISAN: ${style.promptPart}`);
        }

        // Add custom prompt if provided
        if (customDescPrompt.trim()) {
            parts.push(`\nTAMBAHAN: ${customDescPrompt.trim()}`);
        }

        return parts.join("\n");
    };

    const handleGenerate = async (type: 'title' | 'description' | 'both') => {
        if (!productName || !productFeatures) {
            setError("Harap isi Nama Produk dan Fitur/Keunggulan terlebih dahulu");
            return;
        }

        setLoading(type);
        setError("");

        try {
            // Generate Title
            if (type === 'title' || type === 'both') {
                let titlePrompt = customTitlePrompt;

                if (!titlePrompt && selectedTitleStyle) {
                    const style = titleStyles.find(s => s.id === selectedTitleStyle);
                    if (style) {
                        titlePrompt = `PENTING: Jangan gunakan kata pembuka seperti 'tentu', 'baik', 'berikut adalah', atau kalimat pendahuluan apapun. Langsung mulai dengan format: 1. [judul]\n\n${style.promptPart}`;
                    }
                }

                if (titlePrompt) {
                    const fullTitlePrompt = `${titlePrompt}\n\n${buildBasePrompt()}`;

                    const response = await fetch("/api/generate-description", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            prompt: fullTitlePrompt,
                        }),
                    });

                    const data = await response.json();
                    if (data.success && data.text) {
                        setGeneratedTitle(data.text);
                    }
                } else if (type === 'title') {
                    setError("Harap pilih style judul atau masukkan custom prompt untuk judul");
                }
            }

            // Generate Description
            if (type === 'description' || type === 'both') {
                const hasDescSelection = selectedPlatform || selectedLanguage || selectedWritingStyle || customDescPrompt.trim();

                if (hasDescSelection) {
                    const fullDescPrompt = buildDescriptionPrompt();

                    const response = await fetch("/api/generate-description", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            prompt: fullDescPrompt,
                        }),
                    });

                    const data = await response.json();
                    if (data.success && data.text) {
                        setGeneratedDesc(data.text);
                    }
                } else if (type === 'description') {
                    setError("Harap pilih minimal 1 style untuk deskripsi atau masukkan custom prompt");
                }
            }

        } catch (err) {
            setError("Terjadi kesalahan saat generate");
            console.error(err);
        } finally {
            setLoading(null);
        }
    };

    const copyToClipboard = async (text: string) => {
        await navigator.clipboard.writeText(text);
        setShowCopyNotif(true);
        setTimeout(() => setShowCopyNotif(false), 2000);
    };

    const getSelectedCount = (type: 'description') => {
        if (type === 'description') {
            let count = 0;
            if (selectedPlatform) count++;
            if (selectedLanguage) count++;
            if (selectedWritingStyle) count++;
            return count;
        }
        return 0;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
            {showCopyNotif && (
                <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg">
                    Berhasil dicopy ke clipboard!
                </div>
            )}

            {/* Header */}
            <div className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <Link
                        href="/"
                        className="inline-flex items-center text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 mb-4 transition-colors"
                    >
                        <ArrowLeftIcon className="w-5 h-5 mr-2" />
                        Kembali ke Dashboard
                    </Link>
                    <div className="flex items-center gap-3">
                        <SparklesIcon className="w-10 h-10 text-purple-600 dark:text-purple-400" />
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                                Generator Deskripsi Produk
                            </h1>
                            <p className="mt-2 text-gray-600 dark:text-gray-300">
                                Buat deskripsi produk yang menarik secara otomatis dengan AI
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Panel - Product Info Inputs */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sticky top-6">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                                1. Informasi Produk
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Nama Produk <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={productName}
                                        onChange={(e) => setProductName(e.target.value)}
                                        placeholder="Contoh: Sepatu Lari Nike Air Zoom"
                                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Kategori (Opsional)
                                    </label>
                                    <input
                                        type="text"
                                        value={productCategory}
                                        onChange={(e) => setProductCategory(e.target.value)}
                                        placeholder="Contoh: Olahraga, Fashion, Elektronik"
                                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Fitur / Keunggulan Utama <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        value={productFeatures}
                                        onChange={(e) => setProductFeatures(e.target.value)}
                                        placeholder="Contoh: Bahan mesh breathable, sol empuk, ringan, tahan lama..."
                                        rows={4}
                                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Informasi Tambahan (Opsional)
                                    </label>
                                    <textarea
                                        value={additionalInfo}
                                        onChange={(e) => setAdditionalInfo(e.target.value)}
                                        placeholder="Contoh: Garansi 1 tahun, gratis kaos kaki..."
                                        rows={3}
                                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel - Style Selection */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Title Section */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                    2A. Style Judul
                                </h2>
                                <button
                                    onClick={() => handleGenerate('title')}
                                    disabled={loading !== null || !productName || !productFeatures}
                                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white text-sm font-semibold rounded-lg transition-colors disabled:cursor-not-allowed"
                                >
                                    {loading === 'title' ? "Generating..." : "Generate Judul"}
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mb-4">
                                {titleStyles.map((style) => (
                                    <button
                                        key={style.id}
                                        onClick={() => {
                                            setSelectedTitleStyle(style.id);
                                            setCustomTitlePrompt("");
                                        }}
                                        className={`text-left p-3 rounded-lg border-2 transition-all ${selectedTitleStyle === style.id
                                                ? "border-purple-500 bg-purple-50 dark:bg-purple-900/30"
                                                : "border-gray-200 dark:border-gray-700 hover:border-purple-300"
                                            }`}
                                    >
                                        <div className="font-semibold text-sm text-gray-900 dark:text-white mb-1">
                                            {style.label}
                                        </div>
                                        <div className="text-xs text-gray-600 dark:text-gray-400">
                                            {style.description}
                                        </div>
                                    </button>
                                ))}
                            </div>

                            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Atau Custom Prompt Judul
                                </label>
                                <textarea
                                    value={customTitlePrompt}
                                    onChange={(e) => {
                                        setCustomTitlePrompt(e.target.value);
                                        if (e.target.value) setSelectedTitleStyle(null);
                                    }}
                                    placeholder="Contoh: Buatkan 3 variasi judul yang fokus pada keunggulan bahan..."
                                    rows={2}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white resize-none"
                                />
                            </div>

                            {generatedTitle && (
                                <div className="mt-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 border-2 border-purple-200 dark:border-purple-700">
                                    <div className="flex justify-between items-center mb-2">
                                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                            Hasil Judul:
                                        </p>
                                        <button
                                            onClick={() => copyToClipboard(generatedTitle)}
                                            className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded text-xs font-medium hover:bg-purple-200"
                                        >
                                            Copy
                                        </button>
                                    </div>
                                    <div className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap text-sm">
                                        {generatedTitle}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Description Section - Multi Layer */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                        2B. Style Deskripsi
                                    </h2>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                        Pilih kombinasi style (bisa lebih dari 1 layer)
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleGenerate('description')}
                                    disabled={loading !== null || !productName || !productFeatures}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white text-sm font-semibold rounded-lg transition-colors disabled:cursor-not-allowed"
                                >
                                    {loading === 'description' ? "Generating..." : "Generate Deskripsi"}
                                </button>
                            </div>

                            {/* Platform Layer */}
                            <div className="mb-6">
                                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                    Platform/Marketplace:
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                    {platformStyles.map((style) => (
                                        <button
                                            key={style.id}
                                            onClick={() => setSelectedPlatform(selectedPlatform === style.id ? null : style.id)}
                                            className={`text-left p-3 rounded-lg border-2 transition-all ${selectedPlatform === style.id
                                                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30"
                                                    : "border-gray-200 dark:border-gray-700 hover:border-blue-300"
                                                }`}
                                        >
                                            <div className="font-semibold text-sm text-gray-900 dark:text-white mb-1">
                                                {style.label}
                                            </div>
                                            <div className="text-xs text-gray-600 dark:text-gray-400">
                                                {style.description}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Language Layer */}
                            <div className="mb-6">
                                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                    Bahasa:
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                    {languageStyles.map((style) => (
                                        <button
                                            key={style.id}
                                            onClick={() => setSelectedLanguage(selectedLanguage === style.id ? null : style.id)}
                                            className={`text-left p-3 rounded-lg border-2 transition-all ${selectedLanguage === style.id
                                                    ? "border-green-500 bg-green-50 dark:bg-green-900/30"
                                                    : "border-gray-200 dark:border-gray-700 hover:border-green-300"
                                                }`}
                                        >
                                            <div className="font-semibold text-sm text-gray-900 dark:text-white mb-1">
                                                {style.label}
                                            </div>
                                            <div className="text-xs text-gray-600 dark:text-gray-400">
                                                {style.description}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Writing Style Layer */}
                            <div className="mb-6">
                                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                    Gaya Penulisan:
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                    {writingStyles.map((style) => (
                                        <button
                                            key={style.id}
                                            onClick={() => setSelectedWritingStyle(selectedWritingStyle === style.id ? null : style.id)}
                                            className={`text-left p-3 rounded-lg border-2 transition-all ${selectedWritingStyle === style.id
                                                    ? "border-orange-500 bg-orange-50 dark:bg-orange-900/30"
                                                    : "border-gray-200 dark:border-gray-700 hover:border-orange-300"
                                                }`}
                                        >
                                            <div className="font-semibold text-sm text-gray-900 dark:text-white mb-1">
                                                {style.label}
                                            </div>
                                            <div className="text-xs text-gray-600 dark:text-gray-400">
                                                {style.description}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Selected Styles Preview */}
                            {getSelectedCount('description') > 0 && (
                                <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                                    <p className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">
                                        Kombinasi Terpilih ({getSelectedCount('description')} layer):
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedPlatform && (
                                            <span className="inline-flex items-center px-2 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded text-xs">
                                                {platformStyles.find(s => s.id === selectedPlatform)?.label}
                                            </span>
                                        )}
                                        {selectedLanguage && (
                                            <span className="inline-flex items-center px-2 py-1 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 rounded text-xs">
                                                {languageStyles.find(s => s.id === selectedLanguage)?.label}
                                            </span>
                                        )}
                                        {selectedWritingStyle && (
                                            <span className="inline-flex items-center px-2 py-1 bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 rounded text-xs">
                                                {writingStyles.find(s => s.id === selectedWritingStyle)?.label}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Custom Prompt Tambahan (Opsional)
                                </label>
                                <textarea
                                    value={customDescPrompt}
                                    onChange={(e) => setCustomDescPrompt(e.target.value)}
                                    placeholder="Contoh: Tambahkan informasi garansi 1 tahun dan gratis ongkir..."
                                    rows={2}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none"
                                />
                            </div>

                            {generatedDesc && (
                                <div className="mt-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 border-2 border-blue-200 dark:border-blue-700">
                                    <div className="flex justify-between items-center mb-2">
                                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                            Hasil Deskripsi:
                                        </p>
                                        <button
                                            onClick={() => copyToClipboard(generatedDesc)}
                                            className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs font-medium hover:bg-blue-200"
                                        >
                                            Copy
                                        </button>
                                    </div>
                                    <div className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap text-sm">
                                        {generatedDesc}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Error & Generate Both */}
                        {error && (
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg">
                                {error}
                            </div>
                        )}

                        <button
                            onClick={() => handleGenerate('both')}
                            disabled={loading !== null || !productName || !productFeatures}
                            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-all disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading === 'both' ? (
                                <>
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Sedang Generate Keduanya...
                                </>
                            ) : (
                                <>
                                    <SparklesIcon className="w-5 h-5" />
                                    Generate Judul & Deskripsi Sekaligus
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
