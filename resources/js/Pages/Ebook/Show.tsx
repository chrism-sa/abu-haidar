import React from "react";
import { Head, Link } from "@inertiajs/react";
import MainLayout from "@/Layouts/MainLayout";
import {
    ArrowLeft,
    Download,
    FileText,
    Share2,
    BookOpen,
    ExternalLink,
} from "lucide-react";
import { EbookItem } from "./Index";

interface ShowProps {
    ebook: EbookItem;
}

export default function EbookShow({ ebook }: ShowProps) {
    const handleShare = () => {
        if (navigator.share) {
            navigator
                .share({
                    title: ebook.title,
                    url: window.location.href,
                })
                .catch(() => {});
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert("Tautan risalah berhasil disalin ke clipboard!");
        }
    };

    return (
        <MainLayout title={ebook.title}>
            <Head title={`Baca: ${ebook.title} - Abu Haidar`} />

            <div className="w-full max-w-full overflow-x-hidden">
                {/* ================= HEADER & NAVIGASI ================= */}
                <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                    <Link
                        href="/ebook"
                        className="inline-flex w-fit items-center gap-2 rounded-xl border border-[#F9D2BA] bg-white px-3.5 py-2 text-[12px] sm:text-[13px] font-bold text-[#1D4533] hover:bg-[#F9D2BA]/20 transition shadow-2xs"
                    >
                        <ArrowLeft size={15} />
                        <span>Semua E-Book</span>
                    </Link>

                    {/* Tombol Aksi (Bagikan & Unduh) */}
                    <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 sm:gap-2.5 w-full sm:w-auto">
                        <button
                            type="button"
                            onClick={handleShare}
                            className="flex items-center justify-center gap-1.5 rounded-xl border border-[#F9D2BA] bg-white px-3 sm:px-4 py-2 text-[11.5px] sm:text-[12px] font-bold text-[#5E3122] hover:bg-[#F9D2BA]/30 transition shadow-2xs cursor-pointer"
                        >
                            <Share2 size={14} /> <span>Bagikan</span>
                        </button>

                        <a
                            href={ebook.file_path}
                            download
                            className="flex items-center justify-center gap-1.5 rounded-xl bg-[#1D4533] px-3.5 sm:px-5 py-2 text-[11.5px] sm:text-[12px] font-bold text-[#F7EAE0] hover:bg-[#143325] transition shadow-2xs whitespace-nowrap"
                        >
                            <Download size={14} />
                            <span>
                                Unduh PDF{" "}
                                {ebook.file_size ? `(${ebook.file_size})` : ""}
                            </span>
                        </a>
                    </div>
                </div>

                {/* ================= INFORMASI DOKUMEN ================= */}
                <div className="mb-5 sm:mb-6 rounded-2xl border border-[#F9D2BA] bg-white p-4 sm:p-6 shadow-xs">
                    <div className="flex items-center gap-1.5 text-[10.5px] sm:text-[11px] font-bold uppercase tracking-wider text-[#1D4533] mb-1.5">
                        <FileText size={14} />
                        <span>Risalah Ilmiah & Kajian</span>
                    </div>

                    <h1 className="font-brand text-[18px] sm:text-[24px] md:text-[28px] font-bold text-[#1D4533] leading-snug">
                        {ebook.title}
                    </h1>

                    {ebook.author && (
                        <p className="mt-1 text-[11px] sm:text-[12px] font-semibold text-[#8C5E43]">
                            Penulis: {ebook.author}
                        </p>
                    )}

                    {ebook.description && (
                        <p className="mt-2.5 text-[12px] sm:text-[13px] leading-relaxed text-[#5E3122]/80">
                            {ebook.description}
                        </p>
                    )}
                </div>

                {/* ================= EMBEDDED PDF VIEWER (MOBILE OPTIMIZED) ================= */}
                <div className="overflow-hidden rounded-2xl border border-[#F9D2BA] bg-white shadow-md">
                    {/* Header Toolbar Viewer */}
                    <div className="bg-[#1D4533] px-3.5 sm:px-4 py-2.5 text-[11.5px] sm:text-[12px] font-bold text-[#F7EAE0] flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 truncate">
                            <BookOpen size={14} className="shrink-0" />
                            <span className="truncate">
                                Pratinjau Dokumen PDF
                            </span>
                        </div>
                        <a
                            href={ebook.file_path}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] sm:text-[11px] text-[#F9D2BA] hover:underline shrink-0 flex items-center gap-1"
                        >
                            <span>Buka Tab Baru</span>
                            <ExternalLink size={11} />
                        </a>
                    </div>

                    {/* Frame PDF dengan Proteksi Touch & Scroll Aman */}
                    <div className="relative w-full h-[65vh] sm:h-[80vh] bg-[#525659] overflow-hidden">
                        <iframe
                            src={`${ebook.file_path}#toolbar=1&navpanes=0&scrollbar=1`}
                            title={ebook.title}
                            className="h-full w-full border-none touch-auto"
                            style={{ width: "100%", height: "100%" }}
                        />
                    </div>
                </div>

                {/* Info Tambahan Khusus Pengguna HP jika Viewer Terpotong oleh Browser Bawaan */}
                <div className="mt-3 block sm:hidden text-center">
                    <p className="text-[11px] text-[#5E3122]/60">
                        Mengalami kendala pratinjau di layar ponsel?{" "}
                        <a
                            href={ebook.file_path}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-bold text-[#1D4533] underline"
                        >
                            Buka langsung file PDF
                        </a>
                    </p>
                </div>
            </div>
        </MainLayout>
    );
}
