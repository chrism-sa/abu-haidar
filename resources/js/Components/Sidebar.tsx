import { Link } from "@inertiajs/react";
import { ArrowRight, BookOpen, Sparkles } from "lucide-react";
import React from "react";
import { Category, Quote } from "@/types";

function QuoteCard({ quote }: { quote: Quote | null }) {
    if (!quote) return null;

    // JIKA QUOTE ADALAH GAMBAR
    if (quote.image) {
        return (
            <div className="rounded-2xl border border-[#e8e4da] bg-white p-1.5 shadow-sm">
                <img
                    src={quote.image}
                    alt="Ayat Pilihan"
                    className="w-full rounded-[12px] object-cover"
                />
                {quote.article && (
                    <div className="mt-2 w-full border-t border-[#e8e4da] pt-3 pb-1">
                        <Link
                            href={`/artikel/${quote.article.slug}`}
                            className="group flex w-full items-center justify-center gap-2 text-[12px] font-bold text-[#0F4C3A] transition-colors hover:text-[#0a382a]"
                        >
                            Baca Tafsir Lengkap{" "}
                            <ArrowRight
                                size={14}
                                className="transition-transform group-hover:translate-x-1"
                            />
                        </Link>
                    </div>
                )}
            </div>
        );
    }

    // JIKA QUOTE ADALAH TEKS
    const isLongAyat = quote.arabic && quote.arabic.length > 60;

    // KUNCI DINAMIS: Ambil class font dari database (misal: "font-tajawal", "font-amiri")
    // Fallback ke "font-amiri" jika data font kosong atau belum ada di database
    const arabicFontClass = (quote as any).font || "font-amiri";

    return (
        <div className="rounded-2xl border border-[#e2ddd3] bg-white p-1.5 shadow-md shadow-[#0f4c3a]/5">
            <div className="relative flex flex-col items-center rounded-[12px] border border-[#e8e3d9] bg-gradient-to-b from-[#fdfbf7] to-[#f4f0e6] px-5 py-7 overflow-hidden">
                <div className="absolute -left-4 -top-4 h-16 w-16 rounded-full bg-[#0f4c3a]/[0.03]"></div>
                <div className="absolute -bottom-4 -right-4 h-16 w-16 rounded-full bg-[#0f4c3a]/[0.03]"></div>

                <div className="relative z-10 mb-5 flex w-full items-center justify-center gap-3">
                    <div className="h-[1px] w-8 bg-[#d8d2c4]"></div>
                    <h3 className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#0F4C3A]">
                        <Sparkles size={12} className="text-[#C5A059]" />
                        Ayat Pilihan
                    </h3>
                    <div className="h-[1px] w-8 bg-[#d8d2c4]"></div>
                </div>

                <p
                    dir="rtl"
                    lang="ar"
                    style={{
                        lineHeight: isLongAyat ? "1.55" : "1.7",
                        letterSpacing: "normal", // Wajib "normal", jangan "0"
                        // PERBAIKAN: fontFeatureSettings dihapus karena merusak ligatures Arab!
                    }}
                    className={`relative z-10 quote-card-arabic ${arabicFontClass} text-[#0F4C3A] [text-wrap:balance] ${
                        isLongAyat ? "text-[24px]" : "text-[28px]"
                    }`}
                >
                    {quote.arabic}
                </p>

                <div className="relative z-10 mx-auto my-5 flex w-full max-w-[100px] items-center justify-center gap-3">
                    <div className="h-[1px] w-full bg-[#d8d2c4]"></div>
                    <div className="text-[9px] text-[#C5A059]">♦</div>
                    <div className="h-[1px] w-full bg-[#d8d2c4]"></div>
                </div>

                <p className="relative z-10 text-center text-[13px] italic leading-relaxed text-[#555] [text-wrap:balance]">
                    "{quote.translation}"
                </p>

                <div className="relative z-10 mt-5 inline-flex items-center justify-center rounded-full bg-[#E8EFEA] px-4 py-1.5 text-[11px] font-bold tracking-wide text-[#0F4C3A]">
                    {quote.reference}
                </div>

                {quote.article && (
                    <div className="relative z-10 mt-6 w-full border-t border-[#e8e3d9] pt-4">
                        <Link
                            href={`/artikel/${quote.article.slug}`}
                            className="group flex w-full items-center justify-center gap-2 text-[12px] font-bold text-[#0F4C3A] transition-colors hover:text-[#0a382a]"
                        >
                            Baca Tafsir Lengkap{" "}
                            <ArrowRight
                                size={14}
                                className="transition-transform group-hover:translate-x-1"
                            />
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function Sidebar({
    categories,
    quote,
}: {
    categories: Category[];
    quote: Quote | null;
}) {
    // ... (Kode Sidebar bagian Kategori tetap sama persis seperti sebelumnya)
    return (
        <aside className="space-y-6">
            <QuoteCard quote={quote} />

            <section className="rounded-2xl border border-[#e8e4da] bg-white p-6 shadow-sm">
                <h3 className="mb-4 border-b border-[#f0eee9] pb-3 font-serif text-[16px] font-bold text-[#17251f]">
                    Kategori
                </h3>
                <div className="space-y-1">
                    {categories.map((category) => (
                        <Link
                            href={`/kategori/${category.slug}`}
                            key={category.id}
                            className="group flex items-center justify-between rounded-xl px-3 py-2.5 text-[13px] transition hover:bg-[#fafaf8]"
                        >
                            <span className="flex items-center gap-3 text-[#555] transition-colors group-hover:font-medium group-hover:text-[#063f2f]">
                                <BookOpen
                                    size={14}
                                    className="text-[#063f2f]/60 transition-colors group-hover:text-[#063f2f]"
                                />
                                {category.name}
                            </span>
                            <span className="rounded-full bg-[#f0eee9] px-2.5 py-0.5 text-[10px] font-bold text-[#777] transition-colors group-hover:bg-[#063f2f] group-hover:text-white">
                                {category.articles_count}
                            </span>
                        </Link>
                    ))}
                </div>
            </section>
        </aside>
    );
}
