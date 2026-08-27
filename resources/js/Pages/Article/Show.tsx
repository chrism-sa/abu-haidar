import {
    ArrowRight,
    BookOpen,
    ChevronRight,
    Link2,
    Download,
    Calendar,
    Share2,
    Check,
} from "lucide-react";
import {
    FaFacebookF,
    FaTelegramPlane,
    FaTwitter,
    FaWhatsapp,
} from "react-icons/fa";
import { Link, Head } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MainLayout from "../../Layouts/MainLayout";
import Sidebar, { EbookSidebarItem } from "../../Components/Sidebar";
import { CategoryBadge } from "../../Components/ArticleComponents";
import { Article, Category, Quote } from "../../types";

interface ShowProps {
    article: Article;
    relatedArticles: Article[];
    popularArticles: Article[];
    categories: Category[];
    ebooks?: EbookSidebarItem[];
    quote: Quote | null;
}

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
};

const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    let interval = seconds / 31536000;
    if (interval >= 1)
        return "Diperbarui " + Math.floor(interval) + " tahun yang lalu";

    interval = seconds / 2592000;
    if (interval >= 1)
        return "Diperbarui " + Math.floor(interval) + " bulan yang lalu";

    interval = seconds / 86400;
    if (interval >= 1)
        return "Diperbarui " + Math.floor(interval) + " hari yang lalu";

    interval = seconds / 3600;
    if (interval >= 1)
        return "Diperbarui " + Math.floor(interval) + " jam yang lalu";

    interval = seconds / 60;
    if (interval >= 1)
        return "Diperbarui " + Math.floor(interval) + " menit yang lalu";

    return "Baru saja diperbarui";
};

const getYouTubeId = (url: string | null | undefined) => {
    if (!url) return null;
    const regExp =
        /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
};

// Motion Variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.05,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
    },
};

export default function Show({
    article,
    relatedArticles = [],
    popularArticles = [],
    categories = [],
    ebooks = [],
    quote,
}: ShowProps) {
    const [copied, setCopied] = useState(false);
    const [currentUrl, setCurrentUrl] = useState("");

    useEffect(() => {
        setCurrentUrl(window.location.href);
    }, []);

    const encodedUrl = encodeURIComponent(currentUrl);
    const encodedTitle = encodeURIComponent(article.title);

    const shareLinks = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
        twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
        whatsapp: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
        telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
    };

    const copyLinkToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(currentUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Gagal menyalin: ", err);
            alert("Gagal menyalin tautan.");
        }
    };

    const handleDownloadPDF = () => {
        window.print();
    };

    const ytId = getYouTubeId(article.image);
    const shareImage = ytId
        ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`
        : article.image || "";

    return (
        <MainLayout title={article.title}>
            {/* Meta Tags Lengkap untuk Social Sharing & SEO */}
            <Head>
                <title>{`${article.title} - Abu Haidar`}</title>
                {article.description && (
                    <meta name="description" content={article.description} />
                )}
                <meta property="og:title" content={article.title} />
                {article.description && (
                    <meta
                        property="og:description"
                        content={article.description}
                    />
                )}
                {shareImage && (
                    <meta property="og:image" content={shareImage} />
                )}
                <meta property="og:url" content={currentUrl} />
                <meta property="og:type" content="article" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={article.title} />
                {article.description && (
                    <meta
                        name="twitter:description"
                        content={article.description}
                    />
                )}
                {shareImage && (
                    <meta name="twitter:image" content={shareImage} />
                )}
            </Head>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="mx-auto max-w-[1140px] px-4 sm:px-6 lg:px-8 py-6 sm:py-10"
            >
                <div className="grid gap-10 lg:gap-12 lg:grid-cols-[1fr_340px]">
                    <article className="min-w-0">
                        {/* Breadcrumbs */}
                        <motion.nav
                            variants={itemVariants}
                            className="mb-5 flex flex-wrap items-center gap-2 text-[11.5px] font-semibold text-[#8C5E43]"
                        >
                            <Link
                                href="/home"
                                className="hover:text-[#1D4533] transition-colors"
                            >
                                Beranda
                            </Link>
                            <ChevronRight
                                size={12}
                                className="text-[#1D4533]"
                            />
                            <Link
                                href="/artikel"
                                className="hover:text-[#1D4533] transition-colors"
                            >
                                Artikel
                            </Link>
                            <ChevronRight
                                size={12}
                                className="text-[#1D4533]"
                            />
                            <span className="text-[#1D4533] font-bold truncate max-w-xs">
                                {article.category?.name || "Kajian"}
                            </span>
                        </motion.nav>

                        {/* Article Header */}
                        <motion.header variants={itemVariants} className="mb-7">
                            {article.category && (
                                <CategoryBadge>
                                    {article.category.name}
                                </CategoryBadge>
                            )}
                            <h1 className="mt-3.5 font-brand text-[24px] sm:text-[32px] md:text-[38px] font-bold leading-tight text-[#1D4533]">
                                {article.title}
                            </h1>

                            <div className="mt-4 flex flex-wrap items-center gap-3 border-y border-[#E8CEBC] py-3.5 text-[12px] sm:text-[12.5px] font-semibold text-[#5E3122]/75">
                                <span className="flex items-center gap-1.5">
                                    <Calendar
                                        size={13}
                                        className="text-[#8C5E43]"
                                    />
                                    Ditulis: {formatDate(article.created_at)}
                                </span>
                                <span className="h-1 w-1 rounded-full bg-[#E8CEBC]"></span>
                                <span className="italic text-[#8C5E43]">
                                    {timeAgo(article.updated_at)}
                                </span>
                            </div>
                        </motion.header>

                        {/* Media Sampul: YouTube Player / Image */}
                        <motion.div
                            variants={itemVariants}
                            className="mb-8 overflow-hidden rounded-2xl border border-[#E8CEBC] bg-[#FAF1E8] shadow-xs"
                        >
                            {ytId ? (
                                <div className="aspect-video w-full bg-black">
                                    <iframe
                                        src={`https://www.youtube.com/embed/${ytId}`}
                                        title={article.title}
                                        className="h-full w-full border-0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                </div>
                            ) : article.image ? (
                                <div className="aspect-[2/1] w-full bg-[#FAF1E8] overflow-hidden">
                                    <img
                                        src={article.image}
                                        alt={article.title}
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                            ) : null}
                        </motion.div>

                        {/* Naskah Artikel (Selaras dengan Tone Warm Paper Sidebar & Editor) */}
                        <motion.div
                            variants={itemVariants}
                            id="article-content-body"
                            className="rounded-3xl border border-[#E8CEBC] bg-[#FAF1E8] p-6 sm:p-10 md:p-12 shadow-xs"
                        >
                            <div
                                className="article-content prose prose-sm sm:prose-base lg:prose-lg max-w-none text-[#4A2619] prose-headings:text-[#1D4533] prose-p:leading-relaxed prose-strong:text-[#1D4533] prose-blockquote:border-[#8C5E43] prose-blockquote:text-[#5E3122] prose-a:text-[#1D4533] [hyphens:none] [overflow-wrap:break-word] [word-break:normal]"
                                dangerouslySetInnerHTML={{
                                    __html: article.content
                                        ? article.content.replace(
                                              /&nbsp;|\u00a0/g,
                                              " ",
                                          )
                                        : "",
                                }}
                            />
                        </motion.div>

                        {/* Share & Download Toolbar */}
                        <motion.div
                            variants={itemVariants}
                            className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[#E8CEBC] pt-6"
                        >
                            <div className="flex flex-wrap items-center gap-3">
                                <span className="text-[12px] font-bold text-[#1D4533] flex items-center gap-1.5">
                                    <Share2 size={14} />
                                    Bagikan:
                                </span>
                                <div className="flex items-center gap-1.5">
                                    <motion.a
                                        whileHover={{ scale: 1.1, y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                        href={shareLinks.whatsapp}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#FAF1E8] border border-[#E8CEBC] text-[#1D4533] transition hover:bg-[#25D366] hover:text-white hover:border-[#25D366] shadow-2xs"
                                        aria-label="Share to WhatsApp"
                                    >
                                        <FaWhatsapp size={14} />
                                    </motion.a>
                                    <motion.a
                                        whileHover={{ scale: 1.1, y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                        href={shareLinks.telegram}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#FAF1E8] border border-[#E8CEBC] text-[#1D4533] transition hover:bg-[#0088cc] hover:text-white hover:border-[#0088cc] shadow-2xs"
                                        aria-label="Share to Telegram"
                                    >
                                        <FaTelegramPlane size={14} />
                                    </motion.a>
                                    <motion.a
                                        whileHover={{ scale: 1.1, y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                        href={shareLinks.facebook}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#FAF1E8] border border-[#E8CEBC] text-[#1D4533] transition hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] shadow-2xs"
                                        aria-label="Share to Facebook"
                                    >
                                        <FaFacebookF size={13} />
                                    </motion.a>
                                    <motion.a
                                        whileHover={{ scale: 1.1, y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                        href={shareLinks.twitter}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#FAF1E8] border border-[#E8CEBC] text-[#1D4533] transition hover:bg-[#1DA1F2] hover:text-white hover:border-[#1DA1F2] shadow-2xs"
                                        aria-label="Share to Twitter"
                                    >
                                        <FaTwitter size={13} />
                                    </motion.a>

                                    <div className="relative flex items-center">
                                        <motion.button
                                            whileHover={{ scale: 1.1, y: -2 }}
                                            whileTap={{ scale: 0.95 }}
                                            type="button"
                                            onClick={copyLinkToClipboard}
                                            className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#FAF1E8] border border-[#E8CEBC] text-[#1D4533] transition hover:bg-[#1D4533] hover:text-[#F7EAE0] cursor-pointer shadow-2xs"
                                            aria-label="Salin Tautan"
                                            title="Salin Tautan"
                                        >
                                            <Link2 size={14} />
                                        </motion.button>

                                        <AnimatePresence>
                                            {copied && (
                                                <motion.span
                                                    initial={{
                                                        opacity: 0,
                                                        y: 5,
                                                        scale: 0.9,
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        y: 0,
                                                        scale: 1,
                                                    }}
                                                    exit={{
                                                        opacity: 0,
                                                        y: 5,
                                                        scale: 0.9,
                                                    }}
                                                    transition={{
                                                        duration: 0.2,
                                                    }}
                                                    className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-[#1D4533] px-2.5 py-1 text-[10px] font-bold text-[#F7EAE0] shadow-sm flex items-center gap-1 pointer-events-none z-20"
                                                >
                                                    <Check size={11} /> Tautan
                                                    disalin!
                                                </motion.span>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.97 }}
                                type="button"
                                onClick={handleDownloadPDF}
                                className="inline-flex items-center gap-2 rounded-xl bg-[#1D4533] px-4 py-2 text-[12px] font-bold text-[#F7EAE0] transition hover:bg-[#143325] shadow-2xs cursor-pointer active:scale-95"
                            >
                                <Download size={14} /> Cetak / Simpan PDF
                            </motion.button>
                        </motion.div>

                        {/* Artikel Terkait */}
                        {relatedArticles.length > 0 && (
                            <motion.section
                                variants={itemVariants}
                                className="mt-12 sm:mt-14"
                            >
                                <h2 className="mb-5 border-b border-[#E8CEBC] pb-3 font-brand text-[20px] font-bold text-[#1D4533]">
                                    Artikel Terkait
                                </h2>
                                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                                    {relatedArticles.map((relArticle) => {
                                        const relYtId = getYouTubeId(
                                            relArticle.image,
                                        );
                                        const relThumb = relYtId
                                            ? `https://img.youtube.com/vi/${relYtId}/mqdefault.jpg`
                                            : relArticle.image;

                                        return (
                                            <motion.div
                                                key={relArticle.id}
                                                whileHover={{ y: -4 }}
                                                transition={{ duration: 0.2 }}
                                                className="h-full"
                                            >
                                                <Link
                                                    href={`/artikel/${relArticle.slug}`}
                                                    className="group flex flex-col justify-between h-full rounded-2xl border border-[#E8CEBC] bg-[#FAF1E8] p-3.5 transition-all hover:border-[#1D4533]/40 hover:shadow-md"
                                                >
                                                    <div>
                                                        <div className="mb-2.5 aspect-[16/10] overflow-hidden rounded-xl bg-[#FAF3EB] border border-[#E8CEBC]/50">
                                                            {relThumb ? (
                                                                <img
                                                                    src={
                                                                        relThumb
                                                                    }
                                                                    alt={
                                                                        relArticle.title
                                                                    }
                                                                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                                                />
                                                            ) : (
                                                                <div className="flex h-full w-full items-center justify-center text-[9px] font-bold text-[#5E3122]/40">
                                                                    Kajian
                                                                    Dakwah
                                                                </div>
                                                            )}
                                                        </div>

                                                        <h3 className="line-clamp-2 font-brand text-[13px] font-bold leading-snug text-[#1D4533] transition-colors group-hover:text-[#5E3122]">
                                                            {relArticle.title}
                                                        </h3>

                                                        {relArticle.description && (
                                                            <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-[#5E3122]/70">
                                                                {
                                                                    relArticle.description
                                                                }
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div className="mt-3 pt-2 border-t border-[#E8CEBC]/60 text-[10px] font-semibold text-[#8C5E43]">
                                                        {formatDate(
                                                            relArticle.created_at,
                                                        )}
                                                    </div>
                                                </Link>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </motion.section>
                        )}
                    </article>

                    {/* Sidebar Kanan (Kutipan + E-Book + Kategori + Artikel Populer) */}
                    <motion.aside variants={itemVariants} className="space-y-6">
                        <Sidebar
                            categories={categories}
                            quote={quote}
                            ebooks={ebooks}
                        />

                        {/* Artikel Populer Card */}
                        {popularArticles.length > 0 && (
                            <section className="rounded-2xl border border-[#E8CEBC] bg-[#FAF1E8] p-5 shadow-sm">
                                <h3 className="mb-4 border-b border-[#E8CEBC] pb-3 font-brand text-[15px] font-bold text-[#1D4533] flex items-center gap-2">
                                    <BookOpen
                                        size={16}
                                        className="text-[#1D4533]"
                                    />
                                    Artikel Populer
                                </h3>
                                <div className="space-y-3.5">
                                    {popularArticles.map(
                                        (popArticle, index) => (
                                            <motion.div
                                                key={popArticle.id}
                                                whileHover={{ x: 3 }}
                                                transition={{ duration: 0.15 }}
                                            >
                                                <Link
                                                    href={`/artikel/${popArticle.slug}`}
                                                    className="group flex items-start gap-3"
                                                >
                                                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#FAF3EB] border border-[#E8CEBC] text-[10px] font-bold text-[#1D4533] transition-colors group-hover:bg-[#1D4533] group-hover:text-[#F7EAE0]">
                                                        {index + 1}
                                                    </span>
                                                    <div className="min-w-0">
                                                        <h4 className="line-clamp-2 text-[12px] font-bold leading-snug text-[#1D4533] transition-colors group-hover:text-[#5E3122]">
                                                            {popArticle.title}
                                                        </h4>
                                                        <p className="mt-0.5 text-[10px] font-semibold text-[#8C5E43]">
                                                            {formatDate(
                                                                popArticle.created_at,
                                                            )}
                                                        </p>
                                                    </div>
                                                </Link>
                                            </motion.div>
                                        ),
                                    )}
                                </div>
                            </section>
                        )}
                    </motion.aside>
                </div>
            </motion.div>
        </MainLayout>
    );
}
