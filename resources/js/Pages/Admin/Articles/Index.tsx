import { Head, Link, router } from "@inertiajs/react";
import { Plus, Edit, Trash2, ArrowLeft, FileText } from "lucide-react";
import { Article } from "@/types";

interface IndexProps {
    articles: Article[];
}

export default function ArticleIndex({ articles }: IndexProps) {
    const handleDelete = (id: number, title: string) => {
        if (confirm(`Apakah Anda yakin ingin menghapus artikel "${title}"?`)) {
            router.delete(`/admin/articles/${id}`);
        }
    };

    return (
        <div className="min-h-screen bg-[#fafaf8] text-[#17251f]">
            <Head title="Kelola Artikel - Dashboard Admin" />

            {/* HEADER */}
            <header className="border-b border-[#e9e6df] bg-white">
                <div className="mx-auto flex max-w-[1140px] items-center justify-between px-5 py-4 lg:px-0">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/admin/dashboard"
                            className="flex items-center gap-1.5 rounded-lg border border-[#e8e4da] bg-white px-3 py-2 text-[12px] font-medium text-[#17251f] transition hover:bg-[#faf7f0]"
                        >
                            <ArrowLeft size={14} /> Kembali
                        </Link>
                        <h1 className="font-serif text-[18px] font-bold">
                            Kelola Artikel
                        </h1>
                    </div>

                    <Link
                        href="/admin/articles/create"
                        className="flex items-center gap-1.5 rounded-lg bg-[#063f2f] px-4 py-2 text-[12px] font-bold text-white transition hover:bg-[#07513c]"
                    >
                        <Plus size={14} /> Tambah Artikel Baru
                    </Link>
                </div>
            </header>

            {/* MAIN CONTENT */}
            <main className="mx-auto max-w-[1140px] px-5 py-10 lg:px-0">
                <div className="overflow-hidden rounded-xl border border-[#e9e6df] bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-[#e9e6df] bg-[#f9f8f5] text-[11px] uppercase tracking-wider text-[#666]">
                                    {/* Tambahan Kolom Sampul */}
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
                            <tbody className="divide-y divide-[#f0eee9] text-[13px]">
                                {articles.length > 0 ? (
                                    articles.map((article) => (
                                        <tr
                                            key={article.id}
                                            className="transition hover:bg-[#faf9f6]"
                                        >
                                            {/* Tampilan Gambar Thumbnail */}
                                            <td className="p-4">
                                                <div className="h-12 w-16 overflow-hidden rounded-md bg-[#e9e6df] border border-[#dcd7ce]">
                                                    {article.image ? (
                                                        <img
                                                            src={article.image}
                                                            alt="Sampul"
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-full w-full items-center justify-center text-[9px] font-bold text-[#999]">
                                                            NO IMG
                                                        </div>
                                                    )}
                                                </div>
                                            </td>

                                            <td className="p-4 font-medium text-[#17251f] max-w-xs sm:max-w-md truncate">
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

                                            <td className="p-4 text-right space-x-2">
                                                <Link
                                                    href={`/admin/articles/${article.id}/edit`}
                                                    className="inline-flex items-center justify-center rounded-lg border border-[#e8e4da] p-2 text-[#555] transition hover:bg-[#f0eee9]"
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
                                                    className="inline-flex items-center justify-center rounded-lg border border-red-100 bg-red-50 p-2 text-red-600 transition hover:bg-red-100"
                                                    title="Hapus Artikel"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        {/* colSpan diubah menjadi 6 karena ketambahan 1 kolom Sampul */}
                                        <td
                                            colSpan={6}
                                            className="p-8 text-center text-[#777]"
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
