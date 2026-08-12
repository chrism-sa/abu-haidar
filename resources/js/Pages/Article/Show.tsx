import {
    ArrowLeft,
    ArrowRight,
    Clock3,
    MessageCircle,
    Send,
    Share2,
} from 'lucide-react';

type Props = {
    slug: string;
};

const relatedArticles = [
    {
        category: 'AKIDAH',
        title: 'Tawakal yang Sebenarnya kepada Allah',
        date: '8 Mei 2026',
        readTime: '6 min read',
        image:
            'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=700&q=80',
    },
    {
        category: 'IBADAH',
        title: 'Keutamaan Shalat Tahajud',
        date: '4 Mei 2026',
        readTime: '5 min read',
        image:
            'https://images.unsplash.com/photo-1564121211835-e88c852648ab?auto=format&fit=crop&w=700&q=80',
    },
    {
        category: 'ILMU',
        title: 'Menuntut Ilmu, Jalan Menuju Surga',
        date: '2 Mei 2026',
        readTime: '6 min read',
        image:
            'https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&w=700&q=80',
    },
];

const popularArticles = [
    'Tanda-Tanda Hati yang Mulai Keras',
    'Doa yang Patut Dipanjatkan',
    'Keutamaan Membaca Al-Qur’an',
    'Amalan Ringan tapi Pahalanya Besar',
    'Cara Agar Istiqamah dalam Kebaikan',
];

export default function Show({ slug }: Props) {
    return (
        <div className="min-h-screen bg-[#fafaf8] text-gray-900">
            {/* ================= NAVBAR ================= */}
            <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
                <div className="mx-auto flex h-[72px] max-w-[1280px] items-center justify-between px-5 lg:px-8">
                    <a href="/">
                        <img
                            src="/LOGO.png"
                            alt="Abu Hurairah"
                            className="h-12 w-auto object-contain"
                        />
                    </a>

                    <nav className="hidden items-center gap-7 lg:flex">
                        <a
                            href="/"
                            className="text-[13px] font-medium text-gray-700 hover:text-emerald-900"
                        >
                            Beranda
                        </a>

                        <a
                            href="/#artikel"
                            className="text-[13px] font-medium text-emerald-950"
                        >
                            Artikel
                        </a>

                        <a
                            href="#"
                            className="text-[13px] font-medium text-gray-700"
                        >
                            Tafsir Al-Qur’an
                        </a>

                        <a
                            href="#"
                            className="text-[13px] font-medium text-gray-700"
                        >
                            Hadis
                        </a>

                        <a
                            href="#"
                            className="text-[13px] font-medium text-gray-700"
                        >
                            Akidah
                        </a>

                        <a
                            href="#"
                            className="text-[13px] font-medium text-gray-700"
                        >
                            Fiqih
                        </a>

                        <a
                            href="#"
                            className="text-[13px] font-medium text-gray-700"
                        >
                            Sirah
                        </a>
                    </nav>

                    <div className="hidden items-center gap-4 lg:flex">
                        <button
                            type="button"
                            className="text-gray-700 hover:text-emerald-900"
                        >
                            <span className="text-lg">⌕</span>
                        </button>

                        <a
                            href="/login"
                            className="text-[13px] font-medium text-gray-700 hover:text-emerald-900"
                        >
                            Login Admin
                        </a>
                    </div>

                    <div className="flex gap-4 lg:hidden">
                        <span>⌕</span>
                        <span>☰</span>
                    </div>
                </div>
            </header>

            {/* ================= BREADCRUMB ================= */}
            <div className="mx-auto max-w-[1280px] px-5 pt-7 lg:px-8">
                <div className="flex items-center gap-2 text-[11px] text-gray-500">
                    <a href="/" className="hover:text-emerald-900">
                        Beranda
                    </a>

                    <span>/</span>

                    <a href="/#artikel" className="hover:text-emerald-900">
                        Artikel
                    </a>

                    <span>/</span>

                    <span className="text-gray-700">Akidah</span>
                </div>
            </div>

            {/* ================= ARTICLE ================= */}
            <main className="mx-auto max-w-[1280px] px-5 py-7 lg:px-8">
                <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
                    {/* MAIN ARTICLE */}
                    <article>
                        <span className="inline-flex rounded bg-emerald-950 px-2 py-1 text-[9px] font-bold tracking-wide text-white">
                            AKIDAH
                        </span>

                        <h1 className="mt-4 max-w-4xl font-serif text-3xl font-bold leading-tight text-gray-950 sm:text-4xl lg:text-[43px]">
                            Ikhlas, Kunci Diterimanya Amal di Sisi Allah
                        </h1>

                        <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
                            <span>8 Mei 2026</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                                <Clock3 size={13} />
                                6 min read
                            </span>
                        </div>

                        {/* Hero image */}
                        <div className="mt-7 overflow-hidden rounded-xl">
                            <img
                                src="https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=1500&q=85"
                                alt="Al-Qur'an"
                                className="aspect-[1.9/1] w-full object-cover"
                            />
                        </div>

                        {/* Content */}
                        <div className="mt-8 max-w-3xl">
                            <p className="text-[15px] leading-8 text-gray-700">
                                Ikhlas adalah ruh dari setiap amal. Tanpanya,
                                amal hanyalah rutinitas tanpa nilai di sisi
                                Allah. Adalah keikhlasan hati di baliknya.
                            </p>

                            <p className="mt-5 text-[15px] leading-8 text-gray-700">
                                Ketika niat hanya untuk-Nya, amal sekecil
                                apapun menjadi besar nilainya. Karena yang
                                dilihat bukan semata-mata bentuk amal, tetapi
                                niat dan tujuan seseorang dalam mengerjakannya.
                            </p>

                            {/* Quote */}
                            <div className="my-8 rounded-lg bg-[#f5f0e5] px-6 py-7 text-center">
                                <p
                                    dir="rtl"
                                    className="font-serif text-xl leading-loose text-gray-900"
                                >
                                    إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ
                                </p>

                                <p className="mt-3 text-xs italic leading-6 text-gray-600">
                                    “Sesungguhnya setiap amal tergantung pada
                                    niatnya.”
                                </p>

                                <p className="mt-1 text-[10px] font-semibold text-gray-500">
                                    (HR. Bukhari & Muslim)
                                </p>
                            </div>

                            <p className="text-[15px] leading-8 text-gray-700">
                                Rasulullah ﷺ bersabda bahwa setiap amal
                                tergantung pada niatnya. Dengan demikian,
                                seseorang hendaknya selalu memperbaiki niat
                                sebelum melakukan amal kebaikan.
                            </p>

                            <p className="mt-5 text-[15px] leading-8 text-gray-700">
                                Maka perbaikilah niat, luruskan hati, dan
                                lakukan amal karena Allah semata. Itulah kunci
                                diterimanya amal di sisi-Nya.
                            </p>
                        </div>

                        {/* Share */}
                        <div className="mt-10 border-t border-gray-200 pt-6">
                            <div className="flex flex-wrap items-center gap-3">
                                <span className="flex items-center gap-2 text-xs font-semibold">
                                    <Share2 size={15} />
                                    Bagikan Artikel:
                                </span>

                                <button className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-xs hover:bg-gray-50">
                                   
                                </button>

                                <button className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-xs hover:bg-gray-50">
                                    X
                                </button>

                                <button className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-xs hover:bg-gray-50">
                                    <MessageCircle size={14} />
                                </button>

                                <button className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-xs hover:bg-gray-50">
                                    <Send size={14} />
                                </button>
                            </div>
                        </div>

                        {/* Related */}
                        <section className="mt-10">
                            <h2 className="font-serif text-xl font-bold">
                                Artikel Terkait
                            </h2>

                            <div className="mt-5 grid gap-4 sm:grid-cols-3">
                                {relatedArticles.map((article) => (
                                    <a
                                        href="#"
                                        key={article.title}
                                        className="group"
                                    >
                                        <img
                                            src={article.image}
                                            alt={article.title}
                                            className="aspect-[1.5/1] w-full rounded-lg object-cover transition group-hover:opacity-90"
                                        />

                                        <p className="mt-2 text-[12px] font-semibold leading-5 text-gray-900">
                                            {article.title}
                                        </p>
                                    </a>
                                ))}
                            </div>
                        </section>
                    </article>

                    {/* ================= SIDEBAR ================= */}
                    <aside className="space-y-5">
                        {/* Ayat */}
                        <div className="rounded-xl border border-gray-200 bg-[#fbfaf5] p-5">
                            <h3 className="text-sm font-bold">
                                ❝ &nbsp; Ayat Pilihan
                            </h3>

                            <div className="mt-5">
                                <p
                                    dir="rtl"
                                    className="font-serif text-xl leading-loose text-center"
                                >
                                    إِنَّ اللَّهَ لَا يُغَيِّرُ مَا بِقَوْمٍ
                                    حَتَّىٰ يُغَيِّرُوا مَا بِأَنْفُسِهِمْ
                                </p>
                            </div>

                            <p className="mt-4 text-center text-[10px] leading-5 text-gray-500">
                                “Sesungguhnya Allah tidak akan mengubah
                                keadaan suatu kaum sebelum mereka mengubah
                                keadaan diri mereka sendiri.”
                            </p>

                            <p className="mt-2 text-center text-[10px] font-semibold text-gray-500">
                                (QS. Ar-Ra’d: 11)
                            </p>

                            <a
                                href="#"
                                className="mt-4 flex items-center justify-center gap-1 text-xs font-bold text-emerald-900"
                            >
                                Baca Tafsir
                                <ArrowRight size={13} />
                            </a>
                        </div>

                        {/* Kategori */}
                        <div className="rounded-xl border border-gray-200 bg-white p-5">
                            <h3 className="text-sm font-bold">Kategori</h3>

                            <div className="mt-4 space-y-3">
                                {[
                                    ['Tafsir Al-Qur’an', 18],
                                    ['Hadis', 16],
                                    ['Akidah', 14],
                                    ['Fiqih', 13],
                                    ['Ibadah', 20],
                                    ['Sirah Nabi', 12],
                                    ['Keluarga Muslim', 10],
                                    ['Motivasi Islam', 15],
                                ].map(([name, count]) => (
                                    <div
                                        key={name}
                                        className="flex items-center justify-between text-[11px] text-gray-600"
                                    >
                                        <span>◉ &nbsp; {name}</span>
                                        <span className="text-gray-400">
                                            {count}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Popular */}
                        <div className="rounded-xl border border-gray-200 bg-white p-5">
                            <h3 className="text-sm font-bold">
                                Artikel Populer
                            </h3>

                            <div className="mt-4 space-y-4">
                                {popularArticles.map((title, index) => (
                                    <a
                                        href="#"
                                        key={title}
                                        className="flex gap-3"
                                    >
                                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-950 text-[10px] font-bold text-white">
                                            {index + 1}
                                        </span>

                                        <span className="text-[11px] font-medium leading-5 text-gray-700">
                                            {title}
                                        </span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </aside>
                </div>
            </main>

            {/* ================= FOOTER ================= */}
            <footer className="mt-10 border-t border-gray-200 bg-emerald-950">
                <div className="mx-auto max-w-[1280px] px-5 py-8 text-center lg:px-8">
                    <img
                        src="/LOGO.png"
                        alt="Abu Hurairah"
                        className="mx-auto h-12 w-auto brightness-0 invert"
                    />

                    <p className="mt-3 text-xs text-emerald-100/60">
                        © 2026 Abu Hurairah · Artikel Islam & Dakwah
                    </p>
                </div>
            </footer>
        </div>
    );
}