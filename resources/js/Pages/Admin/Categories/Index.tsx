import { Head, Link, useForm, router } from "@inertiajs/react";
import {
    ArrowLeft,
    Plus,
    Edit2,
    Trash2,
    Folder,
    FileText,
    X,
    Check,
} from "lucide-react";
import { useState } from "react";
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
        <div className="min-h-screen bg-[#F7EAE0] text-[#162B22] selection:bg-[#0F4C3A] selection:text-white pb-16">
            <Head title="Kelola Artikel - Dashboard Admin" />

            {/* ================= HEADER ================= */}
             <header className="sticky top-0 z-30 border-b border-[#F9D2BA] bg-[#F7EAE0]/95 backdrop-blur-md shadow-xs">
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
                            <h1 className="font-brand text-[16px] sm:text-[18px] font-bold text-[#111]">
                                Kelola Kategori
                            </h1>
                            <p className="text-[10px] uppercase tracking-wider text-[#6C857A] font-semibold hidden sm:block">
                                Klasifikasi Topik Kajian
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => setIsCreateOpen(true)}
                        className="flex items-center gap-1.5 rounded-full bg-[#0F4C3A] px-3.5 sm:px-4 py-2 text-[12px] sm:text-[13px] font-bold text-white transition hover:bg-[#0A382A] shadow-xs cursor-pointer"
                    >
                        <Plus size={16} />
                        <span>Tambah Kategori</span>
                    </button>
                </div>
            </header>

            {/* ================= MAIN CONTENT ================= */}
            <main className="mx-auto max-w-[1000px] px-4 sm:px-6 py-6 sm:py-8">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {categories.map((cat) => (
                        <div
                            key={cat.id}
                            className="flex flex-col justify-between rounded-2xl border border-[#E8E6E1] bg-white p-5 shadow-xs transition hover:shadow-md hover:border-[#0F4C3A]/30"
                        >
                            <div>
                                <div className="flex items-center justify-between">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F4F8F6] text-[#0F4C3A]">
                                        <Folder size={20} />
                                    </div>
                                    <span className="inline-flex items-center gap-1 rounded-full bg-[#F4F8F6] px-2.5 py-1 text-[11px] font-bold text-[#0F4C3A]">
                                        <FileText size={12} />{" "}
                                        {cat.articles_count ?? 0} Artikel
                                    </span>
                                </div>

                                <h3 className="mt-4 font-brand text-[16px] font-bold text-[#162B22]">
                                    {cat.name}
                                </h3>
                                <p className="mt-1 text-[11px] font-mono text-[#6C857A] truncate">
                                    /kategori/{cat.slug}
                                </p>
                            </div>

                            {/* Tombol Aksi */}
                            <div className="mt-5 flex items-center justify-end gap-2 border-t border-[#F4F4F0] pt-3">
                                <button
                                    type="button"
                                    onClick={() => handleOpenEdit(cat)}
                                    className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[12px] font-medium text-[#555] transition hover:bg-[#F4F4F0] hover:text-[#0F4C3A] cursor-pointer"
                                >
                                    <Edit2 size={13} /> Edit
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleDelete(cat)}
                                    className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[12px] font-medium text-red-600 transition hover:bg-red-50 cursor-pointer"
                                >
                                    <Trash2 size={13} /> Hapus
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {categories.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-[#CCD8D2] bg-white p-12 text-center text-[#8CA397]">
                        <Folder size={32} className="mx-auto mb-2 opacity-40" />
                        <p className="font-brand text-[14px]">
                            Belum ada kategori yang dibuat.
                        </p>
                    </div>
                )}
            </main>

            {/* ================= MODAL 1: TAMBAH KATEGORI ================= */}
            <AnimatePresence>
                {isCreateOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsCreateOpen(false)}
                            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 15 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 15 }}
                            className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2"
                        >
                            <div className="overflow-hidden rounded-2xl bg-white shadow-2xl border border-[#E8E6E1]">
                                <div className="flex items-center justify-between border-b border-[#E8E6E1] bg-[#FAFAF8] px-5 py-4">
                                    <h3 className="font-brand text-[16px] font-bold text-[#162B22]">
                                        Tambah Kategori Baru
                                    </h3>
                                    <button
                                        type="button"
                                        onClick={() => setIsCreateOpen(false)}
                                        className="rounded-lg p-1.5 text-[#777] transition hover:bg-[#E8E6E1] hover:text-[#111]"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>

                                <form
                                    onSubmit={handleCreateSubmit}
                                    className="p-5 sm:p-6 space-y-4"
                                >
                                    <div>
                                        <label className="block text-[12px] font-bold uppercase tracking-wider font-brand text-[#555] mb-1.5">
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
                                            placeholder="Contoh: Tafsir Al-Qur'an, Fikih Ibadah..."
                                            className="w-full rounded-xl border border-[#E8E6E1] bg-[#FAFAF8] px-4 py-2.5 text-[13px] sm:text-[14px] outline-none transition focus:border-[#0F4C3A] focus:bg-white"
                                            autoFocus
                                            required
                                        />
                                        {createForm.errors.name && (
                                            <p className="mt-1 text-[11px] text-red-600">
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
                                            className="rounded-xl px-4 py-2 text-[12px] sm:text-[13px] font-bold text-[#555] hover:bg-[#F4F4F0]"
                                        >
                                            Batal
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={createForm.processing}
                                            className="flex items-center gap-1.5 rounded-xl bg-[#0F4C3A] px-5 py-2 text-[12px] sm:text-[13px] font-bold text-white hover:bg-[#0A382A] disabled:opacity-50 shadow-xs cursor-pointer"
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

            {/* ================= MODAL 2: EDIT KATEGORI ================= */}
            <AnimatePresence>
                {editingCategory && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setEditingCategory(null)}
                            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 15 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 15 }}
                            className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2"
                        >
                            <div className="overflow-hidden rounded-2xl bg-white shadow-2xl border border-[#E8E6E1]">
                                <div className="flex items-center justify-between border-b border-[#E8E6E1] bg-[#FAFAF8] px-5 py-4">
                                    <h3 className="font-brand text-[16px] font-bold text-[#162B22]">
                                        Edit Kategori
                                    </h3>
                                    <button
                                        type="button"
                                        onClick={() => setEditingCategory(null)}
                                        className="rounded-lg p-1.5 text-[#777] transition hover:bg-[#E8E6E1] hover:text-[#111]"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>

                                <form
                                    onSubmit={handleEditSubmit}
                                    className="p-5 sm:p-6 space-y-4"
                                >
                                    <div>
                                        <label className="block text-[12px] font-bold uppercase tracking-wider font-brand text-[#555] mb-1.5">
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
                                            className="w-full rounded-xl border border-[#E8E6E1] bg-[#FAFAF8] px-4 py-2.5 text-[13px] sm:text-[14px] outline-none transition focus:border-[#0F4C3A] focus:bg-white"
                                            autoFocus
                                            required
                                        />
                                        {editForm.errors.name && (
                                            <p className="mt-1 text-[11px] text-red-600">
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
                                            className="rounded-xl px-4 py-2 text-[12px] sm:text-[13px] font-bold text-[#555] hover:bg-[#F4F4F0]"
                                        >
                                            Batal
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={editForm.processing}
                                            className="flex items-center gap-1.5 rounded-xl bg-[#0F4C3A] px-5 py-2 text-[12px] sm:text-[13px] font-bold text-white hover:bg-[#0A382A] disabled:opacity-50 shadow-xs cursor-pointer"
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
        </div>
    );
}
