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
} from "lucide-react";
import { Category, Article } from "@/types";
import React, { useState, useEffect, useMemo } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

import Cropper from "react-easy-crop";
import getCroppedImg from "@/Utils/cropImage";

interface QuoteItem {
    id?: number;
    arabic: string;
    translation: string;
    reference: string;
}

interface EditProps {
    article: Article;
    categories: Category[];
    quote?: QuoteItem | null;
}

export default function ArticleEdit({ article, categories, quote }: EditProps) {
    const [imageSourceType, setImageSourceType] = useState<"file" | "url">(
        "file",
    );
    const [viewMode, setViewMode] = useState<"edit" | "preview">("edit");

    // State Khusus Cropper
    const [cropModalOpen, setCropModalOpen] = useState(false);
    const [tempImageSrc, setTempImageSrc] = useState<string | null>(
        article.image || null,
    );
    const [imagePreview, setImagePreview] = useState<string | null>(
        article.image || null,
    );
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

    const handleOpenCropModal = () => {
        if (!tempImageSrc && imagePreview) {
            setTempImageSrc(imagePreview);
        }
        setCropModalOpen(true);
    };

    // Form Inertia (TAMBAHKAN transform DISINI)
    const { data, setData, post, processing, errors, transform } = useForm({
        _method: "POST", // Tetap POST multipart untuk Laravel Route Update
        title: article.title || "",
        category_id: article.category_id || categories[0]?.id || "",
        image_file: null as File | null,
        image_url: "",
        description: article.description || "",
        content: article.content || "",
        is_published: Boolean(article.is_published),
        quote_arabic: quote?.arabic || "",
        quote_translation: quote?.translation || "",
        quote_reference: quote?.reference || "",
    });

    // Deteksi Kategori Tafsir
    const selectedCategory = categories.find(
        (c) => c.id === Number(data.category_id),
    );
    const isTafsirCategory = selectedCategory?.name
        ?.toLowerCase()
        .includes("tafsir");

    // MENCEGAT DAN MEMBERSIHKAN DATA SEBELUM DIKIRIM
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
    }));

    // Sinkronisasi Preview Gambar
    useEffect(() => {
        if (imageSourceType === "file" && data.image_file) {
            const objectUrl = URL.createObjectURL(data.image_file);
            setImagePreview(objectUrl);
            return () => URL.revokeObjectURL(objectUrl);
        } else if (imageSourceType === "url" && data.image_url) {
            setImagePreview(data.image_url);
        } else if (!data.image_file && !data.image_url) {
            setImagePreview(article.image || null);
        }
    }, [data.image_file, data.image_url, imageSourceType, article.image]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];

            // 1. Validasi maksimal 2 MB
            if (file.size > 2 * 1024 * 1024) {
                alert(
                    "Ukuran gambar terlalu besar! Maksimal 2 MB agar server hemat penyimpanan.",
                );
                e.target.value = ""; // Reset input file
                return;
            }

            // 2. Baca file dan buka modal crop
            const reader = new FileReader();
            reader.addEventListener("load", () => {
                setTempImageSrc(reader.result?.toString() || null);
                setCropModalOpen(true);
            });
            reader.readAsDataURL(file);
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

    // Konfigurasi Lengkap Quill + Matcher untuk EDIT
    const quillModules = useMemo(
        () => ({
            toolbar: [
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

    return (
        <div className="min-h-screen bg-[#f4f4f0] text-[#17251f]">
            <Head title={`Edit: ${article.title} - Abu Haidar`} />

            <header className="border-b border-[#e5e2da] bg-white shadow-xs sticky top-0 z-30">
                <div className="mx-auto flex max-w-[1000px] items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/admin/articles"
                            className="flex items-center gap-1.5 rounded-lg border border-[#dcd7ce] bg-white px-3 py-2 text-[12px] font-medium text-[#333] transition hover:bg-[#faf8f5]"
                        >
                            <ArrowLeft size={14} /> Kembali
                        </Link>
                        <h1 className="font-serif text-[18px] font-bold text-[#111] hidden sm:block truncate max-w-sm">
                            Edit: {article.title}
                        </h1>
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={processing}
                        className="flex items-center gap-2 rounded-xl bg-[#063f2f] px-5 py-2.5 text-[13px] font-bold text-white transition hover:bg-[#07513c] shadow-sm disabled:opacity-50"
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
                    <div className="rounded-2xl border border-[#e5e2da] bg-white p-8 shadow-sm space-y-5">
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
                                className="w-full rounded-xl border border-[#dcd7ce] px-4 py-3 text-[16px] font-serif font-bold focus:border-[#063f2f] focus:outline-none"
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
                                className="w-full rounded-xl border border-[#dcd7ce] px-4 py-3 text-[14px] bg-white focus:border-[#063f2f] focus:outline-none"
                            >
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-3 rounded-xl border border-[#e8e4da] bg-[#faf9f6] p-4">
                            <div className="flex items-center justify-between">
                                <label className="block text-[12px] font-bold uppercase tracking-wider text-[#555] flex items-center gap-2">
                                    <ImageIcon
                                        size={16}
                                        className="text-[#063f2f]"
                                    />{" "}
                                    Gambar Sampul
                                </label>
                                <div className="flex rounded-lg border border-[#dcd7ce] bg-white p-0.5 text-[11px] font-bold">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setImageSourceType("file")
                                        }
                                        className={`flex items-center gap-1 rounded-md px-3 py-1.5 transition ${imageSourceType === "file" ? "bg-[#063f2f] text-white" : "text-[#666]"}`}
                                    >
                                        <Upload size={12} /> Upload File
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setImageSourceType("url")
                                        }
                                        className={`flex items-center gap-1 rounded-md px-3 py-1.5 transition ${imageSourceType === "url" ? "bg-[#063f2f] text-white" : "text-[#666]"}`}
                                    >
                                        <Link2 size={12} /> Tautan Link
                                    </button>
                                </div>
                            </div>

                            {imageSourceType === "file" ? (
                                <div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileSelect}
                                        className="w-full text-[13px] text-[#555] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-[12px] file:font-bold file:bg-[#e9e6df] file:text-[#063f2f] hover:file:bg-[#dfdbd3] cursor-pointer"
                                    />
                                    <p className="mt-1 text-[11px] text-[#888]">
                                        Biarkan kosong jika tidak ingin mengubah
                                        gambar saat ini.
                                    </p>
                                </div>
                            ) : (
                                <div>
                                    <input
                                        type="url"
                                        value={data.image_url}
                                        onChange={(e) =>
                                            setData("image_url", e.target.value)
                                        }
                                        placeholder="https://domain.com/gambar-artikel.jpg"
                                        className="w-full rounded-xl border border-[#dcd7ce] bg-white px-4 py-2.5 text-[13px] focus:border-[#063f2f] focus:outline-none"
                                    />
                                </div>
                            )}

                            {imagePreview && (
                                <div className="mt-3 relative h-44 w-full max-w-sm overflow-hidden rounded-xl border border-[#dcd7ce] group bg-[#f0eee9]">
                                    <img
                                        src={imagePreview}
                                        alt="Thumbnail Preview"
                                        className="h-full w-full object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleOpenCropModal}
                                        className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 text-white font-bold text-[12px] opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Crop size={16} /> Sesuaikan / Pangkas
                                        Ulang
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* MODAL CROP */}
                        {cropModalOpen && tempImageSrc && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
                                <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl space-y-4">
                                    <div className="flex items-center justify-between border-b border-[#e9e6df] pb-3">
                                        <h3 className="font-serif text-[16px] font-bold text-[#17251f] flex items-center gap-2">
                                            <Crop
                                                size={18}
                                                className="text-[#063f2f]"
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
                                            className="w-full h-1.5 bg-[#e9e6df] rounded-lg appearance-none cursor-pointer accent-[#063f2f]"
                                        />
                                    </div>
                                    <div className="flex justify-end gap-3 pt-2">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setCropModalOpen(false)
                                            }
                                            className="rounded-xl border border-[#dcd7ce] px-4 py-2 text-[13px] font-bold text-[#555] hover:bg-[#faf8f5]"
                                        >
                                            Batal
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleSaveCrop}
                                            className="flex items-center gap-2 rounded-xl bg-[#063f2f] px-5 py-2 text-[13px] font-bold text-white hover:bg-[#07513c]"
                                        >
                                            <Check size={16} /> Terapkan
                                            Potongan
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {isTafsirCategory && (
                            <div className="space-y-4 rounded-xl border border-[#063f2f]/20 bg-[#f4f8f6] p-5">
                                <div className="flex items-center gap-2 border-b border-[#063f2f]/10 pb-2">
                                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#063f2f] text-[10px] text-white font-bold">
                                        ✓
                                    </span>
                                    <h4 className="text-[13px] font-bold text-[#063f2f]">
                                        Kutipan Tafsir Ayat (Quotes Card)
                                    </h4>
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#555] mb-1">
                                        Teks Ayat Arab
                                    </label>
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
                                        className="w-full rounded-xl border border-[#dcd7ce] bg-white px-4 py-2.5 text-[18px] font-serif focus:border-[#063f2f] focus:outline-none text-right"
                                    />
                                </div>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#555] mb-1">
                                            Terjemahan Arti
                                        </label>
                                        <input
                                            type="text"
                                            value={data.quote_translation}
                                            onChange={(e) =>
                                                setData(
                                                    "quote_translation",
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Sesungguhnya yang paling mulia..."
                                            className="w-full rounded-xl border border-[#dcd7ce] bg-white px-4 py-2 text-[13px] focus:border-[#063f2f] focus:outline-none"
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
                                            className="w-full rounded-xl border border-[#dcd7ce] bg-white px-4 py-2 text-[13px] focus:border-[#063f2f] focus:outline-none"
                                        />
                                    </div>
                                </div>
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
                                placeholder="Ringkasan singkat yang akan muncul di daftar artikel web..."
                                className="w-full rounded-xl border border-[#dcd7ce] px-4 py-3 text-[14px] focus:border-[#063f2f] focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* BLOK EDITOR & PREVIEW */}
                    <div className="rounded-2xl border border-[#e5e2da] bg-white shadow-sm">
                        <div className="flex border-b border-[#e5e2da] bg-[#faf8f5] rounded-t-2xl overflow-hidden">
                            <button
                                type="button"
                                onClick={() => setViewMode("edit")}
                                className={`flex-1 py-4 text-[13px] font-bold transition-colors ${viewMode === "edit" ? "bg-white text-[#063f2f] border-t-[3px] border-[#063f2f]" : "text-[#777] hover:bg-[#f0ece1]"}`}
                            >
                                <Edit3 size={16} className="inline mr-2" /> Mode
                                Menulis (Word)
                            </button>
                            <button
                                type="button"
                                onClick={() => setViewMode("preview")}
                                className={`flex-1 py-4 text-[13px] font-bold transition-colors ${viewMode === "preview" ? "bg-white text-[#063f2f] border-t-[3px] border-[#063f2f]" : "text-[#777] hover:bg-[#f0ece1]"}`}
                            >
                                <Eye size={16} className="inline mr-2" />{" "}
                                Pratinjau Website Asli
                            </button>
                        </div>

                        <div
                            className={`${viewMode === "edit" ? "block" : "hidden"} p-6 sm:p-12 bg-[#faf7f0] rounded-b-2xl quill-wrapper relative`}
                        >
                            <div className="sticky top-[73px] z-20 bg-[#faf8f5] border border-[#e5e2da] border-b-0 rounded-t-2xl shadow-xs max-w-[800px] mx-auto"></div>
                            <div className="rounded-b-2xl rounded-t-none bg-white shadow-sm border border-[#e8e4da] max-w-[800px] mx-auto relative">
                                <ReactQuill
                                    theme="snow"
                                    value={data.content}
                                    onChange={(content) =>
                                        setData("content", content)
                                    }
                                    modules={quillModules}
                                    className="bg-white rounded-lg"
                                    placeholder="Mulai menulis artikel di sini..."
                                />
                            </div>
                        </div>

                        <div
                            className={`${viewMode === "preview" ? "block" : "hidden"} p-6 sm:p-12 bg-[#faf7f0] rounded-b-2xl`}
                        >
                            <div className="rounded-2xl bg-white p-10 shadow-sm border border-[#e8e4da] max-w-[800px] mx-auto">
                                <h1 className="font-serif text-[28px] sm:text-[36px] font-bold text-[#17251f] mb-4 leading-tight">
                                    {data.title ||
                                        "Judul Artikel Akan Tampil Di Sini"}
                                </h1>

                                {imagePreview && (
                                    <div className="mb-8 w-full overflow-hidden rounded-xl aspect-[2/1] bg-[#f0eee9]">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                )}

                                {isTafsirCategory && data.quote_arabic && (
                                    <div className="mb-8 rounded-xl bg-[#f4f8f6] border-l-4 border-[#063f2f] p-6 text-center">
                                        <p
                                            className="font-serif text-[22px] text-[#063f2f] leading-loose mb-3"
                                            dir="rtl"
                                        >
                                            {data.quote_arabic}
                                        </p>
                                        <p className="italic text-[13px] text-[#555] mb-1">
                                            "{data.quote_translation}"
                                        </p>
                                        <span className="text-[11px] font-bold text-[#063f2f] uppercase tracking-wider">
                                            {data.quote_reference}
                                        </span>
                                    </div>
                                )}

                                <div
                                    className="prose prose-sm sm:prose-base lg:prose-lg max-w-none text-[#333] 
    prose-headings:text-[#17251f] 
    prose-li:list-decimal prose-li:pl-2
    prose-p:leading-relaxed prose-p:text-justify md:prose-p:text-left
    [overflow-wrap:normal] [word-break:normal] [hyphens:none]"
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
                .quill-wrapper .ql-toolbar.ql-snow {
                    position: sticky;
                    top: 73px;
                    z-index: 20;
                    background-color: #faf8f5 !important;
                    border: 1px solid #e5e2da !important;
                    border-bottom: 1px solid #e5e2da !important;
                    border-top-left-radius: 1rem;
                    border-top-right-radius: 1rem;
                    padding: 12px 24px !important;
                    max-width: 800px;
                    margin: 0 auto;
                }
                .quill-wrapper .ql-container.ql-snow {
                    border: none !important;
                    font-family: inherit !important;
                    font-size: 16px !important;
                }
                .quill-wrapper .ql-editor {
                    min-height: 500px;
                    padding: 40px !important; 
                    line-height: 1.8;
                    color: #333;
                }
                .quill-wrapper .ql-editor [dir="rtl"] {
                    font-family: 'Traditional Arabic', serif;
                    font-size: 24px;
                    color: #063f2f;
                    line-height: 2.2;
                }
            `,
                }}
            />
        </div>
    );
}
