import { Head, Link, router } from "@inertiajs/react";
import {
    Plus,
    Edit,
    Trash2,
    ArrowLeft,
    BookOpen,
    Calendar,
    Tag,
} from "lucide-react";
import { FaYoutube } from "react-icons/fa";
import { Article } from "@/types";

interface IndexProps {
    articles: Article[];
}

// HELPER MENDETEKSI LINK YOUTUBE
const getYouTubeId = (url: string | null | undefined) => {
    if (!url) return null;
    const regExp =
        /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
};

export default function ArticleIndex({ articles = [] }: IndexProps) {
    const handleDelete = (id: number, title: string) => {
        if (confirm(`Apakah Anda yakin ingin menghapus artikel "${title}"?`)) {
            router.delete(`/admin/articles/${id}`);
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

    return (
        <div className="min-h-screen bg-[#eaf6efc0] text-[#162B22] selection:bg-[#0F4C3A] selection:text-white pb-16">
            <Head title="Kelola Artikel - Dashboard Admin" />

            {/* ================= HEADER ================= */}
            <header className="sticky top-0 z-30 border-b border-[#E8E6E1] bg-white/90 backdrop-blur-md shadow-xs">
                <div className="mx-auto flex max-w-[1140px] items-center justify-between px-4 sm:px-6 lg:px-0 py-3.5 sm:py-4">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/admin/dashboard"
                            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E8E6E1] bg-white text-[#555] transition hover:bg-[#F4F4F0] hover:text-[#111]"
                            aria-label="Kembali ke Dashboard"
                        >
                            <ArrowLeft size={18} />
                        </Link>
                        <div>
                            <h1 className="font-brand text-[16px] sm:text-[18px] font-bold text-[#0F4C3A]">
                                Kelola Artikel
                            </h1>
                            <p className="text-[10px] uppercase tracking-wider text-[#6C857A] font-semibold hidden sm:block">
                                Arsip Tulisan & Kajian Dakwah
                            </p>
                        </div>
                    </div>

                    <Link
                        href="/admin/articles/create"
                        className="flex items-center gap-1.5 rounded-full bg-[#0F4C3A] px-3.5 sm:px-4 py-2 text-[12px] sm:text-[13px] font-bold text-white shadow-xs transition hover:bg-[#0A382A]"
                    >
                        <Plus size={16} />
                        <span>Tambah Artikel Baru</span>
                    </Link>
                </div>
            </header>

            {/* ================= MAIN CONTENT ================= */}
            <main className="mx-auto max-w-[1140px] px-4 sm:px-6 lg:px-0 py-6 sm:py-8">
                {/* ================= VIEW 1: DESKTOP TABLE (Layar Laptop/PC) ================= */}
                <div className="hidden md:block overflow-hidden rounded-2xl border border-[#E8E6E1] bg-white shadow-xs">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-[#E8E6E1] bg-[#F4F8F6] text-[11px] uppercase tracking-wider text-[#0F4C3A] font-brand">
                                    <th className="p-4 font-bold text-center w-24">
                                        Sampul
                                    </th>
                                    <th className="p-4 font-bold">
                                        Judul Artikel
                                    </th>
                                    <th className="p-4 font-bold">Kategori</th>
                                    <th className="p-4 font-bold">
                                        Waktu Buat
                                    </th>
                                    <th className="p-4 font-bold text-center">
                                        Terakhir Update
                                    </th>
                                    <th className="p-4 font-bold text-center">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E8E6E1] text-[13px]">
                                {articles.length > 0 ? (
                                    articles.map((article) => {
                                        const ytId = getYouTubeId(
                                            article.image,
                                        );
                                        const coverUrl = ytId
                                            ? `https://img.youtube.com/vi/${ytId}/mqdefault.jpg`
                                            : article.image;

                                        return (
                                            <tr
                                                key={article.id}
                                                className="transition hover:bg-[#FAFAF8]"
                                            >
                                                {/* Sampul */}
                                                <td className="p-4">
                                                    <div className="relative h-12 w-16 overflow-hidden rounded-lg bg-[#EBF1ED] border border-[#E8E6E1]">
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
                                                                    <div className="absolute inset-0 flex items-center justify-center bg-black/25">
                                                                        <FaYoutube
                                                                            size={
                                                                                16
                                                                            }
                                                                            className="text-white drop-shadow-md"
                                                                        />
                                                                    </div>
                                                                )}
                                                            </>
                                                        ) : (
                                                            <div className="flex h-full w-full items-center justify-center text-[9px] font-bold text-[#8CA397]">
                                                                NO IMG
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>

                                                {/* Judul */}
                                                <td className="p-4 font-brand font-bold text-[#162B22] max-w-xs sm:max-w-md truncate">
                                                    {article.title}
                                                </td>

                                                {/* Kategori */}
                                                <td className="p-4 text-[#6C857A]">
                                                    <span className="inline-flex rounded-md bg-[#F4F8F6] px-2.5 py-1 text-[11px] font-bold text-[#0F4C3A]">
                                                        {article.category
                                                            ?.name ||
                                                            "Tanpa Kategori"}
                                                    </span>
                                                </td>

                                                {/* Waktu Buat */}
                                                <td className="p-4 text-[#6C857A]">
                                                    {formatDate(
                                                        article.created_at,
                                                    )}
                                                </td>

                                                {/* Terakhir Update */}
                                                <td className="p-4 text-[#6C857A] text-center">
                                                    {formatDate(
                                                        article.updated_at,
                                                    )}
                                                </td>

                                                {/* Aksi */}
                                                <td className="p-4 text-center space-x-2 whitespace-nowrap">
                                                    <Link
                                                        href={`/admin/articles/${article.id}/edit`}
                                                        className="inline-flex items-center justify-center rounded-lg border border-[#E8E6E1] p-2 text-[#0F4C3A] transition hover:bg-[#F4F4F0]"
                                                        title="Edit Artikel"
                                                    >
                                                        <Edit size={14} />
                                                    </Link>
                                                    <button
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
                                            colSpan={6}
                                            className="p-12 text-center text-[#8CA397]"
                                        >
                                            <BookOpen
                                                size={32}
                                                className="mx-auto mb-2 opacity-30"
                                            />
                                            <p className="font-brand">
                                                Belum ada artikel yang tersedia.
                                                Silakan buat baru.
                                            </p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* ================= VIEW 2: MOBILE CARD LIST (Layar HP) ================= */}
                <div className="md:hidden space-y-3">
                    {articles.length > 0 ? (
                        articles.map((article) => {
                            const ytId = getYouTubeId(article.image);
                            const coverUrl = ytId
                                ? `https://img.youtube.com/vi/${ytId}/mqdefault.jpg`
                                : article.image;

                            return (
                                <div
                                    key={article.id}
                                    className="rounded-2xl border border-[#E8E6E1] bg-white p-4 shadow-xs flex flex-col gap-3"
                                >
                                    <div className="flex gap-3">
                                        <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-xl bg-[#EBF1ED] border border-[#E8E6E1]">
                                            {coverUrl ? (
                                                <>
                                                    <img
                                                        src={coverUrl}
                                                        alt="Sampul"
                                                        className="h-full w-full object-cover"
                                                    />
                                                    {ytId && (
                                                        <div className="absolute inset-0 flex items-center justify-center bg-black/25">
                                                            <FaYoutube
                                                                size={16}
                                                                className="text-white drop-shadow-md"
                                                            />
                                                        </div>
                                                    )}
                                                </>
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center text-[9px] font-bold text-[#8CA397]">
                                                    NO IMG
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-1 text-[11px] font-bold text-[#0F4C3A] mb-1">
                                                <Tag size={11} />
                                                <span className="truncate">
                                                    {article.category?.name ||
                                                        "Tanpa Kategori"}
                                                </span>
                                            </div>
                                            <h3 className="font-brand text-[14px] font-bold text-[#162B22] leading-snug line-clamp-2">
                                                {article.title}
                                            </h3>
                                        </div>
                                    </div>

                                    <div className="border-t border-[#F4F4F0] pt-2.5 flex items-center justify-between text-[11px] text-[#8CA397]">
                                        <span className="flex items-center gap-1">
                                            <Calendar size={12} />{" "}
                                            {formatDate(article.created_at)}
                                        </span>

                                        <div className="flex items-center gap-2">
                                            <Link
                                                href={`/admin/articles/${article.id}/edit`}
                                                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E8E6E1] bg-[#FAFAF8] text-[#0F4C3A] transition hover:bg-[#F4F4F0]"
                                                title="Edit Artikel"
                                            >
                                                <Edit size={14} />
                                            </Link>
                                            <button
                                                onClick={() =>
                                                    handleDelete(
                                                        article.id,
                                                        article.title,
                                                    )
                                                }
                                                className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-600 transition hover:bg-red-100"
                                                title="Hapus Artikel"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="rounded-2xl border border-dashed border-[#CCD8D2] bg-white p-8 text-center text-[#8CA397]">
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
