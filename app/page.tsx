"use client";

import Link from "next/link";
import {
  SparklesIcon,
  RocketLaunchIcon,
  CheckCircleIcon,
  BoltIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  CursorArrowRaysIcon,
  DevicePhoneMobileIcon,
  PresentationChartLineIcon,
  ArrowPathIcon,
  QuestionMarkCircleIcon,
  FaceSmileIcon,
  PhotoIcon,
  MegaphoneIcon,
  ChatBubbleBottomCenterTextIcon,
  SwatchIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
  ChatBubbleLeftRightIcon
} from "@heroicons/react/24/outline";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#E8ECEF] overflow-hidden">

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-4 overflow-hidden">
        {/* Floating Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
          <div className="absolute top-[10%] left-[5%] w-64 h-64 bg-[#2ECC71]/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-[20%] right-[10%] w-96 h-96 bg-[#2ECC71]/5 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 backdrop-blur-md border border-[#2ECC71]/20 shadow-sm mb-8 animate-fade-in-up">
            <SparklesIcon className="w-5 h-5 text-[#2ECC71]" />
            <span className="text-sm font-bold text-[#1a1f24]">AI Terintegrasi untuk UMKM Indonesia</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-[#1a1f24] tracking-tight leading-tight mb-8 animate-fade-in-up">
            Tingkatkan Jualan Anda <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2ECC71] to-[#27ae60]">
              Dengan Kekuatan AI
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-600 font-medium mb-12 animate-fade-in-up italic">
            "Satu platform, semua solusi digital. Dari studio foto AI hingga deskripsi produk otomatis, kami bantu bisnis Anda naik kelas."
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-fade-in-up">
            <Link
              href="/dashboard"
              className="clay-button px-10 py-5 rounded-2xl text-lg font-bold flex items-center gap-2 transform hover:scale-105 active:scale-95 transition-all w-full sm:w-auto"
            >
              Coba Gratis Sekarang
              <RocketLaunchIcon className="w-6 h-6" />
            </Link>
            <Link
              href="#how-it-works"
              className="px-10 py-5 rounded-2xl text-lg font-bold bg-white text-[#1a1f24] border-2 border-[#2ECC71]/20 hover:border-[#2ECC71]/50 transition-all w-full sm:w-auto shadow-sm"
            >
              Lihat Fitur
            </Link>
          </div>

          <div className="mt-20 relative px-4 sm:px-0">
            <div className="clay-card p-4 sm:p-8 max-w-4xl mx-auto transform rotate-1 animate-fade-in-up">
              <div className="bg-[#1a1d1f] rounded-2xl overflow-hidden shadow-2xl relative">
                <div className="p-4 border-b border-white/10 flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="p-6 md:p-12 text-left">
                  <h3 className="text-2xl font-bold text-white mb-4 italic">Dashboard Cerdas UMKM</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="h-20 bg-white/5 rounded-xl animate-pulse"></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PARTNER LOGO BAR (SOCIAL PROOF) */}
      <section className="py-12 border-y border-[#2ECC71]/10 bg-white/30 backdrop-blur-sm overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-center text-xs font-black text-gray-400 mb-8 uppercase tracking-[0.3em]">Dipercaya Oleh Ribuan Pengusaha</p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
            {["SHOPY", "TOKOPED", "INSTA", "TIKTOK", "FACEBK", "GGLADS"].map(logo => (
              <span key={logo} className="text-2xl font-black text-[#1a1f24] tracking-tighter italic">{logo}</span>
            ))}
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-32 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-black text-[#1a1f24] mb-6 underline decoration-[#2ECC71] decoration-8 underline-offset-8">3 Langkah Langsung Jualan</h2>
            <p className="text-xl text-gray-600 font-medium">Lupakan proses ribet, biarkan AI yang bekerja untuk Anda.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative">
            {/* Connector Line */}
            <div className="hidden md:block absolute top-[28%] left-[10%] right-[10%] h-1 bg-gradient-to-r from-transparent via-[#2ECC71]/20 to-transparent -z-10"></div>

            {[
              { step: "01", title: "Pilih Tools", desc: "Pilih asisten AI sesuai kebutuhanmu (Foto, Caption, atau CS).", icon: CursorArrowRaysIcon },
              { step: "02", title: "Input Data", desc: "Berikan detail produk atau upload foto yang ingin dioptimalkan.", icon: DevicePhoneMobileIcon },
              { step: "03", title: "Salin & Posting", desc: "AI akan memberikan hasil terbaik. Langsung posting dan terima orderan!", icon: BoltIcon }
            ].map((item, i) => (
              <div key={i} className="text-center group">
                <div className="w-24 h-24 mx-auto clay-card flex items-center justify-center mb-8 relative group-hover:scale-110 transition-transform duration-500">
                  <div className="absolute -top-3 -right-3 w-10 h-10 bg-[#2ECC71] text-white rounded-full flex items-center justify-center font-black text-sm shadow-lg shadow-[#2ECC71]/30">{item.step}</div>
                  <item.icon className="w-10 h-10 text-[#2ECC71]" />
                </div>
                <h3 className="text-2xl font-bold text-[#1a1f24] mb-4">{item.title}</h3>
                <p className="text-gray-600 font-medium leading-relaxed px-4">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. KEY BENEFITS SECTION (BENTO GRID STYLE) */}
      <section className="py-32 px-4 bg-white/60">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 leading-relaxed">

            {/* Big Feature - Photo Enhancer */}
            <div className="lg:col-span-8 clay-card p-10 bg-gradient-to-br from-white to-[#f0f4f7] relative overflow-hidden group">
              <div className="relative z-10 max-w-md">
                <div className="w-12 h-12 bg-[#2ECC71] rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-[#2ECC71]/20">
                  <SparklesIcon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-3xl font-black text-[#1a1f24] mb-6 leading-tight">AI Photo Studio <br /><span className="text-[#2ECC71]">Kualitas Profesional</span></h3>
                <p className="text-gray-600 font-bold mb-8">Ubah foto produk dari HP menjadi foto katalog berkelas internasional. Teknologi AI Studio kami mengatur pencahayaan dan latar belakang secara otomatis untuk hasil yang memukau.</p>
                <ul className="space-y-4 mb-10">
                  {["Pencahayaan Studio Otomatis", "Latar Belakang Estetik & Mewah", "Komposisi Produk Presisi"].map(item => (
                    <li key={item} className="flex items-center gap-3 text-sm font-black text-[#1a1f24]/70">
                      <CheckCircleIcon className="w-5 h-5 text-[#2ECC71]" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/features/photo-enhancer" className="clay-button inline-block px-8 py-4 rounded-xl font-bold text-sm">Gunakan AI Studio</Link>
              </div>
              <div className="absolute right-[-5%] bottom-[-5%] w-[55%] opacity-15 group-hover:opacity-25 transition-all duration-1000 rotate-6 group-hover:rotate-0">
                <PhotoIcon className="w-full h-full text-[#2ECC71]" />
              </div>
            </div>

            {/* Side Features */}
            <div className="lg:col-span-4 grid grid-cols-1 gap-6">
              <div className="clay-card p-8 bg-[#2ECC71] text-white overflow-hidden relative group">
                <h4 className="text-xl font-black text-[#1a1f24] mb-4">Caption Viral <br />Otomatis</h4>
                <p className="text-sm text-gray-500 font-bold mb-6 italic">Postinganmu sepi? Biarkan AI riset hashtag dan gaya bahasa yang lagi rame.</p>
                <MegaphoneIcon className="absolute right-[-20px] bottom-[-20px] w-24 h-24  rotate-[-15deg] text-[#2ECC71]/30 group-hover:rotate-0 transition-all duration-500" />
              </div>
              <div className="clay-card p-8 bg-white border border-[#2ECC71]/10 overflow-hidden relative group">
                <h4 className="text-xl font-black text-[#1a1f24] mb-4">Background <br />Remover</h4>
                <p className="text-gray-500 text-sm font-medium mb-6">Hapus background foto yang berantakan dan ganti dengan warna Solid yang elegan.</p>
                <SwatchIcon className="absolute right-[-20px] bottom-[-20px] w-24 h-24 text-[#2ECC71]/30 rotate-[15deg] group-hover:rotate-0 transition-all duration-500" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. ALL FEATURES GRID */}
      <section className="py-24 px-4 bg-white/30 backdrop-blur-sm border-y border-[#2ECC71]/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-[#1a1f24] mb-4">Solusi Lengkap <span className="text-[#2ECC71]">Satu Dashboard</span></h2>
            <p className="text-gray-500 font-bold max-w-xl mx-auto">Semua yang Anda butuhkan untuk mendigitalisasi UMKM Anda tersedia dalam satu platform pintar.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Photo Enhancer",
                desc: "Ubah foto produk HP menjadi kualitas studio profesional secara instan.",
                icon: SparklesIcon,
                href: "/features/photo-enhancer"
              },
              {
                title: "Social Caption",
                desc: "Buat caption Instagram & TikTok yang viral dengan riset hashtag otomatis.",
                icon: MegaphoneIcon,
                href: "/features/social-caption"
              },
              {
                title: "Product Description",
                desc: "Generate deskripsi jualan yang persuasif untuk Shopee & Tokopedia.",
                icon: PencilSquareIcon,
                href: "/features/product-description"
              },
              {
                title: "Image Analyzer",
                desc: "AI yang mampu membedah fitur produk hanya dari sekali upload foto.",
                icon: MagnifyingGlassIcon,
                href: "/features/image-analyzer"
              },
              {
                title: "Background Remover",
                desc: "Hapus background foto yang berantakan dengan sekali klik, rapi & bersih.",
                icon: SwatchIcon,
                href: "/features/background-editor"
              },
              {
                title: "CS Template",
                desc: "Handle customer lebih cepat dengan template balasan yang ramah & persuasif.",
                icon: ChatBubbleLeftRightIcon,
                href: "/features/cs-templates"
              }
            ].map((f, i) => (
              <Link key={i} href={f.href} className="clay-card p-8 group hover:-translate-y-2 transition-all duration-300 border-2 border-transparent hover:border-[#2ECC71]/30">
                <div className="w-14 h-14 rounded-2xl bg-[#2ECC71]/10 flex items-center justify-center mb-6 group-hover:bg-[#2ECC71] transition-colors duration-300">
                  <f.icon className="w-8 h-8 text-[#2ECC71] group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-black text-[#1a1f24] mb-3 group-hover:text-[#2ECC71] transition-colors">{f.title}</h3>
                <p className="text-gray-500 font-medium text-sm leading-relaxed">{f.desc}</p>
                <div className="mt-6 flex items-center gap-2 text-[#2ECC71] font-black text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                  Coba Tool Ini <ArrowPathIcon className="w-3 h-3 animate-spin-slow" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 6. PRICING SECTION */}
      <section className="py-32 px-4 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-[#2ECC71]/5 rounded-full blur-[150px] -z-10"></div>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-black text-[#1a1f24] mb-6 italic">Investasi Kecil, <span className="text-[#2ECC71] not-italic underline decoration-[#2ECC71]/30 decoration-8">Profit Gede</span></h2>
            <p className="text-xl text-gray-600 font-medium">Tanpa biaya admin, tanpa biaya hidden. Fokus jualan aja.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch pt-8">
            {/* FREE */}
            <div className="clay-card p-10 bg-white/80 flex flex-col">
              <div className="mb-8">
                <h3 className="text-xs font-black text-gray-400 tracking-widest uppercase mb-2">PEMULA</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black text-[#1a1f24]">Rp 0</span>
                  <span className="text-gray-400 font-bold">/gratis</span>
                </div>
              </div>
              <ul className="space-y-5 flex-1 mb-10">
                {["3 Edit Foto Studio / Bln", "Social Caption Dasar", "Template CS Terbatas", "Watermark UMKM Tools"].map(item => (
                  <li key={item} className="flex items-center gap-3 text-sm font-bold text-gray-500">
                    <CheckCircleIcon className="w-5 h-5 opacity-40" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/dashboard" className="block text-center py-5 rounded-2xl border-2 border-gray-100 text-gray-500 font-black hover:bg-gray-50 transition-all">Pilih Paket</Link>
            </div>

            {/* PRO */}
            <div className="clay-card p-12 ring-4 ring-[#2ECC71]/30 relative transform hover:scale-[1.03] transition-all bg-gradient-to-br from-white to-[#f0fdf4] shadow-2xl z-20">
              <div className="absolute top-6 right-6 bg-[#2ECC71] text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest animate-bounce-short">TERBAIK</div>
              <div className="mb-10">
                <h3 className="text-sm font-black text-[#2ECC71] tracking-widest uppercase mb-2">PENGUSAHA PRO</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-xs text-gray-500 font-black">IDR</span>
                  <span className="text-6xl font-black text-[#1a1f24]">99k</span>
                  <span className="text-gray-500 font-bold">/bln</span>
                </div>
              </div>
              <ul className="space-y-5 flex-1 mb-12">
                {["Unlimited AI Photo Studio", "Resolusi Tinggi (4K)", "Tanpa Watermark", "Unlimited Social Caption", "CS Templates Premium", "Prioritas Server"].map(item => (
                  <li key={item} className="flex items-center gap-3 text-sm font-black text-[#1a1f24]">
                    <CheckCircleIcon className="w-5 h-5 text-[#2ECC71]" />
                    {item}
                  </li>
                ))}
              </ul>
              <button className="clay-button w-full py-6 rounded-2xl font-black text-lg shadow-xl shadow-[#2ECC71]/20">Mulai Langganan</button>
            </div>

            {/* BUSINESS */}
            <div className="clay-card p-10 bg-white/80 flex flex-col">
              <div className="mb-8">
                <h3 className="text-xs font-black text-gray-400 tracking-widest uppercase mb-2">BRAND BESAR</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-xs text-gray-500 font-black">IDR</span>
                  <span className="text-5xl font-black text-[#1a1f24]">249k</span>
                  <span className="text-gray-400 font-bold">/bln</span>
                </div>
              </div>
              <ul className="space-y-5 flex-1 mb-10">
                {["Hingga 5 User Akses", "Dedicated AI Assistant", "API Access (Custom Build)", "Full Brand Training", "Private Slack Community"].map(item => (
                  <li key={item} className="flex items-center gap-3 text-sm font-bold text-gray-600">
                    <CheckCircleIcon className="w-5 h-5 text-[#2ECC71]/50" />
                    {item}
                  </li>
                ))}
              </ul>
              <button className="block w-full text-center py-5 rounded-2xl border-2 border-[#1a1f24] text-[#1a1f24] font-black hover:bg-[#1a1f24] hover:text-white transition-all">Hubungi Sales</button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. TESTIMONIALS SECTION */}
      <section className="py-32 px-4 bg-white/40">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
            <div className="max-w-2xl text-left">
              <h2 className="text-4xl md:text-5xl font-black text-[#1a1f24] mb-6 leading-tight">Apa Kata Sahabat <br /><span className="text-[#2ECC71]">UMKM Tools?</span></h2>
              <p className="text-xl text-gray-600 font-medium italic">"Berawal dari coba-coba, sekarang jadi andalan utama tiap hari."</p>
            </div>
            <div className="flex gap-2">
              <div className="p-4 bg-white rounded-2xl shadow-sm border border-[#2ECC71]/10 text-[#2ECC71]"><FaceSmileIcon className="w-8 h-8" /></div>
              <div className="px-6 py-4 bg-[#1a1f24] rounded-2xl shadow-xl text-white font-black italic">1,000+ Reviews</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { user: "Budi Santoso", job: "Owner Fashionista", text: "AI Photo Studio-nya sakti bener! Foto produk cuma pake HP tapi hasilnya kayak difoto fotografer profesional di studio." },
              { user: "Siti Rahma", job: "Toko Kerajinan Tangan", text: "Background Remover-nya halus banget! Foto produk rumahan jadi kelihatan kayak barang butik mahal." },
              { user: "Agus Junaidi", job: "Dropshipper Aktif", text: "Fitur CS Template sangat menyelamatkan saya dari pertanyaan customer yang rebutan stok. Sangat efisien!" }
            ].map((t, i) => (
              <div key={i} className="clay-card p-10 relative">
                <div className="flex gap-1 mb-6">
                  {[1, 2, 3, 4, 5].map(s => <SparklesIcon key={s} className="w-4 h-4 text-[#2ECC71] fill-[#2ECC71]" />)}
                </div>
                <p className="text-[#1a1f24] font-bold text-lg italic mb-8 leading-relaxed">"{t.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#2ECC71] to-[#27ae60]"></div>
                  <div>
                    <p className="font-black text-[#1a1f24]">{t.user}</p>
                    <p className="text-xs font-bold text-[#2ECC71]">{t.job}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. FAQ SECTION */}
      <section className="py-32 px-4 relative">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black text-[#1a1f24] mb-4 flex items-center justify-center gap-3">
              <QuestionMarkCircleIcon className="w-10 h-10 text-[#2ECC71]" />
              Tanya UMKM Tools
            </h2>
            <p className="text-gray-500 font-bold">Pertanyaan yang paling sering diajukan oleh pengguna kami.</p>
          </div>

          <div className="space-y-6">
            {[
              { q: "Apakah alat ini mudah digunakan untuk gaptek?", a: "Sangat mudah! Kami merancang dashboard sesederhana mungkin. Cukup klik dan hasil keluar dalam hitungan detik." },
              { q: "Apakah foto saya aman?", a: "100% aman. Kami menggunakan sistem enkripsi tingkat lanjut dan tidak akan menyebarluaskan aset visual Anda." },
              { q: "Bisa bayar pakai apa saja?", a: "Kami mendukung semua metode pembayaran populer di Indonesia: QRIS, Transfer Bank, GoPay, OVO, hingga Dana." },
              { q: "Ada bantuan customer service?", a: "Tentu! Kami menyediakan bantuan teknis 24/7 melalui pusat bantuan di dashboard Anda." }
            ].map((faq, i) => (
              <div key={i} className="clay-card p-8 group hover:-translate-y-1 transition-all duration-300 border-2 border-transparent hover:border-[#2ECC71]/20">
                <h4 className="text-xl font-black text-[#1a1f24] mb-4 flex gap-4">
                  <span className="text-[#2ECC71]">Q:</span>
                  {faq.q}
                </h4>
                <p className="text-gray-600 font-medium pl-10 leading-relaxed"><span className="text-[#2ECC71] font-black mr-2">A:</span>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. FINAL CTA SECTION (TRUST SECTION BIGGER) */}
      <section className="py-32 px-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[#1a1d1f] -z-20"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[800px] h-[800px] bg-[#2ECC71]/5 rounded-full blur-[180px] -z-10 animate-pulse"></div>

        <div className="max-w-5xl mx-auto clay-card p-16 text-center bg-white shadow-[0_50px_100px_-20px_rgba(46,204,113,0.3)] relative overflow-hidden">
          <div className="absolute top-[-50px] left-[-50px] w-48 h-48 bg-[#2ECC71]/10 rounded-full blur-3xl"></div>

          <h2 className="text-5xl font-black text-[#1a1f24] mb-8 tracking-tighter leading-tight italic">Masa Depan Bisnis <span className="text-[#2ECC71] not-italic underline decoration-[#2ECC71]/30 decoration-[16px]">Dimulai Di Sini.</span></h2>
          <p className="text-2xl text-gray-500 font-bold mb-12 max-w-2xl mx-auto italic">"Bergabunglah dengan pengusaha UMKM cerdas lainnya. Tingkatkan omzet, kurangi lembur."</p>

          <div className="flex flex-wrap justify-center gap-8 mb-16">
            <div className="flex items-center gap-3 px-6 py-4 bg-gray-50 rounded-2xl shadow-inner border border-gray-100">
              <ShieldCheckIcon className="w-10 h-10 text-[#2ECC71]" />
              <div className="text-left">
                <p className="text-lg font-black text-[#1a1f24]">Secure AI</p>
                <p className="text-xs text-gray-400 font-bold">Proteksi Data 100%</p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-6 py-4 bg-gray-50 rounded-2xl shadow-inner border border-gray-100">
              <BoltIcon className="w-10 h-10 text-yellow-500 animate-bounce-short" />
              <div className="text-left">
                <p className="text-lg font-black text-[#1a1f24]">Lightning Fast</p>
                <p className="text-xs text-gray-400 font-bold">Hasil &lt; 3 Detik</p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-6 py-4 bg-gray-50 rounded-2xl shadow-inner border border-gray-100">
              <ArrowPathIcon className="w-10 h-10 text-blue-500 animate-spin-slow" />
              <div className="text-left">
                <p className="text-lg font-black text-[#1a1f24]">Reliable</p>
                <p className="text-xs text-gray-400 font-bold">Uptime 99.9%</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link href="/dashboard" className="clay-button px-16 py-8 rounded-[32px] text-2xl font-black shadow-[0_25px_50px_-12px_rgba(46,204,113,0.5)] transform hover:scale-110 active:scale-95 transition-all">
              Mulai Jualan Pintar!
            </Link>
          </div>

          <p className="mt-8 text-sm font-bold text-gray-400 italic">No credit card required for free trial.</p>
        </div>
      </section>

    </div>
  );
}
