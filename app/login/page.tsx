"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import {
    EnvelopeIcon,
    LockClosedIcon,
    ArrowRightIcon,
    ShoppingBagIcon,
    ExclamationCircleIcon,
    EyeIcon,
    EyeSlashIcon
} from "@heroicons/react/24/outline";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const supabase = createClient();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            // Map common Supabase errors to Indonesian
            let indonesianError = error.message;
            if (error.message.includes("Invalid login credentials") || error.message.includes("does not exist")) {
                indonesianError = "Email atau kata sandi yang Anda masukkan salah.";
            } else if (error.message.includes("Email not confirmed")) {
                indonesianError = "Email Anda belum dikonfirmasi. Harap periksa kotak masuk email Anda.";
            } else if (error.message.includes("rate limit")) {
                indonesianError = "Terlalu banyak percobaan masuk. Harap tunggu beberapa saat.";
            } else {
                indonesianError = "Terjadi kesalahan saat masuk. Harap coba lagi.";
            }

            setError(indonesianError);
            setLoading(false);
        } else {
            router.push("/dashboard");
            router.refresh();
        }
    };

    return (
        <div className="min-h-screen bg-[#E8ECEF] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10">
                <div className="absolute top-[10%] left-[-5%] w-72 h-72 bg-[#2ECC71]/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-[10%] right-[-5%] w-96 h-96 bg-[#2ECC71]/5 rounded-full blur-3xl"></div>
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md animate-fade-in-up">
                <Link href="/" className="flex items-center justify-center gap-3 mb-8 group">
                    <div className="p-3 bg-white rounded-2xl shadow-sm border border-[#2ECC71]/20 group-hover:scale-110 transition-transform">
                        <ShoppingBagIcon className="w-8 h-8 text-[#2ECC71]" />
                    </div>
                    <h2 className="text-3xl font-black tracking-tight text-[#1a1f24] italic">
                        UMKM<span className="text-[#2ECC71] not-italic">TOOLS</span>
                    </h2>
                </Link>

                <div className="clay-card p-8 sm:p-10 border-2 border-white/50">
                    <div className="mb-8 text-center">
                        <h1 className="text-2xl font-black text-[#1a1f24] mb-2">Selamat Datang Kembali</h1>
                        <p className="text-gray-500 font-medium">Masuk untuk mengelola bisnis Anda dengan AI</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 flex items-center gap-3 animate-bounce-short">
                            <ExclamationCircleIcon className="w-5 h-5 text-red-500 shrink-0" />
                            <p className="text-xs font-bold text-red-600 leading-tight">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-sm font-black text-[#1a1f24] mb-2 ml-1">Email Bisnis</label>
                            <div className="relative group">
                                <EnvelopeIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#2ECC71] transition-colors" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="clay-input w-full pl-12 pr-4 py-4 rounded-2xl text-sm font-medium"
                                    placeholder="nama@toko.com"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2 ml-1">
                                <label className="block text-sm font-black text-[#1a1f24]">Kata Sandi</label>
                                <Link href="/forgot-password" className="text-xs font-bold text-[#2ECC71] hover:underline decoration-2">Lupa Sandi?</Link>
                            </div>
                            <div className="relative group">
                                <LockClosedIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#2ECC71] transition-colors" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="clay-input w-full pl-12 pr-12 py-4 rounded-2xl text-sm font-medium"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#2ECC71] transition-colors focus:outline-none"
                                >
                                    {showPassword ? (
                                        <EyeSlashIcon className="w-5 h-5" />
                                    ) : (
                                        <EyeIcon className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="clay-button w-full py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-2 shadow-xl shadow-[#2ECC71]/20 transform active:scale-95 transition-all disabled:opacity-50"
                        >
                            {loading ? "Menghubungkan..." : "Masuk Sekarang"}
                            {!loading && <ArrowRightIcon className="w-5 h-5" />}
                        </button>
                    </form>

                    <div className="mt-10 pt-8 border-t border-gray-100 text-center">
                        <p className="text-sm font-medium text-gray-500">
                            Belum punya akun?{' '}
                            <Link href="/register" className="font-black text-[#2ECC71] hover:underline decoration-2 underline-offset-4 transition-all">
                                Daftar Gratis
                            </Link>
                        </p>
                    </div>
                </div>

                <p className="mt-8 text-center text-xs font-bold text-gray-400">
                    © 2025 UMKM Tools • Keamanan Data Terjamin
                </p>
            </div>
        </div>
    );
}
