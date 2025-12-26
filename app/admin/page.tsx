"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import {
    UserGroupIcon,
    CurrencyDollarIcon,
    ArrowPathIcon,
    ShieldCheckIcon,
    UserIcon,
    MagnifyingGlassIcon,
    TrashIcon,
    ClockIcon,
    ChartBarIcon
} from "@heroicons/react/24/outline";

export default function AdminPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isStale, setIsStale] = useState(false); // New state for stale token check
    const [searchQuery, setSearchQuery] = useState("");
    const [stats, setStats] = useState({
        total: 0,
        premium: 0,
        totalCredits: 0
    });

    const supabase = createClient();
    const router = useRouter();

    useEffect(() => {
        const checkAdmin = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push("/login");
                return;
            }

            const { data: profile } = await supabase
                .from("profiles")
                .select("role")
                .eq("id", user.id)
                .single();

            if (profile?.role !== "admin") {
                router.push("/dashboard");
                return;
            }

            // Check if JWT metadata matches DB role
            const jwtRole = user.app_metadata?.role;
            console.log("Debug Roles:", { db: profile.role, jwt: jwtRole }); // Debug log

            if (jwtRole !== 'admin') {
                setIsStale(true);
                return; // Stop here, don't show the dashboard
            }

            setIsAdmin(true);
            fetchUsers();
        };

        checkAdmin();
    }, []);

    const handleReLogin = async () => {
        await supabase.auth.signOut();
        router.push("/login"); // Force full re-login
    };

    if (isStale) {
        return (
            <div className="min-h-screen bg-[#F8FAFB] flex items-center justify-center p-6">
                <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center border-2 border-orange-100">
                    <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6 text-orange-500">
                        <ShieldCheckIcon className="w-10 h-10" />
                    </div>
                    <h2 className="text-2xl font-black text-[#1a1f24] mb-3">Pembaruan Izin Diperlukan</h2>
                    <p className="text-gray-500 mb-8">
                        Sistem keamanan baru telah diterapkan. Akun Admin Anda memerlukan <b>Login Ulang</b> agar bisa mengakses data seluruh user.
                    </p>
                    <button
                        onClick={handleReLogin}
                        className="w-full py-4 bg-[#2ECC71] text-white font-bold rounded-xl shadow-lg shadow-[#2ECC71]/20 hover:scale-105 transition-all"
                    >
                        Login Ulang Sekarang
                    </button>
                </div>
            </div>
        );
    }

    const fetchUsers = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .order("updated_at", { ascending: false });

        if (!error && data) {
            setUsers(data);
            const statsData = {
                total: data.length,
                premium: data.filter(u => u.role === 'premium').length,
                totalCredits: data.reduce((acc, u) => acc + (u.role === 'premium' ? 0 : Number(u.credits || 0)), 0)
            };
            setStats(statsData);
        }
        setLoading(false);
    };

    const deleteUser = async (userId: string) => {
        if (!confirm("Apakah Anda yakin ingin menghapus user ini? Aksi ini tidak dapat dibatalkan.")) return;

        const { error } = await supabase
            .from("profiles")
            .delete()
            .eq("id", userId);

        if (!error) fetchUsers();
    };

    const filteredUsers = users.filter(u =>
        u.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const updateRole = async (userId: string, newRole: string) => {
        const { error } = await supabase
            .rpc("set_user_role", {
                p_user_id: userId,
                p_role: newRole
            });

        if (!error) fetchUsers();
    };

    const addCredits = async (userId: string, currentCredits: number) => {
        const amount = prompt("Tambah berapa credit?", "10.00");
        if (!amount) return;

        const { error } = await supabase
            .from("profiles")
            .update({ credits: Number(currentCredits) + parseFloat(amount) })
            .eq("id", userId);

        if (!error) fetchUsers();
    };

    if (!isAdmin) return <div className="p-20 text-center font-bold">Checking access...</div>;

    return (
        <div className="min-h-screen bg-[#F8FAFB] py-12 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <h1 className="text-4xl font-black text-[#1a1f24] flex items-center gap-3">
                            <ShieldCheckIcon className="w-10 h-10 text-[#2ECC71]" />
                            Admin Console
                        </h1>
                        <p className="text-gray-500 font-medium mt-1">Sistem manajemen terpusat untuk monitoring & kontrol pengguna</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <MagnifyingGlassIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Cari Nama atau ID..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-12 pr-6 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-[#2ECC71]/20 outline-none w-full md:w-80 transition-all font-medium"
                            />
                        </div>
                        <button
                            onClick={fetchUsers}
                            className="p-3 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all text-gray-600 hover:text-[#2ECC71]"
                        >
                            <ArrowPathIcon className={`w-6 h-6 ${loading ? 'animate-spin' : ''}`} />
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-2xl bg-[#2ECC71]/10 text-[#2ECC71]">
                                <UserGroupIcon className="w-6 h-6" />
                            </div>
                            <div>
                                <div className="text-sm font-bold text-gray-400 uppercase tracking-wider">Total User</div>
                                <div className="text-3xl font-black text-[#1a1f24]">{stats.total}</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-2xl bg-blue-50 text-blue-500">
                                <ShieldCheckIcon className="w-6 h-6" />
                            </div>
                            <div>
                                <div className="text-sm font-bold text-gray-400 uppercase tracking-wider">User Premium</div>
                                <div className="text-3xl font-black text-[#1a1f24]">{stats.premium}</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-2xl bg-orange-50 text-orange-500">
                                <ChartBarIcon className="w-6 h-6" />
                            </div>
                            <div>
                                <div className="text-sm font-bold text-gray-400 uppercase tracking-wider">Circulating Credits</div>
                                <div className="text-3xl font-black text-[#1a1f24]">{stats.totalCredits.toFixed(2)}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50/50 border-b border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                                <tr>
                                    <th className="px-8 py-5">Identitas User</th>
                                    <th className="px-8 py-5 text-center">Tipe Akun</th>
                                    <th className="px-8 py-5 text-center">Saldo</th>
                                    <th className="px-8 py-5 text-center">Pembaruan Terakhir</th>
                                    <th className="px-8 py-5 text-right">Manajemen</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredUsers.map((u) => (
                                    <tr key={u.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#2ECC71]/10 to-[#27ae60]/10 flex items-center justify-center text-[#2ECC71]">
                                                    <UserIcon className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-[#1a1f24] text-lg">{u.full_name || 'Anonymous'}</div>
                                                    <div className="text-xs text-gray-400 font-mono">{u.id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-center">
                                            <select
                                                value={u.role}
                                                onChange={(e) => updateRole(u.id, e.target.value)}
                                                className={`text-xs font-black px-4 py-2 rounded-xl outline-none appearance-none cursor-pointer border-0 ring-1 ring-gray-100 focus:ring-2 focus:ring-[#2ECC71]/50 transition-all ${u.role === 'premium' ? 'bg-blue-50 text-blue-600' :
                                                    u.role === 'admin' ? 'bg-purple-50 text-purple-600' :
                                                        'bg-gray-50 text-gray-600'
                                                    }`}
                                            >
                                                <option value="free">FREE USER</option>
                                                <option value="premium">PREMIUM</option>
                                                <option value="admin">ADMIN</option>
                                            </select>
                                        </td>
                                        <td className="px-8 py-5 text-center">
                                            <div className="flex flex-col items-center">
                                                <span className={`text-sm font-black ${Number(u.credits) < 1 ? 'text-red-500' : 'text-[#1a1f24]'}`}>
                                                    {u.role === 'premium' ? '∞' : Number(u.credits || 0).toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                                                </span>
                                                <span className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">Credit</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-center">
                                            <div className="text-sm font-bold text-gray-500 flex items-center justify-center gap-2">
                                                <ClockIcon className="w-4 h-4 text-gray-300" />
                                                {new Date(u.updated_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all">
                                                <button
                                                    onClick={() => addCredits(u.id, u.credits)}
                                                    className="p-2 bg-[#2ECC71] text-white rounded-xl hover:scale-110 transition-all shadow-lg shadow-[#2ECC71]/20"
                                                    title="Tambah Credit"
                                                >
                                                    <CurrencyDollarIcon className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => deleteUser(u.id)}
                                                    className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all border border-red-100 hover:border-red-500"
                                                    title="Hapus User"
                                                >
                                                    <TrashIcon className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {filteredUsers.length === 0 && !loading && (
                        <div className="p-20 text-center flex flex-col items-center gap-4">
                            <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center">
                                <MagnifyingGlassIcon className="w-10 h-10 text-gray-200" />
                            </div>
                            <div className="text-gray-400 font-bold">Tidak ada pengguna yang ditemukan.</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
