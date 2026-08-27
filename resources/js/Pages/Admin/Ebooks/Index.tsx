import React, { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import { Link, useForm, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import {
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
    BookDown,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

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
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

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
                router.reload({ only: ["ebooks"] });
            } else {
                const err = await response.json();
                alert(err.message || "Gagal mengubah status E-Book");
            }
        } catch (error) {
            console.error("Gagal toggle status:", error);
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
        <AdminLayout title="Kelola E-Book PDF">
            {/* HEADER SUB SECTION */}
            <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8CEBC] pb-5">
                <div className="flex items-center gap-3.5 min-w-0">
                    <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-2xl bg-[#FAF3EB] border border-[#E8CEBC] text-[#1D4533] shadow-2xs">
                        <BookDown size={22} />
                    </div>
                    <div className="min-w-0">
                        <h1 className="font-brand text-[20px] sm:text-[24px] font-bold text-[#1D4533] leading-tight truncate">
                            Kelola E-Book PDF
                        </h1>
                        <p className="mt-0.5 text-[11px] sm:text-[12px] uppercase tracking-wider text-[#8C5E43] font-bold truncate">
                            Total: {ebooks.length} File Risalah & Dokumen Ilmiah
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => setIsUploadModalOpen(true)}
                    className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#1D4533] px-5 py-2.5 text-[12.5px] sm:text-[13px] font-bold text-[#F7EAE0] shadow-2xs transition hover:bg-[#143325] cursor-pointer w-full sm:w-fit shrink-0 active:scale-95"
                >
                    <Plus size={16} />
                    <span>Unggah Baru</span>
                </button>
            </div>

            {/* TOOLBAR FILTER & SEARCH */}
            <div className="mb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 rounded-xl border border-[#E8CEBC] bg-[#FDF9F5] p-1 text-[11.5px] sm:text-[12px] font-bold shadow-2xs overflow-x-auto">
                    <button
                        type="button"
                        onClick={() => setStatusFilter("all")}
                        className={`rounded-lg px-3 py-1.5 transition whitespace-nowrap cursor-pointer ${
                            statusFilter === "all"
                                ? "bg-[#1D4533] text-[#F7EAE0]"
                                : "text-[#5E3122]/70 hover:bg-[#FAF3EB]"
                        }`}
                    >
                        Semua ({ebooks.length})
                    </button>
                    <button
                        type="button"
                        onClick={() => setStatusFilter("published")}
                        className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition whitespace-nowrap cursor-pointer ${
                            statusFilter === "published"
                                ? "bg-[#1D4533] text-[#F7EAE0]"
                                : "text-[#5E3122]/70 hover:bg-[#FAF3EB]"
                        }`}
                    >
                        <CheckCircle2 size={13} className="text-emerald-500" />
                        Terbit ({ebooks.filter((e) => e.is_published).length})
                    </button>
                    <button
                        type="button"
                        onClick={() => setStatusFilter("draft")}
                        className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition whitespace-nowrap cursor-pointer ${
                            statusFilter === "draft"
                                ? "bg-[#1D4533] text-[#F7EAE0]"
                                : "text-[#5E3122]/70 hover:bg-[#FAF3EB]"
                        }`}
                    >
                        <Clock size={13} className="text-amber-500" />
                        Draft ({ebooks.filter((e) => !e.is_published).length})
                    </button>
                </div>

                <div className="relative w-full md:max-w-xs">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Cari risalah / penulis..."
                        className="w-full rounded-xl border border-[#E8CEBC] bg-[#FDF9F5] px-3.5 py-2 text-[12.5px] text-[#5E3122] focus:border-[#1D4533] focus:outline-none"
                    />
                </div>
            </div>

            {/* GRID DAFTAR E-BOOK */}
            {filteredEbooks.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredEbooks.map((ebook) => (
                        <div
                            key={ebook.id}
                            className="flex flex-col justify-between rounded-2xl border border-[#E8CEBC] bg-[#FDF9F5] p-4 sm:p-5 shadow-xs transition-all hover:shadow-md hover:border-[#1D4533]/40"
                        >
                            <div>
                                <div className="mb-3.5 aspect-[16/9] w-full overflow-hidden rounded-xl bg-[#FAF3EB] border border-[#E8CEBC]/60 flex items-center justify-center relative">
                                    {ebook.cover_image ? (
                                        <img
                                            src={ebook.cover_image}
                                            alt={ebook.title}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center gap-1 text-[#1D4533]/40">
                                            <FileText size={32} />
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
                                        className={`absolute top-2.5 right-2.5 flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[9.5px] font-bold uppercase shadow-xs transition-transform active:scale-95 cursor-pointer ${
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

                                <h3 className="font-brand text-[14.5px] sm:text-[15px] font-bold leading-snug text-[#1D4533] line-clamp-2">
                                    {ebook.title}
                                </h3>

                                <p className="mt-1.5 text-[11.5px] leading-relaxed text-[#5E3122]/70 line-clamp-2">
                                    {ebook.description ||
                                        "Tidak ada deskripsi singkat."}
                                </p>

                                <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[10.5px] font-medium text-[#8C5E43]">
                                    <span>Penulis: {ebook.author}</span>
                                    <span>•</span>
                                    <span>{ebook.file_size}</span>
                                    {ebook.total_pages && (
                                        <>
                                            <span>•</span>
                                            <span>{ebook.total_pages} Hal</span>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* AKSI KARTU */}
                            <div className="mt-4 sm:mt-5 flex items-center justify-between pt-3 border-t border-[#E8CEBC]/60 gap-1.5">
                                <Link
                                    href={`/ebook/${ebook.slug}`}
                                    target="_blank"
                                    className="flex flex-1 items-center justify-center gap-1 rounded-xl border border-[#E8CEBC] bg-[#FAF3EB] py-1.5 text-[11px] font-bold text-[#1D4533] hover:bg-[#F2E2D5]"
                                >
                                    <Eye size={13} /> <span>Pratinjau</span>
                                </Link>
                                <button
                                    type="button"
                                    onClick={() => handleOpenEdit(ebook)}
                                    className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#FAF3EB] border border-[#E8CEBC] text-[#1D4533] hover:bg-[#F2E2D5] transition cursor-pointer shrink-0"
                                    title="Edit E-Book"
                                >
                                    <Edit3 size={14} />
                                </button>
                                <a
                                    href={ebook.file_path}
                                    download
                                    className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#FAF3EB] border border-[#E8CEBC] text-[#1D4533] hover:bg-[#F2E2D5] transition shrink-0"
                                    title="Unduh PDF"
                                >
                                    <Download size={14} />
                                </a>
                                <button
                                    type="button"
                                    onClick={() =>
                                        handleDelete(ebook.id, ebook.title)
                                    }
                                    className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-100/70 border border-red-200 text-red-600 hover:bg-red-200 transition cursor-pointer shrink-0"
                                    title="Hapus E-Book"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="rounded-2xl border border-dashed border-[#E8CEBC] bg-[#FDF9F5] p-8 sm:p-12 text-center">
                    <div className="mx-auto flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-[#FAF3EB] text-[#1D4533] mb-3 sm:mb-4">
                        <BookOpen size={22} />
                    </div>
                    <h3 className="font-brand text-[16px] sm:text-[17px] font-bold text-[#1D4533]">
                        Tidak Ada File E-Book
                    </h3>
                    <p className="mt-1 text-[12px] sm:text-[13px] text-[#5E3122]/70">
                        Tidak ditemukan data risalah yang sesuai.
                    </p>
                </div>
            )}

            {/* ================= MODAL 1: UPLOAD E-BOOK BARU (PORTAL) ================= */}
            {mounted &&
                createPortal(
                    <AnimatePresence>
                        {isUploadModalOpen && (
                            <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onClick={() => setIsUploadModalOpen(false)}
                                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-0"
                                />

                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: 15 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: 15 }}
                                    transition={{ duration: 0.25 }}
                                    className="relative z-10 w-full max-w-lg rounded-3xl bg-[#FDF9F5] shadow-2xl border border-[#E8CEBC] flex flex-col max-h-[88vh] my-auto overflow-hidden text-[#5E3122]"
                                >
                                    {/* Modal Header */}
                                    <div className="flex items-center justify-between border-b border-[#E8CEBC] bg-[#FAF3EB] px-6 py-4 shrink-0 rounded-t-3xl">
                                        <div className="flex items-center gap-2.5">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1D4533] text-[#F7EAE0] shadow-xs">
                                                <Upload size={18} />
                                            </div>
                                            <div>
                                                <h3 className="font-brand text-[17px] font-bold text-[#1D4533] leading-none">
                                                    Unggah E-Book Baru
                                                </h3>
                                                <p className="text-[11px] text-[#8C5E43] font-medium mt-0.5">
                                                    Publikasikan risalah atau
                                                    kitab PDF
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setIsUploadModalOpen(false)
                                            }
                                            className="flex h-8 w-8 items-center justify-center rounded-full bg-white border border-[#E8CEBC] text-[#5E3122]/70 transition hover:bg-[#F2E2D5] hover:text-[#1D4533] cursor-pointer shadow-2xs"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>

                                    {/* Modal Body */}
                                    <form
                                        onSubmit={handleUploadSubmit}
                                        className="flex flex-col flex-1 min-h-0 overflow-hidden"
                                    >
                                        <div className="p-6 space-y-4 overflow-y-auto flex-1 overscroll-contain">
                                            {/* Judul Risalah */}
                                            <div>
                                                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5E3122] mb-1">
                                                    Judul Risalah / Buku *
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={
                                                        createForm.data.title
                                                    }
                                                    onChange={(e) =>
                                                        createForm.setData(
                                                            "title",
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="Contoh: Panduan Sholat Sesuai Sunnah"
                                                    className="w-full rounded-xl border border-[#E8CEBC] bg-[#FAF3EB] px-3.5 py-2.5 text-[13px] text-[#5E3122] outline-none transition focus:border-[#1D4533] focus:bg-white focus:ring-2 focus:ring-[#1D4533]/15"
                                                />
                                                {createForm.errors.title && (
                                                    <p className="mt-1 text-[10.5px] text-red-500 font-bold">
                                                        {
                                                            createForm.errors
                                                                .title
                                                        }
                                                    </p>
                                                )}
                                            </div>

                                            {/* Penulis & Total Halaman (2 Kolom) */}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                                <div>
                                                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5E3122] mb-1">
                                                        Penulis / Pemateri
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={
                                                            createForm.data
                                                                .author
                                                        }
                                                        onChange={(e) =>
                                                            createForm.setData(
                                                                "author",
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder="Abu Haidar"
                                                        className="w-full rounded-xl border border-[#E8CEBC] bg-[#FAF3EB] px-3.5 py-2.5 text-[13px] text-[#5E3122] outline-none transition focus:border-[#1D4533] focus:bg-white focus:ring-2 focus:ring-[#1D4533]/15"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5E3122] mb-1">
                                                        Jumlah Halaman
                                                    </label>
                                                    <input
                                                        type="number"
                                                        value={
                                                            createForm.data
                                                                .total_pages
                                                        }
                                                        onChange={(e) =>
                                                            createForm.setData(
                                                                "total_pages",
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder="Contoh: 36"
                                                        className="w-full rounded-xl border border-[#E8CEBC] bg-[#FAF3EB] px-3.5 py-2.5 text-[13px] text-[#5E3122] outline-none transition focus:border-[#1D4533] focus:bg-white focus:ring-2 focus:ring-[#1D4533]/15"
                                                    />
                                                </div>
                                            </div>

                                            {/* Ringkasan Isi */}
                                            <div>
                                                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5E3122] mb-1">
                                                    Ringkasan Isi Risalah
                                                </label>
                                                <textarea
                                                    rows={2}
                                                    value={
                                                        createForm.data
                                                            .description
                                                    }
                                                    onChange={(e) =>
                                                        createForm.setData(
                                                            "description",
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="Penjelasan ringkas isi buku..."
                                                    className="w-full rounded-xl border border-[#E8CEBC] bg-[#FAF3EB] px-3.5 py-2 text-[13px] text-[#5E3122] outline-none transition focus:border-[#1D4533] focus:bg-white focus:ring-2 focus:ring-[#1D4533]/15 resize-none"
                                                />
                                            </div>

                                            {/* File Dokumen PDF */}
                                            <div>
                                                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5E3122] mb-1">
                                                    File Dokumen PDF * (Maks. 20
                                                    MB)
                                                </label>
                                                <input
                                                    type="file"
                                                    required
                                                    accept="application/pdf"
                                                    onChange={(e) =>
                                                        createForm.setData(
                                                            "pdf_file",
                                                            e.target.files
                                                                ? e.target
                                                                      .files[0]
                                                                : null,
                                                        )
                                                    }
                                                    className="w-full text-[12px] text-[#5E3122] file:mr-3 file:rounded-xl file:border-0 file:bg-[#1D4533] file:px-3.5 file:py-2 file:text-[11.5px] file:font-bold file:text-[#F7EAE0] hover:file:bg-[#143325] cursor-pointer"
                                                />
                                                {createForm.errors.pdf_file && (
                                                    <p className="mt-1 text-[10.5px] text-red-500 font-bold">
                                                        {
                                                            createForm.errors
                                                                .pdf_file
                                                        }
                                                    </p>
                                                )}
                                            </div>

                                            {/* Sampul Cover */}
                                            <div>
                                                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5E3122] mb-1">
                                                    Gambar Sampul / Cover
                                                    (Opsional)
                                                </label>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) =>
                                                        createForm.setData(
                                                            "cover_image",
                                                            e.target.files
                                                                ? e.target
                                                                      .files[0]
                                                                : null,
                                                        )
                                                    }
                                                    className="w-full text-[12px] text-[#5E3122] file:mr-3 file:rounded-xl file:border-0 file:bg-[#FAF3EB] file:border-[#E8CEBC] file:border file:px-3.5 file:py-2 file:text-[11.5px] file:font-bold file:text-[#1D4533] hover:file:bg-[#F2E2D5] cursor-pointer"
                                                />
                                            </div>

                                            {/* Opsi Publikasi */}
                                            <div className="rounded-2xl border border-[#E8CEBC] bg-[#FAF3EB] p-3.5">
                                                <label className="flex items-center gap-3 cursor-pointer select-none">
                                                    <input
                                                        type="checkbox"
                                                        checked={
                                                            createForm.data
                                                                .is_published
                                                        }
                                                        onChange={(e) =>
                                                            createForm.setData(
                                                                "is_published",
                                                                e.target
                                                                    .checked,
                                                            )
                                                        }
                                                        className="h-4 w-4 rounded text-[#1D4533] focus:ring-[#1D4533] accent-[#1D4533] shrink-0 cursor-pointer"
                                                    />
                                                    <div>
                                                        <div className="text-[12px] font-bold text-[#1D4533]">
                                                            Langsung Terbitkan
                                                            E-Book
                                                        </div>
                                                        <div className="text-[10.5px] text-[#5E3122]/70">
                                                            Dapat langsung
                                                            diakses dan diunduh
                                                            oleh pengunjung.
                                                        </div>
                                                    </div>
                                                </label>
                                            </div>
                                        </div>

                                        {/* Modal Footer */}
                                        <div className="flex flex-col-reverse sm:flex-row justify-end gap-2.5 px-6 py-4 border-t border-[#E8CEBC] bg-[#FAF3EB]/60 shrink-0 rounded-b-3xl">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setIsUploadModalOpen(false)
                                                }
                                                className="w-full sm:w-auto rounded-xl border border-[#E8CEBC] px-4 py-2 text-[12px] font-bold text-[#5E3122] hover:bg-[#FAF3EB] cursor-pointer text-center"
                                            >
                                                Batal
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={createForm.processing}
                                                className="w-full sm:w-auto flex items-center justify-center gap-1.5 rounded-xl bg-[#1D4533] px-5 py-2 text-[12px] font-bold text-[#F7EAE0] hover:bg-[#143325] disabled:opacity-50 cursor-pointer shadow-xs active:scale-95"
                                            >
                                                <Check size={16} />
                                                <span>
                                                    {createForm.processing
                                                        ? "Mengunggah..."
                                                        : "Simpan & Unggah"}
                                                </span>
                                            </button>
                                        </div>
                                    </form>
                                </motion.div>
                            </div>
                        )}
                    </AnimatePresence>,
                    document.body,
                )}

            {/* ================= MODAL 2: EDIT E-BOOK (PORTAL) ================= */}
            {mounted &&
                createPortal(
                    <AnimatePresence>
                        {editingEbook && (
                            <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onClick={() => setEditingEbook(null)}
                                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-0"
                                />

                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: 15 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: 15 }}
                                    transition={{ duration: 0.25 }}
                                    className="relative z-10 w-full max-w-lg rounded-3xl bg-[#FDF9F5] shadow-2xl border border-[#E8CEBC] flex flex-col max-h-[88vh] my-auto overflow-hidden text-[#5E3122]"
                                >
                                    {/* Modal Header */}
                                    <div className="flex items-center justify-between border-b border-[#E8CEBC] bg-[#FAF3EB] px-6 py-4 shrink-0 rounded-t-3xl">
                                        <div className="flex items-center gap-2.5 min-w-0 pr-2">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1D4533] text-[#F7EAE0] shadow-xs shrink-0">
                                                <Edit3 size={18} />
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="font-brand text-[17px] font-bold text-[#1D4533] leading-none truncate">
                                                    Sunting Risalah
                                                </h3>
                                                <p className="text-[11px] text-[#8C5E43] font-medium mt-0.5 truncate">
                                                    Perbarui rincian, file PDF,
                                                    atau sampul
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setEditingEbook(null)
                                            }
                                            className="flex h-8 w-8 items-center justify-center rounded-full bg-white border border-[#E8CEBC] text-[#5E3122]/70 transition hover:bg-[#F2E2D5] hover:text-[#1D4533] cursor-pointer shadow-2xs shrink-0"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>

                                    {/* Modal Body */}
                                    <form
                                        onSubmit={handleEditSubmit}
                                        className="flex flex-col flex-1 min-h-0 overflow-hidden"
                                    >
                                        <div className="p-6 space-y-4 overflow-y-auto flex-1 overscroll-contain">
                                            {/* Judul Risalah */}
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
                                                    className="w-full rounded-xl border border-[#E8CEBC] bg-[#FAF3EB] px-3.5 py-2.5 text-[13px] text-[#5E3122] outline-none transition focus:border-[#1D4533] focus:bg-white focus:ring-2 focus:ring-[#1D4533]/15"
                                                />
                                                {editForm.errors.title && (
                                                    <p className="mt-1 text-[10.5px] text-red-500 font-bold">
                                                        {editForm.errors.title}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Penulis & Total Halaman (2 Kolom) */}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                                <div>
                                                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5E3122] mb-1">
                                                        Penulis / Pemateri
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={
                                                            editForm.data.author
                                                        }
                                                        onChange={(e) =>
                                                            editForm.setData(
                                                                "author",
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="w-full rounded-xl border border-[#E8CEBC] bg-[#FAF3EB] px-3.5 py-2.5 text-[13px] text-[#5E3122] outline-none transition focus:border-[#1D4533] focus:bg-white focus:ring-2 focus:ring-[#1D4533]/15"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5E3122] mb-1">
                                                        Jumlah Halaman
                                                    </label>
                                                    <input
                                                        type="number"
                                                        value={
                                                            editForm.data
                                                                .total_pages
                                                        }
                                                        onChange={(e) =>
                                                            editForm.setData(
                                                                "total_pages",
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="w-full rounded-xl border border-[#E8CEBC] bg-[#FAF3EB] px-3.5 py-2.5 text-[13px] text-[#5E3122] outline-none transition focus:border-[#1D4533] focus:bg-white focus:ring-2 focus:ring-[#1D4533]/15"
                                                    />
                                                </div>
                                            </div>

                                            {/* Ringkasan Isi */}
                                            <div>
                                                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5E3122] mb-1">
                                                    Ringkasan Isi Risalah
                                                </label>
                                                <textarea
                                                    rows={2}
                                                    value={
                                                        editForm.data
                                                            .description
                                                    }
                                                    onChange={(e) =>
                                                        editForm.setData(
                                                            "description",
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="w-full rounded-xl border border-[#E8CEBC] bg-[#FAF3EB] px-3.5 py-2 text-[13px] text-[#5E3122] outline-none transition focus:border-[#1D4533] focus:bg-white focus:ring-2 focus:ring-[#1D4533]/15 resize-none"
                                                />
                                            </div>

                                            {/* Ganti File Dokumen PDF */}
                                            <div className="rounded-2xl border border-[#E8CEBC] bg-[#FAF3EB] p-3.5">
                                                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5E3122] mb-1">
                                                    Ganti File PDF (Opsional)
                                                </label>
                                                <input
                                                    type="file"
                                                    accept="application/pdf"
                                                    onChange={(e) =>
                                                        editForm.setData(
                                                            "pdf_file",
                                                            e.target.files
                                                                ? e.target
                                                                      .files[0]
                                                                : null,
                                                        )
                                                    }
                                                    className="w-full text-[12px] text-[#5E3122] file:mr-3 file:rounded-xl file:border-0 file:bg-[#1D4533] file:px-3.5 file:py-1.5 file:text-[11px] file:font-bold file:text-[#F7EAE0] hover:file:bg-[#143325] cursor-pointer"
                                                />
                                                <p className="mt-1.5 text-[10.5px] text-[#5E3122]/70 break-all">
                                                    File aktif:{" "}
                                                    <a
                                                        href={
                                                            editingEbook.file_path
                                                        }
                                                        target="_blank"
                                                        className="font-bold text-[#1D4533] underline"
                                                    >
                                                        Lihat PDF
                                                    </a>{" "}
                                                    ({editingEbook.file_size})
                                                </p>
                                            </div>

                                            {/* Ganti Sampul */}
                                            <div className="rounded-2xl border border-[#E8CEBC] bg-[#FAF3EB] p-3.5">
                                                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5E3122] mb-1">
                                                    Ganti Sampul (Opsional)
                                                </label>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) =>
                                                        editForm.setData(
                                                            "cover_image",
                                                            e.target.files
                                                                ? e.target
                                                                      .files[0]
                                                                : null,
                                                        )
                                                    }
                                                    className="w-full text-[12px] text-[#5E3122] file:mr-3 file:rounded-xl file:border-0 file:bg-white file:border-[#E8CEBC] file:border file:px-3.5 file:py-1.5 file:text-[11px] file:font-bold file:text-[#1D4533] hover:file:bg-[#FAF3EB] cursor-pointer"
                                                />
                                            </div>

                                            {/* Status Publikasi */}
                                            <div className="rounded-2xl border border-[#E8CEBC] bg-[#FAF3EB] p-3.5">
                                                <label className="flex items-center gap-3 cursor-pointer select-none">
                                                    <input
                                                        type="checkbox"
                                                        checked={
                                                            editForm.data
                                                                .is_published
                                                        }
                                                        onChange={(e) =>
                                                            editForm.setData(
                                                                "is_published",
                                                                e.target
                                                                    .checked,
                                                            )
                                                        }
                                                        className="h-4 w-4 rounded text-[#1D4533] focus:ring-[#1D4533] accent-[#1D4533] shrink-0 cursor-pointer"
                                                    />
                                                    <div>
                                                        <div className="text-[12px] font-bold text-[#1D4533]">
                                                            Status: Publikasikan
                                                            (Terbit)
                                                        </div>
                                                        <div className="text-[10.5px] text-[#5E3122]/70">
                                                            Hapus centang untuk
                                                            mengubahnya menjadi
                                                            Draft.
                                                        </div>
                                                    </div>
                                                </label>
                                            </div>
                                        </div>

                                        {/* Modal Footer */}
                                        <div className="flex flex-col-reverse sm:flex-row justify-end gap-2.5 px-6 py-4 border-t border-[#E8CEBC] bg-[#FAF3EB]/60 shrink-0 rounded-b-3xl">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setEditingEbook(null)
                                                }
                                                className="w-full sm:w-auto rounded-xl border border-[#E8CEBC] px-4 py-2 text-[12px] font-bold text-[#5E3122] hover:bg-[#FAF3EB] cursor-pointer text-center"
                                            >
                                                Batal
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={editForm.processing}
                                                className="w-full sm:w-auto flex items-center justify-center gap-1.5 rounded-xl bg-[#1D4533] px-5 py-2 text-[12px] font-bold text-[#F7EAE0] hover:bg-[#143325] disabled:opacity-50 cursor-pointer shadow-xs active:scale-95"
                                            >
                                                <Check size={16} />
                                                <span>
                                                    {editForm.processing
                                                        ? "Menyimpan..."
                                                        : "Simpan Perubahan"}
                                                </span>
                                            </button>
                                        </div>
                                    </form>
                                </motion.div>
                            </div>
                        )}
                    </AnimatePresence>,
                    document.body,
                )}
        </AdminLayout>
    );
}
