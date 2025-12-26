"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeftIcon, ChatBubbleLeftRightIcon, ClipboardIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { useCredit } from "@/utils/credits";
import { useRouter } from "next/navigation";

interface Option {
    id: string;
    label: string;
    description: string;
    promptPart: string;
    icon?: string;
}

const messageTypes: Option[] = [
    { id: "greeting", label: "Sapaan Awal / Greeting", description: "Greeting/Sapaan awal yang ramah", promptPart: "Greeting/Sapaan awal yang ramah untuk customer baru.", icon: "👋" },
    { id: "complaint", label: "Balasan Komplain", description: "Respon solutif untuk komplain", promptPart: "Respon untuk komplain pelanggan, minta maaf dan tawarkan solusi.", icon: "🛠️" },
    { id: "shipping", label: "Info Pengiriman/Resi", description: "Update status & nomor resi", promptPart: "Informasi status pengiriman atau update nomor resi.", icon: "📦" },
    { id: "stock", label: "Stok Kosong/Ready", description: "Info ketersediaan produk", promptPart: "Informasi ketersediaan stok produk.", icon: "📊" },
    { id: "review", label: "Minta Ulasan/Review", description: "Permintaan bintang 5", promptPart: "Permintaan sopan untuk memberikan ulasan positif bintang 5.", icon: "⭐" },
    { id: "followup", label: "Follow-up Pesanan", description: "Cek pembayaran/konfirmasi", promptPart: "Follow-up pesanan yang belum dibayar atau dikonfirmasi.", icon: "🔔" },
];

const tones: Option[] = [
    { id: "olshop", label: "Khas Toko Online", description: "Admin Olshop Sis/Gan", promptPart: "Gaya bahasa khas admin online shop, panggil Sis/Gan/Kak, ramah, banyak emoji, to the point.", icon: "📱" },
    { id: "friendly", label: "Ramah & Akrab", description: "Gaya bicara santai", promptPart: "Nada bicara ramah, akrab, pakai emoji, seperti teman.", icon: "😊" },
    { id: "formal", label: "Formal & Profesional", description: "Bahasa baku & sopan", promptPart: "Nada bicara formal, sopan, profesional, baku.", icon: "👔" },
    { id: "empathetic", label: "Empati & Maaf", description: "Penuh pengertian", promptPart: "Nada bicara penuh empati, memohon maaf, sabar (cocok untuk komplain).", icon: "🤝" },
    { id: "enthusiastic", label: "Antusias & Semangat", description: "Ceria & persuasif", promptPart: "Nada bicara semangat, ceria, pakai tanda seru positif.", icon: "🚀" },
];

export default function CSTemplateGenerator() {
    const router = useRouter();
    const [selectedType, setSelectedType] = useState<string>("");
    const [selectedTone, setSelectedTone] = useState<string>(tones[0].id);
    const [customerName, setCustomerName] = useState("");
    const [context, setContext] = useState("");

    const [generatedMessage, setGeneratedMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showCopyNotif, setShowCopyNotif] = useState(false);

    // Dropdown States
    const [isTypeOpen, setIsTypeOpen] = useState(false);
    const [isToneOpen, setIsToneOpen] = useState(false);

    const handleGenerate = async () => {
        setLoading(true);
        setGeneratedMessage("");

        try {
            // Credit Deduction (0.25)
            try {
                await useCredit('cs-templates', 0.25);
            } catch (creditError: any) {
                setError(creditError.message || "Gagal memproses credit. Harap hubungi admin.");
                setLoading(false);
                return;
            }
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
            router.refresh();
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedMessage);
        setShowCopyNotif(true);
        setTimeout(() => setShowCopyNotif(false), 2000);
    };

    return (
        <div className="min-h-screen bg-[#E8ECEF]">
            {showCopyNotif && (
                <div className="fixed top-24 right-4 z-50 bg-[#2ECC71] text-white px-6 py-3 rounded-2xl shadow-xl font-bold flex items-center gap-2 animate-bounce-short">
                    <ClipboardIcon className="w-5 h-5" />
                    Pesan berhasil disalin!
                </div>
            )}

            {(isTypeOpen || isToneOpen) && (
                <div
                    className="fixed inset-0 z-30 bg-transparent"
                    onClick={() => {
                        setIsTypeOpen(false);
                        setIsToneOpen(false);
                    }}
                />
            )}

            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Input Section */}
                    <div className={`lg:col-span-1 space-y-6 ${(isTypeOpen || isToneOpen) ? 'relative z-40' : ''}`}>
                        <div className="clay-card p-6">
                            <h2 className="text-xl font-bold text-[#1a1f24] mb-6">
                                Konfigurasi Pesan
                            </h2>

                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-bold text-[#1a1f24] mb-2">
                                        Tipe Pesan
                                    </label>
                                    <div className="relative z-40">
                                        <button
                                            onClick={() => {
                                                setIsTypeOpen(!isTypeOpen);
                                                setIsToneOpen(false);
                                            }}
                                            className="clay-input w-full px-4 py-3 flex items-center justify-between text-left transition-all hover:border-[#2ECC71]"
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="text-xl">{messageTypes.find(t => t.id === selectedType)?.icon || "📝"}</span>
                                                <div>
                                                    <div className="text-sm font-bold text-[#1a1f24]">
                                                        {messageTypes.find(t => t.id === selectedType)?.label || "Pilih Tipe Pesan"}
                                                    </div>
                                                    {selectedType && (
                                                        <div className="text-[10px] text-[#1a1f24]/60 font-medium leading-tight">
                                                            {messageTypes.find(t => t.id === selectedType)?.description}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <ChevronDownIcon className={`w-5 h-5 text-[#2ECC71] transition-transform ${isTypeOpen ? 'rotate-180' : ''}`} />
                                        </button>

                                        {isTypeOpen && (
                                            <div className="absolute z-50 w-full mt-2 clay-card p-2 animate-fade-in-up shadow-2xl overflow-hidden border-[#2ECC71]/20">
                                                <div className="max-h-60 overflow-y-auto custom-scrollbar">
                                                    {messageTypes.map((type) => (
                                                        <button
                                                            key={type.id}
                                                            onClick={() => {
                                                                setSelectedType(type.id);
                                                                setCustomerName("");
                                                                setContext("");
                                                                setIsTypeOpen(false);
                                                            }}
                                                            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left mb-1 last:mb-0 ${selectedType === type.id
                                                                ? 'bg-[#2ECC71]/10 border-2 border-[#2ECC71]/30'
                                                                : 'hover:bg-gray-50 border-2 border-transparent'
                                                                }`}
                                                        >
                                                            <span className="text-2xl">{type.icon}</span>
                                                            <div>
                                                                <div className="text-sm font-bold text-[#1a1f24]">{type.label}</div>
                                                                <div className="text-xs text-[#1a1f24]/60 font-medium">{type.description}</div>
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {selectedType && (
                                    <div className="space-y-5 animate-fade-in-up">

                                        <div>
                                            <label className="block text-sm font-bold text-[#1a1f24] mb-2">
                                                Tone / Nada Bicara
                                            </label>
                                            <div className="relative z-40">
                                                <button
                                                    onClick={() => {
                                                        setIsToneOpen(!isToneOpen);
                                                        setIsTypeOpen(false);
                                                    }}
                                                    className="clay-input w-full px-4 py-3 flex items-center justify-between text-left transition-all hover:border-[#2ECC71]"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-xl">{tones.find(t => t.id === selectedTone)?.icon || "🎭"}</span>
                                                        <div>
                                                            <div className="text-sm font-bold text-[#1a1f24]">
                                                                {tones.find(t => t.id === selectedTone)?.label || "Pilih Tone"}
                                                            </div>
                                                            {selectedTone && (
                                                                <div className="text-[10px] text-[#1a1f24]/60 font-medium leading-tight">
                                                                    {tones.find(t => t.id === selectedTone)?.description}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <ChevronDownIcon className={`w-5 h-5 text-[#2ECC71] transition-transform ${isToneOpen ? 'rotate-180' : ''}`} />
                                                </button>

                                                {isToneOpen && (
                                                    <div className="absolute z-50 w-full mt-2 clay-card p-2 animate-fade-in-up shadow-2xl overflow-hidden border-[#2ECC71]/20">
                                                        <div className="max-h-60 overflow-y-auto custom-scrollbar">
                                                            {tones.map((tone) => (
                                                                <button
                                                                    key={tone.id}
                                                                    onClick={() => {
                                                                        setSelectedTone(tone.id);
                                                                        setIsToneOpen(false);
                                                                    }}
                                                                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left mb-1 last:mb-0 ${selectedTone === tone.id
                                                                        ? 'bg-[#2ECC71]/10 border-2 border-[#2ECC71]/30'
                                                                        : 'hover:bg-gray-50 border-2 border-transparent'
                                                                        }`}
                                                                >
                                                                    <span className="text-2xl">{tone.icon}</span>
                                                                    <div>
                                                                        <div className="text-sm font-bold text-[#1a1f24]">{tone.label}</div>
                                                                        <div className="text-xs text-[#1a1f24]/60 font-medium">{tone.description}</div>
                                                                    </div>
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {selectedType === "greeting" && (
                                            <>
                                                <div>
                                                    <label className="block text-sm font-bold text-[#1a1f24] mb-2">
                                                        Nama Toko
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={customerName} // Reusing customerName for storeName temporarily or add new state? better new state.
                                                        // Actually let's use a dynamic object for inputs to keep it clean
                                                        onChange={(e) => setCustomerName(e.target.value)}
                                                        placeholder="Contoh: Toko Hijab Cantik"
                                                        className="clay-input w-full px-4 py-2"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-bold text-[#1a1f24] mb-2">
                                                        Jam Operasional & Deskripsi Singkat
                                                    </label>
                                                    <textarea
                                                        value={context}
                                                        onChange={(e) => setContext(e.target.value)}
                                                        placeholder="Contoh: Buka Senin-Jumat 08.00 - 17.00. Kami menjual berbagai macam hijab premium."
                                                        rows={3}
                                                        className="clay-input w-full px-4 py-2 custom-scrollbar resize-none"
                                                    />
                                                </div>
                                            </>
                                        )}

                                        {selectedType === "complaint" && (
                                            <>
                                                <div>
                                                    <label className="block text-sm font-bold text-[#1a1f24] mb-2">
                                                        Nama Customer
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={customerName}
                                                        onChange={(e) => setCustomerName(e.target.value)}
                                                        placeholder="Contoh: Kak Budi"
                                                        className="clay-input w-full px-4 py-2"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-bold text-[#1a1f24] mb-2">
                                                        Detail Masalah / Konteks
                                                    </label>
                                                    <textarea
                                                        value={context}
                                                        onChange={(e) => setContext(e.target.value)}
                                                        placeholder="Contoh: Barang rusak saat diterima, minta refund."
                                                        rows={4}
                                                        className="clay-input w-full px-4 py-2 custom-scrollbar resize-none"
                                                    />
                                                </div>
                                            </>
                                        )}

                                        {selectedType !== "greeting" && selectedType !== "complaint" && (
                                            <>
                                                <div>
                                                    <label className="block text-sm font-bold text-[#1a1f24] mb-2">
                                                        Nama Customer (Opsional)
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={customerName}
                                                        onChange={(e) => setCustomerName(e.target.value)}
                                                        placeholder="Contoh: Kak Budi"
                                                        className="clay-input w-full px-4 py-2"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-bold text-[#1a1f24] mb-2">
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
                                                        className="clay-input w-full px-4 py-2 custom-scrollbar resize-none"
                                                    />
                                                </div>
                                            </>
                                        )}

                                        <button
                                            onClick={handleGenerate}
                                            disabled={loading}
                                            className="clay-button w-full py-3 px-6 rounded-2xl transform active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
                        <div className="clay-card p-6 h-full flex flex-col">
                            <h2 className="text-xl font-bold text-[#1a1f24] mb-6 flex items-center justify-between">
                                <span>Preview Pesan</span>
                                {generatedMessage && (
                                    <button
                                        onClick={copyToClipboard}
                                        className="text-xs bg-white hover:bg-gray-50 text-[#1a1f24] px-4 py-2 rounded-xl flex items-center gap-2 transition-all font-bold border-2 border-green-500/20 shadow-sm"
                                    >
                                        <ClipboardIcon className="w-4 h-4 text-[#2ECC71]" />
                                        Salin Teks
                                    </button>
                                )}
                            </h2>

                            <div className="flex-1 bg-white/50 backdrop-blur-sm rounded-2xl p-6 border-2 border-dashed border-[#2ECC71]/30 overflow-y-auto custom-scrollbar max-h-[600px]">
                                {generatedMessage ? (
                                    <div className="prose max-w-none whitespace-pre-wrap text-[#1a1f24] font-medium text-lg leading-relaxed">
                                        {generatedMessage}
                                    </div>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-[#1a1f24]/40">
                                        <ChatBubbleLeftRightIcon className="w-16 h-16 mb-4 opacity-30 text-[#2ECC71]" />
                                        <p className="text-lg font-bold">Pesan template Anda akan muncul di sini</p>
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
