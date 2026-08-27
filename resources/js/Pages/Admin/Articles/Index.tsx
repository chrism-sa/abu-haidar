import React, { useState, useMemo } from "react";
import { Link, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import {
    Plus,
    Edit,
    Trash2,
    BookOpen,
    Star,
    CheckCircle2,
    Clock,
    Search,
    FileText,
    Sparkles,
    Loader2,
} from "lucide-react";
import { FaYoutube } from "react-icons/fa";
import toast from "react-hot-toast";
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
    const [activeLoadingId, setActiveLoadingId] = useState<number | null>(null);

    const handleDelete = (id: number, title: string) => {
        if (
            confirm(
                `Apakah Anda yakin ingin menghapus artikel "${title}"? Seluruh foto dan quote di storage akan ikut terhapus.`,
            )
        ) {
            router.delete(`/admin/articles/${id}`, {
                preserveScroll: true,
                onSuccess: () =>
                    toast.success("Artikel berhasil dihapus bersih!"),
                onError: () => toast.error("Gagal menghapus artikel."),
            });
        }
    };

    const handleTogglePublish = (id: number) => {
        if (activeLoadingId) return;
        setActiveLoadingId(id);
        router.post(
            `/admin/articles/${id}/toggle-publish`,
            {},
            {
                preserveScroll: true,
                onSuccess: () => toast.success("Status publikasi diperbarui!"),
                onError: () => toast.error("Gagal mengubah status publikasi."),
                onFinish: () => setActiveLoadingId(null),
            },
        );
    };

    const handleToggleHero = (id: number) => {
        if (activeLoadingId) return;
        setActiveLoadingId(id);
        router.post(
            `/admin/articles/${id}/toggle-hero`,
            {},
            {
                preserveScroll: true,
                onSuccess: () => toast.success("Hero Utama diperbarui!"),
                onError: () => toast.error("Gagal mengubah status Hero."),
                onFinish: () => setActiveLoadingId(null),
            },
        );
    };

    const handleToggleFeatured = (id: number) => {
        if (activeLoadingId) return;

        const targetArticle = articles.find((a) => a.id === id);

        // Proteksi sisi klien: batas maksimal 5
        if (targetArticle && !targetArticle.is_featured && featuredCount >= 5) {
            toast.error("Maksimal 5 artikel pilihan redaksi!");
            return;
        }

        setActiveLoadingId(id);
        router.post(
            `/admin/articles/${id}/toggle-featured`,
            {},
            {
                preserveScroll: true,
                onSuccess: (page) => {
                    const flash = (page.props as any)?.flash;
                    if (flash?.error) {
                        toast.error(flash.error);
                    } else {
                        toast.success(
                            targetArticle?.is_featured
                                ? "Dihapus dari Pilihan Redaksi."
                                : "Ditambahkan ke Pilihan Redaksi!"
                        );
                    }
                },
                onError: (errors: any) => {
                    const msg =
                        errors?.message ||
                        errors?.error ||
                        "Maksimal 5 artikel pilihan redaksi!";
                    toast.error(msg);
                },
                onFinish: () => setActiveLoadingId(null),
            }
        );
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return "-";
        return new Intl.DateTimeFormat("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
        }).format(new Date(dateString));
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
        <AdminLayout title="Kelola Artikel">
            {/* HEADER SUB SECTION */}
            <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8CEBC] pb-5">
                <div className="flex items-center gap-3.5 min-w-0">
                    <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-2xl bg-[#FAF3EB] border border-[#E8CEBC] text-[#1D4533] shadow-2xs">
                        <FileText size={22} />
                    </div>
                    <div className="min-w-0">
                        <h1 className="font-brand text-[20px] sm:text-[24px] font-bold text-[#1D4533] leading-tight truncate">
                            Kelola Artikel Kajian
                        </h1>
                        <p className="mt-0.5 text-[11px] sm:text-[12px] uppercase tracking-wider text-[#8C5E43] font-bold truncate">
                            Total: {articles.length} Materi • Utama: {heroCount}{" "}
                            • Redaksi: {featuredCount}/5
                        </p>
                    </div>
                </div>

                <Link
                    href="/admin/articles/create"
                    className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#1D4533] px-5 py-2.5 text-[12.5px] sm:text-[13px] font-bold text-[#F7EAE0] shadow-2xs transition hover:bg-[#143325] cursor-pointer w-full sm:w-fit shrink-0 active:scale-95"
                >
                    <Plus size={16} />
                    <span>Tulis Artikel Baru</span>
                </Link>
            </div>

            {/* TOOLBAR PENCARIAN & STATUS */}
            <div className="mb-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold">
                    <span className="inline-flex items-center gap-1.5 rounded-xl bg-[#FAF3EB] border border-[#E8CEBC] px-3 py-1.5 text-[#1D4533]">
                        <Sparkles size={12} />
                        Hero Utama: {heroCount ? "Sudah diset" : "Default"}
                    </span>
                    <span
                        className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 ${
                            featuredCount === 3
                                ? "bg-amber-100/80 border-amber-300 text-amber-900"
                                : "bg-[#FAF3EB] border-[#E8CEBC] text-[#5E3122]"
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
                        Pilihan Redaksi: {featuredCount} / 5
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
                        className="w-full rounded-xl border border-[#E8CEBC] bg-[#FDF9F5] pl-9 pr-3.5 py-2 text-[12.5px] text-[#5E3122] focus:border-[#1D4533] focus:outline-none"
                    />
                </div>
            </div>

            {/* DESKTOP TABLE */}
            <div className="hidden md:block overflow-hidden rounded-2xl border border-[#E8CEBC] bg-[#FDF9F5] shadow-xs">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-[#E8CEBC] bg-[#FAF3EB] text-[11px] uppercase tracking-wider text-[#1D4533] font-brand">
                                <th className="p-4 font-bold text-center w-20">
                                    Sampul
                                </th>
                                <th className="p-4 font-bold">Judul Artikel</th>
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
                        <tbody className="divide-y divide-[#E8CEBC]/60 text-[13px]">
                            {filteredArticles.length > 0 ? (
                                filteredArticles.map((article) => {
                                    const ytId = getYouTubeId(article.image);
                                    const coverUrl = ytId
                                        ? `https://img.youtube.com/vi/${ytId}/mqdefault.jpg`
                                        : article.image;
                                    const isLoading =
                                        activeLoadingId === article.id;

                                    return (
                                        <tr
                                            key={article.id}
                                            className="transition hover:bg-[#FAF3EB]/60"
                                        >
                                            {/* Sampul */}
                                            <td className="p-4">
                                                <div className="relative h-12 w-16 overflow-hidden rounded-lg bg-[#F2E2D5] border border-[#E8CEBC]">
                                                    {coverUrl ? (
                                                        <>
                                                            <img
                                                                src={coverUrl}
                                                                alt="Sampul"
                                                                className="h-full w-full object-cover"
                                                            />
                                                            {ytId && (
                                                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white">
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
                                                <span className="inline-flex rounded-md bg-[#FAF3EB] px-2.5 py-1 text-[11px] font-bold text-[#1D4533] border border-[#E8CEBC]">
                                                    {article.category?.name ||
                                                        "Tanpa Kategori"}
                                                </span>
                                            </td>

                                            {/* Posisi Beranda */}
                                            <td className="p-4 text-center whitespace-nowrap space-x-1.5">
                                                <button
                                                    type="button"
                                                    disabled={isLoading}
                                                    onClick={() =>
                                                        handleToggleHero(
                                                            article.id,
                                                        )
                                                    }
                                                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold transition cursor-pointer active:scale-95 disabled:opacity-60 ${
                                                        article.is_hero
                                                            ? "bg-[#1D4533] text-[#F7EAE0] ring-2 ring-[#1D4533]/40"
                                                            : "bg-[#FAF3EB] border border-[#E8CEBC] text-[#5E3122]/70 hover:bg-[#F2E2D5]"
                                                    }`}
                                                >
                                                    {isLoading ? (
                                                        <Loader2
                                                            size={11}
                                                            className="animate-spin"
                                                        />
                                                    ) : (
                                                        <Sparkles size={11} />
                                                    )}
                                                    <span>
                                                        {article.is_hero
                                                            ? "Utama (Hero)"
                                                            : "Set Utama"}
                                                    </span>
                                                </button>

                                                <button
                                                    type="button"
                                                    disabled={isLoading}
                                                    onClick={() =>
                                                        handleToggleFeatured(
                                                            article.id,
                                                        )
                                                    }
                                                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold transition cursor-pointer active:scale-95 disabled:opacity-60 ${
                                                        article.is_featured
                                                            ? "bg-amber-600 text-white ring-2 ring-amber-500/40"
                                                            : "bg-[#FAF3EB] border border-[#E8CEBC] text-[#5E3122]/70 hover:bg-[#F2E2D5]"
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

                                            {/* Status Terbit */}
                                            <td className="p-4 text-center">
                                                <button
                                                    type="button"
                                                    disabled={isLoading}
                                                    onClick={() =>
                                                        handleTogglePublish(
                                                            article.id,
                                                        )
                                                    }
                                                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase transition cursor-pointer active:scale-95 disabled:opacity-60 ${
                                                        article.is_published
                                                            ? "bg-emerald-100/80 text-emerald-800 border border-emerald-300"
                                                            : "bg-[#F2E2D5] text-[#5E3122]/60 border border-[#E8CEBC]"
                                                    }`}
                                                >
                                                    {article.is_published ? (
                                                        <>
                                                            <CheckCircle2
                                                                size={10}
                                                                className="text-emerald-700"
                                                            />
                                                            Terbit
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Clock size={10} />
                                                            Draft
                                                        </>
                                                    )}
                                                </button>
                                            </td>

                                            {/* Waktu */}
                                            <td className="p-4 text-[#5E3122]/70 text-center text-[11px] whitespace-nowrap">
                                                {formatDate(article.created_at)}
                                            </td>

                                            {/* Aksi */}
                                            <td className="p-4 text-center space-x-1.5 whitespace-nowrap">
                                                <Link
                                                    href={`/admin/articles/${article.id}/edit`}
                                                    className="inline-flex items-center justify-center rounded-lg border border-[#E8CEBC] bg-[#FAF3EB] p-2 text-[#1D4533] transition hover:bg-[#F2E2D5]"
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
                                                    className="inline-flex items-center justify-center rounded-lg border border-red-200 bg-red-100/70 p-2 text-red-600 transition hover:bg-red-200 cursor-pointer"
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
                        const isLoading = activeLoadingId === article.id;

                        return (
                            <div
                                key={article.id}
                                className="rounded-2xl border border-[#E8CEBC] bg-[#FDF9F5] p-4 shadow-xs flex flex-col gap-3"
                            >
                                <div className="flex gap-3">
                                    <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-xl bg-[#F2E2D5] border border-[#E8CEBC]">
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
                                            <span className="rounded bg-[#FAF3EB] px-1.5 py-0.5 border border-[#E8CEBC]">
                                                {article.category?.name ||
                                                    "Kajian"}
                                            </span>
                                            {article.is_hero && (
                                                <span className="rounded bg-[#1D4533] px-1.5 py-0.5 text-[#F7EAE0]">
                                                    Hero
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

                                <div className="flex items-center justify-between flex-wrap gap-2 border-t border-[#E8CEBC]/60 pt-2.5">
                                    <div className="flex items-center gap-1">
                                        <button
                                            type="button"
                                            disabled={isLoading}
                                            onClick={() =>
                                                handleToggleHero(article.id)
                                            }
                                            className={`rounded-lg px-2.5 py-1 text-[10px] font-bold border disabled:opacity-60 ${
                                                article.is_hero
                                                    ? "bg-[#1D4533] text-white border-[#1D4533]"
                                                    : "bg-[#FAF3EB] border-[#E8CEBC] text-[#5E3122]"
                                            }`}
                                        >
                                            Hero
                                        </button>
                                        <button
                                            type="button"
                                            disabled={isLoading}
                                            onClick={() =>
                                                handleToggleFeatured(article.id)
                                            }
                                            className={`rounded-lg px-2.5 py-1 text-[10px] font-bold border disabled:opacity-60 ${
                                                article.is_featured
                                                    ? "bg-amber-600 text-white border-amber-600"
                                                    : "bg-[#FAF3EB] border-[#E8CEBC] text-[#5E3122]"
                                            }`}
                                        >
                                            Redaksi
                                        </button>
                                        <button
                                            type="button"
                                            disabled={isLoading}
                                            onClick={() =>
                                                handleTogglePublish(article.id)
                                            }
                                            className={`rounded-lg px-2.5 py-1 text-[10px] font-bold border disabled:opacity-60 ${
                                                article.is_published
                                                    ? "bg-emerald-100/80 text-emerald-800 border-emerald-300"
                                                    : "bg-[#F2E2D5] text-[#5E3122]/60 border-[#E8CEBC]"
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
                                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E8CEBC] bg-[#FAF3EB] text-[#1D4533]"
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
                                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100/70 text-red-600"
                                        >
                                            <Trash2 size={13} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="rounded-2xl border border-dashed border-[#E8CEBC] bg-[#FDF9F5] p-8 text-center text-[#5E3122]/50">
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
        </AdminLayout>
    );
}
