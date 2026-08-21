import { Link } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';
import { ArticleCard } from '../../Components/ArticleComponents';
import { Article, Category } from '../../types';
import { SearchX, Home, Filter } from 'lucide-react';

interface IndexProps {
    articles: Article[];
    title: string;
    categories: Category[];
    currentCategory?: Category | null;
}

export default function ArticleIndex({ articles, title, categories, currentCategory }: IndexProps) {
    return (
        <MainLayout>
            <div className="mx-auto max-w-[1140px]">
                {/* Header Judul & Keterangan Hasil */}
                <div className="mb-8 border-b border-[#e9e6df] pb-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="font-serif text-[26px] font-bold text-[#17251f] sm:text-[32px]">
                                {title}
                            </h1>
                            <p className="mt-1 text-[13px] text-[#666]">
                                {articles.length > 0 
                                    ? `Ditemukan ${articles.length} artikel yang sesuai dengan kriteria Anda.` 
                                    : 'Tidak ada artikel yang cocok dengan pencarian atau kategori ini.'}
                            </p>
                        </div>

                        {/* Tombol Reset Filter jika sedang di kategori / pencarian tertentu */}
                        {(currentCategory || title.includes('Pencarian')) && (
                            <Link
                                href="/artikel"
                                className="inline-flex w-fit items-center gap-1.5 rounded-lg border border-[#dedbd2] bg-white px-3 py-2 text-[11px] font-bold text-[#444] transition hover:bg-[#fafaf8]"
                            >
                                Lihat Semua Artikel
                            </Link>
                        )}
                    </div>

                    {/* FILTER KATEGORI BADGES DI ATAS */}
                    <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                        <span className="flex items-center gap-1 text-[11px] font-bold text-[#888] shrink-0 mr-1">
                            <Filter size={12} /> Filter:
                        </span>
                        
                        {/* Tombol "Semua" HANYA aktif jika currentCategory bernilai null/undefined DAN bukan halaman pencarian */}
                        <Link
                            href="/artikel"
                            className={`rounded-full px-3.5 py-1.5 text-[11px] font-medium transition shrink-0 ${
                                !currentCategory && !title.includes('Kategori') && !title.includes('Pencarian')
                                    ? 'bg-[#063f2f] text-white font-bold shadow-sm'
                                    : 'bg-white border border-[#dedbd2] text-[#555] hover:bg-[#f5f4ef]'
                            }`}
                        >
                            Semua
                        </Link>

                        {categories && categories.map((cat) => {
                            // Deteksi aktif berdasarkan ID atau jika judul halaman mengandung nama kategori tersebut
                            const isActive = currentCategory?.id === cat.id || title.includes(cat.name);
                            return (
                                <Link
                                    key={cat.id}
                                    href={`/kategori/${cat.slug}`}
                                    className={`rounded-full px-3.5 py-1.5 text-[11px] font-medium transition shrink-0 ${
                                        isActive
                                            ? 'bg-[#063f2f] text-white font-bold shadow-sm'
                                            : 'bg-white border border-[#dedbd2] text-[#555] hover:bg-[#f5f4ef]'
                                    }`}
                                >
                                    {cat.name}
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* KONDISI: Jika Artikel Ada vs Tidak Ditemukan (Not Found) */}
                {articles.length > 0 ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {articles.map((article) => (
                            <ArticleCard key={article.id} article={article} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#dedbd2] bg-white py-16 px-6 text-center shadow-sm">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#f3f1eb] text-[#063f2f] mb-4">
                            <SearchX size={26} />
                        </div>
                        <h2 className="font-serif text-[18px] font-bold text-[#17251f]">
                            Artikel Tidak Ditemukan
                        </h2>
                        <p className="mt-1 max-w-md text-[13px] text-[#666] leading-relaxed">
                            Maaf, kata kunci pencarian atau kategori yang Anda pilih belum memiliki artikel terkait saat ini.
                        </p>
                        <div className="mt-6 flex items-center gap-3">
                            <Link
                                href="/artikel"
                                className="flex items-center gap-2 rounded-lg bg-[#063f2f] px-5 py-2.5 text-[12px] font-bold text-white transition hover:bg-[#07513c]"
                            >
                                Lihat Semua Artikel
                            </Link>
                            <Link
                                href="/home"
                                className="flex items-center gap-2 rounded-lg border border-[#dedbd2] bg-white px-5 py-2.5 text-[12px] font-bold text-[#444] transition hover:bg-[#fafaf8]"
                            >
                                <Home size={14} /> Beranda
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}