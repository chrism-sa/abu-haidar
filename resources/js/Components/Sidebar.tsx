import { Link, usePage, router } from "@inertiajs/react";
import {
    ArrowRight,
    BookOpen,
    Sparkles,
    Download,
    FileText,
    Sliders,
    RotateCcw,
    X,
    Save,
} from "lucide-react";
import React, { useState } from "react";
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

interface TextCustomization {
    widgetTitleSize: number; // Ukuran Judul Widget (Ayat Pilihan)
    translationSize: number; // Ukuran Terjemahan / Arti
    referenceSize: number; // Ukuran Nama Surat / Referensi
}

const DEFAULT_SETTINGS: TextCustomization = {
    widgetTitleSize: 12,
    translationSize: 14.5,
    referenceSize: 11.5,
};

function QuoteCard({
    quote,
    settings,
}: {
    quote: Quote | null;
    settings: TextCustomization;
}) {
    if (!quote) return null;

    const ytId = quote.image ? getYouTubeId(quote.image) : null;

    if (ytId) {
        return (
            <div className="rounded-3xl border border-[#E6CEBC] bg-[#FAF1E8] p-3 shadow-xs">
                <div className="aspect-video w-full overflow-hidden rounded-2xl bg-black">
                    <iframe
                        src={`https://www.youtube.com/embed/${ytId}`}
                        className="h-full w-full border-0"
                        allowFullScreen
                    />
                </div>
                {quote.article && (
                    <div className="mt-3 w-full border-t border-[#E6CEBC]/90 pt-2.5 pb-0.5 text-center">
                        <Link
                            href={`/artikel/${quote.article.slug}`}
                            className="group inline-flex items-center justify-center gap-1.5 text-[12.5px] font-bold text-[#1D4533] transition-opacity hover:opacity-80"
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
            <div className="rounded-3xl border border-[#E6CEBC] bg-[#FAF1E8] p-3 shadow-xs">
                <img
                    src={quote.image}
                    alt="Ayat Pilihan"
                    className="w-full rounded-2xl object-cover"
                />
                {quote.article && (
                    <div className="mt-3 w-full border-t border-[#E6CEBC]/90 pt-2.5 pb-0.5 text-center">
                        <Link
                            href={`/artikel/${quote.article.slug}`}
                            className="group inline-flex items-center justify-center gap-1.5 text-[12.5px] font-bold text-[#1D4533] transition-opacity hover:opacity-80"
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

    // Ambil murni styling Arab dari database
    const dbFont = (quote as any).font || "font-adobe-naskh";
    const dbFontSize = Number((quote as any).font_size) || 36;
    const dbLineHeight = Number((quote as any).line_height) || 2.4;
    const dbColor = (quote as any).color || "#1D4533";

    const cleanArabic = quote.arabic
        ? quote.arabic.replace(/<[^>]*>?/gm, "").trim()
        : "";

    return (
        <div className="rounded-3xl border border-[#E6CEBC] bg-[#FAF1E8] p-5 sm:p-6 shadow-xs relative overflow-hidden text-center w-full">
            <div className="flex flex-col items-center justify-center text-center w-full">
                {/* 1. Judul Header (Disesuaikan Admin) */}
                <div className="mb-4 flex w-full items-center justify-center gap-2.5">
                    <div className="h-[1px] w-8 shrink-0 bg-[#E6CEBC]" />
                    <h3
                        style={{ fontSize: `${settings.widgetTitleSize}px` }}
                        className="flex items-center justify-center gap-1.5 font-bold uppercase tracking-[0.18em] text-[#1D4533] leading-none"
                    >
                        <Sparkles
                            size={13}
                            className="text-[#8C5E43] shrink-0"
                        />
                        <span>Ayat Pilihan</span>
                        <Sparkles
                            size={13}
                            className="text-[#8C5E43] shrink-0"
                        />
                    </h3>
                    <div className="h-[1px] w-8 shrink-0 bg-[#E6CEBC]" />
                </div>

                {/* 2. Teks Arab: 100% Rata Tengah tanpa terdorong ke kanan */}
                <div className="my-3 w-full flex justify-center items-center text-center">
                    <div
                        style={{
                            fontSize: `${dbFontSize}px`,
                            lineHeight: dbLineHeight,
                            color: dbColor,
                            textAlign: "center",
                            textAlignLast: "center",
                            unicodeBidi: "plaintext",
                        }}
                        className={`${dbFont} w-full text-center mx-auto select-text [text-wrap:balance] tracking-normal`}
                    >
                        {cleanArabic}
                    </div>
                </div>

                {/* 3. Garis Pembatas */}
                <div className="my-3.5 flex items-center justify-center gap-2 w-28 mx-auto">
                    <div className="h-[1px] w-full bg-[#E6CEBC]" />
                    <div className="text-[9px] text-[#8C5E43] font-serif leading-none">
                        ♦
                    </div>
                    <div className="h-[1px] w-full bg-[#E6CEBC]" />
                </div>

                {/* 4. Terjemahan Arti (Disesuaikan Admin) */}
                {quote.translation && (
                    <p
                        style={{ fontSize: `${settings.translationSize}px` }}
                        className="text-center italic leading-relaxed text-[#4A2619] px-2 [text-wrap:balance] font-medium"
                    >
                        "{quote.translation.replace(/<[^>]*>?/gm, "").trim()}"
                    </p>
                )}

                {/* 5. Nama Surat / Referensi (Disesuaikan Admin) */}
                {quote.reference && (
                    <div
                        style={{ fontSize: `${settings.referenceSize}px` }}
                        className="mt-3.5 inline-flex items-center justify-center rounded-full border border-[#E6CEBC] bg-[#F2E0D2] px-4 py-1 font-extrabold tracking-wide text-[#1D4533] shadow-2xs"
                    >
                        {quote.reference}
                    </div>
                )}

                {/* 6. Link Baca Tafsir Lengkap */}
                {quote.article && (
                    <div className="mt-5 w-full border-t border-[#E6CEBC]/90 pt-3 flex justify-center">
                        <Link
                            href={`/artikel/${quote.article.slug}`}
                            className="group inline-flex items-center justify-center gap-1.5 text-[12.5px] font-bold text-[#1D4533] transition-opacity hover:opacity-80"
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
    const { auth, globalSidebarStyle } = usePage<any>().props;
    const isAdmin = Boolean(auth?.user);

    // Prioritaskan nilai dari database backend agar tampil seragam ke semua pengunjung
    const [settings, setSettings] = useState<TextCustomization>(() => {
        if (globalSidebarStyle) {
            return { ...DEFAULT_SETTINGS, ...globalSidebarStyle };
        }
        try {
            const saved = localStorage.getItem("abu_haidar_sidebar_settings");
            return saved
                ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) }
                : DEFAULT_SETTINGS;
        } catch {
            return DEFAULT_SETTINGS;
        }
    });

    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [saving, setSaving] = useState(false);

    const handleSettingChange = (
        key: keyof TextCustomization,
        value: number,
    ) => {
        setSettings((prev) => {
            const updated = { ...prev, [key]: value };
            localStorage.setItem(
                "abu_haidar_sidebar_settings",
                JSON.stringify(updated),
            );
            return updated;
        });
    };

    const handleReset = () => {
        setSettings(DEFAULT_SETTINGS);
        localStorage.removeItem("abu_haidar_sidebar_settings");
    };

    // Simpan permanen ke MySQL agar berlaku untuk semua pengunjung
    const handleSaveGlobal = () => {
        setSaving(true);
        router.post(
            "/admin/settings/save",
            {
                key: "sidebar_style",
                value: settings,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setSaving(false);
                    setIsPanelOpen(false);
                    alert(
                        "Pengaturan teks berhasil disimpan untuk seluruh pengunjung!",
                    );
                },
                onError: () => setSaving(false),
            },
        );
    };

    return (
        <aside className="space-y-6 relative">
            {/* Tombol Kustomisasi (Khusus Admin) */}
            {isAdmin && (
                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={() => setIsPanelOpen(!isPanelOpen)}
                        className="inline-flex items-center gap-1.5 rounded-full border border-[#E6CEBC] bg-[#FAF1E8] px-3.5 py-1 text-[11px] font-bold text-[#1D4533] shadow-xs hover:bg-[#F2E0D2] transition-all cursor-pointer"
                    >
                        <Sliders size={13} />
                        <span>Kustomisasi Teks Sidebar</span>
                    </button>
                </div>
            )}

            {/* Panel Pengaturan Khusus Ukuran Teks */}
            {isAdmin && isPanelOpen && (
                <div className="rounded-3xl border border-[#1D4533]/30 bg-[#FAF1E8] p-4 sm:p-5 shadow-lg space-y-4 animate-fade-in text-[12px]">
                    <div className="flex items-center justify-between border-b border-[#E6CEBC] pb-2.5">
                        <span className="font-brand font-bold text-[#1D4533] flex items-center gap-1.5">
                            <Sliders size={14} /> Atur Ukuran Teks Sidebar
                        </span>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={handleReset}
                                className="text-[10.5px] font-bold text-[#8C5E43] hover:text-[#1D4533] flex items-center gap-1"
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

                    <div className="space-y-3.5">
                        {/* 1. Ukuran Judul Widget */}
                        <div>
                            <div className="flex justify-between font-bold text-[11px] text-[#5E3122] mb-1">
                                <span>Ukuran Judul Header (Ayat Pilihan)</span>
                                <span>{settings.widgetTitleSize}px</span>
                            </div>
                            <input
                                type="range"
                                min={10}
                                max={16}
                                step={0.5}
                                value={settings.widgetTitleSize}
                                onChange={(e) =>
                                    handleSettingChange(
                                        "widgetTitleSize",
                                        Number(e.target.value),
                                    )
                                }
                                className="w-full h-1.5 bg-[#E6CEBC] rounded-lg appearance-none cursor-pointer accent-[#1D4533]"
                            />
                        </div>

                        {/* 2. Ukuran Terjemahan Arti */}
                        <div>
                            <div className="flex justify-between font-bold text-[11px] text-[#5E3122] mb-1">
                                <span>Ukuran Teks Terjemahan Arti</span>
                                <span>{settings.translationSize}px</span>
                            </div>
                            <input
                                type="range"
                                min={12}
                                max={18}
                                step={0.5}
                                value={settings.translationSize}
                                onChange={(e) =>
                                    handleSettingChange(
                                        "translationSize",
                                        Number(e.target.value),
                                    )
                                }
                                className="w-full h-1.5 bg-[#E6CEBC] rounded-lg appearance-none cursor-pointer accent-[#1D4533]"
                            />
                        </div>

                        {/* 3. Ukuran Nama Surat / Referensi */}
                        <div>
                            <div className="flex justify-between font-bold text-[11px] text-[#5E3122] mb-1">
                                <span>Ukuran Teks Nama Surat / Referensi</span>
                                <span>{settings.referenceSize}px</span>
                            </div>
                            <input
                                type="range"
                                min={9.5}
                                max={14}
                                step={0.5}
                                value={settings.referenceSize}
                                onChange={(e) =>
                                    handleSettingChange(
                                        "referenceSize",
                                        Number(e.target.value),
                                    )
                                }
                                className="w-full h-1.5 bg-[#E6CEBC] rounded-lg appearance-none cursor-pointer accent-[#1D4533]"
                            />
                        </div>

                        {/* Tombol Simpan Global */}
                        <button
                            type="button"
                            onClick={handleSaveGlobal}
                            disabled={saving}
                            className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-[#1D4533] py-2 text-[12px] font-bold text-[#F7EAE0] transition hover:bg-[#143325] disabled:opacity-50 cursor-pointer shadow-xs"
                        >
                            <Save size={14} />
                            <span>
                                {saving
                                    ? "Menyimpan..."
                                    : "Simpan untuk Semua Pengunjung"}
                            </span>
                        </button>
                    </div>
                </div>
            )}

            {/* 1. KUTIPAN / AYAT PILIHAN */}
            <QuoteCard quote={quote} settings={settings} />

            {/* 2. E-BOOK WIDGET */}
            {ebooks && ebooks.length > 0 ? (
                <section className="rounded-3xl border border-[#E6CEBC] bg-[#FAF1E8] p-5 sm:p-6 shadow-xs">
                    <div className="mb-4 flex items-center justify-between border-b border-[#E6CEBC]/90 pb-3.5">
                        <h3 className="font-brand font-bold text-[15.5px] text-[#1D4533] flex items-center gap-2">
                            <FileText size={17} />
                            <span>E-Book & Risalah</span>
                        </h3>
                        <span className="rounded-full border border-[#E6CEBC] bg-[#F2E0D2] px-2.5 py-0.5 text-[9px] font-extrabold uppercase text-[#1D4533]">
                            PDF
                        </span>
                    </div>

                    <p className="leading-relaxed text-[#5E3122]/80 mb-4 text-[12.5px] font-medium">
                        Unduh buku saku, modul kajian sunnah, dan naskah risalah
                        dakwah ringkas secara gratis.
                    </p>

                    <div className="space-y-2.5">
                        {ebooks.slice(0, 3).map((eb) => (
                            <Link
                                key={eb.id}
                                href={`/ebook/${eb.slug}`}
                                className="group flex items-center justify-between rounded-2xl border border-[#E6CEBC] bg-[#FDFBF9] p-3.5 transition hover:shadow-xs"
                            >
                                <div className="min-w-0 pr-2">
                                    <div className="font-brand text-[13px] font-bold text-[#1D4533] truncate group-hover:opacity-80">
                                        {eb.title}
                                    </div>
                                    <div className="text-[10px] text-[#5E3122]/70 mt-0.5 font-medium">
                                        {eb.author || "Abu Haidar"}{" "}
                                        {eb.file_size
                                            ? `• ${eb.file_size}`
                                            : ""}
                                    </div>
                                </div>
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#1D4533] text-[#F7EAE0] transition-transform group-hover:scale-105 shadow-2xs">
                                    <Download size={14} />
                                </div>
                            </Link>
                        ))}
                    </div>

                    <Link
                        href="/ebook"
                        className="mt-4 block text-center text-[11.5px] font-bold text-[#1D4533] hover:underline transition-all"
                    >
                        Lihat Semua Risalah & E-Book →
                    </Link>
                </section>
            ) : null}

            {/* 3. KATEGORI WIDGET */}
            <section className="rounded-3xl border border-[#E6CEBC] bg-[#FAF1E8] p-5 sm:p-6 shadow-xs">
                <h3 className="mb-4 border-b border-[#E6CEBC]/90 pb-3.5 font-brand font-bold text-[15.5px] text-[#1D4533]">
                    Kategori Kajian
                </h3>
                <div className="space-y-1.5">
                    {categories.map((category) => (
                        <Link
                            href={`/kategori/${category.slug}`}
                            key={category.id}
                            className="group flex items-center justify-between rounded-xl px-3.5 py-2.5 text-[13px] transition hover:bg-[#F2E0D2]"
                        >
                            <span className="flex items-center gap-3 text-[#4A2619] transition-colors group-hover:font-bold font-medium">
                                <BookOpen
                                    size={14}
                                    className="text-[#1D4533] opacity-75 group-hover:opacity-100"
                                />
                                {category.name}
                            </span>
                            <span className="rounded-full border border-[#E6CEBC] bg-[#F2E0D2] px-2.5 py-0.5 text-[10px] font-extrabold text-[#1D4533] transition-all group-hover:scale-105 shadow-2xs">
                                {category.articles_count}
                            </span>
                        </Link>
                    ))}
                </div>
            </section>
        </aside>
    );
}
