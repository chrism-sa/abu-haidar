import { Head, Link, useForm, router } from "@inertiajs/react";
import {
    Users,
    Search,
    Trash2,
    ArrowLeft,
    Shield,
    User,
    Plus,
    X,
    Calendar,
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

    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm({
            name: "",
            email: "",
            password: "",
            password_confirmation: "",
        });

    const filteredUsers = users.filter(
        (user) =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const formatDate = (dateString: string) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return new Intl.DateTimeFormat("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
        }).format(date);
    };

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
        reset();
        clearErrors();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post("/admin/users", {
            onSuccess: () => {
                closeModal();
                toast.success(
                    "Alhamdulillah, pengguna baru berhasil ditambahkan!",
                );
            },
            onError: () => {
                toast.error("Gagal menyimpan data. Periksa kolom formulir.");
            },
        });
    };

    const handleDelete = (id: number, name: string) => {
        if (
            confirm(`Apakah Anda yakin ingin menghapus akses untuk "${name}"?`)
        ) {
            router.delete(`/admin/users/${id}`, {
                onSuccess: () => toast.success("Pengguna berhasil dihapus!"),
            });
        }
    };

    return (
        <div className="min-h-screen bg-[#F7EAE0] text-[#162B22] selection:bg-[#0F4C3A] selection:text-white pb-16">
            <Head title="Kelola Artikel - Dashboard Admin" />
            <Toaster position="top-center" />
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
                            <h1 className="font-brand text-[16px] sm:text-[18px] font-bold text-[#111] flex items-center gap-2">
                                <Users size={20} className="text-[#0F4C3A]" />{" "}
                                Kelola Pengguna
                            </h1>
                            <p className="text-[10px] uppercase tracking-wider text-[#6C857A] font-semibold hidden sm:block">
                                Akses & Penulis Portal
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={openModal}
                        className="flex items-center gap-1.5 rounded-full bg-[#0F4C3A] px-3.5 sm:px-4 py-2 text-[12px] sm:text-[13px] font-bold text-white transition hover:bg-[#0A382A] shadow-xs cursor-pointer"
                    >
                        <Plus size={16} />
                        <span>Tambah User</span>
                    </button>
                </div>
            </header>

            {/* ================= MAIN CONTENT ================= */}
            <main className="mx-auto max-w-[1140px] px-4 sm:px-6 pt-6 sm:pt-8 lg:px-0">
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="rounded-2xl border border-[#E8E6E1] bg-white p-4 sm:p-6 shadow-xs"
                >
                    {/* SEARCH & INFO BAR */}
                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="font-brand text-[16px] font-bold text-[#162B22]">
                                Daftar Akun Terdaftar
                            </h2>
                            <p className="text-[13px] text-[#6C857A] mt-0.5">
                                Total {users.length} pengguna memiliki akses ke
                                sistem.
                            </p>
                        </div>
                        <div className="relative w-full sm:w-72">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-[#A5B9AD]">
                                <Search size={16} />
                            </div>
                            <input
                                type="text"
                                placeholder="Cari nama atau email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full rounded-xl border border-[#E8E6E1] bg-[#F4F4F0] py-2 pl-10 pr-4 text-[13px] outline-none transition focus:border-[#0F4C3A] focus:bg-white focus:shadow-xs"
                            />
                        </div>
                    </div>

                    {/* ================= VIEW 1: DESKTOP TABLE (md ke atas) ================= */}
                    <div className="hidden md:block overflow-x-auto rounded-xl border border-[#E8E6E1]">
                        <table className="w-full whitespace-nowrap text-left text-[13px]">
                            <thead className="bg-[#F4F8F6] text-[#0F4C3A] border-b border-[#E8E6E1]">
                                <tr>
                                    <th className="px-6 py-4 font-bold font-brand">
                                        Nama Pengguna
                                    </th>
                                    <th className="px-6 py-4 font-bold font-brand">
                                        Email
                                    </th>
                                    <th className="px-6 py-4 font-bold font-brand">
                                        Tanggal Bergabung
                                    </th>
                                    <th className="px-6 py-4 font-bold font-brand text-center">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E8E6E1]">
                                {filteredUsers.length > 0 ? (
                                    filteredUsers.map((user) => {
                                        const isAdmin =
                                            user.email ===
                                            "admin@abuhaidararema.com";
                                        return (
                                            <tr
                                                key={user.id}
                                                className="transition-colors hover:bg-[#FAFAF8]"
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div
                                                            className={`flex h-9 w-9 items-center justify-center rounded-full text-white font-bold font-brand ${isAdmin ? "bg-[#0F4C3A]" : "bg-[#6C857A]"}`}
                                                        >
                                                            {user.name
                                                                .charAt(0)
                                                                .toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-[#162B22] flex items-center gap-1.5 font-brand">
                                                                {user.name}
                                                                {isAdmin && (
                                                                    <Shield
                                                                        size={
                                                                            14
                                                                        }
                                                                        className="text-[#C5A059]"
                                                                        title="Administrator"
                                                                    />
                                                                )}
                                                            </div>
                                                            {isAdmin && (
                                                                <span className="text-[10px] uppercase tracking-wider text-[#0F4C3A] font-bold">
                                                                    Admin Utama
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-[#6C857A]">
                                                    {user.email}
                                                </td>
                                                <td className="px-6 py-4 text-[#6C857A]">
                                                    {formatDate(
                                                        user.created_at,
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    {isAdmin ? (
                                                        <span className="inline-flex rounded-md bg-gray-100 px-3 py-1 text-[11px] font-bold text-gray-400 cursor-not-allowed">
                                                            Paten (Protected)
                                                        </span>
                                                    ) : (
                                                        <button
                                                            onClick={() =>
                                                                handleDelete(
                                                                    user.id,
                                                                    user.name,
                                                                )
                                                            }
                                                            className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-1.5 text-[12px] font-bold text-red-600 transition hover:bg-red-100 cursor-pointer"
                                                        >
                                                            <Trash2 size={14} />{" "}
                                                            Hapus
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="px-6 py-12 text-center text-[#8CA397]"
                                        >
                                            <User
                                                size={32}
                                                className="mx-auto mb-3 opacity-20"
                                            />
                                            <p>
                                                Tidak ada data pengguna yang
                                                ditemukan.
                                            </p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* ================= VIEW 2: MOBILE CARDS LIST (Layar HP) ================= */}
                    <div className="md:hidden space-y-3">
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map((user) => {
                                const isAdmin =
                                    user.email === "admin@abuhaidararema.com";
                                return (
                                    <div
                                        key={user.id}
                                        className="rounded-xl border border-[#E8E6E1] bg-[#FAFAF8] p-4 flex flex-col gap-3"
                                    >
                                        <div className="flex items-center justify-between gap-2">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div
                                                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white font-bold font-brand ${isAdmin ? "bg-[#0F4C3A]" : "bg-[#6C857A]"}`}
                                                >
                                                    {user.name
                                                        .charAt(0)
                                                        .toUpperCase()}
                                                </div>
                                                <div className="min-w-0">
                                                    <h3 className="font-brand text-[14px] font-bold text-[#162B22] truncate flex items-center gap-1.5">
                                                        {user.name}
                                                        {isAdmin && (
                                                            <Shield
                                                                size={13}
                                                                className="text-[#C5A059] shrink-0"
                                                            />
                                                        )}
                                                    </h3>
                                                    <p className="text-[12px] text-[#6C857A] truncate">
                                                        {user.email}
                                                    </p>
                                                </div>
                                            </div>

                                            {isAdmin ? (
                                                <span className="shrink-0 rounded-md bg-emerald-50 text-[#0F4C3A] border border-emerald-200 px-2 py-0.5 text-[10px] font-bold">
                                                    Admin
                                                </span>
                                            ) : (
                                                <button
                                                    onClick={() =>
                                                        handleDelete(
                                                            user.id,
                                                            user.name,
                                                        )
                                                    }
                                                    className="shrink-0 flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-600 transition hover:bg-red-100"
                                                    title="Hapus Pengguna"
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                            )}
                                        </div>

                                        <div className="border-t border-[#E8E6E1] pt-2 flex items-center justify-between text-[11px] text-[#8CA397]">
                                            <span className="flex items-center gap-1">
                                                <Calendar size={12} />{" "}
                                                {formatDate(user.created_at)}
                                            </span>
                                            {isAdmin && (
                                                <span className="font-bold text-[#C5A059]">
                                                    Protected
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="rounded-xl border border-dashed border-[#CCD8D2] p-8 text-center text-[#8CA397]">
                                <User
                                    size={28}
                                    className="mx-auto mb-2 opacity-30"
                                />
                                <p className="text-[13px]">
                                    Tidak ada pengguna ditemukan.
                                </p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </main>

            {/* ================= MODAL TAMBAH USER ================= */}
            <AnimatePresence>
                {isModalOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeModal}
                            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 15 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 15 }}
                            className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 max-h-[90vh] overflow-y-auto"
                        >
                            <div className="overflow-hidden rounded-2xl bg-white shadow-2xl border border-[#E8E6E1]">
                                <div className="flex items-center justify-between border-b border-[#E8E6E1] bg-[#FAFAF8] px-5 py-4">
                                    <h3 className="font-brand text-[16px] sm:text-[18px] font-bold text-[#162B22]">
                                        Tambah Pengguna Baru
                                    </h3>
                                    <button
                                        onClick={closeModal}
                                        className="rounded-lg p-1.5 text-[#777] transition hover:bg-[#E8E6E1] hover:text-[#111]"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>

                                <form
                                    onSubmit={handleSubmit}
                                    className="p-5 sm:p-6"
                                >
                                    <div className="space-y-4">
                                        <div>
                                            <label className="mb-1.5 block text-[12px] font-bold font-brand uppercase tracking-wider text-[#555]">
                                                Nama Lengkap
                                            </label>
                                            <input
                                                type="text"
                                                value={data.name}
                                                onChange={(e) =>
                                                    setData(
                                                        "name",
                                                        e.target.value,
                                                    )
                                                }
                                                className={`w-full rounded-xl border bg-[#FAFAF8] px-3.5 py-2 text-[13px] sm:text-[14px] outline-none transition focus:bg-white ${errors.name ? "border-red-400 focus:border-red-500" : "border-[#E8E6E1] focus:border-[#0F4C3A]"}`}
                                                placeholder="Contoh: Fulan bin Fulan"
                                            />
                                            {errors.name && (
                                                <p className="mt-1 text-[11px] text-red-500">
                                                    {errors.name}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="mb-1.5 block text-[12px] font-bold font-brand uppercase tracking-wider text-[#555]">
                                                Alamat Email
                                            </label>
                                            <input
                                                type="email"
                                                value={data.email}
                                                onChange={(e) =>
                                                    setData(
                                                        "email",
                                                        e.target.value,
                                                    )
                                                }
                                                className={`w-full rounded-xl border bg-[#FAFAF8] px-3.5 py-2 text-[13px] sm:text-[14px] outline-none transition focus:bg-white ${errors.email ? "border-red-400 focus:border-red-500" : "border-[#E8E6E1] focus:border-[#0F4C3A]"}`}
                                                placeholder="contoh@email.com"
                                            />
                                            {errors.email && (
                                                <p className="mt-1 text-[11px] text-red-500">
                                                    {errors.email}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="mb-1.5 block text-[12px] font-bold font-brand uppercase tracking-wider text-[#555]">
                                                Kata Sandi
                                            </label>
                                            <input
                                                type="password"
                                                value={data.password}
                                                onChange={(e) =>
                                                    setData(
                                                        "password",
                                                        e.target.value,
                                                    )
                                                }
                                                className={`w-full rounded-xl border bg-[#FAFAF8] px-3.5 py-2 text-[13px] sm:text-[14px] outline-none transition focus:bg-white ${errors.password ? "border-red-400 focus:border-red-500" : "border-[#E8E6E1] focus:border-[#0F4C3A]"}`}
                                                placeholder="Minimal 8 karakter"
                                            />
                                            {errors.password && (
                                                <p className="mt-1 text-[11px] text-red-500">
                                                    {errors.password}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="mb-1.5 block text-[12px] font-bold font-brand uppercase tracking-wider text-[#555]">
                                                Ulangi Kata Sandi
                                            </label>
                                            <input
                                                type="password"
                                                value={
                                                    data.password_confirmation
                                                }
                                                onChange={(e) =>
                                                    setData(
                                                        "password_confirmation",
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full rounded-xl border border-[#E8E6E1] bg-[#FAFAF8] px-3.5 py-2 text-[13px] sm:text-[14px] outline-none transition focus:border-[#0F4C3A] focus:bg-white"
                                                placeholder="Ketik ulang kata sandi"
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-6 sm:mt-8 flex items-center justify-end gap-2.5">
                                        <button
                                            type="button"
                                            onClick={closeModal}
                                            className="rounded-xl px-4 py-2 text-[12px] sm:text-[13px] font-bold text-[#555] transition hover:bg-[#F4F4F0]"
                                        >
                                            Batal
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="rounded-xl bg-[#0F4C3A] px-5 py-2 text-[12px] sm:text-[13px] font-bold text-white transition hover:bg-[#0A382A] disabled:opacity-70 disabled:cursor-wait shadow-xs cursor-pointer"
                                        >
                                            {processing
                                                ? "Menyimpan..."
                                                : "Simpan Pengguna"}
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
