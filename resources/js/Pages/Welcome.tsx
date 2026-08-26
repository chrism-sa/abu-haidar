import { Head, router } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { FaYoutube, FaInstagram, FaFacebookF } from "react-icons/fa";

// Apple-like Easing Curve
const appleEase = [0.16, 1, 0.3, 1];

// Filter CSS untuk memaksa gambar logo menjadi Cokelat Solid #5E3122 (tanpa gradien emas)
const solidBrownLogoFilter =
    "brightness(0) saturate(100%) invert(20%) sepia(35%) saturate(1500%) hue-rotate(345deg) brightness(90%) contrast(95%)";

export default function Welcome() {
    const [appState, setAppState] = useState<"loading" | "welcome" | "exiting">(
        "loading",
    );
    const [hoveredSocial, setHoveredSocial] = useState<number | null>(null);

    // Fase Loading
    useEffect(() => {
        const timer = setTimeout(() => {
            if (appState === "loading") setAppState("welcome");
        }, 1800);
        return () => clearTimeout(timer);
    }, [appState]);

    const handleTransition = (path: "/home" | "/login") => {
        setAppState("exiting");
        setTimeout(() => {
            router.visit(path);
        }, 900);
    };

    // Data Sosial Media
    const socials = [
        {
            id: 1,
            icon: FaYoutube,
            link: "https://youtube.com/SHOLATTV",
            name: "YouTube",
        },
        {
            id: 2,
            icon: FaInstagram,
            link: "https://instagram.com/sholat.tv",
            name: "Instagram",
        },
        {
            id: 3,
            icon: FaFacebookF,
            link: "https://facebook.com/sholattv",
            name: "Facebook",
        },
    ];

    return (
        <div className="fixed inset-0 h-[100dvh] w-full bg-[#F7EAE0] text-[#5E3122] selection:bg-[#1D4533] selection:text-[#F7EAE0] overflow-hidden flex flex-col items-center justify-center font-sans select-none">
            <Head title="Abu Haidar - Portal Risalah & Kajian Islam" />

            {/* ======================================================== */}
            {/* BACKGROUND: FLUID GLOWING ORBS                           */}
            {/* ======================================================== */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                {/* Orb Hijau Lembut - Atas Kiri */}
                <motion.div
                    animate={{
                        x: [0, 50, -30, 0],
                        y: [0, -40, 30, 0],
                        scale: [1, 1.15, 0.9, 1],
                    }}
                    transition={{
                        duration: 12,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    style={{
                        willChange: "transform",
                        transform: "translateZ(0)",
                    }}
                    className="absolute -top-[10%] -left-[10%] h-[55vw] w-[55vw] max-w-[520px] max-h-[520px] rounded-full bg-gradient-to-tr from-[#1D4533] to-[#2B6149] opacity-15 blur-[60px]"
                />

                {/* Orb Warm Peach - Bawah Kanan */}
                <motion.div
                    animate={{
                        x: [0, -40, 40, 0],
                        y: [0, 40, -30, 0],
                        scale: [1, 0.95, 1.1, 1],
                    }}
                    transition={{
                        duration: 14,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    style={{
                        willChange: "transform",
                        transform: "translateZ(0)",
                    }}
                    className="absolute -bottom-[10%] -right-[10%] h-[60vw] w-[60vw] max-w-[580px] max-h-[580px] rounded-full bg-gradient-to-bl from-[#F9D2BA] to-[#E5AC88] opacity-35 blur-[70px]"
                />
            </div>

            <AnimatePresence mode="wait">
                {/* ========================================= */}
                {/* FASE 1: LOADER AWAL                       */}
                {/* ========================================= */}
                {appState === "loading" && (
                    <motion.div
                        key="loading"
                        className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#F7EAE0]"
                        exit={{
                            opacity: 0,
                            transition: { duration: 0.8, ease: appleEase },
                        }}
                    >
                        <div className="relative mb-6 flex flex-col items-center">
                            <motion.img
                                src="/LOGO.png"
                                alt="Abu Haidar Logo"
                                style={{
                                    filter: solidBrownLogoFilter,
                                }}
                                className="h-24 sm:h-28 w-auto relative z-10 drop-shadow-xs"
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, ease: appleEase }}
                            />
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3, duration: 0.6 }}
                                className="mt-3 font-brand text-[13px] font-extrabold uppercase tracking-[0.3em] text-[#5E3122]"
                            >
                                Abu Haidar
                            </motion.span>
                        </div>
                        <div className="h-[2.5px] w-40 bg-[#E6CEBC]/70 overflow-hidden rounded-full relative">
                            <motion.div
                                className="absolute top-0 left-0 h-full w-full bg-[#1D4533]"
                                initial={{ x: "-100%" }}
                                animate={{ x: "100%" }}
                                transition={{
                                    duration: 1.2,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                            />
                        </div>
                    </motion.div>
                )}

                {/* ========================================= */}
                {/* FASE 2: WELCOME SCREEN                    */}
                {/* ========================================= */}
                {appState === "welcome" && (
                    <motion.div
                        key="welcome"
                        className="relative z-10 flex flex-col items-center justify-center w-full h-full px-6"
                        exit={{
                            opacity: 0,
                            scale: 0.97,
                            transition: { duration: 0.5, ease: appleEase },
                        }}
                    >
                        {/* Logo Melayang (Cokelat Penuh & Lebih Besar) */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.85 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1, ease: appleEase }}
                            className="mb-6 md:mb-8"
                        >
                            <motion.img
                                animate={{ y: [0, -10, 0] }}
                                transition={{
                                    duration: 4,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                                style={{
                                    willChange: "transform",
                                    filter: `${solidBrownLogoFilter} drop-shadow(0 10px 20px rgba(94,49,34,0.12))`,
                                }}
                                src="/LOGO.png"
                                alt="Abu Haidar Official"
                                className="h-32 sm:h-40 md:h-48 lg:h-52 w-auto"
                            />
                        </motion.div>

                        <div className="overflow-hidden pb-1 text-center">
                            <motion.h1
                                initial={{ y: "100%" }}
                                animate={{ y: 0 }}
                                transition={{
                                    duration: 0.9,
                                    ease: appleEase,
                                    delay: 0.15,
                                }}
                                className="font-brand text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-[#1D4533] leading-tight"
                            >
                                Risalah Dakwah
                            </motion.h1>
                        </div>

                        <div className="overflow-hidden mb-4 md:mb-6 text-center">
                            <motion.h2
                                initial={{ y: "100%" }}
                                animate={{ y: 0 }}
                                transition={{
                                    duration: 0.9,
                                    ease: appleEase,
                                    delay: 0.25,
                                }}
                                className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl italic text-[#5E3122] leading-tight"
                            >
                                & Literatur Keislaman
                            </motion.h2>
                        </div>

                        <motion.p
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.8,
                                ease: appleEase,
                                delay: 0.4,
                            }}
                            className="max-w-md md:max-w-lg text-center text-[13.5px] md:text-[16px] text-[#5E3122]/85 leading-relaxed mb-8 md:mb-12 font-medium px-4"
                        >
                            Menyajikan artikel, tafsir, dan catatan kajian
                            berlandaskan pemahaman salafush shalih dalam balutan
                            editorial modern.
                        </motion.p>

                        {/* Tombol Mulai Membaca */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{
                                duration: 0.8,
                                ease: appleEase,
                                delay: 0.55,
                            }}
                        >
                            <button
                                type="button"
                                onClick={() => handleTransition("/home")}
                                className="group relative overflow-hidden flex items-center justify-center gap-4 rounded-full bg-[#1D4533] px-9 md:px-12 py-3.5 md:py-5 text-[12px] md:text-[14px] font-bold tracking-[0.2em] text-[#F7EAE0] transition-all duration-300 hover:shadow-[0_20px_40px_-15px_rgba(29,69,51,0.45)] hover:-translate-y-1 active:scale-95 cursor-pointer border border-[#E6CEBC]/50"
                            >
                                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#1D4533] via-[#285E48] to-[#1D4533] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <span className="relative z-10 uppercase">
                                    Mulai Membaca
                                </span>
                                <div className="relative z-10 flex h-7 w-7 md:h-8 md:w-8 items-center justify-center rounded-full bg-[#FAF1E8]/20 transition-all duration-500 group-hover:translate-x-1.5 group-hover:bg-[#FAF1E8] group-hover:text-[#1D4533]">
                                    <ArrowRight
                                        size={15}
                                        className="text-[#F7EAE0] group-hover:text-[#1D4533] transition-colors"
                                    />
                                </div>
                            </button>
                        </motion.div>

                        {/* Floating Dock Sosmed */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.8,
                                delay: 0.75,
                                ease: appleEase,
                            }}
                            className="absolute bottom-6 left-1/2 -translate-x-1/2 md:bottom-auto md:left-auto md:right-8 lg:right-10 md:top-1/2 md:-translate-y-1/2 flex flex-row md:flex-col items-center gap-3 md:gap-4 z-50 p-2 md:p-3 rounded-full bg-[#FAF1E8]/90 backdrop-blur-md border border-[#E6CEBC] shadow-xs"
                            onMouseLeave={() => setHoveredSocial(null)}
                        >
                            {socials.map((social) => {
                                const isDimmed =
                                    hoveredSocial !== null &&
                                    hoveredSocial !== social.id;
                                const isCurrent = hoveredSocial === social.id;

                                return (
                                    <a
                                        key={social.id}
                                        href={social.link}
                                        target="_blank"
                                        rel="noreferrer"
                                        onMouseEnter={() =>
                                            setHoveredSocial(social.id)
                                        }
                                        className={`flex h-9 w-9 md:h-11 md:w-11 items-center justify-center rounded-full bg-white text-[#1D4533] border border-[#E6CEBC]/80 transition-all duration-300 ease-out hover:shadow-md hover:bg-[#1D4533] hover:text-[#F7EAE0] ${
                                            isDimmed
                                                ? "opacity-30 scale-95"
                                                : "opacity-100"
                                        } ${
                                            isCurrent
                                                ? "scale-110 md:-translate-x-1 -translate-y-1"
                                                : ""
                                        }`}
                                        aria-label={social.name}
                                    >
                                        <social.icon
                                            size={15}
                                            className="md:w-4 md:h-4"
                                        />
                                    </a>
                                );
                            })}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ========================================= */}
            {/* FASE 3: TRANSISI HALUS (WARM PAPER TONE) */}
            {/* ========================================= */}
            <AnimatePresence>
                {appState === "exiting" && (
                    <motion.div
                        className="fixed inset-0 z-[100] bg-[#F7EAE0] flex flex-col items-center justify-center p-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.45, ease: "easeInOut" }}
                    >
                        <div className="flex flex-col items-center text-center">
                            {/* Logo Cokelat Tua Full & Bersih */}
                            <motion.img
                                src="/LOGO.png"
                                alt="Abu Haidar"
                                style={{
                                    filter: `${solidBrownLogoFilter} drop-shadow(0 8px 16px rgba(94,49,34,0.15))`,
                                }}
                                className="h-28 sm:h-36 md:h-40 w-auto mb-4"
                                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ duration: 0.5, ease: appleEase }}
                            />

                            {/* Teks Sambutan Menuju Beranda */}
                            <motion.h2
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.15, duration: 0.4 }}
                                className="font-brand text-2xl sm:text-3xl font-extrabold uppercase tracking-[0.25em] text-[#1D4533]"
                            >
                                Abu Haidar
                            </motion.h2>

                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.8 }}
                                transition={{ delay: 0.25, duration: 0.4 }}
                                className="mt-2 text-[12px] sm:text-[13px] font-semibold tracking-widest text-[#5E3122] uppercase"
                            >
                                Selamat Datang di Portal Kajian & Risalah Islam
                            </motion.p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
