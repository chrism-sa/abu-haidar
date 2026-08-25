import { Link } from "@inertiajs/react";
import {
    ArrowRight,
    BookOpen,
    Sparkles,
    Download,
    FileText,
} from "lucide-react";
import React from "react";
import { Category, Quote } from "@/types";

export interface EbookSidebarItem {
    id: number;
    title: string;
    slug: string;
    file_path: string;
    file_size?: string;
    author?: string;
}

const getYouTubeId = (url: string | null | undefined) => {
    if (!url) return null;
    const regExp =
        /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
};

function QuoteCard({ quote }: { quote: Quote | null }) {
    if (!quote) return null;

    const ytId = quote.image ? getYouTubeId(quote.image) : null;

    if (ytId) {
        return (
            <div className="rounded-2xl border border-[#E8CEBC] bg-[#FDF9F5] p-2 shadow-sm">
                <div className="aspect-video w-full overflow-hidden rounded-xl bg-black shadow-inner">
                    <iframe
                        src={`https://www.youtube.com/embed/${ytId}`}
                        className="h-full w-full border-0"
                        allowFullScreen
                    />
                </div>
                {quote.article && (
                    <div className="mt-2.5 w-full border-t border-[#E8CEBC]/60 pt-2.5 pb-1">
                        <Link
                            href={`/artikel/${quote.article.slug}`}
                            className="group flex w-full items-center justify-center gap-2 text-[12px] font-bold text-[#1D4533] transition-colors hover:text-[#5E3122]"
                        >
                            <span>Baca Kajian Selengkapnya</span>
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

    if (quote.image) {
        return (
            <div className="rounded-2xl border border-[#E8CEBC] bg-[#FDF9F5] p-2 shadow-sm">
                <img
                    src={quote.image}
                    alt="Ayat Pilihan"
                    className="w-full rounded-xl object-cover"
                />
                {quote.article && (
                    <div className="mt-2.5 w-full border-t border-[#E8CEBC]/60 pt-2.5 pb-1">
                        <Link
                            href={`/artikel/${quote.article.slug}`}
                            className="group flex w-full items-center justify-center gap-2 text-[12px] font-bold text-[#1D4533] transition-colors hover:text-[#5E3122]"
                        >
                            <span>Baca Tafsir Lengkap</span>
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

    const quoteFontClass = (quote as any).font || "font-adobe-naskh";
    const quoteFontSize = (quote as any).font_size
        ? `${(quote as any).font_size}px`
        : "28px";
    const quoteColor = (quote as any).color || "#1D4533";

    return (
        <div className="rounded-2xl border border-[#E8CEBC] bg-[#FDF9F5] p-2 shadow-sm">
            <div className="relative flex flex-col items-center rounded-xl border border-[#E8CEBC]/60 bg-gradient-to-b from-[#FAF3EB] to-[#F5E6D8] px-5 py-7 overflow-hidden">
                <div className="absolute -left-4 -top-4 h-16 w-16 rounded-full bg-[#1D4533]/[0.04]"></div>
                <div className="absolute -bottom-4 -right-4 h-16 w-16 rounded-full bg-[#1D4533]/[0.04]"></div>

                <div className="relative z-10 mb-5 flex w-full items-center justify-center gap-3">
                    <div className="h-[1px] w-8 bg-[#E8CEBC]"></div>
                    <h3 className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#1D4533]">
                        <Sparkles size={12} className="text-[#8C5E43]" />
                        Ayat Pilihan
                    </h3>
                    <div className="h-[1px] w-8 bg-[#E8CEBC]"></div>
                </div>

                <p
                    dir="rtl"
                    lang="ar"
                    style={{
                        fontSize: quoteFontSize,
                        color: quoteColor,
                        lineHeight: 2.2,
                        letterSpacing: "normal",
                    }}
                    className={`${quoteFontClass} relative z-10 quote-card-arabic [text-wrap:balance]`}
                >
                    {quote.arabic}
                </p>

                <div className="relative z-10 mx-auto my-4 flex w-full max-w-[100px] items-center justify-center gap-3">
                    <div className="h-[1px] w-full bg-[#E8CEBC]"></div>
                    <div className="text-[9px] text-[#1D4533]">♦</div>
                    <div className="h-[1px] w-full bg-[#E8CEBC]"></div>
                </div>

                <p className="relative z-10 text-center text-[13px] italic leading-relaxed text-[#5E3122]/80 [text-wrap:balance]">
                    "{quote.translation}"
                </p>

                {quote.reference && (
                    <div className="relative z-10 mt-4 inline-flex items-center justify-center rounded-full bg-[#1D4533]/10 border border-[#E8CEBC] px-4 py-1.5 text-[11px] font-bold tracking-wide text-[#1D4533]">
                        {quote.reference}
                    </div>
                )}

                {quote.article && (
                    <div className="relative z-10 mt-5 w-full border-t border-[#E8CEBC]/60 pt-3.5">
                        <Link
                            href={`/artikel/${quote.article.slug}`}
                            className="group flex w-full items-center justify-center gap-2 text-[12px] font-bold text-[#1D4533] transition-colors hover:text-[#5E3122]"
                        >
                            <span>Baca Tafsir Lengkap</span>
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
    ebooks,
}: {
    categories: Category[];
    quote: Quote | null;
    ebooks?: EbookSidebarItem[];
}) {
    return (
        <aside className="space-y-6">
            <QuoteCard quote={quote} />

            {ebooks && ebooks.length > 0 ? (
                <section className="rounded-2xl border border-[#E8CEBC] bg-[#FDF9F5] p-5 shadow-sm">
                    <div className="mb-3 flex items-center justify-between border-b border-[#E8CEBC] pb-3">
                        <h3 className="font-brand text-[15px] font-bold text-[#1D4533] flex items-center gap-2">
                            <FileText size={17} className="text-[#1D4533]" />
                            E-Book
                        </h3>
                        <span className="rounded-full bg-[#F2E2D5] px-2 py-0.5 text-[9px] font-bold uppercase text-[#5E3122]">
                            PDF
                        </span>
                    </div>

                    <p className="text-[12px] leading-relaxed text-[#5E3122]/70 mb-4">
                        Unduh buku saku, modul kajian sunnah, dan naskah risalah
                        dakwah ringkas secara gratis.
                    </p>

                    <div className="space-y-2.5">
                        {ebooks.slice(0, 3).map((eb) => (
                            <Link
                                key={eb.id}
                                href={`/ebook/${eb.slug}`}
                                className="group flex items-center justify-between rounded-xl border border-[#E8CEBC] bg-[#FAF3EB] p-3 transition hover:border-[#1D4533] hover:bg-[#F2E2D5]"
                            >
                                <div className="min-w-0 pr-2">
                                    <div className="font-brand text-[13px] font-bold text-[#1D4533] truncate group-hover:text-[#5E3122]">
                                        {eb.title}
                                    </div>
                                    <div className="text-[10px] text-[#5E3122]/60 mt-0.5">
                                        {eb.author || "Abu Haidar"}{" "}
                                        {eb.file_size
                                            ? `• ${eb.file_size}`
                                            : ""}
                                    </div>
                                </div>
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#1D4533] text-[#F7EAE0] transition-transform group-hover:scale-105">
                                    <Download size={14} />
                                </div>
                            </Link>
                        ))}
                    </div>

                    <Link
                        href="/ebook"
                        className="mt-3.5 block text-center text-[11px] font-bold text-[#1D4533] hover:text-[#5E3122] transition-colors"
                    >
                        Lihat Semua Risalah & E-Book →
                    </Link>
                </section>
            ) : null}

            <section className="rounded-2xl border border-[#E8CEBC] bg-[#FDF9F5] p-5 shadow-sm">
                <h3 className="mb-4 border-b border-[#E8CEBC] pb-3 font-brand text-[15px] font-bold text-[#1D4533]">
                    Kategori Kajian
                </h3>
                <div className="space-y-1">
                    {categories.map((category) => (
                        <Link
                            href={`/kategori/${category.slug}`}
                            key={category.id}
                            className="group flex items-center justify-between rounded-xl px-3 py-2.5 text-[13px] transition hover:bg-[#F2E2D5]"
                        >
                            <span className="flex items-center gap-3 text-[#5E3122] transition-colors group-hover:font-bold group-hover:text-[#1D4533]">
                                <BookOpen
                                    size={14}
                                    className="text-[#1D4533]/60 transition-colors group-hover:text-[#1D4533]"
                                />
                                {category.name}
                            </span>
                            <span className="rounded-full bg-[#F2E2D5] px-2.5 py-0.5 text-[10px] font-bold text-[#5E3122] transition-colors group-hover:bg-[#1D4533] group-hover:text-[#F7EAE0]">
                                {category.articles_count}
                            </span>
                        </Link>
                    ))}
                </div>
            </section>
        </aside>
    );
}
