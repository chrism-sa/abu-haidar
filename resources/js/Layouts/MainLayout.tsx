import React, { useState, useRef, useEffect } from "react";
import {
    UserRound,
    Search,
    X,
    BookOpen,
    FileText,
    Home as HomeIcon,
    LayoutDashboard,
} from "lucide-react";
import { Link, usePage } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import LoginModal from "../Components/LoginModal";
import { Category } from "../types";
import { FaYoutube, FaInstagram, FaFacebookF } from "react-icons/fa6";

interface SearchArticle {
    id: number;
    title: string;
    slug: string;
    image?: string;
    description?: string;
}

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
    const [mobileSearchOpen, setMobileSearchOpen] = useState<boolean>(false);

    const desktopSearchRef = useRef<HTMLDivElement>(null);
    const mobileSearchRef = useRef<HTMLDivElement>(null);
    const mobileInputRef = useRef<HTMLInputElement>(null);

    const { url } = usePage();
    const { auth } = usePage().props as {
        auth?: { user?: { name: string; email: string } };
        categories?: Category[];
    };

    const [searchQuery, setSearchQuery] = useState<string>("");
    const [searchResults, setSearchResults] = useState<SearchArticle[]>([]);
    const [isSearching, setIsSearching] = useState<boolean>(false);

    // Auto-focus input saat pencarian mobile dibuka
    useEffect(() => {
        if (mobileSearchOpen) {
            setTimeout(() => {
                mobileInputRef.current?.focus();
            }, 150);
        }
    }, [mobileSearchOpen]);

    // Live Search Fetching
    useEffect(() => {
        const trimmedQuery = searchQuery.trim();

        if (trimmedQuery.length < 2) {
            setSearchResults([]);
            setIsSearching(false);
            return;
        }

        setIsSearching(true);
        const timerId = setTimeout(() => {
            fetch(`/api/articles/search?q=${encodeURIComponent(trimmedQuery)}`)
                .then((res) => res.json())
                .then((data) => {
                    setSearchResults(data.articles || []);
                    setIsSearching(false);
                })
                .catch(() => {
                    setIsSearching(false);
                });
        }, 300);

        return () => clearTimeout(timerId);
    }, [searchQuery]);

    // Tutup dropdown hasil pencarian saat klik di luar
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const isClickInsideDesktop =
                desktopSearchRef.current &&
                desktopSearchRef.current.contains(event.target as Node);
            const isClickInsideMobile =
                mobileSearchRef.current &&
                mobileSearchRef.current.contains(event.target as Node);

            if (!isClickInsideDesktop && !isClickInsideMobile) {
                setSearchResults([]);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            window.location.href = `/artikel?search=${encodeURIComponent(
                searchQuery.trim(),
            )}`;
        }
    };

    return (
        <div className="relative min-h-screen bg-[#F7EAE0] text-[#5E3122] flex flex-col justify-between selection:bg-[#1D4533] selection:text-[#F7EAE0] pb-24 lg:pb-0">
            {/* ======================================================== */}
            {/* BACKGROUND: FLUID GLOWING ORBS */}
            {/* ======================================================== */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <motion.div
                    animate={{
                        x: [0, 20, -15, 0],
                        y: [0, -20, 15, 0],
                        scale: [1, 1.05, 0.95, 1],
                    }}
                    transition={{
                        duration: 14,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    style={{ willChange: "transform" }}
                    className="absolute -top-[10%] -left-[10%] h-[60vw] w-[60vw] max-w-[450px] max-h-[450px] rounded-full bg-[#1D4533] opacity-[0.12] blur-[70px]"
                />

                <motion.div
                    animate={{
                        x: [0, -20, 20, 0],
                        y: [0, 20, -15, 0],
                        scale: [1, 0.95, 1.05, 1],
                    }}
                    transition={{
                        duration: 16,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    style={{ willChange: "transform" }}
                    className="absolute -bottom-[10%] -right-[10%] h-[65vw] w-[65vw] max-w-[500px] max-h-[500px] rounded-full bg-[#F9D2BA] opacity-[0.35] blur-[80px]"
                />
            </div>

            {/* ================= HEADER ================= */}
            <header className="sticky top-0 z-40 border-b border-[#E8D9CE] bg-[#F7EAE0]/90 backdrop-blur-md shadow-2xs">
                <div className="mx-auto max-w-[1140px] px-4 sm:px-6 lg:px-8">
                    <div className="flex h-[64px] sm:h-[76px] items-center justify-between gap-3">
                        {/* 1. BRAND LOGO + KAPSUL */}
                        <Link
                            href="/"
                            className="flex shrink-0 items-center gap-2 sm:gap-3 rounded-full border border-[#F9D2BA] bg-white px-2.5 sm:px-3.5 py-1.5 shadow-2xs transition-all duration-300 hover:border-[#1D4533]/40"
                        >
                            <img
                                src="/LOGO.png"
                                alt="Abu Haidar"
                                style={{
                                    filter: "brightness(0) saturate(100%) invert(20%) sepia(35%) saturate(1600%) hue-rotate(345deg) brightness(90%) contrast(92%)",
                                }}
                                className="h-8 sm:h-10 w-auto object-contain drop-shadow-2xs"
                            />

                            <div className="h-6 sm:h-7 w-[1px] bg-[#5E3122]/20"></div>

                            <div className="flex flex-col justify-center pr-1 sm:pr-1.5">
                                <div className="font-brand text-[14px] sm:text-[16px] font-bold leading-none tracking-tight text-[#1D4533] whitespace-nowrap">
                                    Abu Haidar
                                </div>
                                <div className="mt-0.5 sm:mt-1 text-[7.5px] sm:text-[8px] font-bold tracking-[0.14em] text-[#8C5E43] uppercase whitespace-nowrap">
                                    Media Islam & Dakwah
                                </div>
                            </div>
                        </Link>

                        {/* 2. MENU NAVIGASI DESKTOP (Tampil di layar >= lg: 1024px) */}
                        <nav className="hidden lg:flex items-center gap-5 xl:gap-7 text-[13.5px] font-bold text-[#1D4533]">
                            <Link
                                href="/home"
                                className={`flex items-center gap-1.5 whitespace-nowrap transition ${
                                    url === "/home" || url === "/"
                                        ? "text-[#1D4533]"
                                        : "text-[#5E3122]/75 hover:text-[#1D4533]"
                                }`}
                            >
                                <HomeIcon size={15} />
                                <span>Beranda</span>
                            </Link>
                            <Link
                                href="/artikel"
                                className={`flex items-center gap-1.5 whitespace-nowrap transition ${
                                    url.startsWith("/artikel")
                                        ? "text-[#1D4533]"
                                        : "text-[#5E3122]/75 hover:text-[#1D4533]"
                                }`}
                            >
                                <BookOpen size={15} />
                                <span>Kajian & Artikel</span>
                            </Link>
                            <Link
                                href="/ebook"
                                className={`flex items-center gap-1.5 whitespace-nowrap transition ${
                                    url.startsWith("/ebook")
                                        ? "text-[#1D4533]"
                                        : "text-[#5E3122]/75 hover:text-[#1D4533]"
                                }`}
                            >
                                <FileText size={15} />
                                <span>E-Book PDF</span>
                            </Link>
                        </nav>

                        {/* 3. PENCARIAN & TOMBOL AKUN */}
                        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                            {/* Input Pencarian Desktop (Tampil di >= lg) */}
                            <div
                                className="relative hidden lg:block w-48 xl:w-60"
                                ref={desktopSearchRef}
                            >
                                <form
                                    onSubmit={handleSearchSubmit}
                                    className="relative w-full"
                                >
                                    <Search
                                        size={14}
                                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5E3122]/40"
                                    />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                        placeholder="Cari kajian..."
                                        className="w-full rounded-full border border-[#F9D2BA] bg-white py-1.5 pl-9 pr-3.5 text-[12px] text-[#5E3122] outline-none transition focus:border-[#1D4533] focus:ring-1 focus:ring-[#1D4533]/20"
                                    />
                                </form>

                                {/* Dropdown Hasil Pencarian Desktop */}
                                {searchQuery.trim().length > 1 && (
                                    <div className="absolute top-full left-0 right-0 mt-2 rounded-2xl bg-white shadow-xl border border-[#F9D2BA] overflow-hidden z-50 max-h-[350px] overflow-y-auto">
                                        {isSearching ? (
                                            <div className="p-4 text-center text-[12px] font-medium text-[#5E3122]/60">
                                                Mencari artikel...
                                            </div>
                                        ) : searchResults.length > 0 ? (
                                            <div className="divide-y divide-[#F9D2BA]/40">
                                                {searchResults.map(
                                                    (article) => (
                                                        <Link
                                                            key={article.id}
                                                            href={`/artikel/${article.slug}`}
                                                            onClick={() => {
                                                                setSearchQuery(
                                                                    "",
                                                                );
                                                                setSearchResults(
                                                                    [],
                                                                );
                                                            }}
                                                            className="flex items-center gap-3 p-3 hover:bg-[#F9D2BA]/20 transition-colors"
                                                        >
                                                            <img
                                                                src={
                                                                    article.image ||
                                                                    "/storage/default.jpg"
                                                                }
                                                                alt={
                                                                    article.title
                                                                }
                                                                className="h-10 w-12 rounded-lg object-cover border border-[#F9D2BA]"
                                                            />
                                                            <div className="flex-1 min-w-0">
                                                                <h4 className="font-brand text-[13px] font-bold text-[#1D4533] truncate">
                                                                    {
                                                                        article.title
                                                                    }
                                                                </h4>
                                                                <p className="text-[11px] text-[#5E3122]/70 line-clamp-1">
                                                                    {
                                                                        article.description
                                                                    }
                                                                </p>
                                                            </div>
                                                        </Link>
                                                    ),
                                                )}
                                            </div>
                                        ) : (
                                            <div className="p-4 text-center text-[12px] text-[#5E3122]/60">
                                                Tidak ada artikel yang cocok.
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Tombol Toggle Pencarian Mobile & Tablet (< lg) */}
                            <button
                                type="button"
                                onClick={() =>
                                    setMobileSearchOpen(!mobileSearchOpen)
                                }
                                className="lg:hidden flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-white text-[#5E3122] border border-[#F9D2BA] transition hover:bg-[#F9D2BA]/30 cursor-pointer shadow-2xs"
                                aria-label="Cari Artikel"
                            >
                                {mobileSearchOpen ? (
                                    <X size={16} />
                                ) : (
                                    <Search size={16} />
                                )}
                            </button>

                            {/* Tombol Dashboard / Akun Jamaah / Login */}
                            {auth?.user ? (
                                <Link
                                    href={
                                        auth.user.role === "admin"
                                            ? "/admin/dashboard"
                                            : "/user/dashboard"
                                    }
                                    className="flex items-center gap-1.5 rounded-full bg-[#1D4533] px-3 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-[12px] font-bold text-[#F7EAE0] transition hover:bg-[#143325] shadow-2xs whitespace-nowrap"
                                >
                                    <LayoutDashboard size={13} />
                                    <span>
                                        {auth.user.role === "admin"
                                            ? "Dashboard Admin"
                                            : "Akun Saya"}
                                    </span>
                                </Link>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => setIsLoginModalOpen(true)}
                                    className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-[#F9D2BA] bg-white text-[#5E3122] hover:border-[#1D4533] hover:bg-[#1D4533] hover:text-[#F7EAE0] transition-all shadow-2xs cursor-pointer"
                                    title="Masuk Akun"
                                >
                                    <UserRound size={15} />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* ================= PENCARIAN MOBILE & TABLET DRAWER ================= */}
                    <AnimatePresence>
                        {mobileSearchOpen && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                                ref={mobileSearchRef}
                                className="lg:hidden pb-3 pt-1 border-t border-[#E8D9CE] overflow-hidden"
                            >
                                <form
                                    onSubmit={handleSearchSubmit}
                                    className="relative w-full flex items-center"
                                >
                                    <Search
                                        size={15}
                                        className="absolute left-3.5 text-[#5E3122]/40"
                                    />
                                    <input
                                        ref={mobileInputRef}
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                        placeholder="Ketik judul artikel / kajian..."
                                        className="w-full rounded-full border border-[#F9D2BA] bg-white py-2 pl-9 pr-9 text-[12px] text-[#5E3122] outline-none focus:border-[#1D4533]"
                                    />
                                    {searchQuery && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSearchQuery("");
                                                setSearchResults([]);
                                            }}
                                            className="absolute right-3 text-[#5E3122]/40 cursor-pointer"
                                        >
                                            <X size={14} />
                                        </button>
                                    )}
                                </form>

                                {/* Hasil Pencarian Mobile */}
                                {searchQuery.trim().length > 1 && (
                                    <div className="mt-2 rounded-xl bg-white shadow-lg border border-[#F9D2BA] overflow-hidden max-h-[250px] overflow-y-auto">
                                        {isSearching ? (
                                            <div className="p-3 text-center text-[11px] text-[#5E3122]/60">
                                                Mencari artikel...
                                            </div>
                                        ) : searchResults.length > 0 ? (
                                            <div className="divide-y divide-[#F9D2BA]/40">
                                                {searchResults.map(
                                                    (article) => (
                                                        <Link
                                                            key={article.id}
                                                            href={`/artikel/${article.slug}`}
                                                            onClick={() => {
                                                                setSearchQuery(
                                                                    "",
                                                                );
                                                                setSearchResults(
                                                                    [],
                                                                );
                                                                setMobileSearchOpen(
                                                                    false,
                                                                );
                                                            }}
                                                            className="flex items-center gap-2.5 p-2.5 hover:bg-[#F9D2BA]/20 transition-colors"
                                                        >
                                                            <img
                                                                src={
                                                                    article.image ||
                                                                    "/storage/default.jpg"
                                                                }
                                                                alt={
                                                                    article.title
                                                                }
                                                                className="h-9 w-11 rounded object-cover border border-[#F9D2BA]"
                                                            />
                                                            <div className="flex-1 min-w-0">
                                                                <h4 className="font-brand text-[12px] font-bold text-[#1D4533] truncate">
                                                                    {
                                                                        article.title
                                                                    }
                                                                </h4>
                                                                <p className="text-[10px] text-[#5E3122]/70 line-clamp-1">
                                                                    {
                                                                        article.description
                                                                    }
                                                                </p>
                                                            </div>
                                                        </Link>
                                                    ),
                                                )}
                                            </div>
                                        ) : (
                                            <div className="p-3 text-center text-[11px] text-[#5E3122]/60">
                                                Tidak ditemukan hasil.
                                            </div>
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </header>

            {/* ================= MAIN KONTEN ================= */}
            <main className="relative z-10 mx-auto w-full max-w-[1140px] px-4 sm:px-6 lg:px-8 py-6 sm:py-10 flex-grow">
                {children}
            </main>

            {/* ================= FOOTER ================= */}
            <footer className="relative z-10 bg-[#F7EAE0] text-[#3A1C12] pt-12 sm:pt-16 pb-12 border-t border-[#DFC9BC] mt-12 sm:mt-16">
                <div className="mx-auto max-w-[1140px] px-4 sm:px-6 lg:px-8">
                    {/* GRID UTAMA */}
                    <div className="grid gap-10 md:gap-8 lg:gap-12 md:grid-cols-12 pb-10 sm:pb-12 border-b border-[#DFC9BC]">
                        {/* ================= 1. BRAND INFO ================= */}
                        <div className="md:col-span-5 flex items-start gap-3.5">
                            {/* Logo */}
                            <img
                                src="/LOGO.png"
                                alt="Abu Haidar"
                                style={{
                                    filter: "brightness(0) saturate(100%) invert(18%) sepia(45%) saturate(1800%) hue-rotate(345deg) brightness(85%) contrast(100%)",
                                }}
                                className="h-11 sm:h-12 w-auto object-contain drop-shadow-2xs shrink-0 mt-0.5"
                            />

                            {/* Garis Pembatas Vertikal */}
                            <div className="h-8 w-[2px] bg-[#143325]/40 shrink-0 mt-1"></div>

                            {/* Kontainer Teks: Judul + Deskripsi */}
                            <div className="flex flex-col min-w-0">
                                <div className="font-brand text-[19px] sm:text-[21px] font-extrabold text-[#143325] leading-none tracking-tight">
                                    Abu Haidar
                                </div>
                                <div className="mt-1 text-[8.5px] sm:text-[9.5px] font-bold tracking-[0.18em] text-[#6E3E26] uppercase">
                                    Media Islam & Dakwah
                                </div>

                                {/* Deskripsi */}
                                <p className="mt-3.5 text-[13px] sm:text-[13.5px] text-[#3A1C12] font-medium leading-relaxed max-w-sm">
                                    Media dakwah dan risalah Islam terpercaya
                                    yang menyajikan pembahasan seputar
                                    Al-Qur'an, hadis shahih, akidah, fiqih
                                    ibadah, dan panduan amalan harian seorang
                                    muslim.
                                </p>
                            </div>
                        </div>

                        {/* ================= 2. TAUTAN CEPAT ================= */}
                        <div className="md:col-span-3 pl-[calc(2.75rem+3.5px+2px+0.875rem)] md:pl-0">
                            <h4 className="text-[13px] sm:text-[13.5px] font-extrabold tracking-[0.16em] uppercase text-[#143325] mb-3.5 flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-[#143325]"></span>
                                Tautan Cepat
                            </h4>
                            <ul className="space-y-2.5 text-[13px] sm:text-[13.5px]">
                                <li>
                                    <Link
                                        href="/home"
                                        className="text-[#3A1C12] hover:text-[#143325] hover:translate-x-1 font-semibold transition-all inline-flex items-center gap-1.5"
                                    >
                                        <span className="text-[#6E3E26] font-bold text-xs">
                                            ›
                                        </span>
                                        Beranda Utama
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/artikel"
                                        className="text-[#3A1C12] hover:text-[#143325] hover:translate-x-1 font-semibold transition-all inline-flex items-center gap-1.5"
                                    >
                                        <span className="text-[#6E3E26] font-bold text-xs">
                                            ›
                                        </span>
                                        Semua Artikel Kajian
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/ebook"
                                        className="text-[#3A1C12] hover:text-[#143325] hover:translate-x-1 font-semibold transition-all inline-flex items-center gap-1.5"
                                    >
                                        <span className="text-[#6E3E26] font-bold text-xs">
                                            ›
                                        </span>
                                        E-Book PDF
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* ================= 3. SALURAN MEDIA DAKWAH ================= */}
                        <div className="md:col-span-4 pl-[calc(2.75rem+3.5px+2px+0.875rem)] md:pl-0">
                            <h4 className="text-[13px] sm:text-[13.5px] font-extrabold tracking-[0.16em] uppercase text-[#143325] mb-3.5 flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-[#143325]"></span>
                                Saluran Media Dakwah
                            </h4>
                            <p className="text-[12.5px] sm:text-[13px] text-[#3A1C12] font-medium mb-4 leading-relaxed">
                                Ikuti siaran kajian, update naskah ilmiah, dan
                                faidah harian melalui saluran resmi kami:
                            </p>

                            <div className="flex items-center gap-3">
                                <a
                                    href="https://youtube.com/SHOLATTV"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FAF1E8] border border-[#DFC9BC] text-[#143325] shadow-xs transition-all duration-300 hover:bg-[#FF0000] hover:text-white hover:border-[#FF0000] hover:-translate-y-0.5 hover:shadow-md"
                                    aria-label="YouTube"
                                >
                                    <FaYoutube size={17} />
                                </a>
                                <a
                                    href="https://instagram.com/sholat.tv"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FAF1E8] border border-[#DFC9BC] text-[#143325] shadow-xs transition-all duration-300 hover:bg-[#E4405F] hover:text-white hover:border-[#E4405F] hover:-translate-y-0.5 hover:shadow-md"
                                    aria-label="Instagram"
                                >
                                    <FaInstagram size={17} />
                                </a>
                                <a
                                    href="https://facebook.com/sholattv"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FAF1E8] border border-[#DFC9BC] text-[#143325] shadow-xs transition-all duration-300 hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] hover:-translate-y-0.5 hover:shadow-md"
                                    aria-label="Facebook"
                                >
                                    <FaFacebookF size={16} />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* ================= 4. COPYRIGHT & ATTRIBUTION ================= */}
                    <div className="mt-6 sm:mt-8 flex flex-col md:flex-row items-center justify-between gap-3.5 text-center md:text-left text-[11px] sm:text-[11.5px] text-[#4A2619] font-medium">
                        {/* Sisi Kiri: Hak Cipta */}
                        <p className="sm:pl-[calc(2.75rem+0.875rem+2px)] md:pl-[calc(3rem+0.875rem+2px)] transition-all">
                            © 2026{" "}
                            <span className="font-bold text-[#143325]">
                                Abu Haidar
                            </span>
                            . Hak Cipta Dilindungi.
                        </p>

                        {/* Sisi Kanan: Keterangan Klien & Badge Inisial CM */}
                        <div className="flex flex-wrap items-center justify-center md:justify-end gap-2 text-[11px] sm:text-[11.5px]">
                            <span>Media Resmi</span>
                            <span className="font-extrabold text-[#143325]">
                                Abu Haidar Official
                            </span>
                            <span className="text-[#DFC9BC]">•</span>
                            <span>Dikembangkan oleh</span>

                            {/* Monogram Badge CM + Nama Pengembang */}
                            <a
                                href="https://cv-charismaulanasa.web.id/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group inline-flex items-center gap-1.5px-2 py-0.5 font-bold text-[#143325] shadow-2xs transition-all hover:border-[#143325] hover:bg-[#F2E2D5] hover:shadow-xs"
                                title="Kunjungi Profil Pengembang"
                            >
                                {/* Logo Monogram CM */}
                                <span className="flex h-4 w-4 items-center justify-center rounded-md bg-[#143325] font-brand text-[8.5px] font-extrabold tracking-tighter text-[#F7EAE0] transition-colors group-hover:bg-[#5E3122]">
                                    CM
                                </span>
                            </a>
                        </div>
                    </div>
                </div>
            </footer>

            {/* ================= BOTTOM BAR MOBILE & TABLET (< lg) ================= */}
            <div className="lg:hidden fixed bottom-4 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
                <nav className="pointer-events-auto w-full max-w-[360px] rounded-full border border-white/70 bg-white/75 px-3 py-2 shadow-[0_8px_32px_0_rgba(94,49,34,0.12)] backdrop-blur-xl transition-all duration-300">
                    <div className="flex items-center justify-between">
                        {/* 1. BERANDA */}
                        <Link
                            href="/home"
                            className={`relative flex flex-1 flex-col items-center justify-center gap-1 rounded-full py-1.5 transition-all duration-300 ${
                                url === "/home" || url === "/"
                                    ? "bg-[#1D4533] text-[#F7EAE0] shadow-xs"
                                    : "text-[#5E3122]/70 hover:text-[#1D4533] active:scale-95"
                            }`}
                        >
                            <HomeIcon
                                size={17}
                                strokeWidth={
                                    url === "/home" || url === "/" ? 2.5 : 2
                                }
                            />
                            <span className="text-[10px] font-semibold leading-none tracking-tight">
                                Beranda
                            </span>
                        </Link>

                        {/* 2. ARTIKEL */}
                        <Link
                            href="/artikel"
                            className={`relative flex flex-1 flex-col items-center justify-center gap-1 rounded-full py-1.5 transition-all duration-300 ${
                                url.startsWith("/artikel")
                                    ? "bg-[#1D4533] text-[#F7EAE0] shadow-xs"
                                    : "text-[#5E3122]/70 hover:text-[#1D4533] active:scale-95"
                            }`}
                        >
                            <BookOpen
                                size={17}
                                strokeWidth={
                                    url.startsWith("/artikel") ? 2.5 : 2
                                }
                            />
                            <span className="text-[10px] font-semibold leading-none tracking-tight">
                                Artikel
                            </span>
                        </Link>

                        {/* 3. E-BOOK */}
                        <Link
                            href="/ebook"
                            className={`relative flex flex-1 flex-col items-center justify-center gap-1 rounded-full py-1.5 transition-all duration-300 ${
                                url.startsWith("/ebook")
                                    ? "bg-[#1D4533] text-[#F7EAE0] shadow-xs"
                                    : "text-[#5E3122]/70 hover:text-[#1D4533] active:scale-95"
                            }`}
                        >
                            <FileText
                                size={17}
                                strokeWidth={url.startsWith("/ebook") ? 2.5 : 2}
                            />
                            <span className="text-[10px] font-semibold leading-none tracking-tight">
                                E-Book
                            </span>
                        </Link>
                    </div>
                </nav>
            </div>

            {/* MODAL LOGIN */}
            <LoginModal
                isOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
            />
        </div>
    );
}
