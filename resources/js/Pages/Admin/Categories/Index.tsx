import React, { useState } from "react";
import { useForm, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Plus, Edit2, Trash2, Folder, FileText, X, Check, Tags } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CategoryItem {
    id: number;
    name: string;
    slug: string;
    articles_count?: number;
    created_at?: string;
}

interface CategoriesProps {
    categories: CategoryItem[];
}

export default function CategoriesIndex({ categories }: CategoriesProps) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(
        null,
    );

    const createForm = useForm({
        name: "",
    });

    const editForm = useForm({
        name: "",
    });

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post("/admin/categories", {
            onSuccess: () => {
                createForm.reset();
                setIsCreateOpen(false);
            },
        });
    };

    const handleOpenEdit = (category: CategoryItem) => {
        setEditingCategory(category);
        editForm.setData("name", category.name);
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingCategory) return;

        editForm.put(`/admin/categories/${editingCategory.id}`, {
            onSuccess: () => {
                setEditingCategory(null);
            },
        });
    };

    const handleDelete = (category: CategoryItem) => {
        if ((category.articles_count ?? 0) > 0) {
            alert(
                `Tidak dapat menghapus "${category.name}" karena masih terdapat ${category.articles_count} artikel di dalamnya.`,
            );
            return;
        }

        if (
            confirm(
                `Apakah Anda yakin ingin menghapus kategori "${category.name}"?`,
            )
        ) {
            router.delete(`/admin/categories/${category.id}`);
        }
    };

    return (
        <AdminLayout title="Kelola Kategori">
            {/* HEADER SUB SECTION */}
            <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8CEBC] pb-5">
                <div className="flex items-center gap-3.5">
                    <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-2xl bg-[#FAF3EB] border border-[#E8CEBC] text-[#1D4533] shadow-2xs">
                        <Tags size={22} />
                    </div>
                    <div>
                        <h1 className="font-brand text-[20px] sm:text-[24px] font-bold text-[#1D4533] leading-tight">
                            Kelola Kategori Kajian
                        </h1>
                        <p className="mt-0.5 text-[11px] sm:text-[12px] uppercase tracking-wider text-[#8C5E43] font-bold">
                            Total: {categories.length} Topik & Klasifikasi
                            Materi
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => setIsCreateOpen(true)}
                    className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#1D4533] px-5 py-2.5 text-[12.5px] sm:text-[13px] font-bold text-[#F7EAE0] shadow-2xs transition hover:bg-[#143325] cursor-pointer w-fit"
                >
                    <Plus size={16} />
                    <span>Tambah Kategori</span>
                </button>
            </div>

            {/* GRID KATEGORI (RESPONSIF TABLET 1027px & HP) */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {categories.map((cat) => (
                    <div
                        key={cat.id}
                        className="flex flex-col justify-between rounded-2xl border border-[#E8CEBC] bg-[#FDF9F5] p-5 shadow-xs transition hover:shadow-md hover:border-[#1D4533]/40"
                    >
                        <div>
                            <div className="flex items-center justify-between">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FAF3EB] text-[#1D4533]">
                                    <Folder size={20} />
                                </div>
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FAF3EB] border border-[#E8CEBC] px-2.5 py-1 text-[11px] font-bold text-[#1D4533]">
                                    <FileText size={12} />
                                    {cat.articles_count ?? 0} Artikel
                                </span>
                            </div>

                            <h3 className="mt-4 font-brand text-[16px] font-bold text-[#1D4533]">
                                {cat.name}
                            </h3>
                            <p className="mt-1 text-[11px] font-mono text-[#8C5E43] truncate">
                                /kategori/{cat.slug}
                            </p>
                        </div>

                        {/* Tombol Aksi */}
                        <div className="mt-5 flex items-center justify-end gap-2 border-t border-[#E8CEBC]/60 pt-3">
                            <button
                                type="button"
                                onClick={() => handleOpenEdit(cat)}
                                className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[12px] font-bold text-[#5E3122] transition hover:bg-[#FAF3EB] hover:text-[#1D4533] cursor-pointer"
                            >
                                <Edit2 size={13} /> Edit
                            </button>
                            <button
                                type="button"
                                onClick={() => handleDelete(cat)}
                                className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[12px] font-bold text-red-600 transition hover:bg-red-50 cursor-pointer"
                            >
                                <Trash2 size={13} /> Hapus
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {categories.length === 0 && (
                <div className="rounded-2xl border border-dashed border-[#E8CEBC] bg-[#FDF9F5] p-12 text-center text-[#5E3122]/50">
                    <Folder size={32} className="mx-auto mb-2 opacity-40" />
                    <p className="font-brand text-[14px]">
                        Belum ada kategori yang dibuat.
                    </p>
                </div>
            )}

            {/* ================= MODAL 1: TAMBAH KATEGORI (WARM CREAM) ================= */}
            <AnimatePresence>
                {isCreateOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsCreateOpen(false)}
                            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 15 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 15 }}
                            className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2"
                        >
                            <div className="overflow-hidden rounded-2xl bg-[#FDF9F5] shadow-2xl border border-[#E8CEBC]">
                                <div className="flex items-center justify-between border-b border-[#E8CEBC] bg-[#FAF3EB] px-5 py-4">
                                    <h3 className="font-brand text-[16px] font-bold text-[#1D4533]">
                                        Tambah Kategori Baru
                                    </h3>
                                    <button
                                        type="button"
                                        onClick={() => setIsCreateOpen(false)}
                                        className="rounded-lg p-1.5 text-[#5E3122]/70 transition hover:bg-[#F2E2D5] hover:text-[#1D4533]"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>

                                <form
                                    onSubmit={handleCreateSubmit}
                                    className="p-5 sm:p-6 space-y-4"
                                >
                                    <div>
                                        <label className="block text-[12px] font-bold uppercase tracking-wider font-brand text-[#5E3122] mb-1.5">
                                            Nama Kategori
                                        </label>
                                        <input
                                            type="text"
                                            value={createForm.data.name}
                                            onChange={(e) =>
                                                createForm.setData(
                                                    "name",
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Contoh: Tafsir Al-Qur'an, Fiqih..."
                                            className="w-full rounded-xl border border-[#E8CEBC] bg-[#FAF3EB] px-4 py-2.5 text-[13px] sm:text-[14px] text-[#5E3122] outline-none transition focus:border-[#1D4533] focus:bg-[#FDF9F5]"
                                            autoFocus
                                            required
                                        />
                                        {createForm.errors.name && (
                                            <p className="mt-1 text-[11px] font-bold text-red-600">
                                                {createForm.errors.name}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex justify-end gap-2.5 pt-2">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setIsCreateOpen(false)
                                            }
                                            className="rounded-xl px-4 py-2 text-[12px] sm:text-[13px] font-bold text-[#5E3122] hover:bg-[#FAF3EB]"
                                        >
                                            Batal
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={createForm.processing}
                                            className="flex items-center gap-1.5 rounded-xl bg-[#1D4533] px-5 py-2 text-[12px] sm:text-[13px] font-bold text-[#F7EAE0] hover:bg-[#143325] disabled:opacity-50 shadow-xs cursor-pointer"
                                        >
                                            <Check size={15} /> Simpan
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* ================= MODAL 2: EDIT KATEGORI (WARM CREAM) ================= */}
            <AnimatePresence>
                {editingCategory && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setEditingCategory(null)}
                            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 15 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 15 }}
                            className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2"
                        >
                            <div className="overflow-hidden rounded-2xl bg-[#FDF9F5] shadow-2xl border border-[#E8CEBC]">
                                <div className="flex items-center justify-between border-b border-[#E8CEBC] bg-[#FAF3EB] px-5 py-4">
                                    <h3 className="font-brand text-[16px] font-bold text-[#1D4533]">
                                        Edit Kategori
                                    </h3>
                                    <button
                                        type="button"
                                        onClick={() => setEditingCategory(null)}
                                        className="rounded-lg p-1.5 text-[#5E3122]/70 transition hover:bg-[#F2E2D5] hover:text-[#1D4533]"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>

                                <form
                                    onSubmit={handleEditSubmit}
                                    className="p-5 sm:p-6 space-y-4"
                                >
                                    <div>
                                        <label className="block text-[12px] font-bold uppercase tracking-wider font-brand text-[#5E3122] mb-1.5">
                                            Nama Kategori
                                        </label>
                                        <input
                                            type="text"
                                            value={editForm.data.name}
                                            onChange={(e) =>
                                                editForm.setData(
                                                    "name",
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full rounded-xl border border-[#E8CEBC] bg-[#FAF3EB] px-4 py-2.5 text-[13px] sm:text-[14px] text-[#5E3122] outline-none transition focus:border-[#1D4533] focus:bg-[#FDF9F5]"
                                            autoFocus
                                            required
                                        />
                                        {editForm.errors.name && (
                                            <p className="mt-1 text-[11px] font-bold text-red-600">
                                                {editForm.errors.name}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex justify-end gap-2.5 pt-2">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setEditingCategory(null)
                                            }
                                            className="rounded-xl px-4 py-2 text-[12px] sm:text-[13px] font-bold text-[#5E3122] hover:bg-[#FAF3EB]"
                                        >
                                            Batal
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={editForm.processing}
                                            className="flex items-center gap-1.5 rounded-xl bg-[#1D4533] px-5 py-2 text-[12px] sm:text-[13px] font-bold text-[#F7EAE0] hover:bg-[#143325] disabled:opacity-50 shadow-xs cursor-pointer"
                                        >
                                            <Check size={15} /> Simpan Perubahan
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </AdminLayout>
    );
}
