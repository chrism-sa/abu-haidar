import { ArrowRight, ChevronRight } from 'lucide-react';
import { Link } from '@inertiajs/react';
import MainLayout from '../Layouts/MainLayout';
import Sidebar from '../Components/Sidebar';
import { ArticleCard, CompactArticle, CategoryBadge } from '../Components/ArticleComponents';
import { Article, Category, Quote } from '../types';


// 1. Tambahkan di interface HomeProps
interface HomeProps {
    heroArticle: Article | null;
    latestArticles: Article[];
    selectedArticles: Article[];
    categories: Category[];
    quote: Quote | null; 
}

export default function Home({ heroArticle, latestArticles, selectedArticles, categories, quote }: HomeProps) {
    return (
        <MainLayout>
            {/* HERO SECTION */}
            {heroArticle && (
                <section className="mb-10 overflow-hidden rounded-2xl bg-[#faf7f0] border border-[#e8dfce]">
                    <div className="grid lg:grid-cols-[1fr_1fr] items-center">
                        <div className="p-8 lg:p-14">
                            <CategoryBadge>{heroArticle.category.name}</CategoryBadge>
                            <h1 className="mt-4 font-serif text-[28px] font-bold leading-tight text-[#10251d] sm:text-[34px] lg:text-[40px]">
                                {heroArticle.title}
                            </h1>
                            <p className="mt-4 text-[14px] leading-relaxed text-[#555]">
                                {heroArticle.description}
                            </p>
                            <Link href={`/artikel/${heroArticle.slug}`} className="mt-8 flex w-fit items-center gap-2 rounded bg-[#063f2f] px-6 py-3 text-[12px] font-bold text-white transition hover:bg-[#07513c]">
                                Baca Selengkapnya
                                <ArrowRight size={14} />
                            </Link>
                        </div>
                        <div className="h-[300px] lg:h-full w-full">
                            <img src={heroArticle.image} alt={heroArticle.title} className="h-full w-full object-cover" />
                        </div>
                    </div>
                </section>
            )}

            {/* CONTENT GRID */}
            <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
                {/* LEFT CONTENT */}
                <div className="min-w-0">
                    {/* ARTIKEL TERBARU */}
                    <section>
                        <div className="mb-6 flex items-end justify-between border-b border-[#e9e6df] pb-3">
                            <h2 className="font-serif text-[22px] font-bold text-[#17251f] flex items-center gap-2">
                                <span className="text-[#126047]">∞</span> Artikel Terbaru
                            </h2>
                            <Link href="/artikel" className="text-[11px] font-bold text-[#126047] hover:underline flex items-center">
                                Lihat Semua <ChevronRight size={14} />
                            </Link>
                        </div>
                        <div className="grid gap-5 sm:grid-cols-2">
                            {latestArticles.map((article) => (
                                <ArticleCard key={article.id} article={article} />
                            ))}
                        </div>
                    </section>

                    {/* ARTIKEL PILIHAN */}
                    <section className="mt-10">
                        <div className="mb-6 border-b border-[#e9e6df] pb-3">
                            <h2 className="font-serif text-[22px] font-bold text-[#17251f]">
                                Artikel Pilihan
                            </h2>
                        </div>
                        <div className="flex flex-col">
                            {selectedArticles.map((article) => (
                                <CompactArticle key={article.id} article={article} />
                            ))}
                        </div>
                    </section>
                </div>

                {/* RIGHT SIDEBAR */}
                <Sidebar categories={categories} quote={quote} />
            </div>
        </MainLayout>
    );
}