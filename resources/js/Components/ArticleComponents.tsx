import { Article } from '../types';
import { Link } from '@inertiajs/react';

// Format tanggal standar Indonesia (contoh: 18 Ags 2026)
const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
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

    return 'Baru saja diperbarui';
};

export function CategoryBadge({ children }: { children: React.ReactNode }) {
    return (
        <span className="inline-flex w-fit rounded-sm bg-[#063f2f] px-2 py-1 text-[8px] font-bold tracking-wider text-white uppercase">
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
        <div className="flex flex-wrap items-center gap-2 text-[10px] text-[#777]">
            <span>{formatDate(createdAt)}</span>
            {updatedAt && (
                <>
                    <span className="h-[3px] w-[3px] rounded-full bg-[#ccc]" />
                    <span className="italic text-[#888]">{timeAgo(updatedAt)}</span>
                </>
            )}
        </div>
    );
}

export function ArticleCard({ article }: { article: Article }) {
    return (
        <Link
            href={`/artikel/${article.slug}`}
            className="group flex flex-col overflow-hidden rounded-xl bg-[#fdfdfc] border border-[#f0eee9] transition-all hover:shadow-md block"
        >
            <div className="aspect-[1.5/1] overflow-hidden">
                <img
                    src={article.image}
                    alt={article.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
            </div>
            <div className="flex flex-1 flex-col p-4">
                <CategoryBadge>{article.category.name}</CategoryBadge>

                <h3 className="mt-3 font-serif text-[15px] font-bold leading-snug text-[#14251e] line-clamp-2 transition-colors group-hover:text-[#126047]">
                    {article.title}
                </h3>

                <p className="mt-2 text-[11px] leading-relaxed text-[#777] line-clamp-2 flex-1">
                    {article.description}
                </p>
                <div className="mt-4 pt-4 border-t border-[#f0eee9]">
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
    return (
        <Link
            href={`/artikel/${article.slug}`}
            className="group flex gap-4 border-b border-[#f0eee9] py-4 first:pt-0 last:border-0 last:pb-0 block"
        >
            <img
                src={article.image}
                alt={article.title}
                className="h-[80px] w-[110px] shrink-0 rounded-lg object-cover"
            />
            <div className="flex min-w-0 flex-col justify-center">
                <CategoryBadge>{article.category.name}</CategoryBadge>

                <h4 className="mt-2 font-serif text-[14px] font-bold leading-snug text-[#17251f] line-clamp-2 transition-colors group-hover:text-[#126047]">
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