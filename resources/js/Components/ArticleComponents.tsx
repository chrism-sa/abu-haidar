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

const getYouTubeId = (url: string | null | undefined) => {
    if (!url) return null;
    const regExp =
        /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
};

export function CategoryBadge({ children }: { children: React.ReactNode }) {
    return (
        <span className="inline-flex w-fit rounded-md bg-[#1D4533] px-2.5 py-0.5 text-[9px] font-bold tracking-wider text-[#F7EAE0] uppercase shadow-2xs">
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
        <div className="flex flex-wrap items-center gap-1.5 text-[10.5px] font-semibold text-[#5E3122]/70">
            <span>{formatDate(createdAt)}</span>
            {updatedAt && (
                <>
                    <span className="h-[3px] w-[3px] rounded-full bg-[#E8CEBC]" />
                    <span className="italic text-[#8C5E43]">
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
            className="group flex flex-col overflow-hidden rounded-2xl bg-[#FDF9F5] border border-[#E8CEBC] shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:border-[#1D4533]/40 hover:shadow-md block"
        >
            <div className="relative aspect-[16/10] overflow-hidden bg-[#F2E2D5]">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={article.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-[10px] font-bold tracking-wider text-[#5E3122]/50">
                        GAMBAR ARTIKEL
                    </div>
                )}

                {ytId && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-black/50 backdrop-blur-xs text-[#FDF9F5] shadow-md transition-all duration-300 group-hover:scale-110 group-hover:bg-red-600">
                            <FaYoutube size={20} />
                        </div>
                    </div>
                )}
            </div>

            <div className="flex flex-1 flex-col p-4 sm:p-5 bg-[#FDF9F5]">
                <CategoryBadge>{article.category.name}</CategoryBadge>

                <h3 className="mt-3 font-brand text-[15px] sm:text-[16px] font-bold leading-snug tracking-tight text-[#1D4533] line-clamp-2 transition-colors group-hover:text-[#5E3122]">
                    {article.title}
                </h3>

                <p className="mt-2 text-[12px] leading-relaxed text-[#5E3122]/75 line-clamp-2 flex-1">
                    {article.description}
                </p>

                <div className="mt-4 pt-3.5 border-t border-[#E8CEBC]/60">
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
            className="group flex gap-3.5 border-b border-[#E8CEBC]/60 py-3.5 first:pt-0 last:border-0 last:pb-0 block transition-all"
        >
            <div className="relative h-[72px] w-[100px] shrink-0 overflow-hidden rounded-xl border border-[#E8CEBC] bg-[#F2E2D5]">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={article.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-[8px] font-bold tracking-wider text-[#5E3122]/50">
                        NO IMG
                    </div>
                )}

                {ytId && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-black/50 backdrop-blur-2xs text-[#FDF9F5] transition-transform duration-300 group-hover:bg-red-600">
                            <FaYoutube size={12} />
                        </div>
                    </div>
                )}
            </div>

            <div className="flex min-w-0 flex-col justify-center">
                <CategoryBadge>{article.category.name}</CategoryBadge>

                <h4 className="mt-1.5 font-brand text-[13.5px] font-bold leading-snug tracking-tight text-[#1D4533] line-clamp-2 transition-colors group-hover:text-[#5E3122]">
                    {article.title}
                </h4>

                <div className="mt-1.5">
                    <ArticleMeta
                        createdAt={article.created_at}
                        updatedAt={article.updated_at}
                    />
                </div>
            </div>
        </Link>
    );
}
