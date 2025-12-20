"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeftIcon, PhotoIcon, ArrowDownTrayIcon, SwatchIcon } from "@heroicons/react/24/outline";

export default function BackgroundRemover() {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [processedImage, setProcessedImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [bgColor, setBgColor] = useState("transparent");
    const [quality, setQuality] = useState<"preview" | "full">("preview");

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setSelectedImage(reader.result as string);
                setProcessedImage(null);
                setError("");
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveBackground = async () => {
        if (!selectedImage) return;

        setLoading(true);
        setError("");

        try {
            const base64Data = selectedImage.split(",")[1];

            const response = await fetch("/api/remove-background", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    imageData: base64Data,
                    size: quality
                }),
            });

            const data = await response.json();

            if (data.success && data.image) {
                setProcessedImage(`data:image/png;base64,${data.image}`);
            } else {
                throw new Error(data.error || "Gagal menghapus background");
            }
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Terjadi kesalahan. Pastikan API Key remove.bg sudah benar.");
        } finally {
            setLoading(false);
        }
    };

    const downloadImage = () => {
        if (!processedImage) return;

        if (bgColor === 'transparent') {
            const link = document.createElement("a");
            link.href = processedImage;
            link.download = "removed-bg.png";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            const img = new window.Image();

            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;

                if (ctx) {
                    ctx.fillStyle = bgColor;
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(img, 0, 0);

                    const dataUrl = canvas.toDataURL("image/png");
                    const link = document.createElement("a");
                    link.href = dataUrl;
                    link.download = "removed-bg-edited.png";
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
            };
            img.src = processedImage;
        }
    };

    return (
        <div className="min-h-screen bg-[#E8ECEF]">
            <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Upload Section */}
                    <div className="clay-card p-6">
                        <h2 className="text-xl font-bold text-[#1a1f24] mb-4">
                            1. Upload Foto
                        </h2>

                        {!selectedImage ? (
                            <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <PhotoIcon className="w-12 h-12 text-[#2ECC71] mb-3 opacity-80" />
                                    <p className="text-sm text-[#1a1f24] font-bold">Klik untuk upload foto produk</p>
                                    <p className="text-xs text-[#1a1f24]/60 mt-1 font-medium">PNG, JPG (Max. 5MB)</p>
                                </div>
                                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                            </label>
                        ) : (
                            <div className="space-y-4">
                                <div className="relative h-64 w-full bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden flex items-center justify-center">
                                    <Image
                                        src={selectedImage}
                                        alt="Original"
                                        width={400}
                                        height={400}
                                        style={{ objectFit: "contain", maxHeight: "100%" }}
                                    />
                                </div>

                                {/* Quality Selection */}
                                <div className="flex gap-4 items-center justify-center bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="quality"
                                            checked={quality === "preview"}
                                            onChange={() => setQuality("preview")}
                                            className="text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-sm font-bold text-[#1a1f24]">
                                            Normal (Gratis)
                                        </span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="quality"
                                            checked={quality === "full"}
                                            onChange={() => setQuality("full")}
                                            className="text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-sm font-bold text-[#1a1f24]">
                                            HD / Full Res (1 Credit)
                                        </span>
                                    </label>
                                </div>

                                <div className="flex gap-2">
                                    <label className="flex-1 bg-white hover:bg-gray-50 text-[#1a1f24] font-bold py-2 px-4 rounded-xl text-center cursor-pointer transition-all border-2 border-[#2ECC71]/20 shadow-sm">
                                        Ganti Foto
                                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                    </label>
                                    <button
                                        onClick={handleRemoveBackground}
                                        disabled={loading || !!processedImage}
                                        className="flex-1 clay-button py-2 px-4 rounded-2xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? (
                                            <>
                                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                </svg>
                                                Processing...
                                            </>
                                        ) : (
                                            "Hapus Background"
                                        )}
                                    </button>
                                </div>
                                {error && (
                                    <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm font-bold">
                                        {error}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Result Section */}
                    <div className="clay-card p-6">
                        <h2 className="text-xl font-bold text-[#1a1f24] mb-4">
                            2. Hasil
                        </h2>

                        {processedImage ? (
                            <div className="space-y-6">
                                {/* Preview Area */}
                                <div
                                    className="relative h-64 w-full rounded-xl overflow-hidden flex items-center justify-center border-2 border-gray-200 dark:border-gray-700"
                                    style={{
                                        backgroundColor: bgColor === 'transparent' ? 'transparent' : bgColor,
                                        backgroundImage: bgColor === 'transparent' ? 'repeating-linear-gradient(45deg, #e5e7eb 25%, transparent 25%, transparent 75%, #e5e7eb 75%, #e5e7eb), repeating-linear-gradient(45deg, #e5e7eb 25%, #f9fafb 25%, #f9fafb 75%, #e5e7eb 75%, #e5e7eb)' : 'none',
                                        backgroundPosition: '0 0, 10px 10px',
                                        backgroundSize: '20px 20px'
                                    }}
                                >
                                    <Image
                                        src={processedImage}
                                        alt="Processed"
                                        width={400}
                                        height={400}
                                        style={{ objectFit: "contain", maxHeight: "100%" }}
                                    />
                                </div>

                                {/* Editor Controls */}
                                <div>
                                    <h3 className="text-sm font-bold text-[#1a1f24] mb-3">Ganti Background</h3>
                                    <div className="flex flex-wrap gap-2">
                                        <button
                                            onClick={() => setBgColor('transparent')}
                                            className={`w-8 h-8 rounded-full border-2 ${bgColor === 'transparent' ? 'border-blue-500 scale-110' : 'border-gray-300'}`}
                                            style={{
                                                backgroundImage: 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)',
                                                backgroundSize: '10px 10px',
                                                backgroundColor: 'white'
                                            }}
                                            title="Transparent"
                                        />
                                        <button onClick={() => setBgColor('#FFFFFF')} className={`w-8 h-8 rounded-full border-2 bg-white ${bgColor === '#FFFFFF' ? 'border-blue-500 scale-110' : 'border-gray-300'}`} title="White" />
                                        <button onClick={() => setBgColor('#000000')} className={`w-8 h-8 rounded-full border-2 bg-black ${bgColor === '#000000' ? 'border-blue-500 scale-110' : 'border-gray-300'}`} title="Black" />
                                        <button onClick={() => setBgColor('#EF4444')} className={`w-8 h-8 rounded-full border-2 bg-red-500 ${bgColor === '#EF4444' ? 'border-blue-500 scale-110' : 'border-gray-300'}`} title="Red" />
                                        <button onClick={() => setBgColor('#3B82F6')} className={`w-8 h-8 rounded-full border-2 bg-blue-500 ${bgColor === '#3B82F6' ? 'border-blue-500 scale-110' : 'border-gray-300'}`} title="Blue" />
                                        <button onClick={() => setBgColor('#10B981')} className={`w-8 h-8 rounded-full border-2 bg-green-500 ${bgColor === '#10B981' ? 'border-blue-500 scale-110' : 'border-gray-300'}`} title="Green" />
                                        <button onClick={() => setBgColor('#F59E0B')} className={`w-8 h-8 rounded-full border-2 bg-yellow-500 ${bgColor === '#F59E0B' ? 'border-blue-500 scale-110' : 'border-gray-300'}`} title="Yellow" />
                                        <input
                                            type="color"
                                            value={bgColor === 'transparent' ? '#FFFFFF' : bgColor}
                                            onChange={(e) => setBgColor(e.target.value)}
                                            className="w-8 h-8 p-0 rounded-full border-0 overflow-hidden cursor-pointer"
                                            title="Custom Color"
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={downloadImage}
                                    className="clay-button w-full py-4 px-6 flex items-center justify-center gap-2 transform active:scale-95 transition-all"
                                >
                                    <ArrowDownTrayIcon className="w-5 h-5" />
                                    Download Hasil
                                </button>


                            </div>
                        ) : (
                            <div className="h-64 flex flex-col items-center justify-center text-[#1a1f24]/40 bg-white/30 rounded-2xl border-2 border-dashed border-[#2ECC71]/30">
                                <PhotoIcon className="w-12 h-12 mb-2 opacity-30 text-[#2ECC71]" />
                                <p className="text-sm font-bold">Hasil akan muncul di sini</p>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}
