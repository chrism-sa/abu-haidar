import {
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
    const cleanUrl = url.trim();
    const regExp =
        /^.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
    const match = cleanUrl.match(regExp);
    return match && match[1].length === 11 ? match[1] : null;
};

// Helper Video: Menampilkan Player di Web & URL Teks Murni saat Dicetak ke PDF
// Helper Video Bersih: Mencegah Duplikasi & Mencegah Video Terpotong
const createVideoElement = (doc: Document, ytId: string) => {
    const wrapper = doc.createElement("div");
    wrapper.className = "my-6 w-full video-container-block";
    wrapper.setAttribute("data-rendered-video", "true");

    // 1. Tampilan Video Player di Web (Rasio 16:9 Murni Tanpa Double Wrapper)
    const screenPlayer = doc.createElement("div");
    screenPlayer.className = "w-full overflow-hidden rounded-2xl bg-black shadow-md no-print";

    const newIframe = doc.createElement("iframe");
    newIframe.setAttribute("src", `https://www.youtube.com/embed/${ytId}`);
    newIframe.className = "w-full aspect-video border-0 block";
    newIframe.setAttribute(
        "allow",
        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
    );
    newIframe.setAttribute("allowfullscreen", "true");
    screenPlayer.appendChild(newIframe);

    // 2. Teks URL Polos untuk Cetak PDF
    const printLinkBox = doc.createElement("p");
    printLinkBox.className = "print-only-link text-center my-4 font-mono text-[9pt] text-[#8C5E43]";
    printLinkBox.textContent = `https://www.youtube.com/watch?v=${ytId}`;

    wrapper.appendChild(screenPlayer);
    wrapper.appendChild(printLinkBox);
    return wrapper;
};

const renderArticleHtml = (htmlContent: string) => {
    if (!htmlContent) return "";
    const cleanHtml = htmlContent.replace(/&nbsp;|\u00a0/g, " ");

    if (typeof window === "undefined") return cleanHtml;

    try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(cleanHtml, "text/html");

        // 1. Konversi iframe YouTube asli bawaan editor
        const iframes = doc.querySelectorAll("iframe:not([data-processed])");
        iframes.forEach((iframe) => {
            if (iframe.closest("[data-rendered-video]")) return;
            const src = iframe.getAttribute("src") || "";
            const ytId = getYouTubeId(src);
            if (ytId) {
                const videoEl = createVideoElement(doc, ytId);
                iframe.parentNode?.replaceChild(videoEl, iframe);
            }
        });

        // 2. Konversi link <a> YouTube murni
        const links = doc.querySelectorAll("a");
        links.forEach((link) => {
            if (link.closest("[data-rendered-video]")) return;
            const href = link.getAttribute("href") || link.textContent || "";
            const ytId = getYouTubeId(href);
            if (ytId) {
                const videoEl = createVideoElement(doc, ytId);
                if (
                    link.parentNode &&
                    link.parentNode.nodeName === "P" &&
                    link.parentNode.childNodes.length === 1
                ) {
                    link.parentNode.parentNode?.replaceChild(
                        videoEl,
                        link.parentNode,
                    );
                } else {
                    link.parentNode?.replaceChild(videoEl, link);
                }
            }
        });

        // 3. Konversi paragraf <p> yang hanya berisi URL teks mentah YouTube
        const paragraphs = doc.querySelectorAll("p");
        paragraphs.forEach((p) => {
            if (p.closest("[data-rendered-video]")) return;
            const text = p.textContent?.trim() || "";
            const ytId = getYouTubeId(text);
            if (
                ytId &&
                (text.startsWith("http://") || text.startsWith("https://")) &&
                p.children.length === 0
            ) {
                const videoEl = createVideoElement(doc, ytId);
                p.parentNode?.replaceChild(videoEl, p);
            }
        });

        return doc.body.innerHTML;
    } catch (e) {
        return cleanHtml;
    }
};

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.12,
            delayChildren: 0.05,
        },
    },
};

const itemVariants = {
    hidden: {
        opacity: 0,
        y: 12,
        filter: "blur(4px)",
    },
    visible: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: {
            duration: 0.85,
            ease: [0.25, 1, 0.5, 1],
        },
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
                className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8 py-6 sm:py-10 transform-gpu print:transform-none print:p-0"
            >
                <div className="grid gap-8 lg:gap-10 lg:grid-cols-[1fr_300px]">
                    <article className="min-w-0">
                        {/* 1. KOP SURAT RESMI CETAK (Logo MainLayout) */}
                        <div className="print-header hidden mb-6 pb-4 border-b-2 border-[#1D4533]">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <img
                                        src="/LOGO.png"
                                        alt="Abu Haidar Logo"
                                        style={{
                                            filter: "brightness(0) saturate(100%) invert(20%) sepia(35%) saturate(1600%) hue-rotate(345deg) brightness(90%) contrast(92%)",
                                        }}
                                        className="h-10 w-auto object-contain"
                                    />
                                    <div className="h-8 w-[1.5px] bg-[#5E3122]/30"></div>
                                    <div>
                                        <div className="font-brand text-[15pt] font-bold leading-none text-[#1D4533]">
                                            Abu Haidar
                                        </div>
                                        <div className="mt-1 text-[7.5pt] font-bold tracking-[0.14em] text-[#8C5E43] uppercase">
                                            Media Islam & Dakwah
                                        </div>
                                    </div>
                                </div>

                                <div className="text-right text-[8pt] text-gray-500">
                                    <p className="m-0 font-bold text-[#1D4533]">
                                        Naskah Kajian Ilmiah
                                    </p>
                                    <p className="m-0 font-mono text-[7.5pt]">
                                        {currentUrl}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* 2. Breadcrumbs (No Print) */}
                        <motion.nav
                            variants={itemVariants}
                            className="no-print mb-5 flex flex-wrap items-center gap-2 text-[11.5px] font-semibold text-[#8C5E43]"
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

                        {/* 3. Article Header & Judul */}
                        <motion.header
                            variants={itemVariants}
                            className="mb-7 print-article-header"
                        >
                            {article.category && (
                                <CategoryBadge>
                                    {article.category.name}
                                </CategoryBadge>
                            )}
                            <h1 className="mt-3.5 font-brand text-[24px] sm:text-[32px] md:text-[38px] font-bold leading-tight text-[#1D4533]">
                                {article.title}
                            </h1>

                            <div className="mt-4 flex flex-wrap items-center gap-3 border-y border-[#E8CEBC] py-3.5 text-[12px] sm:text-[12.5px] font-semibold text-[#5E3122]/75 print-meta">
                                <span className="flex items-center gap-1.5">
                                    <Calendar
                                        size={13}
                                        className="text-[#8C5E43] no-print"
                                    />
                                    Ditulis: {formatDate(article.created_at)}
                                </span>
                                <span className="h-1 w-1 rounded-full bg-[#E8CEBC] no-print"></span>
                                <span className="italic text-[#8C5E43] no-print">
                                    {timeAgo(article.updated_at)}
                                </span>
                            </div>
                        </motion.header>

                        {/* 4. Media Sampul: YouTube Player / Image */}
                        <motion.div
                            variants={itemVariants}
                            className="mb-8 overflow-hidden rounded-2xl border border-[#E8CEBC] bg-[#FAF1E8] shadow-xs print-cover"
                        >
                            {ytId ? (
                                <div>
                                    <div className="aspect-video w-full bg-black no-print">
                                        <iframe
                                            src={`https://www.youtube.com/embed/${ytId}`}
                                            title={article.title}
                                            className="h-full w-full border-0 block"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        />
                                    </div>

                                    {/* Link Sampul YouTube Cetak/PDF (Teks URL Polos) */}
                                    <p className="print-only-link text-center my-4 font-mono text-[9pt] text-[#8C5E43]">
                                        {`https://www.youtube.com/watch?v=${ytId}`}
                                    </p>
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

                        {/* 5. Naskah Artikel */}
                        <motion.div
                            variants={itemVariants}
                            id="article-content-body"
                            className="rounded-3xl border border-[#E8CEBC] bg-[#FAF1E8] p-6 sm:p-10 md:p-12 shadow-xs"
                        >
                            <div
                                className="article-content prose prose-sm sm:prose-base lg:prose-lg max-w-none text-[#4A2619] prose-headings:text-[#1D4533] prose-p:leading-relaxed prose-strong:text-[#1D4533] prose-blockquote:border-[#8C5E43] prose-blockquote:text-[#5E3122] prose-a:text-[#1D4533] [hyphens:none] [overflow-wrap:break-word] [word-break:normal]"
                                dangerouslySetInnerHTML={{
                                    __html: renderArticleHtml(article.content),
                                }}
                            />
                        </motion.div>

                        {/* 6. Footer Resmi Cetak */}
                        <div className="print-footer hidden mt-8 pt-4 border-t border-gray-300 text-center text-[8pt] text-gray-500">
                            <p className="m-0 font-semibold text-[#1D4533]">
                                © {new Date().getFullYear()} Abu Haidar Official
                                • Media Dakwah & Risalah Islam Sunnah
                            </p>
                            <p className="m-0">
                                Dokumen digital ini dicetak langsung dari portal
                                resmi Abu Haidar.
                            </p>
                        </div>

                        {/* 7. Share & Download Toolbar (No Print) */}
                        <motion.div
                            variants={itemVariants}
                            className="no-print mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[#E8CEBC] pt-6"
                        >
                            <div className="flex flex-wrap items-center gap-3">
                                <span className="text-[12px] font-bold text-[#1D4533] flex items-center gap-1.5">
                                    <Share2 size={14} />
                                    Bagikan:
                                </span>
                                <div className="flex items-center gap-1.5">
                                    <motion.a
                                        whileHover={{ scale: 1.08, y: -2 }}
                                        whileTap={{ scale: 0.94 }}
                                        transition={{ duration: 0.2 }}
                                        href={shareLinks.whatsapp}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#FAF1E8] border border-[#E8CEBC] text-[#1D4533] transition hover:bg-[#25D366] hover:text-white hover:border-[#25D366] shadow-2xs"
                                        aria-label="Share to WhatsApp"
                                    >
                                        <FaWhatsapp size={14} />
                                    </motion.a>
                                    <motion.a
                                        whileHover={{ scale: 1.08, y: -2 }}
                                        whileTap={{ scale: 0.94 }}
                                        transition={{ duration: 0.2 }}
                                        href={shareLinks.telegram}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#FAF1E8] border border-[#E8CEBC] text-[#1D4533] transition hover:bg-[#0088cc] hover:text-white hover:border-[#0088cc] shadow-2xs"
                                        aria-label="Share to Telegram"
                                    >
                                        <FaTelegramPlane size={14} />
                                    </motion.a>
                                    <motion.a
                                        whileHover={{ scale: 1.08, y: -2 }}
                                        whileTap={{ scale: 0.94 }}
                                        transition={{ duration: 0.2 }}
                                        href={shareLinks.facebook}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#FAF1E8] border border-[#E8CEBC] text-[#1D4533] transition hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] shadow-2xs"
                                        aria-label="Share to Facebook"
                                    >
                                        <FaFacebookF size={13} />
                                    </motion.a>
                                    <motion.a
                                        whileHover={{ scale: 1.08, y: -2 }}
                                        whileTap={{ scale: 0.94 }}
                                        transition={{ duration: 0.2 }}
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
                                            whileHover={{ scale: 1.08, y: -2 }}
                                            whileTap={{ scale: 0.94 }}
                                            transition={{ duration: 0.2 }}
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
                                                        y: 6,
                                                        scale: 0.92,
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        y: 0,
                                                        scale: 1,
                                                    }}
                                                    exit={{
                                                        opacity: 0,
                                                        y: 6,
                                                        scale: 0.92,
                                                    }}
                                                    transition={{
                                                        duration: 0.3,
                                                        ease: [0.16, 1, 0.3, 1],
                                                    }}
                                                    className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-[#1D4533] px-2.5 py-1 text-[10px] font-bold text-[#F7EAE0] shadow-md flex items-center gap-1 pointer-events-none z-20"
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
                                transition={{ duration: 0.2 }}
                                type="button"
                                onClick={handleDownloadPDF}
                                className="inline-flex items-center gap-2 rounded-xl bg-[#1D4533] px-4 py-2 text-[12px] font-bold text-[#F7EAE0] transition hover:bg-[#143325] shadow-2xs cursor-pointer active:scale-95"
                            >
                                <Download size={14} /> Cetak / Simpan PDF
                            </motion.button>
                        </motion.div>

                        {/* 8. Artikel Terkait (No Print) */}
                        {relatedArticles.length > 0 && (
                            <motion.section
                                variants={itemVariants}
                                className="no-print mt-12 sm:mt-14"
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
                                                whileHover={{ y: -3 }}
                                                transition={{
                                                    duration: 0.25,
                                                    ease: [0.16, 1, 0.3, 1],
                                                }}
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
                                                                    className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-105"
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

                    {/* 9. Sidebar Kanan (No Print) */}
                    <motion.aside
                        variants={itemVariants}
                        className="no-print space-y-6"
                    >
                        <Sidebar
                            categories={categories}
                            quote={quote}
                            ebooks={ebooks}
                        />

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
                                                transition={{
                                                    duration: 0.2,
                                                    ease: [0.16, 1, 0.3, 1],
                                                }}
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
