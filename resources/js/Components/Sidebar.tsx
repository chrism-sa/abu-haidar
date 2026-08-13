import { ArrowRight, BookOpen } from 'lucide-react';
import { Category, Quote } from '../types';
import { Link } from '@inertiajs/react';

// Komponen internal QuoteCard (tidak pakai export default)
function QuoteCard({ quote }: { quote: Quote | null }) {
    if (!quote) return null; // Sembunyikan jika admin belum mengisi data

    return (
        <div className="rounded-xl border border-[#e8dfce] bg-[#faf7f0] p-6 text-center shadow-sm">
            <h3 className="mb-5 text-[10px] font-bold uppercase tracking-widest text-[#0c6247]">
                Ayat Pilihan
            </h3>
            <p dir="rtl" className="font-serif text-[26px] leading-[1.8] text-[#173c2f]">
                {quote.arabic}
            </p>
            <p className="mt-4 text-[11px] italic leading-relaxed text-[#555]">
                “{quote.translation}”
            </p>
            <p className="mt-3 text-[10px] font-bold text-[#174f3b]">
                ({quote.reference})
            </p>

            {/* Tombol Baca Tafsir yang mengarah ke halaman artikel */}
            {quote.article && (
                <Link
                    href={`/artikel/${quote.article.slug}`}
                    className="mx-auto mt-5 flex w-fit items-center justify-center gap-1 text-[11px] font-bold text-[#126047] transition hover:underline"
                >
                    Baca Tafsir <ArrowRight size={12} />
                </Link>
            )}
        </div>
    );
}

// Hanya ada SATU export default di sini untuk komponen Sidebar
export default function Sidebar({ categories, quote }: { categories: Category[], quote: Quote | null }) {
    return (
        <aside className="space-y-6">
            <QuoteCard quote={quote} />

            <section className="rounded-xl border border-[#e8e4da] bg-white p-6">
                <h3 className="font-serif text-[15px] font-bold text-[#17251f] border-b border-[#f0eee9] pb-3 mb-4">
                    Kategori
                </h3>
                <div className="space-y-3">
                    {categories.map((category) => (
                        <Link href={`/kategori/${category.slug}`} key={category.id} className="flex items-center justify-between text-[12px] group">
                            <span className="flex items-center gap-2 text-[#555] group-hover:text-[#126047] transition-colors">
                                <BookOpen size={13} className="text-[#126047]" />
                                {category.name}
                            </span>
                            <span className="text-[#999] bg-[#f5f5f5] px-2 py-0.5 rounded text-[10px]">
                                {category.articles_count}
                            </span>
                        </Link>
                    ))}
                </div>
            </section>
        </aside>
    );
}