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
    ArrowLeftIcon
} from '@heroicons/react/24/outline';

const features = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Enhance Foto', href: '/features/photo-enhancer', icon: SparklesIcon },
    { name: 'Social Caption', href: '/features/social-caption', icon: ChatBubbleBottomCenterTextIcon },
    { name: 'Product Desc', href: '/features/product-description', icon: PencilSquareIcon },
    { name: 'Image Analyzer', href: '/features/image-analyzer', icon: MagnifyingGlassIcon },
    { name: 'CS Templates', href: '/features/cs-templates', icon: UserGroupIcon },
    { name: 'Background Editor', href: '/features/background-editor', icon: PhotoIcon },
];

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

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
                        {pathname === '/' ? (
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
                            <nav className="flex space-x-1 lg:space-x-2">
                                {features.map((item) => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${isActive
                                                ? 'text-[#2ECC71] bg-[#2ECC71]/10'
                                                : 'text-gray-600 hover:text-[#2ECC71] hover:bg-gray-50'
                                                }`}
                                        >
                                            {item.name}
                                        </Link>
                                    );
                                })}
                            </nav>
                        )}
                    </div>

                    {/* Mobile Menu Button / Auth Buttons */}
                    <div className="md:hidden flex items-center gap-3">
                        {pathname === '/' ? (
                            <Link
                                href="/login"
                                className="px-4 py-2 rounded-lg text-xs font-bold bg-[#2ECC71]/10 text-[#2ECC71]"
                            >
                                Masuk
                            </Link>
                        ) : (
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
                    <div className="px-4 pt-2 space-y-1">
                        {features.map((item) => {
                            const isActive = pathname === item.href;
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${isActive
                                        ? 'bg-[#2ECC71] text-white clay-button text-white'
                                        : 'text-gray-700 hover:bg-[#2ECC71]/10 hover:text-[#2ECC71]'
                                        }`}
                                >
                                    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : ''}`} />
                                    <span className="font-bold">{item.name}</span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}
        </header>
    );
}
