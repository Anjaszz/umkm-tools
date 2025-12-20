"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeftIcon, PhotoIcon, SparklesIcon, ArrowDownTrayIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import puter from '@heyputer/puter.js';

export default function PhotoEnhancerPage() {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [description, setDescription] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [resultImage, setResultImage] = useState<string | null>(null);

    // Sub-options state
    const [selectedStyle, setSelectedStyle] = useState("studio");
    const [selectedLighting, setSelectedLighting] = useState("soft");
    const [selectedComposition, setSelectedComposition] = useState("focus");

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Configuration Options
    const styles = [
        { id: "studio", name: "Studio Minimalis", icon: "✨", prompt: "clean minimalist studio photography, solid background, distraction free, high end e-commerce look" },
        { id: "luxury", name: "Mewah (Luxury)", icon: "💎", prompt: "luxury product photography, black marble texture, gold accents, premium atmosphere, expensive look" },
        { id: "nature", name: "Natural Organic", icon: "🌿", prompt: "product photography in nature, wooden elements, green leaves, sunlight dappled, organic and fresh" },
        { id: "pop", name: "Pop & Ceria", icon: "🎨", prompt: "pop art style, vibrant pastel colors background, fun and energetic, trendy aesthetic" },
        { id: "industrial", name: "Industrial", icon: "🏢", prompt: "industrial design style, concrete texture background, metallic details, raw and edgy" },
        { id: "futuristic", name: "Futuristik", icon: "🚀", prompt: "futuristic cyberpunk style, neon lights, glowing edges, tech atmosphere" }
    ];

    const lightingOptions = [
        { id: "soft", name: "Soft Studio", prompt: "soft diffused studio lighting, even illumination, no harsh shadows" },
        { id: "golden", name: "Golden Hour", prompt: "warm golden hour sunlight, sun rays, cinematic lighting, emotional warmth" },
        { id: "dramatic", name: "Dramatis", prompt: "dramatic chiaroscuro lighting, high contrast, moody shadows, rim lighting" },
        { id: "neon", name: "Neon Glow", prompt: "colorful neon gel lighting, pink and blue hues, artistic club vibe" }
    ];

    const compositionOptions = [
        { id: "focus", name: "Fokus Produk", prompt: "centered close-up shot, shallow depth of field, bokeh background, product is the hero" },
        { id: "hand", name: "Dipegang Model", prompt: "product being held by a hand of a professional model with manicured nails, lifestyle context, realistic skin tones" },
        { id: "podium", name: "Di Atas Podium", prompt: "product sitting on a geometric podium, 3d render style stage, floating elements" },
        { id: "splash", name: "Splash / Air", prompt: "dynamic water splash around product, freshness, droplets, high speed photography" },
        { id: "flatlay", name: "Flatlay (Atas)", prompt: "knolling photography, top down view, organized layout, neat arrangement" },
        { id: "marketing", name: "Poster Iklan", prompt: "wide composition suitable for advertising banner, negative space for text, commercial layout" }
    ];

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setSelectedImage(e.target?.result as string);
            };
            reader.readAsDataURL(file);
            setImageFile(file);
        }
    };

    const handleGenerate = async () => {
        if (!selectedImage) {
            alert("Mohon upload foto produk terlebih dahulu!");
            return;
        }

        setIsGenerating(true);
        setResultImage(null);

        try {
            // Get Prompts
            const stylePrompt = styles.find(s => s.id === selectedStyle)?.prompt;
            const lightingPrompt = lightingOptions.find(l => l.id === selectedLighting)?.prompt;
            const compPrompt = compositionOptions.find(c => c.id === selectedComposition)?.prompt;

            // Construct rich prompt
            const userPrompt = description ? `Additional instructions: ${description}.` : "";
            const finalPrompt = `Transform this product image. Style: ${stylePrompt}. Lighting: ${lightingPrompt}. Composition: ${compPrompt}. ${userPrompt} 
            Ensure the main product identity and shape remains recognizable but make it look like a world-class award-winning professional photograph. 8k resolution, ultra-sharp.`;

            // Prepare base64 image (remove header)
            const base64Data = selectedImage.split(',')[1];
            // Detect mime type
            const mimeType = selectedImage.match(/[^:]\w+\/[\w-+\d.]+(?=;|,)/)?.[0] || "image/png";

            // Using Puter.js
            const image = await puter.ai.txt2img(finalPrompt, {
                model: "gemini-2.5-flash-image-preview",
                input_image: base64Data,
                input_image_mime_type: mimeType
            });

            if (image && image.src) {
                setResultImage(image.src);
            } else if (typeof image === 'string') {
                setResultImage(image);
            } else if (image instanceof HTMLImageElement) {
                setResultImage(image.src);
            } else {
                console.warn("Unexpected response format", image);
            }

        } catch (error) {
            console.error("Generation failed", error);
            alert("Gagal membuat gambar. Pastikan Anda sudah login ke Puter.com.");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-6 md:p-12">
            <div className="max-w-7xl mx-auto">
                <Link href="/" className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-purple-600 mb-8 transition-colors">
                    <ArrowLeftIcon className="w-5 h-5 mr-2" />
                    Kembali ke Dashboard
                </Link>

                <div className="flex flex-col lg:flex-row gap-8">

                    {/* LEFT PANEL - CONTROLS */}
                    <div className="w-full lg:w-1/3 space-y-6">
                        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-gray-700">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="p-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg text-white">
                                    <PhotoIcon className="w-6 h-6" />
                                </div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">AI Studio</h1>
                            </div>

                            {/* UPLOAD BOX */}
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className={`relative w-full aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer border-2 border-dashed transition-all group ${selectedImage
                                        ? 'border-purple-500'
                                        : 'border-gray-300 hover:border-purple-400 bg-gray-50 dark:bg-gray-700/50'
                                    }`}
                            >
                                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />

                                {selectedImage ? (
                                    <>
                                        <Image src={selectedImage} alt="Input" fill className="object-cover" />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <span className="text-white font-medium flex items-center bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm">
                                                <ArrowPathIcon className="w-4 h-4 mr-2" /> Ganti Foto
                                            </span>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                                        <PhotoIcon className="w-12 h-12 mb-2 opacity-50" />
                                        <span className="text-sm font-medium">Upload Foto Produk</span>
                                    </div>
                                )}
                            </div>

                            <div className="mt-6 space-y-6">
                                {/* STYLE SELECTOR */}
                                <div>
                                    <label className="text-sm font-bold text-gray-900 dark:text-white mb-3 block">1. Gaya Visual</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {styles.map(s => (
                                            <button
                                                key={s.id}
                                                onClick={() => setSelectedStyle(s.id)}
                                                className={`px-3 py-2 rounded-xl text-sm font-medium text-left transition-all flex items-center space-x-2 ${selectedStyle === s.id ? 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300' : 'bg-gray-50 text-gray-600 hover:bg-gray-100 dark:bg-gray-700/50 dark:text-gray-300'
                                                    }`}
                                            >
                                                <span>{s.icon}</span>
                                                <span>{s.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* COMPOSITION SELECTOR (NEW) */}
                                <div>
                                    <label className="text-sm font-bold text-gray-900 dark:text-white mb-3 block">2. Komposisi & Elemen</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {compositionOptions.map(c => (
                                            <button
                                                key={c.id}
                                                onClick={() => setSelectedComposition(c.id)}
                                                className={`px-3 py-2 rounded-xl text-xs font-medium text-center transition-all border ${selectedComposition === c.id ? 'border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300' : 'border-gray-200 text-gray-600 hover:border-gray-300 dark:border-gray-600 dark:text-gray-300'
                                                    }`}
                                            >
                                                {c.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* LIGHTING SELECTOR */}
                                <div>
                                    <label className="text-sm font-bold text-gray-900 dark:text-white mb-3 block">3. Pencahayaan</label>
                                    <div className="flex flex-wrap gap-2">
                                        {lightingOptions.map(l => (
                                            <button
                                                key={l.id}
                                                onClick={() => setSelectedLighting(l.id)}
                                                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${selectedLighting === l.id ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400'
                                                    }`}
                                            >
                                                {l.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* DESCRIPTION */}
                                <div>
                                    <label className="text-sm font-bold text-gray-900 dark:text-white mb-2 block">
                                        Deskripsi Tambahan (Opsional)
                                    </label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Contoh: Tambahkan hiasan bunga mawar merah di sampingnya..."
                                        className="w-full text-sm p-3 rounded-xl border-gray-200 bg-gray-50 focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700/50 dark:border-gray-600 dark:text-white resize-none h-20"
                                    />
                                </div>

                                {/* GENERATE BUTTON */}
                                <button
                                    onClick={handleGenerate}
                                    disabled={isGenerating || !selectedImage}
                                    className={`w-full py-4 rounded-xl font-bold text-white shadow-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] ${isGenerating || !selectedImage
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600'
                                        }`}
                                >
                                    {isGenerating ? (
                                        <span className="flex items-center justify-center">
                                            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Memproses AI...
                                        </span>
                                    ) : (
                                        <span className="flex items-center justify-center">
                                            <SparklesIcon className="w-5 h-5 mr-2" />
                                            Generate Foto Magic
                                        </span>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT PANEL - RESULT */}
                    <div className="flex-1 min-h-[500px] bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-gray-700 flex flex-col">
                        <div className="flex-1 flex flex-col items-center justify-center relative rounded-2xl overflow-hidden bg-gray-50 dark:bg-gray-900/50 border-2 border-dashed border-gray-100 dark:border-gray-700">
                            {resultImage ? (
                                <div className="relative w-full h-full min-h-[500px]">
                                    <Image
                                        src={resultImage}
                                        alt="Result"
                                        fill
                                        className="object-contain" // Changed to contain to ensure full image is seen
                                        unoptimized
                                    />
                                </div>
                            ) : (
                                <div className="text-center p-8 max-w-sm">
                                    <div className="w-20 h-20 bg-gradient-to-tr from-purple-100 to-indigo-100 dark:from-gray-700 dark:to-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <SparklesIcon className="w-10 h-10 text-purple-500 dark:text-purple-300" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Belum ada hasil</h3>
                                    <p className="text-gray-500 dark:text-gray-400">Pilih foto, atur gaya, dan tekan tombol Generate untuk melihat keajaiban AI.</p>
                                </div>
                            )}
                        </div>

                        {/* DOWNLOAD ACTIONS */}
                        {resultImage && (
                            <div className="mt-6 flex flex-col sm:flex-row gap-4">
                                <a
                                    href={resultImage}
                                    download="umkm-ai-enhanced.png"
                                    className="flex-1 py-3 px-6 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-xl flex items-center justify-center hover:opacity-90 transition-opacity shadow-lg"
                                >
                                    <ArrowDownTrayIcon className="w-5 h-5 mr-2" /> Download HD
                                </a>
                                <button
                                    onClick={() => setResultImage(null)}
                                    className="px-6 py-3 border border-gray-200 dark:border-gray-600 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                    Reset
                                </button>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}
