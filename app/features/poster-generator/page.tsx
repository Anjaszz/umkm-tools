"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    SparklesIcon,
    ArrowDownTrayIcon,
    PhotoIcon,
    ArrowLeftIcon,
    SwatchIcon,
    DocumentTextIcon,
    CheckCircleIcon,
    ChevronRightIcon,
    ChevronLeftIcon,
    PaintBrushIcon,
    UserGroupIcon,
    RocketLaunchIcon
} from "@heroicons/react/24/outline";

import puter from '@heyputer/puter.js';

export default function PosterGeneratorPage() {
    const [step, setStep] = useState(1);
    const [isGenerating, setIsGenerating] = useState(false);
    const [resultImage, setResultImage] = useState<string | null>(null);

    // Form States
    const [contentType, setContentType] = useState("Poster Promosi");
    const [format, setFormat] = useState("1:1");
    const [headline, setHeadline] = useState("");
    const [subheadline, setSubheadline] = useState("");
    const [cta, setCta] = useState("");
    const [price, setPrice] = useState("");
    const [brandName, setBrandName] = useState("");
    const [style, setStyle] = useState("Modern");
    const [mood, setMood] = useState("Profesional");
    const [audience, setAudience] = useState("Semua Orang");
    const [colorScheme, setColorScheme] = useState("Auto");
    const [productImage, setProductImage] = useState<string | null>(null);

    const [errorModal, setErrorModal] = useState<{ show: boolean; title: string; message: string }>({
        show: false,
        title: "",
        message: ""
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

    const contentTypes = [
        "Poster Promosi", "Banner Digital", "Event / Webinar", "Product Launch", "Diskon / Flash Sale", "Sosial Media Post"
    ];

    const formats = [
        { id: "1:1", name: "Instagram Post (1:1)", w: 1024, h: 1024 },
        { id: "9:16", name: "Instagram Story (9:16)", w: 1024, h: 1820 },
        { id: "16:9", name: "Facebook/Web Banner (16:9)", w: 1820, h: 1024 },
        { id: "3:4", name: "Poster Standar (3:4)", w: 1024, h: 1365 }
    ];

    const styles = [
        { id: "Modern", icon: "🚀" },
        { id: "Minimalist", icon: "✨" },
        { id: "Luxury", icon: "💎" },
        { id: "Fun / Colorful", icon: "🎨" },
        { id: "Futuristic", icon: "🛸" },
        { id: "Corporate", icon: "🏢" }
    ];

    const moodOptions = ["Profesional", "Ceria", "Eksklusif", "Ramah", "Enerjik", "Tenang"];
    const audienceOptions = ["Remaja", "Dewasa", "Profesional", "UMKM", "Semua Orang"];

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setProductImage(event.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleGenerate = async () => {
        setIsGenerating(true);
        setResultImage(null);

        try {
            const formatObj = formats.find(f => f.id === format);

            // Logic for Product Preservation
            const isImg2Img = !!productImage;
            let finalPrompt = "";

            if (isImg2Img) {
                finalPrompt = `ACT AS A SENIOR GRAPHIC DESIGNER. 
                    MANDATORY: Use the provided input image as the CENTRAL HERO PRODUCT. DO NOT substitute it.
                    TASK: Create a professional ${contentType} for the brand "${brandName}".
                    
                    TEXT ACCURACY & SPELLING (CRITICAL):
                      - BRAND NAME: "${brandName}" (MUST BE SPELLED EXACTLY LIKE THIS).
                      - HEADLINE: "${headline}" (STRICT SPELLING, NO TYPOS, NO ALTERATIONS).
                      - SUBHEADLINE: "${subheadline}".
                      - CTA: "${cta}".
                      - PRICE: "${price}".
                    ZERO TOLERANCE: Ensure every character in the Brand and Headline is rendered exactly as provided. No hallucinations in text.
                    
                    LAYOUT: Place the product in a premium hero position. Use high-end typography that is clean and readable.
                    STYLE: ${style} style, ${mood} mood for ${audience}.
                    COLOR SCHEME: ${colorScheme === 'Auto' ? 'Harmonious with the product colors' : colorScheme}.
                    ENVIRONMENT: Create a professional ${style.toLowerCase()} commercial background around the product.
                    QUALITY: 8k, award-winning commercial design, photorealistic.`;
            } else {
                finalPrompt = `ACT AS A SENIOR GRAPHIC DESIGNER. 
                    STRICT TEXT ACCURACY: You MUST spell these exactly: Brand "${brandName}", Headline "${headline}".
                    TASK: Create a stunning ${contentType} design.
                    DETAILS: CTA "${cta}", Price "${price}", Subheadline "${subheadline}".
                    STYLE: ${style}, ${mood}, targeting ${audience}.
                    COMPOSITION: High-quality professional graphic design with zero spelling errors. 8k resolution.`;
            }

            const options: any = {
                model: "gemini-2.5-flash-image-preview",
            };

            if (productImage) {
                const mimeType = productImage.match(/[^:]\w+\/[\w-+\d.]+(?=;|,)/)?.[0] || "image/png";
                options.input_image = productImage.split(',')[1];
                options.input_image_mime_type = mimeType;
            }

            const image = await puter.ai.txt2img(finalPrompt, options);

            if (image && (image as any).success === false) {
                throw new Error((image as any).error?.message || "Puter internal error");
            }

            if (image && (image as any).src) {
                setResultImage((image as any).src);
            } else if (typeof image === 'string') {
                setResultImage(image);
            } else if (image instanceof Blob) {
                const url = URL.createObjectURL(image);
                setResultImage(url);
            } else if ((image as any).url) {
                setResultImage((image as any).url);
            } else if (image && typeof (image as any).toDataURL === 'function') {
                setResultImage((image as any).toDataURL());
            } else {
                console.warn("Unexpected response format", image);
                throw new Error("Format respons tidak dikenali");
            }

        } catch (error: any) {
            console.error("Generation failed:", error);
            setErrorModal({
                show: true,
                title: "Gagal Membuat Poster",
                message: "Maaf, terjadi kendala teknis. Pastikan saldo Puter Anda mencukupi atau coba lagi nanti. (" + error.message + ")"
            });
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F0F3F5] pb-20">
            {/* HEADER */}
            <div className="bg-white/70 backdrop-blur-md border-b border-gray-200 sticky top-0 z-30">
                <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
                    <Link href="/dashboard" className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                        <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
                    </Link>
                    <div className="flex flex-col items-center">
                        <h1 className="text-lg font-black text-[#1a1f24] leading-tight">AI Poster Generator</h1>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Step {step} of 3</p>
                    </div>
                    <div className="w-9" /> {/* Spacer */}
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 pt-8">

                {/* PROGRESS BAR */}
                <div className="flex gap-2 mb-8 px-2">
                    {[1, 2, 3].map((s) => (
                        <div key={s} className={`h-2 flex-1 rounded-full transition-all duration-500 ${step >= s ? 'bg-[#2ECC71] shadow-[0_0_10px_rgba(46,204,113,0.3)]' : 'bg-gray-200'}`} />
                    ))}
                </div>

                <div className="flex flex-col lg:flex-row gap-8">

                    {/* LEFT PANEL - FORM */}
                    <div className="w-full lg:w-[450px] space-y-6">
                        <div className="clay-card p-8 min-h-[500px] flex flex-col">

                            {/* STEP 1: TYPE & FORMAT */}
                            {step === 1 && (
                                <div className="space-y-6 animate-fade-in flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <RocketLaunchIcon className="w-6 h-6 text-[#2ECC71]" />
                                        <h2 className="text-xl font-bold text-[#1a1f24]">Pilih Jenis & Format</h2>
                                    </div>

                                    <div>
                                        <label className="text-xs font-black text-gray-400 uppercase mb-3 block">Jenis Konten</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {contentTypes.map((type) => (
                                                <button
                                                    key={type}
                                                    onClick={() => setContentType(type)}
                                                    className={`py-3 px-3 rounded-2xl text-[11px] font-bold border-2 transition-all ${contentType === type
                                                        ? 'bg-[#2ECC71] text-white border-[#27ae60] shadow-md'
                                                        : 'bg-white border-gray-100 text-gray-600 hover:border-[#2ECC71]/30'
                                                        }`}
                                                >
                                                    {type}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs font-black text-gray-400 uppercase mb-3 block">Ukuran / Format</label>
                                        <div className="space-y-2">
                                            {formats.map((f) => (
                                                <button
                                                    key={f.id}
                                                    onClick={() => setFormat(f.id)}
                                                    className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${format === f.id
                                                        ? 'bg-[#1a1f24] text-white border-black shadow-lg'
                                                        : 'bg-white border-gray-100 text-gray-600 hover:border-[#2ECC71]/30'
                                                        }`}
                                                >
                                                    <span className="text-sm font-bold">{f.name}</span>
                                                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${format === f.id ? 'bg-white/20' : 'bg-gray-100'}`}>{f.id}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* STEP 2: CONTENT & TEXT */}
                            {step === 2 && (
                                <div className="space-y-5 animate-fade-in flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <DocumentTextIcon className="w-6 h-6 text-[#2ECC71]" />
                                        <h2 className="text-xl font-bold text-[#1a1f24]">Detail Informasi</h2>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-[10px] font-black text-gray-400 uppercase ml-1 mb-1 block">Nama Brand / Toko</label>
                                            <input type="text" value={brandName} onChange={(e) => setBrandName(e.target.value)} placeholder="Contoh: Kopi Anjaszz" className="clay-input w-full p-4 text-sm font-bold" />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-gray-400 uppercase ml-1 mb-1 block">Judul Utama (Headline)</label>
                                            <input type="text" value={headline} onChange={(e) => setHeadline(e.target.value)} placeholder="Contoh: Promo Gila!" className="clay-input w-full p-4 text-sm font-bold" />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-gray-400 uppercase ml-1 mb-1 block">Subjudul / Deskripsi</label>
                                            <textarea value={subheadline} onChange={(e) => setSubheadline(e.target.value)} placeholder="Contoh: Diskon 50% untuk semua menu kopi susu." className="clay-input w-full p-4 text-sm font-bold h-20 resize-none" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="text-[10px] font-black text-gray-400 uppercase ml-1 mb-1 block">CTA Button</label>
                                                <input type="text" value={cta} onChange={(e) => setCta(e.target.value)} placeholder="Beli Sekarang" className="clay-input w-full p-4 text-xs font-bold" />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black text-gray-400 uppercase ml-1 mb-1 block">Harga / Promo</label>
                                                <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Rp 15.000" className="clay-input w-full p-4 text-xs font-bold" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* STEP 3: VISUAL STYLE */}
                            {step === 3 && (
                                <div className="space-y-6 animate-fade-in flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <PaintBrushIcon className="w-6 h-6 text-[#2ECC71]" />
                                        <h2 className="text-xl font-bold text-[#1a1f24]">Gaya Visual</h2>
                                    </div>

                                    <div>
                                        <label className="text-xs font-black text-gray-400 uppercase mb-3 block">Gaya Desain</label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {styles.map((s) => (
                                                <button
                                                    key={s.id}
                                                    onClick={() => setStyle(s.id)}
                                                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all ${style === s.id
                                                        ? 'bg-[#2ECC71] text-white border-[#27ae60] shadow-md'
                                                        : 'bg-white border-gray-100 text-gray-600 hover:border-[#2ECC71]/30'
                                                        }`}
                                                >
                                                    <span className="text-lg mb-1">{s.icon}</span>
                                                    <span className="text-[9px] font-black uppercase">{s.id.split(' ')[0]}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-black text-gray-400 uppercase mb-2 block">Mood</label>
                                            <select value={mood} onChange={(e) => setMood(e.target.value)} className="clay-input w-full p-3 text-xs font-bold bg-white">
                                                {moodOptions.map(m => <option key={m} value={m}>{m}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-xs font-black text-gray-400 uppercase mb-2 block">Target</label>
                                            <select value={audience} onChange={(e) => setAudience(e.target.value)} className="clay-input w-full p-3 text-xs font-bold bg-white">
                                                {audienceOptions.map(a => <option key={a} value={a}>{a}</option>)}
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs font-black text-gray-400 uppercase mb-3 block">Foto Produk Utama (Opsional)</label>
                                        <div
                                            onClick={() => fileInputRef.current?.click()}
                                            className={`w-full aspect-square border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden ${productImage ? 'border-[#2ECC71] bg-[#2ECC71]/5' : 'border-gray-200 bg-white/50 hover:border-[#2ECC71]'}`}
                                        >
                                            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                                            {productImage ? (
                                                <img src={productImage} alt="Preview" className="w-full h-full object-contain p-4" />
                                            ) : (
                                                <>
                                                    <PhotoIcon className="w-8 h-8 text-gray-300 mb-2" />
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase">Upload Foto</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* NAVIGATION BUTTONS */}
                            <div className="pt-8 flex gap-3 mt-auto">
                                {step > 1 && (
                                    <button
                                        onClick={() => setStep(step - 1)}
                                        className="flex-1 py-4 px-6 bg-white border-2 border-gray-100 rounded-2xl font-bold text-gray-400 hover:text-[#1a1f24] hover:border-gray-200 transition-all flex items-center justify-center gap-2"
                                    >
                                        <ChevronLeftIcon className="w-4 h-4" /> Kembali
                                    </button>
                                )}
                                {step < 3 ? (
                                    <button
                                        onClick={() => setStep(step + 1)}
                                        className="flex-[2] py-4 px-6 clay-button rounded-2xl font-bold text-white flex items-center justify-center gap-2 transform active:scale-95 transition-all shadow-lg"
                                    >
                                        Lanjut ke Step {step + 1} <ChevronRightIcon className="w-4 h-4" />
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleGenerate}
                                        disabled={isGenerating || !headline}
                                        className="flex-[2] py-4 px-6 clay-button rounded-2xl font-bold text-white flex items-center justify-center gap-2 transform active:scale-95 transition-all disabled:opacity-50"
                                    >
                                        {isGenerating ? (
                                            <span className="flex items-center gap-2">
                                                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                </svg>
                                                Generate...
                                            </span>
                                        ) : (
                                            <>
                                                <SparklesIcon className="w-5 h-5" /> Generate Poster
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT PANEL - PREVIEW */}
                    <div className="flex-1 space-y-6">
                        <div className="clay-card p-6 min-h-[500px] flex flex-col">
                            <div className="absolute top-4 right-4 bg-[#2ECC71] text-white px-3 py-1.5 rounded-xl text-[10px] font-black shadow-lg animate-bounce-short z-10">
                                HASIL GENERATE ✨
                            </div>
                            <div className="flex-1 bg-white/50 border-2 border-dashed border-gray-200 rounded-3xl overflow-hidden relative flex items-center justify-center group shadow-inner">
                                {resultImage ? (
                                    <div className="w-full h-full animate-fade-in relative p-2 flex items-center justify-center bg-gray-50">
                                        <img
                                            src={resultImage}
                                            alt="Generated Poster"
                                            className="max-w-full max-h-full object-contain shadow-2xl rounded-lg"
                                        />

                                    </div>
                                ) : (
                                    <div className="text-center p-12 space-y-4">
                                        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto shadow-clay border-4 border-white">
                                            <SparklesIcon className={`w-12 h-12 text-[#2ECC71] ${isGenerating ? 'animate-pulse' : ''}`} />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black text-[#1a1f24]">Poster & Content AI</h3>
                                            <p className="text-sm font-bold text-gray-400 italic">"Desain profesional dalam hitungan detik."</p>
                                        </div>
                                        {isGenerating && (
                                            <div className="w-full max-w-[200px] mx-auto pt-4">
                                                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                                    <div className="h-full bg-[#2ECC71] animate-loading-bar" />
                                                </div>
                                                <p className="text-[10px] font-black text-[#2ECC71] mt-2 animate-pulse uppercase tracking-widest">Merancang Visual...</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* RESULT ACTIONS */}
                            {resultImage && (
                                <div className="mt-6 flex gap-4">
                                    <a
                                        href={resultImage}
                                        download={`poster-${headline.toLowerCase().replace(/\s+/g, '-')}.png`}
                                        className="flex-1 clay-button py-4 px-6 rounded-2xl font-black flex items-center justify-center gap-2"
                                    >
                                        <ArrowDownTrayIcon className="w-5 h-5" /> Download HD
                                    </a>
                                    <button
                                        onClick={() => setResultImage(null)}
                                        className="px-6 py-4 bg-white border-2 border-gray-100 rounded-2xl font-bold text-gray-600 hover:bg-gray-50 transition-all"
                                    >
                                        Ulangi
                                    </button>
                                </div>
                            )}

                            {/* DRAFT PREVIEW (While editing) */}
                            {!resultImage && !isGenerating && headline && (
                                <div className="mt-6 p-4 bg-[#1a1f24]/5 rounded-2xl border border-dashed border-[#1a1f24]/10">
                                    <div className="flex items-center gap-2 mb-2">
                                        <CheckCircleIcon className="w-4 h-4 text-[#2ECC71]" />
                                        <span className="text-[10px] font-black uppercase text-gray-500">Draft Summary</span>
                                    </div>
                                    <p className="text-xs font-bold text-[#1a1f24] truncate">"{headline}" - {style} Style</p>
                                </div>
                            )}
                        </div>

                        {/* DESAIN TIPS */}
                        <div className="bg-[#2ECC71]/10 border-2 border-[#2ECC71]/20 p-6 rounded-[2.5rem]">
                            <h4 className="flex items-center gap-2 font-black text-[#1a1f24] text-xs uppercase tracking-wider mb-2">
                                <SparklesIcon className="w-4 h-4 text-[#2ECC71]" /> Tip Desain Cepat
                            </h4>
                            <p className="text-xs font-bold text-gray-600 leading-relaxed italic">
                                "Gunakan headline yang singkat dan memicu rasa penasaran untuk hasil yang lebih estetik."
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ERROR MODAL */}
            {errorModal.show && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
                    <div className="clay-card max-w-md w-full p-8 text-center">
                        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 bg-red-50 text-red-500">
                            <DocumentTextIcon className="w-10 h-10" />
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
        </div>
    );
}
