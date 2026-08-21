import { Head, Link, useForm } from "@inertiajs/react";
import {
    ArrowLeft,
    Save,
    Image as ImageIcon,
    Eye,
    Edit3,
    Link2,
    Upload,
    Crop,
    ZoomIn,
    Check,
    X,
    Type,
    ImagePlus, // Youtube dihapus dari lucide-react
} from "lucide-react";
import { FaYoutube } from "react-icons/fa"; // KITA GUNAKAN FONT AWESOME UNTUK YOUTUBE
import { Category, Article } from "@/types";
import React, { useState, useEffect, useMemo } from "react";
import ReactQuill, { Quill } from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

import Cropper from "react-easy-crop";
import getCroppedImg from "@/Utils/cropImage";

// 1. Daftarkan Whitelist Font Lokal ke Quill Editor
const Font = Quill.import("formats/font") as any;
Font.whitelist = ["adobe-naskh", "al-jazeera", "serif", "monospace"];
Quill.register(Font, true);

// HELPER MENDETEKSI LINK YOUTUBE
const getYouTubeId = (url: string) => {
    if (!url) return null;
    const regExp =
        /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
};

interface QuoteItem {
    id?: number;
    arabic?: string;
    translation?: string;
    reference?: string;
    image?: string; // Menambahkan support image dari DB
}

interface EditProps {
    article: Article;
    categories: Category[];
    quote?: QuoteItem | null;
}

export default function ArticleEdit({ article, categories, quote }: EditProps) {
    // Deteksi awal tipe gambar sampul (Apakah URL Youtube, URL biasa, atau File)
    const initialYoutubeId = article.image ? getYouTubeId(article.image) : null;
    const initialImageSourceType = initialYoutubeId ? "youtube" : "file";

    const [imageSourceType, setImageSourceType] = useState<
        "file" | "url" | "youtube"
    >(initialImageSourceType);
    const [quoteType, setQuoteType] = useState<"text" | "image">(
        quote?.image ? "image" : "text",
    );
    const [viewMode, setViewMode] = useState<"edit" | "preview">("edit");

    const [tempImageSrc, setTempImageSrc] = useState<string | null>(
        article.image || null,
    );
    const [imagePreview, setImagePreview] = useState<string | null>(
        article.image || null,
    );
    const [quoteImagePreview, setQuoteImagePreview] = useState<string | null>(
        quote?.image || null,
    );

    // State Khusus Cropper
    const [cropModalOpen, setCropModalOpen] = useState(false);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

    // 1. Perbarui state arabicFont
    const [arabicFont, setArabicFont] = useState<
        | "font-adobe-naskh"
        | "font-al-jazeera"
        | "font-traditional-arabic"
        | "font-scheherazade"
    >("font-traditional-arabic"); // Default ke font Google yang rapi

    // 2. Masukkan ke dalam daftar pilihan
    const fontOptions = [
        {
            label: "Traditional Arabic / Amiri (Google)",
            value: "font-traditional-arabic",
        },
        { label: "Scheherazade New (Google)", value: "font-scheherazade" },
        { label: "Adobe Naskh (Lokal)", value: "font-adobe-naskh" },
        { label: "Al Jazeera (Lokal)", value: "font-al-jazeera" },
    ];

    const handleOpenCropModal = () => {
        if (!tempImageSrc && imagePreview && imageSourceType === "file") {
            setTempImageSrc(imagePreview);
        }
        setCropModalOpen(true);
    };

    // Form Inertia
    const { data, setData, post, processing, transform } = useForm({
        _method: "POST",
        title: article.title || "",
        category_id: article.category_id || categories[0]?.id || "",
        image_file: null as File | null,
        image_url:
            initialImageSourceType === "youtube" ? article.image || "" : "",
        description: article.description || "",
        content: article.content || "",
        is_published: Boolean(article.is_published),
        // Data Quote
        quote_type: quote?.image ? "image" : "text",
        quote_arabic: quote?.arabic || "",
        quote_translation: quote?.translation || "",
        quote_reference: quote?.reference || "",
        quote_image_file: null as File | null,
    });

    const selectedCategory = categories.find(
        (c) => c.id === Number(data.category_id),
    );
    const isTafsirCategory = selectedCategory?.name
        ?.toLowerCase()
        .includes("tafsir");

    // Pembersihan & Modifikasi sebelum dikirim ke backend
    transform((currentData) => ({
        ...currentData,
        content: currentData.content
            ? currentData.content
                  .replace(/&nbsp;/g, " ")
                  .replace(/\u00a0/g, " ")
            : "",
        description: currentData.description
            ? currentData.description
                  .replace(/&nbsp;/g, " ")
                  .replace(/\u00a0/g, " ")
            : "",
        quote_type: quoteType,
    }));

    // Sinkronisasi Preview Gambar Sampul
    useEffect(() => {
        if (imageSourceType === "file" && data.image_file) {
            const objectUrl = URL.createObjectURL(data.image_file);
            setImagePreview(objectUrl);
            return () => URL.revokeObjectURL(objectUrl);
        } else if (
            (imageSourceType === "url" || imageSourceType === "youtube") &&
            data.image_url
        ) {
            setImagePreview(data.image_url);
        } else if (!data.image_file && !data.image_url) {
            setImagePreview(article.image || null);
        }
    }, [data.image_file, data.image_url, imageSourceType, article.image]);

    // Sinkronisasi Preview Gambar Quote
    useEffect(() => {
        if (quoteType === "image" && data.quote_image_file) {
            const objectUrl = URL.createObjectURL(data.quote_image_file);
            setQuoteImagePreview(objectUrl);
            return () => URL.revokeObjectURL(objectUrl);
        } else if (!data.quote_image_file && quote?.image) {
            setQuoteImagePreview(quote.image);
        } else {
            setQuoteImagePreview(null);
        }
    }, [data.quote_image_file, quoteType, quote?.image]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            if (file.size > 2 * 1024 * 1024) {
                alert("Ukuran gambar terlalu besar! Maksimal 2 MB.");
                e.target.value = "";
                return;
            }
            const reader = new FileReader();
            reader.addEventListener("load", () => {
                setTempImageSrc(reader.result?.toString() || null);
                setCropModalOpen(true);
            });
            reader.readAsDataURL(file);
        }
    };

    const handleQuoteImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            if (file.size > 2 * 1024 * 1024) {
                alert("Ukuran gambar terlalu besar! Maks. 2 MB.");
                e.target.value = "";
                return;
            }
            setData("quote_image", file);
        }
    };

    const handleSaveCrop = async () => {
        try {
            if (tempImageSrc && croppedAreaPixels) {
                const croppedFile = await getCroppedImg(
                    tempImageSrc,
                    croppedAreaPixels,
                );
                setData("image_file", croppedFile);
                setCropModalOpen(false);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const quillModules = useMemo(
        () => ({
            toolbar: [
                [
                    {
                        font: [
                            false,
                            "adobe-naskh",
                            "al-jazeera",
                            "serif",
                            "monospace",
                        ],
                    },
                ],
                [{ header: [2, 3, 4, false] }],
                ["bold", "italic", "underline", "strike"],
                [{ color: [] }, { background: [] }],
                [{ align: [] }],
                [{ list: "ordered" }, { list: "bullet" }],
                [{ direction: "rtl" }],
                ["link", "blockquote"],
                ["clean"],
            ],
            clipboard: {
                matchers: [
                    [
                        Node.TEXT_NODE,
                        (_node: any, delta: any) => {
                            delta.ops.forEach((op: any) => {
                                if (typeof op.insert === "string") {
                                    op.insert = op.insert.replace(
                                        /\u00a0/g,
                                        " ",
                                    );
                                }
                            });
                            return delta;
                        },
                    ],
                ],
            },
        }),
        [],
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/admin/articles/${article.id}`);
    };

    const ytId =
        imageSourceType === "youtube"
            ? getYouTubeId(data.image_url || article.image)
            : null;

    return (
        <div className="min-h-screen bg-[#eaf6efc0] text-[#162B22]">
            <Head title={`Edit: ${article.title} - Abu Haidar`} />

            <header className="sticky top-0 z-30 border-b border-[#E0EAE3] bg-white shadow-xs">
                <div className="mx-auto flex max-w-[1000px] items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/admin/articles"
                            className="flex items-center gap-1.5 rounded-lg border border-[#E0EAE3] bg-white px-3 py-2 text-[12px] font-medium text-[#555] transition hover:bg-[#F2F7F4]"
                        >
                            <ArrowLeft size={14} /> Kembali
                        </Link>
                        <h1 className="hidden font-serif text-[18px] font-bold text-[#111] sm:block truncate max-w-sm">
                            Edit: {article.title}
                        </h1>
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={processing}
                        className="flex items-center gap-2 rounded-xl bg-[#0F4C3A] px-5 py-2.5 text-[13px] font-bold text-white shadow-sm transition hover:bg-[#0a382a] disabled:opacity-50"
                    >
                        <Save size={15} /> Simpan Perubahan
                    </button>
                </div>
            </header>

            <main className="mx-auto max-w-[900px] px-4 py-8">
                <form
                    onSubmit={handleSubmit}
                    className="space-y-6"
                    encType="multipart/form-data"
                >
                    <div className="rounded-2xl border border-[#E0EAE3] bg-white p-8 shadow-sm space-y-5">
                        <div>
                            <label className="block text-[12px] font-bold uppercase tracking-wider text-[#555] mb-2">
                                Judul Artikel
                            </label>
                            <input
                                type="text"
                                value={data.title}
                                onChange={(e) =>
                                    setData("title", e.target.value)
                                }
                                placeholder="Ketik judul kajian di sini..."
                                className="w-full rounded-xl border border-[#E0EAE3] px-4 py-3 text-[16px] font-serif font-bold focus:border-[#0F4C3A] focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-[12px] font-bold uppercase tracking-wider text-[#555] mb-2">
                                Kategori
                            </label>
                            <select
                                value={data.category_id}
                                onChange={(e) =>
                                    setData(
                                        "category_id",
                                        Number(e.target.value),
                                    )
                                }
                                className="w-full rounded-xl border border-[#E0EAE3] px-4 py-3 text-[14px] bg-white focus:border-[#0F4C3A] focus:outline-none"
                            >
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* GAMBAR SAMPUL SUPPORT YOUTUBE */}
                        <div className="space-y-3 rounded-xl border border-[#E0EAE3] bg-[#F9FBF9] p-4">
                            <div className="flex items-center justify-between">
                                <label className="text-[12px] font-bold uppercase tracking-wider text-[#555] flex items-center gap-2">
                                    <ImageIcon
                                        size={16}
                                        className="text-[#0F4C3A]"
                                    />{" "}
                                    Gambar / Video Sampul
                                </label>
                                <div className="flex rounded-lg border border-[#E0EAE3] bg-white p-0.5 text-[11px] font-bold">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setImageSourceType("file")
                                        }
                                        className={`flex items-center gap-1 rounded-md px-3 py-1.5 transition ${imageSourceType === "file" ? "bg-[#0F4C3A] text-white" : "text-[#777]"}`}
                                    >
                                        <Upload size={12} /> Upload
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setImageSourceType("url")
                                        }
                                        className={`flex items-center gap-1 rounded-md px-3 py-1.5 transition ${imageSourceType === "url" ? "bg-[#0F4C3A] text-white" : "text-[#777]"}`}
                                    >
                                        <Link2 size={12} /> Tautan
                                    </button>
                                    {/* MENGGUNAKAN FaYoutube DARI REACT-ICONS */}
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setImageSourceType("youtube")
                                        }
                                        className={`flex items-center gap-1 rounded-md px-3 py-1.5 transition ${imageSourceType === "youtube" ? "bg-red-600 text-white" : "text-[#777]"}`}
                                    >
                                        <FaYoutube size={14} /> YouTube
                                    </button>
                                </div>
                            </div>

                            {imageSourceType === "file" ? (
                                <div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileSelect}
                                        className="w-full text-[13px] text-[#555] file:mr-4 file:rounded-lg file:border-0 file:bg-[#EBF1ED] file:px-4 file:py-2 file:text-[12px] file:font-bold file:text-[#0F4C3A] hover:file:bg-[#e0e8e4] cursor-pointer"
                                    />
                                    <p className="mt-1 text-[11px] text-[#888]">
                                        Biarkan kosong jika tidak mengubah
                                        sampul. Maks 2 MB.
                                    </p>
                                </div>
                            ) : imageSourceType === "youtube" ? (
                                <input
                                    type="url"
                                    value={data.image_url}
                                    onChange={(e) =>
                                        setData("image_url", e.target.value)
                                    }
                                    placeholder="Contoh: https://www.youtube.com/watch?v=..."
                                    className="w-full rounded-xl border border-[#E0EAE3] bg-white px-4 py-2.5 text-[13px] focus:border-red-600 focus:outline-none"
                                />
                            ) : (
                                <input
                                    type="url"
                                    value={data.image_url}
                                    onChange={(e) =>
                                        setData("image_url", e.target.value)
                                    }
                                    placeholder="https://domain.com/gambar-artikel.jpg"
                                    className="w-full rounded-xl border border-[#E0EAE3] bg-white px-4 py-2.5 text-[13px] focus:border-[#0F4C3A] focus:outline-none"
                                />
                            )}

                            {/* PREVIEW GAMBAR ATAU VIDEO */}
                            {imageSourceType === "youtube" && ytId ? (
                                <div className="mt-3 aspect-video w-full max-w-md overflow-hidden rounded-xl bg-black">
                                    <iframe
                                        src={`https://www.youtube.com/embed/${ytId}`}
                                        className="h-full w-full border-0"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            ) : imageSourceType !== "youtube" &&
                              imagePreview ? (
                                <div className="mt-3 relative h-44 w-full max-w-sm overflow-hidden rounded-xl border border-[#E0EAE3] group bg-[#f0eee9]">
                                    <img
                                        src={imagePreview}
                                        alt="Thumbnail Preview"
                                        className="h-full w-full object-cover"
                                    />
                                    {imageSourceType === "file" && (
                                        <button
                                            type="button"
                                            onClick={handleOpenCropModal}
                                            className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 text-white font-bold text-[12px] opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Crop size={16} /> Sesuaikan /
                                            Pangkas Ulang
                                        </button>
                                    )}
                                </div>
                            ) : null}
                        </div>

                        {/* MODAL CROP */}
                        {cropModalOpen && tempImageSrc && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
                                <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl space-y-4">
                                    <div className="flex items-center justify-between border-b border-[#E0EAE3] pb-3">
                                        <h3 className="font-serif text-[16px] font-bold text-[#162B22] flex items-center gap-2">
                                            <Crop
                                                size={18}
                                                className="text-[#0F4C3A]"
                                            />{" "}
                                            Sesuaikan Gambar Sampul
                                        </h3>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setCropModalOpen(false)
                                            }
                                            className="text-[#777] hover:text-black"
                                        >
                                            <X size={18} />
                                        </button>
                                    </div>
                                    <div className="relative h-[320px] w-full overflow-hidden rounded-xl bg-black">
                                        <Cropper
                                            image={tempImageSrc}
                                            crop={crop}
                                            zoom={zoom}
                                            aspect={2 / 1}
                                            onCropChange={setCrop}
                                            onCropComplete={(
                                                _,
                                                croppedPixels,
                                            ) =>
                                                setCroppedAreaPixels(
                                                    croppedPixels,
                                                )
                                            }
                                            onZoomChange={setZoom}
                                        />
                                    </div>
                                    <div className="flex items-center gap-3 px-2">
                                        <ZoomIn
                                            size={16}
                                            className="text-[#777]"
                                        />
                                        <input
                                            type="range"
                                            min={1}
                                            max={3}
                                            step={0.1}
                                            value={zoom}
                                            onChange={(e) =>
                                                setZoom(Number(e.target.value))
                                            }
                                            className="w-full h-1.5 bg-[#E0EAE3] rounded-lg appearance-none cursor-pointer accent-[#0F4C3A]"
                                        />
                                    </div>
                                    <div className="flex justify-end gap-3 pt-2">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setCropModalOpen(false)
                                            }
                                            className="rounded-xl border border-[#E0EAE3] px-4 py-2 text-[13px] font-bold text-[#555] hover:bg-[#F2F7F4]"
                                        >
                                            Batal
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleSaveCrop}
                                            className="flex items-center gap-2 rounded-xl bg-[#0F4C3A] px-5 py-2 text-[13px] font-bold text-white hover:bg-[#0a382a]"
                                        >
                                            <Check size={16} /> Terapkan
                                            Potongan
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* BAGIAN TAFSIR & QUOTE (TEKS/GAMBAR) */}
                        {isTafsirCategory && (
                            <div className="space-y-4 rounded-xl border border-[#0F4C3A]/20 bg-[#F4F9F6] p-5">
                                <div className="flex items-center justify-between border-b border-[#0F4C3A]/10 pb-3 flex-wrap gap-2">
                                    <div className="flex items-center gap-2">
                                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#0F4C3A] text-[10px] text-white font-bold">
                                            ✓
                                        </span>
                                        <h4 className="text-[13px] font-bold text-[#0F4C3A]">
                                            Kutipan Tafsir Ayat
                                        </h4>
                                    </div>

                                    {/* TAB PILIHAN TEKS ATAU GAMBAR */}
                                    <div className="flex rounded-lg border border-[#E0EAE3] bg-white p-0.5 text-[11px] font-bold">
                                        <button
                                            type="button"
                                            onClick={() => setQuoteType("text")}
                                            className={`flex items-center gap-1 rounded-md px-3 py-1 transition ${quoteType === "text" ? "bg-[#0F4C3A] text-white" : "text-[#777]"}`}
                                        >
                                            <Type size={12} /> Teks Tulis
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setQuoteType("image")
                                            }
                                            className={`flex items-center gap-1 rounded-md px-3 py-1 transition ${quoteType === "image" ? "bg-[#0F4C3A] text-white" : "text-[#777]"}`}
                                        >
                                            <ImagePlus size={12} /> Upload
                                            Gambar
                                        </button>
                                    </div>
                                </div>

                                {quoteType === "text" ? (
                                    <>
                                        <div className="flex items-center justify-end mb-1 gap-2">
                                            <span className="text-[10px] font-bold text-[#555]">
                                                Font Arab:
                                            </span>
                                            <select
                                                value={arabicFont}
                                                onChange={(e) =>
                                                    setArabicFont(
                                                        e.target.value as any,
                                                    )
                                                }
                                                className="rounded-lg border border-[#E0EAE3] bg-white px-2 py-0.5 text-[11px] focus:outline-none"
                                            >
                                                {fontOptions.map((opt) => (
                                                    <option
                                                        key={opt.value}
                                                        value={opt.value}
                                                    >
                                                        {opt.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <textarea
                                            rows={2}
                                            dir="rtl"
                                            value={data.quote_arabic}
                                            onChange={(e) =>
                                                setData(
                                                    "quote_arabic",
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="إِنَّ أَكْرَمَكُمْ عِندَ اللَّهِ أَتْقَاكُمْ"
                                            className={`w-full rounded-xl border border-[#E0EAE3] bg-white px-4 py-2.5 text-[24px] leading-loose focus:border-[#0F4C3A] focus:outline-none text-right transition-all ${arabicFont}`}
                                        />
                                        <div className="grid gap-4 sm:grid-cols-2 mt-2">
                                            <div>
                                                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#555] mb-1">
                                                    Terjemahan Arti
                                                </label>
                                                <input
                                                    type="text"
                                                    value={
                                                        data.quote_translation
                                                    }
                                                    onChange={(e) =>
                                                        setData(
                                                            "quote_translation",
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="Sesungguhnya yang paling mulia..."
                                                    className="w-full rounded-xl border border-[#E0EAE3] px-4 py-2 text-[13px] focus:border-[#0F4C3A] focus:outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#555] mb-1">
                                                    Referensi Surat / Ayat
                                                </label>
                                                <input
                                                    type="text"
                                                    value={data.quote_reference}
                                                    onChange={(e) =>
                                                        setData(
                                                            "quote_reference",
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="QS. Al-Hujurat: 13"
                                                    className="w-full rounded-xl border border-[#E0EAE3] px-4 py-2 text-[13px] focus:border-[#0F4C3A] focus:outline-none"
                                                />
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="space-y-3">
                                        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#555]">
                                            Upload Gambar Kartu Quote
                                        </label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleQuoteImageSelect}
                                            className="w-full text-[13px] text-[#555] file:mr-4 file:rounded-lg file:border-0 file:bg-[#EBF1ED] file:px-4 file:py-2 file:text-[12px] file:font-bold file:text-[#0F4C3A] cursor-pointer"
                                        />
                                        {quoteImagePreview && (
                                            <img
                                                src={quoteImagePreview}
                                                alt="Preview Quote"
                                                className="mt-3 w-48 rounded-xl border border-[#E0EAE3] object-cover shadow-sm"
                                            />
                                        )}
                                        <input
                                            type="text"
                                            value={data.quote_reference}
                                            onChange={(e) =>
                                                setData(
                                                    "quote_reference",
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Nama Surat & Ayat (Opsional untuk database)"
                                            className="w-full rounded-xl border border-[#E0EAE3] mt-2 px-4 py-2 text-[13px] focus:border-[#0F4C3A] focus:outline-none"
                                        />
                                    </div>
                                )}
                            </div>
                        )}

                        <div>
                            <label className="block text-[12px] font-bold uppercase tracking-wider text-[#555] mb-2">
                                Ringkasan Singkat (Deskripsi)
                            </label>
                            <textarea
                                rows={2}
                                value={data.description}
                                onChange={(e) =>
                                    setData("description", e.target.value)
                                }
                                placeholder="Ringkasan singkat..."
                                className="w-full rounded-xl border border-[#E0EAE3] px-4 py-3 text-[14px] focus:border-[#0F4C3A] focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* BLOK EDITOR & PREVIEW */}
                    <div className="rounded-2xl border border-[#E0EAE3] bg-white shadow-sm">
                        <div className="flex overflow-hidden rounded-t-2xl border-b border-[#E0EAE3] bg-[#F9FBF9]">
                            <button
                                type="button"
                                onClick={() => setViewMode("edit")}
                                className={`flex-1 py-4 text-[13px] font-bold transition-colors ${viewMode === "edit" ? "border-t-[3px] border-[#0F4C3A] bg-white text-[#0F4C3A]" : "text-[#777] hover:bg-[#F2F7F4]"}`}
                            >
                                <Edit3 size={16} className="mr-2 inline" /> Mode
                                Menulis
                            </button>
                            <button
                                type="button"
                                onClick={() => setViewMode("preview")}
                                className={`flex-1 py-4 text-[13px] font-bold transition-colors ${viewMode === "preview" ? "border-t-[3px] border-[#0F4C3A] bg-white text-[#0F4C3A]" : "text-[#777] hover:bg-[#F2F7F4]"}`}
                            >
                                <Eye size={16} className="mr-2 inline" />{" "}
                                Pratinjau Website Asli
                            </button>
                        </div>

                        <div
                            className={`${viewMode === "edit" ? "block" : "hidden"} quill-wrapper relative rounded-b-2xl bg-[#F2F7F4] p-6 sm:p-12`}
                        >
                            <div className="mx-auto max-w-[800px] relative rounded-b-2xl rounded-t-none border border-[#E0EAE3] bg-white shadow-sm">
                                <ReactQuill
                                    theme="snow"
                                    value={data.content}
                                    onChange={(content) =>
                                        setData("content", content)
                                    }
                                    modules={quillModules}
                                    className="rounded-lg bg-white"
                                    placeholder="Mulai menulis artikel di sini... (Pilih font Arab di toolbar jika ingin teks Arab)"
                                />
                            </div>
                        </div>

                        <div
                            className={`${viewMode === "preview" ? "block" : "hidden"} rounded-b-2xl bg-[#F2F7F4] p-6 sm:p-12`}
                        >
                            <div className="mx-auto max-w-[800px] rounded-2xl border border-[#E0EAE3] bg-white p-10 shadow-sm">
                                <h1 className="mb-4 font-serif text-[28px] font-bold leading-tight text-[#162B22] sm:text-[36px]">
                                    {data.title ||
                                        "Judul Artikel Akan Tampil Di Sini"}
                                </h1>

                                {imageSourceType === "youtube" && ytId ? (
                                    <div className="mb-8 aspect-video w-full overflow-hidden rounded-xl bg-black">
                                        <iframe
                                            src={`https://www.youtube.com/embed/${ytId}`}
                                            className="h-full w-full border-0"
                                            allowFullScreen
                                        ></iframe>
                                    </div>
                                ) : (
                                    imagePreview && (
                                        <div className="mb-8 aspect-[2/1] w-full overflow-hidden rounded-xl bg-[#f0eee9]">
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                    )
                                )}

                                {isTafsirCategory &&
                                    quoteType === "text" &&
                                    data.quote_arabic && (
                                        <div className="mb-8 rounded-xl border-l-4 border-[#0F4C3A] bg-[#F4F9F6] p-6 text-center">
                                            <p
                                                className={`mb-3 text-[26px] leading-loose text-[#0F4C3A] ${arabicFont}`}
                                                dir="rtl"
                                            >
                                                {data.quote_arabic}
                                            </p>
                                            <p className="mb-1 text-[13px] italic text-[#555]">
                                                "{data.quote_translation}"
                                            </p>
                                            <span className="text-[11px] font-bold uppercase tracking-wider text-[#0F4C3A]">
                                                {data.quote_reference}
                                            </span>
                                        </div>
                                    )}
                                {isTafsirCategory &&
                                    quoteType === "image" &&
                                    quoteImagePreview && (
                                        <div className="mb-8 rounded-xl bg-[#F4F9F6] p-4 text-center">
                                            <img
                                                src={quoteImagePreview}
                                                className="mx-auto rounded-xl shadow-sm object-cover max-h-80"
                                                alt="Preview Quote Gambar"
                                            />
                                        </div>
                                    )}

                                <div
                                    className="prose prose-sm sm:prose-base lg:prose-lg max-w-none text-[#333]"
                                    dangerouslySetInnerHTML={{
                                        __html: data.content
                                            ? data.content
                                                  .replace(/&nbsp;/g, " ")
                                                  .replace(/\u00a0/g, " ")
                                            : "",
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </form>
            </main>

            <style
                dangerouslySetInnerHTML={{
                    __html: `
                .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="adobe-naskh"]::before,
                .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="adobe-naskh"]::before { content: "Adobe Naskh" !important; font-family: 'Adobe Naskh', serif; }
                .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="al-jazeera"]::before,
                .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="al-jazeera"]::before { content: "Al Jazeera" !important; font-family: 'Al Jazeera', sans-serif; }
                .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="serif"]::before,
                .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="serif"]::before { content: "Serif" !important; }
                .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="monospace"]::before,
                .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="monospace"]::before { content: "Monospace" !important; }

                .quill-wrapper .ql-toolbar.ql-snow {
                    position: sticky; top: 73px; z-index: 20; background-color: #F9FBF9 !important;
                    border: 1px solid #E0EAE3 !important; border-bottom: 1px solid #E0EAE3 !important;
                    border-top-left-radius: 1rem; border-top-right-radius: 1rem;
                    padding: 12px 24px !important; max-width: 800px; margin: 0 auto;
                }
                .quill-wrapper .ql-container.ql-snow { border: none !important; font-family: inherit !important; font-size: 16px !important; }
                .quill-wrapper .ql-editor { min-height: 500px; padding: 40px !important; line-height: 1.8; color: #333; }
                
                .quill-wrapper .ql-editor [dir="rtl"], .prose [dir="rtl"], .prose p[dir="rtl"] {
                    font-family: 'Amiri', 'Traditional Arabic', 'Adobe Naskh', serif !important;
                    font-size: 26px !important; color: #0F4C3A !important; line-height: 2.2 !important;
                    text-align: right !important; letter-spacing: normal !important;
                }
            `,
                }}
            />
        </div>
    );
}
