import React, { useState, useMemo } from "react";
import { Head, Link, useForm, router } from "@inertiajs/react";
import {
    ArrowLeft,
    Plus,
    FileText,
    Download,
    Trash2,
    Eye,
    Upload,
    Check,
    X,
    BookOpen,
    CheckCircle2,
    Clock,
    Edit3,
} from "lucide-react";

interface EbookItem {
    id: number;
    title: string;
    slug: string;
    description: string;
    author: string;
    file_path: string;
    file_size: string;
    total_pages: number;
    cover_image: string | null;
    is_published: boolean;
    created_at: string;
}

interface IndexProps {
    ebooks: EbookItem[];
}

export default function AdminEbookIndex({ ebooks = [] }: IndexProps) {
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [editingEbook, setEditingEbook] = useState<EbookItem | null>(null);
    const [statusFilter, setStatusFilter] = useState<
        "all" | "published" | "draft"
    >("all");
    const [search, setSearch] = useState("");

    // Form Tambah E-Book
    const createForm = useForm({
        title: "",
        description: "",
        author: "Abu Haidar",
        total_pages: "",
        pdf_file: null as File | null,
        cover_image: null as File | null,
        is_published: true,
    });

    // Form Edit E-Book
    const editForm = useForm({
        _method: "POST",
        title: "",
        description: "",
        author: "Abu Haidar",
        total_pages: "" as string | number,
        pdf_file: null as File | null,
        cover_image: null as File | null,
        is_published: true,
    });

    const handleUploadSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post("/admin/ebooks", {
            forceFormData: true,
            onSuccess: () => {
                createForm.reset();
                setIsUploadModalOpen(false);
            },
        });
    };

    const handleOpenEdit = (ebook: EbookItem) => {
        setEditingEbook(ebook);
        editForm.setData({
            _method: "POST",
            title: ebook.title,
            description: ebook.description || "",
            author: ebook.author || "Abu Haidar",
            total_pages: ebook.total_pages || "",
            pdf_file: null,
            cover_image: null,
            is_published: Boolean(ebook.is_published),
        });
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingEbook) return;

        editForm.post(`/admin/ebooks/${editingEbook.id}`, {
            forceFormData: true,
            onSuccess: () => {
                setEditingEbook(null);
                editForm.reset();
            },
        });
    };

    const handleDelete = (id: number, title: string) => {
        if (
            confirm(
                `Yakin ingin menghapus risalah "${title}"? File PDF dan Cover di storage akan ikut terhapus.`,
            )
        ) {
            router.delete(`/admin/ebooks/${id}`);
        }
    };

    // Handler Toggle Ebook dengan Native Fetch
    const handleToggleStatus = async (id: number) => {
        try {
            const csrfToken = (
                document.querySelector(
                    'meta[name="csrf-token"]',
                ) as HTMLMetaElement
            )?.content;

            const response = await fetch(`/admin/ebooks/${id}/toggle-status`, {
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
                // Refresh data Inertia tanpa reload halaman penuh
                router.reload({ only: ["ebooks"] });
            } else {
                const err = await response.json();
                alert(err.message || "Gagal mengubah status E-Book");
            }
        } catch (error) {
            console.error("Gagal toggle status:", error);
            // Fallback langsung refresh jika request sudah terproses di server
            router.reload({ only: ["ebooks"] });
        }
    };

    const filteredEbooks = useMemo(() => {
        return ebooks.filter((eb) => {
            const matchesSearch =
                eb.title.toLowerCase().includes(search.toLowerCase()) ||
                eb.description?.toLowerCase().includes(search.toLowerCase()) ||
                eb.author?.toLowerCase().includes(search.toLowerCase());

            const matchesStatus =
                statusFilter === "all"
                    ? true
                    : statusFilter === "published"
                      ? Boolean(eb.is_published)
                      : !eb.is_published;

            return matchesSearch && matchesStatus;
        });
    }, [ebooks, search, statusFilter]);

    return (
        <div className="min-h-screen bg-[#F7EAE0] text-[#5E3122] selection:bg-[#1D4533] selection:text-[#F7EAE0] pb-16">
            <Head title="Kelola E-Book PDF - Abu Haidar" />

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
                                Kelola E-Book PDF
                            </h1>
                            <p className="text-[10px] text-[#5E3122]/70 font-semibold uppercase tracking-wider">
                                Total: {ebooks.length} File Risalah
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => setIsUploadModalOpen(true)}
                        className="flex items-center gap-1.5 rounded-full bg-[#1D4533] px-4 sm:px-5 py-2 text-[12px] sm:text-[13px] font-bold text-[#F7EAE0] shadow-xs transition hover:bg-[#143325] cursor-pointer"
                    >
                        <Plus size={16} /> <span>Unggah Baru</span>
                    </button>
                </div>
            </header>

            {/* CONTENT */}
            <main className="mx-auto max-w-[1140px] px-4 sm:px-6 lg:px-0 py-8">
                {/* TOOLBAR FILTER */}
                <div className="mb-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-1.5 rounded-xl border border-[#F9D2BA] bg-white p-1 text-[12px] font-bold shadow-2xs">
                        <button
                            type="button"
                            onClick={() => setStatusFilter("all")}
                            className={`rounded-lg px-3 py-1.5 transition cursor-pointer ${
                                statusFilter === "all"
                                    ? "bg-[#1D4533] text-[#F7EAE0]"
                                    : "text-[#5E3122]/70 hover:bg-[#F9D2BA]/20"
                            }`}
                        >
                            Semua ({ebooks.length})
                        </button>
                        <button
                            type="button"
                            onClick={() => setStatusFilter("published")}
                            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition cursor-pointer ${
                                statusFilter === "published"
                                    ? "bg-[#1D4533] text-[#F7EAE0]"
                                    : "text-[#5E3122]/70 hover:bg-[#F9D2BA]/20"
                            }`}
                        >
                            <CheckCircle2
                                size={13}
                                className="text-emerald-500"
                            />
                            Terbit (
                            {ebooks.filter((e) => e.is_published).length})
                        </button>
                        <button
                            type="button"
                            onClick={() => setStatusFilter("draft")}
                            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition cursor-pointer ${
                                statusFilter === "draft"
                                    ? "bg-[#1D4533] text-[#F7EAE0]"
                                    : "text-[#5E3122]/70 hover:bg-[#F9D2BA]/20"
                            }`}
                        >
                            <Clock size={13} className="text-amber-500" />
                            Draft (
                            {ebooks.filter((e) => !e.is_published).length})
                        </button>
                    </div>

                    <div className="relative max-w-xs w-full">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari risalah / penulis..."
                            className="w-full rounded-xl border border-[#F9D2BA] bg-white px-3.5 py-1.5 text-[12px] text-[#5E3122] focus:border-[#1D4533] focus:outline-none"
                        />
                    </div>
                </div>

                {filteredEbooks.length > 0 ? (
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredEbooks.map((ebook) => (
                            <div
                                key={ebook.id}
                                className="flex flex-col justify-between rounded-2xl border border-[#F9D2BA] bg-white p-5 shadow-xs transition-all hover:shadow-md"
                            >
                                <div>
                                    <div className="mb-4 aspect-[16/9] w-full overflow-hidden rounded-xl bg-[#FDFBF9] border border-[#F9D2BA]/60 flex items-center justify-center relative">
                                        {ebook.cover_image ? (
                                            <img
                                                src={ebook.cover_image}
                                                alt={ebook.title}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center gap-1 text-[#1D4533]/40">
                                                <FileText size={36} />
                                                <span className="text-[9px] font-bold uppercase tracking-wider">
                                                    PDF DOKUMEN
                                                </span>
                                            </div>
                                        )}

                                        {/* Toggle Status */}
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleToggleStatus(ebook.id)
                                            }
                                            title="Klik untuk mengubah status publikasi"
                                            className={`absolute top-2.5 right-2.5 flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase shadow-sm transition-transform active:scale-95 cursor-pointer ${
                                                ebook.is_published
                                                    ? "bg-[#1D4533] text-[#F7EAE0] hover:bg-[#143325]"
                                                    : "bg-amber-600 text-white hover:bg-amber-700"
                                            }`}
                                        >
                                            {ebook.is_published ? (
                                                <>
                                                    <CheckCircle2
                                                        size={11}
                                                        className="text-emerald-300"
                                                    />
                                                    <span>Terbit</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Clock size={11} />
                                                    <span>Draft</span>
                                                </>
                                            )}
                                        </button>
                                    </div>

                                    <h3 className="font-brand text-[15px] font-bold leading-snug text-[#1D4533] line-clamp-2">
                                        {ebook.title}
                                    </h3>

                                    <p className="mt-1.5 text-[11px] leading-relaxed text-[#5E3122]/70 line-clamp-2">
                                        {ebook.description ||
                                            "Tidak ada deskripsi singkat."}
                                    </p>

                                    <div className="mt-3 flex items-center gap-2 text-[10.5px] font-medium text-[#5E3122]/60">
                                        <span>Penulis: {ebook.author}</span>
                                        <span>•</span>
                                        <span>{ebook.file_size}</span>
                                        {ebook.total_pages && (
                                            <>
                                                <span>•</span>
                                                <span>
                                                    {ebook.total_pages} Hal
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* AKSI KARTU */}
                                <div className="mt-5 flex items-center justify-between pt-3 border-t border-[#F9D2BA]/40 gap-2">
                                    <Link
                                        href={`/ebook/${ebook.slug}`}
                                        target="_blank"
                                        className="flex flex-1 items-center justify-center gap-1 rounded-xl border border-[#F9D2BA] bg-[#FDFBF9] py-1.5 text-[11px] font-bold text-[#1D4533] hover:bg-[#F9D2BA]/30"
                                    >
                                        <Eye size={13} /> Pratinjau
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => handleOpenEdit(ebook)}
                                        className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#F7EAE0] text-[#1D4533] hover:bg-[#F9D2BA] transition cursor-pointer"
                                        title="Edit E-Book"
                                    >
                                        <Edit3 size={14} />
                                    </button>
                                    <a
                                        href={ebook.file_path}
                                        download
                                        className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#F7EAE0] text-[#1D4533] hover:bg-[#F9D2BA] transition"
                                        title="Unduh PDF"
                                    >
                                        <Download size={14} />
                                    </a>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleDelete(ebook.id, ebook.title)
                                        }
                                        className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition cursor-pointer"
                                        title="Hapus E-Book"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-2xl border border-dashed border-[#F9D2BA] bg-white p-12 text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#F7EAE0] text-[#1D4533] mb-4">
                            <BookOpen size={24} />
                        </div>
                        <h3 className="font-brand text-[17px] font-bold text-[#1D4533]">
                            Tidak Ada File E-Book
                        </h3>
                        <p className="mt-1 text-[13px] text-[#5E3122]/70">
                            Tidak ditemukan data risalah yang sesuai.
                        </p>
                    </div>
                )}
            </main>

            {/* MODAL 1: UPLOAD E-BOOK BARU */}
            {isUploadModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
                    <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between border-b border-[#F9D2BA] pb-3">
                            <h3 className="font-brand text-[17px] font-bold text-[#1D4533] flex items-center gap-2">
                                <Upload size={18} /> Unggah E-Book / Risalah PDF
                            </h3>
                            <button
                                type="button"
                                onClick={() => setIsUploadModalOpen(false)}
                                className="text-[#5E3122]/60 hover:text-black cursor-pointer"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <form
                            onSubmit={handleUploadSubmit}
                            className="space-y-4"
                        >
                            <div>
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5E3122] mb-1">
                                    Judul Risalah / Buku *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={createForm.data.title}
                                    onChange={(e) =>
                                        createForm.setData(
                                            "title",
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Contoh: Panduan Sholat Lengkap Sesuai Sunnah"
                                    className="w-full rounded-xl border border-[#F9D2BA] bg-[#FDFBF9] px-3.5 py-2 text-[13px] text-[#5E3122] focus:border-[#1D4533] focus:outline-none"
                                />
                                {createForm.errors.title && (
                                    <p className="mt-1 text-[10px] text-red-500">
                                        {createForm.errors.title}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5E3122] mb-1">
                                        Penulis / Pemateri
                                    </label>
                                    <input
                                        type="text"
                                        value={createForm.data.author}
                                        onChange={(e) =>
                                            createForm.setData(
                                                "author",
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Abu Haidar"
                                        className="w-full rounded-xl border border-[#F9D2BA] bg-[#FDFBF9] px-3.5 py-2 text-[13px] text-[#5E3122] focus:border-[#1D4533] focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5E3122] mb-1">
                                        Jumlah Halaman
                                    </label>
                                    <input
                                        type="number"
                                        value={createForm.data.total_pages}
                                        onChange={(e) =>
                                            createForm.setData(
                                                "total_pages",
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Contoh: 36"
                                        className="w-full rounded-xl border border-[#F9D2BA] bg-[#FDFBF9] px-3.5 py-2 text-[13px] text-[#5E3122] focus:border-[#1D4533] focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5E3122] mb-1">
                                    Ringkasan Isi Risalah
                                </label>
                                <textarea
                                    rows={2}
                                    value={createForm.data.description}
                                    onChange={(e) =>
                                        createForm.setData(
                                            "description",
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Penjelasan ringkas materi di dalam buku..."
                                    className="w-full rounded-xl border border-[#F9D2BA] bg-[#FDFBF9] px-3.5 py-2 text-[13px] text-[#5E3122] focus:border-[#1D4533] focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5E3122] mb-1">
                                    File Dokumen PDF * (Maks. 20 MB)
                                </label>
                                <input
                                    type="file"
                                    required
                                    accept="application/pdf"
                                    onChange={(e) =>
                                        createForm.setData(
                                            "pdf_file",
                                            e.target.files
                                                ? e.target.files[0]
                                                : null,
                                        )
                                    }
                                    className="w-full text-[12px] text-[#5E3122] file:mr-3 file:rounded-lg file:border-0 file:bg-[#F9D2BA]/40 file:px-3 file:py-1.5 file:text-[11px] file:font-bold file:text-[#1D4533] cursor-pointer"
                                />
                                {createForm.errors.pdf_file && (
                                    <p className="mt-1 text-[10px] text-red-500">
                                        {createForm.errors.pdf_file}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5E3122] mb-1">
                                    Gambar Sampul / Cover (Opsional)
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                        createForm.setData(
                                            "cover_image",
                                            e.target.files
                                                ? e.target.files[0]
                                                : null,
                                        )
                                    }
                                    className="w-full text-[12px] text-[#5E3122] file:mr-3 file:rounded-lg file:border-0 file:bg-[#F9D2BA]/40 file:px-3 file:py-1.5 file:text-[11px] file:font-bold file:text-[#1D4533] cursor-pointer"
                                />
                            </div>

                            <div className="rounded-xl border border-[#F9D2BA] bg-[#FDFBF9] p-3">
                                <label className="flex items-center gap-2.5 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={createForm.data.is_published}
                                        onChange={(e) =>
                                            createForm.setData(
                                                "is_published",
                                                e.target.checked,
                                            )
                                        }
                                        className="h-4 w-4 rounded text-[#1D4533] focus:ring-[#1D4533] accent-[#1D4533]"
                                    />
                                    <div>
                                        <div className="text-[12px] font-bold text-[#1D4533]">
                                            Langsung Publikasikan (Terbit)
                                        </div>
                                        <div className="text-[10px] text-[#5E3122]/70">
                                            Jika tidak dicentang, file berstatus
                                            Draft.
                                        </div>
                                    </div>
                                </label>
                            </div>

                            <div className="flex justify-end gap-2.5 pt-3 border-t border-[#F9D2BA]">
                                <button
                                    type="button"
                                    onClick={() => setIsUploadModalOpen(false)}
                                    className="rounded-xl border border-[#F9D2BA] px-4 py-2 text-[12px] font-bold text-[#5E3122] hover:bg-[#F9D2BA]/30 cursor-pointer"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={createForm.processing}
                                    className="flex items-center gap-1.5 rounded-xl bg-[#1D4533] px-5 py-2 text-[12px] font-bold text-[#F7EAE0] hover:bg-[#143325] disabled:opacity-50 cursor-pointer"
                                >
                                    <Check size={16} /> Simpan & Unggah PDF
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL 2: EDIT E-BOOK */}
            {editingEbook && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
                    <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between border-b border-[#F9D2BA] pb-3">
                            <h3 className="font-brand text-[17px] font-bold text-[#1D4533] flex items-center gap-2">
                                <Edit3 size={18} /> Sunting / Ganti File Risalah
                            </h3>
                            <button
                                type="button"
                                onClick={() => setEditingEbook(null)}
                                className="text-[#5E3122]/60 hover:text-black cursor-pointer"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleEditSubmit} className="space-y-4">
                            <div>
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5E3122] mb-1">
                                    Judul Risalah / Buku *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={editForm.data.title}
                                    onChange={(e) =>
                                        editForm.setData(
                                            "title",
                                            e.target.value,
                                        )
                                    }
                                    className="w-full rounded-xl border border-[#F9D2BA] bg-[#FDFBF9] px-3.5 py-2 text-[13px] text-[#5E3122] focus:border-[#1D4533] focus:outline-none"
                                />
                                {editForm.errors.title && (
                                    <p className="mt-1 text-[10px] text-red-500">
                                        {editForm.errors.title}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5E3122] mb-1">
                                        Penulis / Pemateri
                                    </label>
                                    <input
                                        type="text"
                                        value={editForm.data.author}
                                        onChange={(e) =>
                                            editForm.setData(
                                                "author",
                                                e.target.value,
                                            )
                                        }
                                        className="w-full rounded-xl border border-[#F9D2BA] bg-[#FDFBF9] px-3.5 py-2 text-[13px] text-[#5E3122] focus:border-[#1D4533] focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5E3122] mb-1">
                                        Jumlah Halaman
                                    </label>
                                    <input
                                        type="number"
                                        value={editForm.data.total_pages}
                                        onChange={(e) =>
                                            editForm.setData(
                                                "total_pages",
                                                e.target.value,
                                            )
                                        }
                                        className="w-full rounded-xl border border-[#F9D2BA] bg-[#FDFBF9] px-3.5 py-2 text-[13px] text-[#5E3122] focus:border-[#1D4533] focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5E3122] mb-1">
                                    Ringkasan Isi Risalah
                                </label>
                                <textarea
                                    rows={2}
                                    value={editForm.data.description}
                                    onChange={(e) =>
                                        editForm.setData(
                                            "description",
                                            e.target.value,
                                        )
                                    }
                                    className="w-full rounded-xl border border-[#F9D2BA] bg-[#FDFBF9] px-3.5 py-2 text-[13px] text-[#5E3122] focus:border-[#1D4533] focus:outline-none"
                                />
                            </div>

                            {/* Ganti PDF (Opsional) */}
                            <div className="rounded-xl border border-[#F9D2BA]/80 bg-[#FDFBF9] p-3">
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5E3122] mb-1">
                                    Ganti File Dokumen PDF (Biarkan kosong jika
                                    tidak diganti)
                                </label>
                                <input
                                    type="file"
                                    accept="application/pdf"
                                    onChange={(e) =>
                                        editForm.setData(
                                            "pdf_file",
                                            e.target.files
                                                ? e.target.files[0]
                                                : null,
                                        )
                                    }
                                    className="w-full text-[12px] text-[#5E3122] file:mr-3 file:rounded-lg file:border-0 file:bg-[#F9D2BA]/40 file:px-3 file:py-1.5 file:text-[11px] file:font-bold file:text-[#1D4533] cursor-pointer"
                                />
                                <p className="mt-1 text-[10.5px] text-[#5E3122]/70">
                                    File saat ini:{" "}
                                    <a
                                        href={editingEbook.file_path}
                                        target="_blank"
                                        className="font-bold text-[#1D4533] underline"
                                    >
                                        Lihat PDF Aktif
                                    </a>{" "}
                                    ({editingEbook.file_size})
                                </p>
                            </div>

                            {/* Ganti Cover (Opsional) */}
                            <div className="rounded-xl border border-[#F9D2BA]/80 bg-[#FDFBF9] p-3">
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5E3122] mb-1">
                                    Ganti Cover / Sampul (Biarkan kosong jika
                                    tidak diganti)
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                        editForm.setData(
                                            "cover_image",
                                            e.target.files
                                                ? e.target.files[0]
                                                : null,
                                        )
                                    }
                                    className="w-full text-[12px] text-[#5E3122] file:mr-3 file:rounded-lg file:border-0 file:bg-[#F9D2BA]/40 file:px-3 file:py-1.5 file:text-[11px] file:font-bold file:text-[#1D4533] cursor-pointer"
                                />
                            </div>

                            {/* Status Publish */}
                            <div className="rounded-xl border border-[#F9D2BA] bg-[#FDFBF9] p-3">
                                <label className="flex items-center gap-2.5 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={editForm.data.is_published}
                                        onChange={(e) =>
                                            editForm.setData(
                                                "is_published",
                                                e.target.checked,
                                            )
                                        }
                                        className="h-4 w-4 rounded text-[#1D4533] focus:ring-[#1D4533] accent-[#1D4533]"
                                    />
                                    <div>
                                        <div className="text-[12px] font-bold text-[#1D4533]">
                                            Status: Publikasikan (Terbit)
                                        </div>
                                        <div className="text-[10px] text-[#5E3122]/70">
                                            Hapus centang untuk mengubahnya
                                            menjadi Draft.
                                        </div>
                                    </div>
                                </label>
                            </div>

                            <div className="flex justify-end gap-2.5 pt-3 border-t border-[#F9D2BA]">
                                <button
                                    type="button"
                                    onClick={() => setEditingEbook(null)}
                                    className="rounded-xl border border-[#F9D2BA] px-4 py-2 text-[12px] font-bold text-[#5E3122] hover:bg-[#F9D2BA]/30 cursor-pointer"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={editForm.processing}
                                    className="flex items-center gap-1.5 rounded-xl bg-[#1D4533] px-5 py-2 text-[12px] font-bold text-[#F7EAE0] hover:bg-[#143325] disabled:opacity-50 cursor-pointer"
                                >
                                    <Check size={16} /> Simpan Perubahan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
