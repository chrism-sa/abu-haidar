import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Head, Link, usePage, useForm } from "@inertiajs/react";
import MainLayout from "@/Layouts/MainLayout";
import {
    Info,
    Target,
    Compass,
    ArrowLeft,
    BookOpen,
    Edit3,
    X,
    Check,
    Loader2,
    Upload,
    User,
    Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

interface AboutProps {
    about: {
        title: string;
        subtitle: string;
        content: string;
        vision?: string;
        mission?: string;
        image_url?: string | null;
    };
}

export default function AboutIndex({ about }: AboutProps) {
    const { auth } = usePage<{ auth?: { user?: { role?: string } } }>().props;
    const isAdmin = auth?.user?.role === "admin";

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(
        about.image_url || null,
    );
    const [mounted, setMounted] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    const { data, setData, post, processing, clearErrors, errors } = useForm({
        title: about.title || "Tentang Portal Abu Haidar",
        subtitle: about.subtitle || "",
        content: about.content || "",
        vision: about.vision || "",
        mission: about.mission || "",
        image: null as File | null,
    });

    const handleCloseModal = () => {
        if (!processing) {
            setIsEditModalOpen(false);
            setPreviewImage(about.image_url || null);
            clearErrors();
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData("image", file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        post("/admin/about", {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setIsEditModalOpen(false);
                toast.success(
                    "Alhamdulillah, Profil & Halaman Tentang berhasil diperbarui!",
                );
            },
            onError: () => {
                toast.error("Gagal menyimpan perubahan. Periksa form.");
            },
        });
    };

    return (
        <MainLayout title={about.title}>
            <Head title={`${about.title} - Abu Haidar`} />

            <div className="mx-auto max-w-[1000px] px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                {/* NAVIGASI & TOMBOL EDIT */}
                <div className="mb-6 flex items-center justify-between gap-4">
                    <Link
                        href="/home"
                        className="inline-flex items-center gap-2 rounded-xl border border-[#E8CEBC] bg-[#FAF1E8] px-3.5 py-2 text-[12px] sm:text-[13px] font-bold text-[#1D4533] hover:bg-[#F2E2D5] transition shadow-2xs active:scale-95"
                    >
                        <ArrowLeft size={15} />
                        <span>Kembali ke Beranda</span>
                    </Link>

                    {isAdmin && (
                        <button
                            type="button"
                            onClick={() => setIsEditModalOpen(true)}
                            className="inline-flex items-center gap-2 rounded-xl bg-[#1D4533] px-4 py-2 text-[12px] sm:text-[13px] font-bold text-[#F7EAE0] transition hover:bg-[#143325] shadow-xs cursor-pointer active:scale-95"
                        >
                            <Edit3 size={15} />
                            <span>Sunting Profil & Konten</span>
                        </button>
                    )}
                </div>

                {/* 1. KARTU PROFIL & BIOGRAFI SINGKAT (COMPACT AVATAR) */}
                <div className="mb-8 rounded-3xl border border-[#E8CEBC] bg-[#FAF1E8] p-6 sm:p-8 md:p-10 shadow-xs relative overflow-hidden">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
                        {/* Foto Profil / PP Avatar */}
                        <div className="relative shrink-0">
                            <div className="h-28 w-28 sm:h-36 sm:w-36 overflow-hidden rounded-full border-4 border-[#FDF9F5] bg-[#EAD4C3] shadow-md ring-2 ring-[#1D4533]/20 flex items-center justify-center">
                                {about.image_url ? (
                                    <img
                                        src={about.image_url}
                                        alt={about.title}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <User
                                        size={52}
                                        className="text-[#8C5E43]/50"
                                    />
                                )}
                            </div>
                        </div>

                        {/* Identitas & Judul Profil */}
                        <div className="flex-1 text-center sm:text-left min-w-0">
                            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#1D4533]/10 px-3 py-1 text-[10.5px] font-bold uppercase tracking-wider text-[#1D4533] mb-2">
                                <Sparkles size={12} />
                                <span>Profil Pengasuh & Portal</span>
                            </div>

                            <h1 className="font-brand text-[22px] sm:text-[28px] md:text-[32px] font-bold text-[#1D4533] leading-tight">
                                {about.title}
                            </h1>

                            {about.subtitle && (
                                <p className="mt-1.5 text-[13px] sm:text-[14.5px] font-semibold text-[#8C5E43]">
                                    {about.subtitle}
                                </p>
                            )}

                            <div className="mt-4 h-[1px] w-full bg-[#E8CEBC]/70" />

                            {/* Deskripsi Biografi */}
                            <div
                                className="mt-4 prose max-w-none text-[#4A2619] leading-relaxed text-[13px] sm:text-[14px]"
                                dangerouslySetInnerHTML={{
                                    __html: about.content,
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* 2. VISI & MISI CARD */}
                {(about.vision || about.mission) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {about.vision && (
                            <div className="rounded-3xl border border-[#E8CEBC] bg-[#FAF1E8] p-6 sm:p-7 shadow-xs">
                                <div className="flex items-center gap-2 text-[#1D4533] font-brand font-bold text-[17px] mb-2.5">
                                    <Target
                                        size={18}
                                        className="text-amber-700"
                                    />
                                    <span>Visi Dakwah</span>
                                </div>
                                <p className="text-[12.5px] sm:text-[13.5px] leading-relaxed text-[#5E3122]/85">
                                    {about.vision}
                                </p>
                            </div>
                        )}

                        {about.mission && (
                            <div className="rounded-3xl border border-[#E8CEBC] bg-[#FAF1E8] p-6 sm:p-7 shadow-xs">
                                <div className="flex items-center gap-2 text-[#1D4533] font-brand font-bold text-[17px] mb-2.5">
                                    <Compass
                                        size={18}
                                        className="text-emerald-700"
                                    />
                                    <span>Misi Dakwah</span>
                                </div>
                                <p className="text-[12.5px] sm:text-[13.5px] leading-relaxed text-[#5E3122]/85">
                                    {about.mission}
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* MODAL SUNTING (PORTAL BODY - ANTI TERPOTONG) */}
            {mounted &&
                createPortal(
                    <AnimatePresence>
                        {isEditModalOpen && (
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
                                    className="relative z-10 w-full max-w-xl rounded-3xl bg-[#FDF9F5] shadow-2xl border border-[#E8CEBC] flex flex-col my-auto max-h-[90vh] overflow-hidden text-[#5E3122]"
                                >
                                    {/* Modal Header */}
                                    <div className="flex items-center justify-between border-b border-[#E8CEBC] bg-[#FAF3EB] px-6 py-4 shrink-0 rounded-t-3xl">
                                        <div className="flex items-center gap-2.5">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1D4533] text-[#F7EAE0] shadow-xs">
                                                <Edit3 size={17} />
                                            </div>
                                            <div>
                                                <h3 className="font-brand text-[17px] font-bold text-[#1D4533] leading-none">
                                                    Sunting Profil & Biografi
                                                </h3>
                                                <p className="text-[11px] text-[#8C5E43] font-medium mt-0.5">
                                                    Perbarui foto profil, nama,
                                                    dan biografi
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

                                    {/* Modal Body Scrollable */}
                                    <form
                                        onSubmit={handleUpdate}
                                        className="flex flex-col flex-1 overflow-hidden"
                                    >
                                        <div className="p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-140px)]">
                                            {/* Foto Profil Avatar Ringkas */}
                                            <div>
                                                <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-[#5E3122]">
                                                    Foto Profil Pengasuh /
                                                    Avatar
                                                </label>
                                                <input
                                                    ref={fileInputRef}
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageChange}
                                                    className="hidden"
                                                />
                                                <div className="flex items-center gap-4 rounded-2xl border border-[#E8CEBC] bg-[#FAF3EB]/70 p-3">
                                                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-white bg-[#EAD4C3] shadow-xs flex items-center justify-center">
                                                        {previewImage ? (
                                                            <img
                                                                src={
                                                                    previewImage
                                                                }
                                                                alt="Avatar"
                                                                className="h-full w-full object-cover"
                                                            />
                                                        ) : (
                                                            <User
                                                                size={28}
                                                                className="text-[#8C5E43]/50"
                                                            />
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col gap-1">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                fileInputRef.current?.click()
                                                            }
                                                            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#1D4533] px-3.5 py-1.5 text-[11px] font-bold text-[#F7EAE0] hover:bg-[#143325] transition cursor-pointer shadow-2xs w-fit"
                                                        >
                                                            <Upload size={13} />
                                                            <span>
                                                                Pilih Foto
                                                                Avatar
                                                            </span>
                                                        </button>
                                                        <span className="text-[10px] text-[#5E3122]/60">
                                                            Rasio kotak 1:1,
                                                            Maks. 3 MB
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Nama / Judul */}
                                            <div>
                                                <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[#5E3122]">
                                                    Nama / Judul Halaman *
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={data.title}
                                                    onChange={(e) =>
                                                        setData(
                                                            "title",
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="Contoh: Ustadz Abu Haidar As-Sundawy"
                                                    className="w-full rounded-xl border border-[#E8CEBC] bg-[#FAF3EB] px-3.5 py-2 text-[13px] text-[#5E3122] outline-none focus:border-[#1D4533] focus:bg-white focus:ring-2 focus:ring-[#1D4533]/15"
                                                />
                                            </div>

                                            {/* Subjudul / Gelar */}
                                            <div>
                                                <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[#5E3122]">
                                                    Gelar / Slogan Singkat
                                                </label>
                                                <input
                                                    type="text"
                                                    value={data.subtitle}
                                                    onChange={(e) =>
                                                        setData(
                                                            "subtitle",
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="Contoh: Pengasuh & Pembina Kajian Islam Ilmiah"
                                                    className="w-full rounded-xl border border-[#E8CEBC] bg-[#FAF3EB] px-3.5 py-2 text-[13px] text-[#5E3122] outline-none focus:border-[#1D4533] focus:bg-white focus:ring-2 focus:ring-[#1D4533]/15"
                                                />
                                            </div>

                                            {/* Deskripsi Biografi */}
                                            <div>
                                                <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[#5E3122]">
                                                    Biografi Singkat & Profil *
                                                </label>
                                                <textarea
                                                    rows={5}
                                                    required
                                                    value={data.content}
                                                    onChange={(e) =>
                                                        setData(
                                                            "content",
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="w-full rounded-xl border border-[#E8CEBC] bg-[#FAF3EB] p-3 text-[13px] text-[#5E3122] outline-none focus:border-[#1D4533] focus:bg-white focus:ring-2 focus:ring-[#1D4533]/15 leading-relaxed"
                                                />
                                            </div>

                                            {/* Visi & Misi */}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                                <div>
                                                    <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[#5E3122]">
                                                        Visi Dakwah
                                                    </label>
                                                    <textarea
                                                        rows={3}
                                                        value={data.vision}
                                                        onChange={(e) =>
                                                            setData(
                                                                "vision",
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="w-full rounded-xl border border-[#E8CEBC] bg-[#FAF3EB] p-3 text-[12px] text-[#5E3122] outline-none focus:border-[#1D4533] focus:bg-white"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[#5E3122]">
                                                        Misi Dakwah
                                                    </label>
                                                    <textarea
                                                        rows={3}
                                                        value={data.mission}
                                                        onChange={(e) =>
                                                            setData(
                                                                "mission",
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="w-full rounded-xl border border-[#E8CEBC] bg-[#FAF3EB] p-3 text-[12px] text-[#5E3122] outline-none focus:border-[#1D4533] focus:bg-white"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Modal Footer */}
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
                                                disabled={processing}
                                                className="w-full sm:w-auto flex items-center justify-center gap-1.5 rounded-xl bg-[#1D4533] px-5 py-2 text-[12px] font-bold text-[#F7EAE0] hover:bg-[#143325] disabled:opacity-50 cursor-pointer shadow-xs active:scale-95"
                                            >
                                                {processing ? (
                                                    <>
                                                        <Loader2
                                                            size={15}
                                                            className="animate-spin"
                                                        />
                                                        <span>
                                                            Menyimpan...
                                                        </span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Check size={15} />
                                                        <span>
                                                            Simpan Perubahan
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
        </MainLayout>
    );
}
