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
        <div className="min-h-screen bg-[#E8ECEF]">
            <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">

                <div className="flex flex-col lg:flex-row gap-8">

                    {/* LEFT PANEL - CONTROLS */}
                    <div className="w-full lg:w-1/3 space-y-6">
                        <div className="clay-card p-6">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="p-2 rounded-xl text-white"
                                    style={{
                                        background: 'linear-gradient(135deg, #2ECC71 0%, #27ae60 100%)',
                                        boxShadow: '3px 3px 6px rgba(46, 204, 113, 0.3), -2px -2px 4px rgba(255, 255, 255, 0.8)'
                                    }}>
                                    <PhotoIcon className="w-6 h-6" />
                                </div>
                                <h1 className="text-2xl font-bold text-[#1a1f24]">AI Studio</h1>
                            </div>

                            {/* UPLOAD BOX */}
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className={`relative w-full aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer border-2 border-dashed transition-all group ${selectedImage
                                    ? 'border-[#2ECC71] bg-[#2ECC71]/5'
                                    : 'border-gray-300 hover:border-[#2ECC71] bg-white/50'
                                    }`}
                                style={{
                                    boxShadow: 'inset 2px 2px 4px rgba(46, 204, 113, 0.08)'
                                }}
                            >
                                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />

                                {selectedImage ? (
                                    <>
                                        <Image src={selectedImage} alt="Input" fill className="object-cover" />
                                        <div className="absolute inset-0 bg-[#2ECC71]/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                            <span className="text-white font-bold flex items-center bg-gray-800/70 px-5 py-2.5 rounded-full">
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
                                    <label className="text-sm font-bold text-[#1a1f24] mb-3 block">1. Gaya Visual</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {styles.map(s => (
                                            <button
                                                key={s.id}
                                                onClick={() => setSelectedStyle(s.id)}
                                                className={`px-3 py-2 rounded-xl text-sm font-medium cursor-pointer text-left transition-all flex items-center space-x-2 ${selectedStyle === s.id
                                                    ? 'clay-button text-white font-bold'
                                                    : 'bg-white/70 text-gray-600 hover:bg-[#2ECC71]/10 border border-gray-200'
                                                    }`}
                                            >
                                                <span>{s.icon}</span>
                                                <span className="text-xs">{s.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* COMPOSITION SELECTOR */}
                                <div>
                                    <label className="text-sm font-bold text-[#1a1f24] mb-3 block">2. Komposisi & Elemen</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {compositionOptions.map(c => (
                                            <button
                                                key={c.id}
                                                onClick={() => setSelectedComposition(c.id)}
                                                className={`px-3 py-2 rounded-xl text-xs cursor-pointer font-medium text-center transition-all border ${selectedComposition === c.id
                                                    ? 'border-[#2ECC71] bg-[#2ECC71]/10 text-[#2D3436] font-bold shadow-sm'
                                                    : 'border-gray-200 text-gray-600 hover:border-[#2ECC71] bg-white/50'
                                                    }`}
                                            >
                                                {c.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* LIGHTING SELECTOR */}
                                <div>
                                    <label className="text-sm font-bold text-[#1a1f24] mb-3 block">3. Pencahayaan</label>
                                    <div className="flex flex-wrap gap-2">
                                        {lightingOptions.map(l => (
                                            <button
                                                key={l.id}
                                                onClick={() => setSelectedLighting(l.id)}
                                                className={`px-3 py-1.5 rounded-full text-xs cursor-pointer font-medium transition-all ${selectedLighting === l.id
                                                    ? 'bg-[#2ECC71] text-white shadow-md'
                                                    : 'bg-white/80 text-gray-600 hover:bg-[#2ECC71]/10 border border-gray-200'
                                                    }`}
                                            >
                                                {l.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* DESCRIPTION */}
                                <div>
                                    <label className="text-sm font-bold text-[#1a1f24] mb-2 block">
                                        Deskripsi Tambahan (Opsional)
                                    </label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Contoh: Tambahkan hiasan bunga mawar merah di sampingnya..."
                                        className="clay-input w-full text-sm p-3 resize-none h-20"
                                    />
                                </div>

                                {/* GENERATE BUTTON */}
                                <button
                                    onClick={handleGenerate}
                                    disabled={isGenerating || !selectedImage}
                                    className={`clay-button w-full py-4 rounded-2xl font-bold transition-all transform ${isGenerating || !selectedImage
                                        ? 'opacity-50 cursor-not-allowed'
                                        : 'hover:scale-[1.02] active:scale-[0.98]'
                                        }`}
                                >
                                    {isGenerating ? (
                                        <span className="flex items-center justify-center">
                                            <svg className="animate-spin -ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
                    <div className="flex-1 min-h-[500px] clay-card p-6 flex flex-col">
                        <div className="flex-1 flex flex-col items-center justify-center relative rounded-2xl overflow-hidden bg-white/40 border-2 border-dashed border-gray-200"
                            style={{
                                boxShadow: 'inset 3px 3px 6px rgba(45, 52, 54, 0.05)'
                            }}>
                            {resultImage ? (
                                <div className="relative w-full h-full min-h-[500px]">
                                    <Image
                                        src={resultImage}
                                        alt="Result"
                                        fill
                                        className="object-contain"
                                        unoptimized
                                    />
                                </div>
                            ) : (
                                <div className="text-center p-8 max-w-sm">
                                    <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                                        style={{
                                            background: 'linear-gradient(135deg, #2ECC71 0%, #27ae60 100%)',
                                            boxShadow: '4px 4px 10px rgba(46, 204, 113, 0.3), -2px -2px 6px rgba(255, 255, 255, 0.8)'
                                        }}>
                                        <SparklesIcon className="w-10 h-10 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-[#1a1f24] mb-2">Belum ada hasil</h3>
                                    <p className="text-gray-700 font-medium">Pilih foto, atur gaya, dan tekan tombol Generate untuk melihat keajaiban AI.</p>
                                </div>
                            )}
                        </div>

                        {/* DOWNLOAD ACTIONS */}
                        {resultImage && (
                            <div className="mt-6 flex flex-col sm:flex-row gap-4">
                                <a
                                    href={resultImage}
                                    download="umkm-ai-enhanced.png"
                                    className="clay-button flex-1 py-3 px-6 font-bold rounded-2xl flex items-center justify-center"
                                >
                                    <ArrowDownTrayIcon className="w-5 h-5 mr-2" /> Download HD
                                </a>
                                <button
                                    onClick={() => setResultImage(null)}
                                    className="px-6 py-3 border-2 border-gray-200 bg-white/70 font-medium rounded-2xl hover:bg-[#2ECC71]/10 transition-colors"
                                >
                                    Reset
                                </button>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div >
    );
}
