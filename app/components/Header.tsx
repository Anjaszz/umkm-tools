'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Bars3Icon,
    XMarkIcon,
    HomeIcon,
    SparklesIcon,
    ChatBubbleBottomCenterTextIcon,
    PencilSquareIcon,
    MagnifyingGlassIcon,
    UserGroupIcon,
    PhotoIcon,
    ArrowLeftIcon,
    ArrowRightOnRectangleIcon,
    UserCircleIcon,
    ChevronDownIcon
} from '@heroicons/react/24/outline';
import { createClient } from '@/utils/supabase/client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const featureCategories = [
    {
        name: 'Konten & Branding',
        features: [
            { name: 'Deskripsi Produk', href: '/features/product-description', icon: PencilSquareIcon },
            { name: 'Social Caption', href: '/features/social-caption', icon: ChatBubbleBottomCenterTextIcon },
            { name: 'Image Analyzer', href: '/features/image-analyzer', icon: MagnifyingGlassIcon },
        ]
    },
    {
        name: 'Visual & Media',
        features: [
            { name: 'Enhance Foto', href: '/features/photo-enhancer', icon: SparklesIcon },
            { name: 'Background Editor', href: '/features/background-editor', icon: PhotoIcon },
            { name: 'Logo Generator', href: '/features/logo-generator', icon: SparklesIcon },
            { name: 'Smart Mockup', href: '/features/smart-mockup', icon: SparklesIcon },
            { name: 'Poster Gen', href: '/features/poster-generator', icon: PhotoIcon },
        ]
    },
    {
        name: 'Customer Service',
        features: [
            { name: 'CS Templates', href: '/features/cs-templates', icon: UserGroupIcon },
        ]
    }
];

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const getUser = async () => {
            // Force refresh session to get latest metadata
            const { data: { session } } = await supabase.auth.getSession();
            const { data: { user } } = await supabase.auth.getUser();

            setUser(user);
            if (user) {
                const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
                setProfile(data);
            }
        };
        getUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            const currentUser = session?.user ?? null;
            setUser(currentUser);
            if (currentUser) {
                const { data } = await supabase.from('profiles').select('*').eq('id', currentUser.id).single();
                setProfile(data);
            } else {
                setProfile(null);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/');
        router.refresh();
    };

    return (
        <header className="sticky-header sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16 md:h-20">
                    {/* Logo & Back Button */}
                    <div className="flex items-center">
                        {pathname !== '/' && (
                            <Link
                                href="/"
                                className="mr-4 p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 md:hidden"
                            >
                                <ArrowLeftIcon className="w-5 h-5" />
                            </Link>
                        )}
                        <Link href="/" className="flex items-center space-x-2">
                            <span className="text-xl md:text-2xl font-bold text-[#2ECC71] whitespace-nowrap">
                                UMKM Tools <span className="text-[#1a1f24]">AI</span>
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation / Auth Buttons */}
                    <div className="hidden md:flex items-center gap-4">
                        {user ? (
                            <div className="flex items-center gap-6">
                                <nav className="flex items-center space-x-1 lg:space-x-2">
                                    <Link
                                        href="/dashboard"
                                        className={`px-3 py-2 rounded-lg text-sm font-bold transition-all ${pathname === '/dashboard'
                                            ? 'text-[#2ECC71] bg-[#2ECC71]/10'
                                            : 'text-gray-600 hover:text-[#2ECC71] hover:bg-gray-50'
                                            }`}
                                    >
                                        Dashboard
                                    </Link>

                                    {featureCategories.map((category) => (
                                        <div
                                            key={category.name}
                                            className="relative group"
                                            onMouseEnter={() => setActiveDropdown(category.name)}
                                            onMouseLeave={() => setActiveDropdown(null)}
                                        >
                                            <button
                                                className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-bold transition-all ${category.features.some(f => pathname === f.href)
                                                    ? 'text-[#2ECC71] bg-[#2ECC71]/10'
                                                    : 'text-gray-600 hover:text-[#2ECC71] hover:bg-gray-50'
                                                    }`}
                                            >
                                                {category.name}
                                                <ChevronDownIcon className="w-4 h-4" />
                                            </button>

                                            <div className={`absolute top-full left-0 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 transition-all duration-200 ${activeDropdown === category.name ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
                                                }`}>
                                                {category.features.map((item) => {
                                                    const isActive = pathname === item.href;
                                                    const Icon = item.icon;
                                                    return (
                                                        <Link
                                                            key={item.href}
                                                            href={item.href}
                                                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive
                                                                ? 'text-[#2ECC71] bg-[#2ECC71]/5'
                                                                : 'text-gray-600 hover:bg-gray-50'
                                                                }`}
                                                        >
                                                            <div className={`p-1.5 rounded-lg ${isActive ? 'bg-[#2ECC71] text-white' : 'bg-gray-100 text-gray-500'}`}>
                                                                <Icon className="w-4 h-4" />
                                                            </div>
                                                            {item.name}
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </nav>

                                {/* CREDIT INDICATOR */}
                                {profile && (
                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#2ECC71]/10 border border-[#2ECC71]/20">
                                        <SparklesIcon className="w-4 h-4 text-[#2ECC71]" />
                                        <span className="text-xs font-bold text-[#1a1f24]">
                                            {profile.role === 'premium'
                                                ? 'UNLIMITED'
                                                : `${Number(profile.credits).toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} Credit`
                                            }
                                        </span>
                                    </div>
                                )}

                                {/* PROFILE ICON */}
                                <Link
                                    href="/profile"
                                    className={`flex items-center justify-center w-10 h-10 rounded-full transition-all border-2 ${pathname === '/profile'
                                        ? 'border-[#2ECC71] bg-[#2ECC71]/10 text-[#2ECC71]'
                                        : 'border-transparent bg-gray-100 text-gray-500 hover:bg-gray-200'
                                        }`}
                                >
                                    <UserCircleIcon className="w-7 h-7" />
                                </Link>
                            </div>
                        ) : pathname === '/' ? (
                            <div className="flex items-center gap-4">
                                <Link
                                    href="/login"
                                    className="px-6 py-2.5 rounded-xl text-sm font-bold text-[#1a1f24] hover:bg-gray-100 transition-all"
                                >
                                    Masuk
                                </Link>
                                <Link
                                    href="/register"
                                    className="clay-button px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-[#2ECC71]/20"
                                >
                                    Daftar Sekarang
                                </Link>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link
                                    href="/login"
                                    className="px-6 py-2.5 rounded-xl text-sm font-bold text-[#2ECC71] bg-[#2ECC71]/10 hover:bg-[#2ECC71]/20 transition-all"
                                >
                                    Masuk Ke Akun
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button / Auth Buttons */}
                    <div className="md:hidden flex items-center gap-3">
                        {user ? (
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="p-2 rounded-lg text-gray-600 hover:text-[#2ECC71] hover:bg-gray-50 transition-all"
                            >
                                {isOpen ? (
                                    <XMarkIcon className="w-6 h-6" />
                                ) : (
                                    <Bars3Icon className="w-6 h-6" />
                                )}
                            </button>
                        ) : pathname === '/' ? (
                            <Link
                                href="/login"
                                className="px-4 py-2 rounded-lg text-xs font-bold bg-[#2ECC71]/10 text-[#2ECC71]"
                            >
                                Masuk
                            </Link>
                        ) : (
                            <Link
                                href="/login"
                                className="px-4 py-2 rounded-lg text-xs font-bold bg-[#2ECC71]/10 text-[#2ECC71]"
                            >
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Sidebar/Menu (Only for non-landing pages) */}
            {pathname !== '/' && (
                <div
                    className={`md:hidden absolute top-full left-0 w-full bg-white border-t-2 border-[#2ECC71]/10 shadow-xl transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 visible h-auto pb-6' : 'opacity-0 invisible h-0 overflow-hidden'
                        }`}
                >
                    <div className="px-4 pt-2 space-y-4 pb-6">
                        <Link
                            href="/dashboard"
                            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${pathname === '/dashboard' ? 'bg-[#2ECC71] text-white shadow-lg' : 'text-gray-700 hover:bg-gray-100'
                                }`}
                            onClick={() => setIsOpen(false)}
                        >
                            <HomeIcon className="w-5 h-5" />
                            <span className="font-bold">Dashboard</span>
                        </Link>

                        {featureCategories.map((category) => (
                            <div key={category.name} className="space-y-1">
                                <div className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    {category.name}
                                </div>
                                {category.features.map((item) => {
                                    const isActive = pathname === item.href;
                                    const Icon = item.icon;
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={() => setIsOpen(false)}
                                            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${isActive
                                                ? 'bg-[#2ECC71]/10 text-[#2ECC71] border border-[#2ECC71]/20'
                                                : 'text-gray-700 hover:bg-gray-50'
                                                }`}
                                        >
                                            <Icon className={`w-5 h-5 ${isActive ? 'text-[#2ECC71]' : 'text-gray-400'}`} />
                                            <span className="font-bold text-sm">{item.name}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                        ))}

                        <div className="pt-2 border-t border-gray-100">
                            <Link
                                href="/profile"
                                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${pathname === '/profile' ? 'bg-[#2ECC71] text-white shadow-lg' : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                onClick={() => setIsOpen(false)}
                            >
                                <UserCircleIcon className="w-5 h-5" />
                                <span className="font-bold">Profil Akun</span>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
