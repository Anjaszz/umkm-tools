"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import {
    CheckCircleIcon,
    SparklesIcon,
    ShieldCheckIcon,
    BoltIcon
} from "@heroicons/react/24/solid";

// Define the window interface to include snap
declare global {
    interface Window {
        snap: any;
    }
}

export default function PremiumPage() {
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<any>(null);
    const supabase = createClient();
    const router = useRouter();

    useEffect(() => {
        // Load Midtrans Snap Script
        const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || '';
        // Auto-detect script URL based on key format
        const snapScriptUrl = clientKey.startsWith('SB')
            ? 'https://app.sandbox.midtrans.com/snap/snap.js'
            : 'https://app.midtrans.com/snap/snap.js'; // Production URL

        const script = document.createElement('script');
        script.src = snapScriptUrl;
        script.setAttribute('data-client-key', clientKey);
        document.body.appendChild(script);

        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) setUser(user);
        };
        getUser();

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const handlePurchase = async () => {
        if (!user) {
            router.push("/login?redirect=/premium");
            return;
        }

        setLoading(true);

        try {
            // 1. Request Snap Token from backend
            const response = await fetch("/api/payment/token", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: user.id,
                    email: user.email,
                    fullName: user.user_metadata?.full_name || "Pelanggan UMKM",
                }),
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.error || "Gagal memproses pembayaran");

            // 2. Open Snap Popup
            window.snap.pay(data.token, {
                onSuccess: function (result: any) {
                    alert("Pembayaran Berhasil! Akun Anda kini Premium.");
                    router.push("/profile");
                    router.refresh();
                },
                onPending: function (result: any) {
                    alert("Menunggu pembayaran Anda...");
                    router.push("/profile");
                },
                onError: function (result: any) {
                    alert("Pembayaran gagal!");
                    console.error(result);
                },
                onClose: function () {
                    alert('Anda belum menyelesaikan pembayaran.');
                }
            });

        } catch (error: any) {
            console.error("Payment Error:", error);
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFB] py-20 px-6">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-16">
                    <div className="inline-block p-3 rounded-2xl bg-gradient-to-br from-[#2ECC71]/20 to-[#27ae60]/20 text-[#2ECC71] mb-4">
                        <SparklesIcon className="w-8 h-8" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-[#1a1f24] mb-4">
                        Upgrade ke <span className="text-[#2ECC71]">Premium</span>
                    </h1>
                    <p className="text-xl text-gray-500 font-medium max-w-2xl mx-auto">
                        Bebaskan potensi bisnis Anda dengan akses tanpa batas ke semua fitur AI canggih kami.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-4xl mx-auto">
                    {/* Features List */}
                    <div className="space-y-6">
                        <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm">
                            <div className="p-2 rounded-lg bg-blue-50 text-blue-500 shrink-0">
                                <BoltIcon className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-[#1a1f24]">Unlimited Access</h3>
                                <p className="text-gray-500 text-sm">Gunakan semua fitur AI tanpa batasan credit harian atau bulanan.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm">
                            <div className="p-2 rounded-lg bg-purple-50 text-purple-500 shrink-0">
                                <SparklesIcon className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-[#1a1f24]">Prioritas Server</h3>
                                <p className="text-gray-500 text-sm">Proses generate lebih cepat dengan antrian prioritas.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm">
                            <div className="p-2 rounded-lg bg-orange-50 text-orange-500 shrink-0">
                                <ShieldCheckIcon className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-[#1a1f24]">Fitur Beta Eksklusif</h3>
                                <p className="text-gray-500 text-sm">Akses lebih dulu ke fitur-fitur baru yang sedang dikembangkan.</p>
                            </div>
                        </div>
                    </div>

                    {/* Pricing Card */}
                    <div className="clay-card relative bg-white overflow-hidden border-2 border-[#2ECC71]">
                        <div className="absolute top-0 right-0 bg-[#2ECC71] text-white text-xs font-bold px-3 py-1 rounded-bl-xl">
                            BEST VALUE
                        </div>
                        <div className="p-8 text-center">
                            <h3 className="text-gray-500 font-bold uppercase tracking-widest mb-4">Lifetime Access</h3>
                            <div className="flex items-center justify-center gap-1 mb-2">
                                <span className="text-sm text-gray-400 font-bold line-through">Rp 150.000</span>
                            </div>
                            <div className="text-5xl font-black text-[#1a1f24] mb-2">
                                Rp 50.000
                            </div>
                            <p className="text-gray-400 font-medium text-sm mb-8">
                                Bayar sekali, aktif selamanya.
                            </p>

                            <button
                                onClick={handlePurchase}
                                disabled={loading}
                                className="w-full py-4 rounded-xl bg-[#2ECC71] text-white font-bold text-lg shadow-lg shadow-[#2ECC71]/30 hover:scale-105 hover:shadow-[#2ECC71]/50 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Memproses...
                                    </>
                                ) : (
                                    "Beli Premium Sekarang"
                                )}
                            </button>
                            <p className="text-xs text-gray-400 mt-4">
                                Pembayaran aman via Midtrans (QRIS, GoPay, Transfer Bank)
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
