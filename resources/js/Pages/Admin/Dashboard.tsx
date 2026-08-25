import React from "react";
import { Link } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import {
    Tags,
    FileText,
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
        <AdminLayout title="Dashboard Admin">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="space-y-5 sm:space-y-6 md:space-y-8"
            >
                {/* 1. KARTU SAPAAN (HERO BANNER) */}
                <motion.div
                    variants={itemVariants}
                    className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#1D4533] via-[#1A4130] to-[#143325] p-5 sm:p-7 md:p-9 text-[#F7EAE0] shadow-md border border-[#E8CEBC]/30"
                >
                    <div className="absolute -right-16 -top-16 h-48 w-48 sm:h-64 sm:w-64 rounded-full bg-white/5 blur-2xl pointer-events-none" />
                    <div className="absolute -left-10 -bottom-10 h-32 w-32 sm:h-40 sm:w-40 rounded-full bg-[#E8CEBC]/10 blur-xl pointer-events-none" />

                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full bg-white/10 px-2.5 sm:px-3 py-1 text-[10px] sm:text-[11px] font-bold tracking-wide uppercase text-[#F7EAE0] backdrop-blur-xs mb-2.5 sm:mb-3">
                            <Sparkles size={12} />
                            <span>Pusat Kendali Portal</span>
                        </div>
                        <h2 className="font-brand text-[20px] sm:text-[26px] md:text-[30px] font-bold leading-tight tracking-tight text-white">
                            Ahlan wa Sahlan, {auth.user.name}!
                        </h2>
                        <p className="mt-2 text-[12.5px] sm:text-[13.5px] md:text-[14.5px] text-[#F7EAE0]/90 leading-relaxed max-w-3xl">
                            Kelola semua artikel kajian sunnah, e-book risalah
                            PDF, pembagian kategori, dan otoritas pengguna
                            secara aman dan terstruktur.
                        </p>
                    </div>
                </motion.div>

                {/* 2. GRID MENU UTAMA (1 col Mobile, 2 col Tablet/1027px, 4 col Desktop) */}
                <div className="grid gap-3.5 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                    {/* KARTU KELOLA ARTIKEL */}
                    <motion.div variants={itemVariants} className="h-full">
                        <Link
                            href="/admin/articles"
                            className="group flex h-full flex-col justify-between rounded-2xl border border-[#E8CEBC] bg-[#FDF9F5] p-4 sm:p-5 md:p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-[#1D4533] hover:shadow-lg"
                        >
                            <div>
                                <div className="mb-3.5 inline-flex rounded-xl bg-[#F2E2D5] p-2.5 sm:p-3 text-[#1D4533] transition-colors duration-300 group-hover:bg-[#1D4533] group-hover:text-[#F7EAE0]">
                                    <FileText size={20} />
                                </div>
                                <h3 className="font-brand text-[15px] sm:text-[16px] font-bold text-[#1D4533]">
                                    Kelola Artikel
                                </h3>
                                <p className="mt-1 text-[11.5px] sm:text-[12px] text-[#5E3122]/70 leading-relaxed">
                                    Tulis materi baru, sunting tafsir ayat,
                                    serta pratinjau layout web publik.
                                </p>
                            </div>
                            <div className="mt-4 pt-2 flex items-center text-[11.5px] sm:text-[12px] font-bold text-[#1D4533] group-hover:text-[#5E3122]">
                                Buka Artikel
                                <ArrowRight
                                    size={13}
                                    className="ml-1.5 transition-transform group-hover:translate-x-1"
                                />
                            </div>
                        </Link>
                    </motion.div>

                    {/* KARTU KELOLA E-BOOK & PDF */}
                    <motion.div variants={itemVariants} className="h-full">
                        <Link
                            href="/admin/ebooks"
                            className="group flex h-full flex-col justify-between rounded-2xl border border-[#E8CEBC] bg-[#FDF9F5] p-4 sm:p-5 md:p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-[#1D4533] hover:shadow-lg"
                        >
                            <div>
                                <div className="mb-3.5 inline-flex rounded-xl bg-[#F2E2D5] p-2.5 sm:p-3 text-[#1D4533] transition-colors duration-300 group-hover:bg-[#1D4533] group-hover:text-[#F7EAE0]">
                                    <BookDown size={20} />
                                </div>
                                <h3 className="font-brand text-[15px] sm:text-[16px] font-bold text-[#1D4533]">
                                    Kelola E-Book PDF
                                </h3>
                                <p className="mt-1 text-[11.5px] sm:text-[12px] text-[#5E3122]/70 leading-relaxed">
                                    Unggah file PDF risalah ilmiah, buku saku
                                    dakwah, dan modul kajian gratis.
                                </p>
                            </div>
                            <div className="mt-4 pt-2 flex items-center text-[11.5px] sm:text-[12px] font-bold text-[#1D4533] group-hover:text-[#5E3122]">
                                Kelola PDF
                                <ArrowRight
                                    size={13}
                                    className="ml-1.5 transition-transform group-hover:translate-x-1"
                                />
                            </div>
                        </Link>
                    </motion.div>

                    {/* KARTU KELOLA KATEGORI */}
                    <motion.div variants={itemVariants} className="h-full">
                        <Link
                            href="/admin/categories"
                            className="group flex h-full flex-col justify-between rounded-2xl border border-[#E8CEBC] bg-[#FDF9F5] p-4 sm:p-5 md:p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-[#1D4533] hover:shadow-lg"
                        >
                            <div>
                                <div className="mb-3.5 inline-flex rounded-xl bg-[#F2E2D5] p-2.5 sm:p-3 text-[#1D4533] transition-colors duration-300 group-hover:bg-[#1D4533] group-hover:text-[#F7EAE0]">
                                    <Tags size={20} />
                                </div>
                                <h3 className="font-brand text-[15px] sm:text-[16px] font-bold text-[#1D4533]">
                                    Kelola Kategori
                                </h3>
                                <p className="mt-1 text-[11.5px] sm:text-[12px] text-[#5E3122]/70 leading-relaxed">
                                    Kelompokkan topik kajian (Fiqih, Aqidah,
                                    Tafsir, Sirah) agar tersusun rapi.
                                </p>
                            </div>
                            <div className="mt-4 pt-2 flex items-center text-[11.5px] sm:text-[12px] font-bold text-[#1D4533] group-hover:text-[#5E3122]">
                                Atur Kategori
                                <ArrowRight
                                    size={13}
                                    className="ml-1.5 transition-transform group-hover:translate-x-1"
                                />
                            </div>
                        </Link>
                    </motion.div>

                    {/* KARTU KELOLA PENGGUNA */}
                    <motion.div variants={itemVariants} className="h-full">
                        <Link
                            href="/admin/users"
                            className="group flex h-full flex-col justify-between rounded-2xl border border-[#E8CEBC] bg-[#FDF9F5] p-4 sm:p-5 md:p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-[#1D4533] hover:shadow-lg"
                        >
                            <div>
                                <div className="mb-3.5 inline-flex rounded-xl bg-[#F2E2D5] p-2.5 sm:p-3 text-[#1D4533] transition-colors duration-300 group-hover:bg-[#1D4533] group-hover:text-[#F7EAE0]">
                                    <Users size={20} />
                                </div>
                                <h3 className="font-brand text-[15px] sm:text-[16px] font-bold text-[#1D4533]">
                                    Kelola Pengguna
                                </h3>
                                <p className="mt-1 text-[11.5px] sm:text-[12px] text-[#5E3122]/70 leading-relaxed">
                                    Kelola hak akses administrator dan penulis
                                    konten naskah dakwah.
                                </p>
                            </div>
                            <div className="mt-4 pt-2 flex items-center text-[11.5px] sm:text-[12px] font-bold text-[#1D4533] group-hover:text-[#5E3122]">
                                Atur Pengguna
                                <ArrowRight
                                    size={13}
                                    className="ml-1.5 transition-transform group-hover:translate-x-1"
                                />
                            </div>
                        </Link>
                    </motion.div>
                </div>

                {/* 3. WIDGET STATUS SISTEM & SERVER */}
                <motion.div
                    variants={itemVariants}
                    className="rounded-2xl border border-[#E8CEBC] bg-[#FDF9F5] p-4 sm:p-5 md:p-6 shadow-xs"
                >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-[#1D4533]/10 text-[#1D4533]">
                                <ShieldCheck size={18} />
                            </div>
                            <div className="min-w-0">
                                <h4 className="font-brand text-[13px] sm:text-[14px] font-bold text-[#1D4533]">
                                    Status Keamanan & Lingkungan Sistem
                                </h4>
                                <p className="text-[11px] text-[#5E3122]/70">
                                    Sistem beroperasi normal dengan enkripsi
                                    sesi aktif.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 text-[10.5px] sm:text-[11px] font-bold">
                            <div className="flex items-center gap-1.5 rounded-lg border border-[#E8CEBC] bg-[#FAF3EB] px-2.5 sm:px-3 py-1.5 text-[#1D4533]">
                                <Database size={13} />
                                <span>Database:</span>
                                <span className="inline-block h-2 w-2 rounded-full bg-emerald-500"></span>
                                <span className="text-emerald-700 font-bold">
                                    {db_status ? "Terhubung" : "Error"}
                                </span>
                            </div>

                            <div className="flex items-center gap-1.5 rounded-lg border border-[#E8CEBC] bg-[#FAF3EB] px-2.5 sm:px-3 py-1.5 text-[#5E3122] max-w-full">
                                <HeartHandshake
                                    size={13}
                                    className="text-[#1D4533] shrink-0"
                                />
                                <span className="truncate">
                                    Admin: {auth.user.email}
                                </span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AdminLayout>
    );
}
