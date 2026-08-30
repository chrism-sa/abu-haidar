import React from "react";
import {
    ArrowRight,
    ChevronRight,
    BookOpen,
    Sparkles,
    Calendar,
    Star,
} from "lucide-react";
import { Link } from "@inertiajs/react";
import { motion } from "framer-motion";
import { FaYoutube } from "react-icons/fa";
import MainLayout from "../Layouts/MainLayout";
import Sidebar, { EbookSidebarItem } from "../Components/Sidebar";
import { ArticleCard, CategoryBadge } from "../Components/ArticleComponents";
import { Article, Category, Quote } from "../types";

interface HomeProps {
    heroArticle: Article | null;
    latestArticles: Article[];
    selectedArticles: Article[];
    categories: Category[];
    ebooks: EbookSidebarItem[];
    quote: Quote | null;
}

const getYouTubeId = (url: string | null | undefined) => {
    if (!url) return null;
    const regExp =
        /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
};

export default function Home({
    heroArticle,
    latestArticles = [],
    selectedArticles = [],
    categories = [],
    ebooks = [],
    quote,
}: HomeProps) {
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
            transition: { staggerChildren: 0.1 },
        },
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return "";
        return new Date(dateString).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    const heroYtId = heroArticle?.image
        ? getYouTubeId(heroArticle.image)
        : null;
    const heroImageUrl = heroYtId
        ? `https://img.youtube.com/vi/${heroYtId}/maxresdefault.jpg`
        : heroArticle?.image;

    return (
        <MainLayout title="Beranda">
            <div className="mx-auto max-w-[1140px] px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
                {/* HERO SECTION (KREM MATANG #FAF1E8) */}
                {heroArticle ? (
                    <motion.section
                        initial="hidden"
                        animate="visible"
                        variants={fadeUp}
                        className="group mb-10 sm:mb-14 overflow-hidden rounded-3xl bg-[#FAF1E8] border border-[#E6CEBC] shadow-xs transition-all duration-300 hover:shadow-md hover:border-[#1D4533]/40"
                    >
                        <div className="grid lg:grid-cols-[1.15fr_1fr] items-stretch">
                            <div className="flex flex-col justify-center p-6 sm:p-9 lg:p-12 order-2 lg:order-1 bg-[#FAF1E8]">
                                {heroArticle.category && (
                                    <div>
                                        <CategoryBadge>
                                            {heroArticle.category.name}
                                        </CategoryBadge>
                                    </div>
                                )}
                                <Link href={`/artikel/${heroArticle.slug}`}>
                                    <h1 className="mt-4 font-brand text-[24px] sm:text-[30px] lg:text-[36px] font-bold leading-[1.2] text-[#1D4533] transition-colors group-hover:text-[#5E3122]">
                                        {heroArticle.title}
                                    </h1>
                                </Link>
                                <p className="mt-3.5 text-[13.5px] sm:text-[14.5px] leading-relaxed text-[#5E3122]/80 line-clamp-3">
                                    {heroArticle.description}
                                </p>
                                <div className="mt-7 flex flex-wrap items-center gap-4">
                                    <Link
                                        href={`/artikel/${heroArticle.slug}`}
                                        className="inline-flex w-fit items-center gap-2.5 rounded-full bg-[#1D4533] px-6 py-3 text-[12.5px] sm:text-[13px] font-bold tracking-wide text-[#F7EAE0] transition-all hover:bg-[#143325] hover:scale-[1.02] active:scale-[0.98] shadow-md shadow-[#1D4533]/20"
                                    >
                                        <span>Baca Artikel Utama</span>
                                        <ArrowRight size={15} />
                                    </Link>
                                    <span className="flex items-center gap-1.5 text-[11.5px] font-semibold text-[#8C5E43]">
                                        <Calendar size={13} />
                                        {formatDate(heroArticle.created_at)}
                                    </span>
                                </div>
                            </div>
                            <Link
                                href={`/artikel/${heroArticle.slug}`}
                                className="relative min-h-[260px] sm:min-h-[320px] lg:min-h-full w-full overflow-hidden flex items-center justify-center bg-[#F2E0D2]/50 order-1 lg:order-2 border-b lg:border-b-0 lg:border-l border-[#E6CEBC] p-4 sm:p-6"
                            >
                                {heroImageUrl ? (
                                    <div className="relative h-full w-full flex items-center justify-center overflow-hidden rounded-2xl">
                                        {/* Background blur samar untuk mengisi area kosong jika foto bukan 16:9 */}
                                        <img
                                            src={heroImageUrl}
                                            alt=""
                                            aria-hidden="true"
                                            className="absolute inset-0 h-full w-full object-cover blur-xl opacity-30 scale-110"
                                        />
                                        {/* Gambar utama tampil utuh tanpa terpotong */}
                                        <img
                                            src={heroImageUrl}
                                            alt={heroArticle.title}
                                            className="relative max-h-[380px] w-auto max-w-full rounded-xl object-contain shadow-sm transition-transform duration-700 ease-out group-hover:scale-102"
                                        />
                                    </div>
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-[12px] font-bold tracking-wider text-[#5E3122]/40">
                                        GAMBAR UTAMA
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#1D4533]/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none" />

                                {heroYtId && (
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black/50 backdrop-blur-xs text-white shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:bg-red-600">
                                            <FaYoutube size={26} />
                                        </div>
                                    </div>
                                )}
                            </Link>
                        </div>
                    </motion.section>
                ) : (
                    <motion.section
                        initial="hidden"
                        animate="visible"
                        variants={fadeUp}
                        className="mb-10 sm:mb-14 overflow-hidden rounded-3xl bg-gradient-to-br from-[#1D4533] via-[#1A4130] to-[#143325] p-7 sm:p-10 lg:p-12 text-[#F7EAE0] shadow-md relative border border-[#E6CEBC]/30"
                    >
                        <div className="max-w-2xl relative z-10">
                            <div className="inline-flex items-center gap-2 rounded-full bg-[#FAF1E8]/10 px-3.5 py-1 text-[11px] font-bold tracking-wide uppercase text-[#F7EAE0] backdrop-blur-xs mb-3">
                                <Sparkles size={13} />
                                <span>Portal Dakwah & Kajian Sunnah</span>
                            </div>
                            <h1 className="font-brand text-[24px] sm:text-[32px] md:text-[36px] font-bold leading-snug text-white">
                                Selamat Datang di Portal Abu Haidar
                            </h1>
                            <p className="mt-3 text-[13px] sm:text-[14px] leading-relaxed text-[#F7EAE0]/90">
                                Dapatkan mutiara ilmu, kajian sunnah, dan faidah
                                risalah Islam yang shahih. Naskah artikel dan
                                kutipan ayat pilihan akan segera terbit
                                insyaAllah.
                            </p>
                        </div>
                    </motion.section>
                )}

                {/* CONTENT GRID */}
                <div className="grid gap-10 lg:gap-12 lg:grid-cols-[1fr_340px]">
                    {/* LEFT CONTENT */}
                    <div className="min-w-0">
                        {/* 1. ARTIKEL TERBARU */}
                        <motion.section
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-50px" }}
                            variants={fadeUp}
                        >
                            <div className="mb-6 flex items-center justify-between border-b border-[#E6CEBC] pb-3.5">
                                <h2 className="font-brand text-[20px] sm:text-[22px] font-bold text-[#1D4533] flex items-center gap-2">
                                    Terbitan Terbaru
                                </h2>
                                {latestArticles.length > 0 && (
                                    <Link
                                        href="/artikel"
                                        className="group text-[11.5px] font-bold uppercase tracking-wider text-[#1D4533] hover:text-[#5E3122] transition-colors flex items-center gap-1"
                                    >
                                        <span>Lihat Semua</span>
                                        <ChevronRight
                                            size={14}
                                            className="transition-transform group-hover:translate-x-1"
                                        />
                                    </Link>
                                )}
                            </div>

                            {latestArticles.length > 0 ? (
                                <motion.div
                                    variants={staggerContainer}
                                    className="grid gap-5 sm:grid-cols-2"
                                >
                                    {latestArticles.map((article) => (
                                        <motion.div
                                            key={article.id}
                                            variants={fadeUp}
                                        >
                                            <ArticleCard article={article} />
                                        </motion.div>
                                    ))}
                                </motion.div>
                            ) : (
                                <div className="rounded-2xl border border-dashed border-[#E6CEBC] bg-[#FAF1E8] p-8 text-center">
                                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#F2E0D2] text-[#1D4533] mb-3">
                                        <BookOpen size={22} />
                                    </div>
                                    <h3 className="font-brand text-[16px] font-bold text-[#1D4533]">
                                        Belum Ada Artikel Terbaru
                                    </h3>
                                    <p className="mt-1 text-[12px] text-[#5E3122]/70">
                                        Artikel kajian ilmiah dan tulisan dakwah
                                        akan segera dipublikasikan di sini.
                                    </p>
                                </div>
                            )}
                        </motion.section>

                        {/* 2. PILIHAN REDAKSI (KREM MATANG #FAF1E8) */}
                        {selectedArticles.length > 0 && (
                            <motion.section
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, margin: "-50px" }}
                                variants={fadeUp}
                                className="mt-12 sm:mt-14"
                            >
                                <div className="mb-6 flex items-center justify-between border-b border-[#E6CEBC] pb-3.5">
                                    <h2 className="font-brand text-[20px] sm:text-[22px] font-bold text-[#1D4533] flex items-center gap-2">
                                        <Star
                                            size={18}
                                            className="fill-[#1D4533] text-[#1D4533]"
                                        />
                                        Pilihan Redaksi
                                    </h2>
                                    <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#8C5E43]">
                                        Rekomendasi Utama
                                    </span>
                                </div>

                                <motion.div
                                    variants={staggerContainer}
                                    className="flex flex-col gap-4 sm:gap-5"
                                >
                                    {selectedArticles.map((article) => {
                                        const ytId = getYouTubeId(
                                            article.image,
                                        );
                                        const coverUrl = ytId
                                            ? `https://img.youtube.com/vi/${ytId}/mqdefault.jpg`
                                            : article.image;

                                        return (
                                            <motion.article
                                                key={article.id}
                                                variants={fadeUp}
                                                className="group relative overflow-hidden rounded-2xl border border-[#E6CEBC] bg-[#FAF1E8] p-4 sm:p-5 shadow-2xs transition-all duration-300 hover:shadow-md hover:border-[#1D4533]/40"
                                            >
                                                <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 items-start sm:items-center">
                                                    {/* Thumbnail Sampul */}
                                                    <Link
                                                        href={`/artikel/${article.slug}`}
                                                        className="relative h-40 sm:h-28 w-full sm:w-40 shrink-0 overflow-hidden rounded-xl bg-[#F2E0D2] border border-[#E6CEBC] block"
                                                    >
                                                        {coverUrl ? (
                                                            <img
                                                                src={coverUrl}
                                                                alt={
                                                                    article.title
                                                                }
                                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                            />
                                                        ) : (
                                                            <div className="flex h-full w-full items-center justify-center text-[9px] font-bold text-[#5E3122]/40">
                                                                NO IMAGE
                                                            </div>
                                                        )}
                                                        {ytId && (
                                                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white">
                                                                <FaYoutube
                                                                    size={20}
                                                                    className="drop-shadow"
                                                                />
                                                            </div>
                                                        )}
                                                    </Link>

                                                    {/* Informasi Konten */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1.5">
                                                            {article.category && (
                                                                <CategoryBadge>
                                                                    {
                                                                        article
                                                                            .category
                                                                            .name
                                                                    }
                                                                </CategoryBadge>
                                                            )}
                                                            <span className="flex items-center gap-1 text-[10.5px] font-semibold text-[#8C5E43]">
                                                                <Calendar
                                                                    size={12}
                                                                />
                                                                {formatDate(
                                                                    article.created_at,
                                                                )}
                                                            </span>
                                                        </div>

                                                        <Link
                                                            href={`/artikel/${article.slug}`}
                                                        >
                                                            <h3 className="font-brand text-[15px] sm:text-[17px] font-bold leading-snug text-[#1D4533] transition-colors group-hover:text-[#5E3122]">
                                                                {article.title}
                                                            </h3>
                                                        </Link>

                                                        <p className="mt-1.5 text-[12px] leading-relaxed text-[#5E3122]/75 line-clamp-2">
                                                            {article.description ||
                                                                "Simak kajian mendalam dan faidah ilmiah pembahasan tema ini..."}
                                                        </p>

                                                        <div className="mt-3 flex items-center text-[11.5px] font-bold text-[#1D4533] group-hover:text-[#5E3122]">
                                                            <span>
                                                                Baca Pembahasan
                                                            </span>
                                                            <ArrowRight
                                                                size={13}
                                                                className="ml-1.5 transition-transform group-hover:translate-x-1"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.article>
                                        );
                                    })}
                                </motion.div>
                            </motion.section>
                        )}
                    </div>

                    {/* RIGHT SIDEBAR */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeUp}
                    >
                        <Sidebar
                            categories={categories}
                            quote={quote}
                            ebooks={ebooks}
                        />
                    </motion.div>
                </div>
            </div>
        </MainLayout>
    );
}
