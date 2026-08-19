import {
    ArrowRight,
    BookOpen,
    ChevronRight,
    Link2,
    Download,
} from "lucide-react";
import {
    FaFacebookF,
    FaTelegramPlane,
    FaTwitter,
    FaWhatsapp,
} from "react-icons/fa";
import { Link, Head } from "@inertiajs/react";
import { useState, useEffect } from "react"; // 1. IMPORT STATE & EFFECT
import MainLayout from "../../Layouts/MainLayout";
import Sidebar from "../../Components/Sidebar";
import { ArticleMeta, CategoryBadge } from "../../Components/ArticleComponents";
import { Article, Category, Quote } from "../../types";

interface ShowProps {
    article: Article;
    relatedArticles: Article[];
    popularArticles: Article[];
    categories: Category[];
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

export default function Show({
    article,
    relatedArticles,
    popularArticles,
    categories,
    quote,
}: ShowProps) {
    // 2. STATE UNTUK SHARE & COPY LINK
    const [copied, setCopied] = useState(false);
    const [currentUrl, setCurrentUrl] = useState("");

    // Ambil URL saat ini ketika komponen dimuat (aman untuk SSR)
    useEffect(() => {
        setCurrentUrl(window.location.href);
    }, []);

    // Encode URL & Judul agar aman untuk query parameter
    const encodedUrl = encodeURIComponent(currentUrl);
    const encodedTitle = encodeURIComponent(article.title);

    // Daftar link berbagi sosmed
    const shareLinks = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
        twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
        whatsapp: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
        telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
    };

    // Fungsi salin tautan
    const copyLinkToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(currentUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000); // Hilang setelah 2 detik
        } catch (err) {
            console.error("Gagal menyalin: ", err);
            alert("Gagal menyalin tautan.");
        }
    };

    const handleDownloadPDF = () => {
        window.print();
    };

    return (
        <MainLayout>
            <Head title={`${article.title} - Abu Haidar`} />

            <div className="grid gap-12 lg:grid-cols-[1fr_320px]">
                {/* ================= BAGIAN KIRI: KONTEN ARTIKEL ================= */}
                <article className="min-w-0">
                    {/* BREADCRUMB */}
                    <nav className="mb-6 flex items-center gap-2 text-[11px] text-[#777]">
                        <Link href="/home" className="hover:text-[#126047]">
                            Beranda
                        </Link>
                        <ChevronRight size={12} />
                        <Link href="/artikel" className="hover:text-[#126047]">
                            Artikel
                        </Link>
                        <ChevronRight size={12} />
                        <span className="font-medium text-[#333]">
                            {article.category.name}
                        </span>
                    </nav>

                    {/* HEADER ARTIKEL */}
                    <header className="mb-8">
                        <CategoryBadge>{article.category.name}</CategoryBadge>
                        <h1 className="mt-4 font-serif text-[28px] font-bold leading-tight text-[#10251d] sm:text-[36px] lg:text-[42px]">
                            {article.title}
                        </h1>

                        {/* Mengganti ArticleMeta dengan susunan kustom yang baru */}
                        <div className="mt-5 border-y border-[#e9e6df] py-4 flex flex-wrap items-center gap-3 text-[13px] font-medium text-[#555]">
                            <span>
                                Ditulis: {formatDate(article.created_at)}
                            </span>

                            {/* Titik Pemisah */}
                            <span className="h-1 w-1 rounded-full bg-[#ccc]"></span>

                            {/* Keterangan Terakhir Update */}
                            <span className="italic text-[#888]">
                                {timeAgo(article.updated_at)}
                            </span>
                        </div>
                    </header>

                    {/* GAMBAR UTAMA */}
                    <div className="mb-10 overflow-hidden rounded-2xl aspect-[2/1] bg-[#f0eee9]">
                        <img
                            src={article.image}
                            alt={article.title}
                            className="h-full w-full object-cover"
                        />
                    </div>
                    {/* ISI ARTIKEL DENGAN ID UNTUK PDF */}
                    <div
                        id="article-content-body"
                        className="rounded-2xl bg-white p-6 sm:p-12 shadow-sm border border-[#e8e4da]"
                    >
                        <div
                            className="prose prose-sm sm:prose-base lg:prose-lg max-w-none text-[#333] 
        prose-headings:text-[#17251f] 
        prose-li:list-decimal prose-li:pl-2
        prose-p:leading-relaxed prose-p:text-justify md:prose-p:text-left
        [overflow-wrap:normal] [word-break:normal] [hyphens:none]"
                            dangerouslySetInnerHTML={{
                                __html: article.content,
                            }}
                        />
                    </div>

                    {/* BAGIKAN ARTIKEL & TOMBOL PDF */}
                    <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-[#e9e6df] pt-6">
                        <div className="flex items-center gap-4">
                            <span className="text-[12px] font-bold text-[#17251f]">
                                Bagikan Artikel:
                            </span>
                            <div className="flex gap-2 relative">
                                {/* 3. UBAH BUTTON MENJADI ANCHOR UNTUK SOSMED */}
                                <a
                                    href={shareLinks.facebook}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f3f1eb] text-[#555] transition hover:bg-[#1877F2] hover:text-white"
                                    aria-label="Share to Facebook"
                                >
                                    <FaFacebookF size={13} />
                                </a>

                                <a
                                    href={shareLinks.twitter}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f3f1eb] text-[#555] transition hover:bg-[#1DA1F2] hover:text-white"
                                    aria-label="Share to Twitter"
                                >
                                    <FaTwitter size={13} />
                                </a>

                                <a
                                    href={shareLinks.whatsapp}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f3f1eb] text-[#555] transition hover:bg-[#25D366] hover:text-white"
                                    aria-label="Share to WhatsApp"
                                >
                                    <FaWhatsapp size={14} />
                                </a>

                                <a
                                    href={shareLinks.telegram}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f3f1eb] text-[#555] transition hover:bg-[#0088cc] hover:text-white"
                                    aria-label="Share to Telegram"
                                >
                                    <FaTelegramPlane size={14} />
                                </a>

                                {/* 4. BUTTON COPY LINK DENGAN NOTIFIKASI */}
                                <div className="relative flex items-center">
                                    <button
                                        onClick={copyLinkToClipboard}
                                        className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f3f1eb] text-[#555] transition hover:bg-[#126047] hover:text-white"
                                        aria-label="Copy Link"
                                    >
                                        <Link2 size={14} />
                                    </button>

                                    {/* Tooltip notifikasi "Tautan disalin!" */}
                                    {copied && (
                                        <span className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-[#17251f] px-2.5 py-1 text-[10px] font-medium text-white shadow-sm animate-fade-in">
                                            Tautan disalin!
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Tombol Download PDF */}
                        <button
                            onClick={handleDownloadPDF}
                            className="inline-flex items-center gap-2 rounded-lg bg-[#063f2f] px-4 py-2 text-[12px] font-bold text-white transition hover:bg-[#07513c]"
                        >
                            <Download size={14} /> PDF
                        </button>
                    </div>

                    {/* ARTIKEL TERKAIT */}
                    <section className="mt-14">
                        <h2 className="mb-6 font-serif text-[20px] font-bold text-[#17251f] border-b border-[#e9e6df] pb-3">
                            Artikel Terkait
                        </h2>
                        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
                            {relatedArticles.map((relArticle) => (
                                <Link
                                    href={`/artikel/${relArticle.slug}`}
                                    key={relArticle.id}
                                    className="group block"
                                >
                                    <div className="aspect-[1.5/1] overflow-hidden rounded-xl bg-[#f0eee9] mb-3">
                                        <img
                                            src={relArticle.image}
                                            alt={relArticle.title}
                                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                        />
                                    </div>
                                    <h3 className="font-serif text-[13px] font-bold leading-snug text-[#14251e] line-clamp-2 group-hover:text-[#126047]">
                                        {relArticle.title}
                                    </h3>
                                </Link>
                            ))}
                        </div>
                    </section>
                </article>

                {/* ================= BAGIAN KANAN: PANGGIL SIDEBAR & ARTIKEL POPULER ================= */}
                <aside className="space-y-8">
                    {/* Memanggil komponen Sidebar yang sudah membawa QuoteCard & Kategori */}
                    <Sidebar categories={categories} quote={quote} />

                    {/* ARTIKEL POPULER */}
                    <section className="rounded-xl border border-[#e8e4da] bg-white p-6">
                        <h3 className="mb-4 border-b border-[#f0eee9] pb-3 font-serif text-[15px] font-bold text-[#17251f]">
                            Artikel Populer
                        </h3>
                        <div className="space-y-5">
                            {popularArticles.map((popArticle, index) => (
                                <Link
                                    href={`/artikel/${popArticle.slug}`}
                                    key={popArticle.id}
                                    className="group flex items-start gap-3"
                                >
                                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#f3f1eb] text-[10px] font-bold text-[#126047] transition-colors group-hover:bg-[#063f2f] group-hover:text-white">
                                        {index + 1}
                                    </span>
                                    <div>
                                        <h4 className="text-[12px] font-medium leading-relaxed text-[#333] transition-colors group-hover:text-[#126047] line-clamp-2">
                                            {popArticle.title}
                                        </h4>
                                        <p className="mt-1 text-[10px] text-[#888]">
                                            {formatDate(popArticle.created_at)}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                </aside>
            </div>
        </MainLayout>
    );
}
