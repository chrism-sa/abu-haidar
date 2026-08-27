import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Link, router, useForm } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import {
    Tags,
    FileText,
    Users,
    ArrowRight,
    BookDown,
    ShieldCheck,
    Database,
    Sparkles,
    HeartHandshake,
    Download,
    Upload,
    Check,
    X,
    AlertTriangle,
    Loader2,
    FileCode2,
    CheckCircle2,
    RefreshCw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

interface DashboardProps {
    auth: {
        user: {
            name: string;
            email: string;
        };
    };
    db_status?: boolean;
}

export default function Dashboard({ auth }: DashboardProps) {
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [confirmText, setConfirmText] = useState("");
    const [mounted, setMounted] = useState(false);
    const [isClearingCache, setIsClearingCache] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    const { data, setData, post, processing, reset, errors, clearErrors } =
        useForm({
            sql_file: null as File | null,
        });

    const handleCloseModal = () => {
        if (!processing) {
            setIsImportModalOpen(false);
            setConfirmText("");
            reset();
            clearErrors();
        }
    };

    const handleClearCache = () => {
        if (isClearingCache) return;
        setIsClearingCache(true);
        router.post(
            "/admin/clear-cache",
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success(
                        "Alhamdulillah, seluruh cache sistem berhasil dibersihkan!",
                    );
                },
                onError: () => {
                    toast.error("Gagal membersihkan cache sistem.");
                },
                onFinish: () => setIsClearingCache(false),
            },
        );
    };

    const handleImportSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!data.sql_file) {
            toast.error("Pilih file .sql terlebih dahulu!");
            return;
        }

        if (confirmText.trim() !== "PULIHKAN") {
            toast.error('Ketik "PULIHKAN" untuk mengonfirmasi pemulihan!');
            return;
        }

        post("/admin/database/import", {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                handleCloseModal();
                toast.success("Alhamdulillah, database berhasil dipulihkan!");
            },
            onError: (err: any) => {
                toast.error(err.message || "Gagal mengimpor database.");
            },
        });
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 15 },
        show: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.4, ease: "easeOut" },
        },
    };

    const isReadyToRestore =
        Boolean(data.sql_file) && confirmText.trim() === "PULIHKAN";

    return (
        <AdminLayout title="Dashboard Admin">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="space-y-5 sm:space-y-6 md:space-y-8"
            >
                {/* 1. KARTU SAPAAN (HERO BANNER) */}
                <motion.div
                    variants={itemVariants}
                    className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#1D4533] via-[#1A4130] to-[#143325] p-5 sm:p-7 md:p-9 text-[#F7EAE0] shadow-md border border-[#E8CEBC]/30"
                >
                    <div className="absolute -right-16 -top-16 h-48 w-48 sm:h-64 sm:w-64 rounded-full bg-white/5 blur-2xl pointer-events-none" />
                    <div className="absolute -left-10 -bottom-10 h-32 w-32 sm:h-40 sm:w-40 rounded-full bg-[#E8CEBC]/10 blur-xl pointer-events-none" />

                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full bg-white/10 px-2.5 sm:px-3 py-1 text-[10px] sm:text-[11px] font-bold tracking-wide uppercase text-[#F7EAE0] backdrop-blur-xs mb-2.5 sm:mb-3">
                            <Sparkles size={12} />
                            <span>Pusat Kendali Portal</span>
                        </div>
                        <h2 className="font-brand text-[20px] sm:text-[26px] md:text-[30px] font-bold leading-tight tracking-tight text-white">
                            Ahlan wa Sahlan, {auth.user.name}!
                        </h2>
                        <p className="mt-2 text-[12.5px] sm:text-[13.5px] md:text-[14.5px] text-[#F7EAE0]/90 leading-relaxed max-w-3xl">
                            Kelola semua artikel kajian sunnah, e-book risalah
                            PDF, pembagian kategori, otoritas pengguna, dan
                            cadangan basis data secara aman dan terstruktur.
                        </p>
                    </div>
                </motion.div>

                {/* 2. GRID MENU UTAMA */}
                <div className="grid gap-3.5 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                    {/* KARTU KELOLA ARTIKEL */}
                    <motion.div variants={itemVariants} className="h-full">
                        <Link
                            href="/admin/articles"
                            className="group flex h-full flex-col justify-between rounded-2xl border border-[#E8CEBC] bg-[#FDF9F5] p-4 sm:p-5 md:p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-[#1D4533] hover:shadow-lg"
                        >
                            <div>
                                <div className="mb-3.5 inline-flex rounded-xl bg-[#F2E2D5] p-2.5 sm:p-3 text-[#1D4533] transition-colors duration-300 group-hover:bg-[#1D4533] group-hover:text-[#F7EAE0]">
                                    <FileText size={20} />
                                </div>
                                <h3 className="font-brand text-[15px] sm:text-[16px] font-bold text-[#1D4533]">
                                    Kelola Artikel
                                </h3>
                                <p className="mt-1 text-[11.5px] sm:text-[12px] text-[#5E3122]/70 leading-relaxed">
                                    Tulis materi baru, sunting tafsir ayat,
                                    serta atur posisi Hero dan Redaksi.
                                </p>
                            </div>
                            <div className="mt-4 pt-2 flex items-center text-[11.5px] sm:text-[12px] font-bold text-[#1D4533] group-hover:text-[#5E3122]">
                                Buka Artikel
                                <ArrowRight
                                    size={13}
                                    className="ml-1.5 transition-transform group-hover:translate-x-1"
                                />
                            </div>
                        </Link>
                    </motion.div>

                    {/* KARTU KELOLA E-BOOK & PDF */}
                    <motion.div variants={itemVariants} className="h-full">
                        <Link
                            href="/admin/ebooks"
                            className="group flex h-full flex-col justify-between rounded-2xl border border-[#E8CEBC] bg-[#FDF9F5] p-4 sm:p-5 md:p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-[#1D4533] hover:shadow-lg"
                        >
                            <div>
                                <div className="mb-3.5 inline-flex rounded-xl bg-[#F2E2D5] p-2.5 sm:p-3 text-[#1D4533] transition-colors duration-300 group-hover:bg-[#1D4533] group-hover:text-[#F7EAE0]">
                                    <BookDown size={20} />
                                </div>
                                <h3 className="font-brand text-[15px] sm:text-[16px] font-bold text-[#1D4533]">
                                    Kelola E-Book PDF
                                </h3>
                                <p className="mt-1 text-[11.5px] sm:text-[12px] text-[#5E3122]/70 leading-relaxed">
                                    Unggah file PDF risalah ilmiah, buku saku
                                    dakwah, dan modul kajian gratis.
                                </p>
                            </div>
                            <div className="mt-4 pt-2 flex items-center text-[11.5px] sm:text-[12px] font-bold text-[#1D4533] group-hover:text-[#5E3122]">
                                Kelola PDF
                                <ArrowRight
                                    size={13}
                                    className="ml-1.5 transition-transform group-hover:translate-x-1"
                                />
                            </div>
                        </Link>
                    </motion.div>

                    {/* KARTU KELOLA KATEGORI */}
                    <motion.div variants={itemVariants} className="h-full">
                        <Link
                            href="/admin/categories"
                            className="group flex h-full flex-col justify-between rounded-2xl border border-[#E8CEBC] bg-[#FDF9F5] p-4 sm:p-5 md:p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-[#1D4533] hover:shadow-lg"
                        >
                            <div>
                                <div className="mb-3.5 inline-flex rounded-xl bg-[#F2E2D5] p-2.5 sm:p-3 text-[#1D4533] transition-colors duration-300 group-hover:bg-[#1D4533] group-hover:text-[#F7EAE0]">
                                    <Tags size={20} />
                                </div>
                                <h3 className="font-brand text-[15px] sm:text-[16px] font-bold text-[#1D4533]">
                                    Kelola Kategori
                                </h3>
                                <p className="mt-1 text-[11.5px] sm:text-[12px] text-[#5E3122]/70 leading-relaxed">
                                    Kelompokkan topik kajian (Fiqih, Aqidah,
                                    Tafsir, Hadits) agar rapi.
                                </p>
                            </div>
                            <div className="mt-4 pt-2 flex items-center text-[11.5px] sm:text-[12px] font-bold text-[#1D4533] group-hover:text-[#5E3122]">
                                Atur Kategori
                                <ArrowRight
                                    size={13}
                                    className="ml-1.5 transition-transform group-hover:translate-x-1"
                                />
                            </div>
                        </Link>
                    </motion.div>

                    {/* KARTU KELOLA PENGGUNA */}
                    <motion.div variants={itemVariants} className="h-full">
                        <Link
                            href="/admin/users"
                            className="group flex h-full flex-col justify-between rounded-2xl border border-[#E8CEBC] bg-[#FDF9F5] p-4 sm:p-5 md:p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-[#1D4533] hover:shadow-lg"
                        >
                            <div>
                                <div className="mb-3.5 inline-flex rounded-xl bg-[#F2E2D5] p-2.5 sm:p-3 text-[#1D4533] transition-colors duration-300 group-hover:bg-[#1D4533] group-hover:text-[#F7EAE0]">
                                    <Users size={20} />
                                </div>
                                <h3 className="font-brand text-[15px] sm:text-[16px] font-bold text-[#1D4533]">
                                    Kelola Pengguna
                                </h3>
                                <p className="mt-1 text-[11.5px] sm:text-[12px] text-[#5E3122]/70 leading-relaxed">
                                    Kelola hak akses administrator dan akun
                                    jamaah portal Abu Haidar.
                                </p>
                            </div>
                            <div className="mt-4 pt-2 flex items-center text-[11.5px] sm:text-[12px] font-bold text-[#1D4533] group-hover:text-[#5E3122]">
                                Atur Pengguna
                                <ArrowRight
                                    size={13}
                                    className="ml-1.5 transition-transform group-hover:translate-x-1"
                                />
                            </div>
                        </Link>
                    </motion.div>
                </div>

                {/* 3. WIDGET CADANGAN & PEMULIHAN DATABASE */}
                <motion.div
                    variants={itemVariants}
                    className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-[#E8CEBC] bg-[#FDF9F5] p-5 sm:p-6 md:p-7 shadow-xs"
                >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                        <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                            <div className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-2xl bg-[#FAF3EB] border border-[#E8CEBC] text-[#1D4533] shadow-2xs">
                                <Database size={24} />
                            </div>
                            <div className="min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <h3 className="font-brand text-[16px] sm:text-[18px] font-bold text-[#1D4533]">
                                        Cadangan Basis Data (Database)
                                    </h3>
                                    <span className="rounded-md bg-[#1D4533]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#1D4533]">
                                        SQL Dump
                                    </span>
                                </div>
                                <p className="mt-1 text-[12px] sm:text-[13px] text-[#5E3122]/75 leading-relaxed">
                                    Amankan salinan lengkap artikel, e-book,
                                    kategori, dan akun ke format{" "}
                                    <code>.sql</code>, atau lakukan pemulihan
                                    cepat saat dibutuhkan.
                                </p>
                            </div>
                        </div>

                        {/* TOMBOL AKSI BACKUP & RESTORE */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-[#E8CEBC]/60">
                            <a
                                href="/admin/database/backup"
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1D4533] px-5 py-2.5 text-[12.5px] font-bold text-[#F7EAE0] transition-all hover:bg-[#143325] hover:shadow-md shadow-xs cursor-pointer active:scale-95"
                            >
                                <Download size={15} />
                                <span>Unduh Backup .SQL</span>
                            </a>

                            <button
                                type="button"
                                onClick={() => setIsImportModalOpen(true)}
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#E8CEBC] bg-[#FAF3EB] px-5 py-2.5 text-[12.5px] font-bold text-[#1D4533] transition-all hover:bg-[#F2E2D5] hover:border-[#1D4533]/40 shadow-xs cursor-pointer active:scale-95"
                            >
                                <Upload size={15} />
                                <span>Pulihkan / Impor DB</span>
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* 4. WIDGET STATUS SISTEM & BERSIHKAN CACHE */}
                <motion.div
                    variants={itemVariants}
                    className="rounded-2xl border border-[#E8CEBC] bg-[#FDF9F5] p-4 sm:p-5 md:p-6 shadow-xs"
                >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-[#1D4533]/10 text-[#1D4533]">
                                <ShieldCheck size={18} />
                            </div>
                            <div className="min-w-0">
                                <h4 className="font-brand text-[13px] sm:text-[14px] font-bold text-[#1D4533]">
                                    Status Keamanan & Lingkungan Sistem
                                </h4>
                                <p className="text-[11px] text-[#5E3122]/70">
                                    Sistem beroperasi normal dengan enkripsi
                                    sesi aktif.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2.5">
                            {/* Tombol Bersihkan Cache */}
                            <button
                                type="button"
                                onClick={handleClearCache}
                                disabled={isClearingCache}
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#E8CEBC] bg-[#FAF3EB] px-3.5 py-2 text-[11px] sm:text-[12px] font-bold text-[#1D4533] transition hover:bg-[#F2E2D5] hover:border-[#1D4533]/40 shadow-2xs cursor-pointer active:scale-95 disabled:opacity-60"
                            >
                                <RefreshCw
                                    size={13}
                                    className={
                                        isClearingCache
                                            ? "animate-spin text-amber-700"
                                            : ""
                                    }
                                />
                                <span>
                                    {isClearingCache
                                        ? "Membersihkan..."
                                        : "Bersihkan Cache"}
                                </span>
                            </button>

                            {/* Info Admin Aktif */}
                            <div className="flex items-center gap-1.5 rounded-xl border border-[#E8CEBC] bg-[#FAF3EB] px-3 py-2 text-[11px] font-bold text-[#5E3122] max-w-full">
                                <HeartHandshake
                                    size={13}
                                    className="text-[#1D4533] shrink-0"
                                />
                                <span className="truncate">
                                    Admin: {auth.user.email}
                                </span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>

            {/* MODAL IMPORT DATABASE (PORTAL + VERIFIKASI KEAMANAN GANDA) */}
            {mounted &&
                createPortal(
                    <AnimatePresence>
                        {isImportModalOpen && (
                            <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onClick={handleCloseModal}
                                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-0"
                                />

                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: 15 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: 15 }}
                                    transition={{ duration: 0.25 }}
                                    className="relative z-10 w-full max-w-md rounded-3xl bg-[#FDF9F5] shadow-2xl border border-[#E8CEBC] flex flex-col my-auto overflow-hidden text-[#5E3122]"
                                >
                                    {/* Header Modal */}
                                    <div className="flex items-center justify-between border-b border-[#E8CEBC] bg-[#FAF3EB] px-6 py-4 shrink-0 rounded-t-3xl">
                                        <div className="flex items-center gap-2.5">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-600 text-white shadow-xs">
                                                <Upload size={18} />
                                            </div>
                                            <div>
                                                <h3 className="font-brand text-[17px] font-bold text-[#1D4533] leading-none">
                                                    Pulihkan Basis Data
                                                </h3>
                                                <p className="text-[11px] text-[#8C5E43] font-medium mt-0.5">
                                                    Impor Dokumen SQL Cadangan
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleCloseModal}
                                            disabled={processing}
                                            className="flex h-8 w-8 items-center justify-center rounded-full bg-white border border-[#E8CEBC] text-[#5E3122]/70 transition hover:bg-[#F2E2D5] hover:text-[#1D4533] cursor-pointer shadow-2xs"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>

                                    {/* Body Modal */}
                                    <form
                                        onSubmit={handleImportSubmit}
                                        className="flex flex-col flex-1"
                                    >
                                        <div className="p-6 space-y-4">
                                            {/* Kotak Peringatan */}
                                            <div className="flex gap-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 p-3.5 text-amber-950">
                                                <AlertTriangle
                                                    size={18}
                                                    className="text-amber-700 shrink-0 mt-0.5"
                                                />
                                                <div className="text-[11.5px] leading-relaxed">
                                                    <strong>
                                                        Tindakan Kritis:
                                                    </strong>{" "}
                                                    Seluruh tabel dan data saat
                                                    ini akan ditimpa bersih oleh
                                                    file SQL yang diunggah.
                                                </div>
                                            </div>

                                            {/* Card Pemilihan File SQL */}
                                            <div>
                                                <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-[#5E3122]">
                                                    Pilih File Cadangan (.sql) *
                                                </label>
                                                <input
                                                    ref={fileInputRef}
                                                    type="file"
                                                    required
                                                    accept=".sql,application/sql,text/plain"
                                                    onChange={(e) =>
                                                        setData(
                                                            "sql_file",
                                                            e.target.files
                                                                ? e.target
                                                                      .files[0]
                                                                : null,
                                                        )
                                                    }
                                                    className="hidden"
                                                />

                                                <div
                                                    onClick={() =>
                                                        fileInputRef.current?.click()
                                                    }
                                                    className={`group flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-4 text-center transition cursor-pointer ${
                                                        data.sql_file
                                                            ? "border-[#1D4533] bg-[#1D4533]/5"
                                                            : "border-[#E8CEBC] bg-[#FAF3EB]/70 hover:border-[#1D4533] hover:bg-[#FAF3EB]"
                                                    }`}
                                                >
                                                    <div className="mb-1.5 flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-[#E8CEBC] text-[#1D4533] shadow-2xs group-hover:scale-105 transition-transform">
                                                        {data.sql_file ? (
                                                            <CheckCircle2
                                                                size={20}
                                                                className="text-emerald-600"
                                                            />
                                                        ) : (
                                                            <FileCode2
                                                                size={20}
                                                            />
                                                        )}
                                                    </div>

                                                    {data.sql_file ? (
                                                        <div className="max-w-full px-2">
                                                            <p className="font-bold text-[12px] text-[#1D4533] truncate">
                                                                {
                                                                    data
                                                                        .sql_file
                                                                        .name
                                                                }
                                                            </p>
                                                            <p className="text-[10.5px] text-[#8C5E43] mt-0.5">
                                                                {(
                                                                    data
                                                                        .sql_file
                                                                        .size /
                                                                    1024
                                                                ).toFixed(
                                                                    1,
                                                                )}{" "}
                                                                KB • Klik untuk
                                                                ganti
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        <div>
                                                            <p className="text-[12px] font-bold text-[#1D4533]">
                                                                Klik untuk
                                                                memilih file
                                                                .SQL
                                                            </p>
                                                            <p className="text-[10.5px] text-[#5E3122]/60 mt-0.5">
                                                                Maksimal ukuran
                                                                file disesuaikan
                                                                server
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>

                                                {errors.sql_file && (
                                                    <p className="mt-1 text-[10.5px] text-red-500 font-bold">
                                                        {errors.sql_file}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Pengaman Konfirmasi */}
                                            <div className="rounded-2xl border border-[#E8CEBC] bg-[#FAF3EB] p-3.5 space-y-2">
                                                <label className="block text-[11px] font-bold text-[#5E3122]">
                                                    Konfirmasi Keamanan:
                                                </label>
                                                <p className="text-[11px] text-[#5E3122]/70 leading-relaxed">
                                                    Ketik kata{" "}
                                                    <span className="font-bold text-amber-800 tracking-wider">
                                                        PULIHKAN
                                                    </span>{" "}
                                                    di bawah ini untuk membuka
                                                    tombol eksekusi:
                                                </p>
                                                <input
                                                    type="text"
                                                    value={confirmText}
                                                    onChange={(e) =>
                                                        setConfirmText(
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder='Ketik "PULIHKAN"'
                                                    className="w-full rounded-xl border border-[#E8CEBC] bg-white px-3.5 py-2 text-[12.5px] font-bold tracking-wider text-[#1D4533] outline-none transition focus:border-[#1D4533]"
                                                />
                                            </div>
                                        </div>

                                        {/* Footer Modal */}
                                        <div className="flex flex-col-reverse sm:flex-row justify-end gap-2.5 px-6 py-4 border-t border-[#E8CEBC] bg-[#FAF3EB]/60 shrink-0 rounded-b-3xl">
                                            <button
                                                type="button"
                                                onClick={handleCloseModal}
                                                disabled={processing}
                                                className="w-full sm:w-auto rounded-xl border border-[#E8CEBC] px-4 py-2 text-[12px] font-bold text-[#5E3122] hover:bg-[#FAF3EB] cursor-pointer text-center"
                                            >
                                                Batal
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={
                                                    processing ||
                                                    !isReadyToRestore
                                                }
                                                className="w-full sm:w-auto flex items-center justify-center gap-1.5 rounded-xl bg-amber-600 px-5 py-2 text-[12px] font-bold text-white hover:bg-amber-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-xs active:scale-95 transition-all"
                                            >
                                                {processing ? (
                                                    <>
                                                        <Loader2
                                                            size={15}
                                                            className="animate-spin"
                                                        />
                                                        <span>
                                                            Memulihkan
                                                            Database...
                                                        </span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Check size={15} />
                                                        <span>
                                                            Eksekusi Pemulihan
                                                        </span>
                                                    </>
                                                )}
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
