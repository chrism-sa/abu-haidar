import React from "react";
import { Head, Link } from "@inertiajs/react";
import {
    LogOut,
    Tags,
    FileText,
    Home,
    Users,
    ArrowRight,
    BookDown,
    ShieldCheck,
    Database,
    Sparkles,
    HeartHandshake,
} from "lucide-react";
import { motion } from "framer-motion";

interface DashboardProps {
    auth: {
        user: {
            name: string;
            email: string;
        };
    };
    db_status?: boolean;
}

export default function Dashboard({ auth, db_status = true }: DashboardProps) {
    const currentYear = new Date().getFullYear();

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 15 },
        show: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.4, ease: "easeOut" },
        },
    };

    return (
        <div className="flex min-h-screen flex-col justify-between bg-[#F7EAE0] text-[#5E3122] selection:bg-[#1D4533] selection:text-[#F7EAE0]">
            <Head title="Dashboard Admin - Abu Haidar" />

            <div>
                {/* ================= HEADER ================= */}
                <header className="sticky top-0 z-30 border-b border-[#F9D2BA] bg-[#F7EAE0]/95 backdrop-blur-md shadow-xs">
                    <div className="mx-auto flex max-w-[1140px] items-center justify-between px-4 sm:px-6 lg:px-0 py-3.5 sm:py-4">
                        {/* Brand Info */}
                        <Link
                            href="/home"
                            className="flex shrink-0 items-center gap-2.5 sm:gap-3.5 rounded-full border border-[#F9D2BA] bg-white px-3 sm:px-4 py-1.5 sm:py-2 shadow-sm backdrop-blur-md transition-all duration-300 hover:scale-[1.02] hover:border-[#1D4533]/50 hover:shadow-md"
                        >
                            {/* Logo Kaligrafi (Tanpa background bulat agar emas gradasi terlihat murni & kontras) */}
                            <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center">
                                <img
                                    src="/LOGO.png"
                                    alt="Abu Haidar"
                                    style={{
                                        filter: "brightness(0) saturate(100%) invert(20%) sepia(35%) saturate(1600%) hue-rotate(345deg) brightness(90%) contrast(92%)",
                                    }}
                                    className="h-12 sm:h-14 w-auto drop-shadow-sm"
                                />
                            </div>

                            {/* Teks Brand (Aktif di Mobile & Desktop) */}
                            <div className="pr-1.5 sm:pr-3 flex flex-col justify-center">
                                <div className="font-brand text-[15px] sm:text-[19px] font-bold leading-none tracking-tight text-[#1D4533]">
                                    Dashboard Admin
                                </div>
                                <div className="mt-0.5 sm:mt-1 text-[8px] sm:text-[9.5px] font-bold tracking-[0.08em] sm:tracking-[0.12em] text-[#5E3122] uppercase">
                                    Portal Dakwah Abu Haidar
                                </div>
                            </div>
                        </Link>

                        {/* Tombol Navigasi Header */}
                        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                            <Link
                                href="/home"
                                className="flex items-center gap-1.5 rounded-full border border-[#F9D2BA] bg-white px-3.5 sm:px-4 py-2 text-[11px] sm:text-[12px] font-bold text-[#5E3122] transition hover:bg-[#F9D2BA]/30 shadow-2xs"
                            >
                                <Home size={14} className="text-[#1D4533]" />
                                <span className="hidden sm:inline">
                                    Website Publik
                                </span>
                            </Link>

                            <Link
                                href="/logout"
                                method="post"
                                as="button"
                                onSuccess={() => {
                                    window.location.href = "/home";
                                }}
                                className="flex items-center gap-1.5 rounded-full bg-red-50 border border-red-200 px-3.5 sm:px-4 py-2 text-[11px] sm:text-[12px] font-bold text-red-600 transition hover:bg-red-100 shadow-2xs cursor-pointer"
                            >
                                <LogOut size={14} />
                                <span className="hidden sm:inline">Keluar</span>
                            </Link>
                        </div>
                    </div>
                </header>

                {/* ================= MAIN CONTENT ================= */}
                <main className="mx-auto max-w-[1140px] px-4 sm:px-6 lg:px-0 pt-6 sm:pt-10 pb-12">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        className="space-y-6 sm:space-y-8"
                    >
                        {/* 1. KARTU SAPAAN (HERO BANNER) */}
                        <motion.div
                            variants={itemVariants}
                            className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#1D4533] via-[#1A4130] to-[#143325] p-6 sm:p-8 md:p-10 text-[#F7EAE0] shadow-md border border-[#F9D2BA]/30"
                        >
                            <div className="absolute -right-16 -top-16 h-48 w-48 sm:h-64 sm:w-64 rounded-full bg-white/5 blur-2xl pointer-events-none" />
                            <div className="absolute -left-10 -bottom-10 h-32 w-32 sm:h-40 sm:w-40 rounded-full bg-[#F9D2BA]/10 blur-xl pointer-events-none" />

                            <div className="relative z-10">
                                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold tracking-wide uppercase text-[#F9D2BA] backdrop-blur-xs mb-3">
                                    <Sparkles size={12} />
                                    <span>Pusat Kendali Portal</span>
                                </div>
                                <h2 className="font-brand text-[22px] sm:text-[28px] md:text-[32px] font-bold leading-snug tracking-tight text-white">
                                    Ahlan wa Sahlan, {auth.user.name}!
                                </h2>
                                <p className="mt-2 text-[13px] sm:text-[14px] md:text-[15px] text-[#F7EAE0]/90 leading-relaxed max-w-3xl">
                                    Kelola semua artikel kajian sunnah, e-book
                                    risalah PDF, pembagian kategori, dan
                                    otoritas pengguna secara aman dan
                                    terstruktur.
                                </p>
                            </div>
                        </motion.div>

                        {/* 2. GRID MENU UTAMA (4 KARTU) */}
                        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                            {/* KARTU KELOLA ARTIKEL */}
                            <motion.div
                                variants={itemVariants}
                                className="h-full"
                            >
                                <Link
                                    href="/admin/articles"
                                    className="group flex h-full flex-col justify-between rounded-2xl border border-[#F9D2BA] bg-white p-5 sm:p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-[#1D4533] hover:shadow-lg"
                                >
                                    <div>
                                        <div className="mb-4 inline-flex rounded-xl bg-[#F7EAE0] p-3 text-[#1D4533] transition-colors duration-300 group-hover:bg-[#1D4533] group-hover:text-[#F7EAE0]">
                                            <FileText size={22} />
                                        </div>
                                        <h3 className="font-brand text-[16px] sm:text-[17px] font-bold text-[#1D4533]">
                                            Kelola Artikel
                                        </h3>
                                        <p className="mt-1.5 text-[12px] text-[#5E3122]/70 leading-relaxed">
                                            Tulis materi baru, sunting tafsir
                                            ayat, serta pratinjau layout web
                                            publik.
                                        </p>
                                    </div>
                                    <div className="mt-5 flex items-center text-[12px] font-bold text-[#1D4533] group-hover:text-[#5E3122]">
                                        Buka Artikel{" "}
                                        <ArrowRight
                                            size={14}
                                            className="ml-1.5 transition-transform group-hover:translate-x-1"
                                        />
                                    </div>
                                </Link>
                            </motion.div>

                            {/* KARTU KELOLA E-BOOK & PDF */}
                            <motion.div
                                variants={itemVariants}
                                className="h-full"
                            >
                                <Link
                                    href="/admin/ebooks"
                                    className="group flex h-full flex-col justify-between rounded-2xl border border-[#F9D2BA] bg-white p-5 sm:p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-[#1D4533] hover:shadow-lg"
                                >
                                    <div>
                                        <div className="mb-4 inline-flex rounded-xl bg-[#F7EAE0] p-3 text-[#1D4533] transition-colors duration-300 group-hover:bg-[#1D4533] group-hover:text-[#F7EAE0]">
                                            <BookDown size={22} />
                                        </div>
                                        <h3 className="font-brand text-[16px] sm:text-[17px] font-bold text-[#1D4533]">
                                            Kelola E-Book PDF
                                        </h3>
                                        <p className="mt-1.5 text-[12px] text-[#5E3122]/70 leading-relaxed">
                                            Unggah file PDF risalah ilmiah, buku
                                            saku dakwah, dan modul kajian
                                            gratis.
                                        </p>
                                    </div>
                                    <div className="mt-5 flex items-center text-[12px] font-bold text-[#1D4533] group-hover:text-[#5E3122]">
                                        Kelola PDF{" "}
                                        <ArrowRight
                                            size={14}
                                            className="ml-1.5 transition-transform group-hover:translate-x-1"
                                        />
                                    </div>
                                </Link>
                            </motion.div>

                            {/* KARTU KELOLA KATEGORI */}
                            <motion.div
                                variants={itemVariants}
                                className="h-full"
                            >
                                <Link
                                    href="/admin/categories"
                                    className="group flex h-full flex-col justify-between rounded-2xl border border-[#F9D2BA] bg-white p-5 sm:p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-[#1D4533] hover:shadow-lg"
                                >
                                    <div>
                                        <div className="mb-4 inline-flex rounded-xl bg-[#F7EAE0] p-3 text-[#1D4533] transition-colors duration-300 group-hover:bg-[#1D4533] group-hover:text-[#F7EAE0]">
                                            <Tags size={22} />
                                        </div>
                                        <h3 className="font-brand text-[16px] sm:text-[17px] font-bold text-[#1D4533]">
                                            Kelola Kategori
                                        </h3>
                                        <p className="mt-1.5 text-[12px] text-[#5E3122]/70 leading-relaxed">
                                            Kelompokkan topik kajian (Fiqih,
                                            Aqidah, Tafsir, Sirah) agar tersusun
                                            rapi.
                                        </p>
                                    </div>
                                    <div className="mt-5 flex items-center text-[12px] font-bold text-[#1D4533] group-hover:text-[#5E3122]">
                                        Atur Kategori{" "}
                                        <ArrowRight
                                            size={14}
                                            className="ml-1.5 transition-transform group-hover:translate-x-1"
                                        />
                                    </div>
                                </Link>
                            </motion.div>

                            {/* KARTU KELOLA PENGGUNA */}
                            <motion.div
                                variants={itemVariants}
                                className="h-full"
                            >
                                <Link
                                    href="/admin/users"
                                    className="group flex h-full flex-col justify-between rounded-2xl border border-[#F9D2BA] bg-white p-5 sm:p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-[#1D4533] hover:shadow-lg"
                                >
                                    <div>
                                        <div className="mb-4 inline-flex rounded-xl bg-[#F7EAE0] p-3 text-[#1D4533] transition-colors duration-300 group-hover:bg-[#1D4533] group-hover:text-[#F7EAE0]">
                                            <Users size={22} />
                                        </div>
                                        <h3 className="font-brand text-[16px] sm:text-[17px] font-bold text-[#1D4533]">
                                            Kelola Pengguna
                                        </h3>
                                        <p className="mt-1.5 text-[12px] text-[#5E3122]/70 leading-relaxed">
                                            Kelola hak akses administrator dan
                                            penulis konten naskah dakwah.
                                        </p>
                                    </div>
                                    <div className="mt-5 flex items-center text-[12px] font-bold text-[#1D4533] group-hover:text-[#5E3122]">
                                        Atur Pengguna{" "}
                                        <ArrowRight
                                            size={14}
                                            className="ml-1.5 transition-transform group-hover:translate-x-1"
                                        />
                                    </div>
                                </Link>
                            </motion.div>
                        </div>

                        {/* 3. WIDGET STATUS SISTEM & SERVER */}
                        <motion.div
                            variants={itemVariants}
                            className="rounded-2xl border border-[#F9D2BA] bg-white p-5 sm:p-6 shadow-xs"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#1D4533]/10 text-[#1D4533]">
                                        <ShieldCheck size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-brand text-[14px] font-bold text-[#1D4533]">
                                            Status Keamanan & Lingkungan Sistem
                                        </h4>
                                        <p className="text-[11px] text-[#5E3122]/70">
                                            Sistem beroperasi normal dengan
                                            enkripsi sesi aktif.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[11px] font-bold">
                                    <div className="flex items-center gap-1.5 rounded-lg border border-[#F9D2BA] bg-[#FDFBF9] px-3 py-1.5 text-[#1D4533]">
                                        <Database size={13} />
                                        <span>Database:</span>
                                        <span className="inline-block h-2 w-2 rounded-full bg-emerald-500"></span>
                                        <span className="text-emerald-700 font-bold">
                                            {db_status ? "Terhubung" : "Error"}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-1.5 rounded-lg border border-[#F9D2BA] bg-[#FDFBF9] px-3 py-1.5 text-[#5E3122]">
                                        <HeartHandshake
                                            size={13}
                                            className="text-[#1D4533]"
                                        />
                                        <span>Admin: {auth.user.email}</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </main>
            </div>

            {/* ================= FOOTER DASHBOARD ================= */}
            <footer className="border-t border-[#F9D2BA] bg-white/70 py-6 text-[12px] text-[#5E3122]/70">
                <div className="mx-auto flex max-w-[1140px] flex-col sm:flex-row items-center justify-between gap-3 px-4 sm:px-6 lg:px-0">
                    <div className="flex items-center gap-2">
                        <img
                            src="/LOGO.png"
                            alt="Abu Haidar"
                            className="h-5 w-auto opacity-70 grayscale hover:grayscale-0 transition"
                        />
                        <span>
                            © {currentYear}{" "}
                            <strong>Portal Dakwah Abu Haidar</strong>. All
                            rights reserved.
                        </span>
                    </div>

                    <div className="flex items-center gap-4 text-[11px] font-semibold text-[#5E3122]/80">
                        <Link
                            href="/home"
                            className="hover:text-[#1D4533] transition"
                        >
                            Beranda
                        </Link>
                        <span>•</span>
                        <Link
                            href="/ebook"
                            className="hover:text-[#1D4533] transition"
                        >
                            Pustaka E-Book
                        </Link>
                        <span>•</span>
                        <span className="rounded-md bg-[#F7EAE0] px-2 py-0.5 text-[10px] font-bold text-[#1D4533] border border-[#F9D2BA]">
                            v1.2.0 Production
                        </span>
                    </div>
                </div>
            </footer>
        </div>
    );
}
