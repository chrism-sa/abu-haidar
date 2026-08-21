import { Head, Link, useForm, router } from "@inertiajs/react";
import { 
    ArrowLeft, 
    Plus, 
    Edit2, 
    Trash2, 
    Folder, 
    FileText, 
    X, 
    Check 
} from "lucide-react";
import { useState } from "react";

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
    // Modal State
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);

    // Form Tambah Kategori
    const createForm = useForm({
        name: "",
    });

    // Form Edit Kategori
    const editForm = useForm({
        name: "",
    });

    // Submit Tambah Kategori
    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post("/admin/categories", {
            onSuccess: () => {
                createForm.reset();
                setIsCreateOpen(false);
            },
        });
    };

    // Buka Modal Edit
    const handleOpenEdit = (category: CategoryItem) => {
        setEditingCategory(category);
        editForm.setData("name", category.name);
    };

    // Submit Edit Kategori
    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingCategory) return;

        editForm.put(`/admin/categories/${editingCategory.id}`, {
            onSuccess: () => {
                setEditingCategory(null);
            },
        });
    };

    // Hapus Kategori
    const handleDelete = (category: CategoryItem) => {
        if ((category.articles_count ?? 0) > 0) {
            alert(`Tidak dapat menghapus "${category.name}" karena masih terdapat ${category.articles_count} artikel di dalamnya.`);
            return;
        }

        if (confirm(`Apakah Anda yakin ingin menghapus kategori "${category.name}"?`)) {
            router.delete(`/admin/categories/${category.id}`);
        }
    };

    return (
        <div className="min-h-screen bg-[#eaf6efc0] text-[#17251f]">
            <Head title="Kelola Kategori - Abu Haidar" />

            {/* HEADER KONTROL */}
            <header className="border-b border-[#e5e2da] bg-white shadow-xs sticky top-0 z-20">
                <div className="mx-auto flex max-w-[1000px] items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/admin/dashboard"
                            className="flex items-center gap-1.5 rounded-lg border border-[#dcd7ce] bg-white px-3 py-2 text-[12px] font-medium text-[#333] transition hover:bg-[#faf8f5]"
                        >
                            <ArrowLeft size={14} /> Kembali
                        </Link>
                        <h1 className="font-serif text-[18px] font-bold text-[#111]">
                            Kelola Kategori
                        </h1>
                    </div>

                    <button
                        onClick={() => setIsCreateOpen(true)}
                        className="flex items-center gap-2 rounded-xl bg-[#063f2f] px-4 py-2 text-[13px] font-bold text-white transition hover:bg-[#07513c] shadow-sm"
                    >
                        <Plus size={15} /> Tambah Kategori
                    </button>
                </div>
            </header>

            <main className="mx-auto max-w-[1000px] px-6 py-8">
                {/* DAFTAR KARTU KATEGORI */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {categories.map((cat) => (
                        <div
                            key={cat.id}
                            className="flex flex-col justify-between rounded-2xl border border-[#e5e2da] bg-white p-5 shadow-xs transition hover:shadow-md"
                        >
                            <div>
                                <div className="flex items-center justify-between">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f0eee9] text-[#063f2f]">
                                        <Folder size={20} />
                                    </div>
                                    <span className="inline-flex items-center gap-1 rounded-full bg-[#f4f8f6] px-2.5 py-1 text-[11px] font-bold text-[#063f2f]">
                                        <FileText size={12} /> {cat.articles_count ?? 0} Artikel
                                    </span>
                                </div>

                                <h3 className="mt-4 font-serif text-[16px] font-bold text-[#17251f]">
                                    {cat.name}
                                </h3>
                                <p className="mt-1 text-[11px] font-mono text-[#888]">
                                    /kategori/{cat.slug}
                                </p>
                            </div>

                            {/* Tombol Aksi */}
                            <div className="mt-5 flex items-center justify-end gap-2 border-t border-[#f0eee9] pt-3">
                                <button
                                    type="button"
                                    onClick={() => handleOpenEdit(cat)}
                                    className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[12px] font-medium text-[#555] transition hover:bg-[#eaf6efc0] hover:text-black"
                                >
                                    <Edit2 size={13} /> Edit
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleDelete(cat)}
                                    className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[12px] font-medium text-red-600 transition hover:bg-red-50"
                                >
                                    <Trash2 size={13} /> Hapus
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {categories.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-[#dcd7ce] bg-white p-12 text-center text-[#777]">
                        <Folder size={32} className="mx-auto mb-2 opacity-40" />
                        <p>Belum ada kategori yang dibuat.</p>
                    </div>
                )}
            </main>

            {/* MODAL 1: TAMBAH KATEGORI */}
            {isCreateOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4">
                        <div className="flex items-center justify-between border-b border-[#e9e6df] pb-3">
                            <h3 className="font-serif text-[16px] font-bold text-[#17251f]">
                                Tambah Kategori Baru
                            </h3>
                            <button
                                type="button"
                                onClick={() => setIsCreateOpen(false)}
                                className="text-[#777] hover:text-black"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleCreateSubmit} className="space-y-4">
                            <div>
                                <label className="block text-[12px] font-bold uppercase tracking-wider text-[#555] mb-1.5">
                                    Nama Kategori
                                </label>
                                <input
                                    type="text"
                                    value={createForm.data.name}
                                    onChange={(e) => createForm.setData("name", e.target.value)}
                                    placeholder="Contoh: Tafsir Al-Qur'an, Fikih Ibadah..."
                                    className="w-full rounded-xl border border-[#dcd7ce] px-4 py-2.5 text-[14px] focus:border-[#063f2f] focus:outline-none"
                                    autoFocus
                                    required
                                />
                                {createForm.errors.name && (
                                    <p className="mt-1 text-[11px] text-red-600">
                                        {createForm.errors.name}
                                    </p>
                                )}
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsCreateOpen(false)}
                                    className="rounded-xl border border-[#dcd7ce] px-4 py-2 text-[13px] font-bold text-[#555] hover:bg-[#faf8f5]"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={createForm.processing}
                                    className="flex items-center gap-1.5 rounded-xl bg-[#063f2f] px-5 py-2 text-[13px] font-bold text-white hover:bg-[#07513c] disabled:opacity-50"
                                >
                                    <Check size={15} /> Simpan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL 2: EDIT KATEGORI */}
            {editingCategory && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4">
                        <div className="flex items-center justify-between border-b border-[#e9e6df] pb-3">
                            <h3 className="font-serif text-[16px] font-bold text-[#17251f]">
                                Edit Kategori
                            </h3>
                            <button
                                type="button"
                                onClick={() => setEditingCategory(null)}
                                className="text-[#777] hover:text-black"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleEditSubmit} className="space-y-4">
                            <div>
                                <label className="block text-[12px] font-bold uppercase tracking-wider text-[#555] mb-1.5">
                                    Nama Kategori
                                </label>
                                <input
                                    type="text"
                                    value={editForm.data.name}
                                    onChange={(e) => editForm.setData("name", e.target.value)}
                                    className="w-full rounded-xl border border-[#dcd7ce] px-4 py-2.5 text-[14px] focus:border-[#063f2f] focus:outline-none"
                                    autoFocus
                                    required
                                />
                                {editForm.errors.name && (
                                    <p className="mt-1 text-[11px] text-red-600">
                                        {editForm.errors.name}
                                    </p>
                                )}
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setEditingCategory(null)}
                                    className="rounded-xl border border-[#dcd7ce] px-4 py-2 text-[13px] font-bold text-[#555] hover:bg-[#faf8f5]"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={editForm.processing}
                                    className="flex items-center gap-1.5 rounded-xl bg-[#063f2f] px-5 py-2 text-[13px] font-bold text-white hover:bg-[#07513c] disabled:opacity-50"
                                >
                                    <Check size={15} /> Simpan Perubahan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}