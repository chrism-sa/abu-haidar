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
import toast from "react-hot-toast";

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
            toast.success("Tautan risalah disalin ke clipboard!");
        }
    };

    return (
        <MainLayout title={ebook.title}>
            <Head title={`Baca: ${ebook.title} - Abu Haidar`} />

            <div className="mx-auto max-w-[1140px] px-4 sm:px-6 lg:px-8 py-6 sm:py-10 w-full overflow-x-hidden">
                {/* ================= HEADER & NAVIGASI ================= */}
                <div className="mb-5 sm:mb-7 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-[#E8CEBC] pb-4">
                    <Link
                        href="/ebook"
                        className="inline-flex w-fit items-center gap-2 rounded-xl border border-[#E8CEBC] bg-[#FAF1E8] px-3.5 py-2 text-[12px] sm:text-[13px] font-bold text-[#1D4533] hover:bg-[#F2E2D5] transition shadow-2xs"
                    >
                        <ArrowLeft size={15} />
                        <span>Semua E-Book</span>
                    </Link>

                    {/* Tombol Aksi (Bagikan & Unduh) */}
                    <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 sm:gap-2.5 w-full sm:w-auto">
                        <button
                            type="button"
                            onClick={handleShare}
                            className="flex items-center justify-center gap-1.5 rounded-xl border border-[#E8CEBC] bg-[#FAF1E8] px-3.5 sm:px-4 py-2 text-[11.5px] sm:text-[12px] font-bold text-[#5E3122] hover:bg-[#F2E2D5] transition shadow-2xs cursor-pointer active:scale-95"
                        >
                            <Share2 size={14} /> <span>Bagikan</span>
                        </button>

                        <a
                            href={ebook.file_path}
                            download
                            className="flex items-center justify-center gap-1.5 rounded-xl bg-[#1D4533] px-3.5 sm:px-5 py-2 text-[11.5px] sm:text-[12px] font-bold text-[#F7EAE0] hover:bg-[#143325] transition shadow-2xs whitespace-nowrap active:scale-95"
                        >
                            <Download size={14} />
                            <span>
                                Unduh PDF{" "}
                                {ebook.file_size ? `(${ebook.file_size})` : ""}
                            </span>
                        </a>
                    </div>
                </div>

                {/* ================= INFORMASI DOKUMEN (WARM PAPER CARD) ================= */}
                <div className="mb-6 sm:mb-8 rounded-3xl border border-[#E8CEBC] bg-[#FAF1E8] p-5 sm:p-8 md:p-10 shadow-xs">
                    <div className="flex items-center gap-1.5 text-[10.5px] sm:text-[11px] font-bold uppercase tracking-wider text-[#8C5E43] mb-2">
                        <FileText size={14} />
                        <span>Risalah Ilmiah & Kajian</span>
                    </div>

                    <h1 className="font-brand text-[20px] sm:text-[26px] md:text-[32px] font-bold text-[#1D4533] leading-tight">
                        {ebook.title}
                    </h1>

                    <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] sm:text-[12px] font-semibold text-[#8C5E43]">
                        {ebook.author && <span>Penulis: {ebook.author}</span>}
                        {ebook.total_pages && (
                            <>
                                <span>•</span>
                                <span>{ebook.total_pages} Halaman</span>
                            </>
                        )}
                        {ebook.file_size && (
                            <>
                                <span>•</span>
                                <span>{ebook.file_size}</span>
                            </>
                        )}
                    </div>

                    {ebook.description && (
                        <p className="mt-4 pt-4 border-t border-[#E8CEBC]/60 text-[12.5px] sm:text-[13.5px] leading-relaxed text-[#5E3122]/85">
                            {ebook.description}
                        </p>
                    )}
                </div>

                {/* ================= EMBEDDED PDF VIEWER ================= */}
                <div className="overflow-hidden rounded-3xl border border-[#E8CEBC] bg-[#FAF1E8] shadow-md">
                    {/* Header Toolbar Viewer */}
                    <div className="bg-[#1D4533] px-4 sm:px-5 py-3 text-[12px] font-bold text-[#F7EAE0] flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 truncate">
                            <BookOpen
                                size={16}
                                className="shrink-0 text-[#F7EAE0]"
                            />
                            <span className="truncate">
                                Pratinjau Dokumen PDF
                            </span>
                        </div>
                        <a
                            href={ebook.file_path}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] text-[#F7EAE0]/80 hover:text-white hover:underline shrink-0 flex items-center gap-1"
                        >
                            <span>Buka Tab Baru</span>
                            <ExternalLink size={12} />
                        </a>
                    </div>

                    {/* Frame PDF */}
                    <div className="relative w-full h-[65vh] sm:h-[80vh] bg-[#323639] overflow-hidden">
                        <iframe
                            src={`${ebook.file_path}#toolbar=1&navpanes=0&scrollbar=1`}
                            title={ebook.title}
                            className="h-full w-full border-none touch-auto"
                            style={{ width: "100%", height: "100%" }}
                        />
                    </div>
                </div>

                {/* Info Tambahan Khusus Ponsel */}
                <div className="mt-4 block sm:hidden text-center">
                    <p className="text-[11px] text-[#5E3122]/70">
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
