import React, { useState } from "react";
import { useForm, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import {
    Users,
    Search,
    Trash2,
    Shield,
    User as UserIcon,
    Plus,
    X,
    Calendar,
    Check,
    ShieldCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

interface UserModel {
    id: number;
    name: string;
    email: string;
    role: "admin" | "user";
    created_at: string;
}

interface UserIndexProps {
    users: UserModel[];
}

export default function UserIndex({ users = [] }: UserIndexProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm({
            name: "",
            email: "",
            password: "",
            password_confirmation: "",
            role: "user" as "admin" | "user",
        });

    const filteredUsers = users.filter(
        (user) =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.role?.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const formatDate = (dateString: string) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return new Intl.DateTimeFormat("id-ID", {
            day: "numeric",
            month: "short",
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
                onError: () => toast.error("Gagal menghapus pengguna."),
            });
        }
    };

    return (
        <AdminLayout title="Kelola Pengguna">
            <Toaster position="top-center" />

            {/* HEADER SUB SECTION */}
            <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8CEBC] pb-5">
                <div className="flex items-center gap-3.5 min-w-0">
                    <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-2xl bg-[#FAF3EB] border border-[#E8CEBC] text-[#1D4533] shadow-2xs">
                        <Users size={22} />
                    </div>
                    <div className="min-w-0">
                        <h1 className="font-brand text-[20px] sm:text-[24px] font-bold text-[#1D4533] leading-tight truncate">
                            Kelola Pengguna
                        </h1>
                        <p className="mt-0.5 text-[11px] sm:text-[12px] uppercase tracking-wider text-[#8C5E43] font-bold truncate">
                            Total: {users.length} Akun Terdaftar
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={openModal}
                    className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#1D4533] px-5 py-2.5 text-[12.5px] sm:text-[13px] font-bold text-[#F7EAE0] shadow-2xs transition hover:bg-[#143325] cursor-pointer w-full sm:w-fit shrink-0"
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
                className="rounded-3xl border border-[#E8CEBC] bg-[#FDF9F5] p-4 sm:p-6 shadow-xs"
            >
                {/* SEARCH & INFO BAR */}
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="font-brand text-[16px] font-bold text-[#1D4533]">
                            Daftar Akun Pengguna
                        </h2>
                        <p className="text-[12px] sm:text-[13px] text-[#5E3122]/70 mt-0.5">
                            Total {users.length} pengguna terdaftar di sistem.
                        </p>
                    </div>
                    <div className="relative w-full sm:w-72">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-[#8C5E43]/60">
                            <Search size={15} />
                        </div>
                        <input
                            type="text"
                            placeholder="Cari nama, email, role..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full rounded-xl border border-[#E8CEBC] bg-[#FAF3EB] py-2 pl-10 pr-4 text-[12.5px] text-[#5E3122] outline-none transition focus:border-[#1D4533] focus:bg-[#FDF9F5]"
                        />
                    </div>
                </div>

                {/* DESKTOP TABLE */}
                <div className="hidden md:block overflow-x-auto rounded-2xl border border-[#E8CEBC]">
                    <table className="w-full whitespace-nowrap text-left text-[13px]">
                        <thead className="bg-[#FAF3EB] text-[#1D4533] border-b border-[#E8CEBC]">
                            <tr>
                                <th className="px-6 py-4 font-bold font-brand">
                                    Nama Pengguna
                                </th>
                                <th className="px-6 py-4 font-bold font-brand">
                                    Alamat Email
                                </th>
                                <th className="px-6 py-4 font-bold font-brand">
                                    Hak Akses (Role)
                                </th>
                                <th className="px-6 py-4 font-bold font-brand">
                                    Tanggal Terdaftar
                                </th>
                                <th className="px-6 py-4 font-bold font-brand text-center">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E8CEBC]/60">
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => {
                                    const isAdmin = user.role === "admin";
                                    return (
                                        <tr
                                            key={user.id}
                                            className="transition-colors hover:bg-[#FAF3EB]/60"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#F7EAE0] font-bold font-brand text-[13px] ${
                                                            isAdmin
                                                                ? "bg-[#1D4533]"
                                                                : "bg-[#8C5E43]"
                                                        }`}
                                                    >
                                                        {user.name
                                                            .charAt(0)
                                                            .toUpperCase()}
                                                    </div>
                                                    <div className="font-bold text-[#1D4533] font-brand">
                                                        {user.name}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-[#5E3122]/80">
                                                {user.email}
                                            </td>
                                            <td className="px-6 py-4">
                                                {isAdmin ? (
                                                    <span className="inline-flex items-center gap-1 rounded-md bg-[#1D4533] px-2.5 py-1 text-[10.5px] font-bold uppercase text-[#F7EAE0]">
                                                        <ShieldCheck
                                                            size={12}
                                                        />
                                                        <span>Admin</span>
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 rounded-md bg-[#FAF3EB] border border-[#E8CEBC] px-2.5 py-1 text-[10.5px] font-bold uppercase text-[#8C5E43]">
                                                        <UserIcon size={12} />
                                                        <span>Jamaah</span>
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-[#5E3122]/70">
                                                {formatDate(user.created_at)}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleDelete(
                                                            user.id,
                                                            user.name,
                                                        )
                                                    }
                                                    className="inline-flex items-center gap-1.5 rounded-xl bg-red-100/70 border border-red-200 px-3 py-1.5 text-[11.5px] font-bold text-red-600 transition hover:bg-red-200 cursor-pointer"
                                                >
                                                    <Trash2 size={13} />
                                                    <span>Hapus</span>
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-6 py-12 text-center text-[#5E3122]/50"
                                    >
                                        <UserIcon
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
                            const isAdmin = user.role === "admin";
                            return (
                                <div
                                    key={user.id}
                                    className="rounded-2xl border border-[#E8CEBC] bg-[#FAF3EB]/70 p-4 flex flex-col gap-3"
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
                                                <h3 className="font-brand text-[14px] font-bold text-[#1D4533] truncate">
                                                    {user.name}
                                                </h3>
                                                <p className="text-[12px] text-[#5E3122]/70 truncate">
                                                    {user.email}
                                                </p>
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleDelete(user.id, user.name)
                                            }
                                            className="shrink-0 flex h-8 w-8 items-center justify-center rounded-xl bg-red-100/70 text-red-600 border border-red-200 transition hover:bg-red-200"
                                            title="Hapus Pengguna"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>

                                    <div className="border-t border-[#E8CEBC]/70 pt-2 flex items-center justify-between text-[11px] text-[#8C5E43]">
                                        <span className="flex items-center gap-1 font-medium">
                                            <Calendar size={12} />
                                            {formatDate(user.created_at)}
                                        </span>
                                        {isAdmin ? (
                                            <span className="inline-flex items-center gap-1 rounded-md bg-[#1D4533] px-2 py-0.5 text-[9.5px] font-bold uppercase text-[#F7EAE0]">
                                                <ShieldCheck size={11} /> Admin
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 rounded-md bg-[#FAF3EB] border border-[#E8CEBC] px-2 py-0.5 text-[9.5px] font-bold uppercase text-[#8C5E43]">
                                                <UserIcon size={11} /> Jamaah
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="rounded-2xl border border-dashed border-[#E8CEBC] p-8 text-center text-[#5E3122]/50">
                            <UserIcon
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

            {/* ================= MODAL TAMBAH USER (RESPONSIF MOBILE) ================= */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeModal}
                            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 15 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 15 }}
                            className="relative w-full max-w-md rounded-3xl bg-[#FDF9F5] shadow-2xl border border-[#E8CEBC] z-10 my-auto flex flex-col max-h-[92vh] overflow-hidden"
                        >
                            {/* Modal Header */}
                            <div className="flex items-center justify-between border-b border-[#E8CEBC] bg-[#FAF3EB] px-5 py-4 shrink-0">
                                <h3 className="font-brand text-[16px] sm:text-[17px] font-bold text-[#1D4533] flex items-center gap-2">
                                    <Plus size={18} /> Tambah Pengguna Baru
                                </h3>
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="rounded-xl p-1 text-[#5E3122]/70 transition hover:bg-[#F2E2D5] hover:text-[#1D4533] cursor-pointer"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <form
                                onSubmit={handleSubmit}
                                className="flex flex-col flex-1 overflow-hidden"
                            >
                                <div className="p-5 sm:p-6 space-y-4 overflow-y-auto overscroll-contain">
                                    {/* Nama Lengkap */}
                                    <div>
                                        <label className="mb-1 block text-[11.5px] font-bold uppercase tracking-wider text-[#5E3122]">
                                            Nama Lengkap *
                                        </label>
                                        <input
                                            type="text"
                                            value={data.name}
                                            onChange={(e) =>
                                                setData("name", e.target.value)
                                            }
                                            className={`w-full rounded-xl border bg-[#FAF3EB] px-3.5 py-2 text-[13px] outline-none transition focus:bg-[#FDF9F5] ${
                                                errors.name
                                                    ? "border-red-400"
                                                    : "border-[#E8CEBC] focus:border-[#1D4533]"
                                            }`}
                                            placeholder="Contoh: Fulan bin Fulan"
                                            required
                                        />
                                        {errors.name && (
                                            <p className="mt-1 text-[10.5px] text-red-500 font-bold">
                                                {errors.name}
                                            </p>
                                        )}
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="mb-1 block text-[11.5px] font-bold uppercase tracking-wider text-[#5E3122]">
                                            Alamat Email *
                                        </label>
                                        <input
                                            type="email"
                                            value={data.email}
                                            onChange={(e) =>
                                                setData("email", e.target.value)
                                            }
                                            className={`w-full rounded-xl border bg-[#FAF3EB] px-3.5 py-2 text-[13px] outline-none transition focus:bg-[#FDF9F5] ${
                                                errors.email
                                                    ? "border-red-400"
                                                    : "border-[#E8CEBC] focus:border-[#1D4533]"
                                            }`}
                                            placeholder="contoh@email.com"
                                            required
                                        />
                                        {errors.email && (
                                            <p className="mt-1 text-[10.5px] text-red-500 font-bold">
                                                {errors.email}
                                            </p>
                                        )}
                                    </div>

                                    {/* Hak Akses / Role */}
                                    <div>
                                        <label className="mb-1 block text-[11.5px] font-bold uppercase tracking-wider text-[#5E3122]">
                                            Hak Akses (Role)
                                        </label>
                                        <select
                                            value={data.role}
                                            onChange={(e) =>
                                                setData(
                                                    "role",
                                                    e.target.value as
                                                        | "admin"
                                                        | "user",
                                                )
                                            }
                                            className="w-full rounded-xl border border-[#E8CEBC] bg-[#FAF3EB] px-3.5 py-2 text-[13px] text-[#5E3122] outline-none transition focus:border-[#1D4533] focus:bg-[#FDF9F5] cursor-pointer"
                                        >
                                            <option value="user">
                                                Jamaah / User Biasa
                                            </option>
                                            <option value="admin">
                                                Administrator (Akses Penuh)
                                            </option>
                                        </select>
                                    </div>

                                    {/* Kata Sandi */}
                                    <div>
                                        <label className="mb-1 block text-[11.5px] font-bold uppercase tracking-wider text-[#5E3122]">
                                            Kata Sandi *
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
                                            className={`w-full rounded-xl border bg-[#FAF3EB] px-3.5 py-2 text-[13px] outline-none transition focus:bg-[#FDF9F5] ${
                                                errors.password
                                                    ? "border-red-400"
                                                    : "border-[#E8CEBC] focus:border-[#1D4533]"
                                            }`}
                                            placeholder="Minimal 8 karakter"
                                            required
                                        />
                                        {errors.password && (
                                            <p className="mt-1 text-[10.5px] text-red-500 font-bold">
                                                {errors.password}
                                            </p>
                                        )}
                                    </div>

                                    {/* Konfirmasi Kata Sandi */}
                                    <div>
                                        <label className="mb-1 block text-[11.5px] font-bold uppercase tracking-wider text-[#5E3122]">
                                            Ulangi Kata Sandi *
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
                                            className="w-full rounded-xl border border-[#E8CEBC] bg-[#FAF3EB] px-3.5 py-2 text-[13px] outline-none transition focus:border-[#1D4533] focus:bg-[#FDF9F5]"
                                            placeholder="Ketik ulang kata sandi"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Modal Footer */}
                                <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 px-5 py-3.5 border-t border-[#E8CEBC] bg-[#FAF3EB]/50 shrink-0">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="w-full sm:w-auto rounded-xl border border-[#E8CEBC] px-4 py-2 text-[12px] font-bold text-[#5E3122] transition hover:bg-[#FAF3EB] cursor-pointer text-center"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full sm:w-auto flex items-center justify-center gap-1.5 rounded-xl bg-[#1D4533] px-5 py-2 text-[12px] font-bold text-[#F7EAE0] transition hover:bg-[#143325] disabled:opacity-70 shadow-xs cursor-pointer"
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
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </AdminLayout>
    );
}
