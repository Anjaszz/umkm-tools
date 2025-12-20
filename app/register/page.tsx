"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import {
    EnvelopeIcon,
    LockClosedIcon,
    UserIcon,
    ArrowRightIcon,
    ShoppingBagIcon,
    CheckBadgeIcon,
    ExclamationCircleIcon
} from "@heroicons/react/24/outline";

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                },
                emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            setSuccess(true);
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-[#E8ECEF] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md animate-fade-in-up">
                    <div className="clay-card p-10 text-center border-2 border-[#2ECC71]/20">
                        <div className="w-20 h-20 bg-[#2ECC71]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckBadgeIcon className="w-12 h-12 text-[#2ECC71]" />
                        </div>
                        <h1 className="text-2xl font-black text-[#1a1f24] mb-4">Cek Email Anda!</h1>
                        <p className="text-gray-500 font-medium mb-8 leading-relaxed">
                            Kami telah mengirimkan tautan konfirmasi ke <span className="text-[#1a1f24] font-bold">{email}</span>.
                            Silakan klik tautan tersebut untuk mengaktifkan akun UMKM Anda.
                        </p>
                        <Link href="/login" className="clay-button inline-block px-10 py-4 rounded-xl font-bold">
                            Kembali ke Login
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#E8ECEF] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10">
                <div className="absolute top-[-10%] right-[-5%] w-72 h-72 bg-[#2ECC71]/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-[20%] left-[-5%] w-96 h-96 bg-[#2ECC71]/5 rounded-full blur-3xl"></div>
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
                        <h1 className="text-2xl font-black text-[#1a1f24] mb-2">Daftar Akun Baru</h1>
                        <p className="text-gray-500 font-medium italic">"Mulai langkah sukses jualan cerdas hari ini"</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 flex items-center gap-3 animate-bounce-short">
                            <ExclamationCircleIcon className="w-5 h-5 text-red-500 shrink-0" />
                            <p className="text-xs font-bold text-red-600 leading-tight">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleRegister} className="space-y-5">
                        <div>
                            <label className="block text-sm font-black text-[#1a1f24] mb-2 ml-1">Nama Lengkap / Toko</label>
                            <div className="relative group">
                                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#2ECC71] transition-colors" />
                                <input
                                    type="text"
                                    required
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="clay-input w-full pl-12 pr-4 py-4 rounded-2xl text-sm font-medium"
                                    placeholder="Andi - Bakpia Pathok"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-black text-[#1a1f24] mb-2 ml-1">Email Aktif</label>
                            <div className="relative group">
                                <EnvelopeIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#2ECC71] transition-colors" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="clay-input w-full pl-12 pr-4 py-4 rounded-2xl text-sm font-medium"
                                    placeholder="nama@email.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-black text-[#1a1f24] mb-2 ml-1">Buat Kata Sandi</label>
                            <div className="relative group">
                                <LockClosedIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#2ECC71] transition-colors" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="clay-input w-full pl-12 pr-4 py-4 rounded-2xl text-sm font-medium"
                                    placeholder="Minimal 6 karakter"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-3 mb-6 px-1">
                            <input type="checkbox" required className="w-4 h-4 accent-[#2ECC71]" />
                            <p className="text-[10px] font-bold text-gray-500 leading-tight">
                                Saya menyetujui <span className="text-[#2ECC71]">Syarat & Ketentuan</span> serta kebijakan privasi UMKM Tools.
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="clay-button w-full py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-2 transform active:scale-95 transition-all disabled:opacity-50"
                        >
                            {loading ? "Mendaftarkan..." : "Daftar Sekarang"}
                            {!loading && <ArrowRightIcon className="w-5 h-5" />}
                        </button>
                    </form>

                    <div className="mt-10 pt-8 border-t border-gray-100 text-center">
                        <p className="text-sm font-medium text-gray-500">
                            Sudah punya akun?{' '}
                            <Link href="/login" className="font-black text-[#2ECC71] hover:underline decoration-2 underline-offset-4 transition-all">
                                Masuk di sini
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
