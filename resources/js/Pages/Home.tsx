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
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
        },
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 },
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
            <div className="mx-auto max-w-[1140px] px-5 lg:px-0 py-8 lg:py-12">
                {/* HERO SECTION (ARTIKEL UTAMA) */}
                {heroArticle ? (
                    <motion.section
                        initial="hidden"
                        animate="visible"
                        variants={fadeUp}
                        className="group mb-12 overflow-hidden rounded-2xl bg-[#FDFBF9] border border-[#F9D2BA] shadow-sm transition-shadow hover:shadow-md"
                    >
                        <div className="grid lg:grid-cols-[1.2fr_1fr] items-stretch">
                            <div className="flex flex-col justify-center p-8 lg:p-14">
                                {heroArticle.category && (
                                    <div>
                                        <CategoryBadge>
                                            {heroArticle.category.name}
                                        </CategoryBadge>
                                    </div>
                                )}
                                <Link href={`/artikel/${heroArticle.slug}`}>
                                    <h1 className="mt-5 font-brand text-[28px] font-bold leading-[1.15] text-[#1D4533] sm:text-[34px] lg:text-[42px] transition-colors group-hover:text-[#5E3122]">
                                        {heroArticle.title}
                                    </h1>
                                </Link>
                                <p className="mt-5 text-[15px] leading-relaxed text-[#5E3122]/80 line-clamp-3">
                                    {heroArticle.description}
                                </p>
                                <div className="mt-8">
                                    <Link
                                        href={`/artikel/${heroArticle.slug}`}
                                        className="inline-flex w-fit items-center gap-3 rounded-full bg-[#1D4533] px-7 py-3.5 text-[13px] font-bold tracking-wide text-[#F7EAE0] transition-all hover:bg-[#143325] hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[#1D4533]/20"
                                    >
                                        <span>Baca Artikel Utama</span>
                                        <ArrowRight size={16} />
                                    </Link>
                                </div>
                            </div>
                            <Link
                                href={`/artikel/${heroArticle.slug}`}
                                className="relative h-[300px] lg:h-full w-full overflow-hidden block bg-[#F7EAE0]"
                            >
                                {heroImageUrl && (
                                    <img
                                        src={heroImageUrl}
                                        alt={heroArticle.title}
                                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                    />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#1D4533]/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                                {heroYtId && (
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm text-white shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:bg-red-600/90">
                                            <FaYoutube size={28} />
                                        </div>
                                    </div>
                                )}
                            </Link>
                        </div>
                    </motion.section>
                ) : (
                    /* HERO EMPTY STATE */
                    <motion.section
                        initial="hidden"
                        animate="visible"
                        variants={fadeUp}
                        className="mb-12 overflow-hidden rounded-2xl bg-gradient-to-br from-[#1D4533] to-[#143325] p-10 lg:p-14 text-[#F7EAE0] shadow-sm text-center md:text-left relative border border-[#F9D2BA]/30"
                    >
                        <div className="max-w-2xl relative z-10">
                            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-[12px] font-bold tracking-wide backdrop-blur-sm mb-4">
                                <Sparkles
                                    size={14}
                                    className="text-[#F9D2BA]"
                                />
                                <span>Portal Dakwah & Kajian Islam</span>
                            </div>
                            <h1 className="font-brand text-[28px] sm:text-[38px] font-bold leading-tight text-white">
                                Selamat Datang di Portal Abu Haidar
                            </h1>
                            <p className="mt-4 text-[15px] leading-relaxed text-[#F7EAE0]/90">
                                Dapatkan mutiara ilmu, kajian sunnah, dan faidah
                                Islam yang bermanfaat. Artikel dan kutipan
                                mutiara baru akan segera hadir insyaAllah.
                            </p>
                        </div>
                    </motion.section>
                )}

                {/* CONTENT GRID */}
                <div className="grid gap-12 lg:grid-cols-[1fr_340px]">
                    {/* LEFT CONTENT */}
                    <div className="min-w-0">
                        {/* 1. ARTIKEL TERBARU (MAX 4) */}
                        <motion.section
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-50px" }}
                            variants={fadeUp}
                        >
                            <div className="mb-8 flex items-end justify-between border-b border-[#F9D2BA] pb-4">
                                <h2 className="font-brand text-[24px] font-bold text-[#1D4533] flex items-center gap-2">
                                    Terbitan Terbaru
                                </h2>
                                {latestArticles.length > 0 && (
                                    <Link
                                        href="/artikel"
                                        className="group text-[12px] font-bold uppercase tracking-wider text-[#1D4533] hover:text-[#5E3122] transition-colors flex items-center gap-1"
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
                                    className="grid gap-6 sm:grid-cols-2"
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
                                <div className="rounded-2xl border border-dashed border-[#F9D2BA] bg-[#FDFBF9] p-10 text-center">
                                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#F7EAE0] text-[#1D4533] mb-4">
                                        <BookOpen size={24} />
                                    </div>
                                    <h3 className="font-brand text-[18px] font-bold text-[#1D4533]">
                                        Belum Ada Artikel Terbaru
                                    </h3>
                                    <p className="mt-1 text-[13px] text-[#5E3122]/70">
                                        Artikel kajian ilmiah dan tulisan dakwah
                                        akan segera dipublikasikan di sini.
                                    </p>
                                </div>
                            )}
                        </motion.section>

                        {/* 2. PILIHAN REDAKSI (LENGKAP DENGAN DESKRIPSI) */}
                        {selectedArticles.length > 0 && (
                            <motion.section
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, margin: "-50px" }}
                                variants={fadeUp}
                                className="mt-16"
                            >
                                <div className="mb-6 flex items-center justify-between border-b border-[#F9D2BA] pb-4">
                                    <h2 className="font-brand text-[24px] font-bold text-[#1D4533] flex items-center gap-2">
                                        <Star
                                            size={20}
                                            className="fill-[#1D4533] text-[#1D4533]"
                                        />
                                        Pilihan Redaksi
                                    </h2>
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#5E3122]/70">
                                        Rekomendasi Utama
                                    </span>
                                </div>

                                <motion.div
                                    variants={staggerContainer}
                                    className="flex flex-col gap-5"
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
                                                className="group relative overflow-hidden rounded-2xl border border-[#F9D2BA] bg-white p-5 sm:p-6 shadow-xs transition-all duration-300 hover:shadow-md hover:border-[#1D4533]"
                                            >
                                                <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                                                    {/* Thumbnail Sampul */}
                                                    <Link
                                                        href={`/artikel/${article.slug}`}
                                                        className="relative h-44 sm:h-32 w-full sm:w-44 shrink-0 overflow-hidden rounded-xl bg-[#F7EAE0] border border-[#F9D2BA]/60 block"
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
                                                            <div className="flex h-full w-full items-center justify-center text-[10px] font-bold text-[#5E3122]/40">
                                                                NO IMAGE
                                                            </div>
                                                        )}
                                                        {ytId && (
                                                            <div className="absolute inset-0 flex items-center justify-center bg-black/30 text-white">
                                                                <FaYoutube
                                                                    size={22}
                                                                    className="drop-shadow"
                                                                />
                                                            </div>
                                                        )}
                                                    </Link>

                                                    {/* Informasi Konten */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            {article.category && (
                                                                <span className="rounded-md bg-[#F7EAE0] px-2.5 py-0.5 text-[11px] font-bold text-[#1D4533] border border-[#F9D2BA]">
                                                                    {
                                                                        article
                                                                            .category
                                                                            .name
                                                                    }
                                                                </span>
                                                            )}
                                                            <span className="flex items-center gap-1 text-[11px] font-medium text-[#5E3122]/60">
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
                                                            <h3 className="font-brand text-[17px] sm:text-[19px] font-bold leading-snug text-[#1D4533] transition-colors group-hover:text-[#5E3122]">
                                                                {article.title}
                                                            </h3>
                                                        </Link>

                                                        {/* Deskripsi Lengkap */}
                                                        <p className="mt-2 text-[13px] leading-relaxed text-[#5E3122]/80 line-clamp-2">
                                                            {article.description ||
                                                                "Simak kajian mendalam dan faidah ilmiah pembahasan tema ini..."}
                                                        </p>

                                                        <div className="mt-3.5 flex items-center text-[12px] font-bold text-[#1D4533] group-hover:text-[#5E3122]">
                                                            <span>
                                                                Baca Pembahasan
                                                            </span>
                                                            <ArrowRight
                                                                size={14}
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
