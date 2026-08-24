import React from "react";
import { Head, Link } from "@inertiajs/react";
import MainLayout from "@/Layouts/MainLayout";
import { ArrowLeft, Download, FileText, Share2 } from "lucide-react";
import { EbookItem } from "./Index";

interface ShowProps {
    ebook: EbookItem;
}

export default function EbookShow({ ebook }: ShowProps) {
    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: ebook.title,
                url: window.location.href,
            }).catch(() => {});
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert("Tautan risalah berhasil disalin ke clipboard!");
        }
    };

    return (
        <MainLayout title={ebook.title}>
            <Head title={`Baca: ${ebook.title} - Abu Haidar`} />

            {/* HEADER ATAS DENGAN TOMBOL NAVIGASI */}
            <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
                <Link
                    href="/ebook"
                    className="inline-flex items-center gap-2 rounded-xl border border-[#F9D2BA] bg-white px-4 py-2 text-[13px] font-bold text-[#1D4533] hover:bg-[#F9D2BA]/20 transition shadow-xs"
                >
                    <ArrowLeft size={16} />
                    <span>Kembali ke Semua E-Book</span>
                </Link>

                <div className="flex items-center gap-2.5">
                    <button
                        type="button"
                        onClick={handleShare}
                        className="flex items-center gap-1.5 rounded-xl border border-[#F9D2BA] bg-white px-4 py-2 text-[12px] font-bold text-[#5E3122] hover:bg-[#F9D2BA]/30 transition shadow-xs"
                    >
                        <Share2 size={14} /> Bagikan
                    </button>
                    <a
                        href={ebook.file_path}
                        download
                        className="flex items-center gap-2 rounded-xl bg-[#1D4533] px-5 py-2 text-[12px] font-bold text-[#F7EAE0] hover:bg-[#143325] transition shadow-xs"
                    >
                        <Download size={15} /> Unduh PDF ({ebook.file_size || "Unduh"})
                    </a>
                </div>
            </div>

            {/* INFORMASI DOKUMEN */}
            <div className="mb-6 rounded-2xl border border-[#F9D2BA] bg-white p-6 shadow-xs">
                <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#1D4533] mb-2">
                    <FileText size={15} />
                    <span>Risalah Ilmiah & Kajian</span>
                </div>
                <h1 className="font-brand text-[22px] sm:text-[28px] font-bold text-[#1D4533] leading-tight">
                    {ebook.title}
                </h1>
                {ebook.description && (
                    <p className="mt-2 text-[13px] leading-relaxed text-[#5E3122]/80">
                        {ebook.description}
                    </p>
                )}
            </div>

            {/* EMBEDDED PDF VIEWER */}
            <div className="overflow-hidden rounded-2xl border border-[#F9D2BA] bg-white shadow-md">
                <div className="bg-[#1D4533] px-4 py-2.5 text-[12px] font-bold text-[#F7EAE0] flex items-center justify-between">
                    <span>Pratinjau Dokumen PDF</span>
                    <span className="text-[10px] text-[#F9D2BA]">Dapat diperbesar / dicetak via toolbar browser</span>
                </div>
                <iframe
                    src={`${ebook.file_path}#toolbar=1&navpanes=0`}
                    title={ebook.title}
                    className="h-[75vh] sm:h-[85vh] w-full border-none"
                />
            </div>
        </MainLayout>
    );
}