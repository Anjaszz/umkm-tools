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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-800">
            {/* Header */}
            <div className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <Link
                        href="/"
                        className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4 transition-colors"
                    >
                        <ArrowLeftIcon className="w-5 h-5 mr-2" />
                        Kembali ke Dashboard
                    </Link>
                    <div className="flex items-center gap-3">
                        <SwatchIcon className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                                Background Remover
                            </h1>
                            <p className="mt-2 text-gray-600 dark:text-gray-300">
                                Hapus background foto produk secara otomatis dalam hitungan detik
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Upload Section */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                            1. Upload Foto
                        </h2>

                        {!selectedImage ? (
                            <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <PhotoIcon className="w-12 h-12 text-gray-400 mb-3" />
                                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Klik untuk upload foto produk</p>
                                    <p className="text-xs text-gray-400 mt-1">PNG, JPG (Max. 5MB)</p>
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
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
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
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            HD / Full Res (1 Credit)
                                        </span>
                                    </label>
                                </div>

                                <div className="flex gap-2">
                                    <label className="flex-1 btn bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg text-center cursor-pointer transition-colors">
                                        Ganti Foto
                                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                    </label>
                                    <button
                                        onClick={handleRemoveBackground}
                                        disabled={loading || !!processedImage}
                                        className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
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
                                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-sm">
                                        {error}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Result Section */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
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
                                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Ganti Background</h3>
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
                                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform active:scale-95 transition-all flex items-center justify-center gap-2"
                                >
                                    <ArrowDownTrayIcon className="w-5 h-5" />
                                    Download Hasil
                                </button>


                            </div>
                        ) : (
                            <div className="h-64 flex flex-col items-center justify-center text-gray-400 bg-gray-50 dark:bg-gray-700/50 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-600">
                                <PhotoIcon className="w-12 h-12 mb-2 opacity-50" />
                                <p className="text-sm">Hasil akan muncul di sini</p>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}
