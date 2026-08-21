import { Head, Link, router } from "@inertiajs/react";
import { Plus, Edit, Trash2, ArrowLeft } from "lucide-react";
import { FaYoutube } from "react-icons/fa"; // Menggunakan react-icons untuk icon Youtube
import { Article } from "@/types";

interface IndexProps {
    articles: Article[];
}

// HELPER MENDETEKSI LINK YOUTUBE
const getYouTubeId = (url: string | null | undefined) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
};

export default function ArticleIndex({ articles }: IndexProps) {
    const handleDelete = (id: number, title: string) => {
        if (confirm(`Apakah Anda yakin ingin menghapus artikel "${title}"?`)) {
            router.delete(`/admin/articles/${id}`);
        }
    };

    return (
        <div className="min-h-screen bg-[#eaf6efc0] text-[#162B22]">
            <Head title="Kelola Artikel - Dashboard Admin" />

            {/* HEADER */}
            <header className="border-b border-[#E0EAE3] bg-white shadow-xs">
                <div className="mx-auto flex max-w-[1140px] items-center justify-between px-5 py-4 lg:px-0">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/admin/dashboard"
                            className="flex items-center gap-1.5 rounded-lg border border-[#E0EAE3] bg-white px-3 py-2 text-[12px] font-medium text-[#162B22] transition hover:bg-[#F2F7F4]"
                        >
                            <ArrowLeft size={14} /> Kembali
                        </Link>
                        <h1 className="font-serif text-[18px] font-bold text-[#0F4C3A]">
                            Kelola Artikel
                        </h1>
                    </div>

                    <Link
                        href="/admin/articles/create"
                        className="flex items-center gap-1.5 rounded-lg bg-[#0F4C3A] px-4 py-2 text-[12px] font-bold text-white shadow-sm transition hover:bg-[#0a382a]"
                    >
                        <Plus size={14} /> Tambah Artikel Baru
                    </Link>
                </div>
            </header>

            {/* MAIN CONTENT */}
            <main className="mx-auto max-w-[1140px] px-5 py-10 lg:px-0">
                <div className="overflow-hidden rounded-xl border border-[#E0EAE3] bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-[#E0EAE3] bg-[#F9FBF9] text-[11px] uppercase tracking-wider text-[#6C857A]">
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
                            <tbody className="divide-y divide-[#E0EAE3] text-[13px]">
                                {articles.length > 0 ? (
                                    articles.map((article) => {
                                        // Cek apakah sampul adalah video YouTube
                                        const ytId = getYouTubeId(article.image);
                                        // Jika YouTube, ambil thumbnail otomatis dari Google. Jika tidak, pakai URL gambar asli.
                                        const coverUrl = ytId 
                                            ? `https://img.youtube.com/vi/${ytId}/mqdefault.jpg` 
                                            : article.image;

                                        return (
                                            <tr
                                                key={article.id}
                                                className="transition hover:bg-[#F4F9F6]"
                                            >
                                                {/* Tampilan Gambar Thumbnail */}
                                                <td className="p-4">
                                                    <div className="relative h-12 w-16 overflow-hidden rounded-md bg-[#EBF1ED] border border-[#E0EAE3]">
                                                        {coverUrl ? (
                                                            <>
                                                                <img
                                                                    src={coverUrl}
                                                                    alt="Sampul"
                                                                    className="h-full w-full object-cover"
                                                                />
                                                                {/* Jika YouTube, beri overlay logo Play */}
                                                                {ytId && (
                                                                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                                                        <FaYoutube size={16} className="text-white drop-shadow-md" />
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

                                                <td className="p-4 font-medium text-[#162B22] max-w-xs sm:max-w-md truncate">
                                                    {article.title}
                                                </td>

                                                <td className="p-4 text-[#555]">
                                                    {article.category?.name ||
                                                        "Tanpa Kategori"}
                                                </td>

                                                <td className="p-4 text-[#555]">
                                                    {new Date(
                                                        article.created_at,
                                                    ).toLocaleDateString("id-ID", {
                                                        day: "numeric",
                                                        month: "short",
                                                        year: "numeric",
                                                    })}
                                                </td>
                                                <td className="p-4 text-[#555] text-center">
                                                    {new Date(
                                                        article.updated_at,
                                                    ).toLocaleDateString("id-ID", {
                                                        day: "numeric",
                                                        month: "short",
                                                        year: "numeric",
                                                    })}
                                                </td>

                                                <td className="p-4 text-right space-x-2 whitespace-nowrap">
                                                    <Link
                                                        href={`/admin/articles/${article.id}/edit`}
                                                        className="inline-flex items-center justify-center rounded-lg border border-[#E0EAE3] p-2 text-[#0F4C3A] transition hover:bg-[#EBF1ED]"
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
                                                        className="inline-flex items-center justify-center rounded-lg border border-red-200 bg-red-50 p-2 text-red-600 transition hover:bg-red-100"
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
                                            className="p-8 text-center text-[#6C857A]"
                                        >
                                            Belum ada artikel yang tersedia.
                                            Silakan buat baru.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}