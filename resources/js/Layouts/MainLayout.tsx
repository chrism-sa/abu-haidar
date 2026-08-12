import { useState } from 'react';
import { Menu, Search, UserRound, X } from 'lucide-react';
import { Link, usePage } from '@inertiajs/react';
import LoginModal from '../Components/LoginModal';

export default function MainLayout({ children }: { children: React.ReactNode }) {
    const [mobileMenu, setMobileMenu] = useState<boolean>(false);
    const [searchOpen, setSearchOpen] = useState<boolean>(false);
    
    // State untuk mengontrol tampil/hilangnya Modal Login
    const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

    // Mengambil status autentikasi dari backend Laravel (Inertia)
    const { auth } = usePage().props as any;

    return (
        <div className="min-h-screen bg-[#fafaf8] text-[#17251f]">
            {/* ================= HEADER ================= */}
            <header className="sticky top-0 z-50 border-b border-[#e9e6df] bg-white">
                <div className="mx-auto max-w-[1140px] px-5 lg:px-0">
                    <div className="flex h-[70px] items-center justify-between">
                        
                        {/* LOGO */}
                        <Link href="/" className="flex shrink-0 items-center gap-3">
                            <img src="/LOGO.png" alt="Abu Hurairah" className="h-10 w-auto" />
                            <div className="hidden sm:block">
                                <div className="font-serif text-[17px] font-bold leading-none text-[#123f31]">
                                    Abu Hurairah
                                </div>
                                <div className="mt-1 text-[9px] tracking-wide text-[#777]">
                                    Artikel Islam & Dakwah
                                </div>
                            </div>
                        </Link>

                        {/* NAVIGASI DESKTOP */}
                        <nav className="hidden items-center gap-6 lg:flex">
                            {['Beranda', 'Artikel', "Tafsir Al-Qur'an", 'Hadis', 'Akidah', 'Fiqih', 'Sirah'].map((item) => {
                                // Membuat format URL otomatis dari nama menu
                                const linkUrl = item === 'Beranda' 
                                    ? '/' 
                                    : item === 'Artikel' 
                                        ? '/artikel' 
                                        : `/kategori/${item.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

                                return (
                                    <Link
                                        key={item}
                                        href={linkUrl}
                                        className={`text-[12px] transition hover:text-[#0b6045] ${
                                            item === 'Beranda' ? 'font-bold text-[#0b6045]' : 'font-medium text-[#444]'
                                        }`}
                                    >
                                        {item}
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* AKSI (Pencarian & Profil/Login) */}
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={() => setSearchOpen(!searchOpen)} 
                                className="text-[#444] hover:text-[#0b6045]"
                                aria-label="Buka Pencarian"
                            >
                                <Search size={18} />
                            </button>
                            
                            {/* Logika Auth: Jika sudah login, tampilkan "Dashboard", jika belum tampilkan "Login Admin" */}
                            {auth?.user ? (
                                <Link 
                                    href="/admin/dashboard" 
                                    className="hidden items-center gap-2 rounded bg-[#063f2f] px-4 py-2 text-[11px] font-bold text-white hover:bg-[#07513c] sm:flex"
                                >
                                    <UserRound size={13} />
                                    Dashboard
                                </Link>
                            ) : (
                                <button 
                                    onClick={() => setIsLoginModalOpen(true)} 
                                    className="hidden items-center gap-2 rounded bg-[#063f2f] px-4 py-2 text-[11px] font-bold text-white hover:bg-[#07513c] sm:flex"
                                >
                                    <UserRound size={13} />
                                    Login Admin
                                </button>
                            )}
                            
                            <button 
                                onClick={() => setMobileMenu(!mobileMenu)} 
                                className="lg:hidden text-[#444]"
                                aria-label="Buka Menu"
                            >
                                {mobileMenu ? <X size={22} /> : <Menu size={22} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* SEARCH BAR DROPDOWN */}
                {searchOpen && (
                    <div className="border-t border-[#eee] bg-white py-3 px-5 mx-auto lg:px-0">
                        <div className="relative mx-auto max-w-[1140px]">
                            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#999]" />
                            <input
                                type="text"
                                placeholder="Ketik kata kunci artikel..."
                                autoFocus
                                className="w-full rounded-xl border border-[#dedbd2] bg-[#fafaf8] py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[#0b6045]"
                            />
                        </div>
                    </div>
                )}

                {/* MOBILE MENU DROPDOWN */}
                {mobileMenu && (
                    <div className="border-t border-[#eee] py-4 px-5 bg-white lg:hidden shadow-lg absolute w-full">
                        <nav className="space-y-1">
                            {['Beranda', 'Artikel', "Tafsir Al-Qur'an", 'Hadis', 'Akidah', 'Fiqih', 'Sirah'].map((item) => {
                                const linkUrl = item === 'Beranda' 
                                    ? '/' 
                                    : item === 'Artikel' 
                                        ? '/artikel' 
                                        : `/kategori/${item.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

                                return (
                                    <Link
                                        key={item}
                                        href={linkUrl}
                                        onClick={() => setMobileMenu(false)}
                                        className="block rounded-lg px-3 py-3 text-sm text-[#333] hover:bg-[#f5f4ef]"
                                    >
                                        {item}
                                    </Link>
                                );
                            })}
                        </nav>
                        
                        {/* Logika Auth untuk Menu Seluler */}
                        {auth?.user ? (
                            <Link 
                                href="/admin/dashboard" 
                                className="mt-4 flex w-full items-center justify-center gap-2 rounded bg-[#063f2f] px-4 py-3 text-sm font-bold text-white"
                            >
                                <UserRound size={16} /> Dashboard Admin
                            </Link>
                        ) : (
                            <button 
                                onClick={() => {
                                    setMobileMenu(false);
                                    setIsLoginModalOpen(true);
                                }} 
                                className="mt-4 flex w-full items-center justify-center gap-2 rounded bg-[#063f2f] px-4 py-3 text-sm font-bold text-white"
                            >
                                <UserRound size={16} /> Login Admin
                            </button>
                        )}
                    </div>
                )}
            </header>

            {/* ================= MAIN KONTEN (Menampung Halaman Lain) ================= */}
            <main className="mx-auto max-w-[1140px] px-5 lg:px-0 py-8 lg:py-10 min-h-[60vh]">
                {children}
            </main>

            {/* ================= FOOTER ================= */}
            <footer className="bg-[#063f2f] text-white py-12">
                <div className="mx-auto max-w-[1140px] px-5 lg:px-0 grid md:grid-cols-3 gap-8">
                    <div>
                        <img src="/LOGO2.png" alt="Abu Hurairah" className="h-12 brightness-0 invert" />
                        <p className="mt-4 text-[12px] text-white/70 leading-relaxed max-w-xs">
                            Artikel Islam & Dakwah yang menghadirkan tulisan seputar Al-Qur'an, hadis, akidah, fiqih, sirah, dan kehidupan seorang muslim.
                        </p>
                    </div>
                </div>
                <div className="mx-auto max-w-[1140px] mt-8 border-t border-white/10 pt-5 px-5 lg:px-0 text-center text-[10px] text-white/45">
                    © 2026 Abu Hurairah. Artikel Islam & Dakwah.
                </div>
            </footer>

            {/* ================= MODAL LOGIN ================= */}
            <LoginModal 
                isOpen={isLoginModalOpen} 
                onClose={() => setIsLoginModalOpen(false)} 
            />
        </div>
    );
}