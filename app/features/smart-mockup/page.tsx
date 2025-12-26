"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    SparklesIcon,
    ArrowDownTrayIcon,
    PhotoIcon,
    ArrowLeftIcon,
    SwatchIcon,
    ArrowsPointingOutIcon,
    TrashIcon,
} from "@heroicons/react/24/outline";

import puter from '@heyputer/puter.js';
import { useCredit } from "@/utils/credits";
import { useRouter } from "next/navigation";

export default function SmartMockupPage() {
    const router = useRouter();
    const [designImage, setDesignImage] = useState<string | null>(null);
    const [mockupImage, setMockupImage] = useState<string | null>(null);
    const [mockupContext, setMockupContext] = useState("");
    const [selectedTheme, setSelectedTheme] = useState("studio");
    const [selectedLighting, setSelectedLighting] = useState("pro_studio");
    const [selectedAngle, setSelectedAngle] = useState("eye_level");
    const [isGenerating, setIsGenerating] = useState(false);
    const [resultImage, setResultImage] = useState<string | null>(null);

    // Position & Scale states for design overlay
    const [posX, setPosX] = useState(50); // percentage
    const [posY, setPosY] = useState(50); // percentage
    const [scale, setScale] = useState(30); // percentage
    const [opacity, setOpacity] = useState(80); // percentage

    const [errorModal, setErrorModal] = useState<{ show: boolean; title: string; message: string }>({
        show: false,
        title: "",
        message: ""
    });

    const mockupThemes = [
        { id: "studio", name: "Clean Studio", icon: "📸", prompt: "Minimalist professional studio background, clean surfaces, neutral elegant tones, high-end photography" },
        { id: "cafe", name: "Modern Cafe", icon: "☕", prompt: "Modern aesthetic cafe setting, wooden textures, blurred cafe background, cozy warm atmosphere" },
        { id: "outdoor", name: "Nature/Outdoor", icon: "🌿", prompt: "Natural outdoor setting, soft sunlight, blurred garden or park background, fresh organic vibe" },
        { id: "urban", name: "Urban/Street", icon: "🏢", prompt: "Trendy urban street background, city bokeh, industrial concrete textures, modern lifestyle vibe" },
        { id: "luxury", name: "Luxury Interior", icon: "✨", prompt: "Expensive luxury marble interior, gold accents, soft ambient lighting, premium brand aesthetic" }
    ];

    const lightingOptions = [
        { id: "pro_studio", name: "Pro Studio", prompt: "Soft multi-point studio lighting, delicate soft shadows, crisp details" },
        { id: "cinematic", name: "Cinematic", prompt: "Dramatic cinematic lighting, high contrast, focused spotlight, moody atmosphere" },
        { id: "natural", name: "Golden Hour", prompt: "Warm golden hour sunlight, soft long shadows, glowing highlights" },
        { id: "neon", name: "Cyber/Neon", prompt: "Vibrant neon accent lighting, cyan and magenta highlights, futuristic tech vibe" }
    ];

    const angleOptions = [
        { id: "eye_level", name: "Eye Level", prompt: "Standard eye-level professional product shot" },
        { id: "top_down", name: "Top Down / Flatlay", prompt: "Flatlay photography from directly above, organized aesthetic" },
        { id: "close_up", name: "Macro / Close-up", prompt: "Close-up macro photography focusing on texture and details" },
        { id: "low_angle", name: "Hero / Low Angle", prompt: "Low angle shot making the product look heroic and grand" }
    ];

    const designInputRef = useRef<HTMLInputElement>(null);
    const mockupInputRef = useRef<HTMLInputElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'design' | 'mockup') => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const result = event.target?.result as string;
                if (type === 'design') setDesignImage(result);
                else setMockupImage(result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleGenerate = async () => {
        if (!designImage || !mockupImage) {
            alert("Harap unggah desain dan foto produk polos!");
            return;
        }

        setIsGenerating(true);
        setResultImage(null);

        try {
            // Credit Deduction (1.0)
            try {
                await useCredit('smart-mockup', 1.0);
            } catch (creditError: any) {
                setErrorModal({
                    show: true,
                    title: "Gagal Memproses Credit",
                    message: creditError.message || "Maaf, terjadi kendala saat memproses credit Anda. Harap coba lagi atau hubungi admin."
                });
                setIsGenerating(false);
                return;
            }
            // 1. Create Composite Image using Canvas
            const canvas = canvasRef.current;
            if (!canvas) throw new Error("Canvas not found");
            const ctx = canvas.getContext('2d');
            if (!ctx) throw new Error("Context not found");

            const mockupImg = new window.Image();
            const designImg = new window.Image();

            mockupImg.src = mockupImage;
            await new Promise((resolve) => (mockupImg.onload = resolve));

            designImg.src = designImage;
            await new Promise((resolve) => (designImg.onload = resolve));

            // Set canvas size to mockup size
            canvas.width = mockupImg.width;
            canvas.height = mockupImg.height;

            // Draw mockup
            ctx.drawImage(mockupImg, 0, 0);

            // Calculate design position and scale
            const designScale = (scale / 100) * (mockupImg.width / designImg.width);
            const dWidth = designImg.width * designScale;
            const dHeight = designImg.height * designScale;
            const dX = (posX / 100) * mockupImg.width - dWidth / 2;
            const dY = (posY / 100) * mockupImg.height - dHeight / 2;

            // Draw design with opacity
            ctx.globalAlpha = opacity / 100;
            ctx.drawImage(designImg, dX, dY, dWidth, dHeight);
            ctx.globalAlpha = 1.0;

            const compositeBase64 = canvas.toDataURL('image/png');

            const base64Data = compositeBase64.split(',')[1];

            // 2. Use Puter AI to refine and blend with theme
            const themeObj = mockupThemes.find(t => t.id === selectedTheme);
            const lightingObj = lightingOptions.find(l => l.id === selectedLighting);
            const angleObj = angleOptions.find(a => a.id === selectedAngle);

            const contextPrompt = mockupContext ? `The product is: ${mockupContext}. ` : "The object is a commercial product. ";
            const finalPrompt = `Professional product mockup. 
                ENVIRONMENT: ${themeObj?.prompt}. 
                LIGHTING: ${lightingObj?.prompt}. 
                CAMERA ANGLE: ${angleObj?.prompt}.
                DESIGN PRESERVATION: DO NOT ALTER, REGENERATE, OR CHANGE THE PROVIDED DESIGN/LOGO. Keep its text, shapes, and colors exactly as they appear in the input image.
                ACTION: Photorealistically blend the provided design onto the product surface. Only add realistic material textures, 3D mapping (following the product's curvature), and natural light/shadow interactions.
                The background and environment should be enhanced to match the theme, but the BRAND IDENTITY (the logo) MUST REMAIN 100% IDENTICAL to the source.
                8k resolution, award-winning commercial photography, ultra-realistic.`;

            const image = await puter.ai.txt2img(finalPrompt, {
                model: "gemini-2.5-flash-image-preview",
                input_image: base64Data,
                input_image_mime_type: "image/png"
            });

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
            console.error("Mockup generation failed", error);
            setErrorModal({
                show: true,
                title: "Gagal Membuat Mockup",
                message: "Terjadi kesalahan saat memproses mockup. Pastikan saldo Puter Anda mencukupi dan koneksi internet stabil."
            });
        } finally {
            setIsGenerating(false);
            router.refresh();
        }
    };

    return (
        <div className="min-h-screen bg-[#E8ECEF]">
            <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">

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
                                    <ArrowsPointingOutIcon className="w-6 h-6" />
                                </div>
                                <h1 className="text-2xl font-bold text-[#1a1f24]">Smart Mockup</h1>
                            </div>

                            <div className="space-y-6">
                                {/* UPLOAD 1: DESIGN */}
                                <div>
                                    <label className="text-sm font-bold text-[#1a1f24] mb-2 block">1. Unggah Desain / Logo</label>
                                    <div
                                        onClick={() => designInputRef.current?.click()}
                                        className={`relative w-full aspect-square rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden ${designImage ? 'border-[#2ECC71] bg-[#2ECC71]/5' : 'border-gray-200 bg-white/50 hover:border-[#2ECC71]'}`}
                                    >
                                        <input type="file" ref={designInputRef} className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'design')} />
                                        {designImage ? (
                                            <Image src={designImage} alt="Design" fill className="object-contain p-4" unoptimized />
                                        ) : (
                                            <>
                                                <SwatchIcon className="w-8 h-8 text-gray-400 mb-2" />
                                                <span className="text-xs font-bold text-gray-500">Pilih Desain (PNG/JPG)</span>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* UPLOAD 2: MOCKUP */}
                                <div>
                                    <label className="text-sm font-bold text-[#1a1f24] mb-2 block">2. Unggah Foto Produk Polos</label>
                                    <div
                                        onClick={() => mockupInputRef.current?.click()}
                                        className={`relative w-full aspect-square rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden ${mockupImage ? 'border-[#2ECC71] bg-[#2ECC71]/5' : 'border-gray-200 bg-white/50 hover:border-[#2ECC71]'}`}
                                    >
                                        <input type="file" ref={mockupInputRef} className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'mockup')} />
                                        {mockupImage ? (
                                            <Image src={mockupImage} alt="Mockup" fill className="object-cover" unoptimized />
                                        ) : (
                                            <>
                                                <PhotoIcon className="w-8 h-8 text-gray-400 mb-2" />
                                                <span className="text-xs font-bold text-gray-500">Foto Kaos/Botol/Gelas Polos</span>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* CONTEXT DESCRIPTION */}
                                <div>
                                    <label className="text-sm font-bold text-[#1a1f24] mb-2 block">3. Deskripsikan Barangnya (Opsional)</label>
                                    <textarea
                                        value={mockupContext}
                                        onChange={(e) => setMockupContext(e.target.value)}
                                        placeholder="Misal: Gelas kopi putih, Kaos hitam, atau Botol kaca"
                                        className="clay-input w-full text-sm p-3 h-16 resize-none font-medium text-gray-700 font-mono"
                                    />
                                    <p className="text-[10px] text-gray-400 mt-1 font-bold italic">*Contoh: Gelas kopi keramik</p>
                                </div>

                                {/* THEME SELECTION */}
                                <div>
                                    <label className="text-sm font-bold text-[#1a1f24] mb-3 block text-center lg:text-left">4. Pilih Tema Background</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {mockupThemes.map((theme) => (
                                            <button
                                                key={theme.id}
                                                onClick={() => setSelectedTheme(theme.id)}
                                                className={`flex items-center p-3 rounded-2xl transition-all border-2 ${selectedTheme === theme.id
                                                    ? 'bg-[#2ECC71] text-white border-[#27ae60] shadow-md scale-[1.02]'
                                                    : 'bg-white text-gray-600 border-gray-100 hover:border-[#2ECC71]/30'
                                                    }`}
                                            >
                                                <span className="text-lg mr-2">{theme.icon}</span>
                                                <span className="text-[10px] font-black uppercase tracking-tight leading-none">{theme.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* LIGHTING SELECTION */}
                                <div>
                                    <label className="text-sm font-bold text-[#1a1f24] mb-3 block text-center lg:text-left">5. Pencahayaan & Mood</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {lightingOptions.map((light) => (
                                            <button
                                                key={light.id}
                                                onClick={() => setSelectedLighting(light.id)}
                                                className={`px-3 py-2 rounded-xl text-[10px] font-bold transition-all border-2 ${selectedLighting === light.id
                                                    ? 'bg-[#2D3436] text-white border-[#000] shadow-sm'
                                                    : 'bg-white/70 text-gray-600 border-gray-50 hover:bg-white'
                                                    }`}
                                            >
                                                {light.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* ANGLE SELECTION */}
                                <div>
                                    <label className="text-sm font-bold text-[#1a1f24] mb-3 block text-center lg:text-left">6. Sudut Pandang Kamera</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {angleOptions.map((angle) => (
                                            <button
                                                key={angle.id}
                                                onClick={() => setSelectedAngle(angle.id)}
                                                className={`px-3 py-2 rounded-xl text-[10px] font-bold transition-all border-2 ${selectedAngle === angle.id
                                                    ? 'bg-[#3498DB] text-white border-[#2980b9] shadow-sm'
                                                    : 'bg-white/70 text-gray-600 border-gray-50 hover:bg-white'
                                                    }`}
                                            >
                                                {angle.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* ADJUSTMENTS */}
                                {(designImage && mockupImage) && (
                                    <div className="space-y-4 pt-4 border-t border-gray-100">
                                        <div className="flex justify-between items-center">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Atur Posisi & Ukuran</label>
                                            <button onClick={() => { setDesignImage(null); setMockupImage(null); }} className="text-red-500 p-1 hover:bg-red-50 rounded-lg transition-colors">
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <div className="space-y-3">
                                            <div>
                                                <div className="flex justify-between text-[10px] font-bold text-gray-500 mb-1">
                                                    <span>UKURAN</span>
                                                    <span>{scale}%</span>
                                                </div>
                                                <input type="range" min="1" max="100" value={scale} onChange={(e) => setScale(parseInt(e.target.value))} className="w-full accent-[#2ECC71]" />
                                            </div>
                                            <div>
                                                <div className="flex justify-between text-[10px] font-bold text-gray-500 mb-1">
                                                    <span>POSISI X</span>
                                                    <span>{posX}%</span>
                                                </div>
                                                <input type="range" min="0" max="100" value={posX} onChange={(e) => setPosX(parseInt(e.target.value))} className="w-full accent-[#2ECC71]" />
                                            </div>
                                            <div>
                                                <div className="flex justify-between text-[10px] font-bold text-gray-500 mb-1">
                                                    <span>POSISI Y</span>
                                                    <span>{posY}%</span>
                                                </div>
                                                <input type="range" min="0" max="100" value={posY} onChange={(e) => setPosY(parseInt(e.target.value))} className="w-full accent-[#2ECC71]" />
                                            </div>
                                            <div>
                                                <div className="flex justify-between text-[10px] font-bold text-gray-500 mb-1">
                                                    <span>TRANSPARANSI (DRAFT)</span>
                                                    <span>{opacity}%</span>
                                                </div>
                                                <input type="range" min="10" max="100" value={opacity} onChange={(e) => setOpacity(parseInt(e.target.value))} className="w-full accent-[#2ECC71]" />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <button
                                    onClick={handleGenerate}
                                    disabled={isGenerating || !designImage || !mockupImage}
                                    className={`clay-button w-full py-4 rounded-2xl font-bold transition-all transform ${isGenerating || !designImage || !mockupImage
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
                                            Memproses Mockup...
                                        </span>
                                    ) : (
                                        <span className="flex items-center justify-center">
                                            <SparklesIcon className="w-5 h-5 mr-2" />
                                            Jadikan Realistis
                                        </span>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT PANEL - PREVIEW / RESULT */}
                    <div className="flex-1 min-h-[500px] clay-card p-6 flex flex-col">
                        <div className="flex-1 flex flex-col items-center justify-center relative rounded-2xl overflow-hidden bg-white/40 border-2 border-dashed border-gray-200"
                            style={{
                                boxShadow: 'inset 3px 3px 6px rgba(45, 52, 54, 0.05)'
                            }}>

                            {resultImage ? (
                                <div className="relative w-full h-full min-h-[500px]">
                                    <Image src={resultImage} alt="Result" fill className="object-contain" unoptimized />
                                    <div className="absolute top-4 right-4 bg-[#2ECC71] text-white px-3 py-1 rounded-lg text-xs font-bold animate-pulse shadow-lg">
                                        Hasil AI Selesai!
                                    </div>
                                </div>
                            ) : mockupImage ? (
                                <div className="relative w-full h-full min-h-[500px] flex items-center justify-center">
                                    <Image src={mockupImage} alt="Mockup Preview" fill className="object-contain" unoptimized />
                                    {designImage && (
                                        <div
                                            className="absolute pointer-events-none transition-all duration-75"
                                            style={{
                                                top: `${posY}%`,
                                                left: `${posX}%`,
                                                width: `${scale}%`,
                                                transform: `translate(-50%, -50%)`,
                                                opacity: opacity / 100
                                            }}
                                        >
                                            <img src={designImage} alt="Design Overlay" className="w-full h-auto" />
                                        </div>
                                    )}
                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur px-4 py-2 rounded-full text-[10px] font-black text-gray-500 border border-white">
                                        MODE DRAFT: Geser slider untuk atur posisi
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center p-8 max-w-sm">
                                    <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                                        style={{
                                            background: 'linear-gradient(135deg, #2ECC71 0%, #27ae60 100%)',
                                            boxShadow: '4px 4px 10px rgba(46, 204, 113, 0.3), -2px -2px 6px rgba(255, 255, 255, 0.8)'
                                        }}>
                                        <PhotoIcon className="w-10 h-10 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-[#1a1f24] mb-2">Editor Mockup Pintar</h3>
                                    <p className="text-gray-700 font-medium italic">"Tempelkan logo Anda ke barang fisik apa saja secara instan."</p>
                                </div>
                            )}

                            {/* HIDDEN CANVAS FOR COMPOSITING */}
                            <canvas ref={canvasRef} className="hidden" />
                        </div>

                        {/* ACTIONS */}
                        {resultImage && (
                            <div className="mt-6 flex flex-col sm:flex-row gap-4">
                                <a
                                    href={resultImage}
                                    download="smart-mockup.png"
                                    className="clay-button flex-1 py-3 px-6 font-bold rounded-2xl flex items-center justify-center"
                                >
                                    <ArrowDownTrayIcon className="w-5 h-5 mr-2" /> Simpan Hasil (HD)
                                </a>
                                <button
                                    onClick={() => setResultImage(null)}
                                    className="px-6 py-3 border-2 border-gray-200 bg-white/70 font-medium rounded-2xl hover:bg-[#2ECC71]/10 transition-colors"
                                >
                                    Atur Ulang
                                </button>
                            </div>
                        )}
                    </div>

                </div>
            </div>

            {/* ERROR MODAL */}
            {errorModal.show && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
                    <div className="clay-card max-w-md w-full p-8 text-center">
                        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 bg-red-50 text-red-500">
                            <TrashIcon className="w-10 h-10" />
                        </div>
                        <h2 className="text-2xl font-bold text-[#1a1f24] mb-4">{errorModal.title}</h2>
                        <p className="text-gray-700 font-medium mb-8 leading-relaxed">
                            {errorModal.message}
                        </p>
                        <button
                            onClick={() => setErrorModal({ ...errorModal, show: false })}
                            className="clay-button w-full py-4 rounded-2xl font-bold"
                        >
                            Tutup
                        </button>
                    </div>
                </div>
            )}
        </div >
    );
}
