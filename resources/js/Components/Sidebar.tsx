import { Link, usePage } from "@inertiajs/react";
import {
    ArrowRight,
    BookOpen,
    Sparkles,
    Download,
    FileText,
    Sliders,
    RotateCcw,
    X,
    Check,
} from "lucide-react";
import React, { useState, useEffect } from "react";
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

interface TypographySettings {
    widgetTitleSize: number; // Ukuran Judul Widget
    arabicFontSize: number; // Ukuran Ayat Arab
    arabicLineHeight: number; // Spasi Baris Ayat Arab
    translationSize: number; // Ukuran Terjemahan / Arti
    descriptionSize: number; // Ukuran Deskripsi Ebook/Kajian
}

const DEFAULT_SETTINGS: TypographySettings = {
    widgetTitleSize: 10.5,
    arabicFontSize: 36,
    arabicLineHeight: 2.5,
    translationSize: 13.5,
    descriptionSize: 12,
};

function QuoteCard({
    quote,
    settings,
}: {
    quote: Quote | null;
    settings: TypographySettings;
}) {
    if (!quote) return null;

    const ytId = quote.image ? getYouTubeId(quote.image) : null;

    if (ytId) {
        return (
            <div className="rounded-2xl border border-[#E8CEBC] bg-[#FDF9F5] p-2.5 shadow-xs">
                <div className="aspect-video w-full overflow-hidden rounded-xl bg-black">
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
                            className="group flex w-full items-center justify-center gap-1.5 text-[12px] font-bold text-[#1D4533] transition-colors hover:text-[#5E3122]"
                        >
                            <span>Baca Kajian Selengkapnya</span>
                            <ArrowRight
                                size={13}
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
            <div className="rounded-2xl border border-[#E8CEBC] bg-[#FDF9F5] p-2.5 shadow-xs">
                <img
                    src={quote.image}
                    alt="Ayat Pilihan"
                    className="w-full rounded-xl object-cover"
                />
                {quote.article && (
                    <div className="mt-2.5 w-full border-t border-[#E8CEBC]/60 pt-2.5 pb-1">
                        <Link
                            href={`/artikel/${quote.article.slug}`}
                            className="group flex w-full items-center justify-center gap-1.5 text-[12px] font-bold text-[#1D4533] transition-colors hover:text-[#5E3122]"
                        >
                            <span>Baca Tafsir Lengkap</span>
                            <ArrowRight
                                size={13}
                                className="transition-transform group-hover:translate-x-1"
                            />
                        </Link>
                    </div>
                )}
            </div>
        );
    }

    // Parsing data styling
    const dbFontSize = (quote as any).font_size
        ? Number((quote as any).font_size)
        : settings.arabicFontSize;
    const dbLineHeight = (quote as any).line_height
        ? Number((quote as any).line_height)
        : settings.arabicLineHeight;
    const quoteFontClass = (quote as any).font || "font-adobe-naskh";
    const quoteColor = (quote as any).color || "#1D4533";

    // Hitung line-height ideal agar tidak renggang/terpisah jauh
    const computedFontSize = settings.arabicFontSize || dbFontSize || 28;
    const computedLineHeight = settings.arabicLineHeight || dbLineHeight || 1.8;

    return (
        <div className="rounded-3xl border border-[#E8CEBC] bg-[#FDF9F5] p-2 sm:p-2.5 shadow-xs">
            <div className="relative flex flex-col items-center rounded-2xl border border-[#E8CEBC]/60 bg-gradient-to-b from-[#FAF3EB] via-[#FAF3EB] to-[#F5E6D8]/70 px-5 py-6 overflow-hidden text-center">
                {/* Background Accent Orbs Lembut */}
                <div className="absolute -left-6 -top-6 h-20 w-20 rounded-full bg-[#1D4533]/[0.03] pointer-events-none" />
                <div className="absolute -bottom-6 -right-6 h-20 w-20 rounded-full bg-[#E8CEBC]/30 pointer-events-none" />

                {/* 1. Header Label */}
                <div className="relative z-10 mb-4 flex w-full items-center justify-center gap-2.5">
                    <div className="h-[1px] w-6 bg-[#E8CEBC]"></div>
                    <h3
                        style={{ fontSize: `${settings.widgetTitleSize}px` }}
                        className="flex items-center gap-1.5 font-bold uppercase tracking-[0.18em] text-[#1D4533]"
                    >
                        <Sparkles size={12} className="text-[#8C5E43]" />
                        Ayat & Mutiara Pilihan
                        <Sparkles size={12} className="text-[#8C5E43]" />
                    </h3>
                    <div className="h-[1px] w-6 bg-[#E8CEBC]"></div>
                </div>

                {/* Teks Arab (Ukuran & Spasi Baris Terhubung ke Pengaturan) */}
                <p
                    dir="rtl"
                    lang="ar"
                    style={{
                        fontSize: `${settings.arabicFontSize || dbFontSize}px`,
                        color: quoteColor,
                        lineHeight: settings.arabicLineHeight || dbLineHeight,
                        letterSpacing: "normal",
                        wordSpacing: "normal",
                    }}
                    className={`${quoteFontClass} relative z-10 w-full text-center quote-card-arabic my-2 [text-wrap:balance] select-text`}
                >
                    {quote.arabic}
                </p>

                {/* 3. Garis Pembatas Cantik */}
                <div className="relative z-10 my-3 flex items-center justify-center gap-2 w-28">
                    <div className="h-[1px] w-full bg-[#E8CEBC]"></div>
                    <div className="text-[9px] text-[#8C5E43] font-serif">
                        ♦
                    </div>
                    <div className="h-[1px] w-full bg-[#E8CEBC]"></div>
                </div>

                {/* 4. Terjemahan Arti */}
                {quote.translation && (
                    <p
                        style={{ fontSize: `${settings.translationSize}px` }}
                        className="relative z-10 text-center italic leading-relaxed text-[#5E3122]/90 px-2 [text-wrap:balance]"
                    >
                        "{quote.translation}"
                    </p>
                )}

                {/* 5. Referensi / Surat (Warm Pill) */}
                {quote.reference && (
                    <div className="relative z-10 mt-3.5 inline-flex items-center justify-center rounded-full bg-[#FAF3EB] border border-[#E8CEBC] px-3.5 py-0.5 text-[10.5px] font-bold tracking-wide text-[#1D4533] shadow-2xs">
                        {quote.reference}
                    </div>
                )}

                {/* 6. Link Baca Tafsir Lengkap */}
                {quote.article && (
                    <div className="relative z-10 mt-5 w-full border-t border-[#E8CEBC]/60 pt-3">
                        <Link
                            href={`/artikel/${quote.article.slug}`}
                            className="group inline-flex items-center justify-center gap-1.5 text-[12px] font-bold text-[#1D4533] transition-colors hover:text-[#8C5E43]"
                        >
                            <span>Baca Tafsir Lengkap</span>
                            <ArrowRight
                                size={13}
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
    const { auth } = usePage<any>().props;
    const isAdmin = Boolean(auth?.user);

    // Load setting dari LocalStorage atau default
    const [settings, setSettings] = useState<TypographySettings>(() => {
        try {
            const saved = localStorage.getItem("abu_haidar_sidebar_typography");
            return saved
                ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) }
                : DEFAULT_SETTINGS;
        } catch {
            return DEFAULT_SETTINGS;
        }
    });

    const [isPanelOpen, setIsPanelOpen] = useState(false);

    const handleSettingChange = (
        key: keyof TypographySettings,
        value: number,
    ) => {
        setSettings((prev) => {
            const updated = { ...prev, [key]: value };
            localStorage.setItem(
                "abu_haidar_sidebar_typography",
                JSON.stringify(updated),
            );
            return updated;
        });
    };

    const handleReset = () => {
        setSettings(DEFAULT_SETTINGS);
        localStorage.removeItem("abu_haidar_sidebar_typography");
    };

    return (
        <aside className="space-y-6 relative">
            {/* ================= ADMIN FLOATING CUSTOMIZER BUTTON ================= */}
            {isAdmin && (
                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={() => setIsPanelOpen(!isPanelOpen)}
                        className="inline-flex items-center gap-1.5 rounded-full border border-[#E8CEBC] bg-[#FAF3EB] px-3 py-1 text-[11px] font-bold text-[#1D4533] shadow-xs hover:bg-[#F2E2D5] transition-all cursor-pointer"
                        title="Atur Tipografi Sidebar (Mode Admin)"
                    >
                        <Sliders size={13} />
                        <span>Kustomisasi Font Sidebar</span>
                    </button>
                </div>
            )}

            {/* ================= ADMIN ADJUSTER MODAL / DRAWER ================= */}
            {isAdmin && isPanelOpen && (
                <div className="rounded-2xl border border-[#1D4533]/30 bg-[#FDF9F5] p-4 shadow-md space-y-3.5 animate-fade-in text-[12px]">
                    <div className="flex items-center justify-between border-b border-[#E8CEBC] pb-2">
                        <span className="font-brand font-bold text-[#1D4533] flex items-center gap-1.5">
                            <Sliders size={14} /> Kontrol Tampilan Sidebar
                        </span>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={handleReset}
                                className="text-[10.5px] font-bold text-[#8C5E43] hover:text-[#1D4533] flex items-center gap-1"
                                title="Kembalikan ke Default"
                            >
                                <RotateCcw size={11} /> Reset
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsPanelOpen(false)}
                                className="text-[#5E3122]/70 hover:text-black p-0.5"
                            >
                                <X size={15} />
                            </button>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {/* 1. Ukuran Judul Widget */}
                        <div>
                            <div className="flex justify-between font-bold text-[11px] text-[#5E3122] mb-1">
                                <span>Judul Widget Sidebar</span>
                                <span>{settings.widgetTitleSize}px</span>
                            </div>
                            <input
                                type="range"
                                min={9}
                                max={16}
                                step={0.5}
                                value={settings.widgetTitleSize}
                                onChange={(e) =>
                                    handleSettingChange(
                                        "widgetTitleSize",
                                        Number(e.target.value),
                                    )
                                }
                                className="w-full h-1.5 bg-[#E8CEBC] rounded-lg appearance-none cursor-pointer accent-[#1D4533]"
                            />
                        </div>

                        {/* 2. Ukuran Ayat Arab */}
                        <div>
                            <div className="flex justify-between font-bold text-[11px] text-[#5E3122] mb-1">
                                <span>Ukuran Ayat Arab</span>
                                <span>{settings.arabicFontSize}px</span>
                            </div>
                            <input
                                type="range"
                                min={20}
                                max={48}
                                step={1}
                                value={settings.arabicFontSize}
                                onChange={(e) =>
                                    handleSettingChange(
                                        "arabicFontSize",
                                        Number(e.target.value),
                                    )
                                }
                                className="w-full h-1.5 bg-[#E8CEBC] rounded-lg appearance-none cursor-pointer accent-[#1D4533]"
                            />
                        </div>

                        {/* 3. Spasi Baris Arab */}
                        <div>
                            <div className="flex justify-between font-bold text-[11px] text-[#5E3122] mb-1">
                                <span>Spasi Baris Arab (Line Height)</span>
                                <span>
                                    {settings.arabicLineHeight.toFixed(1)}x
                                </span>
                            </div>
                            <input
                                type="range"
                                min={1.6}
                                max={3.6}
                                step={0.1}
                                value={settings.arabicLineHeight}
                                onChange={(e) =>
                                    handleSettingChange(
                                        "arabicLineHeight",
                                        Number(e.target.value),
                                    )
                                }
                                className="w-full h-1.5 bg-[#E8CEBC] rounded-lg appearance-none cursor-pointer accent-[#1D4533]"
                            />
                        </div>

                        {/* 4. Ukuran Terjemahan */}
                        <div>
                            <div className="flex justify-between font-bold text-[11px] text-[#5E3122] mb-1">
                                <span>Ukuran Terjemahan Arti</span>
                                <span>{settings.translationSize}px</span>
                            </div>
                            <input
                                type="range"
                                min={11}
                                max={18}
                                step={0.5}
                                value={settings.translationSize}
                                onChange={(e) =>
                                    handleSettingChange(
                                        "translationSize",
                                        Number(e.target.value),
                                    )
                                }
                                className="w-full h-1.5 bg-[#E8CEBC] rounded-lg appearance-none cursor-pointer accent-[#1D4533]"
                            />
                        </div>

                        {/* 5. Ukuran Deskripsi */}
                        <div>
                            <div className="flex justify-between font-bold text-[11px] text-[#5E3122] mb-1">
                                <span>Ukuran Teks Deskripsi</span>
                                <span>{settings.descriptionSize}px</span>
                            </div>
                            <input
                                type="range"
                                min={10}
                                max={15}
                                step={0.5}
                                value={settings.descriptionSize}
                                onChange={(e) =>
                                    handleSettingChange(
                                        "descriptionSize",
                                        Number(e.target.value),
                                    )
                                }
                                className="w-full h-1.5 bg-[#E8CEBC] rounded-lg appearance-none cursor-pointer accent-[#1D4533]"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* ================= 1. KUTIPAN / AYAT PILIHAN ================= */}
            <QuoteCard quote={quote} settings={settings} />

            {/* ================= 2. E-BOOK WIDGET ================= */}
            {ebooks && ebooks.length > 0 ? (
                <section className="rounded-2xl border border-[#E8CEBC] bg-[#FDF9F5] p-5 shadow-sm">
                    <div className="mb-3 flex items-center justify-between border-b border-[#E8CEBC] pb-3">
                        <h3
                            style={{
                                fontSize: `${settings.widgetTitleSize + 4.5}px`,
                            }}
                            className="font-brand font-bold text-[#1D4533] flex items-center gap-2"
                        >
                            <FileText size={17} className="text-[#1D4533]" />
                            E-Book & Risalah
                        </h3>
                        <span className="rounded-full bg-[#F2E2D5] px-2 py-0.5 text-[9px] font-bold uppercase text-[#5E3122]">
                            PDF
                        </span>
                    </div>

                    <p
                        style={{ fontSize: `${settings.descriptionSize}px` }}
                        className="leading-relaxed text-[#5E3122]/70 mb-4"
                    >
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
                        className="mt-3.5 block text-center text-[11.5px] font-bold text-[#1D4533] hover:text-[#5E3122] transition-colors"
                    >
                        Lihat Semua Risalah & E-Book →
                    </Link>
                </section>
            ) : null}

            {/* ================= 3. KATEGORI WIDGET ================= */}
            <section className="rounded-2xl border border-[#E8CEBC] bg-[#FDF9F5] p-5 shadow-sm">
                <h3
                    style={{ fontSize: `${settings.widgetTitleSize + 4.5}px` }}
                    className="mb-4 border-b border-[#E8CEBC] pb-3 font-brand font-bold text-[#1D4533]"
                >
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
