import React from "react";
import { Head, Link } from "@inertiajs/react";
import { motion } from "framer-motion";
import MainLayout from "../../Layouts/MainLayout";
import { ArticleCard } from "../../Components/ArticleComponents";
import { Article, Category } from "../../types";
import { SearchX, Home, Filter, Sparkles, RefreshCw } from "lucide-react";

interface IndexProps {
    articles: Article[];
    title: string;
    categories: Category[];
    currentCategory?: Category | null;
}

export default function ArticleIndex({
    articles = [],
    title,
    categories = [],
    currentCategory,
}: IndexProps) {
    const fadeUp = {
        hidden: { opacity: 0, y: 25 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
        },
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.08 },
        },
    };

    return (
        <MainLayout>
            <Head title={`${title} - Abu Haidar`} />

            <div className="mx-auto max-w-[1140px]">
                {/* Header Judul & Keterangan Hasil */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeUp}
                    className="mb-8 border-b border-[#F9D2BA] pb-6"
                >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#1D4533]/10 px-3 py-1 text-[11px] font-bold text-[#1D4533] mb-2 border border-[#F9D2BA]/80">
                                <Sparkles
                                    size={12}
                                    className="text-[#1D4533]"
                                />
                                <span>Pustaka Artikel Ilmiah</span>
                            </div>
                            <h1 className="font-brand text-[26px] font-bold text-[#1D4533] sm:text-[34px] leading-tight">
                                {title}
                            </h1>
                            <p className="mt-1 text-[13px] text-[#5E3122]/70">
                                {articles.length > 0
                                    ? `Ditemukan ${articles.length} naskah kajian yang sesuai dengan kriteria Anda.`
                                    : "Tidak ada naskah kajian yang cocok dengan filter saat ini."}
                            </p>
                        </div>

                        {/* Tombol Reset Filter */}
                        {(currentCategory || title.includes("Pencarian")) && (
                            <Link
                                href="/artikel"
                                className="inline-flex w-fit items-center gap-1.5 rounded-full border border-[#F9D2BA] bg-white px-4 py-2 text-[11px] font-bold text-[#1D4533] transition hover:bg-[#F9D2BA]/30 shadow-2xs cursor-pointer"
                            >
                                <RefreshCw size={12} />
                                <span>Lihat Semua Artikel</span>
                            </Link>
                        )}
                    </div>

                    {/* FILTER KATEGORI BADGES */}
                    <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                        <span className="flex items-center gap-1 text-[11px] font-bold text-[#5E3122]/70 shrink-0 mr-1">
                            <Filter size={12} /> Filter:
                        </span>

                        <Link
                            href="/artikel"
                            className={`rounded-full px-4 py-1.5 text-[11px] font-bold transition shrink-0 ${
                                !currentCategory &&
                                !title.includes("Kategori") &&
                                !title.includes("Pencarian")
                                    ? "bg-[#1D4533] text-[#F7EAE0] shadow-xs"
                                    : "bg-white border border-[#F9D2BA] text-[#5E3122] hover:bg-[#F9D2BA]/30"
                            }`}
                        >
                            Semua
                        </Link>

                        {categories &&
                            categories.map((cat) => {
                                const isActive =
                                    currentCategory?.id === cat.id ||
                                    title.includes(cat.name);
                                return (
                                    <Link
                                        key={cat.id}
                                        href={`/kategori/${cat.slug}`}
                                        className={`rounded-full px-4 py-1.5 text-[11px] font-bold transition shrink-0 ${
                                            isActive
                                                ? "bg-[#1D4533] text-[#F7EAE0] shadow-xs"
                                                : "bg-white border border-[#F9D2BA] text-[#5E3122] hover:bg-[#F9D2BA]/30"
                                        }`}
                                    >
                                        {cat.name}
                                    </Link>
                                );
                            })}
                    </div>
                </motion.div>

                {/* GRID ARTIKEL ATAU NOT FOUND */}
                {articles.length > 0 ? (
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                    >
                        {articles.map((article) => (
                            <motion.div key={article.id} variants={fadeUp}>
                                <ArticleCard article={article} />
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeUp}
                        className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#F9D2BA] bg-white/60 backdrop-blur-xs py-16 px-6 text-center shadow-2xs"
                    >
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F7EAE0] text-[#1D4533] mb-4 border border-[#F9D2BA]">
                            <SearchX size={26} />
                        </div>
                        <h2 className="font-brand text-[18px] font-bold text-[#1D4533]">
                            Artikel Tidak Ditemukan
                        </h2>
                        <p className="mt-1.5 max-w-md text-[13px] text-[#5E3122]/75 leading-relaxed">
                            Maaf, kata kunci pencarian atau kategori yang Anda
                            pilih belum memiliki artikel terkait saat ini.
                        </p>
                        <div className="mt-6 flex items-center gap-3">
                            <Link
                                href="/artikel"
                                className="flex items-center gap-2 rounded-xl bg-[#1D4533] px-5 py-2.5 text-[12px] font-bold text-[#F7EAE0] transition hover:bg-[#143325] shadow-xs"
                            >
                                Lihat Semua Artikel
                            </Link>
                            <Link
                                href="/home"
                                className="flex items-center gap-2 rounded-xl border border-[#F9D2BA] bg-white px-5 py-2.5 text-[12px] font-bold text-[#5E3122] transition hover:bg-[#F9D2BA]/30"
                            >
                                <Home size={14} /> Beranda
                            </Link>
                        </div>
                    </motion.div>
                )}
            </div>
        </MainLayout>
    );
}
