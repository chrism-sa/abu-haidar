import { Head, Link } from "@inertiajs/react";
import { LogOut, Tags, FileText, Home, Users, ArrowRight } from "lucide-react";
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

export default function Dashboard({ auth }: DashboardProps) {
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 15 },
        show: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: "easeOut" },
        },
    };

    return (
        <div className="min-h-screen bg-[#eaf6efc0] text-[#17251f] selection:bg-[#0F4C3A] selection:text-white pb-12">
            <Head title="Dashboard Admin - Abu Haidar" />

            {/* ================= HEADER ================= */}
            <header className="sticky top-0 z-30 border-b border-[#E8E6E1] bg-white/90 backdrop-blur-md shadow-xs">
                <div className="mx-auto flex max-w-[1140px] items-center justify-between px-4 sm:px-6 lg:px-0 py-3.5 sm:py-4">
                    {/* Brand Info */}
                    <div className="flex items-center gap-3 min-w-0">
                        <img
                            src="/LOGO.png"
                            alt="Abu Haidar"
                            className="h-9 sm:h-10 w-auto shrink-0 drop-shadow-sm"
                        />
                        <div className="min-w-0">
                            <h1 className="font-brand text-[15px] sm:text-[17px] font-bold text-[#0F4C3A] leading-tight truncate">
                                Dashboard Admin
                            </h1>
                            <p className="text-[9px] sm:text-[10px] uppercase tracking-wider text-[#6C857A] font-semibold mt-0.5 truncate">
                                AbuHaidarArema.com
                            </p>
                        </div>
                    </div>

                    {/* Tombol Navigasi Header */}
                    <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                        <Link
                            href="/home"
                            className="flex items-center gap-1.5 rounded-full border border-[#E8E6E1] bg-white px-3 sm:px-4 py-2 text-[11px] sm:text-[12px] font-bold text-[#17251f] transition hover:bg-[#F4F4F0] shadow-2xs"
                        >
                            <Home size={14} className="text-[#0F4C3A]" />
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
                            className="flex items-center gap-1.5 rounded-full bg-red-50 px-3 sm:px-4 py-2 text-[11px] sm:text-[12px] font-bold text-red-600 transition hover:bg-red-100 shadow-2xs"
                        >
                            <LogOut size={14} />
                            <span className="hidden sm:inline">Keluar</span>
                        </Link>
                    </div>
                </div>
            </header>

            {/* ================= MAIN CONTENT ================= */}
            <main className="mx-auto max-w-[1140px] px-4 sm:px-6 lg:px-0 pt-6 sm:pt-10">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="space-y-6 sm:space-y-8"
                >
                    {/* 1. KARTU SAPAAN (WELCOME BANNER) */}
                    <motion.div
                        variants={itemVariants}
                        className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#0F4C3A] via-[#0D4434] to-[#0A382A] p-6 sm:p-8 md:p-10 text-white shadow-md"
                    >
                        <div className="absolute -right-16 -top-16 h-48 w-48 sm:h-64 sm:w-64 rounded-full bg-white/5 blur-2xl pointer-events-none" />
                        <div className="absolute -left-10 -bottom-10 h-32 w-32 sm:h-40 sm:w-40 rounded-full bg-[#C5A059]/10 blur-xl pointer-events-none" />

                        <div className="relative z-10">
                            <h2 className="font-brand text-[22px] sm:text-[28px] md:text-[32px] font-bold leading-snug tracking-tight">
                                Ahlan wa Sahlan, {auth.user.name}! ✨
                            </h2>
                            <p className="mt-2 sm:mt-3 text-[13px] sm:text-[14px] md:text-[15px] text-white/80 leading-relaxed max-w-3xl">
                                Selamat datang di pusat kendali portal dakwah
                                Abu Haidar. Kelola semua artikel kajian ilmiah,
                                label topik, dan akses penulis secara terpusat.
                            </p>
                        </div>
                    </motion.div>

                    {/* 2. GRID MENU CARDS */}
                    <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                        {/* KARTU KELOLA ARTIKEL */}
                        <motion.div variants={itemVariants} className="h-full">
                            <Link
                                href="/admin/articles"
                                className="group flex h-full flex-col justify-between rounded-2xl border border-[#E8E6E1] bg-white p-5 sm:p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-[#0F4C3A]/40 hover:shadow-lg"
                            >
                                <div>
                                    <div className="mb-4 inline-flex rounded-xl bg-[#F4F8F6] p-3 text-[#0F4C3A] transition-colors duration-300 group-hover:bg-[#0F4C3A] group-hover:text-white">
                                        <FileText size={22} />
                                    </div>
                                    <h3 className="font-brand text-[17px] sm:text-[18px] font-bold text-[#162B22]">
                                        Kelola Artikel Kajian
                                    </h3>
                                    <p className="mt-1.5 text-[13px] text-[#6C857A] leading-relaxed">
                                        Tulis artikel dakwah baru, sunting
                                        naskah, atur gambar utama, dan status
                                        publikasi.
                                    </p>
                                </div>
                                <div className="mt-5 flex items-center text-[12px] font-bold text-[#0F4C3A] group-hover:text-[#0A382A]">
                                    Buka Editor{" "}
                                    <ArrowRight
                                        size={14}
                                        className="ml-1.5 transition-transform group-hover:translate-x-1"
                                    />
                                </div>
                            </Link>
                        </motion.div>

                        {/* KARTU KELOLA KATEGORI */}
                        <motion.div variants={itemVariants} className="h-full">
                            <Link
                                href="/admin/categories"
                                className="group flex h-full flex-col justify-between rounded-2xl border border-[#E8E6E1] bg-white p-5 sm:p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-[#0F4C3A]/40 hover:shadow-lg"
                            >
                                <div>
                                    <div className="mb-4 inline-flex rounded-xl bg-[#F4F8F6] p-3 text-[#0F4C3A] transition-colors duration-300 group-hover:bg-[#0F4C3A] group-hover:text-white">
                                        <Tags size={22} />
                                    </div>
                                    <h3 className="font-brand text-[17px] sm:text-[18px] font-bold text-[#162B22]">
                                        Kelola Kategori
                                    </h3>
                                    <p className="mt-1.5 text-[13px] text-[#6C857A] leading-relaxed">
                                        Kelompokkan topik kajian (seperti Fiqih,
                                        Aqidah, Tafsir) agar materi tersusun
                                        rapi.
                                    </p>
                                </div>
                                <div className="mt-5 flex items-center text-[12px] font-bold text-[#0F4C3A] group-hover:text-[#0A382A]">
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
                            className="h-full sm:col-span-2 lg:col-span-1"
                        >
                            <Link
                                href="/admin/users"
                                className="group flex h-full flex-col justify-between rounded-2xl border border-[#E8E6E1] bg-white p-5 sm:p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-[#0F4C3A]/40 hover:shadow-lg"
                            >
                                <div>
                                    <div className="mb-4 inline-flex rounded-xl bg-[#F4F8F6] p-3 text-[#0F4C3A] transition-colors duration-300 group-hover:bg-[#0F4C3A] group-hover:text-white">
                                        <Users size={22} />
                                    </div>
                                    <h3 className="font-brand text-[17px] sm:text-[18px] font-bold text-[#162B22]">
                                        Kelola Pengguna
                                    </h3>
                                    <p className="mt-1.5 text-[13px] text-[#6C857A] leading-relaxed">
                                        Atur akun administrator, tambah penulis
                                        baru, atau ganti kata sandi akses
                                        sistem.
                                    </p>
                                </div>
                                <div className="mt-5 flex items-center text-[12px] font-bold text-[#0F4C3A] group-hover:text-[#0A382A]">
                                    Atur Pengguna{" "}
                                    <ArrowRight
                                        size={14}
                                        className="ml-1.5 transition-transform group-hover:translate-x-1"
                                    />
                                </div>
                            </Link>
                        </motion.div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
