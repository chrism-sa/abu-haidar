import React, { useState } from "react";
import { useForm, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import {
    Users,
    Search,
    Trash2,
    Shield,
    User,
    Plus,
    X,
    Calendar,
    Check,
} from "lucide-react";
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
        <AdminLayout title="Kelola Pengguna">
            <Toaster position="top-center" />

            {/* HEADER SUB SECTION */}
            <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8CEBC] pb-5">
                <div className="flex items-center gap-3.5">
                    <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-2xl bg-[#FAF3EB] border border-[#E8CEBC] text-[#1D4533] shadow-2xs">
                        <Users size={22} />
                    </div>
                    <div>
                        <h1 className="font-brand text-[20px] sm:text-[24px] font-bold text-[#1D4533] leading-tight">
                            Kelola Pengguna
                        </h1>
                        <p className="mt-0.5 text-[11px] sm:text-[12px] uppercase tracking-wider text-[#8C5E43] font-bold">
                            Total: {users.length} Akun Hak Akses Administrator
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={openModal}
                    className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#1D4533] px-5 py-2.5 text-[12.5px] sm:text-[13px] font-bold text-[#F7EAE0] shadow-2xs transition hover:bg-[#143325] cursor-pointer w-fit"
                >
                    <Plus size={16} />
                    <span>Tambah User</span>
                </button>
            </div>

            {/* KONTEN UTAMA */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="rounded-2xl border border-[#E8CEBC] bg-[#FDF9F5] p-4 sm:p-6 shadow-xs"
            >
                {/* SEARCH & INFO BAR */}
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="font-brand text-[16px] font-bold text-[#1D4533]">
                            Daftar Akun Terdaftar
                        </h2>
                        <p className="text-[13px] text-[#5E3122]/70 mt-0.5">
                            Total {users.length} pengguna memiliki hak akses.
                        </p>
                    </div>
                    <div className="relative w-full sm:w-72">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-[#8C5E43]/60">
                            <Search size={15} />
                        </div>
                        <input
                            type="text"
                            placeholder="Cari nama atau email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full rounded-xl border border-[#E8CEBC] bg-[#FAF3EB] py-2 pl-10 pr-4 text-[13px] text-[#5E3122] outline-none transition focus:border-[#1D4533] focus:bg-[#FDF9F5]"
                        />
                    </div>
                </div>

                {/* DESKTOP TABLE */}
                <div className="hidden md:block overflow-x-auto rounded-xl border border-[#E8CEBC]">
                    <table className="w-full whitespace-nowrap text-left text-[13px]">
                        <thead className="bg-[#FAF3EB] text-[#1D4533] border-b border-[#E8CEBC]">
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
                        <tbody className="divide-y divide-[#E8CEBC]/60">
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => {
                                    const isAdmin =
                                        user.email ===
                                        "admin@abuhaidararema.com";
                                    return (
                                        <tr
                                            key={user.id}
                                            className="transition-colors hover:bg-[#FAF3EB]/60"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className={`flex h-9 w-9 items-center justify-center rounded-full text-[#F7EAE0] font-bold font-brand ${
                                                            isAdmin
                                                                ? "bg-[#1D4533]"
                                                                : "bg-[#8C5E43]"
                                                        }`}
                                                    >
                                                        {user.name
                                                            .charAt(0)
                                                            .toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-[#1D4533] flex items-center gap-1.5 font-brand">
                                                            {user.name}
                                                            {isAdmin && (
                                                                <Shield
                                                                    size={14}
                                                                    className="text-amber-600"
                                                                    title="Administrator"
                                                                />
                                                            )}
                                                        </div>
                                                        {isAdmin && (
                                                            <span className="text-[10px] uppercase tracking-wider text-[#1D4533] font-bold">
                                                                Admin Utama
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-[#5E3122]/80">
                                                {user.email}
                                            </td>
                                            <td className="px-6 py-4 text-[#5E3122]/70">
                                                {formatDate(user.created_at)}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {isAdmin ? (
                                                    <span className="inline-flex rounded-md bg-[#FAF3EB] border border-[#E8CEBC] px-3 py-1 text-[11px] font-bold text-[#8C5E43] cursor-not-allowed">
                                                        Paten (Protected)
                                                    </span>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleDelete(
                                                                user.id,
                                                                user.name,
                                                            )
                                                        }
                                                        className="inline-flex items-center gap-1.5 rounded-lg bg-red-100/70 border border-red-200 px-3 py-1.5 text-[12px] font-bold text-red-600 transition hover:bg-red-200 cursor-pointer"
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
                                        className="px-6 py-12 text-center text-[#5E3122]/50"
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

                {/* MOBILE VIEW (CARD LIST) */}
                <div className="md:hidden space-y-3">
                    {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => {
                            const isAdmin =
                                user.email === "admin@abuhaidararema.com";
                            return (
                                <div
                                    key={user.id}
                                    className="rounded-xl border border-[#E8CEBC] bg-[#FAF3EB]/80 p-4 flex flex-col gap-3"
                                >
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div
                                                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#F7EAE0] font-bold font-brand ${
                                                    isAdmin
                                                        ? "bg-[#1D4533]"
                                                        : "bg-[#8C5E43]"
                                                }`}
                                            >
                                                {user.name
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="font-brand text-[14px] font-bold text-[#1D4533] truncate flex items-center gap-1.5">
                                                    {user.name}
                                                    {isAdmin && (
                                                        <Shield
                                                            size={13}
                                                            className="text-amber-600 shrink-0"
                                                        />
                                                    )}
                                                </h3>
                                                <p className="text-[12px] text-[#5E3122]/70 truncate">
                                                    {user.email}
                                                </p>
                                            </div>
                                        </div>

                                        {isAdmin ? (
                                            <span className="shrink-0 rounded-md bg-[#FAF3EB] text-[#1D4533] border border-[#E8CEBC] px-2 py-0.5 text-[10px] font-bold">
                                                Admin
                                            </span>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleDelete(
                                                        user.id,
                                                        user.name,
                                                    )
                                                }
                                                className="shrink-0 flex h-8 w-8 items-center justify-center rounded-lg bg-red-100/70 text-red-600 transition hover:bg-red-200"
                                                title="Hapus Pengguna"
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        )}
                                    </div>

                                    <div className="border-t border-[#E8CEBC]/70 pt-2 flex items-center justify-between text-[11px] text-[#8C5E43]">
                                        <span className="flex items-center gap-1">
                                            <Calendar size={12} />
                                            {formatDate(user.created_at)}
                                        </span>
                                        {isAdmin && (
                                            <span className="font-bold text-amber-700">
                                                Protected
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="rounded-xl border border-dashed border-[#E8CEBC] p-8 text-center text-[#5E3122]/50">
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

            {/* ================= MODAL TAMBAH USER ================= */}
            <AnimatePresence>
                {isModalOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeModal}
                            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 15 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 15 }}
                            className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 max-h-[90vh] overflow-y-auto"
                        >
                            <div className="overflow-hidden rounded-2xl bg-[#FDF9F5] shadow-2xl border border-[#E8CEBC]">
                                <div className="flex items-center justify-between border-b border-[#E8CEBC] bg-[#FAF3EB] px-5 py-4">
                                    <h3 className="font-brand text-[16px] sm:text-[18px] font-bold text-[#1D4533]">
                                        Tambah Pengguna Baru
                                    </h3>
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="rounded-lg p-1.5 text-[#5E3122]/70 transition hover:bg-[#F2E2D5] hover:text-[#1D4533]"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>

                                <form
                                    onSubmit={handleSubmit}
                                    className="p-5 sm:p-6 space-y-4"
                                >
                                    <div>
                                        <label className="mb-1.5 block text-[12px] font-bold font-brand uppercase tracking-wider text-[#5E3122]">
                                            Nama Lengkap
                                        </label>
                                        <input
                                            type="text"
                                            value={data.name}
                                            onChange={(e) =>
                                                setData("name", e.target.value)
                                            }
                                            className={`w-full rounded-xl border bg-[#FAF3EB] px-3.5 py-2 text-[13px] sm:text-[14px] outline-none transition focus:bg-[#FDF9F5] ${
                                                errors.name
                                                    ? "border-red-400"
                                                    : "border-[#E8CEBC] focus:border-[#1D4533]"
                                            }`}
                                            placeholder="Contoh: Fulan bin Fulan"
                                            required
                                        />
                                        {errors.name && (
                                            <p className="mt-1 text-[11px] text-red-500 font-bold">
                                                {errors.name}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="mb-1.5 block text-[12px] font-bold font-brand uppercase tracking-wider text-[#5E3122]">
                                            Alamat Email
                                        </label>
                                        <input
                                            type="email"
                                            value={data.email}
                                            onChange={(e) =>
                                                setData("email", e.target.value)
                                            }
                                            className={`w-full rounded-xl border bg-[#FAF3EB] px-3.5 py-2 text-[13px] sm:text-[14px] outline-none transition focus:bg-[#FDF9F5] ${
                                                errors.email
                                                    ? "border-red-400"
                                                    : "border-[#E8CEBC] focus:border-[#1D4533]"
                                            }`}
                                            placeholder="contoh@email.com"
                                            required
                                        />
                                        {errors.email && (
                                            <p className="mt-1 text-[11px] text-red-500 font-bold">
                                                {errors.email}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="mb-1.5 block text-[12px] font-bold font-brand uppercase tracking-wider text-[#5E3122]">
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
                                            className={`w-full rounded-xl border bg-[#FAF3EB] px-3.5 py-2 text-[13px] sm:text-[14px] outline-none transition focus:bg-[#FDF9F5] ${
                                                errors.password
                                                    ? "border-red-400"
                                                    : "border-[#E8CEBC] focus:border-[#1D4533]"
                                            }`}
                                            placeholder="Minimal 8 karakter"
                                            required
                                        />
                                        {errors.password && (
                                            <p className="mt-1 text-[11px] text-red-500 font-bold">
                                                {errors.password}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="mb-1.5 block text-[12px] font-bold font-brand uppercase tracking-wider text-[#5E3122]">
                                            Ulangi Kata Sandi
                                        </label>
                                        <input
                                            type="password"
                                            value={data.password_confirmation}
                                            onChange={(e) =>
                                                setData(
                                                    "password_confirmation",
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full rounded-xl border border-[#E8CEBC] bg-[#FAF3EB] px-3.5 py-2 text-[13px] sm:text-[14px] outline-none transition focus:border-[#1D4533] focus:bg-[#FDF9F5]"
                                            placeholder="Ketik ulang kata sandi"
                                            required
                                        />
                                    </div>

                                    <div className="mt-6 flex items-center justify-end gap-2.5 pt-2">
                                        <button
                                            type="button"
                                            onClick={closeModal}
                                            className="rounded-xl px-4 py-2 text-[12px] sm:text-[13px] font-bold text-[#5E3122] transition hover:bg-[#FAF3EB]"
                                        >
                                            Batal
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="flex items-center gap-1.5 rounded-xl bg-[#1D4533] px-5 py-2 text-[12px] sm:text-[13px] font-bold text-[#F7EAE0] transition hover:bg-[#143325] disabled:opacity-70 shadow-xs cursor-pointer"
                                        >
                                            <Check size={15} />
                                            <span>
                                                {processing
                                                    ? "Menyimpan..."
                                                    : "Simpan Pengguna"}
                                            </span>
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
