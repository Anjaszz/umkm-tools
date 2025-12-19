"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeftIcon, MegaphoneIcon, PhotoIcon } from "@heroicons/react/24/outline";

interface StyleOption {
    id: string;
    label: string;
    description: string;
    promptPart: string;
}

const platforms: StyleOption[] = [
    {
        id: "instagram",
        label: "Instagram",
        description: "Feed & Reels",
        promptPart: "Instagram: Gunakan mix hashtag populer, layout rapi dengan line breaks, call to action jelas, emoji yang estetik.",
    },
    {
        id: "tiktok",
        label: "TikTok Shop",
        description: "Short Video",
        promptPart: "TikTok: Opening hook 3 detik pertama dalam teks, bahasa gaul/tren, hashtag fyp dan hashtag produk relevan.",
    },
    {
        id: "facebook",
        label: "Facebook/Meta",
        description: "Post & Marketplace",
        promptPart: "Facebook: Bahasa komunitas/akrab, detail informasi lengkap, link pembelian jelas, storytelling.",
    },
    {
        id: "twitter",
        label: "Twitter/X",
        description: "Thread/Post",
        promptPart: "Twitter: Singkat, padat, 'racun' belanja, thread style jika panjang, hashtag minim tapi efektif.",
    },
    {
        id: "whatsapp",
        label: "WhatsApp Story",
        description: "Status & Broadcast",
        promptPart: "WhatsApp: Personal, sapaan akrab, urgensi (stok terbatas dsb), link langsung ke chat/order.",
    },
];

const tones: StyleOption[] = [
    {
        id: "lucu",
        label: "Lucu & Receh",
        description: "Humoris & Menghibur",
        promptPart: "Tone: Lucu, pakai jokes/tebak-tebakan, bahasa santai, bikin orang senyum.",
    },
    {
        id: "soft-selling",
        label: "Soft Selling",
        description: "Edukasi & Tips",
        promptPart: "Tone: Soft selling, edukasi dulu baru jualan, sharing tips, tidak memaksa beli.",
    },
    {
        id: "hard-selling",
        label: "Hard Selling",
        description: "Promo & Diskon",
        promptPart: "Tone: Hard selling, to the point, fokus ke diskon/promo, scarcity (stok menipis), urgensi tinggi.",
    },
    {
        id: "storytelling",
        label: "Storytelling",
        description: "Cerita & Pengalaman",
        promptPart: "Tone: Bercerita pengalaman, studi kasus, before-after, menyentuh emosi.",
    },
    {
        id: "aesthetic",
        label: "Aesthetic / Minimalist",
        description: "Elegan & Singkat",
        promptPart: "Tone: Aesthetic, minimalis, puitis, kata-kata indah, high class vibe.",
    },
];

export default function SocialCaptionGenerator() {
    const [productName, setProductName] = useState("");
    const [storeName, setStoreName] = useState("");
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [additionalInfo, setAdditionalInfo] = useState("");

    const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
    const [selectedTone, setSelectedTone] = useState<string | null>(null);

    const [generatedCaption, setGeneratedCaption] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showCopyNotif, setShowCopyNotif] = useState(false);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setSelectedImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setSelectedImage(null);
    };

    const handleGenerate = async () => {
        if (!productName || !storeName) {
            setError("Nama Produk dan Nama Toko wajib diisi");
            return;
        }
        if (!selectedPlatform || !selectedTone) {
            setError("Pilih Platform dan Tone bahasa terlebih dahulu");
            return;
        }

        setLoading(true);
        setError("");
        setGeneratedCaption(null);

        try {
            const platformPrompt = platforms.find(p => p.id === selectedPlatform)?.promptPart;
            const tonePrompt = tones.find(t => t.id === selectedTone)?.promptPart;

            const fullPrompt = `
PENTING: Jangan gunakan kata pembuka seperti 'tentu', 'baik', 'berikut adalah', atau kalimat pendahuluan apapun. Langsung mulai dengan caption.

Buatkan caption sosial media untuk produk berikut:
- Nama Toko: ${storeName}
- Produk: ${productName}
- Info Tambahan: ${additionalInfo}
- Platform: ${platformPrompt}
- Gaya Bahasa: ${tonePrompt}

Instruksi:
1. Buat caption yang menarik sesuai gaya bahasa dan platform.
2. Sertakan Call to Action yang jelas.
3. Sertakan 5-10 hashtag yang relevan dan viral.
4. Mention nama toko "${storeName}" dalam caption.
5. Jika ada upload foto, sesuaikan caption dengan konteks visual produk (jika dideskripsikan).
      `.trim();

            const body: any = {
                prompt: fullPrompt,
            };

            if (selectedImage) {
                body.imageData = selectedImage.split(",")[1];
                body.mimeType = selectedImage.split(";")[0].split(":")[1];
            }

            const response = await fetch("/api/generate-caption", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            const data = await response.json();
            if (data.success && data.text) {
                setGeneratedCaption(data.text);
            } else {
                throw new Error(data.details || data.error || "Gagal generate caption");
            }

        } catch (err: any) {
            console.error("Error generating caption:", err);
            setError(err.message || "Terjadi kesalahan saat generate. Silakan coba lagi.");
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = async (text: string) => {
        await navigator.clipboard.writeText(text);
        setShowCopyNotif(true);
        setTimeout(() => setShowCopyNotif(false), 2000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 to-orange-50 dark:from-gray-900 dark:to-gray-800">
            {showCopyNotif && (
                <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg">
                    Caption berhasil dicopy!
                </div>
            )}

            {/* Header */}
            <div className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <Link
                        href="/"
                        className="inline-flex items-center text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 mb-4 transition-colors"
                    >
                        <ArrowLeftIcon className="w-5 h-5 mr-2" />
                        Kembali ke Dashboard
                    </Link>
                    <div className="flex items-center gap-3">
                        <MegaphoneIcon className="w-10 h-10 text-pink-600 dark:text-pink-400" />
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                                Generator Caption Sosmed
                            </h1>
                            <p className="mt-2 text-gray-600 dark:text-gray-300">
                                Buat caption viral untuk Instagram, TikTok, Facebook dengan mudah
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Panel - Input */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sticky top-6">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                                1. Info Produk & Toko
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Nama Toko <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={storeName}
                                        onChange={(e) => setStoreName(e.target.value)}
                                        placeholder="Contoh: Toko Berkah Jaya"
                                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Produk / Deskripsi Singkat <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        value={productName}
                                        onChange={(e) => setProductName(e.target.value)}
                                        placeholder="Contoh: Hijab voal premium, anti geser, adem..."
                                        rows={3}
                                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Info Tambahan (Opsional)
                                    </label>
                                    <input
                                        type="text"
                                        value={additionalInfo}
                                        onChange={(e) => setAdditionalInfo(e.target.value)}
                                        placeholder="Contoh: Diskon 50% hari ini"
                                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Upload Foto (Opsional)
                                    </label>
                                    {!selectedImage ? (
                                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <PhotoIcon className="w-8 h-8 text-gray-400 mb-2" />
                                                <p className="text-xs text-gray-500 dark:text-gray-400">Klik untuk upload foto</p>
                                            </div>
                                            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                        </label>
                                    ) : (
                                        <div className="relative">
                                            <Image
                                                src={selectedImage}
                                                alt="Preview"
                                                width={300}
                                                height={300}
                                                className="w-full h-48 object-cover rounded-lg"
                                            />
                                            <button
                                                onClick={removeImage}
                                                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full text-xs hover:bg-red-600"
                                            >
                                                X
                                            </button>
                                        </div>
                                    )}
                                </div>

                            </div>
                        </div>
                    </div>

                    {/* Right Panel - Options */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                                2. Target Platform & Gaya
                            </h2>

                            {/* Platform Selection */}
                            <div className="mb-6">
                                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                    Mau posting dimana?
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {platforms.map((p) => (
                                        <button
                                            key={p.id}
                                            onClick={() => setSelectedPlatform(p.id)}
                                            className={`p-3 rounded-lg border-2 text-left transition-all ${selectedPlatform === p.id
                                                ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20'
                                                : 'border-gray-200 dark:border-gray-700 hover:border-pink-300'
                                                }`}
                                        >
                                            <div className="font-bold text-gray-900 dark:text-white text-sm">{p.label}</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">{p.description}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Tone Selection */}
                            <div className="mb-6">
                                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                    Gaya bicaranya gimana?
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {tones.map((t) => (
                                        <button
                                            key={t.id}
                                            onClick={() => setSelectedTone(t.id)}
                                            className={`p-3 rounded-lg border-2 text-left transition-all ${selectedTone === t.id
                                                ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                                                : 'border-gray-200 dark:border-gray-700 hover:border-orange-300'
                                                }`}
                                        >
                                            <div className="font-bold text-gray-900 dark:text-white text-sm">{t.label}</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">{t.description}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Generate Button */}
                            <button
                                onClick={handleGenerate}
                                disabled={loading || !productName || !storeName || !selectedPlatform || !selectedTone}
                                className="w-full bg-gradient-to-r from-pink-600 to-orange-500 hover:from-pink-700 hover:to-orange-600 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform active:scale-95 transition-all disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Sedang Meracik Caption...
                                    </>
                                ) : (
                                    <>
                                        <MegaphoneIcon className="w-5 h-5" />
                                        Buat Caption Sekarang
                                    </>
                                )}
                            </button>

                            {/* Error Message */}
                            {error && (
                                <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                                    <span className="block sm:inline">{error}</span>
                                </div>
                            )}

                            {/* Result Area */}
                            {generatedCaption && (
                                <div className="mt-8 animate-fade-in">
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Caption Siap Posting:</h3>
                                        <button
                                            onClick={() => copyToClipboard(generatedCaption)}
                                            className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white text-xs font-bold py-1 px-3 rounded inline-flex items-center"
                                        >
                                            Copy Caption
                                        </button>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-gray-900 border-2 border-pink-100 dark:border-pink-900 rounded-xl p-4 whitespace-pre-wrap text-gray-800 dark:text-gray-200 text-sm leading-relaxed">
                                        {generatedCaption}
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
