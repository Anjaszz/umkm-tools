"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    SparklesIcon,
    ArrowDownTrayIcon,
    SwatchIcon,
    ArrowLeftIcon,
} from "@heroicons/react/24/outline";

import puter from '@heyputer/puter.js';

export default function LogoGeneratorPage() {
    const [brandName, setBrandName] = useState("");
    const [slogan, setSlogan] = useState("");
    const [brandDescription, setBrandDescription] = useState("");
    const [industry, setIndustry] = useState("Kuliner");
    const [style, setStyle] = useState("Minimalist");
    const [selectedColors, setSelectedColors] = useState<string[]>(["#2ECC71"]);
    const [logoType, setLogoType] = useState<"both" | "icon_only" | "text_only">("both");
    const [isGenerating, setIsGenerating] = useState(false);
    const [resultImage, setResultImage] = useState<string | null>(null);
    const [errorModal, setErrorModal] = useState<{ show: boolean; title: string; message: string }>({
        show: false,
        title: "",
        message: ""
    });

    const industries = [
        "Kuliner", "Fashion", "Kecantikan", "Teknologi", "Jasa", "Kesehatan", "Pendidikan", "Otomotif"
    ];

    const logoStyles = [
        { id: "Minimalist", name: "Minimalis", prompt: "clean, minimalist, modern, simple geometric shapes, sans-serif typography, huge negative space" },
        { id: "Vintage", name: "Retro / Vintage", prompt: "vintage badge style, hand-drawn look, classic serif typography, textured, nostalgic" },
        { id: "Luxury", name: "Mewah / Elegan", prompt: "luxurious, gold accents, elegant script font, premium feel, sophisticated symbol" },
        { id: "Playful", name: "Ceria / Playful", prompt: "fun, friendly, vibrant colors, rounded shapes, character mascot, bold typography" },
        { id: "Professional", name: "Profesional", prompt: "corporate, reliable, solid, bold strokes, sharp edges, modern and trustworthy" }
    ];

    const handleGenerate = async () => {
        if (!brandName) {
            alert("Mohon masukkan nama brand Anda!");
            return;
        }

        setIsGenerating(true);
        setResultImage(null);

        try {
            const selectedStyle = logoStyles.find(s => s.id === style);

            const logoTypePrompt = logoType === "both"
                ? "combination mark logo with both a unique symbol and typography"
                : logoType === "icon_only"
                    ? "pictorial mark logo, icon only, no text"
                    : "wordmark logo, typography only, no icon";

            // Construct visual prompt
            const finalPrompt = `Professional logo design for a brand named "${brandName}". 
            Brand Description: ${brandDescription}.
            Slogan/Subtext: "${slogan}". 
            Industry: ${industry}. 
            Logo Type: ${logoTypePrompt}.
            Style Preference: ${selectedStyle?.prompt}. 
            Color Palette: ${selectedColors.join(", ")}. 
            The logo should be a high-quality vector-style graphic on a clean white background. 
            Ensure the branding is memorable, professional, and reflects the industry.
            Award-winning design, 8k resolution, centered composition.`;

            // Using Puter.js
            const image = await puter.ai.txt2img(finalPrompt, {
                model: "gemini-2.5-flash-image-preview",
            });

            // check internal error
            if (image && (image as any).success === false) {
                throw new Error((image as any).error?.message || "Puter internal error");
            }

            if (image && (image as any).src) {
                setResultImage((image as any).src);
            } else if (typeof image === 'string') {
                setResultImage(image);
            } else {
                throw new Error("Format respons tidak dikenali");
            }

        } catch (error: any) {
            console.error("Logo generation failed", error);
            setErrorModal({
                show: true,
                title: "Gagal Membuat Logo",
                message: "Maaf, generate logo gagal diproses. Hal ini biasanya terjadi karena Saldo Puter Anda habis atau ada kendala teknis lainnya. Silakan cek akun Puter Anda."
            });
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#E8ECEF]">
            <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">

                {/* Back Button */}
                <Link href="/dashboard" className="inline-flex items-center text-gray-600 hover:text-[#2ECC71] font-bold mb-8 transition-colors">
                    <ArrowLeftIcon className="w-4 h-4 mr-2" /> Kembali ke Dashboard
                </Link>

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
                                    <SwatchIcon className="w-6 h-6" />
                                </div>
                                <h1 className="text-2xl font-bold text-[#1a1f24]">Logo Generator</h1>
                            </div>

                            <div className="space-y-6">
                                {/* BRAND NAME */}
                                <div>
                                    <label className="text-sm font-bold text-[#1a1f24] mb-2 block">
                                        Nama Brand / Toko
                                    </label>
                                    <input
                                        type="text"
                                        value={brandName}
                                        onChange={(e) => setBrandName(e.target.value)}
                                        placeholder="Contoh: Kopi Kenangan"
                                        className="clay-input w-full text-sm p-3"
                                    />
                                </div>

                                {/* SLOGAN */}
                                <div>
                                    <label className="text-sm font-bold text-[#1a1f24] mb-2 block">
                                        Slogan (Opsional)
                                    </label>
                                    <input
                                        type="text"
                                        value={slogan}
                                        onChange={(e) => setSlogan(e.target.value)}
                                        placeholder="Contoh: Nikmat Tiada Tara"
                                        className="clay-input w-full text-sm p-3"
                                    />
                                </div>

                                {/* BRAND DESCRIPTION */}
                                <div>
                                    <label className="text-sm font-bold text-[#1a1f24] mb-2 block">
                                        Ceritakan Tentang Brand Anda
                                    </label>
                                    <textarea
                                        value={brandDescription}
                                        onChange={(e) => setBrandDescription(e.target.value)}
                                        placeholder="Contoh: Toko kue tradisional yang menggunakan bahan organik dan resep warisan keluarga..."
                                        className="clay-input w-full text-sm p-3 h-24 resize-none"
                                    />
                                </div>

                                {/* INDUSTRY */}
                                <div>
                                    <label className="text-sm font-bold text-[#1a1f24] mb-3 block">Bidang Usaha</label>
                                    <div className="flex flex-wrap gap-2">
                                        {industries.map(ind => (
                                            <button
                                                key={ind}
                                                onClick={() => setIndustry(ind)}
                                                className={`px-3 py-1.5 rounded-full text-xs cursor-pointer font-medium transition-all ${industry === ind
                                                    ? 'bg-[#2ECC71] text-white shadow-md'
                                                    : 'bg-white/80 text-gray-600 hover:bg-[#2ECC71]/10 border border-gray-200'
                                                    }`}
                                            >
                                                {ind}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* STYLE SELECTOR */}
                                <div>
                                    <label className="text-sm font-bold text-[#1a1f24] mb-3 block">Gaya Desain</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {logoStyles.map(s => (
                                            <button
                                                key={s.id}
                                                onClick={() => setStyle(s.id)}
                                                className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${style === s.id
                                                    ? 'bg-[#2D3436] text-white shadow-sm'
                                                    : 'bg-white/70 text-gray-600 hover:bg-[#2ECC71]/10 border border-gray-100'
                                                    }`}
                                            >
                                                {s.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* LOGO TYPE */}
                                <div>
                                    <label className="text-sm font-bold text-[#1a1f24] mb-3 block">Jenis Logo</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {[
                                            { id: "both", name: "Simbol + Teks" },
                                            { id: "icon_only", name: "Simbol Saja" },
                                            { id: "text_only", name: "Teks Saja" }
                                        ].map(t => (
                                            <button
                                                key={t.id}
                                                onClick={() => setLogoType(t.id as any)}
                                                className={`px-1 py-2 rounded-xl text-[10px] font-bold transition-all ${logoType === t.id
                                                    ? 'bg-[#2D3436] text-white shadow-sm'
                                                    : 'bg-white/70 text-gray-600 border border-gray-100'
                                                    }`}
                                            >
                                                {t.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* PRIMARY COLOR */}
                                <div>
                                    <label className="text-sm font-bold text-[#1a1f24] mb-3 block">Warna (Maksimal 3)</label>
                                    <div className="flex flex-wrap items-center gap-3">
                                        {selectedColors.map((color, index) => (
                                            <div key={index} className="relative group">
                                                <input
                                                    type="color"
                                                    value={color}
                                                    onChange={(e) => {
                                                        const newColors = [...selectedColors];
                                                        newColors[index] = e.target.value;
                                                        setSelectedColors(newColors);
                                                    }}
                                                    className="w-10 h-10 rounded-lg cursor-pointer border-none bg-transparent"
                                                />
                                                {selectedColors.length > 1 && (
                                                    <button
                                                        onClick={() => setSelectedColors(selectedColors.filter((_, i) => i !== index))}
                                                        className="absolute -top-2 -right-2 bg-red-500 text-white w-4 h-4 rounded-full text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        ✕
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                        {selectedColors.length < 3 && (
                                            <button
                                                onClick={() => setSelectedColors([...selectedColors, "#ffffff"])}
                                                className="w-10 h-10 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:border-[#2ECC71] hover:text-[#2ECC71] transition-all"
                                            >
                                                +
                                            </button>
                                        )}
                                    </div>
                                    <div className="mt-2 flex gap-2">
                                        {selectedColors.map((c, i) => (
                                            <span key={i} className="text-[10px] font-bold text-gray-500 uppercase">{c}</span>
                                        ))}
                                    </div>
                                </div>

                                {/* GENERATE BUTTON */}
                                <button
                                    onClick={handleGenerate}
                                    disabled={isGenerating || !brandName}
                                    className={`clay-button w-full py-4 rounded-2xl font-bold transition-all transform ${isGenerating || !brandName
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
                                            Mernacang Logo...
                                        </span>
                                    ) : (
                                        <span className="flex items-center justify-center">
                                            <SparklesIcon className="w-5 h-5 mr-2" />
                                            Buat Logo Sekarang
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
                                <div className="relative w-full h-full min-h-[500px] bg-white">
                                    <Image
                                        src={resultImage}
                                        alt="Logo Result"
                                        fill
                                        className="object-contain p-8"
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
                                    <h3 className="text-xl font-bold text-[#1a1f24] mb-2">Siap Branding?</h3>
                                    <p className="text-gray-700 font-medium">Isi nama brand dan pilih gaya di samping, AI akan merancang logo unik untuk Anda.</p>
                                </div>
                            )}
                        </div>

                        {/* DOWNLOAD ACTIONS */}
                        {resultImage && (
                            <div className="mt-6 flex flex-col sm:flex-row gap-4">
                                <a
                                    href={resultImage}
                                    download={`${brandName}-logo.png`}
                                    className="clay-button flex-1 py-3 px-6 font-bold rounded-2xl flex items-center justify-center"
                                >
                                    <ArrowDownTrayIcon className="w-5 h-5 mr-2" /> Simpan Logo (PNG)
                                </a>
                                <button
                                    onClick={() => setResultImage(null)}
                                    className="px-6 py-3 border-2 border-gray-200 bg-white/70 font-medium rounded-2xl hover:bg-[#2ECC71]/10 transition-colors"
                                >
                                    Buat Ulang
                                </button>
                            </div>
                        )}
                    </div>

                </div>
            </div>

            {/* ERROR MODAL */}
            {errorModal.show && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="clay-card max-w-md w-full p-8 text-center animate-in zoom-in-95 duration-300">
                        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 bg-amber-50 text-amber-500 border-2 border-amber-100">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-[#1a1f24] mb-4">{errorModal.title}</h2>
                        <p className="text-gray-700 font-medium mb-8 leading-relaxed">
                            {errorModal.message}
                        </p>
                        <div className="space-y-3">
                            <a
                                href="https://puter.com/account"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="clay-button w-full py-4 rounded-2xl font-bold block transition-all hover:scale-[1.02] active:scale-[0.98]"
                            >
                                Periksa Akun & Saldo Puter
                            </a>
                            <button
                                onClick={() => setErrorModal({ ...errorModal, show: false })}
                                className="w-full py-3 text-gray-500 font-bold hover:text-gray-700 transition-colors"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div >
    );
}
