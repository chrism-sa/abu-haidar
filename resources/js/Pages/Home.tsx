import {
    ArrowRight,
    BookOpen,
    ChevronDown,
    ChevronRight,
    Clock3,
    Menu,
    Search,
    UserRound,
    X,
} from 'lucide-react';
import { useState } from 'react';

type Article = {
    category: string;
    title: string;
    date: string;
    readTime: string;
    image: string;
    description?: string;
};

const latestArticles: Article[] = [
    {
        category: 'AKIDAH',
        title: 'Tawakal yang Sebenarnya kepada Allah',
        date: '8 Mei 2026',
        readTime: '6 min read',
        image:
            'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=900&q=85',
        description:
            'Tawakal bukan berarti pasrah tanpa usaha, tetapi menyerahkan hasil kepada Allah setelah melakukan ikhtiar.',
    },
    {
        category: "TAFSIR AL-QUR'AN",
        title: 'Tadabbur Surah Al-Ikhlas',
        date: '6 Mei 2026',
        readTime: '7 min read',
        image:
            'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=900&q=85',
        description:
            'Surah Al-Ikhlas adalah surah yang penuh dengan makna tentang tauhid dan keesaan Allah.',
    },
    {
        category: 'IBADAH',
        title: 'Keutamaan Shalat Tahajud',
        date: '4 Mei 2026',
        readTime: '5 min read',
        image:
            'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&w=900&q=85',
        description:
            'Shalat tahajud menjadi salah satu ibadah malam yang memiliki banyak keutamaan.',
    },
    {
        category: 'ILMU',
        title: 'Menuntut Ilmu, Jalan Menuju Surga',
        date: '2 Mei 2026',
        readTime: '6 min read',
        image:
            'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=900&q=85',
        description:
            'Menuntut ilmu adalah jalan mulia yang mengantarkan seorang muslim kepada kebaikan.',
    },
];

const selectedArticles: Article[] = [
    {
        category: "TAFSIR AL-QUR'AN",
        title: 'Makna Surah Al-Fatihah dan Ayat Demi Ayat',
        date: '1 Mei 2026',
        readTime: '8 min read',
        image:
            'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=500&q=80',
        description:
            'Memahami makna mendalam dari setiap ayat dalam Surah Al-Fatihah.',
    },
    {
        category: 'AKIDAH',
        title: 'Sifat Allah yang Wajib Diketahui',
        date: '29 Apr 2026',
        readTime: '6 min read',
        image:
            'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=500&q=80',
        description:
            'Mengenal sifat-sifat Allah dengan landasan Al-Qur’an dan sunnah.',
    },
    {
        category: 'SIRAH',
        title: 'Perjalanan Nabi Muhammad di Makkah',
        date: '27 Apr 2026',
        readTime: '7 min read',
        image:
            'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?auto=format&fit=crop&w=500&q=80',
        description:
            'Menyelami perjalanan dakwah Rasulullah ﷺ pada periode Makkah.',
    },
    {
        category: 'FIQIH',
        title: 'Hukum dan Adab Berdoa dalam Islam',
        date: '25 Apr 2026',
        readTime: '5 min read',
        image:
            'https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&w=500&q=80',
        description:
            'Adab berdoa serta waktu-waktu mustajab agar doa lebih mudah dikabulkan.',
    },
];

const categories = [
    { name: "Tafsir Al-Qur'an", count: 18 },
    { name: 'Hadis', count: 16 },
    { name: 'Akidah', count: 14 },
    { name: 'Fiqih', count: 13 },
    { name: 'Ibadah', count: 20 },
    { name: 'Sirah Nabi', count: 12 },
    { name: 'Keluarga Muslim', count: 10 },
    { name: 'Motivasi Islam', count: 15 },
];

const popularArticles = [
    'Tanda-Tanda Hati yang Mulai Keras',
    'Doa di 9 Waktu yang Dianjurkan',
    'Keutamaan Membaca Al-Qur’an Setiap Hari',
    'Amalan Ringan tapi Pahalanya Besar',
    'Cara Agar Istiqamah dalam Kebaikan',
];

const heroArticle = {
    category: 'ARTIKEL TERBARU',
    title: 'Ikhlas, Kunci Diterimanya Amal di Sisi Allah',
    description:
        'Allah tidak melihat bentuk amalmu, tetapi melihat keikhlasan hati di baliknya. Ketika niat hanya untuk-Nya, amal sekecil apa pun menjadi besar nilainya.',
    image:
        'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=1400&q=90',
};

function CategoryBadge({ children }: { children: React.ReactNode }) {
    return (
        <span className="inline-flex w-fit rounded-full bg-[#063f2f] px-2.5 py-1 text-[9px] font-bold tracking-wide text-white">
            {children}
        </span>
    );
}

function ArticleMeta({
    date,
    readTime,
}: {
    date: string;
    readTime: string;
}) {
    return (
        <div className="flex items-center gap-3 text-[10px] text-[#777]">
            <span>{date}</span>

            <span className="h-1 w-1 rounded-full bg-[#b5b5b5]" />

            <span className="flex items-center gap-1">
                <Clock3 size={11} />
                {readTime}
            </span>
        </div>
    );
}

function ArticleCard({ article }: { article: Article }) {
    return (
        <article className="group overflow-hidden rounded-xl border border-[#e8e4da] bg-white transition duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="aspect-[1.35/1] overflow-hidden">
                <img
                    src={article.image}
                    alt={article.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
            </div>

            <div className="p-4">
                <CategoryBadge>{article.category}</CategoryBadge>

                <h3 className="mt-3 line-clamp-2 font-serif text-[17px] font-bold leading-snug text-[#14251e]">
                    {article.title}
                </h3>

                <p className="mt-2 line-clamp-2 text-[11px] leading-relaxed text-[#777]">
                    {article.description}
                </p>

                <div className="mt-4">
                    <ArticleMeta
                        date={article.date}
                        readTime={article.readTime}
                    />
                </div>
            </div>
        </article>
    );
}

function CompactArticle({ article }: { article: Article }) {
    return (
        <article className="flex gap-3 border-b border-[#ebe7df] pb-4 last:border-0 last:pb-0">
            <img
                src={article.image}
                alt={article.title}
                className="h-[70px] w-[88px] shrink-0 rounded-lg object-cover"
            />

            <div className="min-w-0">
                <CategoryBadge>{article.category}</CategoryBadge>

                <h4 className="mt-1 line-clamp-2 font-serif text-[13px] font-bold leading-snug text-[#17251f]">
                    {article.title}
                </h4>

                <ArticleMeta
                    date={article.date}
                    readTime={article.readTime}
                />
            </div>
        </article>
    );
}

function QuoteCard() {
    return (
        <div className="rounded-2xl border border-[#e8dfce] bg-[#faf7f0] p-5">
            <div className="flex items-center gap-2">
                <span className="h-px flex-1 bg-[#d6b56c]" />
                <span className="font-serif text-xs text-[#b18a42]">✦</span>
                <span className="h-px flex-1 bg-[#d6b56c]" />
            </div>

            <p
                dir="rtl"
                className="mt-5 text-center font-serif text-[23px] leading-[2] text-[#173c2f]"
            >
                إِنَّ اللَّهَ لَا يَغْفِرُ أَنْ يُشْرَكَ بِهِ
            </p>

            <p className="mt-4 text-center text-[10px] leading-relaxed text-[#777]">
                “Sesungguhnya Allah tidak akan mengampuni dosa syirik kepada-Nya
                dan Dia mengampuni dosa selain itu bagi siapa yang dikehendaki.”
            </p>

            <p className="mt-3 text-center text-[10px] font-semibold text-[#174f3b]">
                (QS. An-Nisa: 48)
            </p>

            <button className="mx-auto mt-5 flex items-center gap-1 text-[10px] font-bold text-[#174f3b]">
                Baca Tafsir
                <ArrowRight size={12} />
            </button>
        </div>
    );
}

function Sidebar() {
    return (
        <aside className="space-y-5">
            <QuoteCard />

            <section className="rounded-2xl border border-[#e8e4da] bg-white p-5">
                <h3 className="font-serif text-base font-bold text-[#17251f]">
                    Kategori
                </h3>

                <div className="mt-4 space-y-3">
                    {categories.map((category) => (
                        <div
                            key={category.name}
                            className="flex items-center justify-between text-[11px]"
                        >
                            <span className="flex items-center gap-2 text-[#555]">
                                <BookOpen
                                    size={12}
                                    className="text-[#126047]"
                                />
                                {category.name}
                            </span>

                            <span className="text-[#999]">
                                {category.count}
                            </span>
                        </div>
                    ))}
                </div>
            </section>

            <section className="rounded-2xl border border-[#e8e4da] bg-white p-5">
                <h3 className="font-serif text-base font-bold text-[#17251f]">
                    Artikel Populer
                </h3>

                <div className="mt-4 space-y-4">
                    {popularArticles.map((article, index) => (
                        <div
                            key={article}
                            className="flex items-start gap-3"
                        >
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#063f2f] text-[9px] font-bold text-white">
                                {index + 1}
                            </span>

                            <p className="text-[11px] font-medium leading-relaxed text-[#444]">
                                {article}
                            </p>
                        </div>
                    ))}
                </div>
            </section>
        </aside>
    );
}

export default function Home() {
    const [mobileMenu, setMobileMenu] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#fafaf8] text-[#17251f]">
            {/* ================= HEADER ================= */}
            <header className="sticky top-0 z-50 border-b border-[#e9e6df] bg-white/95 backdrop-blur">
                <div className="mx-auto max-w-[1240px] px-5 lg:px-8">
                    <div className="flex h-[72px] items-center justify-between gap-6">
                        {/* LOGO */}
                        <a
                            href="/"
                            className="flex shrink-0 items-center gap-3"
                        >
                            <img
                                src="/LOGO.png"
                                alt="Abu Hurairah"
                                className="h-12 w-auto object-contain"
                            />

                            <div className="hidden sm:block">
                                <div className="font-serif text-[18px] font-bold leading-none text-[#123f31]">
                                    Abu Hurairah
                                </div>

                                <div className="mt-1 text-[9px] tracking-wide text-[#777]">
                                    Artikel Islam & Dakwah
                                </div>
                            </div>
                        </a>

                        {/* DESKTOP NAV */}
                        <nav className="hidden items-center gap-5 lg:flex">
                            {[
                                'Beranda',
                                'Artikel',
                                "Tafsir Al-Qur'an",
                                'Hadis',
                                'Akidah',
                                'Fiqih',
                                'Sirah',
                            ].map((item) => (
                                <a
                                    key={item}
                                    href="#"
                                    className={`whitespace-nowrap text-[11px] font-medium transition hover:text-[#0b6045] ${
                                        item === 'Beranda'
                                            ? 'font-bold text-[#0b6045]'
                                            : 'text-[#333]'
                                    }`}
                                >
                                    {item}
                                </a>
                            ))}
                        </nav>

                        {/* ACTIONS */}
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setSearchOpen(!searchOpen)}
                                className="rounded-full p-2 text-[#333] transition hover:bg-[#f3f1eb]"
                                aria-label="Search"
                            >
                                <Search size={17} />
                            </button>

                            <a
                                href="/login"
                                className="hidden items-center gap-2 rounded-full bg-[#063f2f] px-4 py-2 text-[10px] font-bold text-white transition hover:bg-[#07513c] sm:flex"
                            >
                                <UserRound size={13} />
                                Login Admin
                            </a>

                            <button
                                onClick={() => setMobileMenu(!mobileMenu)}
                                className="rounded-full p-2 lg:hidden"
                                aria-label="Menu"
                            >
                                {mobileMenu ? (
                                    <X size={21} />
                                ) : (
                                    <Menu size={21} />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* SEARCH */}
                    {searchOpen && (
                        <div className="border-t border-[#eee] py-3">
                            <div className="relative">
                                <Search
                                    size={16}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#999]"
                                />

                                <input
                                    type="text"
                                    placeholder="Cari artikel..."
                                    autoFocus
                                    className="w-full rounded-xl border border-[#dedbd2] bg-[#fafaf8] py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[#0b6045]"
                                />
                            </div>
                        </div>
                    )}

                    {/* MOBILE MENU */}
                    {mobileMenu && (
                        <div className="border-t border-[#eee] py-4 lg:hidden">
                            <nav className="space-y-1">
                                {[
                                    'Beranda',
                                    'Artikel',
                                    "Tafsir Al-Qur'an",
                                    'Hadis',
                                    'Akidah',
                                    'Fiqih',
                                    'Sirah',
                                ].map((item) => (
                                    <a
                                        key={item}
                                        href="#"
                                        onClick={() => setMobileMenu(false)}
                                        className="block rounded-lg px-3 py-3 text-sm text-[#333] hover:bg-[#f5f4ef]"
                                    >
                                        {item}
                                    </a>
                                ))}
                            </nav>

                            <a
                                href="/login"
                                className="mt-3 flex items-center justify-center gap-2 rounded-lg bg-[#063f2f] px-4 py-3 text-sm font-bold text-white"
                            >
                                <UserRound size={16} />
                                Login Admin
                            </a>
                        </div>
                    )}
                </div>
            </header>

            {/* ================= MAIN ================= */}
            <main>
                {/* HERO */}
                <section className="border-b border-[#ebe7df] bg-[#f8f6f0]">
                    <div className="mx-auto max-w-[1240px] px-5 py-8 lg:px-8 lg:py-12">
                        <div className="grid overflow-hidden rounded-2xl border border-[#e6e1d7] bg-white shadow-sm lg:grid-cols-[1fr_1.3fr]">
                            {/* HERO TEXT */}
                            <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-12">
                                <CategoryBadge>
                                    {heroArticle.category}
                                </CategoryBadge>

                                <h1 className="mt-5 max-w-xl font-serif text-[31px] font-bold leading-[1.15] text-[#10251d] sm:text-[38px] lg:text-[44px]">
                                    {heroArticle.title}
                                </h1>

                                <p className="mt-5 max-w-xl text-[13px] leading-[1.9] text-[#666]">
                                    {heroArticle.description}
                                </p>

                                <a
                                    href="#"
                                    className="mt-7 flex w-fit items-center gap-2 rounded-lg bg-[#063f2f] px-5 py-3 text-[11px] font-bold text-white transition hover:bg-[#07513c]"
                                >
                                    Baca Selengkapnya
                                    <ArrowRight size={14} />
                                </a>
                            </div>

                            {/* HERO IMAGE */}
                            <div className="min-h-[300px] overflow-hidden lg:min-h-[470px]">
                                <img
                                    src={heroArticle.image}
                                    alt={heroArticle.title}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* CONTENT */}
                <section className="mx-auto max-w-[1240px] px-5 py-10 lg:px-8 lg:py-14">
                    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
                        {/* LEFT */}
                        <div className="min-w-0">
                            {/* LATEST */}
                            <section>
                                <div className="mb-5 flex items-center justify-between">
                                    <div>
                                        <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#0c6247]">
                                            Artikel
                                        </p>

                                        <h2 className="mt-1 font-serif text-[25px] font-bold text-[#17251f]">
                                            Artikel Terbaru
                                        </h2>
                                    </div>

                                    <a
                                        href="#"
                                        className="flex items-center gap-1 text-[10px] font-bold text-[#126047]"
                                    >
                                        Lihat Semua
                                        <ChevronRight size={13} />
                                    </a>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                                    {latestArticles.map((article) => (
                                        <ArticleCard
                                            key={article.title}
                                            article={article}
                                        />
                                    ))}
                                </div>
                            </section>

                            {/* SELECTED */}
                            <section className="mt-12">
                                <div className="mb-5">
                                    <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#0c6247]">
                                        Pilihan Redaksi
                                    </p>

                                    <h2 className="mt-1 font-serif text-[25px] font-bold text-[#17251f]">
                                        Artikel Pilihan
                                    </h2>
                                </div>

                                <div className="space-y-4">
                                    {selectedArticles.map((article) => (
                                        <CompactArticle
                                            key={article.title}
                                            article={article}
                                        />
                                    ))}
                                </div>
                            </section>
                        </div>

                        {/* SIDEBAR */}
                        <Sidebar />
                    </div>
                </section>
            </main>

            {/* ================= FOOTER ================= */}
            <footer className="border-t border-[#e5e1d8] bg-[#063f2f] text-white">
                <div className="mx-auto max-w-[1240px] px-5 py-10 lg:px-8">
                    <div className="grid gap-8 md:grid-cols-3">
                        <div>
                            <img
                                src="/LOGO2.png"
                                alt="Abu Hurairah"
                                className="h-14 w-auto object-contain brightness-0 invert"
                            />

                            <p className="mt-4 max-w-sm text-[11px] leading-relaxed text-white/65">
                                Artikel Islam & Dakwah yang menghadirkan tulisan
                                seputar Al-Qur’an, hadis, akidah, fiqih, sirah,
                                dan kehidupan seorang muslim.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-serif text-base font-bold">
                                Navigasi
                            </h3>

                            <div className="mt-4 grid grid-cols-2 gap-3 text-[11px] text-white/70">
                                <a href="#">Beranda</a>
                                <a href="#">Artikel</a>
                                <a href="#">Tafsir Al-Qur'an</a>
                                <a href="#">Hadis</a>
                                <a href="#">Akidah</a>
                                <a href="#">Fiqih</a>
                                <a href="#">Sirah</a>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-serif text-base font-bold">
                                Ikuti Kami
                            </h3>

                            <div className="mt-4 flex gap-2">
                                <a
                                    href="#"
                                    className="rounded-lg border border-white/15 px-3 py-2 text-[10px] text-white/75 hover:bg-white/10"
                                >
                                    Facebook
                                </a>

                                <a
                                    href="#"
                                    className="rounded-lg border border-white/15 px-3 py-2 text-[10px] text-white/75 hover:bg-white/10"
                                >
                                    Instagram
                                </a>

                                <a
                                    href="#"
                                    className="rounded-lg border border-white/15 px-3 py-2 text-[10px] text-white/75 hover:bg-white/10"
                                >
                                    YouTube
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 border-t border-white/10 pt-5 text-center text-[10px] text-white/45">
                        © 2026 Abu Hurairah. Artikel Islam & Dakwah.
                    </div>
                </div>
            </footer>
        </div>
    );
}