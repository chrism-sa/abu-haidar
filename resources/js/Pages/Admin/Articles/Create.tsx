import { Head, Link, useForm } from "@inertiajs/react";
import { ArrowLeft, Save, Image as ImageIcon, Eye, Edit3 } from "lucide-react";
import { Category } from "@/types";
import { useState, useEffect } from "react";

// Import pustaka React Quill dan CSS bawaannya
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

interface CreateProps {
    categories: Category[];
}

export default function ArticleCreate({ categories }: CreateProps) {
    const { data, setData, post, processing, errors } = useForm({
        title: "",
        category_id: categories[0]?.id || "",
        image: null as File | null,
        description: "",
        content: "",
        read_time: 3,
        is_published: true,
    });

    // State untuk beralih antara Editor dan Preview
    const [viewMode, setViewMode] = useState<"edit" | "preview">("edit");
    // State untuk menampilkan gambar lokal di mode preview
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    // Membuat URL sementara untuk gambar yang baru diupload klien agar bisa di-preview
    useEffect(() => {
        if (data.image) {
            const objectUrl = URL.createObjectURL(data.image);
            setImagePreview(objectUrl);
            return () => URL.revokeObjectURL(objectUrl);
        } else {
            setImagePreview(null);
        }
    }, [data.image]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post("/admin/articles");
    };

    // Konfigurasi Toolbar ala Microsoft Word
    const editorModules = {
        toolbar: [
            [{ header: [2, 3, 4, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ color: [] }, { background: [] }],
            [{ align: [] }],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ direction: "rtl" }], // Tombol Teks Arab
            ["link", "blockquote"],
            ["clean"],
        ],
    };

    return (
        <div className="min-h-screen bg-[#f4f4f0] text-[#17251f]">
            <Head title="Tulis Artikel - Abu Haidar CMS" />

            {/* HEADER KONTROL */}
            <header className="border-b border-[#e5e2da] bg-white shadow-xs sticky top-0 z-20">
                <div className="mx-auto flex max-w-[1000px] items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/admin/articles"
                            className="flex items-center gap-1.5 rounded-lg border border-[#dcd7ce] bg-white px-3 py-2 text-[12px] font-medium text-[#333] transition hover:bg-[#faf8f5]"
                        >
                            <ArrowLeft size={14} /> Kembali
                        </Link>
                        <h1 className="font-serif text-[18px] font-bold text-[#111] hidden sm:block">
                            Editor Artikel Dakwah
                        </h1>
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={processing}
                        className="flex items-center gap-2 rounded-xl bg-[#063f2f] px-5 py-2.5 text-[13px] font-bold text-white transition hover:bg-[#07513c] shadow-sm disabled:opacity-50"
                    >
                        <Save size={15} /> Simpan & Publikasikan
                    </button>
                </div>
            </header>

            <main className="mx-auto max-w-[900px] px-4 py-8">
                <form
                    onSubmit={handleSubmit}
                    className="space-y-6"
                    encType="multipart/form-data"
                >
                    {/* KARTU INFORMASI DASAR */}
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

                        <div className="grid gap-5 sm:grid-cols-2">
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
                            <div>
                                <label className="block text-[12px] font-bold uppercase tracking-wider text-[#555] mb-2">
                                    Waktu Baca (Menit)
                                </label>
                                <input
                                    type="number"
                                    value={data.read_time}
                                    onChange={(e) =>
                                        setData(
                                            "read_time",
                                            Number(e.target.value),
                                        )
                                    }
                                    className="w-full rounded-xl border border-[#dcd7ce] px-4 py-3 text-[14px] focus:border-[#063f2f] focus:outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[12px] font-bold uppercase tracking-wider text-[#555] mb-2 flex items-center gap-2">
                                <ImageIcon
                                    size={16}
                                    className="text-[#063f2f]"
                                />{" "}
                                Upload Gambar Sampul (Lokal)
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                    setData(
                                        "image",
                                        e.target.files
                                            ? e.target.files[0]
                                            : null,
                                    )
                                }
                                className="w-full text-[13px] text-[#555] file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-[13px] file:font-bold file:bg-[#f3f1eb] file:text-[#063f2f] hover:file:bg-[#e9e6df] cursor-pointer border border-dashed border-[#dcd7ce] p-2"
                            />
                        </div>

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

                    {/* KARTU KONTEN DENGAN FITUR TAB PREVIEW */}
                    <div className="rounded-2xl border border-[#e5e2da] bg-white shadow-sm overflow-hidden">
                        {/* Tab Navigasi Mode */}
                        <div className="flex border-b border-[#e5e2da] bg-[#faf8f5]">
                            <button
                                type="button"
                                onClick={() => setViewMode("edit")}
                                className={`flex-1 flex justify-center items-center gap-2 py-4 text-[13px] font-bold transition-colors ${viewMode === "edit" ? "bg-white text-[#063f2f] border-t-[3px] border-[#063f2f]" : "text-[#777] hover:bg-[#f0ece1]"}`}
                            >
                                <Edit3 size={16} /> Mode Menulis (Word)
                            </button>
                            <button
                                type="button"
                                onClick={() => setViewMode("preview")}
                                className={`flex-1 flex justify-center items-center gap-2 py-4 text-[13px] font-bold transition-colors ${viewMode === "preview" ? "bg-white text-[#063f2f] border-t-[3px] border-[#063f2f]" : "text-[#777] hover:bg-[#f0ece1]"}`}
                            >
                                <Eye size={16} /> Pratinjau Website Asli
                            </button>
                        </div>

                        {/* KONTEN BERDASARKAN TAB YANG AKTIF */}
                        <div className="bg-white">
                            {/* MODE 1: WYSIWYG EDITOR */}
                            <div
                                className={`${viewMode === "edit" ? "block" : "hidden"} quill-wrapper`}
                            >
                                <ReactQuill
                                    theme="snow"
                                    modules={editorModules}
                                    value={data.content}
                                    onChange={(content) =>
                                        setData("content", content)
                                    }
                                    placeholder="Mulai menulis artikel di sini..."
                                />
                            </div>

                            {/* MODE 2: LIVE PREVIEW (Tampilan persis web asli) */}
                            <div
                                className={`${viewMode === "preview" ? "block" : "hidden"} p-6 sm:p-12 bg-[#faf7f0]`}
                            >
                                {/* Kotak Artikel Tiruan */}
                                <div className="rounded-2xl bg-white p-6 sm:p-10 shadow-sm border border-[#e8e4da] max-w-[800px] mx-auto">
                                    {/* Judul & Meta */}
                                    <h1 className="font-serif text-[28px] sm:text-[36px] font-bold text-[#17251f] mb-4 leading-tight">
                                        {data.title ||
                                            "Judul Artikel Akan Tampil Di Sini"}
                                    </h1>

                                    {/* Gambar Sampul (Jika ada) */}
                                    {imagePreview && (
                                        <div className="mb-8 w-full overflow-hidden rounded-xl h-[300px]">
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                    )}

                                    {/* Isi Artikel dengan Tailwind Typography */}
                                    {data.content ? (
                                        <div
                                            className="prose prose-sm sm:prose-base lg:prose-lg max-w-none text-[#333] 
            prose-headings:font-serif prose-headings:text-[#17251f] prose-headings:mt-8 prose-headings:mb-4
            prose-p:leading-relaxed prose-p:my-5 prose-p:text-[16px] 
            prose-a:text-[#126047] prose-strong:text-[#111]
            prose-li:marker:text-[#126047] prose-li:my-2"
                                            dangerouslySetInnerHTML={{
                                                __html: data.content,
                                            }}
                                        />
                                    ) : (
                                        <p className="text-[#999] italic text-center py-10">
                                            Belum ada konten yang ditulis.
                                            Silakan kembali ke Mode Menulis.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </main>

            {/* Custom CSS untuk Editor & Preview */}
            <style dangerouslySetInnerHTML={{ __html: `
                .quill-wrapper .ql-toolbar {
                    border: none !important;
                    border-bottom: 1px solid #e5e2da !important;
                    background-color: #faf8f5;
                    padding: 12px 24px !important;
                }
                .quill-wrapper .ql-container {
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
                .quill-wrapper .ql-editor h2, .quill-wrapper .ql-editor h3 {
                    font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
                    color: #17251f;
                    margin-top: 1.5em;
                    margin-bottom: 0.5em;
                }

                /* --- TAMBAHAN BARU: AGAR PREVIEW SESUAI DENGAN EDITOR --- */
                .prose .ql-align-center { text-align: center !important; }
                .prose .ql-align-right { text-align: right !important; }
                .prose .ql-align-justify { text-align: justify !important; }
                .prose .ql-direction-rtl { 
                    direction: rtl !important; 
                    text-align: right !important; 
                    font-family: 'Traditional Arabic', serif;
                    font-size: 24px;
                    color: #063f2f;
                    line-height: 2.2;
                }
            `}} />
        </div>
    );
}