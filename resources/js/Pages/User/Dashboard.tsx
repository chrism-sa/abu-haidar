import React from "react";
import { Head, Link, router } from "@inertiajs/react";
import {
    LogOut,
    BookOpen,
    Home,
    Sparkles,
    Compass,
    ArrowRight,
    BookmarkCheck,
} from "lucide-react";
import { motion } from "framer-motion";

interface UserDashboardProps {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
            role: string;
        };
    };
}

const solidBrownLogoFilter =
    "brightness(0) saturate(100%) invert(20%) sepia(35%) saturate(1500%) hue-rotate(345deg) brightness(90%) contrast(95%)";

const appleEase = [0.16, 1, 0.3, 1];

export default function UserDashboard({ auth }: UserDashboardProps) {
    const handleLogout = () => {
        router.post("/logout");
    };

    const getInitials = (name: string) => {
        if (!name) return "U";
        return name
            .split(" ")
            .map((n) => n[0])
            .slice(0, 2)
            .join("")
            .toUpperCase();
    };

    return (
        <div className="min-h-screen bg-[#F7EAE0] text-[#5E3122] flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden selection:bg-[#1D4533] selection:text-[#F7EAE0]">
            <Head title="Beranda Jamaah - Abu Haidar" />

            {/* AMBIENT BACKGROUND GLOW ORBS */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-[15%] -left-[10%] h-[50vw] w-[50vw] max-w-[500px] max-h-[500px] rounded-full bg-gradient-to-tr from-[#1D4533] to-[#2B6149] opacity-10 blur-[80px]" />
                <div className="absolute -bottom-[15%] -right-[10%] h-[55vw] w-[55vw] max-w-[550px] max-h-[550px] rounded-full bg-gradient-to-bl from-[#F9D2BA] to-[#E5AC88] opacity-30 blur-[90px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, ease: appleEase }}
                className="relative z-10 w-full max-w-lg rounded-3xl border border-[#E8CEBC] bg-[#FDF9F5] p-6 sm:p-8 shadow-xl"
            >
                {/* HEADER LOGO & BADGE */}
                <div className="flex items-center justify-between border-b border-[#E8CEBC]/80 pb-4 mb-6">
                    <Link
                        href="/home"
                        className="flex items-center gap-2.5 group"
                    >
                        <img
                            src="/LOGO.png"
                            alt="Logo Abu Haidar"
                            style={{ filter: solidBrownLogoFilter }}
                            className="h-8 w-auto transition-transform group-hover:scale-105"
                        />
                        <div className="font-brand font-bold text-[15px] text-[#1D4533]">
                            Abu Haidar
                        </div>
                    </Link>

                    <div className="inline-flex items-center gap-1.5 rounded-full border border-[#E8CEBC] bg-[#FAF1E8] px-3 py-1 text-[10.5px] font-extrabold uppercase tracking-wider text-[#1D4533] shadow-2xs">
                        <BookmarkCheck size={12} className="text-[#8C5E43]" />
                        <span>Akun Jamaah</span>
                    </div>
                </div>

                {/* PROFILE CARD */}
                <div className="rounded-2xl border border-[#E8CEBC] bg-[#FAF1E8] p-5 mb-6 text-center relative overflow-hidden">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1D4533] text-[#F7EAE0] font-brand text-xl font-bold shadow-sm mb-3">
                        {getInitials(auth.user?.name)}
                    </div>

                    <div className="flex items-center justify-center gap-1.5 text-[11px] uppercase tracking-widest font-bold text-[#8C5E43] mb-1">
                        <Sparkles size={12} />
                        <span>Ahlan wa Sahlan</span>
                        <Sparkles size={12} />
                    </div>

                    <h1 className="font-brand text-xl sm:text-2xl font-bold text-[#1D4533] leading-tight">
                        {auth.user?.name}
                    </h1>
                    <p className="text-xs text-[#5E3122]/70 mt-1 font-medium">
                        {auth.user?.email}
                    </p>
                </div>

                {/* MENU PINTASAN */}
                <div className="space-y-2.5 mb-6">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#8C5E43] px-1">
                        Pintasan Kajian
                    </div>

                    <Link
                        href="/home"
                        className="group flex items-center justify-between rounded-2xl border border-[#E8CEBC] bg-white p-3.5 transition-all duration-200 hover:border-[#1D4533]/40 hover:bg-[#FAF1E8] hover:shadow-2xs"
                    >
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FAF1E8] border border-[#E8CEBC] text-[#1D4533] group-hover:bg-[#1D4533] group-hover:text-[#F7EAE0] transition-colors">
                                <Home size={16} />
                            </div>
                            <div>
                                <div className="font-brand text-[13.5px] font-bold text-[#1D4533]">
                                    Halaman Utama
                                </div>
                                <div className="text-[11px] text-[#5E3122]/70">
                                    Baca artikel dakwah dan mutiara hadits
                                </div>
                            </div>
                        </div>
                        <ArrowRight
                            size={15}
                            className="text-[#8C5E43] transition-transform group-hover:translate-x-1"
                        />
                    </Link>

                    <Link
                        href="/artikel"
                        className="group flex items-center justify-between rounded-2xl border border-[#E8CEBC] bg-white p-3.5 transition-all duration-200 hover:border-[#1D4533]/40 hover:bg-[#FAF1E8] hover:shadow-2xs"
                    >
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FAF1E8] border border-[#E8CEBC] text-[#1D4533] group-hover:bg-[#1D4533] group-hover:text-[#F7EAE0] transition-colors">
                                <Compass size={16} />
                            </div>
                            <div>
                                <div className="font-brand text-[13.5px] font-bold text-[#1D4533]">
                                    Katalog Artikel & Kajian
                                </div>
                                <div className="text-[11px] text-[#5E3122]/70">
                                    Telusuri kajian berdasarkan topik dan
                                    kategori
                                </div>
                            </div>
                        </div>
                        <ArrowRight
                            size={15}
                            className="text-[#8C5E43] transition-transform group-hover:translate-x-1"
                        />
                    </Link>

                    <Link
                        href="/ebook"
                        className="group flex items-center justify-between rounded-2xl border border-[#E8CEBC] bg-white p-3.5 transition-all duration-200 hover:border-[#1D4533]/40 hover:bg-[#FAF1E8] hover:shadow-2xs"
                    >
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FAF1E8] border border-[#E8CEBC] text-[#1D4533] group-hover:bg-[#1D4533] group-hover:text-[#F7EAE0] transition-colors">
                                <BookOpen size={16} />
                            </div>
                            <div>
                                <div className="font-brand text-[13.5px] font-bold text-[#1D4533]">
                                    Koleksi E-Book & Risalah PDF
                                </div>
                                <div className="text-[11px] text-[#5E3122]/70">
                                    Unduh gratis materi kajian dan buku ilmiah
                                </div>
                            </div>
                        </div>
                        <ArrowRight
                            size={15}
                            className="text-[#8C5E43] transition-transform group-hover:translate-x-1"
                        />
                    </Link>
                </div>

                {/* LOGOUT BUTTON */}
                <div className="border-t border-[#E8CEBC]/80 pt-4 flex justify-between items-center">
                    <span className="text-[11px] text-[#5E3122]/60 font-medium">
                        Sesi aktif tersimpan
                    </span>

                    <button
                        type="button"
                        onClick={handleLogout}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-100/80 border border-red-200 px-4 py-2 text-xs font-bold text-red-700 transition-all hover:bg-red-200 hover:shadow-xs cursor-pointer active:scale-95"
                    >
                        <LogOut size={14} />
                        <span>Keluar Akun</span>
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
