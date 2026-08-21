import { Head, Link, useForm, router } from "@inertiajs/react";
import { 
    Users, 
    Search, 
    Trash2, 
    ArrowLeft, 
    Shield, 
    User,
    Plus,
    X // Ikon silang untuk tutup modal
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

interface UserModel {
    id: number;
    name: string;
    email: string;
    created_at: string;
}

interface UserIndexProps {
    users: UserModel[];
}

export default function UserIndex({ users }: UserIndexProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Inertia useForm untuk handle data Tambah User
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const filteredUsers = users.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatDate = (dateString: string) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('id-ID', { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
        }).format(date);
    };

    // Fungsi buka tutup modal
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
        reset(); // Kosongkan form
        clearErrors(); // Bersihkan error
    };

    // Fungsi submit user baru
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        post('/admin/users', {
            onSuccess: () => {
                closeModal();
                toast.success("Alhamdulillah, Pengguna baru berhasil ditambahkan!");
            },
            onError: () => {
                toast.error("Gagal menyimpan data. Silakan periksa kolom yang merah.");
            }
        });
    };

    const handleDelete = (id: number, name: string) => {
        if (confirm(`Apakah Anda yakin ingin menghapus akses untuk "${name}"?`)) {
            router.delete(`/admin/users/${id}`, {
                onSuccess: () => toast.success("Pengguna berhasil dihapus!")
            });
        }
    };

    return (
        <div className="min-h-screen bg-[#eaf6efc0] text-[#17251f] selection:bg-[#063f2f] selection:text-white pb-20">
            <Head title="Kelola Pengguna - Abu Haidar" />
            <Toaster position="top-center" />

            {/* HEADER */}
            <header className="sticky top-0 z-30 border-b border-[#e9e6df] bg-white/80 backdrop-blur-md">
                <div className="mx-auto flex max-w-[1140px] items-center justify-between px-5 py-4 lg:px-0">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/admin/dashboard"
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#e9e6df] bg-white text-[#555] transition hover:bg-[#f4f4f0] hover:text-[#111]"
                        >
                            <ArrowLeft size={18} />
                        </Link>
                        <div>
                            <h1 className="font-serif text-[18px] font-bold text-[#111] flex items-center gap-2">
                                <Users size={20} className="text-[#063f2f]" /> Kelola Pengguna
                            </h1>
                        </div>
                    </div>

                    <button 
                        onClick={openModal}
                        className="flex items-center gap-1.5 rounded-lg bg-[#063f2f] px-4 py-2 text-[13px] font-bold text-white transition hover:bg-[#0a5c45] shadow-sm"
                    >
                        <Plus size={16} /> Tambah User
                    </button>
                </div>
            </header>

            <main className="mx-auto max-w-[1140px] px-5 pt-8 lg:px-0">
                <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="rounded-2xl border border-[#e9e6df] bg-white p-6 shadow-sm"
                >
                    {/* SEARCH BAR */}
                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-[16px] font-bold">Daftar Akun Terdaftar</h2>
                            <p className="text-[13px] text-[#666] mt-0.5">
                                Total {users.length} pengguna memiliki akses ke sistem.
                            </p>
                        </div>
                        <div className="relative w-full sm:w-72">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-[#999]">
                                <Search size={16} />
                            </div>
                            <input
                                type="text"
                                placeholder="Cari nama atau email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full rounded-xl border border-[#e9e6df] bg-[#fafaf8] py-2.5 pl-10 pr-4 text-[13px] outline-none transition focus:border-[#063f2f] focus:bg-white focus:ring-1 focus:ring-[#063f2f]"
                            />
                        </div>
                    </div>

                    {/* TABEL PENGGUNA */}
                    <div className="overflow-x-auto rounded-xl border border-[#e9e6df]">
                        <table className="w-full whitespace-nowrap text-left text-[13px]">
                            <thead className="bg-[#f4f8f6] text-[#063f2f] border-b border-[#e9e6df]">
                                <tr>
                                    <th className="px-6 py-4 font-bold">Nama Pengguna</th>
                                    <th className="px-6 py-4 font-bold">Email</th>
                                    <th className="px-6 py-4 font-bold">Tanggal Bergabung</th>
                                    <th className="px-6 py-4 font-bold text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#e9e6df]">
                                {filteredUsers.length > 0 ? (
                                    filteredUsers.map((user) => {
                                        const isAdmin = user.email === 'admin@abuhaidararema.com';
                                        return (
                                            <tr key={user.id} className="transition-colors hover:bg-[#fafaf8]">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`flex h-9 w-9 items-center justify-center rounded-full text-white font-bold ${isAdmin ? 'bg-[#063f2f]' : 'bg-[#a3a099]'}`}>
                                                            {user.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-[#111] flex items-center gap-1.5">
                                                                {user.name} 
                                                                {isAdmin && <Shield size={14} className="text-amber-500" title="Administrator" />}
                                                            </div>
                                                            {isAdmin && <span className="text-[10px] uppercase tracking-wider text-[#063f2f] font-bold">Admin Utama</span>}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-[#555]">{user.email}</td>
                                                <td className="px-6 py-4 text-[#555]">{formatDate(user.created_at)}</td>
                                                <td className="px-6 py-4 text-center">
                                                    {isAdmin ? (
                                                        <span className="inline-flex rounded-md bg-gray-100 px-3 py-1.5 text-[11px] font-bold text-gray-400 cursor-not-allowed">
                                                            Paten (Protected)
                                                        </span>
                                                    ) : (
                                                        <button 
                                                            onClick={() => handleDelete(user.id, user.name)}
                                                            className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-1.5 text-[12px] font-bold text-red-600 transition hover:bg-red-100"
                                                        >
                                                            <Trash2 size={14} /> Hapus
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        )
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-[#777]">
                                            <User size={32} className="mx-auto mb-3 opacity-20" />
                                            <p>Tidak ada data pengguna yang ditemukan.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </main>

            {/* MODAL TAMBAH USER (AnimatePresence untuk animasi masuk/keluar) */}
            <AnimatePresence>
                {isModalOpen && (
                    <>
                        {/* Overlay Background */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeModal}
                            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
                        />
                        
                        {/* Kotak Modal */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 p-5"
                        >
                            <div className="overflow-hidden rounded-2xl bg-white shadow-xl">
                                <div className="flex items-center justify-between border-b border-[#e9e6df] bg-[#fafaf8] px-6 py-4">
                                    <h3 className="font-serif text-[18px] font-bold text-[#111]">Tambah Pengguna Baru</h3>
                                    <button 
                                        onClick={closeModal}
                                        className="rounded-lg p-2 text-[#777] transition hover:bg-[#e9e6df] hover:text-[#111]"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="p-6">
                                    <div className="space-y-4">
                                        {/* Input Nama */}
                                        <div>
                                            <label className="mb-1.5 block text-[13px] font-bold text-[#555]">Nama Lengkap</label>
                                            <input
                                                type="text"
                                                value={data.name}
                                                onChange={e => setData('name', e.target.value)}
                                                className={`w-full rounded-xl border bg-[#fafaf8] px-4 py-2.5 text-[14px] outline-none transition focus:bg-white ${errors.name ? 'border-red-400 focus:border-red-500' : 'border-[#e9e6df] focus:border-[#063f2f]'}`}
                                                placeholder="Contoh: Fulan bin Fulan"
                                            />
                                            {errors.name && <p className="mt-1 text-[11px] text-red-500">{errors.name}</p>}
                                        </div>

                                        {/* Input Email */}
                                        <div>
                                            <label className="mb-1.5 block text-[13px] font-bold text-[#555]">Alamat Email</label>
                                            <input
                                                type="email"
                                                value={data.email}
                                                onChange={e => setData('email', e.target.value)}
                                                className={`w-full rounded-xl border bg-[#fafaf8] px-4 py-2.5 text-[14px] outline-none transition focus:bg-white ${errors.email ? 'border-red-400 focus:border-red-500' : 'border-[#e9e6df] focus:border-[#063f2f]'}`}
                                                placeholder="contoh@email.com"
                                            />
                                            {errors.email && <p className="mt-1 text-[11px] text-red-500">{errors.email}</p>}
                                        </div>

                                        {/* Input Password */}
                                        <div>
                                            <label className="mb-1.5 block text-[13px] font-bold text-[#555]">Kata Sandi</label>
                                            <input
                                                type="password"
                                                value={data.password}
                                                onChange={e => setData('password', e.target.value)}
                                                className={`w-full rounded-xl border bg-[#fafaf8] px-4 py-2.5 text-[14px] outline-none transition focus:bg-white ${errors.password ? 'border-red-400 focus:border-red-500' : 'border-[#e9e6df] focus:border-[#063f2f]'}`}
                                                placeholder="Minimal 8 karakter"
                                            />
                                            {errors.password && <p className="mt-1 text-[11px] text-red-500">{errors.password}</p>}
                                        </div>

                                        {/* Input Konfirmasi Password */}
                                        <div>
                                            <label className="mb-1.5 block text-[13px] font-bold text-[#555]">Ulangi Kata Sandi</label>
                                            <input
                                                type="password"
                                                value={data.password_confirmation}
                                                onChange={e => setData('password_confirmation', e.target.value)}
                                                className="w-full rounded-xl border border-[#e9e6df] bg-[#fafaf8] px-4 py-2.5 text-[14px] outline-none transition focus:border-[#063f2f] focus:bg-white"
                                                placeholder="Ketik ulang kata sandi"
                                            />
                                        </div>
                                    </div>

                                    {/* Tombol Action */}
                                    <div className="mt-8 flex items-center justify-end gap-3">
                                        <button
                                            type="button"
                                            onClick={closeModal}
                                            className="rounded-xl px-5 py-2.5 text-[13px] font-bold text-[#555] transition hover:bg-[#f4f4f0]"
                                        >
                                            Batal
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="rounded-xl bg-[#063f2f] px-5 py-2.5 text-[13px] font-bold text-white transition hover:bg-[#0a5c45] disabled:opacity-70 disabled:cursor-wait shadow-sm"
                                        >
                                            {processing ? 'Menyimpan...' : 'Simpan Pengguna'}
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