import { Head, Link } from "@inertiajs/react";
import {
    LayoutDashboard,
    LogOut,
    Tags,
    FileText,
    Home,
    Users, // Tambahkan ikon Users
    ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";

interface DashboardProps {
    auth: {
        user: {
            name: string;
            email: string;
        };
    };
    db_status?: boolean; // Prop ini bisa diabaikan jika tidak dipakai lagi
}

export default function Dashboard({ auth }: DashboardProps) {
    // Konfigurasi Animasi Framer Motion
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15, // Jeda kemunculan antar elemen
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { 
            opacity: 1, 
            y: 0, 
            transition: { duration: 0.6, ease: "easeOut" } 
        },
    };

    return (
        <div className="min-h-screen bg-[#eaf6efc0] text-[#17251f] selection:bg-[#063f2f] selection:text-white">
            <Head title="Dashboard Admin - Abu Haidar" />

            {/* HEADER STATIC - Tetap di atas */}
            <header className="sticky top-0 z-30 border-b border-[#e9e6df] bg-white/80 backdrop-blur-md">
                <div className="mx-auto flex max-w-[1140px] items-center justify-between px-5 py-4 lg:px-0">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl text-white font-serif font-bold">
                            <img
                                src="/LOGO.png"
                                alt="Abu Haidar"
                                className="h-9 w-auto"
                            />
                        </div>
                        <div>
                            <h1 className="font-serif text-[16px] font-bold text-[#FFFOOO]">
                                Dashboard Admin
                            </h1>
                            <p className="text-[10px] uppercase tracking-wider text-[#0F4C3A] font-bold mt-0.5">
                                Portal Dakwah Abu Haidar
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href="/home"
                            className="flex items-center gap-1.5 rounded-lg border border-[#e8e4da] bg-white px-4 py-2 text-[12px] font-bold text-[#17251f] transition hover:bg-[#faf7f0] hover:border-[#dcd7ce]"
                        >
                            <Home size={14} /> Website Publik
                        </Link>

                        <Link
                            href="/logout"
                            method="post"
                            as="button"
                            onSuccess={() => {
                                window.location.href = "/home";
                            }}
                            className="flex items-center gap-1.5 rounded-lg bg-red-50 px-4 py-2 text-[12px] font-bold text-red-600 transition hover:bg-red-100"
                        >
                            <LogOut size={14} /> Keluar
                        </Link>
                    </div>
                </div>
            </header>

            {/* MAIN CONTENT DENGAN ANIMASI */}
            <main className="mx-auto max-w-[1140px] px-5 py-10 lg:px-0">
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="space-y-8"
                >
                    {/* 1. KARTU SAPAAN (WELCOME BANNER) */}
                    <motion.div 
                        variants={itemVariants}
                        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#063f2f] to-[#0a5c45] p-8 md:p-10 text-white shadow-lg"
                    >
                        {/* Aksen Dekoratif Background */}
                        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/5 blur-3xl"></div>
                        <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-white/5 blur-2xl"></div>

                        <div className="relative z-10">
                            <h2 className="font-serif text-[28px] md:text-[32px] font-bold leading-tight">
                                Ahlan wa Sahlan, {auth.user.name}! ✨
                            </h2>
                            <p className="mt-3 text-[14px] md:text-[15px] text-white/80 leading-relaxed">
                                Selamat datang di pusat kendali website portal dakwah Abu Haidar. Kelola semua artikel kajian, kategori, dan akses pengguna dengan mudah, cepat, dan real-time.
                            </p>
                        </div>
                    </motion.div>

                    {/* 2. GRID MENU CARDS */}
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        
                        {/* KARTU KELOLA ARTIKEL */}
                        <motion.div variants={itemVariants} className="h-full">
                            <Link
                                href="/admin/articles" 
                                className="group flex h-full flex-col justify-between rounded-2xl border border-[#e9e6df] bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#063f2f]/30 hover:shadow-xl hover:shadow-[#063f2f]/5"
                            >
                                <div>
                                    <div className="mb-5 inline-flex rounded-xl bg-[#f4f8f6] p-3.5 text-[#063f2f] transition-colors duration-300 group-hover:bg-[#063f2f] group-hover:text-white">
                                        <FileText size={24} />
                                    </div>
                                    <h3 className="font-serif text-[18px] font-bold text-[#17251f]">
                                        Kelola Artikel Kajian
                                    </h3>
                                    <p className="mt-2 text-[13px] text-[#666] leading-relaxed">
                                        Tulis artikel dakwah baru, edit konten, kelola gambar sampul, dan atur status publikasi ke jamaah.
                                    </p>
                                </div>
                                <div className="mt-6 flex items-center text-[12px] font-bold text-[#063f2f] group-hover:text-[#0a5c45]">
                                    Buka Editor <ArrowRight size={14} className="ml-1 transition-transform group-hover:translate-x-1" />
                                </div>
                            </Link>
                        </motion.div>

                        {/* KARTU KELOLA KATEGORI */}
                        <motion.div variants={itemVariants} className="h-full">
                            <Link
                                href="/admin/categories" 
                                className="group flex h-full flex-col justify-between rounded-2xl border border-[#e9e6df] bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#063f2f]/30 hover:shadow-xl hover:shadow-[#063f2f]/5"
                            >
                                <div>
                                    <div className="mb-5 inline-flex rounded-xl bg-[#f4f8f6] p-3.5 text-[#063f2f] transition-colors duration-300 group-hover:bg-[#063f2f] group-hover:text-white">
                                        <Tags size={24} />
                                    </div>
                                    <h3 className="font-serif text-[18px] font-bold text-[#17251f]">
                                        Label & Kategori
                                    </h3>
                                    <p className="mt-2 text-[13px] text-[#666] leading-relaxed">
                                        Buat pengelompokan topik kajian (seperti Fiqih, Aqidah, Tafsir) agar jamaah lebih mudah mencari artikel.
                                    </p>
                                </div>
                                <div className="mt-6 flex items-center text-[12px] font-bold text-[#063f2f] group-hover:text-[#0a5c45]">
                                    Atur Kategori <ArrowRight size={14} className="ml-1 transition-transform group-hover:translate-x-1" />
                                </div>
                            </Link>
                        </motion.div>

                        {/* KARTU KELOLA PENGGUNA (USER) */}
                        <motion.div variants={itemVariants} className="h-full">
                            <Link
                                href="/admin/users" 
                                className="group flex h-full flex-col justify-between rounded-2xl border border-[#e9e6df] bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#063f2f]/30 hover:shadow-xl hover:shadow-[#063f2f]/5"
                            >
                                <div>
                                    <div className="mb-5 inline-flex rounded-xl bg-[#f4f8f6] p-3.5 text-[#063f2f] transition-colors duration-300 group-hover:bg-[#063f2f] group-hover:text-white">
                                        <Users size={24} />
                                    </div>
                                    <h3 className="font-serif text-[18px] font-bold text-[#17251f]">
                                        Kelola Pengguna
                                    </h3>
                                    <p className="mt-2 text-[13px] text-[#666] leading-relaxed">
                                        Atur hak akses admin, tambah penulis baru, atau ubah kata sandi untuk menjaga keamanan sistem website.
                                    </p>
                                </div>
                                <div className="mt-6 flex items-center text-[12px] font-bold text-[#063f2f] group-hover:text-[#0a5c45]">
                                    Atur Pengguna <ArrowRight size={14} className="ml-1 transition-transform group-hover:translate-x-1" />
                                </div>
                            </Link>
                        </motion.div>

                    </div>
                </motion.div>
            </main>
        </div>
    );
}