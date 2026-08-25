import React, { useState, useEffect, useMemo, useRef } from "react";
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
    ImagePlus,
    Palette,
} from "lucide-react";
import { FaYoutube } from "react-icons/fa";
import { Category } from "@/types";
import ReactQuill, { Quill } from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import Cropper from "react-easy-crop";
import getCroppedImg from "@/Utils/cropImage";

// 1. Whitelist Font Quill
const FontStyle = Quill.import("attributors/style/font") as any;
FontStyle.whitelist = [
    "helvetica",
    "times",
    "amiri",
    "tajawal",
    "cairo",
    "almarai",
    "scheherazade",
    "adobe-naskh",
    "al-jazeera",
];
Quill.register(FontStyle, true);

// 2. Whitelist Ukuran Font Quill (Pixel)
const SizeStyle = Quill.import("attributors/style/size") as any;
SizeStyle.whitelist = [
    "12px",
    "14px",
    "16px",
    "18px",
    "20px",
    "24px",
    "28px",
    "32px",
    "36px",
    "46px",
];
Quill.register(SizeStyle, true);

// 3. Daftarkan Attributor Line Height (Spasi Baris)
const Parchment = Quill.import("parchment") as any;
const LineHeightStyle = new Parchment.StyleAttributor(
    "lineHeight",
    "line-height",
    {
        scope: Parchment.Scope ? Parchment.Scope.BLOCK : 3,
        whitelist: ["1.2", "1.5", "1.8", "2.0", "2.4", "2.8", "3.2"],
    },
);
Quill.register(LineHeightStyle, true);

// Daftarkan Direction Attributor untuk RTL & Align
const DirectionStyle = Quill.import("attributors/style/direction") as any;
Quill.register(DirectionStyle, true);

const AlignStyle = Quill.import("attributors/style/align") as any;
Quill.register(AlignStyle, true);

// Pilihan Font Arab untuk Quote (Class Helper)
const ARABIC_FONTS = [
    { label: "Adobe Naskh", value: "font-adobe-naskh" },
    { label: "Al Jazeera", value: "font-al-jazeera" },
    { label: "Amiri (Standar Mushaf)", value: "font-amiri" },
    { label: "Scheherazade New", value: "font-scheherazade" },
    { label: "Cairo", value: "font-cairo" },
    { label: "Tajawal", value: "font-tajawal" },
    { label: "Almarai", value: "font-almarai" },
];

// Helper Deteksi YouTube ID
const getYouTubeId = (url: string | null | undefined) => {
    if (!url) return null;
    const regExp =
        /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
};

interface CreateProps {
    categories: Category[];
}

export default function ArticleCreate({ categories }: CreateProps) {
    const quillRef = useRef<any>(null);
    const lastSelectedFontRef = useRef<string | null>(null);

    // State Tampilan & Sumber Data
    const [imageSourceType, setImageSourceType] = useState<
        "file" | "url" | "youtube"
    >("file");
    const [quoteType, setQuoteType] = useState<"text" | "image" | "youtube">(
        "text",
    );

    const [viewMode, setViewMode] = useState<"edit" | "preview">("edit");
    const [tempImageSrc, setTempImageSrc] = useState<string | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [quoteImagePreview, setQuoteImagePreview] = useState<string | null>(
        null,
    );

    // Cropper State
    const [cropModalOpen, setCropModalOpen] = useState(false);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

    // Form Inertia State
    const { data, setData, post, processing, transform, errors } = useForm({
        title: "",
        category_id: categories[0]?.id || "",
        image_file: null as File | null,
        image_url: "",
        description: "",
        content: "",
        is_published: true,
        quote_type: "text" as "text" | "image" | "youtube",
        quote_arabic: "",
        quote_translation: "",
        quote_reference: "",
        quote_font: "font-adobe-naskh",
        quote_font_size: 36,
        quote_color: "#1D4533",
        quote_image: null as File | null,
        quote_youtube_url: "",
    });

    const selectedCategory = categories.find(
        (c) => c.id === Number(data.category_id),
    );
    const isTafsirCategory = selectedCategory?.name
        ?.toLowerCase()
        .includes("tafsir");

    // Otomatisasi font berikutnya saat baris baru / enter
    const handleChangeSelection = (range: any, source: string, editor: any) => {
        if (range && source === "user") {
            try {
                const format = editor.getFormat(range);
                if (format && format.font) {
                    lastSelectedFontRef.current = format.font;
                } else if (
                    lastSelectedFontRef.current &&
                    format &&
                    !format.font
                ) {
                    editor.format("font", lastSelectedFontRef.current);
                }
            } catch (err) {
                // Ignore transisi range
            }
        }
    };

    transform((curr) => ({
        ...curr,
        content: curr.content
            ? curr.content.replace(/&nbsp;|\u00a0/g, " ")
            : "",
        description: curr.description
            ? curr.description.replace(/&nbsp;|\u00a0/g, " ")
            : "",
        quote_type: quoteType,
        quote_font: data.quote_font,
        quote_font_size: Number(data.quote_font_size),
        quote_color: data.quote_color,
    }));

    // Preview Sinkronisasi Sampul Artikel
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
        } else {
            setImagePreview(null);
        }
    }, [data.image_file, data.image_url, imageSourceType]);

    // Preview Sinkronisasi Quote Gambar
    useEffect(() => {
        if (quoteType === "image" && data.quote_image) {
            const objectUrl = URL.createObjectURL(data.quote_image);
            setQuoteImagePreview(objectUrl);
            return () => URL.revokeObjectURL(objectUrl);
        } else {
            setQuoteImagePreview(null);
        }
    }, [data.quote_image, quoteType]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            if (file.size > 2 * 1024 * 1024) {
                alert("Ukuran gambar terlalu besar! Maksimal 2 MB.");
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
                alert("Ukuran gambar terlalu besar! Maksimal 2 MB.");
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

    // Toolbar Quill Editor dengan Spasi (Line Height)
    const quillModules = useMemo(
        () => ({
            toolbar: [
                [{ font: FontStyle.whitelist }],
                [{ size: SizeStyle.whitelist }],
                [
                    {
                        lineHeight: [
                            "1.2",
                            "1.5",
                            "1.8",
                            "2.0",
                            "2.4",
                            "2.8",
                            "3.2",
                        ],
                    },
                ],
                ["bold", "italic", "underline", "strike"],
                [{ color: [] }, { background: [] }],
                [{ align: [] }, { direction: "rtl" }],
                [{ list: "ordered" }, { list: "bullet" }],
                ["blockquote", "link"],
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
                                        /&nbsp;|\u00a0/g,
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

        const strippedContent = data.content.replace(/<[^>]*>?/gm, "").trim();
        if (!strippedContent) {
            alert("Mohon isi naskah artikel kajian terlebih dahulu!");
            return;
        }

        post("/admin/articles", {
            forceFormData: true,
        });
    };

    const ytId =
        imageSourceType === "youtube" ? getYouTubeId(data.image_url) : null;

    const quoteYtId =
        quoteType === "youtube" ? getYouTubeId(data.quote_youtube_url) : null;

    return (
        <div className="min-h-screen bg-[#F7EAE0] text-[#5E3122] selection:bg-[#1D4533] selection:text-[#F7EAE0] pb-16">
            <Head title="Tulis Artikel - Abu Haidar" />

            {/* HEADER */}
            <header className="sticky top-0 z-30 border-b border-[#F9D2BA] bg-[#F7EAE0]/95 backdrop-blur-md shadow-xs">
                <div className="mx-auto flex max-w-[1000px] items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4">
                    <div className="flex items-center gap-3 min-w-0">
                        <Link
                            href="/admin/articles"
                            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#F9D2BA] bg-white text-[#5E3122] transition hover:bg-[#F9D2BA]/30 shrink-0"
                            aria-label="Kembali"
                        >
                            <ArrowLeft size={18} />
                        </Link>
                        <h1 className="font-brand text-[16px] sm:text-[18px] font-bold text-[#1D4533] truncate max-w-sm">
                            Editor Artikel Dakwah
                        </h1>
                    </div>

                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={processing}
                        className="flex items-center gap-1.5 rounded-full bg-[#1D4533] px-4 sm:px-5 py-2 text-[12px] sm:text-[13px] font-bold text-[#F7EAE0] shadow-xs transition hover:bg-[#143325] disabled:opacity-50 cursor-pointer"
                    >
                        <Save size={15} /> <span>Simpan & Publikasikan</span>
                    </button>
                </div>
            </header>

            <main className="mx-auto max-w-[900px] px-4 sm:px-6 py-6 sm:py-8">
                <form
                    onSubmit={handleSubmit}
                    className="space-y-6"
                    encType="multipart/form-data"
                >
                    <div className="rounded-2xl border border-[#F9D2BA] bg-white p-5 sm:p-8 shadow-xs space-y-5">
                        {/* Judul Artikel */}
                        <div>
                            <label className="block text-[12px] font-bold uppercase tracking-wider font-brand text-[#5E3122] mb-1.5">
                                Judul Artikel
                            </label>
                            <input
                                type="text"
                                value={data.title}
                                onChange={(e) =>
                                    setData("title", e.target.value)
                                }
                                placeholder="Ketik judul kajian di sini..."
                                className="w-full rounded-xl border border-[#F9D2BA] bg-[#FDFBF9] px-4 py-2.5 sm:py-3 text-[15px] sm:text-[16px] font-brand font-bold text-[#1D4533] focus:border-[#1D4533] focus:bg-white focus:outline-none"
                            />
                            {errors.title && (
                                <p className="mt-1 text-[11px] font-bold text-red-600">
                                    {errors.title}
                                </p>
                            )}
                        </div>

                        {/* Kategori */}
                        <div>
                            <label className="block text-[12px] font-bold uppercase tracking-wider font-brand text-[#5E3122] mb-1.5">
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
                                className="w-full rounded-xl border border-[#F9D2BA] bg-[#FDFBF9] px-4 py-2.5 sm:py-3 text-[13px] sm:text-[14px] text-[#5E3122] focus:border-[#1D4533] focus:bg-white focus:outline-none"
                            >
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                            {errors.category_id && (
                                <p className="mt-1 text-[11px] font-bold text-red-600">
                                    {errors.category_id}
                                </p>
                            )}
                        </div>

                        {/* Gambar / Video Sampul */}
                        <div className="space-y-3 rounded-xl border border-[#F9D2BA] bg-[#FDFBF9] p-4">
                            <div className="flex items-center justify-between flex-wrap gap-2">
                                <label className="text-[12px] font-bold uppercase tracking-wider font-brand text-[#5E3122] flex items-center gap-2">
                                    <ImageIcon
                                        size={16}
                                        className="text-[#1D4533]"
                                    />{" "}
                                    Gambar / Video Sampul
                                </label>
                                <div className="flex rounded-lg border border-[#F9D2BA] bg-white p-0.5 text-[11px] font-bold">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setImageSourceType("file")
                                        }
                                        className={`flex items-center gap-1 rounded-md px-3 py-1.5 transition ${
                                            imageSourceType === "file"
                                                ? "bg-[#1D4533] text-[#F7EAE0]"
                                                : "text-[#5E3122]/70"
                                        }`}
                                    >
                                        <Upload size={12} /> Upload
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setImageSourceType("url")
                                        }
                                        className={`flex items-center gap-1 rounded-md px-3 py-1.5 transition ${
                                            imageSourceType === "url"
                                                ? "bg-[#1D4533] text-[#F7EAE0]"
                                                : "text-[#5E3122]/70"
                                        }`}
                                    >
                                        <Link2 size={12} /> Tautan
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setImageSourceType("youtube")
                                        }
                                        className={`flex items-center gap-1 rounded-md px-3 py-1.5 transition ${
                                            imageSourceType === "youtube"
                                                ? "bg-red-600 text-white"
                                                : "text-[#5E3122]/70"
                                        }`}
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
                                        className="w-full text-[13px] text-[#5E3122] file:mr-4 file:rounded-lg file:border-0 file:bg-[#F9D2BA]/40 file:px-4 file:py-2 file:text-[12px] file:font-bold file:text-[#1D4533] hover:file:bg-[#F9D2BA]/60 cursor-pointer"
                                    />
                                    <p className="mt-1 text-[11px] text-[#5E3122]/60">
                                        Maksimal ukuran gambar 2 MB.
                                    </p>
                                </div>
                            ) : (
                                <input
                                    type="url"
                                    value={data.image_url}
                                    onChange={(e) =>
                                        setData("image_url", e.target.value)
                                    }
                                    placeholder={
                                        imageSourceType === "youtube"
                                            ? "Contoh: https://www.youtube.com/watch?v=..."
                                            : "https://domain.com/gambar-artikel.jpg"
                                    }
                                    className={`w-full rounded-xl border border-[#F9D2BA] bg-white px-4 py-2.5 text-[13px] text-[#5E3122] focus:outline-none ${
                                        imageSourceType === "youtube"
                                            ? "focus:border-red-600"
                                            : "focus:border-[#1D4533]"
                                    }`}
                                />
                            )}

                            {/* Preview Sampul */}
                            {imageSourceType === "youtube" && ytId ? (
                                <div className="mt-3 aspect-video w-full max-w-md overflow-hidden rounded-xl bg-black">
                                    <iframe
                                        src={`https://www.youtube.com/embed/${ytId}`}
                                        className="h-full w-full border-0"
                                        allowFullScreen
                                    />
                                </div>
                            ) : imageSourceType !== "youtube" &&
                              imagePreview ? (
                                <div className="mt-3 relative h-44 w-full max-w-sm overflow-hidden rounded-xl border border-[#F9D2BA] group bg-[#F7EAE0]">
                                    <img
                                        src={imagePreview}
                                        alt="Thumbnail Preview"
                                        className="h-full w-full object-cover"
                                    />
                                    {imageSourceType === "file" && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setCropModalOpen(true)
                                            }
                                            className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 text-white font-bold text-[12px] opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Crop size={16} /> Sesuaikan /
                                            Pangkas Ulang
                                        </button>
                                    )}
                                </div>
                            ) : null}
                        </div>

                        {/* Modal Cropper */}
                        {cropModalOpen && tempImageSrc && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
                                <div className="w-full max-w-2xl rounded-2xl bg-white p-5 sm:p-6 shadow-2xl space-y-4">
                                    <div className="flex items-center justify-between border-b border-[#F9D2BA] pb-3">
                                        <h3 className="font-brand text-[16px] font-bold text-[#1D4533] flex items-center gap-2">
                                            <Crop
                                                size={18}
                                                className="text-[#1D4533]"
                                            />{" "}
                                            Sesuaikan Gambar Sampul
                                        </h3>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setCropModalOpen(false)
                                            }
                                            className="text-[#5E3122]/60 hover:text-black"
                                        >
                                            <X size={18} />
                                        </button>
                                    </div>
                                    <div className="relative h-[280px] sm:h-[320px] w-full overflow-hidden rounded-xl bg-black">
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
                                            className="text-[#5E3122]/60"
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
                                            className="w-full h-1.5 bg-[#F9D2BA] rounded-lg appearance-none cursor-pointer accent-[#1D4533]"
                                        />
                                    </div>
                                    <div className="flex justify-end gap-2.5 pt-2">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setCropModalOpen(false)
                                            }
                                            className="rounded-xl border border-[#F9D2BA] px-4 py-2 text-[12px] sm:text-[13px] font-bold text-[#5E3122] hover:bg-[#F9D2BA]/30"
                                        >
                                            Batal
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleSaveCrop}
                                            className="flex items-center gap-1.5 rounded-xl bg-[#1D4533] px-5 py-2 text-[12px] sm:text-[13px] font-bold text-[#F7EAE0] hover:bg-[#143325]"
                                        >
                                            <Check size={16} /> Terapkan
                                            Potongan
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* BAGIAN TAFSIR & QUOTE (3 TAB: TEKS / GAMBAR / YOUTUBE) */}
                        {isTafsirCategory && (
                            <div className="space-y-4 rounded-xl border border-[#F9D2BA] bg-[#FDFBF9] p-4 sm:p-5">
                                <div className="flex items-center justify-between border-b border-[#F9D2BA] pb-3 flex-wrap gap-2">
                                    <h4 className="text-[13px] font-bold font-brand text-[#1D4533] flex items-center gap-2">
                                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#1D4533] text-[10px] text-[#F7EAE0]">
                                            ✓
                                        </span>
                                        Kutipan / Media Tafsir Ayat
                                    </h4>

                                    <div className="flex rounded-lg border border-[#F9D2BA] bg-white p-0.5 text-[11px] font-bold">
                                        <button
                                            type="button"
                                            onClick={() => setQuoteType("text")}
                                            className={`flex items-center gap-1 rounded-md px-3 py-1 transition ${
                                                quoteType === "text"
                                                    ? "bg-[#1D4533] text-[#F7EAE0]"
                                                    : "text-[#5E3122]/70"
                                            }`}
                                        >
                                            <Type size={12} /> Teks
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setQuoteType("image")
                                            }
                                            className={`flex items-center gap-1 rounded-md px-3 py-1 transition ${
                                                quoteType === "image"
                                                    ? "bg-[#1D4533] text-[#F7EAE0]"
                                                    : "text-[#5E3122]/70"
                                            }`}
                                        >
                                            <ImagePlus size={12} /> Gambar
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setQuoteType("youtube")
                                            }
                                            className={`flex items-center gap-1 rounded-md px-3 py-1 transition ${
                                                quoteType === "youtube"
                                                    ? "bg-red-600 text-white"
                                                    : "text-[#5E3122]/70"
                                            }`}
                                        >
                                            <FaYoutube size={13} /> YouTube
                                        </button>
                                    </div>
                                </div>

                                {/* 1. OPSI TEKS */}
                                {quoteType === "text" && (
                                    <>
                                        {/* Kustomisasi Font, Warna, & Ukuran */}
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 rounded-xl border border-[#F9D2BA] bg-white p-3">
                                            {/* Pilihan Font Arab */}
                                            <div>
                                                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5E3122] mb-1">
                                                    Jenis Font Arab
                                                </label>
                                                <select
                                                    value={data.quote_font}
                                                    onChange={(e) =>
                                                        setData(
                                                            "quote_font",
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="w-full rounded-lg border border-[#F9D2BA] bg-[#FDFBF9] px-2.5 py-1.5 text-[12px] text-[#5E3122] focus:border-[#1D4533] focus:outline-none"
                                                >
                                                    {ARABIC_FONTS.map(
                                                        (font) => (
                                                            <option
                                                                key={font.value}
                                                                value={
                                                                    font.value
                                                                }
                                                            >
                                                                {font.label}
                                                            </option>
                                                        ),
                                                    )}
                                                </select>
                                            </div>

                                            {/* Pilihan Warna Teks */}
                                            <div>
                                                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5E3122] mb-1 flex items-center gap-1">
                                                    <Palette size={12} /> Warna
                                                    Teks
                                                </label>
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="color"
                                                        value={data.quote_color}
                                                        onChange={(e) =>
                                                            setData(
                                                                "quote_color",
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="h-8 w-10 cursor-pointer rounded-md border border-[#F9D2BA] bg-white p-0.5"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={data.quote_color}
                                                        onChange={(e) =>
                                                            setData(
                                                                "quote_color",
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="w-full rounded-lg border border-[#F9D2BA] bg-[#FDFBF9] px-2.5 py-1.5 text-[12px] font-mono text-[#5E3122] uppercase focus:border-[#1D4533] focus:outline-none"
                                                    />
                                                </div>
                                            </div>

                                            {/* Slider Ukuran Font */}
                                            <div>
                                                <div className="flex items-center justify-between mb-1">
                                                    <label className="text-[11px] font-bold uppercase tracking-wider text-[#5E3122]">
                                                        Ukuran Font
                                                    </label>
                                                    <span className="text-[11px] font-bold text-[#1D4533]">
                                                        {data.quote_font_size}px
                                                    </span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min={18}
                                                    max={48}
                                                    step={1}
                                                    value={data.quote_font_size}
                                                    onChange={(e) =>
                                                        setData(
                                                            "quote_font_size",
                                                            Number(
                                                                e.target.value,
                                                            ),
                                                        )
                                                    }
                                                    className="w-full h-1.5 mt-2 bg-[#F9D2BA] rounded-lg appearance-none cursor-pointer accent-[#1D4533]"
                                                />
                                            </div>
                                        </div>

                                        {/* Textarea Input Ayat Arab */}
                                        <textarea
                                            rows={3}
                                            dir="rtl"
                                            value={data.quote_arabic}
                                            onChange={(e) =>
                                                setData(
                                                    "quote_arabic",
                                                    e.target.value,
                                                )
                                            }
                                            style={{
                                                fontSize: `${data.quote_font_size}px`,
                                                color: data.quote_color,
                                                lineHeight: 2.6,
                                            }}
                                            placeholder="إِنَّ أَكْرَمَكُمْ عِندَ اللَّهِ أَتْقَاكُمْ"
                                            className={`${data.quote_font} w-full rounded-xl border border-[#F9D2BA] bg-white px-5 py-4 focus:border-[#1D4533] focus:outline-none text-right transition-all tracking-normal`}
                                        />

                                        <div className="grid gap-3 sm:grid-cols-2 mt-2">
                                            <div>
                                                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5E3122] mb-1">
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
                                                    className="w-full rounded-xl border border-[#F9D2BA] bg-white px-4 py-2 text-[13px] text-[#5E3122] focus:border-[#1D4533] focus:outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5E3122] mb-1">
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
                                                    className="w-full rounded-xl border border-[#F9D2BA] bg-white px-4 py-2 text-[13px] text-[#5E3122] focus:border-[#1D4533] focus:outline-none"
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* 2. OPSI GAMBAR */}
                                {quoteType === "image" && (
                                    <div className="space-y-3">
                                        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5E3122]">
                                            Upload Gambar Kartu Quote
                                        </label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleQuoteImageSelect}
                                            className="w-full text-[13px] text-[#5E3122] file:mr-4 file:rounded-lg file:border-0 file:bg-[#F9D2BA]/40 file:px-4 file:py-2 file:text-[12px] file:font-bold file:text-[#1D4533] cursor-pointer"
                                        />
                                        <p className="mt-1 text-[11px] text-[#5E3122]/60">
                                            Maksimal ukuran gambar 2 MB.
                                        </p>
                                        {quoteImagePreview && (
                                            <img
                                                src={quoteImagePreview}
                                                alt="Preview Quote"
                                                className="mt-2 w-48 rounded-xl border border-[#F9D2BA] object-cover shadow-xs"
                                            />
                                        )}
                                    </div>
                                )}

                                {/* 3. OPSI VIDEO YOUTUBE */}
                                {quoteType === "youtube" && (
                                    <div className="space-y-3">
                                        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5E3122]">
                                            Tautan Video Kajian / Ayat (YouTube)
                                        </label>
                                        <input
                                            type="url"
                                            value={data.quote_youtube_url}
                                            onChange={(e) =>
                                                setData(
                                                    "quote_youtube_url",
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Contoh: https://www.youtube.com/watch?v=..."
                                            className="w-full rounded-xl border border-[#F9D2BA] bg-white px-4 py-2.5 text-[13px] text-[#5E3122] focus:border-red-600 focus:outline-none"
                                        />
                                        {quoteYtId && (
                                            <div className="mt-2 aspect-video w-full max-w-sm overflow-hidden rounded-xl bg-black">
                                                <iframe
                                                    src={`https://www.youtube.com/embed/${quoteYtId}`}
                                                    className="h-full w-full border-0"
                                                    allowFullScreen
                                                />
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Ringkasan Singkat */}
                        <div>
                            <label className="block text-[12px] font-bold uppercase tracking-wider font-brand text-[#5E3122] mb-1.5">
                                Ringkasan Singkat (Deskripsi)
                            </label>
                            <textarea
                                rows={2}
                                value={data.description}
                                onChange={(e) =>
                                    setData("description", e.target.value)
                                }
                                placeholder="Ringkasan singkat artikel..."
                                className="w-full rounded-xl border border-[#F9D2BA] bg-[#FDFBF9] px-4 py-2.5 text-[14px] text-[#5E3122] focus:border-[#1D4533] focus:bg-white focus:outline-none"
                            />
                            {errors.description && (
                                <p className="mt-1 text-[11px] font-bold text-red-600">
                                    {errors.description}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* BLOK EDITOR & PREVIEW */}
                    <div className="rounded-2xl border border-[#F9D2BA] bg-white shadow-xs">
                        <div className="flex overflow-hidden rounded-t-2xl border-b border-[#F9D2BA] bg-[#FDFBF9]">
                            <button
                                type="button"
                                onClick={() => setViewMode("edit")}
                                className={`flex-1 py-3.5 sm:py-4 text-[13px] font-bold font-brand transition-colors cursor-pointer ${
                                    viewMode === "edit"
                                        ? "border-t-[3px] border-[#1D4533] bg-white text-[#1D4533]"
                                        : "text-[#5E3122]/70 hover:bg-[#F9D2BA]/20"
                                }`}
                            >
                                <Edit3 size={16} className="mr-2 inline" /> Mode
                                Menulis
                            </button>
                            <button
                                type="button"
                                onClick={() => setViewMode("preview")}
                                className={`flex-1 py-3.5 sm:py-4 text-[13px] font-bold font-brand transition-colors cursor-pointer ${
                                    viewMode === "preview"
                                        ? "border-t-[3px] border-[#1D4533] bg-white text-[#1D4533]"
                                        : "text-[#5E3122]/70 hover:bg-[#F9D2BA]/20"
                                }`}
                            >
                                <Eye size={16} className="mr-2 inline" />{" "}
                                Pratinjau Website Asli
                            </button>
                        </div>

                        {/* Mode Menulis */}
                        <div
                            className={`${
                                viewMode === "edit" ? "block" : "hidden"
                            } quill-wrapper relative rounded-b-2xl bg-[#F7EAE0] p-4 sm:p-8 lg:p-12`}
                        >
                            <div className="mx-auto max-w-[800px] relative rounded-b-2xl rounded-t-none border border-[#F9D2BA] bg-white shadow-xs">
                                <ReactQuill
                                    ref={quillRef}
                                    theme="snow"
                                    value={data.content}
                                    onChange={(content) =>
                                        setData("content", content)
                                    }
                                    onChangeSelection={handleChangeSelection}
                                    modules={quillModules}
                                    className="rounded-lg bg-white"
                                    placeholder="Mulai menulis artikel atau naskah kajian di sini..."
                                />
                                {errors.content && (
                                    <div className="p-3 bg-red-50 border-t border-red-200 text-red-600 font-bold text-[12px] flex items-center gap-2">
                                        <X size={15} /> {errors.content}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Mode Pratinjau */}
                        <div
                            className={`${
                                viewMode === "preview" ? "block" : "hidden"
                            } rounded-b-2xl bg-[#F7EAE0] p-4 sm:p-8 lg:p-12`}
                        >
                            <div className="mx-auto max-w-[800px] rounded-2xl border border-[#F9D2BA] bg-white p-6 sm:p-10 shadow-xs">
                                <h1 className="mb-4 font-brand text-[24px] sm:text-[32px] md:text-[36px] font-bold leading-tight text-[#1D4533]">
                                    {data.title ||
                                        "Judul Artikel Akan Tampil Di Sini"}
                                </h1>

                                {imageSourceType === "youtube" && ytId ? (
                                    <div className="mb-8 aspect-video w-full overflow-hidden rounded-xl bg-black">
                                        <iframe
                                            src={`https://www.youtube.com/embed/${ytId}`}
                                            className="h-full w-full border-0"
                                            allowFullScreen
                                        />
                                    </div>
                                ) : (
                                    imagePreview && (
                                        <div className="mb-8 aspect-[2/1] w-full overflow-hidden rounded-xl bg-[#F7EAE0]">
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
                                        <div className="mb-8 rounded-xl border-l-4 border-[#1D4533] bg-[#F9D2BA]/20 p-6 text-center">
                                            <p
                                                className={`${data.quote_font} mb-3 leading-loose`}
                                                style={{
                                                    fontSize: `${data.quote_font_size}px`,
                                                    color: data.quote_color,
                                                    lineHeight: 2.5,
                                                }}
                                                dir="rtl"
                                            >
                                                {data.quote_arabic}
                                            </p>
                                            <p className="mb-1 text-[13px] italic text-[#5E3122]">
                                                "{data.quote_translation}"
                                            </p>
                                            <span className="text-[11px] font-bold uppercase tracking-wider text-[#1D4533]">
                                                {data.quote_reference}
                                            </span>
                                        </div>
                                    )}

                                {isTafsirCategory &&
                                    quoteType === "image" &&
                                    quoteImagePreview && (
                                        <div className="mb-8 rounded-xl bg-[#F9D2BA]/20 p-4 text-center">
                                            <img
                                                src={quoteImagePreview}
                                                className="mx-auto rounded-xl shadow-xs object-cover max-h-80"
                                                alt="Preview Quote Gambar"
                                            />
                                        </div>
                                    )}

                                {isTafsirCategory &&
                                    quoteType === "youtube" &&
                                    quoteYtId && (
                                        <div className="mb-8 overflow-hidden rounded-xl bg-[#F9D2BA]/20 p-4 text-center">
                                            <div className="mx-auto aspect-video w-full max-w-lg overflow-hidden rounded-xl bg-black shadow-sm">
                                                <iframe
                                                    src={`https://www.youtube.com/embed/${quoteYtId}`}
                                                    className="h-full w-full border-0"
                                                    allowFullScreen
                                                />
                                            </div>
                                        </div>
                                    )}

                                <div
                                    className="prose prose-sm sm:prose-base lg:prose-lg max-w-none text-[#5E3122]"
                                    dangerouslySetInnerHTML={{
                                        __html: data.content
                                            ? data.content.replace(
                                                  /&nbsp;|\u00a0/g,
                                                  " ",
                                              )
                                            : "",
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </form>
            </main>
        </div>
    );
}
