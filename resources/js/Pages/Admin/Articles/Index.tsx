import React, { useState, useMemo } from "react";
import { Head, Link, router } from "@inertiajs/react";
import {
    Plus,
    Edit,
    Trash2,
    ArrowLeft,
    BookOpen,
    Calendar,
    Star,
    Sparkles,
    CheckCircle2,
    Clock,
    Search,
} from "lucide-react";
import { FaYoutube } from "react-icons/fa";
import { Article } from "@/types";

interface ExtendedArticle extends Article {
    is_hero?: boolean;
    is_featured?: boolean;
}

interface IndexProps {
    articles: ExtendedArticle[];
}

const getYouTubeId = (url: string | null | undefined) => {
    if (!url) return null;
    const regExp =
        /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
};

export default function ArticleIndex({ articles = [] }: IndexProps) {
    const [search, setSearch] = useState("");

    const handleDelete = (id: number, title: string) => {
        if (
            confirm(
                `Apakah Anda yakin ingin menghapus artikel "${title}"? Seluruh foto dan quote di storage akan ikut terhapus.`,
            )
        ) {
            router.delete(`/admin/articles/${id}`);
        }
    };
    const handleTogglePublish = async (id: number) => {
        try {
            const csrfToken = (
                document.querySelector(
                    'meta[name="csrf-token"]',
                ) as HTMLMetaElement
            )?.content;
            const response = await fetch(
                `/admin/articles/${id}/toggle-publish`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        "X-CSRF-TOKEN": csrfToken || "",
                        "X-Requested-With": "XMLHttpRequest",
                    },
                    body: JSON.stringify({ _action: "toggle" }),
                },
            );

            if (response.ok) {
                router.reload({ only: ["articles"] });
            }
        } catch (e) {
            router.reload({ only: ["articles"] });
        }
    };

    const handleToggleHero = async (id: number) => {
        try {
            const csrfToken = (
                document.querySelector(
                    'meta[name="csrf-token"]',
                ) as HTMLMetaElement
            )?.content;
            const response = await fetch(`/admin/articles/${id}/toggle-hero`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "X-CSRF-TOKEN": csrfToken || "",
                    "X-Requested-With": "XMLHttpRequest",
                },
                body: JSON.stringify({ _action: "toggle" }),
            });

            if (response.ok) {
                router.reload({ only: ["articles"] });
            }
        } catch (e) {
            router.reload({ only: ["articles"] });
        }
    };

    const handleToggleFeatured = async (id: number) => {
        try {
            const csrfToken = (
                document.querySelector(
                    'meta[name="csrf-token"]',
                ) as HTMLMetaElement
            )?.content;
            const response = await fetch(
                `/admin/articles/${id}/toggle-featured`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        "X-CSRF-TOKEN": csrfToken || "",
                        "X-Requested-With": "XMLHttpRequest",
                    },
                    body: JSON.stringify({ _action: "toggle" }),
                },
            );

            if (response.ok) {
                router.reload({ only: ["articles"] });
            } else {
                const data = await response.json();
                alert(data.message || "Gagal mengubah pilihan redaksi");
            }
        } catch (e) {
            router.reload({ only: ["articles"] });
        }
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    const filteredArticles = useMemo(() => {
        return articles.filter(
            (a) =>
                a.title.toLowerCase().includes(search.toLowerCase()) ||
                a.category?.name?.toLowerCase().includes(search.toLowerCase()),
        );
    }, [articles, search]);

    const heroCount = articles.filter((a) => a.is_hero).length;
    const featuredCount = articles.filter((a) => a.is_featured).length;

    return (
        <div className="min-h-screen bg-[#F7EAE0] text-[#5E3122] selection:bg-[#1D4533] selection:text-[#F7EAE0] pb-16">
            <Head title="Kelola Artikel - Dashboard Admin" />

            {/* HEADER */}
            <header className="sticky top-0 z-30 border-b border-[#F9D2BA] bg-[#F7EAE0]/95 backdrop-blur-md shadow-xs">
                <div className="mx-auto flex max-w-[1140px] items-center justify-between px-4 sm:px-6 lg:px-0 py-3.5 sm:py-4">
                    <div className="flex items-center gap-3 min-w-0">
                        <Link
                            href="/admin/dashboard"
                            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#F9D2BA] bg-white text-[#5E3122] transition hover:bg-[#F9D2BA]/30 shrink-0"
                            aria-label="Kembali ke Dashboard"
                        >
                            <ArrowLeft size={18} />
                        </Link>
                        <div>
                            <h1 className="font-brand text-[16px] sm:text-[18px] font-bold text-[#1D4533] leading-tight truncate">
                                Kelola Artikel Kajian
                            </h1>
                            <p className="text-[10px] uppercase tracking-wider text-[#5E3122]/70 font-semibold hidden sm:block">
                                Total: {articles.length} Materi • Utama:{" "}
                                {heroCount} • Pilihan Redaksi: {featuredCount}/3
                            </p>
                        </div>
                    </div>

                    <Link
                        href="/admin/articles/create"
                        className="flex items-center gap-1.5 rounded-full bg-[#1D4533] px-4 sm:px-5 py-2 text-[12px] sm:text-[13px] font-bold text-[#F7EAE0] shadow-xs transition hover:bg-[#143325] cursor-pointer"
                    >
                        <Plus size={16} />
                        <span>Tulis Artikel Baru</span>
                    </Link>
                </div>
            </header>

            {/* MAIN CONTENT */}
            <main className="mx-auto max-w-[1140px] px-4 sm:px-6 lg:px-0 py-6 sm:py-8">
                {/* TOOLBAR PENCARIAN & INFO STATUS */}
                <div className="mb-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold">
                        <span className="inline-flex items-center gap-1 rounded-lg bg-[#1D4533]/10 border border-[#F9D2BA] px-3 py-1.5 text-[#1D4533]">
                            <Sparkles size={12} className="text-[#1D4533]" />
                            Hero Utama:{" "}
                            {heroCount ? "Sudah diset" : "Default (Terbaru)"}
                        </span>
                        <span
                            className={`inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 ${
                                featuredCount === 3
                                    ? "bg-amber-100 border-amber-300 text-amber-900 font-bold"
                                    : "bg-white border-[#F9D2BA] text-[#5E3122]"
                            }`}
                        >
                            <Star
                                size={12}
                                className={
                                    featuredCount > 0
                                        ? "fill-amber-500 text-amber-500"
                                        : ""
                                }
                            />
                            Pilihan Redaksi: {featuredCount} / 3 Aktif
                        </span>
                    </div>

                    <div className="relative max-w-xs w-full">
                        <Search
                            size={14}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5E3122]/50"
                        />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari judul artikel..."
                            className="w-full rounded-xl border border-[#F9D2BA] bg-white pl-9 pr-3.5 py-1.5 text-[12px] text-[#5E3122] focus:border-[#1D4533] focus:outline-none"
                        />
                    </div>
                </div>

                {/* DESKTOP TABLE */}
                <div className="hidden md:block overflow-hidden rounded-2xl border border-[#F9D2BA] bg-white shadow-xs">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-[#F9D2BA] bg-[#FDFBF9] text-[11px] uppercase tracking-wider text-[#1D4533] font-brand">
                                    <th className="p-4 font-bold text-center w-20">
                                        Sampul
                                    </th>
                                    <th className="p-4 font-bold">
                                        Judul Artikel
                                    </th>
                                    <th className="p-4 font-bold">Kategori</th>
                                    <th className="p-4 font-bold text-center">
                                        Posisi Beranda
                                    </th>
                                    <th className="p-4 font-bold text-center">
                                        Status
                                    </th>
                                    <th className="p-4 font-bold text-center">
                                        Waktu
                                    </th>
                                    <th className="p-4 font-bold text-center">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#F9D2BA]/50 text-[13px]">
                                {filteredArticles.length > 0 ? (
                                    filteredArticles.map((article) => {
                                        const ytId = getYouTubeId(
                                            article.image,
                                        );
                                        const coverUrl = ytId
                                            ? `https://img.youtube.com/vi/${ytId}/mqdefault.jpg`
                                            : article.image;

                                        return (
                                            <tr
                                                key={article.id}
                                                className="transition hover:bg-[#FDFBF9]"
                                            >
                                                {/* Sampul */}
                                                <td className="p-4">
                                                    <div className="relative h-12 w-16 overflow-hidden rounded-lg bg-[#F7EAE0] border border-[#F9D2BA]">
                                                        {coverUrl ? (
                                                            <>
                                                                <img
                                                                    src={
                                                                        coverUrl
                                                                    }
                                                                    alt="Sampul"
                                                                    className="h-full w-full object-cover"
                                                                />
                                                                {ytId && (
                                                                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 text-white">
                                                                        <FaYoutube
                                                                            size={
                                                                                14
                                                                            }
                                                                        />
                                                                    </div>
                                                                )}
                                                            </>
                                                        ) : (
                                                            <div className="flex h-full w-full items-center justify-center text-[9px] font-bold text-[#5E3122]/40">
                                                                NO IMG
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>

                                                {/* Judul */}
                                                <td className="p-4 font-brand font-bold text-[#1D4533] max-w-xs truncate">
                                                    <Link
                                                        href={`/artikel/${article.slug}`}
                                                        target="_blank"
                                                        className="hover:underline"
                                                    >
                                                        {article.title}
                                                    </Link>
                                                </td>

                                                {/* Kategori */}
                                                <td className="p-4 text-[#5E3122]">
                                                    <span className="inline-flex rounded-md bg-[#F7EAE0] px-2.5 py-1 text-[11px] font-bold text-[#1D4533] border border-[#F9D2BA]/60">
                                                        {article.category
                                                            ?.name ||
                                                            "Tanpa Kategori"}
                                                    </span>
                                                </td>

                                                {/* POSISI BERANDA: HERO & REDAKSI */}
                                                <td className="p-4 text-center whitespace-nowrap space-x-1.5">
                                                    {/* Tombol Set Utama (Hero) */}
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleToggleHero(
                                                                article.id,
                                                            )
                                                        }
                                                        title="Jadikan Artikel Utama / Hero Section"
                                                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold transition cursor-pointer ${
                                                            article.is_hero
                                                                ? "bg-[#1D4533] text-[#F7EAE0] ring-2 ring-[#1D4533]/40"
                                                                : "bg-[#FDFBF9] border border-[#F9D2BA] text-[#5E3122]/70 hover:bg-[#F9D2BA]/30"
                                                        }`}
                                                    >
                                                        <Sparkles
                                                            size={11}
                                                            className={
                                                                article.is_hero
                                                                    ? "text-[#F9D2BA]"
                                                                    : ""
                                                            }
                                                        />
                                                        <span>
                                                            {article.is_hero
                                                                ? "Utama (Hero)"
                                                                : "Set Utama"}
                                                        </span>
                                                    </button>

                                                    {/* Tombol Set Pilihan Redaksi (Max 3) */}
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleToggleFeatured(
                                                                article.id,
                                                            )
                                                        }
                                                        title="Jadikan Pilihan Redaksi (Maksimal 3)"
                                                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold transition cursor-pointer ${
                                                            article.is_featured
                                                                ? "bg-amber-600 text-white ring-2 ring-amber-500/40"
                                                                : "bg-[#FDFBF9] border border-[#F9D2BA] text-[#5E3122]/70 hover:bg-[#F9D2BA]/30"
                                                        }`}
                                                    >
                                                        <Star
                                                            size={11}
                                                            className={
                                                                article.is_featured
                                                                    ? "fill-white"
                                                                    : ""
                                                            }
                                                        />
                                                        <span>
                                                            {article.is_featured
                                                                ? "Pilihan Redaksi"
                                                                : "+ Redaksi"}
                                                        </span>
                                                    </button>
                                                </td>

                                                {/* STATUS TERBIT / DRAFT */}
                                                <td className="p-4 text-center">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleTogglePublish(
                                                                article.id,
                                                            )
                                                        }
                                                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase transition cursor-pointer ${
                                                            article.is_published
                                                                ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                                                : "bg-gray-100 text-gray-600 border border-gray-300"
                                                        }`}
                                                    >
                                                        {article.is_published ? (
                                                            <>
                                                                <CheckCircle2
                                                                    size={10}
                                                                    className="text-emerald-600"
                                                                />{" "}
                                                                Terbit
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Clock
                                                                    size={10}
                                                                />{" "}
                                                                Draft
                                                            </>
                                                        )}
                                                    </button>
                                                </td>

                                                {/* Waktu Buat */}
                                                <td className="p-4 text-[#5E3122]/70 text-center text-[11px] whitespace-nowrap">
                                                    {formatDate(
                                                        article.created_at,
                                                    )}
                                                </td>

                                                {/* Aksi */}
                                                <td className="p-4 text-center space-x-1.5 whitespace-nowrap">
                                                    <Link
                                                        href={`/admin/articles/${article.id}/edit`}
                                                        className="inline-flex items-center justify-center rounded-lg border border-[#F9D2BA] bg-[#FDFBF9] p-2 text-[#1D4533] transition hover:bg-[#F9D2BA]/40"
                                                        title="Edit Artikel"
                                                    >
                                                        <Edit size={14} />
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleDelete(
                                                                article.id,
                                                                article.title,
                                                            )
                                                        }
                                                        className="inline-flex items-center justify-center rounded-lg border border-red-200 bg-red-50 p-2 text-red-600 transition hover:bg-red-100 cursor-pointer"
                                                        title="Hapus Artikel"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="p-12 text-center text-[#5E3122]/50"
                                        >
                                            <BookOpen
                                                size={32}
                                                className="mx-auto mb-2 opacity-30"
                                            />
                                            <p className="font-brand">
                                                Belum ada artikel yang tersedia.
                                            </p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* MOBILE VIEW (CARD LIST) */}
                <div className="md:hidden space-y-3">
                    {filteredArticles.length > 0 ? (
                        filteredArticles.map((article) => {
                            const ytId = getYouTubeId(article.image);
                            const coverUrl = ytId
                                ? `https://img.youtube.com/vi/${ytId}/mqdefault.jpg`
                                : article.image;

                            return (
                                <div
                                    key={article.id}
                                    className="rounded-2xl border border-[#F9D2BA] bg-white p-4 shadow-xs flex flex-col gap-3"
                                >
                                    <div className="flex gap-3">
                                        <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-xl bg-[#F7EAE0] border border-[#F9D2BA]">
                                            {coverUrl ? (
                                                <img
                                                    src={coverUrl}
                                                    alt="Sampul"
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center text-[9px] font-bold text-[#5E3122]/40">
                                                    NO IMG
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-1.5 flex-wrap text-[10px] font-bold text-[#1D4533] mb-1">
                                                <span className="rounded bg-[#F7EAE0] px-1.5 py-0.5 border border-[#F9D2BA]">
                                                    {article.category?.name ||
                                                        "Kajian"}
                                                </span>
                                                {article.is_hero && (
                                                    <span className="rounded bg-[#1D4533] px-1.5 py-0.5 text-[#F7EAE0]">
                                                        Utama (Hero)
                                                    </span>
                                                )}
                                                {article.is_featured && (
                                                    <span className="rounded bg-amber-600 px-1.5 py-0.5 text-white">
                                                        Redaksi
                                                    </span>
                                                )}
                                            </div>
                                            <h3 className="font-brand text-[14px] font-bold text-[#1D4533] leading-snug line-clamp-2">
                                                {article.title}
                                            </h3>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between flex-wrap gap-2 border-t border-[#F9D2BA]/50 pt-2.5">
                                        <div className="flex items-center gap-1">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleToggleHero(article.id)
                                                }
                                                className={`rounded-lg px-2.5 py-1 text-[10px] font-bold border ${
                                                    article.is_hero
                                                        ? "bg-[#1D4533] text-white border-[#1D4533]"
                                                        : "bg-[#FDFBF9] border-[#F9D2BA] text-[#5E3122]"
                                                }`}
                                            >
                                                Hero
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleToggleFeatured(
                                                        article.id,
                                                    )
                                                }
                                                className={`rounded-lg px-2.5 py-1 text-[10px] font-bold border ${
                                                    article.is_featured
                                                        ? "bg-amber-600 text-white border-amber-600"
                                                        : "bg-[#FDFBF9] border-[#F9D2BA] text-[#5E3122]"
                                                }`}
                                            >
                                                Redaksi
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleTogglePublish(
                                                        article.id,
                                                    )
                                                }
                                                className={`rounded-lg px-2.5 py-1 text-[10px] font-bold border ${
                                                    article.is_published
                                                        ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                                                        : "bg-gray-100 text-gray-600 border-gray-300"
                                                }`}
                                            >
                                                {article.is_published
                                                    ? "Terbit"
                                                    : "Draft"}
                                            </button>
                                        </div>

                                        <div className="flex items-center gap-1.5">
                                            <Link
                                                href={`/admin/articles/${article.id}/edit`}
                                                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#F9D2BA] bg-[#FDFBF9] text-[#1D4533]"
                                            >
                                                <Edit size={13} />
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleDelete(
                                                        article.id,
                                                        article.title,
                                                    )
                                                }
                                                className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-600"
                                            >
                                                <Trash2 size={13} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="rounded-2xl border border-dashed border-[#F9D2BA] bg-white p-8 text-center text-[#5E3122]/50">
                            <BookOpen
                                size={28}
                                className="mx-auto mb-2 opacity-30"
                            />
                            <p className="font-brand text-[13px]">
                                Belum ada artikel yang tersedia.
                            </p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
