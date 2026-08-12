import { Clock3 } from 'lucide-react';
import { Article } from '../types';
import { Link } from '@inertiajs/react';

// Fungsi format tanggal ke format Indonesia
const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
};

export function CategoryBadge({ children }: { children: React.ReactNode }) {
    return (
        <span className="inline-flex w-fit rounded-sm bg-[#063f2f] px-2 py-1 text-[8px] font-bold tracking-wider text-white uppercase">
            {children}
        </span>
    );
}

export function ArticleMeta({ date, readTime }: { date: string; readTime: string }) {
    return (
        <div className="flex items-center gap-2 text-[10px] text-[#888]">
            <span>{date}</span>
            <span className="h-[3px] w-[3px] rounded-full bg-[#ccc]" />
            <span className="flex items-center gap-1">
                <Clock3 size={10} />
                {readTime}
            </span>
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
                        date={formatDate(article.created_at)} 
                        readTime={`${article.read_time} min read`} 
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
                        date={formatDate(article.created_at)} 
                        readTime={`${article.read_time} min read`} 
                    />
                </div>
            </div>
        </Link>
    );
}