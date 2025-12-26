"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import {
    UserCircleIcon,
    SparklesIcon,
    ArrowRightOnRectangleIcon,
    ShieldCheckIcon,
    CreditCardIcon,
    EnvelopeIcon,
    CalendarIcon
} from "@heroicons/react/24/outline";
import Link from "next/link";

export default function ProfilePage() {
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();
    const router = useRouter();

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            try {
                // getUser() is the most reliable way to check session on sensitive pages
                const { data: { user }, error: authError } = await supabase.auth.getUser();

                if (authError || !user) {
                    router.push("/login");
                    return;
                }

                setUser(user);

                // Parallel fetching for better performance
                const [profileResponse, transactionsResponse] = await Promise.all([
                    supabase
                        .from("profiles")
                        .select("*")
                        .eq("id", user.id)
                        .single(),
                    supabase
                        .from("credit_transactions")
                        .select("*")
                        .eq("user_id", user.id)
                        .order("created_at", { ascending: false })
                        .limit(10)
                ]);

                if (profileResponse.data) setProfile(profileResponse.data);
                if (transactionsResponse.data) setTransactions(transactionsResponse.data);

            } catch (err) {
                console.error("Error fetching profile data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/");
        router.refresh();
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F8FAFB]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-[#2ECC71] border-t-transparent rounded-full animate-spin"></div>
                    <p className="font-bold text-gray-500">Memuat profil...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAFB] py-12 px-6">
            <div className="max-w-4xl mx-auto">
                {/* Profile Card */}
                <div className="clay-card overflow-hidden bg-white">
                    {/* Header/Cover */}
                    <div className="h-32 bg-gradient-to-r from-[#2ECC71] to-[#27ae60] relative">
                        <div className="absolute -bottom-12 left-8 p-1 bg-white rounded-full shadow-lg">
                            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center text-[#2ECC71]">
                                <UserCircleIcon className="w-20 h-20" />
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="pt-16 pb-8 px-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div>
                                <h1 className="text-3xl font-black text-[#1a1f24] mb-1">
                                    {profile?.full_name || "Pengguna UMKM"}
                                </h1>
                                <p className="text-gray-500 flex items-center gap-2 font-medium">
                                    <EnvelopeIcon className="w-4 h-4" />
                                    {user?.email}
                                </p>
                            </div>

                            <div className="flex gap-3">
                                {profile?.role === 'admin' && (
                                    <Link
                                        href="/admin"
                                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-900 text-white text-sm font-bold shadow-lg hover:scale-105 transition-all"
                                    >
                                        <ShieldCheckIcon className="w-5 h-5" />
                                        Admin Panel
                                    </Link>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 text-red-500 border border-red-100 text-sm font-bold hover:bg-red-100 transition-all"
                                >
                                    <ArrowRightOnRectangleIcon className="w-5 h-5" />
                                    Keluar
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                            {/* Role Card */}
                            <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                                        <ShieldCheckIcon className="w-5 h-5" />
                                    </div>
                                    <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Tipe Akun</span>
                                </div>
                                <div className="text-2xl font-black text-[#1a1f24] capitalize">
                                    {profile?.role || 'Free'}
                                </div>
                                {profile?.role !== 'premium' && (
                                    <Link href="#" className="text-xs text-[#2ECC71] font-bold mt-2 inline-block hover:underline">
                                        Upgrade ke Premium
                                    </Link>
                                )}
                            </div>

                            {/* Credits Card */}
                            <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 rounded-lg bg-[#2ECC71]/10 text-[#2ECC71]">
                                        <CreditCardIcon className="w-5 h-5" />
                                    </div>
                                    <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Saldo Credit</span>
                                </div>
                                <div className="text-2xl font-black text-[#1a1f24]">
                                    {profile?.role === 'premium'
                                        ? 'Unlimited'
                                        : `${Number(profile?.credits || 0).toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} Credit`}
                                </div>
                                <p className="text-xs text-gray-500 font-medium mt-2">
                                    Gunakan credit untuk fitur AI
                                </p>
                            </div>

                            {/* Status Card */}
                            <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 rounded-lg bg-orange-100 text-orange-600">
                                        <CalendarIcon className="w-5 h-5" />
                                    </div>
                                    <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Terdaftar Sejak</span>
                                </div>
                                <div className="text-lg font-black text-[#1a1f24]">
                                    {new Date(user?.created_at).toLocaleDateString('id-ID', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="mt-12">
                            <h2 className="text-xl font-black text-[#1a1f24] mb-6 underline decoration-[#2ECC71] decoration-4 underline-offset-4">
                                Riwayat Penggunaan
                            </h2>
                            <div className="space-y-3">
                                {transactions.length > 0 ? (
                                    transactions.map((t) => (
                                        <div key={t.id} className="flex items-center justify-between p-4 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                                            <div className="flex items-center gap-4">
                                                <div className={`p-2.5 rounded-xl ${t.amount < 0 ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'}`}>
                                                    <SparklesIcon className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-[#1a1f24] group-hover:text-[#2ECC71] transition-colors capitalize">
                                                        {t.feature?.replace(/-/g, ' ') || 'Transaksi'}
                                                    </div>
                                                    <div className="text-xs text-gray-400 font-medium">
                                                        {new Date(t.created_at).toLocaleString('id-ID', {
                                                            day: 'numeric',
                                                            month: 'short',
                                                            year: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={`font-black text-sm ${t.amount < 0 ? 'text-red-500' : 'text-green-500'}`}>
                                                {t.amount < 0 ? '' : '+'}{Number(t.amount).toFixed(2)}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-8 rounded-2xl border-2 border-dashed border-gray-100 text-center">
                                        <p className="text-gray-400 font-bold mb-1">Belum ada riwayat</p>
                                        <p className="text-xs text-gray-300">Gunakan fitur AI kami untuk melihat aktivitas Anda di sini</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <Link href="/dashboard" className="text-gray-500 font-bold hover:text-[#2ECC71] transition-colors">
                        Kembali ke Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
}
