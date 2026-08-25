import React from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import { Home, LogOut, ArrowLeft } from "lucide-react";

interface AdminLayoutProps {
    title?: string;
    children: React.ReactNode;
}

export default function AdminLayout({
    title = "Dashboard Admin",
    children,
}: AdminLayoutProps) {
    const { url } = usePage();
    const currentYear = new Date().getFullYear();

    // Mengecek apakah sedang di halaman utama dashboard
    const isDashboardRoot =
        url === "/admin/dashboard" || url === "/admin/dashboard/";

    return (
        <div className="relative min-h-screen bg-[#F7EAE0] text-[#5E3122] flex flex-col justify-between selection:bg-[#1D4533] selection:text-[#F7EAE0]">
            <Head title={`${title} - Portal Abu Haidar`} />

            {/* BACKGROUND: FLUID GLOWING ORBS */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-[10%] -left-[10%] h-[50vw] w-[50vw] max-w-[450px] max-h-[450px] rounded-full bg-[#1D4533] opacity-[0.08] blur-[80px]" />
                <div className="absolute -bottom-[10%] -right-[10%] h-[55vw] w-[55vw] max-w-[500px] max-h-[500px] rounded-full bg-[#E8CEBC] opacity-[0.35] blur-[90px]" />
            </div>

            <div className="w-full">
                {/* ================= HEADER ADMIN ================= */}
                <header className="sticky top-0 z-40 border-b border-[#E8CEBC] bg-[#F7EAE0]/95 backdrop-blur-md shadow-2xs">
                    <div className="mx-auto max-w-[1140px] px-4 sm:px-6 lg:px-8">
                        <div className="flex h-[64px] sm:h-[74px] items-center justify-between gap-3">
                            {/* SISI KIRI HEADER */}
                            <div className="flex items-center gap-2.5 sm:gap-3">
                                {isDashboardRoot ? (
                                    /* TAMPILAN DI HALAMAN UTAMA DASHBOARD */
                                    <div className="flex shrink-0 items-center gap-2 sm:gap-3 rounded-full border border-[#E8CEBC] bg-[#FDF9F5] px-2.5 sm:px-3.5 py-1.5 shadow-2xs">
                                        <img
                                            src="/LOGO.png"
                                            alt="Abu Haidar"
                                            style={{
                                                filter: "brightness(0) saturate(100%) invert(20%) sepia(35%) saturate(1600%) hue-rotate(345deg) brightness(90%) contrast(92%)",
                                            }}
                                            className="h-8 sm:h-9 w-auto object-contain drop-shadow-2xs shrink-0"
                                        />

                                        <div className="h-5 sm:h-6 w-[1px] bg-[#5E3122]/20 shrink-0"></div>

                                        <div className="flex flex-col justify-center pr-1 sm:pr-1.5 min-w-0">
                                            <div className="font-brand text-[13px] sm:text-[15px] font-bold leading-none tracking-tight text-[#1D4533] truncate">
                                                Dashboard Admin
                                            </div>
                                            <div className="mt-0.5 text-[7px] sm:text-[8px] font-bold tracking-[0.1em] text-[#8C5E43] uppercase truncate">
                                                Portal Abu Haidar
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    /* TAMPILAN SAAT BERADA DI MENU KELOLA (HANYA TOMBOL KEMBALI) */
                                    <Link
                                        href="/admin/dashboard"
                                        className="flex items-center gap-2 rounded-full border border-[#E8CEBC] bg-[#FDF9F5] px-3.5 py-1.5 sm:py-2 text-[12px] sm:text-[13px] font-bold text-[#1D4533] shadow-2xs transition-all duration-200 hover:bg-[#F2E2D5] hover:border-[#1D4533]/40"
                                        title="Kembali ke Dashboard Utama"
                                    >
                                        <ArrowLeft size={16} />
                                        <span>Kembali ke Dashboard</span>
                                    </Link>
                                )}
                            </div>

                            {/* SISI KANAN HEADER */}
                            <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
                                <Link
                                    href="/home"
                                    className="flex items-center gap-1.5 rounded-full border border-[#E8CEBC] bg-[#FDF9F5] px-3 sm:px-3.5 py-1.5 text-[11px] sm:text-[12px] font-bold text-[#5E3122] transition hover:bg-[#F2E2D5] shadow-2xs whitespace-nowrap"
                                >
                                    <Home
                                        size={13}
                                        className="text-[#1D4533]"
                                    />
                                    <span className="hidden sm:inline">
                                        Website
                                    </span>
                                </Link>

                                <Link
                                    href="/logout"
                                    method="post"
                                    as="button"
                                    onSuccess={() => {
                                        window.location.href = "/home";
                                    }}
                                    className="flex items-center gap-1.5 rounded-full bg-red-100/70 border border-red-200/80 px-3 sm:px-3.5 py-1.5 text-[11px] sm:text-[12px] font-bold text-red-700 transition hover:bg-red-200 shadow-2xs cursor-pointer whitespace-nowrap"
                                >
                                    <LogOut size={13} />
                                    <span className="hidden sm:inline">
                                        Keluar
                                    </span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </header>

                {/* ================= MAIN CONTENT ================= */}
                <main className="relative z-10 mx-auto max-w-[1140px] px-4 sm:px-6 lg:px-8 pt-5 sm:pt-8 pb-12 w-full">
                    {children}
                </main>
            </div>

            {/* ================= FOOTER ADMIN ================= */}
            <footer className="relative z-10 mt-auto border-t border-[#E8CEBC] bg-[#FAF2EA]/90 py-5 sm:py-6 text-[11.5px] text-[#5E3122]/70">
                <div className="mx-auto flex max-w-[1140px] flex-col lg:flex-row items-center justify-between gap-3 sm:gap-4 px-4 sm:px-6 lg:px-8 text-center lg:text-left">
                    {/* Sisi Kiri: Logo + Copyright */}
                    <div className="flex items-center justify-center gap-2">
                        <img
                            src="/LOGO.png"
                            alt="Abu Haidar"
                            className="h-4 sm:h-5 w-auto opacity-70 grayscale transition hover:grayscale-0 shrink-0"
                        />
                        <p className="whitespace-nowrap">
                            © {currentYear}{" "}
                            <strong>Portal Dakwah Abu Haidar</strong>. All
                            rights reserved.
                        </p>
                    </div>

                    {/* Sisi Kanan: Tautan Navigasi + Badge Versi */}
                    <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-[11px] font-semibold text-[#5E3122]/80">
                        <Link
                            href="/home"
                            className="transition hover:text-[#1D4533] whitespace-nowrap"
                        >
                            Beranda
                        </Link>
                        <span className="text-[#E8CEBC]">•</span>
                        <Link
                            href="/artikel"
                            className="transition hover:text-[#1D4533] whitespace-nowrap"
                        >
                            Pustaka Artikel
                        </Link>
                        <span className="text-[#E8CEBC]">•</span>
                        <Link
                            href="/ebook"
                            className="transition hover:text-[#1D4533] whitespace-nowrap"
                        >
                            Pustaka E-Book
                        </Link>
                        <span className="rounded-md bg-[#F2E2D5] px-2 py-0.5 text-[10px] font-bold text-[#1D4533] border border-[#E8CEBC] whitespace-nowrap ml-1">
                            v1.2.0 Production
                        </span>
                    </div>
                </div>
            </footer>
        </div>
    );
}
