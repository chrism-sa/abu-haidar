import React, { useState, useEffect, useMemo, useRef } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import ImageCropperModal from "@/Components/ImageCropperModal";
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
    AlignVerticalSpaceAround,
    AlertCircle,
    Bold,
    Italic,
    Underline,
    Strikethrough,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
    List,
    ListOrdered,
    Quote as QuoteIcon,
    RotateCcw,
    Highlighter,
    Video,
} from "lucide-react";
import { FaYoutube } from "react-icons/fa";
import { Category } from "@/types";
import ReactQuill, { Quill } from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import Cropper from "react-easy-crop";
import getCroppedImg from "@/Utils/cropImage";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
// =========================================================================
// 1. REGISTRASI ATTRIBUTOR QUILL LENGKAP
// =========================================================================

// A. Font Family
const FontAttributor = Quill.import("attributors/class/font") as any;
FontAttributor.whitelist = [
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
Quill.register(FontAttributor, true);

const ARABIC_FONTS = [
    { label: "Adobe Naskh", value: "font-adobe-naskh" },
    { label: "Al Jazeera", value: "font-al-jazeera" },
    { label: "Amiri (Standar Mushaf)", value: "font-amiri" },
    { label: "Scheherazade New", value: "font-scheherazade" },
    { label: "Cairo", value: "font-cairo" },
    { label: "Tajawal", value: "font-tajawal" },
    { label: "Almarai", value: "font-almarai" },
];
// B. Font Size (10px s.d. 64px)
const SizeStyle = Quill.import("attributors/style/size") as any;
SizeStyle.whitelist = [
    "10px",
    "11px",
    "12px",
    "13px",
    "14px",
    "15px",
    "16px",
    "18px",
    "20px",
    "22px",
    "24px",
    "28px",
    "32px",
    "36px",
    "42px",
    "48px",
    "56px",
    "64px",
];
Quill.register(SizeStyle, true);

// C. Parchment Custom (Line Height & Letter Spacing)
const Parchment = Quill.import("parchment") as any;

const LineHeightStyle = new Parchment.StyleAttributor(
    "lineHeight",
    "line-height",
    {
        scope: Parchment.Scope ? Parchment.Scope.BLOCK : 3,
        whitelist: [
            "0.8",
            "1.0",
            "1.2",
            "1.4",
            "1.6",
            "1.8",
            "2.0",
            "2.4",
            "2.8",
            "3.2",
            "3.5",
        ],
    },
);
Quill.register(LineHeightStyle, true);

const LetterSpacingStyle = new Parchment.StyleAttributor(
    "letterSpacing",
    "letter-spacing",
    {
        scope: Parchment.Scope ? Parchment.Scope.INLINE : 1,
        whitelist: ["-0.5px", "0px", "0.5px", "1px", "1.5px", "2px", "3px"],
    },
);
Quill.register(LetterSpacingStyle, true);

const DirectionStyle = Quill.import("attributors/style/direction") as any;
Quill.register(DirectionStyle, true);

const AlignStyle = Quill.import("attributors/style/align") as any;
Quill.register(AlignStyle, true);

const ColorStyle = Quill.import("attributors/style/color") as any;
Quill.register(ColorStyle, true);

const BackgroundStyle = Quill.import("attributors/style/background") as any;
Quill.register(BackgroundStyle, true);

const getYouTubeId = (url: string | null | undefined) => {
    if (!url) return null;
    const cleanUrl = url.trim();
    const regExp =
        /^.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
    const match = cleanUrl.match(regExp);
    return match && match[1].length === 11 ? match[1] : null;
};

interface CreateProps {
    categories: Category[];
}

export default function ArticleCreate({ categories }: CreateProps) {
    const quillRef = useRef<any>(null);
    const lastSelectedFontRef = useRef<string | null>(null);

    // State Format Toolbar
    const [activeFormats, setActiveFormats] = useState<{
        bold?: boolean;
        italic?: boolean;
        underline?: boolean;
        strike?: boolean;
        blockquote?: boolean;
        list?: string | boolean;
        align?: string;
        direction?: string;
        font?: string;
        size?: string;
        lineHeight?: string;
        letterSpacing?: string;
        color?: string;
        background?: string;
    }>({});

    const [imageSourceType, setImageSourceType] = useState<
        "file" | "url" | "youtube"
    >("file");
    const [quoteType, setQuoteType] = useState<"text" | "image" | "youtube">(
        "text",
    );

    const [viewMode, setViewMode] = useState<"edit" | "preview">("edit");

    // State Sampul Artikel (Cover Crop)
    const [tempImageSrc, setTempImageSrc] = useState<string | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [quoteImagePreview, setQuoteImagePreview] = useState<string | null>(
        null,
    );
    const [coverCropModalOpen, setCoverCropModalOpen] = useState(false);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

    // State Crop Gambar untuk Naskah Editor (Quill Content)
    const [editorCropModalOpen, setEditorCropModalOpen] = useState(false);
    const [selectedEditorRawImage, setSelectedEditorRawImage] =
        useState<string>("");

    // Form Inertia State
    const {
        data,
        setData,
        post,
        processing,
        transform,
        errors,
        setError,
        clearErrors,
    } = useForm({
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
        quote_line_height: 2.4,
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

    const syncCurrentFormats = (quillInstance?: any) => {
        const quill = quillInstance || quillRef.current?.getEditor();
        if (!quill) return;
        const formats = quill.getFormat() || {};
        setActiveFormats(formats);
    };

    const applyFormat = (formatName: string, value: any) => {
        const quill = quillRef.current?.getEditor();
        if (!quill) return;
        quill.format(formatName, value);
        setTimeout(() => syncCurrentFormats(quill), 10);
    };

    // Deteksi kursor/seleksi teks
    const handleChangeSelection = (range: any, source: string, editor: any) => {
        if (range && source === "user") {
            try {
                const formats = editor.getFormat(range) || {};
                setActiveFormats(formats);

                if (formats.font) {
                    lastSelectedFontRef.current = formats.font;
                } else if (lastSelectedFontRef.current) {
                    editor.format("font", lastSelectedFontRef.current);
                }
            } catch (err) {}
        }
    };

    // Handler Buka File Gambar untuk Disisipkan ke Naskah
    const handleTriggerContentImage = () => {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute(
            "accept",
            "image/png, image/jpeg, image/jpg, image/webp",
        );
        input.click();

        input.onchange = () => {
            const file = input.files ? input.files[0] : null;
            if (!file) return;

            if (file.size > 5 * 1024 * 1024) {
                toast.error("Ukuran gambar maksimal 5 MB!");
                return;
            }

            const reader = new FileReader();
            reader.onload = () => {
                setSelectedEditorRawImage(reader.result as string);
                setEditorCropModalOpen(true);
            };
            reader.readAsDataURL(file);
        };
    };

    // Handler Selesai Crop Gambar Naskah -> Upload ke Server
    const handleEditorCropComplete = async (croppedBlob: Blob) => {
        setEditorCropModalOpen(false);
        const toastId = toast.loading(
            "Mengunggah gambar hasil crop ke naskah...",
        );

        const formData = new FormData();
        // Beri nama berekstensi .png dan tipe MIME yang valid
        formData.append("file", croppedBlob, "editor-image.png");

        try {
            const response = await axios.post(
                "/admin/editor/upload-media",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        "X-Requested-With": "XMLHttpRequest",
                    },
                },
            );

            if (response.data && response.data.success) {
                const quill = quillRef.current?.getEditor();
                if (quill) {
                    const range = quill.getSelection(true);
                    const index = range ? range.index : quill.getLength();
                    quill.insertEmbed(index, "image", response.data.url);
                    quill.setSelection(index + 1, 0);
                }
                toast.success("Gambar berhasil disisipkan ke naskah!", {
                    id: toastId,
                });
            } else {
                toast.error(
                    response.data?.message || "Gagal menyisipkan gambar.",
                    { id: toastId },
                );
            }
        } catch (err: any) {
            console.error("Upload error:", err);
            const errorMsg =
                err.response?.data?.message ||
                "Gagal mengunggah gambar. Pastikan format file sesuai.";
            toast.error(errorMsg, { id: toastId });
        }
    };

    // Handler Sisipkan Video YouTube ke Naskah
    const handleInsertYoutubeContent = () => {
        const url = prompt(
            "Masukkan Tautan Video YouTube:\nContoh: https://www.youtube.com/watch?v=...",
        );
        if (!url) return;

        const ytId = getYouTubeId(url);
        if (!ytId) {
            toast.error("Format tautan YouTube tidak valid!");
            return;
        }

        const embedUrl = `https://www.youtube.com/embed/${ytId}`;
        const quill = quillRef.current?.getEditor();
        if (quill) {
            const range = quill.getSelection(true);
            const index = range ? range.index : quill.getLength();
            quill.insertEmbed(index, "video", embedUrl, "user");
            quill.setSelection(index + 1, 0);
            toast.success("Video YouTube berhasil disisipkan ke naskah!");
        }
    };

    // Parser Pratinjau Naskah
    const renderArticleHtml = (htmlContent: string) => {
        if (!htmlContent) return "";
        const cleanHtml = htmlContent.replace(/&nbsp;|\u00a0/g, " ");

        if (typeof window === "undefined") return cleanHtml;

        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(cleanHtml, "text/html");

            // Format Gambar Pratinjau di Naskah
            const images = doc.querySelectorAll("img");
            images.forEach((img) => {
                img.setAttribute("loading", "lazy");
                // Ganti object-cover menjadi object-contain dan tambahkan properti rendering warna asli
                img.className =
                    "mx-auto block h-auto max-h-[520px] w-auto max-w-full rounded-2xl border border-[#E8CEBC] object-contain my-6 shadow-2xs [image-rendering:-webkit-optimize-contrast]";
            });

            // Format Iframe YouTube Pratinjau
            const iframes = doc.querySelectorAll("iframe");
            iframes.forEach((iframe) => {
                const src = iframe.getAttribute("src") || "";
                const ytId = getYouTubeId(src);
                if (ytId) {
                    const wrapper = doc.createElement("div");
                    wrapper.className =
                        "my-6 w-full overflow-hidden rounded-2xl bg-black shadow-md";

                    const newIframe = doc.createElement("iframe");
                    newIframe.setAttribute(
                        "src",
                        `https://www.youtube.com/embed/${ytId}`,
                    );
                    newIframe.className = "w-full aspect-video border-0 block";
                    newIframe.setAttribute(
                        "allow",
                        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
                    );
                    newIframe.setAttribute("allowfullscreen", "true");

                    wrapper.appendChild(newIframe);
                    iframe.parentNode?.replaceChild(wrapper, iframe);
                }
            });

            return doc.body.innerHTML;
        } catch (e) {
            return cleanHtml;
        }
    };

    transform((curr) => ({
        ...curr,
        title: curr.title ? curr.title.trim() : "",
        content: curr.content
            ? curr.content.replace(/&nbsp;|\u00a0/g, " ")
            : "",
        description: curr.description
            ? curr.description.replace(/&nbsp;|\u00a0/g, " ").trim()
            : "",
        quote_type: quoteType,
        quote_font: data.quote_font,
        quote_font_size: Number(data.quote_font_size),
        quote_line_height: Number(data.quote_line_height),
        quote_color: data.quote_color,
    }));

    // 1. Tambahkan handler paste di dalam komponen (setelah deklarasi quillRef)
    useEffect(() => {
        const quill = quillRef.current?.getEditor();
        if (!quill) return;

        const handlePaste = async (e: ClipboardEvent) => {
            const clipboardData = e.clipboardData;
            if (!clipboardData) return;

            const imageItem = Array.from(clipboardData.items).find((item) =>
                item.type.startsWith("image/"),
            );

            // Kalau bukan gambar, biarkan Quill menangani paste normal
            if (!imageItem) return;

            // Hentikan paste gambar bawaan Quill
            e.preventDefault();

            const file = imageItem.getAsFile();
            if (!file) return;

            if (file.size > 5 * 1024 * 1024) {
                toast.error("Ukuran gambar maksimal 5 MB!");
                return;
            }

            const toastId = toast.loading("Mengunggah gambar hasil paste...");

            const formData = new FormData();

            formData.append("file", file, `pasted-image-${Date.now()}.png`);

            try {
                const response = await axios.post(
                    "/admin/editor/upload-media",
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                            "X-Requested-With": "XMLHttpRequest",
                        },
                    },
                );

                if (!response.data?.success) {
                    toast.error(
                        response.data?.message || "Gagal mengunggah gambar.",
                        {
                            id: toastId,
                        },
                    );
                    return;
                }

                const editor = quillRef.current?.getEditor();

                if (!editor) {
                    toast.error("Editor tidak ditemukan.", {
                        id: toastId,
                    });
                    return;
                }

                const range = editor.getSelection(true);
                const index = range ? range.index : editor.getLength();

                editor.insertEmbed(index, "image", response.data.url);

                editor.setSelection(index + 1, 0);

                toast.success("Gambar berhasil disisipkan!", {
                    id: toastId,
                });
            } catch (err) {
                console.error("Paste upload error:", err);

                toast.error("Gagal mengunggah gambar hasil paste.", {
                    id: toastId,
                });
            }
        };

        const editorElement = quill.root;

        // Capture phase supaya event ditangkap
        // sebelum handler paste milik Quill.
        editorElement.addEventListener("paste", handlePaste, true);

        return () => {
            editorElement.removeEventListener("paste", handlePaste, true);
        };
    }, []);

    // Tambahkan ini di dalam useEffect setelah deklarasi quillRef untuk mengatur ukuran gambar via klik
    useEffect(() => {
        const quill = quillRef.current?.getEditor();
        if (!quill) return;

        const handleImageClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target && target.tagName === "IMG") {
                const currentWidth =
                    target.style.width ||
                    target.getAttribute("width") ||
                    "100%";
                const newWidth = prompt(
                    "Masukkan ukuran lebar gambar secara lengkap (contoh: 300px, 50%, atau 100%) :",
                    currentWidth,
                );
                if (newWidth !== null) {
                    target.style.width = newWidth;
                    target.removeAttribute("width");
                    target.removeAttribute("height");
                }
            }
        };

        const quillRoot = quill.root;
        quillRoot.addEventListener("click", handleImageClick);

        return () => {
            quillRoot.removeEventListener("click", handleImageClick);
        };
    }, [quillRef]);

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

    useEffect(() => {
        if (quoteType === "image" && data.quote_image) {
            const objectUrl = URL.createObjectURL(data.quote_image);
            setQuoteImagePreview(objectUrl);
            return () => URL.revokeObjectURL(objectUrl);
        } else {
            setQuoteImagePreview(null);
        }
    }, [data.quote_image, quoteType]);

    // Handle Pilih File Sampul
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            if (file.size > 5 * 1024 * 1024) {
                toast.error(
                    "Ukuran gambar sampul terlalu besar! Maksimal 5 MB.",
                );
                return;
            }
            const reader = new FileReader();
            reader.addEventListener("load", () => {
                setTempImageSrc(reader.result?.toString() || null);
                setCoverCropModalOpen(true);
            });
            reader.readAsDataURL(file);
        }
    };

    // Handle Pilih File Gambar Quote
    const handleQuoteImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            if (file.size > 5 * 1024 * 1024) {
                toast.error(
                    "Ukuran gambar quote terlalu besar! Maksimal 5 MB.",
                );
                return;
            }
            setData("quote_image", file);
        }
    };

    // Simpan Potongan Sampul
    const handleSaveCoverCrop = async () => {
        try {
            if (tempImageSrc && croppedAreaPixels) {
                const croppedFile = await getCroppedImg(
                    tempImageSrc,
                    croppedAreaPixels,
                );
                setData("image_file", croppedFile);
                setCoverCropModalOpen(false);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const quillModules = useMemo(
        () => ({
            toolbar: false,
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
        clearErrors();

        let hasError = false;

        if (!data.title || !data.title.trim()) {
            setError("title", "Judul artikel wajib diisi!");
            hasError = true;
        }

        if (!data.description || !data.description.trim()) {
            setError("description", "Ringkasan artikel wajib diisi!");
            hasError = true;
        }

        const strippedContent = data.content
            ? data.content
                  .replace(/<[^>]*>?/gm, "")
                  .replace(/&nbsp;|\u00a0/g, " ")
                  .trim()
            : "";

        if (!strippedContent) {
            setError(
                "content",
                "Isi naskah artikel kajian wajib diisi dan tidak boleh kosong!",
            );
            hasError = true;
        }

        if (hasError) {
            toast.error("Isi semua field yang bertanda (*)");
            return;
        }

        post("/admin/articles", {
            forceFormData: true,
            onError: () => {
                toast.error("Gagal menerbitkan artikel. Isi field input.");
            },
        });
    };

    const ytId =
        imageSourceType === "youtube" ? getYouTubeId(data.image_url) : null;

    const quoteYtId =
        quoteType === "youtube" ? getYouTubeId(data.quote_youtube_url) : null;

    return (
        <div className="min-h-screen bg-[#F7EAE0] text-[#5E3122] selection:bg-[#1D4533] selection:text-[#F7EAE0] pb-16">
            <Head title="Tulis Artikel - Abu Haidar" />

            <Toaster
                position="bottom-right"
                gutter={10}
                containerStyle={{
                    bottom: 24,
                    right: 24,
                    zIndex: 9999999,
                }}
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: "#FDF9F5",
                        color: "#5E3122",
                        border: "1px solid #E8CEBC",
                        borderRadius: "16px",
                        padding: "12px 18px",
                        fontSize: "13px",
                        fontWeight: 600,
                        boxShadow: "0 12px 30px -8px rgba(94, 49, 34, 0.2)",
                    },
                }}
            />

            {/* HEADER STICKY */}
            <header className="sticky top-0 z-50 w-full border-b border-[#E8CEBC] bg-[#F7EAE0]/95 backdrop-blur-md shadow-sm">
                <div className="mx-auto flex max-w-[1050px] items-center justify-between px-4 sm:px-6 py-3 sm:py-3.5">
                    <div className="flex items-center gap-3 min-w-0">
                        <Link
                            href="/admin/articles"
                            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E8CEBC] bg-white text-[#5E3122] transition hover:bg-[#FAF3EB] shrink-0 shadow-2xs"
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
                        className="flex items-center gap-1.5 rounded-full bg-[#1D4533] px-4 sm:px-5 py-2 text-[12px] sm:text-[13px] font-bold text-[#F7EAE0] shadow-sm transition hover:bg-[#143325] disabled:opacity-50 cursor-pointer active:scale-95"
                    >
                        <Save size={15} /> <span>Simpan & Terbitkan</span>
                    </button>
                </div>
            </header>

            <main className="mx-auto max-w-[1050px] px-4 sm:px-6 py-6 sm:py-8">
                <form
                    onSubmit={handleSubmit}
                    className="space-y-6"
                    encType="multipart/form-data"
                >
                    <div className="rounded-2xl border border-[#E8CEBC] bg-white p-5 sm:p-8 shadow-xs space-y-5">
                        {/* Judul Artikel */}
                        <div>
                            <label className="block text-[12px] font-bold uppercase tracking-wider font-brand text-[#5E3122] mb-1.5 flex items-center justify-between">
                                <span>
                                    Judul Artikel{" "}
                                    <span className="text-red-500">*</span>
                                </span>
                                <span className="text-[10.5px] font-normal lowercase tracking-normal text-[#5E3122]/60">
                                    (Wajib diisi)
                                </span>
                            </label>
                            <input
                                type="text"
                                required
                                value={data.title}
                                onChange={(e) => {
                                    setData("title", e.target.value);
                                    if (errors.title) clearErrors("title");
                                }}
                                placeholder="Judul artikel di sini..."
                                className={`w-full rounded-xl border px-4 py-2.5 sm:py-3 text-[15px] sm:text-[16px] font-brand font-bold text-[#1D4533] outline-none transition ${
                                    errors.title
                                        ? "border-red-400 bg-red-50/40 focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-200"
                                        : "border-[#E8CEBC] bg-[#FAF3EB]/50 focus:border-[#1D4533] focus:bg-white focus:ring-2 focus:ring-[#1D4533]/15"
                                }`}
                            />
                            {errors.title && (
                                <p className="mt-1.5 flex items-center gap-1 text-[11.5px] font-bold text-red-600">
                                    <AlertCircle size={13} />
                                    <span>{errors.title}</span>
                                </p>
                            )}
                        </div>

                        {/* Kategori */}
                        <div>
                            <label className="block text-[12px] font-bold uppercase tracking-wider font-brand text-[#5E3122] mb-1.5">
                                Kategori <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={data.category_id}
                                onChange={(e) =>
                                    setData(
                                        "category_id",
                                        Number(e.target.value),
                                    )
                                }
                                className="w-full rounded-xl border border-[#E8CEBC] bg-[#FAF3EB]/50 px-4 py-2.5 sm:py-3 text-[13px] sm:text-[14px] text-[#5E3122] focus:border-[#1D4533] focus:bg-white focus:outline-none"
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
                        <div className="space-y-3 rounded-xl border border-[#E8CEBC] bg-[#FAF3EB]/40 p-4">
                            <div className="flex items-center justify-between flex-wrap gap-2">
                                <label className="text-[12px] font-bold uppercase tracking-wider font-brand text-[#5E3122] flex items-center gap-2">
                                    <ImageIcon
                                        size={16}
                                        className="text-[#1D4533]"
                                    />{" "}
                                    Gambar / Video Sampul
                                </label>
                                <div className="flex rounded-lg border border-[#E8CEBC] bg-white p-0.5 text-[11px] font-bold">
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
                                        <Upload size={12} /> Upload Foto
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
                                        <Link2 size={12} /> Tautan URL
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
                                        className="w-full text-[13px] text-[#5E3122] file:mr-4 file:rounded-lg file:border-0 file:bg-[#E8CEBC]/60 file:px-4 file:py-2 file:text-[12px] file:font-bold file:text-[#1D4533] hover:file:bg-[#E8CEBC] cursor-pointer"
                                    />
                                    <p className="mt-1 text-[11px] text-[#5E3122]/60">
                                        Saiz maksimum gambar 5 MB.
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
                                    className={`w-full rounded-xl border border-[#E8CEBC] bg-white px-4 py-2.5 text-[13px] text-[#5E3122] focus:outline-none ${
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
                                <div className="mt-3 relative h-44 w-full max-w-sm overflow-hidden rounded-xl border border-[#E8CEBC] group bg-[#F7EAE0]">
                                    <img
                                        src={imagePreview}
                                        alt="Thumbnail Preview"
                                        className="h-full w-full object-cover"
                                    />
                                    {imageSourceType === "file" && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setCoverCropModalOpen(true)
                                            }
                                            className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 text-white font-bold text-[12px] opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                        >
                                            <Crop size={16} /> Potong Semula
                                            (Crop)
                                        </button>
                                    )}
                                </div>
                            ) : null}
                        </div>

                        {/* Modal Cropper untuk Sampul */}
                        {coverCropModalOpen && tempImageSrc && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
                                <div className="w-full max-w-2xl rounded-2xl bg-white p-5 sm:p-6 shadow-2xl space-y-4">
                                    <div className="flex items-center justify-between border-b border-[#E8CEBC] pb-3">
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
                                                setCoverCropModalOpen(false)
                                            }
                                            className="text-[#5E3122]/60 hover:text-black cursor-pointer"
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
                                            className="w-full h-1.5 bg-[#E8CEBC] rounded-lg appearance-none cursor-pointer accent-[#1D4533]"
                                        />
                                    </div>
                                    <div className="flex justify-end gap-2.5 pt-2">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setCoverCropModalOpen(false)
                                            }
                                            className="rounded-xl border border-[#E8CEBC] px-4 py-2 text-[12px] sm:text-[13px] font-bold text-[#5E3122] hover:bg-[#FAF3EB] cursor-pointer"
                                        >
                                            Batal
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleSaveCoverCrop}
                                            className="flex items-center gap-1.5 rounded-xl bg-[#1D4533] px-5 py-2 text-[12px] sm:text-[13px] font-bold text-[#F7EAE0] hover:bg-[#143325] cursor-pointer"
                                        >
                                            <Check size={16} /> Potong
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Modal Cropper untuk Gambar Naskah Editor */}
                        <ImageCropperModal
                            isOpen={editorCropModalOpen}
                            imageSrc={selectedEditorRawImage}
                            onClose={() => setEditorCropModalOpen(false)}
                            onCropComplete={handleEditorCropComplete}
                        />

                        {/* BAGIAN TAFSIR & QUOTE */}
                        {isTafsirCategory && (
                            <div className="space-y-4 rounded-xl border border-[#E8CEBC] bg-[#FAF3EB]/40 p-4 sm:p-5">
                                <div className="flex items-center justify-between border-b border-[#E8CEBC] pb-3 flex-wrap gap-2">
                                    <h4 className="text-[13px] font-bold font-brand text-[#1D4533] flex items-center gap-2">
                                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#1D4533] text-[10px] text-[#F7EAE0]">
                                            ✓
                                        </span>
                                        Quote / Media Tafsir Ayat
                                    </h4>

                                    <div className="flex rounded-lg border border-[#E8CEBC] bg-white p-0.5 text-[11px] font-bold">
                                        <button
                                            type="button"
                                            onClick={() => setQuoteType("text")}
                                            className={`flex items-center gap-1 rounded-md px-3 py-1 transition cursor-pointer ${
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
                                            className={`flex items-center gap-1 rounded-md px-3 py-1 transition cursor-pointer ${
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
                                            className={`flex items-center gap-1 rounded-md px-3 py-1 transition cursor-pointer ${
                                                quoteType === "youtube"
                                                    ? "bg-red-600 text-white"
                                                    : "text-[#5E3122]/70"
                                            }`}
                                        >
                                            <FaYoutube size={13} /> YouTube
                                        </button>
                                    </div>
                                </div>

                                {quoteType === "text" && (
                                    <>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 rounded-xl border border-[#E8CEBC] bg-white p-3.5 shadow-2xs">
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
                                                    className="w-full rounded-lg border border-[#E8CEBC] bg-[#FAF3EB]/50 px-2.5 py-1.5 text-[12px] text-[#5E3122] focus:border-[#1D4533] focus:outline-none"
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
                                                        className="h-8 w-10 cursor-pointer rounded-md border border-[#E8CEBC] bg-white p-0.5"
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
                                                        className="w-full rounded-lg border border-[#E8CEBC] bg-[#FAF3EB]/50 px-2 py-1.5 text-[11px] font-mono text-[#5E3122] uppercase focus:border-[#1D4533] focus:outline-none"
                                                    />
                                                </div>
                                            </div>

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
                                                    className="w-full h-1.5 mt-2 bg-[#E8CEBC] rounded-lg appearance-none cursor-pointer accent-[#1D4533]"
                                                />
                                            </div>

                                            <div>
                                                <div className="flex items-center justify-between mb-1">
                                                    <label className="text-[11px] font-bold uppercase tracking-wider text-[#5E3122] flex items-center gap-1">
                                                        <AlignVerticalSpaceAround
                                                            size={12}
                                                        />{" "}
                                                        Spasi Baris
                                                    </label>
                                                    <span className="text-[11px] font-bold text-[#1D4533]">
                                                        {Number(
                                                            data.quote_line_height,
                                                        ).toFixed(1)}
                                                        x
                                                    </span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min={1.4}
                                                    max={3.4}
                                                    step={0.1}
                                                    value={
                                                        data.quote_line_height
                                                    }
                                                    onChange={(e) =>
                                                        setData(
                                                            "quote_line_height",
                                                            Number(
                                                                e.target.value,
                                                            ),
                                                        )
                                                    }
                                                    className="w-full h-1.5 mt-2 bg-[#E8CEBC] rounded-lg appearance-none cursor-pointer accent-[#1D4533]"
                                                />
                                            </div>
                                        </div>

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
                                                lineHeight:
                                                    data.quote_line_height,
                                            }}
                                            placeholder="إِنَّ أَكْرَمَكُمْ عِندَ اللَّهِ أَتْقَاكُمْ"
                                            className={`${data.quote_font} w-full rounded-xl border border-[#E8CEBC] bg-white px-5 py-4 focus:border-[#1D4533] focus:outline-none text-right transition-all tracking-normal`}
                                        />

                                        <div className="grid gap-3 sm:grid-cols-2 mt-2">
                                            <div>
                                                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5E3122] mb-1">
                                                    Terjemahan
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
                                                    className="w-full rounded-xl border border-[#E8CEBC] bg-white px-4 py-2 text-[13px] text-[#5E3122] focus:border-[#1D4533] focus:outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5E3122] mb-1">
                                                    Rujukan Surah / Ayat
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
                                                    className="w-full rounded-xl border border-[#E8CEBC] bg-white px-4 py-2 text-[13px] text-[#5E3122] focus:border-[#1D4533] focus:outline-none"
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}

                                {quoteType === "image" && (
                                    <div className="space-y-3">
                                        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5E3122]">
                                            Upload Gambar Quote
                                        </label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleQuoteImageSelect}
                                            className="w-full text-[13px] text-[#5E3122] file:mr-4 file:rounded-lg file:border-0 file:bg-[#E8CEBC]/60 file:px-4 file:py-2 file:text-[12px] file:font-bold file:text-[#1D4533] cursor-pointer"
                                        />
                                        <p className="mt-1 text-[11px] text-[#5E3122]/60">
                                            Size maksimum gambar 5 MB.
                                        </p>
                                        {quoteImagePreview && (
                                            <img
                                                src={quoteImagePreview}
                                                alt="Preview Quote"
                                                className="mt-2 w-48 rounded-xl border border-[#E8CEBC] object-cover shadow-xs"
                                            />
                                        )}
                                    </div>
                                )}

                                {quoteType === "youtube" && (
                                    <div className="space-y-3">
                                        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5E3122]">
                                            Tautan Video (YouTube)
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
                                            className="w-full rounded-xl border border-[#E8CEBC] bg-white px-4 py-2.5 text-[13px] text-[#5E3122] focus:border-red-600 focus:outline-none"
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
                            <label className="block text-[12px] font-bold uppercase tracking-wider font-brand text-[#5E3122] mb-1.5 flex items-center justify-between">
                                <span>
                                    Ringkasan Artikel{" "}
                                    <span className="text-red-500">*</span>
                                </span>
                                <span className="text-[10.5px] font-normal lowercase tracking-normal text-[#5E3122]/60">
                                    (Wajib diisi)
                                </span>
                            </label>
                            <textarea
                                rows={2}
                                required
                                value={data.description}
                                onChange={(e) => {
                                    setData("description", e.target.value);
                                    if (errors.description)
                                        clearErrors("description");
                                }}
                                placeholder="Ringkasan ringkas artikel..."
                                className={`w-full rounded-xl border px-4 py-2.5 text-[14px] text-[#5E3122] outline-none transition ${
                                    errors.description
                                        ? "border-red-400 bg-red-50/40 focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-200"
                                        : "border-[#E8CEBC] bg-[#FAF3EB]/50 focus:border-[#1D4533] focus:bg-white focus:ring-2 focus:ring-[#1D4533]/15"
                                }`}
                            />
                            {errors.description && (
                                <p className="mt-1.5 flex items-center gap-1 text-[11.5px] font-bold text-red-600">
                                    <AlertCircle size={13} />
                                    <span>{errors.description}</span>
                                </p>
                            )}
                        </div>
                    </div>

                    {/* BLOK EDITOR & PREVIEW */}
                    <div className="rounded-2xl border border-[#E8CEBC] bg-white shadow-xs">
                        <div className="flex overflow-hidden rounded-t-2xl border-b border-[#E8CEBC] bg-[#FAF3EB]">
                            <button
                                type="button"
                                onClick={() => setViewMode("edit")}
                                className={`flex-1 py-3.5 sm:py-4 text-[13px] font-bold font-brand transition-colors cursor-pointer ${
                                    viewMode === "edit"
                                        ? "border-t-[3px] border-[#1D4533] bg-white text-[#1D4533]"
                                        : "text-[#5E3122]/70 hover:bg-[#FAF3EB]/70"
                                }`}
                            >
                                <Edit3 size={16} className="mr-2 inline" /> Mode
                                Menulis <span className="text-red-500">*</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setViewMode("preview")}
                                className={`flex-1 py-3.5 sm:py-4 text-[13px] font-bold font-brand transition-colors cursor-pointer ${
                                    viewMode === "preview"
                                        ? "border-t-[3px] border-[#1D4533] bg-white text-[#1D4533]"
                                        : "text-[#5E3122]/70 hover:bg-[#FAF3EB]/70"
                                }`}
                            >
                                <Eye size={16} className="mr-2 inline" />{" "}
                                Pratinjau Website
                            </button>
                        </div>

                        {/* Mode Menulis */}
                        <div
                            className={`${
                                viewMode === "edit" ? "block" : "hidden"
                            } relative rounded-b-2xl bg-[#F7EAE0] p-4 sm:p-7 lg:p-9`}
                        >
                            <div className="mx-auto max-w-[950px] relative rounded-2xl border border-[#E8CEBC] bg-white shadow-xs">
                                {/* TOOLBAR FORMAT FONT STICKY */}
                                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 p-2.5 bg-[#FAF3EB] border-b border-[#E8CEBC] rounded-t-2xl select-none sticky top-[56px] sm:top-[64px] z-30 shadow-xs backdrop-blur-md">
                                    {/* 1. Font Family */}
                                    <div className="flex flex-col">
                                        <select
                                            value={
                                                activeFormats.font ||
                                                "helvetica"
                                            }
                                            onChange={(e) =>
                                                applyFormat(
                                                    "font",
                                                    e.target.value,
                                                )
                                            }
                                            className={`h-8 rounded-lg border px-2 text-[11px] font-bold outline-none cursor-pointer max-w-[110px] sm:max-w-[130px] truncate transition-all ${
                                                activeFormats.font &&
                                                activeFormats.font !==
                                                    "helvetica"
                                                    ? "border-[#1D4533] bg-[#1D4533] text-[#F7EAE0] shadow-2xs"
                                                    : "border-[#E8CEBC] bg-white text-[#1D4533] hover:border-[#1D4533]"
                                            }`}
                                            title="Pilihan Font"
                                        >
                                            <option value="helvetica">
                                                Helvetica
                                            </option>
                                            <option value="amiri">
                                                Amiri (Arab)
                                            </option>
                                            <option value="adobe-naskh">
                                                Adobe Naskh
                                            </option>
                                            <option value="scheherazade">
                                                Scheherazade New
                                            </option>
                                            <option value="cairo">Cairo</option>
                                            <option value="tajawal">
                                                Tajawal
                                            </option>
                                            <option value="almarai">
                                                Almarai
                                            </option>
                                            <option value="al-jazeera">
                                                Al Jazeera
                                            </option>
                                            <option value="times">
                                                Times New Roman
                                            </option>
                                        </select>
                                        <span className="text-[9px] font-medium text-[#8C5E43] mt-0.5 pl-0.5">
                                            Jenis Font
                                        </span>
                                    </div>

                                    {/* 2. Font Size */}
                                    <div className="flex flex-col">
                                        <select
                                            value={activeFormats.size || "16px"}
                                            onChange={(e) =>
                                                applyFormat(
                                                    "size",
                                                    e.target.value,
                                                )
                                            }
                                            className={`h-8 rounded-lg border px-1.5 text-[11px] font-bold outline-none cursor-pointer w-[64px] transition-all ${
                                                activeFormats.size &&
                                                activeFormats.size !== "16px"
                                                    ? "border-[#1D4533] bg-[#1D4533] text-[#F7EAE0] shadow-2xs"
                                                    : "border-[#E8CEBC] bg-white text-[#1D4533] hover:border-[#1D4533]"
                                            }`}
                                            title="Ukuran Font"
                                        >
                                            {SizeStyle.whitelist.map(
                                                (sz: string) => (
                                                    <option key={sz} value={sz}>
                                                        {sz}
                                                    </option>
                                                ),
                                            )}
                                        </select>
                                        <span className="text-[9px] font-medium text-[#8C5E43] mt-0.5 pl-0.5">
                                            Ukuran
                                        </span>
                                    </div>

                                    {/* 3. Spasi Baris */}
                                    <div className="flex flex-col">
                                        <select
                                            value={
                                                activeFormats.lineHeight ||
                                                "1.8"
                                            }
                                            onChange={(e) =>
                                                applyFormat(
                                                    "lineHeight",
                                                    e.target.value,
                                                )
                                            }
                                            className={`h-8 rounded-lg border px-1.5 text-[11px] font-bold outline-none cursor-pointer w-[68px] transition-all ${
                                                activeFormats.lineHeight &&
                                                activeFormats.lineHeight !==
                                                    "1.8"
                                                    ? "border-[#1D4533] bg-[#1D4533] text-[#F7EAE0] shadow-2xs"
                                                    : "border-[#E8CEBC] bg-white text-[#1D4533] hover:border-[#1D4533]"
                                            }`}
                                            title="Tinggi Baris (Line Height)"
                                        >
                                            <option value="0.8">0.8x</option>
                                            <option value="1.0">1.0x</option>
                                            <option value="1.2">1.2x</option>
                                            <option value="1.4">1.4x</option>
                                            <option value="1.6">1.6x</option>
                                            <option value="1.8">1.8x</option>
                                            <option value="2.0">2.0x</option>
                                            <option value="2.4">2.4x</option>
                                            <option value="2.8">2.8x</option>
                                            <option value="3.2">3.2x</option>
                                            <option value="3.5">3.5x</option>
                                        </select>
                                        <span className="text-[9px] font-medium text-[#8C5E43] mt-0.5 pl-0.5">
                                            Spasi Baris
                                        </span>
                                    </div>

                                    {/* 4. Jarak Huruf */}
                                    <div className="flex flex-col">
                                        <select
                                            value={
                                                activeFormats.letterSpacing ||
                                                "0px"
                                            }
                                            onChange={(e) =>
                                                applyFormat(
                                                    "letterSpacing",
                                                    e.target.value,
                                                )
                                            }
                                            className={`h-8 rounded-lg border px-1.5 text-[11px] font-bold outline-none cursor-pointer w-[76px] transition-all ${
                                                activeFormats.letterSpacing &&
                                                activeFormats.letterSpacing !==
                                                    "0px"
                                                    ? "border-[#1D4533] bg-[#1D4533] text-[#F7EAE0] shadow-2xs"
                                                    : "border-[#E8CEBC] bg-white text-[#1D4533] hover:border-[#1D4533]"
                                            }`}
                                            title="Jarak Huruf / Kata"
                                        >
                                            <option value="-0.5px">
                                                -0.5px
                                            </option>
                                            <option value="0px">
                                                0px (Normal)
                                            </option>
                                            <option value="0.5px">
                                                +0.5px
                                            </option>
                                            <option value="1px">+1.0px</option>
                                            <option value="1.5px">
                                                +1.5px
                                            </option>
                                            <option value="2px">+2.0px</option>
                                            <option value="3px">+3.0px</option>
                                        </select>
                                        <span className="text-[9px] font-medium text-[#8C5E43] mt-0.5 pl-0.5">
                                            Jarak Huruf
                                        </span>
                                    </div>

                                    <div className="h-7 w-[1px] bg-[#E8CEBC] mx-0.5 hidden sm:block self-center"></div>

                                    {/* 5. Warna Font */}
                                    <div className="flex flex-col">
                                        <div
                                            className={`flex items-center gap-1 rounded-lg border px-1.5 h-8 transition-all ${
                                                activeFormats.color
                                                    ? "border-[#1D4533] bg-[#1D4533]/10"
                                                    : "border-[#E8CEBC] bg-white"
                                            }`}
                                        >
                                            <Palette
                                                size={12}
                                                className="text-[#1D4533]"
                                            />
                                            <input
                                                type="color"
                                                value={
                                                    activeFormats.color ||
                                                    "#1D4533"
                                                }
                                                onChange={(e) =>
                                                    applyFormat(
                                                        "color",
                                                        e.target.value,
                                                    )
                                                }
                                                className="h-5 w-5 cursor-pointer rounded border border-[#E8CEBC] bg-white p-0"
                                                title="Pilih Warna Teks"
                                            />
                                            <input
                                                type="text"
                                                value={
                                                    activeFormats.color ||
                                                    "#1D4533"
                                                }
                                                onChange={(e) =>
                                                    applyFormat(
                                                        "color",
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="#1D4533"
                                                className="w-13 text-[10px] font-mono uppercase text-[#1D4533] font-bold outline-none"
                                            />
                                        </div>
                                        <span className="text-[9px] font-medium text-[#8C5E43] mt-0.5 pl-0.5">
                                            Warna Font
                                        </span>
                                    </div>

                                    {/* 6. Warna Blok */}
                                    <div className="flex flex-col">
                                        <div
                                            className={`flex items-center gap-1 rounded-lg border px-1.5 h-8 transition-all ${
                                                activeFormats.background
                                                    ? "border-amber-500 bg-amber-50"
                                                    : "border-[#E8CEBC] bg-white"
                                            }`}
                                        >
                                            <Highlighter
                                                size={12}
                                                className={
                                                    activeFormats.background
                                                        ? "text-amber-700"
                                                        : "text-[#1D4533]"
                                                }
                                            />
                                            <input
                                                type="color"
                                                value={
                                                    activeFormats.background ||
                                                    "#FFFF00"
                                                }
                                                onChange={(e) =>
                                                    applyFormat(
                                                        "background",
                                                        e.target.value,
                                                    )
                                                }
                                                className="h-5 w-5 cursor-pointer rounded border border-[#E8CEBC] bg-white p-0"
                                                title="Pilih Warna Sorotan / Blok"
                                            />
                                            <input
                                                type="text"
                                                value={
                                                    activeFormats.background ||
                                                    ""
                                                }
                                                onChange={(e) =>
                                                    applyFormat(
                                                        "background",
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Polos"
                                                className="w-13 text-[10px] font-mono uppercase text-[#1D4533] font-bold outline-none"
                                            />
                                            {activeFormats.background && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        applyFormat(
                                                            "background",
                                                            false,
                                                        )
                                                    }
                                                    className="flex h-4 w-4 items-center justify-center rounded text-red-600 hover:bg-red-100 transition cursor-pointer"
                                                    title="Hapus Warna Blok"
                                                >
                                                    <X size={10} />
                                                </button>
                                            )}
                                        </div>
                                        <span className="text-[9px] font-medium text-[#8C5E43] mt-0.5 pl-0.5">
                                            Warna Blok
                                        </span>
                                    </div>

                                    <div className="h-7 w-[1px] bg-[#E8CEBC] mx-0.5 hidden sm:block self-center"></div>

                                    {/* 7. Format Huruf */}
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-0.5">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    applyFormat(
                                                        "bold",
                                                        !activeFormats.bold,
                                                    )
                                                }
                                                className={`h-8 w-8 flex items-center justify-center rounded-lg border transition-all cursor-pointer active:scale-95 ${
                                                    activeFormats.bold
                                                        ? "bg-[#1D4533] text-[#F7EAE0] border-[#1D4533] shadow-2xs font-extrabold"
                                                        : "bg-white text-[#1D4533] border-[#E8CEBC] hover:bg-[#FAF3EB]"
                                                }`}
                                                title="Tebal (Bold)"
                                            >
                                                <Bold size={13} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    applyFormat(
                                                        "italic",
                                                        !activeFormats.italic,
                                                    )
                                                }
                                                className={`h-8 w-8 flex items-center justify-center rounded-lg border transition-all cursor-pointer active:scale-95 ${
                                                    activeFormats.italic
                                                        ? "bg-[#1D4533] text-[#F7EAE0] border-[#1D4533] shadow-2xs"
                                                        : "bg-white text-[#1D4533] border-[#E8CEBC] hover:bg-[#FAF3EB]"
                                                }`}
                                                title="Miring (Italic)"
                                            >
                                                <Italic size={13} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    applyFormat(
                                                        "underline",
                                                        !activeFormats.underline,
                                                    )
                                                }
                                                className={`h-8 w-8 flex items-center justify-center rounded-lg border transition-all cursor-pointer active:scale-95 ${
                                                    activeFormats.underline
                                                        ? "bg-[#1D4533] text-[#F7EAE0] border-[#1D4533] shadow-2xs"
                                                        : "bg-white text-[#1D4533] border-[#E8CEBC] hover:bg-[#FAF3EB]"
                                                }`}
                                                title="Garis Bawah (Underline)"
                                            >
                                                <Underline size={13} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    applyFormat(
                                                        "strike",
                                                        !activeFormats.strike,
                                                    )
                                                }
                                                className={`h-8 w-8 flex items-center justify-center rounded-lg border transition-all cursor-pointer active:scale-95 ${
                                                    activeFormats.strike
                                                        ? "bg-[#1D4533] text-[#F7EAE0] border-[#1D4533] shadow-2xs"
                                                        : "bg-white text-[#1D4533] border-[#E8CEBC] hover:bg-[#FAF3EB]"
                                                }`}
                                                title="Coret (Strikethrough)"
                                            >
                                                <Strikethrough size={13} />
                                            </button>
                                        </div>
                                        <span className="text-[9px] font-medium text-[#8C5E43] mt-0.5 pl-0.5">
                                            Gaya Teks
                                        </span>
                                    </div>

                                    <div className="h-7 w-[1px] bg-[#E8CEBC] mx-0.5 hidden sm:block self-center"></div>

                                    {/* 8. Alignment & RTL */}
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-0.5">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    applyFormat("align", false)
                                                }
                                                className={`h-8 w-8 flex items-center justify-center rounded-lg border transition-all cursor-pointer active:scale-95 ${
                                                    !activeFormats.align
                                                        ? "bg-[#1D4533] text-[#F7EAE0] border-[#1D4533] shadow-2xs"
                                                        : "bg-white text-[#1D4533] border-[#E8CEBC] hover:bg-[#FAF3EB]"
                                                }`}
                                                title="Rata Kiri"
                                            >
                                                <AlignLeft size={13} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    applyFormat(
                                                        "align",
                                                        "center",
                                                    )
                                                }
                                                className={`h-8 w-8 flex items-center justify-center rounded-lg border transition-all cursor-pointer active:scale-95 ${
                                                    activeFormats.align ===
                                                    "center"
                                                        ? "bg-[#1D4533] text-[#F7EAE0] border-[#1D4533] shadow-2xs"
                                                        : "bg-white text-[#1D4533] border-[#E8CEBC] hover:bg-[#FAF3EB]"
                                                }`}
                                                title="Rata Tengah"
                                            >
                                                <AlignCenter size={13} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    applyFormat(
                                                        "align",
                                                        "right",
                                                    )
                                                }
                                                className={`h-8 w-8 flex items-center justify-center rounded-lg border transition-all cursor-pointer active:scale-95 ${
                                                    activeFormats.align ===
                                                    "right"
                                                        ? "bg-[#1D4533] text-[#F7EAE0] border-[#1D4533] shadow-2xs"
                                                        : "bg-white text-[#1D4533] border-[#E8CEBC] hover:bg-[#FAF3EB]"
                                                }`}
                                                title="Rata Kanan (Naskah Arab)"
                                            >
                                                <AlignRight size={13} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    applyFormat(
                                                        "align",
                                                        "justify",
                                                    )
                                                }
                                                className={`h-8 w-8 flex items-center justify-center rounded-lg border transition-all cursor-pointer active:scale-95 ${
                                                    activeFormats.align ===
                                                    "justify"
                                                        ? "bg-[#1D4533] text-[#F7EAE0] border-[#1D4533] shadow-2xs"
                                                        : "bg-white text-[#1D4533] border-[#E8CEBC] hover:bg-[#FAF3EB]"
                                                }`}
                                                title="Rata Kanan Kiri"
                                            >
                                                <AlignJustify size={13} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const isRtl =
                                                        activeFormats.direction ===
                                                        "rtl";
                                                    applyFormat(
                                                        "direction",
                                                        isRtl ? false : "rtl",
                                                    );
                                                    applyFormat(
                                                        "align",
                                                        isRtl ? false : "right",
                                                    );
                                                }}
                                                className={`h-8 px-2 flex items-center justify-center rounded-lg border text-[10.5px] font-bold transition-all cursor-pointer active:scale-95 ${
                                                    activeFormats.direction ===
                                                    "rtl"
                                                        ? "bg-[#1D4533] text-[#F7EAE0] border-[#1D4533] shadow-2xs"
                                                        : "bg-white text-[#1D4533] border-[#E8CEBC] hover:bg-[#FAF3EB]"
                                                }`}
                                                title={
                                                    activeFormats.direction ===
                                                    "rtl"
                                                        ? "Matikan RTL (Kembali LTR)"
                                                        : "Aktifkan Teks Arab (RTL)"
                                                }
                                            >
                                                RTL (ع)
                                            </button>
                                        </div>
                                        <span className="text-[9px] font-medium text-[#8C5E43] mt-0.5 pl-0.5">
                                            Perataan
                                        </span>
                                    </div>

                                    <div className="h-7 w-[1px] bg-[#E8CEBC] mx-0.5 hidden sm:block self-center"></div>

                                    {/* 9. Sisipkan Media ke Naskah (Foto & Video) */}
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-0.5">
                                            <button
                                                type="button"
                                                onClick={
                                                    handleTriggerContentImage
                                                }
                                                className="h-8 px-2 flex items-center gap-1 rounded-lg border border-[#E8CEBC] bg-white text-[#1D4533] hover:bg-[#FAF3EB] text-[11px] font-bold transition cursor-pointer active:scale-95 shadow-2xs"
                                                title="Sesuaikan & Sisipkan Gambar ke dalam Naskah"
                                            >
                                                <ImagePlus size={13} />
                                                <span className="hidden sm:inline">
                                                    Foto
                                                </span>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={
                                                    handleInsertYoutubeContent
                                                }
                                                className="h-8 px-2 flex items-center gap-1 rounded-lg border border-[#E8CEBC] bg-white text-red-600 hover:bg-red-50 text-[11px] font-bold transition cursor-pointer active:scale-95 shadow-2xs"
                                                title="Sisipkan Video YouTube ke dalam Naskah"
                                            >
                                                <Video size={13} />
                                                <span className="hidden sm:inline">
                                                    Video
                                                </span>
                                            </button>
                                        </div>
                                        <span className="text-[9px] font-medium text-[#8C5E43] mt-0.5 pl-0.5">
                                            Sisip Media
                                        </span>
                                    </div>

                                    <div className="h-7 w-[1px] bg-[#E8CEBC] mx-0.5 hidden sm:block self-center"></div>

                                    {/* 10. List & Reset */}
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-0.5">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    applyFormat(
                                                        "list",
                                                        activeFormats.list ===
                                                            "bullet"
                                                            ? false
                                                            : "bullet",
                                                    )
                                                }
                                                className={`h-8 w-8 flex items-center justify-center rounded-lg border transition-all cursor-pointer active:scale-95 ${
                                                    activeFormats.list ===
                                                    "bullet"
                                                        ? "bg-[#1D4533] text-[#F7EAE0] border-[#1D4533] shadow-2xs"
                                                        : "bg-white text-[#1D4533] border-[#E8CEBC] hover:bg-[#FAF3EB]"
                                                }`}
                                                title="Daftar Poin (Bullet)"
                                            >
                                                <List size={13} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    applyFormat(
                                                        "list",
                                                        activeFormats.list ===
                                                            "ordered"
                                                            ? false
                                                            : "ordered",
                                                    )
                                                }
                                                className={`h-8 w-8 flex items-center justify-center rounded-lg border transition-all cursor-pointer active:scale-95 ${
                                                    activeFormats.list ===
                                                    "ordered"
                                                        ? "bg-[#1D4533] text-[#F7EAE0] border-[#1D4533] shadow-2xs"
                                                        : "bg-white text-[#1D4533] border-[#E8CEBC] hover:bg-[#FAF3EB]"
                                                }`}
                                                title="Daftar Nomor"
                                            >
                                                <ListOrdered size={13} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    applyFormat(
                                                        "blockquote",
                                                        !activeFormats.blockquote,
                                                    )
                                                }
                                                className={`h-8 w-8 flex items-center justify-center rounded-lg border transition-all cursor-pointer active:scale-95 ${
                                                    activeFormats.blockquote
                                                        ? "bg-[#1D4533] text-[#F7EAE0] border-[#1D4533] shadow-2xs"
                                                        : "bg-white text-[#1D4533] border-[#E8CEBC] hover:bg-[#FAF3EB]"
                                                }`}
                                                title="Kutipan (Blockquote)"
                                            >
                                                <QuoteIcon size={13} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const quill =
                                                        quillRef.current?.getEditor();
                                                    if (quill) {
                                                        const range =
                                                            quill.getSelection();
                                                        if (range) {
                                                            quill.removeFormat(
                                                                range.index,
                                                                range.length,
                                                            );
                                                            syncCurrentFormats(
                                                                quill,
                                                            );
                                                        }
                                                    }
                                                }}
                                                className="h-8 w-8 flex items-center justify-center rounded-lg border border-[#E8CEBC] bg-white text-red-600 hover:bg-red-50 transition cursor-pointer"
                                                title="Hapus Semua Format (Reset)"
                                            >
                                                <RotateCcw size={13} />
                                            </button>
                                        </div>
                                        <span className="text-[9px] font-medium text-[#8C5E43] mt-0.5 pl-0.5">
                                            Format Lain
                                        </span>
                                    </div>
                                </div>

                                {/* Ruang Penulisan Quill */}
                                <div className="p-4 sm:p-6 min-h-[420px]">
                                    <ReactQuill
                                        ref={quillRef}
                                        theme="snow"
                                        value={data.content}
                                        onChange={(content) => {
                                            setData("content", content);
                                            if (errors.content)
                                                clearErrors("content");
                                        }}
                                        onChangeSelection={
                                            handleChangeSelection
                                        }
                                        modules={quillModules}
                                        placeholder="Mula menulis teks artikel kajian di sini..."
                                    />
                                </div>

                                {errors.content && (
                                    <div className="p-3 bg-red-50 border-t border-red-200 text-red-600 font-bold text-[12px] flex items-center gap-2">
                                        <AlertCircle size={15} />{" "}
                                        <span>{errors.content}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Mode Pratinjau */}
                        <div
                            className={`${
                                viewMode === "preview" ? "block" : "hidden"
                            } rounded-b-2xl bg-[#F7EAE0] p-4 sm:p-7 lg:p-9`}
                        >
                            <div className="mx-auto max-w-[860px] space-y-6">
                                <h1 className="font-brand text-[24px] sm:text-[32px] md:text-[38px] font-bold leading-tight text-[#1D4533]">
                                    {data.title ||
                                        "Judul Kajian Ilmiah Akan Tampil Di Sini"}
                                </h1>

                                {imageSourceType === "youtube" && ytId ? (
                                    <div className="aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-xs">
                                        <iframe
                                            src={`https://www.youtube.com/embed/${ytId}`}
                                            title={data.title}
                                            className="h-full w-full border-0 block"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        />
                                    </div>
                                ) : imagePreview ? (
                                    <div className="aspect-[2/1] w-full overflow-hidden rounded-2xl bg-[#FAF1E8] border border-[#E8CEBC] shadow-xs">
                                        <img
                                            src={imagePreview}
                                            alt={data.title}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                ) : null}

                                <div
                                    id="article-content-body"
                                    className="rounded-3xl border border-[#E8CEBC] bg-[#FAF1E8] p-6 sm:p-10 md:p-12 shadow-xs"
                                >
                                    <div
                                        className="article-content prose prose-sm sm:prose-base lg:prose-lg max-w-none text-[#4A2619] prose-headings:text-[#1D4533] prose-p:leading-relaxed prose-strong:text-[#1D4533] prose-blockquote:border-[#8C5E43] prose-blockquote:text-[#5E3122] prose-a:text-[#1D4533] [hyphens:none] [overflow-wrap:break-word] [word-break:normal]"
                                        dangerouslySetInnerHTML={{
                                            __html: renderArticleHtml(
                                                data.content,
                                            ),
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </main>
        </div>
    );
}
