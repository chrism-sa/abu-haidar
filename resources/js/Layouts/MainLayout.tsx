import { useState, useRef, useEffect } from "react";
import { UserRound, Search, X, ChevronDown } from "lucide-react";
import { Link, usePage } from "@inertiajs/react";
import LoginModal from "../Components/LoginModal";
import { Category } from "../types";
import { FaYoutube, FaInstagram, FaFacebookF } from "react-icons/fa";

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
    const [footerDropdownOpen, setFooterDropdownOpen] = useState(false);
    const [mobileSearchOpen, setMobileSearchOpen] = useState<boolean>(false);

    const dropdownRef = useRef<HTMLDivElement>(null);
    const desktopSearchRef = useRef<HTMLDivElement>(null);
    const mobileSearchRef = useRef<HTMLDivElement>(null);
    const mobileInputRef = useRef<HTMLInputElement>(null);

    const { auth, categories } = usePage().props as {
        auth: any;
        categories: Category[];
    };

    const [searchQuery, setSearchQuery] = useState<string>("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState<boolean>(false);

    // Auto-focus input saat pencarian mobile dibuka
    useEffect(() => {
        if (mobileSearchOpen) {
            mobileInputRef.current?.focus();
        }
    }, [mobileSearchOpen]);

    // Tutup dropdown footer saat klik di luar
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setFooterDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Live Search Fetching
    useEffect(() => {
        const trimmedQuery = searchQuery.trim();

        if (trimmedQuery.length < 2) {
            setSearchResults([]);
            setIsSearching(false);
            return;
        }

        setIsSearching(true);
        const timerId = setTimeout(() => {
            fetch(`/api/articles/search?q=${encodeURIComponent(trimmedQuery)}`)
                .then((res) => res.json())
                .then((data) => {
                    setSearchResults(data.articles || []);
                    setIsSearching(false);
                })
                .catch(() => {
                    setIsSearching(false);
                });
        }, 300);

        return () => clearTimeout(timerId);
    }, [searchQuery]);

    // Tutup dropdown hasil pencarian saat klik di luar
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const isClickInsideDesktop =
                desktopSearchRef.current &&
                desktopSearchRef.current.contains(event.target as Node);
            const isClickInsideMobile =
                mobileSearchRef.current &&
                mobileSearchRef.current.contains(event.target as Node);

            if (!isClickInsideDesktop && !isClickInsideMobile) {
                setSearchResults([]);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            window.location.href = `/artikel?search=${encodeURIComponent(searchQuery)}`;
        }
    };

    return (
        <div className="min-h-screen bg-[#eaf6efc0] text-[#162B22]">
            {/* ================= HEADER ================= */}
            <header className="sticky top-0 z-50 border-b border-[#E8E6E1] bg-white/95 backdrop-blur-md shadow-[0_4px_20px_-15px_rgba(0,0,0,0.1)]">
                <div className="mx-auto max-w-[1140px] px-5 lg:px-0">
                    <div className="flex h-[75px] items-center justify-between gap-4">
                        {/* LOGO & NAMA BRAND */}
                        <Link
                            href="/home"
                            className="flex shrink-0 items-center gap-3 transition-transform hover:opacity-90"
                        >
                            <img
                                src="/LOGO.png"
                                alt="Abu Haidar"
                                className="h-11 w-auto sm:h-12"
                            />
                            <div className="hidden sm:block">
                                <div className="font-brand text-[19px] font-bold tracking-tight leading-none text-[#0F4C3A]">
                                    Abu Haidar
                                </div>
                                <div className="mt-1 text-[10px] tracking-[0.08em] text-[#6C857A] uppercase font-medium">
                                    Artikel Islam & Dakwah
                                </div>
                            </div>
                        </Link>

                        {/* PENCARIAN DESKTOP */}
                        <div
                            className="flex-1 max-w-[450px] relative hidden md:block"
                            ref={desktopSearchRef}
                        >
                            <form
                                onSubmit={handleSearchSubmit}
                                className="relative w-full group"
                            >
                                <Search
                                    size={16}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A5B9AD] transition-colors group-focus-within:text-[#0F4C3A]"
                                />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    placeholder="Cari artikel, tafsir, atau kajian..."
                                    className="w-full rounded-full border border-[#E8E6E1] bg-[#F4F4F0] py-2.5 pl-11 pr-4 text-[13px] text-[#333] outline-none transition-all focus:border-[#0F4C3A] focus:bg-white focus:shadow-[0_0_0_4px_rgba(15,76,58,0.05)]"
                                />
                            </form>

                            {/* DROPDOWN HASIL PENCARIAN DESKTOP */}
                            {searchQuery.trim().length > 1 && (
                                <div className="absolute top-full left-0 right-0 mt-3 rounded-2xl bg-white shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-[#E8E6E1] overflow-hidden z-50 max-h-[400px] overflow-y-auto">
                                    {isSearching ? (
                                        <div className="p-5 text-center text-[12px] font-medium text-[#8CA397]">
                                            Mencari artikel...
                                        </div>
                                    ) : searchResults.length > 0 ? (
                                        <div className="divide-y divide-[#F4F4F0]">
                                            {searchResults.map((article) => (
                                                <Link
                                                    key={article.id}
                                                    href={`/artikel/${article.slug}`}
                                                    onClick={() => {
                                                        setSearchQuery("");
                                                        setSearchResults([]);
                                                    }}
                                                    className="flex items-center gap-4 p-4 hover:bg-[#FAFAF8] transition-colors"
                                                >
                                                    <img
                                                        src={
                                                            article.image ||
                                                            "/storage/default.jpg"
                                                        }
                                                        alt={article.title}
                                                        className="h-14 w-16 rounded-lg object-cover border border-[#E8E6E1]"
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-brand text-[14px] font-bold text-[#162B22] truncate transition-colors hover:text-[#0F4C3A]">
                                                            {article.title}
                                                        </h4>
                                                        <p className="text-[12px] text-[#6C857A] line-clamp-1 mt-1">
                                                            {
                                                                article.description
                                                            }
                                                        </p>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-5 text-center text-[12px] text-[#8CA397]">
                                            Tidak ada artikel yang ditemukan
                                            untuk{" "}
                                            <span className="font-bold text-[#162B22]">
                                                "{searchQuery}"
                                            </span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* AKSI LOGIN / DASHBOARD & TOGGLE PENCARIAN MOBILE */}
                        <div className="flex items-center gap-3">
                            {/* Tombol Toggle Search Mobile */}
                            <button
                                type="button"
                                onClick={() =>
                                    setMobileSearchOpen(!mobileSearchOpen)
                                }
                                className="md:hidden flex h-10 w-10 items-center justify-center rounded-full bg-[#F4F4F0] text-[#6C857A] transition hover:bg-[#E8E6E1] hover:text-[#0F4C3A]"
                                aria-label="Toggle Pencarian Mobile"
                            >
                                {mobileSearchOpen ? (
                                    <X size={18} />
                                ) : (
                                    <Search size={18} />
                                )}
                            </button>

                            {auth?.user ? (
                                <Link
                                    href="/admin/dashboard"
                                    className="flex items-center gap-2 rounded-full border-2 border-[#0F4C3A] bg-white px-5 py-2 text-[12px] font-bold text-[#0F4C3A] hover:bg-[#0F4C3A] hover:text-white transition-all shadow-sm"
                                >
                                    <UserRound size={14} />
                                    <span className="hidden sm:inline">
                                        Dashboard
                                    </span>
                                </Link>
                            ) : (
                                <button
                                    onClick={() => setIsLoginModalOpen(true)}
                                    className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E8E6E1] bg-white text-[#6C857A] hover:border-[#0F4C3A] hover:bg-[#0F4C3A] hover:text-white transition-all shadow-sm"
                                    title="Login Admin"
                                >
                                    <UserRound size={16} />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* ================= BAR PENCARIAN MODE MOBILE ================= */}
                    {mobileSearchOpen && (
                        <div
                            ref={mobileSearchRef}
                            className="md:hidden pb-4 pt-1 relative"
                        >
                            <form
                                onSubmit={handleSearchSubmit}
                                className="relative w-full flex items-center"
                            >
                                <Search
                                    size={16}
                                    className="absolute left-4 text-[#A5B9AD]"
                                />
                                <input
                                    ref={mobileInputRef}
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    placeholder="Cari artikel, kajian, atau tafsir..."
                                    className="w-full rounded-full border border-[#E8E6E1] bg-[#F4F4F0] py-2.5 pl-11 pr-10 text-[13px] text-[#333] outline-none focus:border-[#0F4C3A] focus:bg-white"
                                />
                                {searchQuery && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSearchQuery("");
                                            setSearchResults([]);
                                        }}
                                        className="absolute right-3 text-[#A5B9AD] hover:text-[#162B22]"
                                    >
                                        <X size={15} />
                                    </button>
                                )}
                            </form>

                            {/* HASIL PENCARIAN MOBILE */}
                            {searchQuery.trim().length > 1 && (
                                <div className="absolute top-full left-0 right-0 mt-2 rounded-2xl bg-white shadow-xl border border-[#E8E6E1] overflow-hidden z-50 max-h-[350px] overflow-y-auto">
                                    {isSearching ? (
                                        <div className="p-4 text-center text-[12px] font-medium text-[#8CA397]">
                                            Mencari artikel...
                                        </div>
                                    ) : searchResults.length > 0 ? (
                                        <div className="divide-y divide-[#F4F4F0]">
                                            {searchResults.map((article) => (
                                                <Link
                                                    key={article.id}
                                                    href={`/artikel/${article.slug}`}
                                                    onClick={() => {
                                                        setSearchQuery("");
                                                        setSearchResults([]);
                                                        setMobileSearchOpen(
                                                            false,
                                                        );
                                                    }}
                                                    className="flex items-center gap-3 p-3.5 hover:bg-[#FAFAF8] transition-colors"
                                                >
                                                    <img
                                                        src={
                                                            article.image ||
                                                            "/storage/default.jpg"
                                                        }
                                                        alt={article.title}
                                                        className="h-12 w-14 rounded-lg object-cover border border-[#E8E6E1]"
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-brand text-[13px] font-bold text-[#162B22] truncate">
                                                            {article.title}
                                                        </h4>
                                                        <p className="text-[11px] text-[#6C857A] line-clamp-1 mt-0.5">
                                                            {
                                                                article.description
                                                            }
                                                        </p>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-4 text-center text-[12px] text-[#8CA397]">
                                            Tidak ditemukan hasil untuk{" "}
                                            <span className="font-bold text-[#162B22]">
                                                "{searchQuery}"
                                            </span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </header>

            {/* ================= MAIN KONTEN ================= */}
            <main className="mx-auto max-w-[1140px] px-5 lg:px-0 py-10 lg:py-14 min-h-[60vh]">
                {children}
            </main>

            {/* ================= FOOTER ================= */}
            <footer className="bg-[#0A382A] text-white pt-16 pb-8 border-t border-[#072B20]">
                <div className="mx-auto max-w-[1140px] px-5 lg:px-0 grid gap-10 md:grid-cols-3">
                    {/* INFO BRAND */}
                    <div>
                        <div className="flex items-center gap-4 mb-2">
                            <div className="shrink-0">
                                <img
                                    src="/LOGO.png"
                                    alt="Abu Haidar"
                                    className="h-12 w-auto drop-shadow-md"
                                />
                            </div>
                            <div className="h-10 w-[1px] bg-gradient-to-b from-[#0A382A] via-[#C5A059]/40 to-[#0A382A]"></div>
                            <div className="flex flex-col justify-center">
                                <div className="font-brand text-[20px] font-bold tracking-tight text-[#C5A059] drop-shadow-sm">
                                    Abu Haidar
                                </div>
                                <div className="mt-1 text-[9px] tracking-[0.2em] text-[#E8E6E1]/60 uppercase font-medium">
                                    Artikel Islam & Dakwah
                                </div>
                            </div>
                        </div>

                        <p className="mt-6 text-[13px] text-white/70 leading-relaxed max-w-sm">
                            Media dakwah dan artikel Islam terpercaya yang
                            menyajikan pembahasan seputar Al-Qur'an, hadis,
                            akidah, fiqih, sirah, dan panduan harian kehidupan
                            seorang muslim.
                        </p>
                    </div>

                    {/* TAUTAN CEPAT & KATEGORI */}
                    <div>
                        <h4 className="font-brand text-[14px] font-bold tracking-wider uppercase text-[#C5A059] mb-4">
                            Tautan Cepat & Kategori
                        </h4>
                        <ul className="space-y-3 text-[13px] text-white/80">
                            <li>
                                <Link
                                    href="/home"
                                    className="flex items-center gap-2 hover:text-[#C5A059] transition-colors"
                                >
                                    Beranda Utama
                                </Link>
                            </li>

                            <div className="my-2 border-t border-white/10" />

                            <li className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() =>
                                        setFooterDropdownOpen(
                                            !footerDropdownOpen,
                                        )
                                    }
                                    className="flex w-full items-center justify-between rounded-xl border border-white/20 bg-[#072B20] px-4 py-2.5 text-[12px] font-medium text-white/90 transition hover:border-[#C5A059]"
                                >
                                    <span>Pilih Kategori Artikel</span>
                                    <ChevronDown
                                        size={16}
                                        className={`transition-transform duration-300 ${
                                            footerDropdownOpen
                                                ? "rotate-180 text-[#C5A059]"
                                                : ""
                                        }`}
                                    />
                                </button>

                                {footerDropdownOpen && (
                                    <div className="absolute bottom-full left-0 right-0 mb-3 rounded-xl bg-[#072B20] border border-[#0F4C3A] shadow-2xl overflow-hidden z-50 py-2 max-h-[240px] overflow-y-auto">
                                        {categories && categories.length > 0 ? (
                                            categories.map((cat) => (
                                                <Link
                                                    key={cat.id}
                                                    href={`/kategori/${cat.slug}`}
                                                    onClick={() =>
                                                        setFooterDropdownOpen(
                                                            false,
                                                        )
                                                    }
                                                    className="block px-5 py-2.5 text-[13px] text-white/80 hover:bg-[#0F4C3A] hover:text-[#C5A059] transition-colors"
                                                >
                                                    {cat.name}
                                                </Link>
                                            ))
                                        ) : (
                                            <div className="px-5 py-3 text-[12px] text-white/50 text-center">
                                                Tidak ada kategori
                                            </div>
                                        )}
                                    </div>
                                )}
                            </li>
                        </ul>
                    </div>

                    {/* SOSIAL MEDIA */}
                    <div>
                        <h4 className="font-brand text-[14px] font-bold tracking-wider uppercase text-[#C5A059] mb-4">
                            Media Sosial & Saluran
                        </h4>
                        <p className="text-[13px] text-white/70 mb-5 leading-relaxed">
                            Ikuti perkembangan kajian dan sebaran artikel
                            terbaru kami melalui kanal resmi di bawah ini:
                        </p>
                        <div className="flex items-center gap-4">
                            <a
                                href="https://youtube.com/SHOLATTV"
                                target="_blank"
                                rel="noreferrer"
                                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/90 transition-all hover:bg-[#FF0000] hover:text-white hover:scale-110"
                                aria-label="YouTube"
                            >
                                <FaYoutube size={18} />
                            </a>
                            <a
                                href="https://instagram.com/sholat.tv"
                                target="_blank"
                                rel="noreferrer"
                                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/90 transition-all hover:bg-[#E4405F] hover:text-white hover:scale-110"
                                aria-label="Instagram"
                            >
                                <FaInstagram size={18} />
                            </a>
                            <a
                                href="https://facebook.com/sholattv"
                                target="_blank"
                                rel="noreferrer"
                                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/90 transition-all hover:bg-[#1877F2] hover:text-white hover:scale-110"
                                aria-label="Facebook"
                            >
                                <FaFacebookF size={18} />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="mx-auto max-w-[1140px] mt-16 border-t border-white/10 pt-6 px-5 lg:px-0 flex flex-col sm:flex-row items-center justify-between text-[12px] text-white/50 gap-4">
                    <p>© 2026 Abu Haidar. Hak Cipta Dilindungi.</p>
                    <p className="flex items-center gap-1.5">
                        Dibuat khusus untuk{" "}
                        <span className="font-bold text-[#C5A059]">
                            Abu Haidar Official
                        </span>
                    </p>
                </div>
            </footer>

            <LoginModal
                isOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
            />
        </div>
    );
}
