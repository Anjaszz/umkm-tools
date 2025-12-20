"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeftIcon, ChatBubbleLeftRightIcon, ClipboardIcon } from "@heroicons/react/24/outline";

interface Option {
    id: string;
    label: string;
    promptPart: string;
}

const messageTypes: Option[] = [
    { id: "greeting", label: "Sapaan Awal / Greeting", promptPart: "Greeting/Sapaan awal yang ramah untuk customer baru." },
    { id: "complaint", label: "Balasan Komplain", promptPart: "Respon untuk komplain pelanggan, minta maaf dan tawarkan solusi." },
    { id: "shipping", label: "Info Pengiriman/Resi", promptPart: "Informasi status pengiriman atau update nomor resi." },
    { id: "stock", label: "Stok Kosong/Ready", promptPart: "Informasi ketersediaan stok produk." },
    { id: "review", label: "Minta Ulasan/Review", promptPart: "Permintaan sopan untuk memberikan ulasan positif bintang 5." },
    { id: "followup", label: "Follow-up Pesanan", promptPart: "Follow-up pesanan yang belum dibayar atau dikonfirmasi." },
];

const tones: Option[] = [
     { id: "olshop", label: "Khas Toko Online", promptPart: "Gaya bahasa khas admin online shop, panggil Sis/Gan/Kak, ramah, banyak emoji, to the point." },
    { id: "friendly", label: "Ramah & Akrab (Friendly)", promptPart: "Nada bicara ramah, akrab, pakai emoji, seperti teman." },
    { id: "formal", label: "Formal & Profesional", promptPart: "Nada bicara formal, sopan, profesional, baku." },
    { id: "empathetic", label: "Empati & Maaf", promptPart: "Nada bicara penuh empati, memohon maaf, sabar (cocok untuk komplain)." },
    { id: "enthusiastic", label: "Antusias & Semangat", promptPart: "Nada bicara semangat, ceria, pakai tanda seru positif." },
   
];

export default function CSTemplateGenerator() {
    const [selectedType, setSelectedType] = useState<string>("");
    const [selectedTone, setSelectedTone] = useState<string>(tones[0].id);
    const [customerName, setCustomerName] = useState("");
    const [context, setContext] = useState("");

    const [generatedMessage, setGeneratedMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showCopyNotif, setShowCopyNotif] = useState(false);

    const handleGenerate = async () => {
        setLoading(true);
        setError("");
        setGeneratedMessage("");

        try {
            const typeOption = messageTypes.find(t => t.id === selectedType);
            const toneOption = tones.find(t => t.id === selectedTone);

            const response = await fetch("/api/generate-cs-template", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type: selectedType, // Send ID instead of prompt part
                    tone: toneOption?.promptPart,
                    customerName,
                    context
                }),
            });

            const data = await response.json();

            if (data.success && data.text) {
                setGeneratedMessage(data.text);
            } else {
                throw new Error(data.error || "Gagal membuat template");
            }
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Terjadi kesalahan.");
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedMessage);
        setShowCopyNotif(true);
        setTimeout(() => setShowCopyNotif(false), 2000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 dark:from-gray-900 dark:to-gray-800">
            {showCopyNotif && (
                <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in-down">
                    Pesan berhasil disalin!
                </div>
            )}

            {/* Header */}
            <div className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <Link
                        href="/"
                        className="inline-flex items-center text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 mb-4 transition-colors"
                    >
                        <ArrowLeftIcon className="w-5 h-5 mr-2" />
                        Kembali ke Dashboard
                    </Link>
                    <div className="flex items-center gap-3">
                        <ChatBubbleLeftRightIcon className="w-10 h-10 text-green-600 dark:text-green-400" />
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                                Template Customer Service
                            </h1>
                            <p className="mt-2 text-gray-600 dark:text-gray-300">
                                Buat balasan chat otomatis yang ramah dan profesional dalam hitungan detik
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Input Section */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                                Konfigurasi Pesan
                            </h2>

                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Tipe Pesan
                                    </label>
                                    <select
                                        value={selectedType}
                                        onChange={(e) => {
                                            setSelectedType(e.target.value);
                                            setCustomerName("");
                                            setContext("");
                                        }}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                                    >
                                        <option value="" disabled>-- Pilih Tipe Pesan --</option>
                                        {messageTypes.map(type => (
                                            <option key={type.id} value={type.id}>{type.label}</option>
                                        ))}
                                    </select>
                                </div>

                                {selectedType && (
                                    <div className="space-y-5 animate-fade-in-up">

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Tone / Nada Bicara
                                            </label>
                                            <select
                                                value={selectedTone}
                                                onChange={(e) => setSelectedTone(e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                                            >
                                                {tones.map(tone => (
                                                    <option key={tone.id} value={tone.id}>{tone.label}</option>
                                                ))}
                                            </select>
                                        </div>

                                        {selectedType === "greeting" && (
                                            <>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                        Nama Toko
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={customerName} // Reusing customerName for storeName temporarily or add new state? better new state.
                                                        // Actually let's use a dynamic object for inputs to keep it clean
                                                        onChange={(e) => setCustomerName(e.target.value)}
                                                        placeholder="Contoh: Toko Hijab Cantik"
                                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                        Jam Operasional & Deskripsi Singkat
                                                    </label>
                                                    <textarea
                                                        value={context}
                                                        onChange={(e) => setContext(e.target.value)}
                                                        placeholder="Contoh: Buka Senin-Jumat 08.00 - 17.00. Kami menjual berbagai macam hijab premium."
                                                        rows={3}
                                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                                                    />
                                                </div>
                                            </>
                                        )}

                                        {selectedType === "complaint" && (
                                            <>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                        Nama Customer
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={customerName}
                                                        onChange={(e) => setCustomerName(e.target.value)}
                                                        placeholder="Contoh: Kak Budi"
                                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                        Detail Masalah / Konteks
                                                    </label>
                                                    <textarea
                                                        value={context}
                                                        onChange={(e) => setContext(e.target.value)}
                                                        placeholder="Contoh: Barang rusak saat diterima, minta refund."
                                                        rows={4}
                                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                                                    />
                                                </div>
                                            </>
                                        )}

                                        {selectedType !== "greeting" && selectedType !== "complaint" && (
                                            <>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                        Nama Customer (Opsional)
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={customerName}
                                                        onChange={(e) => setCustomerName(e.target.value)}
                                                        placeholder="Contoh: Kak Budi"
                                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                        {selectedType === "shipping" ? "Nomor Resi / Status Pengiriman" :
                                                            selectedType === "stock" ? "Detail Produk / Stok" :
                                                                selectedType === "review" ? "Detail Produk yang Dibeli" :
                                                                    selectedType === "followup" ? "Detail Pesanan" :
                                                                        "Konteks / Detail Tambahan"}
                                                    </label>
                                                    <textarea
                                                        value={context}
                                                        onChange={(e) => setContext(e.target.value)}
                                                        placeholder={
                                                            selectedType === "shipping" ? "Contoh: JNE 1234567890, sudah dikirim hari ini." :
                                                                selectedType === "stock" ? "Contoh: Gamis Merah XL habis, sisa warna Biru." :
                                                                    selectedType === "review" ? "Contoh: Pembelian Hijab Premium." :
                                                                        "Contoh: Pesanan #123 belum dibayar."
                                                        }
                                                        rows={4}
                                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                                                    />
                                                </div>
                                            </>
                                        )}

                                        <button
                                            onClick={handleGenerate}
                                            disabled={loading}
                                            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform active:scale-95 transition-all flex items-center justify-center gap-2"
                                        >
                                            {loading ? "Sedang Menulis..." : "Buat Template Pesan"}
                                        </button>

                                        {error && (
                                            <p className="text-red-500 text-sm text-center">{error}</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Result Section */}
                    <div className="lg:col-span-2">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 h-full flex flex-col">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center justify-between">
                                <span>Preview Pesan</span>
                                {generatedMessage && (
                                    <button
                                        onClick={copyToClipboard}
                                        className="text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-white px-3 py-1 rounded-lg flex items-center gap-2 transition-colors"
                                    >
                                        <ClipboardIcon className="w-4 h-4" />
                                        Salin Teks
                                    </button>
                                )}
                            </h2>

                            <div className="flex-1 bg-gray-50 dark:bg-gray-900 rounded-xl p-6 border-2 border-dashed border-gray-200 dark:border-gray-700">
                                {generatedMessage ? (
                                    <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                                        {generatedMessage}
                                    </div>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                        <ChatBubbleLeftRightIcon className="w-16 h-16 mb-4 opacity-50" />
                                        <p className="text-lg">Pesanan template Anda akan muncul di sini</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
