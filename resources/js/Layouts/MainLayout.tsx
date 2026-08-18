import { useState, useRef, useEffect } from "react";
import { Menu, UserRound, X, Search } from "lucide-react";
import { Link, usePage } from "@inertiajs/react";
import LoginModal from "../Components/LoginModal";
import { Category } from "../types";
import { ChevronDown } from "lucide-react";
import {
    FaYoutube,
    FaInstagram,
    FaFacebookF,
} from "react-icons/fa";

export default function MainLayout({
    
    children,
}: {
    children: React.ReactNode;
}) {
    const [mobileMenu, setMobileMenu] = useState<boolean>(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
    const [footerDropdownOpen, setFooterDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { auth, categories } = usePage().props as {
        auth: any;
        categories: Category[];
    };

    // State untuk Pencarian & Dropdown Hasil Real-time
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState<boolean>(false);
    const searchRef = useRef<HTMLDivElement>(null);

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

    // Debounced Search Effect (Mencegah lag & request beruntun)
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
        }, 300); // Jeda 300ms agar pencarian mulus dan tidak lambat

        return () => clearTimeout(timerId);
    }, [searchQuery]);

    // Menutup dropdown jika klik di luar area search
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                searchRef.current &&
                !searchRef.current.contains(event.target as Node)
            ) {
                setSearchResults([]);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Handle Submit Enter pada form pencarian
    const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            window.location.href = `/artikel?search=${encodeURIComponent(searchQuery)}`;
        }
    };

    return (
        
        <div className="min-h-screen bg-[#fafaf8] text-[#17251f]">
            {/* ================= HEADER ================= */}
            <header className="sticky top-0 z-50 border-b border-[#e9e6df] bg-white">
                <div className="mx-auto max-w-[1140px] px-5 lg:px-0">
                    <div className="flex h-[70px] items-center justify-between gap-3">
                        {/* LOGO (Kiri) */}
                        <Link
                            href="/home"
                            className="flex shrink-0 items-center gap-3"
                        >
                            <img
                                src="/LOGO.png"
                                alt="Abu Haidar"
                                className="h-9 w-auto sm:h-10"
                            />
                            <div className="hidden sm:block">
                                <div className="font-serif text-[17px] font-bold leading-none text-[#123f31]">
                                    Abu Haidar
                                </div>
                                <div className="mt-1 text-[9px] tracking-wide text-[#777]">
                                    Artikel Islam & Dakwah
                                </div>
                            </div>
                        </Link>

                        {/* PENCARIAN (Tengah - Responsive Desktop & Mobile) */}
                        <div
                            className="flex-1 max-w-[400px] relative"
                            ref={searchRef}
                        >
                            <form
                                onSubmit={handleSearchSubmit}
                                className="relative w-full"
                            >
                                <Search
                                    size={15}
                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#999]"
                                />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    placeholder="Cari artikel..."
                                    className="w-full rounded-full border border-[#e9e6df] bg-[#f9f9f7] py-2 pl-10 pr-4 text-[12px] outline-none transition focus:border-[#0b6045] focus:bg-white"
                                />
                            </form>

                            {/* DROPDOWN HASIL PENCARIAN REAL-TIME */}
                            {searchQuery.trim().length > 1 && (
                                <div className="absolute top-full left-0 right-0 mt-2 rounded-2xl bg-white shadow-xl border border-[#e9e6df] overflow-hidden z-50 max-h-[400px] overflow-y-auto">
                                    {isSearching ? (
                                        <div className="p-4 text-center text-[12px] text-[#777]">
                                            Mencari artikel...
                                        </div>
                                    ) : searchResults.length > 0 ? (
                                        <div className="divide-y divide-[#f0eee6]">
                                            {searchResults.map((article) => (
                                                <Link
                                                    key={article.id}
                                                    href={`/artikel/${article.slug}`}
                                                    onClick={() =>
                                                        setSearchQuery("")
                                                    }
                                                    className="flex items-center gap-3 p-3 hover:bg-[#fafaf8] transition"
                                                >
                                                    <img
                                                        src={
                                                            article.image ||
                                                            "/storage/default.jpg"
                                                        }
                                                        alt={article.title}
                                                        className="h-12 w-14 rounded-lg object-cover border border-[#eee]"
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="text-[13px] font-bold text-[#17251f] truncate">
                                                            {article.title}
                                                        </h4>
                                                        <p className="text-[11px] text-[#666] line-clamp-1 mt-0.5">
                                                            {
                                                                article.description
                                                            }
                                                        </p>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-4 text-center text-[12px] text-[#777]">
                                            Tidak ada artikel yang ditemukan
                                            untuk "{searchQuery}"
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* AKSI LOGIN & MENU MOBILE (Kanan) */}
                        <div className="flex items-center gap-3">
                            {auth?.user ? (
                                <Link
                                    href="/admin/dashboard"
                                    className="flex items-center gap-1.5 rounded-full border border-[#063f2f] px-3.5 py-1.5 text-[11px] font-bold text-[#063f2f] hover:bg-[#063f2f] hover:text-white transition"
                                >
                                    <UserRound size={13} />
                                    <span className="hidden sm:inline">
                                        Dashboard
                                    </span>
                                </Link>
                            ) : (
                                <button
                                    onClick={() => setIsLoginModalOpen(true)}
                                    className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f3f1eb] text-[#555] hover:bg-[#063f2f] hover:text-white transition"
                                    title="Login Admin"
                                >
                                    <UserRound size={14} />
                                </button>
                            )}

                            {/* Tombol Hamburger Mobile */}
                            <button
                                onClick={() => setMobileMenu(!mobileMenu)}
                                className="flex lg:hidden h-8 w-8 items-center justify-center rounded-full bg-[#f3f1eb] text-[#555]"
                                aria-label="Menu"
                            >
                                {mobileMenu ? (
                                    <X size={18} />
                                ) : (
                                    <Menu size={18} />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* MOBILE MENU DROPDOWN */}
                {mobileMenu && (
                    <div className="border-t border-[#eee] py-4 px-5 bg-white lg:hidden shadow-lg absolute w-full">
                        <nav className="space-y-2">
                            <Link
                                href="/"
                                onClick={() => setMobileMenu(false)}
                                className="block rounded-lg px-3 py-2 text-sm font-semibold text-[#333] hover:bg-[#f5f4ef]"
                            >
                                Beranda Utama
                            </Link>

                            <div className="my-1 border-t border-[#eee]" />
                            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-[#888]">
                                Kategori
                            </p>
                            {categories &&
                                categories.map((cat) => (
                                    <Link
                                        key={cat.id}
                                        href={`/kategori/${cat.slug}`}
                                        onClick={() => setMobileMenu(false)}
                                        className="block rounded-lg px-3 py-1.5 text-xs text-[#555] hover:bg-[#f5f4ef]"
                                    >
                                        {cat.name}
                                    </Link>
                                ))}
                        </nav>
                    </div>
                )}
            </header>

            {/* ================= MAIN KONTEN ================= */}
            <main className="mx-auto max-w-[1140px] px-5 lg:px-0 py-8 lg:py-10 min-h-[60vh]">
                {children}
            </main>

            {/* ================= FOOTER ================= */}
            <footer className="bg-[#053225] text-white pt-16 pb-8 border-t border-[#04281d]">
                <div className="mx-auto max-w-[1140px] px-5 lg:px-0 grid gap-10 md:grid-cols-3">
                    <div>
                        <div className="inline-flex items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-sm border border-[#e9e6df]">
                            <img
                                src="/LOGO.png"
                                alt="Abu Haidar"
                                className="h-9 w-auto"
                            />
                            <div>
                                <div className="font-serif text-[16px] font-bold tracking-wide text-[#123f31]">
                                    Abu Haidar
                                </div>
                                <div className="mt-0.5 text-[9px] tracking-wide text-[#777]">
                                    Artikel Islam & Dakwah
                                </div>
                            </div>
                        </div>
                        <p className="mt-4 text-[12px] text-white/70 leading-relaxed max-w-sm">
                            Media dakwah dan artikel Islam terpercaya yang
                            menyajikan pembahasan seputar Al-Qur'an, hadis,
                            akidah, fiqih, sirah, dan panduan harian kehidupan
                            seorang muslim.
                        </p>
                    </div>

                    <div>
                        <div>
                            <h4 className="font-serif text-[14px] font-bold tracking-wider uppercase text-emerald-300 mb-4">
                                Tautan Cepat & Kategori
                            </h4>
                            <ul className="space-y-3 text-[12px] text-white/80">
                                <li>
                                    <Link
                                        href="/"
                                        className="flex items-center gap-2 hover:text-emerald-300 transition-colors"
                                    >
                                        Beranda Utama
                                    </Link>
                                </li>

                                {/* Garis pemisah tipis */}
                                <div className="my-1 border-t border-white/10" />

                                {/* CUSTOM DROPDOWN KATEGORI YANG ESTETIK */}
                                <li className="relative" ref={dropdownRef}>
                                    <button
                                        onClick={() =>
                                            setFooterDropdownOpen(
                                                !footerDropdownOpen,
                                            )
                                        }
                                        className="flex w-full items-center justify-between rounded-lg border border-white/20 bg-[#04281d] px-3.5 py-2 text-[12px] font-medium text-white transition hover:border-emerald-300"
                                    >
                                        <span>Pilih Kategori Artikel</span>
                                        <ChevronDown
                                            size={14}
                                            className={`transition-transform duration-300 ${footerDropdownOpen ? "rotate-180" : ""}`}
                                        />
                                    </button>

                                    {/* Menu Dropdown Melayang */}
                                    {footerDropdownOpen && (
                                        <div className="absolute bottom-full left-0 right-0 mb-2 rounded-xl bg-[#04281d] border border-white/20 shadow-xl overflow-hidden z-50 py-1 max-h-[220px] overflow-y-auto">
                                            {categories &&
                                            categories.length > 0 ? (
                                                categories.map((cat) => (
                                                    <Link
                                                        key={cat.id}
                                                        href={`/kategori/${cat.slug}`}
                                                        onClick={() =>
                                                            setFooterDropdownOpen(
                                                                false,
                                                            )
                                                        }
                                                        className="block px-4 py-2 text-[12px] text-white/80 hover:bg-emerald-950 hover:text-emerald-300 transition"
                                                    >
                                                        {cat.name}
                                                    </Link>
                                                ))
                                            ) : (
                                                <div className="px-4 py-2 text-[11px] text-white/50 text-center">
                                                    Tidak ada kategori
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-serif text-[14px] font-bold tracking-wider uppercase text-emerald-300 mb-4">
                            Media Sosial & Saluran
                        </h4>
                        <p className="text-[12px] text-white/70 mb-4 leading-relaxed">
                            Ikuti perkembangan kajian dan sebaran artikel
                            terbaru kami melalui kanal resmi di bawah ini:
                        </p>
                        <div className="flex items-center gap-3">
                            <a
                                href="https://youtube.com/SHOLATTV"
                                target="_blank"
                                rel="noreferrer"
                                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-[#FF0000]"
                                aria-label="YouTube"
                            >
                                <FaYoutube size={16} />
                            </a>
                            <a
                                href="https://instagram.com/sholat.tv"
                                target="_blank"
                                rel="noreferrer"
                                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-[#E4405F]"
                                aria-label="Instagram"
                            >
                                <FaInstagram size={16} />
                            </a>
                            <a
                                href="https://facebook.com/sholattv"
                                target="_blank"
                                rel="noreferrer"
                                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-[#1877F2]"
                                aria-label="Facebook"
                            >
                                <FaFacebookF size={16} />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="mx-auto max-w-[1140px] mt-12 border-t border-white/10 pt-6 px-5 lg:px-0 flex flex-col sm:flex-row items-center justify-between text-[11px] text-white/50 gap-4">
                    <p>© 2026 Abu Haidar. Hak Cipta Dilindungi.</p>
                    <p className="flex items-center gap-1">
                        Dibuat khusus untuk{" "}
                        <span className="font-semibold text-white/80">
                            Abu Haidar Official
                        </span>
                    </p>
                </div>
            </footer>

            {/* ================= MODAL LOGIN ================= */}
            <LoginModal
                isOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
            />
        </div>
    );
}
