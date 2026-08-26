import React, { useState, useMemo } from "react";
import { Head, Link } from "@inertiajs/react";
import { motion } from "framer-motion";
import MainLayout from "@/Layouts/MainLayout";
import {
    FileText,
    Download,
    Eye,
    Search,
    BookOpen,
    Sparkles,
} from "lucide-react";

export interface EbookItem {
    id: number;
    title: string;
    slug: string;
    description: string;
    author?: string;
    file_path: string;
    file_size?: string;
    total_pages?: number;
    cover_image?: string;
    is_published?: boolean;
    created_at: string;
}

interface IndexProps {
    ebooks: EbookItem[];
}

export default function EbookIndex({ ebooks = [] }: IndexProps) {
    const [search, setSearch] = useState("");

    const fadeUp = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
        },
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.08 },
        },
    };

    const filteredEbooks = useMemo(() => {
        return ebooks.filter(
            (eb) =>
                eb.title.toLowerCase().includes(search.toLowerCase()) ||
                eb.description?.toLowerCase().includes(search.toLowerCase()) ||
                eb.author?.toLowerCase().includes(search.toLowerCase()),
        );
    }, [ebooks, search]);

    return (
        <MainLayout title="E-Book & Risalah Dakwah">
            <Head title="Kumpulan E-Book & Risalah PDF - Abu Haidar" />

            {/* HEADER HERO SECTION */}
            <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="mb-10 rounded-3xl border border-[#E6CEBC]/40 bg-gradient-to-br from-[#1D4533] via-[#1A4130] to-[#143325] p-7 sm:p-10 lg:p-12 text-[#F7EAE0] shadow-md relative overflow-hidden"
            >
                <div className="relative z-10 max-w-2xl">
                    <div className="inline-flex items-center gap-2 rounded-full bg-[#FAF1E8]/10 px-3.5 py-1 text-[11px] font-bold tracking-wider uppercase text-[#F7EAE0] backdrop-blur-xs mb-3">
                        <Sparkles size={13} />
                        <span>Pustaka Digital Sunnah</span>
                    </div>
                    <h1 className="font-brand text-[26px] sm:text-[34px] md:text-[38px] font-bold leading-tight text-white">
                        E-Book & Risalah PDF
                    </h1>
                    <p className="mt-3 text-[13.5px] sm:text-[14px] leading-relaxed text-[#F7EAE0]/90">
                        Unduh naskah kajian, buku saku fiqih, tafsir, dan materi
                        dakwah ringkas berformat PDF untuk dibaca secara online
                        maupun offline.
                    </p>

                    {/* BAR PENCARIAN EBOOK (KREM MATANG #FAF1E8) */}
                    <div className="mt-6 relative max-w-md">
                        <Search
                            size={16}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5E3122]/50"
                        />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari judul risalah atau pembahasan kitab..."
                            className="w-full rounded-full border border-[#E6CEBC] bg-[#FAF1E8] py-2.5 pl-11 pr-4 text-[13px] text-[#5E3122] outline-none transition focus:border-[#1D4533] focus:bg-[#FDF9F5] focus:ring-1 focus:ring-[#1D4533]/20"
                        />
                    </div>
                </div>
            </motion.div>

            {/* GRID DAFTAR E-BOOK (KREM MATANG #FAF1E8) */}
            {filteredEbooks.length > 0 ? (
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                    className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
                >
                    {filteredEbooks.map((ebook) => (
                        <motion.div
                            key={ebook.id}
                            variants={fadeUp}
                            className="flex flex-col justify-between rounded-2xl border border-[#E6CEBC] bg-[#FAF1E8] p-5 shadow-2xs transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-[#1D4533]/40"
                        >
                            <div>
                                {/* Cover Gambar / Placeholder */}
                                <div className="mb-4 aspect-[4/3] w-full overflow-hidden rounded-xl bg-[#F2E0D2] border border-[#E6CEBC] flex items-center justify-center">
                                    {ebook.cover_image ? (
                                        <img
                                            src={ebook.cover_image}
                                            alt={ebook.title}
                                            className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center gap-1.5 text-[#1D4533]/40">
                                            <FileText size={38} />
                                            <span className="text-[9.5px] font-bold uppercase tracking-wider">
                                                DOKUMEN PDF
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <h3 className="font-brand text-[15px] sm:text-[16px] font-bold leading-snug text-[#1D4533] line-clamp-2">
                                    {ebook.title}
                                </h3>

                                <p className="mt-2 text-[12px] leading-relaxed text-[#5E3122]/75 line-clamp-2">
                                    {ebook.description ||
                                        "Naskah ilmiah dan risalah dakwah ringkas untuk dibaca dan disebarkan."}
                                </p>

                                <div className="mt-3 flex items-center gap-2.5 text-[11px] font-semibold text-[#8C5E43]">
                                    <span>
                                        PDF{" "}
                                        {ebook.file_size
                                            ? `• ${ebook.file_size}`
                                            : ""}
                                    </span>
                                    {ebook.total_pages && (
                                        <>
                                            <span>•</span>
                                            <span>
                                                {ebook.total_pages} Halaman
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Tombol Aksi */}
                            <div className="mt-5 grid grid-cols-2 gap-2.5 pt-3.5 border-t border-[#E6CEBC]/60">
                                <Link
                                    href={`/ebook/${ebook.slug}`}
                                    className="flex items-center justify-center gap-1.5 rounded-xl border border-[#E6CEBC] bg-[#FAF1E8] py-2 text-[11.5px] font-bold text-[#1D4533] hover:bg-[#F2E0D2] transition shadow-2xs"
                                >
                                    <Eye size={13} /> Baca
                                </Link>
                                <a
                                    href={ebook.file_path}
                                    download
                                    className="flex items-center justify-center gap-1.5 rounded-xl bg-[#1D4533] py-2 text-[11.5px] font-bold text-[#F7EAE0] hover:bg-[#143325] transition shadow-2xs"
                                >
                                    <Download size={13} /> Unduh
                                </a>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            ) : (
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeUp}
                    className="rounded-3xl border border-dashed border-[#E6CEBC] bg-[#FAF1E8] p-10 sm:p-14 text-center"
                >
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F2E0D2] text-[#1D4533] mb-3.5 border border-[#E6CEBC]">
                        <BookOpen size={24} />
                    </div>
                    <h3 className="font-brand text-[17px] font-bold text-[#1D4533]">
                        Belum Ada Risalah / E-Book
                    </h3>
                    <p className="mt-1 text-[12.5px] text-[#5E3122]/70">
                        File risalah PDF yang dicari tidak ditemukan atau belum
                        dipublikasikan.
                    </p>
                </motion.div>
            )}
        </MainLayout>
    );
}
