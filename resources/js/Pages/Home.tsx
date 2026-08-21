import {
    ArrowRight,
    ChevronRight,
    BookOpen,
    Sparkles,
} from "lucide-react";
import { Link } from "@inertiajs/react";
import { motion } from "framer-motion";
import { FaYoutube } from "react-icons/fa";
import MainLayout from "../Layouts/MainLayout";
import Sidebar from "../Components/Sidebar";
import {
    ArticleCard,
    CompactArticle,
    CategoryBadge,
} from "../Components/ArticleComponents";
import { Article, Category, Quote } from "../types";

interface HomeProps {
    heroArticle: Article | null;
    latestArticles: Article[];
    selectedArticles: Article[];
    categories: Category[];
    quote: Quote | null;
}

// HELPER MENDETEKSI LINK YOUTUBE UNTUK HERO SECTION
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
    quote,
}: HomeProps) {
    // Varian animasi untuk efek scroll dan kemunculan
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

    // Pengecekan thumbnail Hero
    const heroYtId = heroArticle?.image
        ? getYouTubeId(heroArticle.image)
        : null;
    const heroImageUrl = heroYtId
        ? `https://img.youtube.com/vi/${heroYtId}/maxresdefault.jpg`
        : heroArticle?.image;

    return (
        <MainLayout title="Beranda">
            <div className="mx-auto max-w-[1140px] px-5 lg:px-0 py-8 lg:py-12">
                {/* HERO SECTION */}
                {heroArticle ? (
                    <motion.section
                        initial="hidden"
                        animate="visible"
                        variants={fadeUp}
                        className="group mb-12 overflow-hidden rounded-2xl bg-white border border-[#E0EAE3] shadow-sm transition-shadow hover:shadow-md"
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
                                    <h1 className="mt-5 font-serif text-[28px] font-bold leading-[1.15] text-[#162B22] sm:text-[34px] lg:text-[42px] transition-colors group-hover:text-[#0F4C3A]">
                                        {heroArticle.title}
                                    </h1>
                                </Link>
                                <p className="mt-5 text-[15px] leading-relaxed text-[#6C857A] line-clamp-3">
                                    {heroArticle.description}
                                </p>
                                <div className="mt-8">
                                    <Link
                                        href={`/artikel/${heroArticle.slug}`}
                                        className="inline-flex w-fit items-center gap-3 rounded-full bg-[#0F4C3A] px-7 py-3.5 text-[13px] font-bold tracking-wide text-white transition-all hover:bg-[#0A382A] hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[#0F4C3A]/20"
                                    >
                                        <span>Baca Artikel Utama</span>
                                        <ArrowRight size={16} />
                                    </Link>
                                </div>
                            </div>
                            <Link
                                href={`/artikel/${heroArticle.slug}`}
                                className="relative h-[300px] lg:h-full w-full overflow-hidden block bg-[#EBF1ED]"
                            >
                                {heroImageUrl && (
                                    <img
                                        src={heroImageUrl}
                                        alt={heroArticle.title}
                                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                    />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#162B22]/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

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
                    /* HERO EMPTY STATE JIKA BELUM ADA ARTIKEL */
                    <motion.section
                        initial="hidden"
                        animate="visible"
                        variants={fadeUp}
                        className="mb-12 overflow-hidden rounded-2xl bg-gradient-to-br from-[#0F4C3A] to-[#0A382A] p-10 lg:p-14 text-white shadow-sm text-center md:text-left relative"
                    >
                        <div className="max-w-2xl relative z-10">
                            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-[12px] font-bold tracking-wide backdrop-blur-sm mb-4">
                                <Sparkles
                                    size={14}
                                    className="text-yellow-300"
                                />
                                <span>Portal Dakwah & Kajian Islam</span>
                            </div>
                            <h1 className="font-serif text-[28px] sm:text-[38px] font-bold leading-tight">
                                Selamat Datang di Portal Abu Haidar
                            </h1>
                            <p className="mt-4 text-[15px] leading-relaxed text-white/80">
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
                        {/* ARTIKEL TERBARU */}
                        <motion.section
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-50px" }}
                            variants={fadeUp}
                        >
                            <div className="mb-8 flex items-end justify-between border-b border-[#E0EAE3] pb-4">
                                <h2 className="font-serif text-[24px] font-bold text-[#162B22] flex items-center gap-2">
                                    Terbitan Terbaru
                                </h2>
                                {latestArticles.length > 0 && (
                                    <Link
                                        href="/artikel"
                                        className="group text-[12px] font-bold uppercase tracking-wider text-[#0F4C3A] transition-colors flex items-center gap-1"
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
                                /* EMPTY STATE JIKA BELUM ADA ARTIKEL TERBARU */
                                <div className="rounded-2xl border border-dashed border-[#CCD8D2] bg-white p-10 text-center">
                                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#EBF1ED] text-[#0F4C3A] mb-4">
                                        <BookOpen size={24} />
                                    </div>
                                    <h3 className="font-serif text-[18px] font-bold text-[#162B22]">
                                        Belum Ada Artikel Terbaru
                                    </h3>
                                    <p className="mt-1 text-[13px] text-[#6C857A]">
                                        Artikel kajian ilmiah dan tulisan dakwah
                                        akan segera dipublikasikan di sini.
                                    </p>
                                </div>
                            )}
                        </motion.section>

                        {/* ARTIKEL PILIHAN */}
                        {selectedArticles.length > 0 && (
                            <motion.section
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, margin: "-50px" }}
                                variants={fadeUp}
                                className="mt-16"
                            >
                                <div className="mb-6 border-b border-[#E0EAE3] pb-4">
                                    <h2 className="font-serif text-[24px] font-bold text-[#162B22]">
                                        Pilihan Redaksi
                                    </h2>
                                </div>
                                <motion.div
                                    variants={staggerContainer}
                                    className="flex flex-col gap-4"
                                >
                                    {selectedArticles.map((article) => (
                                        <motion.div
                                            key={article.id}
                                            variants={fadeUp}
                                        >
                                            <CompactArticle article={article} />
                                        </motion.div>
                                    ))}
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
                        <Sidebar categories={categories} quote={quote} />
                    </motion.div>
                </div>
            </div>
        </MainLayout>
    );
}
