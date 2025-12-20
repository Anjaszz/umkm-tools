"use client";

import Link from "next/link";
import {
    ShoppingBagIcon,
    ArrowTopRightOnSquareIcon
} from "@heroicons/react/24/outline";

export default function Footer() {
    return (
        <footer className="bg-[#1a1d1f] text-white pt-16 pb-8 px-4 sm:px-6 lg:px-12 border-t border-[#2ECC71]/10">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

                    {/* Brand Section */}
                    <div className="lg:col-span-2">
                        <Link href="/" className="inline-flex items-center gap-3 mb-6 hover:opacity-80 transition-opacity">
                            <div className="p-3 bg-[#2ECC71]/10 rounded-2xl border border-[#2ECC71]/20">
                                <ShoppingBagIcon className="w-8 h-8 text-[#2ECC71]" />
                            </div>
                            <h2 className="text-2xl font-black tracking-tight text-white italic">
                                UMKM<span className="text-[#2ECC71] not-italic">TOOLS</span>
                            </h2>
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed max-w-md font-medium">
                            Solusi kecerdasan buatan (AI) terintegrasi yang dirancang khusus untuk pelaku UMKM Indonesia.
                            Kami membantu Anda menciptakan konten promosi berkualitas tinggi, meningkatkan layanan pelanggan,
                            dan mengoptimalkan efisiensi operasional digital dalam hitungan detik.
                        </p>
                    </div>

                    {/* Social Media Section */}
                    <div>
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            Social Media
                        </h3>
                        <div className="space-y-4">
                            <Link href="#" className="flex items-center gap-3 text-gray-400 hover:text-[#2ECC71] transition-all group">
                                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-[#2ECC71]/20 group-hover:scale-110 transition-all">
                                    <span className="text-xs">FB</span>
                                </div>
                                <span className="text-sm font-semibold italic">Facebook</span>
                            </Link>
                            <Link href="#" className="flex items-center gap-3 text-gray-400 hover:text-[#2ECC71] transition-all group">
                                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-[#2ECC71]/20 group-hover:scale-110 transition-all">
                                    <span className="text-xs">IG</span>
                                </div>
                                <span className="text-sm font-semibold italic">Instagram</span>
                            </Link>
                            <Link href="#" className="flex items-center gap-3 text-gray-400 hover:text-[#2ECC71] transition-all group">
                                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-[#2ECC71]/20 group-hover:scale-110 transition-all">
                                    <span className="text-xs">IN</span>
                                </div>
                                <span className="text-sm font-semibold italic">LinkedIn</span>
                            </Link>
                            <Link href="#" className="flex items-center gap-3 text-gray-400 hover:text-[#2ECC71] transition-all group">
                                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-[#2ECC71]/20 group-hover:scale-110 transition-all">
                                    <span className="text-xs">TT</span>
                                </div>
                                <span className="text-sm font-semibold italic">TikTok</span>
                            </Link>
                        </div>
                    </div>

                    {/* Features Column */}
                    <div>
                        <h3 className="text-lg font-bold text-white mb-6">
                            Tools Unggulan
                        </h3>
                        <div className="grid grid-cols-1 gap-x-8 gap-y-4">
                            <div className="space-y-4">
                                <Link href="/features/photo-enhancer" className="flex items-center gap-2 text-gray-400 hover:text-[#2ECC71] transition-all group italic">
                                    <ArrowTopRightOnSquareIcon className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                                    <span className="text-sm font-medium">Photo Enhancer</span>
                                </Link>
                                <Link href="/features/social-caption" className="flex items-center gap-2 text-gray-400 hover:text-[#2ECC71] transition-all group italic">
                                    <ArrowTopRightOnSquareIcon className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                                    <span className="text-sm font-medium">Social Caption</span>
                                </Link>
                                <Link href="/features/cs-templates" className="flex items-center gap-2 text-gray-400 hover:text-[#2ECC71] transition-all group italic">
                                    <ArrowTopRightOnSquareIcon className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                                    <span className="text-sm font-medium">CS Templates</span>
                                </Link>
                                <Link href="/features/product-description" className="flex items-center gap-2 text-gray-400 hover:text-[#2ECC71] transition-all group italic">
                                    <ArrowTopRightOnSquareIcon className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                                    <span className="text-sm font-medium">Description AI</span>
                                </Link>
                                <Link href="/features/background-editor" className="flex items-center gap-2 text-gray-400 hover:text-[#2ECC71] transition-all group italic">
                                    <ArrowTopRightOnSquareIcon className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                                    <span className="text-sm font-medium">BG Editor</span>
                                </Link>
                                <Link href="/features/image-analyzer" className="flex items-center gap-2 text-gray-400 hover:text-[#2ECC71] transition-all group italic">
                                    <ArrowTopRightOnSquareIcon className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                                    <span className="text-sm font-medium">Image Analyzer</span>
                                </Link>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-center gap-4 text-gray-500 text-sm">
                    <p className="font-bold text-center">
                        © 2025 UMKM Tools. Created with <span className="text-red-500 animate-pulse">❤️</span> by <span className="text-white">Anjaszz</span>
                    </p>
                </div>
            </div>
        </footer>
    );
}
