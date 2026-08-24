import { Article } from "../types";
import { Link } from "@inertiajs/react";
import { FaYoutube } from "react-icons/fa";

// Format tanggal standar Indonesia (contoh: 18 Ags 2026)
const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
};

// Format waktu lampau relatif terhadap updated_at
const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    let interval = seconds / 31536000;
    if (interval >= 1) return `Diperbarui ${Math.floor(interval)} tahun lalu`;

    interval = seconds / 2592000;
    if (interval >= 1) return `Diperbarui ${Math.floor(interval)} bulan lalu`;

    interval = seconds / 86400;
    if (interval >= 1) return `Diperbarui ${Math.floor(interval)} hari lalu`;

    interval = seconds / 3600;
    if (interval >= 1) return `Diperbarui ${Math.floor(interval)} jam lalu`;

    interval = seconds / 60;
    if (interval >= 1) return `Diperbarui ${Math.floor(interval)} mnt lalu`;

    return "Baru saja diperbarui";
};

// HELPER MENDETEKSI LINK YOUTUBE
const getYouTubeId = (url: string | null | undefined) => {
    if (!url) return null;
    const regExp =
        /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
};

export function CategoryBadge({ children }: { children: React.ReactNode }) {
    return (
        <span className="inline-flex w-fit rounded-sm bg-[#0F4C3A] px-2 py-1 text-[8px] font-bold tracking-wider text-white uppercase">
            {children}
        </span>
    );
}

export function ArticleMeta({
    createdAt,
    updatedAt,
}: {
    createdAt: string;
    updatedAt?: string;
}) {
    return (
        <div className="flex flex-wrap items-center gap-2 text-[10px] text-[#6C857A]">
            <span>{formatDate(createdAt)}</span>
            {updatedAt && (
                <>
                    <span className="h-[3px] w-[3px] rounded-full bg-[#A5B9AD]" />
                    <span className="italic text-[#8CA397]">
                        {timeAgo(updatedAt)}
                    </span>
                </>
            )}
        </div>
    );
}

export function ArticleCard({ article }: { article: Article }) {
    const ytId = article.image ? getYouTubeId(article.image) : null;
    const imageUrl = ytId
        ? `https://img.youtube.com/vi/${ytId}/mqdefault.jpg`
        : article.image;

    return (
        <Link
            href={`/artikel/${article.slug}`}
            className="group flex flex-col overflow-hidden rounded-xl bg-white border border-[#E0EAE3] transition-all hover:shadow-md block"
        >
            <div className="relative aspect-[1.5/1] overflow-hidden bg-[#EBF1ED]">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={article.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-[10px] font-bold text-[#8CA397]">
                        NO IMG
                    </div>
                )}

                {/* Overlay Logo Play Jika Video YouTube */}
                {ytId && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm text-white shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:bg-red-600/90">
                            <FaYoutube size={24} />
                        </div>
                    </div>
                )}
            </div>

            <div className="flex flex-1 flex-col p-4">
                <CategoryBadge>{article.category.name}</CategoryBadge>

                {/* Judul menggunakan font-brand */}
                <h3 className="mt-3 font-brand text-[15px] font-bold leading-snug tracking-tight text-[#162B22] line-clamp-2 transition-colors group-hover:text-[#0F4C3A]">
                    {article.title}
                </h3>

                <p className="mt-2 text-[11px] leading-relaxed text-[#6C857A] line-clamp-2 flex-1">
                    {article.description}
                </p>
                <div className="mt-4 pt-4 border-t border-[#E0EAE3]">
                    <ArticleMeta
                        createdAt={article.created_at}
                        updatedAt={article.updated_at}
                    />
                </div>
            </div>
        </Link>
    );
}

export function CompactArticle({ article }: { article: Article }) {
    const ytId = article.image ? getYouTubeId(article.image) : null;
    const imageUrl = ytId
        ? `https://img.youtube.com/vi/${ytId}/mqdefault.jpg`
        : article.image;

    return (
        <Link
            href={`/artikel/${article.slug}`}
            className="group flex gap-4 border-b border-[#E0EAE3] py-4 first:pt-0 last:border-0 last:pb-0 block"
        >
            <div className="relative h-[80px] w-[110px] shrink-0 overflow-hidden rounded-lg bg-[#EBF1ED]">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={article.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-[9px] font-bold text-[#8CA397]">
                        NO IMG
                    </div>
                )}

                {/* Overlay Logo Play Kecil */}
                {ytId && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm text-white transition-transform duration-500 group-hover:bg-red-600/90">
                            <FaYoutube size={12} />
                        </div>
                    </div>
                )}
            </div>

            <div className="flex min-w-0 flex-col justify-center">
                <CategoryBadge>{article.category.name}</CategoryBadge>

                {/* Judul menggunakan font-brand */}
                <h4 className="mt-2 font-brand text-[14px] font-bold leading-snug tracking-tight text-[#162B22] line-clamp-2 transition-colors group-hover:text-[#0F4C3A]">
                    {article.title}
                </h4>

                <div className="mt-2">
                    <ArticleMeta
                        createdAt={article.created_at}
                        updatedAt={article.updated_at}
                    />
                </div>
            </div>
        </Link>
    );
}
