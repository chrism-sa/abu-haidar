import { ArrowRight, BookOpen, ChevronRight, Link2 } from 'lucide-react';
import { FaFacebookF, FaTelegramPlane, FaTwitter, FaWhatsapp } from 'react-icons/fa';
import { Link, Head } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';
import { ArticleMeta, CategoryBadge } from '../../Components/ArticleComponents';
import { Article, Category } from '../../types';

// Mendefinisikan tipe data yang dikirim dari Controller
interface ShowProps {
    article: Article;
    relatedArticles: Article[];
    popularArticles: Article[];
    categories: Category[];
}

// Fungsi untuk memformat tanggal
const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
};

function QuoteCard() {
    return (
        <div className="rounded-xl border border-[#e8dfce] bg-[#faf7f0] p-6 text-center">
            <h3 className="mb-5 text-[10px] font-bold uppercase tracking-widest text-[#0c6247]">
                Ayat Pilihan
            </h3>
            <p dir="rtl" className="font-serif text-[26px] leading-[1.8] text-[#173c2f]">
                إِنَّ اللَّهَ لَا يَغْفِرُ أَنْ يُشْرَكَ بِهِ
            </p>
            <p className="mt-4 text-[11px] italic leading-relaxed text-[#555]">
                “Sesungguhnya Allah tidak akan mengampuni dosa syirik kepada-Nya dan Dia mengampuni dosa selain itu bagi siapa yang dikehendaki.”
            </p>
            <p className="mt-3 text-[10px] font-bold text-[#174f3b]">
                (QS. An-Nisa: 48)
            </p>
            <button className="mx-auto mt-5 flex items-center gap-1 text-[11px] font-bold text-[#126047] hover:underline">
                Baca Tafsir
                <ArrowRight size={12} />
            </button>
        </div>
    );
}

export default function Show({ article, relatedArticles, popularArticles, categories }: ShowProps) {
    return (
        <MainLayout>
            <Head title={`${article.title} - Abu Haidar`} />

            <div className="grid gap-12 lg:grid-cols-[1fr_320px]">
                {/* ================= BAGIAN KIRI: KONTEN ARTIKEL ================= */}
                <article className="min-w-0">
                    {/* BREADCRUMB */}
                    <nav className="mb-6 flex items-center gap-2 text-[11px] text-[#777]">
                        <Link href="/" className="hover:text-[#126047]">Beranda</Link>
                        <ChevronRight size={12} />
                        <Link href="/artikel/" className="hover:text-[#126047]">Artikel</Link>
                        <ChevronRight size={12} />
                        <span className="font-medium text-[#333]">{article.category.name}</span>
                    </nav>

                    {/* HEADER ARTIKEL */}
                    <header className="mb-8">
                        <CategoryBadge>{article.category.name}</CategoryBadge>
                        <h1 className="mt-4 font-serif text-[28px] font-bold leading-tight text-[#10251d] sm:text-[36px] lg:text-[42px]">
                            {article.title}
                        </h1>
                        <div className="mt-5 border-y border-[#e9e6df] py-4">
                            <ArticleMeta 
                                date={formatDate(article.created_at)} 
                                readTime={`${article.read_time} min read`} 
                            />
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

                    {/* ISI ARTIKEL: Render HTML asli dari Database */}
                    <div 
                        className="prose prose-sm sm:prose-base max-w-none text-[#333] prose-headings:font-serif prose-headings:text-[#17251f] prose-p:leading-relaxed prose-p:text-[15px] prose-a:text-[#126047]"
                        dangerouslySetInnerHTML={{ __html: article.content }}
                    />

                    {/* BAGIKAN ARTIKEL */}
                    <div className="mt-12 flex items-center gap-4 border-t border-[#e9e6df] pt-6">
                        <span className="text-[12px] font-bold text-[#17251f]">Bagikan Artikel:</span>
                        <div className="flex gap-2">
                            <button className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f3f1eb] text-[#555] transition hover:bg-[#1877F2] hover:text-white" aria-label="Share to Facebook">
                                <FaFacebookF size={13} />
                            </button>
                            <button className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f3f1eb] text-[#555] transition hover:bg-[#1DA1F2] hover:text-white" aria-label="Share to Twitter">
                                <FaTwitter size={13} />
                            </button>
                            <button className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f3f1eb] text-[#555] transition hover:bg-[#25D366] hover:text-white" aria-label="Share to WhatsApp">
                                <FaWhatsapp size={14} />
                            </button>
                            <button className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f3f1eb] text-[#555] transition hover:bg-[#0088cc] hover:text-white" aria-label="Share to Telegram">
                                <FaTelegramPlane size={14} />
                            </button>
                            <button className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f3f1eb] text-[#555] transition hover:bg-[#126047] hover:text-white" aria-label="Copy Link">
                                <Link2 size={14} />
                            </button>
                        </div>
                    </div>

                    {/* ARTIKEL TERKAIT */}
                    <section className="mt-14">
                        <h2 className="mb-6 font-serif text-[20px] font-bold text-[#17251f] border-b border-[#e9e6df] pb-3">
                            Artikel Terkait
                        </h2>
                        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
                            {relatedArticles.map((relArticle) => (
                                <Link href={`/artikel/${relArticle.slug}`} key={relArticle.id} className="group block">
                                    <div className="aspect-[1.5/1] overflow-hidden rounded-xl bg-[#f0eee9] mb-3">
                                        <img src={relArticle.image} alt={relArticle.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                                    </div>
                                    <h3 className="font-serif text-[13px] font-bold leading-snug text-[#14251e] line-clamp-2 group-hover:text-[#126047]">
                                        {relArticle.title}
                                    </h3>
                                </Link>
                            ))}
                        </div>
                    </section>
                </article>

                {/* ================= BAGIAN KANAN: SIDEBAR ================= */}
                <aside className="space-y-8">
                    <QuoteCard />

                    {/* KATEGORI */}
                    <section className="rounded-xl border border-[#e8e4da] bg-white p-6">
                        <h3 className="mb-4 border-b border-[#f0eee9] pb-3 font-serif text-[15px] font-bold text-[#17251f]">
                            Kategori
                        </h3>
                        <div className="space-y-3">
                            {categories.map((category) => (
                                <Link href={`/kategori/${category.slug}`} key={category.id} className="group flex items-center justify-between text-[12px]">
                                    <span className="flex items-center gap-2 text-[#555] transition-colors group-hover:text-[#126047]">
                                        <BookOpen size={13} className="text-[#126047]" />
                                        {category.name}
                                    </span>
                                    <span className="rounded bg-[#f5f5f5] px-2 py-0.5 text-[10px] text-[#999]">
                                        {category.articles_count}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </section>

                    {/* ARTIKEL POPULER */}
                    <section className="rounded-xl border border-[#e8e4da] bg-white p-6">
                        <h3 className="mb-4 border-b border-[#f0eee9] pb-3 font-serif text-[15px] font-bold text-[#17251f]">
                            Artikel Populer
                        </h3>
                        <div className="space-y-5">
                            {popularArticles.map((popArticle, index) => (
                                <Link href={`/artikel/${popArticle.slug}`} key={popArticle.id} className="group flex items-start gap-3">
                                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#f3f1eb] text-[10px] font-bold text-[#126047] transition-colors group-hover:bg-[#063f2f] group-hover:text-white">
                                        {index + 1}
                                    </span>
                                    <div>
                                        <h4 className="text-[12px] font-medium leading-relaxed text-[#333] transition-colors group-hover:text-[#126047] line-clamp-2">
                                            {popArticle.title}
                                        </h4>
                                        <p className="mt-1 text-[10px] text-[#888]">{formatDate(popArticle.created_at)}</p>
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