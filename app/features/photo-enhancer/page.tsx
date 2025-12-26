"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeftIcon, PhotoIcon, SparklesIcon, ArrowDownTrayIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import puter from '@heyputer/puter.js';
import { useCredit } from "@/utils/credits";
import { useRouter } from "next/navigation";

export default function PhotoEnhancerPage() {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [description, setDescription] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [resultImage, setResultImage] = useState<string | null>(null);
    const [errorModal, setErrorModal] = useState<{ show: boolean; title: string; message: string }>({
        show: false,
        title: "",
        message: ""
    });

    // Sub-options state
    const [selectedCategory, setSelectedCategory] = useState("Makanan & Minuman");
    const [selectedStyle, setSelectedStyle] = useState("rustic_cafe");
    const [selectedLighting, setSelectedLighting] = useState<string | null>(null);
    const [selectedComposition, setSelectedComposition] = useState<string | null>(null);
    const [selectedModel, setSelectedModel] = useState<string | null>(null);
    const router = useRouter();

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Configuration Options
    const styleCategories = [
        {
            name: "E-Commerce & Marketplace",
            styles: [
                { id: "clean_white", name: "Putih Bersih (Pro)", icon: "⚪", prompt: "high-end e-commerce product photography, pure white background, soft professional studio lighting, delicate drop shadows, extremely clean and sharp" },
                { id: "soft_pastel", name: "Estetik Pastel", icon: "🎨", prompt: "modern boutique style, solid soft pastel background, minimalist aesthetic, trending on social media, clean layout" },
                { id: "geometric_podium", name: "Podium Minimalis", icon: "🕋", prompt: "product placed on a simple geometric podium, clean studio environment, architectural shadows, premium brand feel" },
                { id: "marketplace_standard", name: "Standar Katalog", icon: "📦", prompt: "professional marketplace catalog photo, neutral light grey background, clear details, even lighting, ready for online shop" }
            ],
            modelOptions: [
                { id: "held_pro", name: "Dipegang (Pro)", prompt: "product held by professional hands, clear visibility, commercial hand modeling" },
                { id: "ecommerce_lifestyle", name: "Lifestyle Katalog", prompt: "clean lifestyle setting, product in natural but well-lit environment, high trust factor" }
            ]
        },
        {
            name: "Makanan & Minuman",
            styles: [
                { id: "rustic_cafe", name: "Rustic Cafe", icon: "☕", prompt: "rustic aesthetic cafe setting, wooden table, warm ambient lighting, cozy atmosphere, highly detailed food textures" },
                { id: "fine_dining", name: "Fine Dining", icon: "🍽️", prompt: "modern fine dining plating, dark slate background, focused spotlight, elegant and expensive look" },
                { id: "fresh_splash", name: "Fresh & Splash", icon: "💦", prompt: "dynamic water splash, condensation, macro photography, vibrant fresh colors, commercial food look" },
                { id: "street_food", name: "Street Food", icon: "🥢", prompt: "vibrant night market atmosphere, blurred city lights background, energetic and authentic street food vibe" },
                { id: "kitchen_modern", name: "Dapur Modern", icon: "🍳", prompt: "clean minimalist kitchen counter, professional culinary environment, bright natural house lighting" },
                { id: "picnic", name: "Piknik Santai", icon: "🧺", prompt: "outdoor picnic setting, green grass, checkered cloth, bright sunny day, relaxed atmosphere" }
            ],
            modelOptions: [
                { id: "food_held", name: "Dipegang Tangan", prompt: "product being held by human hands, interaction with product, close-up" },
                { id: "food_eaten", name: "Sedang Dinikmati", prompt: "a person enjoying the food/drink, taking a bite or sip, candid lifestyle expression" }
            ]
        },
        {
            name: "Fashion & Aksesoris",
            styles: [
                { id: "boutique", name: "Boutique Minimalis", icon: "👗", prompt: "minimalist high-end boutique interior, clean white background, soft shadows, airy and bright" },
                { id: "urban_street", name: "Urban Street", icon: "👟", prompt: "urban street photography, blurred city background, natural daylight, trendy lifestyle vibe" },
                { id: "studio_pro", name: "Studio Pro", icon: "📸", prompt: "professional high-fashion studio setup, neutral grey background, crisp shadows, sharp details" },
                { id: "vintage", name: "Retro / Vintage", icon: "🎞️", prompt: "1970s film aesthetic, muted warm tones, subtle grain, nostalgic boutique feel" },
                { id: "luxury_runway", name: "Runway Mewah", icon: "💎", prompt: "high-fashion runway stage, dramatic spotlights, audience bokeh, expensive couture atmosphere" },
                { id: "boho_chic", name: "Boho Chic", icon: "🌾", prompt: "bohemian style, sun-drenched natural textures, soft earth tones, organic fashion vibe" }
            ],
            modelOptions: [
                { id: "fashion_worn", name: "Dipakai Model", prompt: "product being worn by a professional fashion model, realistic fabric draping, stylish posing" },
                { id: "fashion_walk", name: "Model Berjalan", prompt: "model walking while wearing the product, motion blur in background, dynamic fashion shot" }
            ]
        },
        {
            name: "Kecantikan & Skincare",
            styles: [
                { id: "zen_organic", name: "Organic Zen", icon: "🌿", prompt: "spa-like atmosphere, organic textures like stone and wood, palm leaf shadows, serene and natural" },
                { id: "luxury_marble", name: "Luxury Marble", icon: "💎", prompt: "luxury skincare aesthetic, white marble background, rose gold accents, soft glowing light" },
                { id: "clean_science", name: "Clean Science", icon: "🧪", prompt: "modern laboratory aesthetic, clean glass surfaces, blue and white clinical lighting, fresh and sterile" },
                { id: "summer_glow", name: "Summer Glow", icon: "☀️", prompt: "tropical beach / poolside setting, bright golden hour sunlight, refreshing summer skincare vibe" },
                { id: "evening_glam", name: "Evening Glam", icon: "✨", prompt: "glamorous night atmosphere, bokeh of city lights, sparkling gold accents, dark and rich mood" }
            ],
            modelOptions: [
                { id: "skin_apply", name: "Sedang Dipakai", prompt: "product being applied to glowing human skin or face, close-up of hands and skin texture" },
                { id: "skin_held", name: "Dipegang Model", prompt: "model holding the product near their face, smiling, healthy skin look, soft focus" }
            ]
        },
        {
            name: "Elektronik & Gadget",
            styles: [
                { id: "cyber_tech", name: "Cyberpunk Tech", icon: "⚡", prompt: "futuristic tech vibe, dark environment with neon cyan and magenta accents, holographic elements" },
                { id: "workspace", name: "Modern Workspace", icon: "💻", prompt: "clean ergonomic desk setup, plant in background, soft morning sunlight, professional tech lifestyle" },
                { id: "gaming", name: "Gaming Setup", icon: "🎮", prompt: "immersive gaming room, RGB LED strip lighting, dark moody atmosphere, high-tech aesthetic" },
                { id: "outdoor_rugged", name: "Outdoor Rugged", icon: "🧗", prompt: "rugged mountain or forest environment, tough durable presentation, natural adventure lighting" }
            ],
            modelOptions: [
                { id: "tech_use", name: "Sedang Digunakan", prompt: "hands interacting with the device, product in professional use, realistic workspace environment" },
                { id: "tech_held", name: "Dipegang Tangan", prompt: "close up shot of hands holding the gadget, showcasing design and texture" }
            ]
        },
        {
            name: "Rumah & Dekorasi",
            styles: [
                { id: "scandinavian", name: "Scandinavian", icon: "🪑", prompt: "white bright scandinavian interior, light wood furniture, minimalist and airy, hygge atmosphere" },
                { id: "classic_royal", name: "Classic Royal", icon: "👑", prompt: "luxurious classic interior, velvet textures, gold ornate frames, warm grand atmosphere" },
                { id: "bohemian_home", name: "Bohemian Living", icon: "🪴", prompt: "cozy bohemian living room, many indoor plants, macrame art, warm and earthy textures" },
                { id: "industrial_loft", name: "Industrial Loft", icon: "🧱", prompt: "exposed brick walls, large windows, metallic accents, raw and modern interior" }
            ],
            modelOptions: [
                { id: "home_relax", name: "Santai di Rumah", prompt: "person relaxing near the product, feeling comfortable and at home, soft lifestyle look" },
                { id: "home_rearrange", name: "Menata Barang", prompt: "hands arranging or touching the product, showing scale and placement in a home" }
            ]
        },
        {
            name: "Otomotif & Hobi",
            styles: [
                { id: "night_drive", name: "Night Drive", icon: "🌃", prompt: "cinematic city night drive, long exposure light trails, neon reflections, high octane atmosphere" },
                { id: "showroom", name: "Premium Showroom", icon: "🏎️", prompt: "ultra-clean car showroom, professional spotlights, perfect reflections, high-end commercial look" },
                { id: "adventure_offroad", name: "Adventure Offroad", icon: "🏜️", prompt: "dusty offroad trail, sunset lighting, dynamic action feel, rugged and powerful" }
            ],
            modelOptions: [
                { id: "hobby_use", name: "Sedang Hobi", prompt: "person actively using the hobby item, focus on passion and action, dynamic pose" },
                { id: "hobby_pride", name: "Bangga Memegang", prompt: "person posing proudly with the product, looking at camera, emotional connection" }
            ]
        }
    ];

    const lightingOptions = [
        { id: "soft_sun", name: "Soft Sunlight", prompt: "natural morning sunlight through a window, soft shadows, warm and inviting" },
        { id: "moody", name: "Moody Cinematic", prompt: "cinematic film lighting, high contrast, deep shadows, dramatic atmosphere" },
        { id: "strobe", name: "Studio Strobe", prompt: "professional studio strobe lighting, perfectly even exposure, crisp and commercial" },
        { id: "neon_accent", name: "Neon Accent", prompt: "dramatic neon rim lighting, dual-tone colors, artistic and edgy" }
    ];

    const compositionOptions = [
        { id: "hero", name: "Product Hero", prompt: "centered hero shot, macro detail, soft bokeh background, extremely sharp focus on main product" },
        { id: "life", name: "Lifestyle Context", prompt: "natural lifestyle setting, product in use, realistic environment, warm and relatable" },
        { id: "flatlay", name: "Flatlay Art", prompt: "artistically arranged flatlay from top view, organized knolling style, aesthetic supporting elements" },
        { id: "float", name: "Floating Exhibit", prompt: "surreal floating composition, gravity-defying, clean background, 3D artistic presentation" }
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
            // 1. Credit Check & Deduction
            try {
                await useCredit('photo-enhancer', 1);
            } catch (creditError: any) {
                setErrorModal({
                    show: true,
                    title: "Credit Tidak Cukup",
                    message: "Batas penggunaan gratis Anda telah habis. Silakan hubungi Admin untuk menambah credit atau beralih ke Premium!"
                });
                setIsGenerating(false);
                return;
            }

            // 2. Get Prompts
            let stylePrompt = "";
            styleCategories.forEach(cat => {
                const found = cat.styles.find(s => s.id === selectedStyle);
                if (found) stylePrompt = found.prompt;
            });

            const lightingOption = lightingOptions.find(l => l.id === selectedLighting);
            const lightingPrompt = lightingOption ? ` Lighting: ${lightingOption.prompt}.` : "";

            const compOption = compositionOptions.find(c => c.id === selectedComposition);
            const compPrompt = compOption ? ` Composition: ${compOption.prompt}.` : "";

            const activeCat = styleCategories.find(cat => cat.name === selectedCategory);
            const modelOption = activeCat?.modelOptions?.find(m => m.id === selectedModel);
            const modelPrompt = modelOption ? ` Interaction: ${modelOption.prompt}.` : "";

            // Construct rich prompt
            const userPrompt = description ? ` Additional instructions: ${description}.` : "";
            const finalPrompt = `Transform this product image. Style: ${stylePrompt}.${lightingPrompt}${compPrompt}${modelPrompt}${userPrompt} 
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

            // Puter.js might return a successful response object but with an internal error (e.g. insufficient funds)
            if (image && (image as any).success === false) {
                throw new Error((image as any).error?.message || "Puter internal error");
            }

            if (image && (image as any).src) {
                setResultImage((image as any).src);
            } else if (typeof image === 'string') {
                setResultImage(image);
            } else if (image instanceof HTMLImageElement) {
                setResultImage(image.src);
            } else {
                console.warn("Unexpected response format", image);
                throw new Error("Format respons tidak dikenali");
            }

        } catch (error: any) {
            console.error("Generation failed", error);
            setErrorModal({
                show: true,
                title: "Gagal Membuat Gambar",
                message: "Maaf, generate gambar gagal diproses. Hal ini biasanya terjadi karena Saldo Puter Anda habis, Sesi Login berakhir, atau ada kendala teknis lainnya. Silakan cek akun Puter Anda."
            });
        } finally {
            setIsGenerating(false);
            router.refresh(); // Update header tokens
        }
    };

    return (
        <div className="min-h-screen bg-[#E8ECEF]">
            <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">

                {/* HEADER AREA */}
                <div className="flex items-center space-x-4 mb-8">
                    <Link href="/dashboard" className="p-2 hover:bg-white/50 rounded-xl transition-all clay-card group">
                        <ArrowLeftIcon className="w-6 h-6 text-gray-600 group-hover:text-[#2ECC71]" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-black text-[#1a1f24] tracking-tight">AI Photo Studio</h1>
                        <p className="text-gray-500 font-medium">Ubah foto produk biasa menjadi luar biasa ✨</p>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row items-start gap-8">

                    {/* LEFT PANEL - CONTROLS */}
                    <div className="w-full lg:w-[400px] space-y-6">
                        <div className="clay-card p-6">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="p-2 rounded-xl text-white"
                                    style={{
                                        background: 'linear-gradient(135deg, #2ECC71 0%, #27ae60 100%)',
                                        boxShadow: '3px 3px 6px rgba(46, 204, 113, 0.3), -2px -2px 4px rgba(255, 255, 255, 0.8)'
                                    }}>
                                    <PhotoIcon className="w-6 h-6" />
                                </div>
                                <h1 className="text-2xl font-bold text-[#1a1f24]">Pengaturan</h1>
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
                                <div className="space-y-4">
                                    <label className="text-sm font-bold text-[#1a1f24] block">1. Pilih Kategori & Tema</label>

                                    {/* Category Tabs */}
                                    <div className="flex flex-wrap gap-2">
                                        {styleCategories.map(cat => (
                                            <button
                                                key={cat.name}
                                                onClick={() => {
                                                    setSelectedCategory(cat.name);
                                                    setSelectedStyle(cat.styles[0].id);
                                                    setSelectedModel(null);
                                                }}
                                                className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${selectedCategory === cat.name
                                                    ? 'bg-[#2D3436] text-white shadow-sm'
                                                    : 'bg-white/50 text-gray-500 hover:bg-gray-200 border border-gray-100'
                                                    }`}
                                            >
                                                {cat.name}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Styles for Active Category */}
                                    <div className="grid grid-cols-2 gap-2 pt-2">
                                        {styleCategories
                                            .find(cat => cat.name === selectedCategory)
                                            ?.styles.map(s => (
                                                <button
                                                    key={s.id}
                                                    onClick={() => setSelectedStyle(s.id)}
                                                    className={`px-3 py-2.5 rounded-xl text-sm font-medium cursor-pointer text-left transition-all flex items-center space-x-2 ${selectedStyle === s.id
                                                        ? 'clay-button text-white font-bold scale-[1.02]'
                                                        : 'bg-white/70 text-gray-600 hover:bg-[#2ECC71]/10 border border-gray-100'
                                                        }`}
                                                >
                                                    <span className="text-lg">{s.icon}</span>
                                                    <span className="text-[11px] leading-tight font-bold">{s.name}</span>
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
                                        {selectedComposition && (
                                            <button
                                                onClick={() => setSelectedComposition(null)}
                                                className="px-3 py-2 rounded-xl text-xs cursor-pointer font-medium text-center transition-all border border-red-200 text-red-500 hover:bg-red-50 bg-white/50"
                                            >
                                                Batal Pilih
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* LIGHTING SELECTOR */}
                                <div>
                                    <label className="text-sm font-bold text-[#1a1f24] mb-3 block">3. Pencahayaan (Opsional)</label>
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
                                        {selectedLighting && (
                                            <button
                                                onClick={() => setSelectedLighting(null)}
                                                className="px-3 py-1.5 rounded-full text-xs cursor-pointer font-medium transition-all bg-white text-red-500 border border-red-200 hover:bg-red-50"
                                            >
                                                Batal Pilih
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* MODEL SELECTOR */}
                                <div>
                                    <label className="text-sm font-bold text-[#1a1f24] mb-3 block">4. Kehadiran Model (Opsional)</label>
                                    <div className="flex flex-wrap gap-2">
                                        {styleCategories
                                            .find(cat => cat.name === selectedCategory)
                                            ?.modelOptions?.map(m => (
                                                <button
                                                    key={m.id}
                                                    onClick={() => setSelectedModel(m.id)}
                                                    className={`px-3 py-1.5 rounded-full text-xs cursor-pointer font-medium transition-all ${selectedModel === m.id
                                                        ? 'bg-[#2ECC71] text-white shadow-md'
                                                        : 'bg-white/80 text-gray-600 hover:bg-[#2ECC71]/10 border border-gray-200'
                                                        }`}
                                                >
                                                    {m.name}
                                                </button>
                                            ))}
                                        {selectedModel && (
                                            <button
                                                onClick={() => setSelectedModel(null)}
                                                className="px-3 py-1.5 rounded-full text-xs cursor-pointer font-medium transition-all bg-white text-red-500 border border-red-200 hover:bg-red-50"
                                            >
                                                Tanpa Model
                                            </button>
                                        )}
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
                                            Memproses Studio AI...
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

                    {/* RIGHT PANEL - RESULT (Main Preview) */}
                    <div className="flex-1 w-full min-h-[600px] clay-card p-6 flex flex-col animate-fade-in">
                        <div className="flex-1 flex flex-col items-center justify-center relative rounded-2xl overflow-hidden bg-white/40 border-2 border-dashed border-gray-200"
                            style={{
                                boxShadow: 'inset 3px 3px 6px rgba(45, 52, 54, 0.05)'
                            }}>
                            {resultImage ? (
                                <div className="relative w-full h-full min-h-[500px] animate-fade-in flex items-center justify-center p-4">
                                    <img
                                        src={resultImage}
                                        alt="Result"
                                        className="max-w-full max-h-[700px] object-contain shadow-2xl rounded-lg"
                                    />
                                    <div className="absolute top-4 right-4 bg-[#2ECC71] text-white px-3 py-1.5 rounded-xl text-[10px] font-black shadow-lg animate-bounce-short z-10">
                                        BERHASIL DITINGKATKAN ✨
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center p-8 max-w-sm">
                                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${isGenerating ? 'animate-pulse scale-110' : ''}`}
                                        style={{
                                            background: 'linear-gradient(135deg, #2ECC71 0%, #27ae60 100%)',
                                            boxShadow: '4px 4px 10px rgba(46, 204, 113, 0.3), -2px -2px 6px rgba(255, 255, 255, 0.8)'
                                        }}>
                                        <SparklesIcon className={`w-10 h-10 text-white ${isGenerating ? 'animate-spin-slow' : ''}`} />
                                    </div>
                                    <h3 className="text-xl font-bold text-[#1a1f24] mb-2">
                                        {isGenerating ? 'Sedang Merender...' : 'Belum ada hasil'}
                                    </h3>
                                    <p className="text-gray-700 font-medium mb-4">
                                        {isGenerating
                                            ? 'AI sedang bekerja meningkatkan kualitas foto produk Anda. Harap tunggu sebentar.'
                                            : 'Pilih foto, atur gaya, dan tekan tombol Generate untuk melihat keajaiban AI.'}
                                    </p>

                                    {isGenerating && (
                                        <div className="w-full max-w-[200px] mx-auto pt-2">
                                            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden shadow-inner">
                                                <div className="h-full bg-[#2ECC71] animate-loading-bar" />
                                            </div>
                                            <p className="text-[10px] font-black text-[#2ECC71] mt-3 animate-pulse uppercase tracking-widest">Memproses Studio AI...</p>
                                        </div>
                                    )}
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
                                    className="clay-button px-6 py-3 border-2 border-gray-200 bg-white/70 font-medium rounded-2xl hover:bg-[#2ECC71]/10 transition-colors"
                                >
                                    Ubah Pengaturan
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
                                href="https://puter.com"
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
                                Mungkin Nanti
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
