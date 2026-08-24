import { Head, router } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { FaYoutube, FaInstagram, FaFacebookF } from "react-icons/fa";

// Apple-like Easing Curve
const appleEase = [0.16, 1, 0.3, 1];

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
        }, 800);
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
            {/* BACKGROUND: FLUID GLOWING ORBS (PALET WARNA BARU)        */}
            {/* ======================================================== */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                {/* Orb Hijau Hijau Islam - Atas Kiri */}
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
                    className="absolute -top-[10%] -left-[10%] h-[55vw] w-[55vw] max-w-[520px] max-h-[520px] rounded-full bg-gradient-to-tr from-[#1D4533] to-[#2B6149] opacity-20 blur-[60px]"
                />

                {/* Orb Peach Warm Gold - Bawah Kanan */}
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
                {/* FASE 1: LOADER HALUS                     */}
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
                        <div className="relative mb-8">
                            <motion.img
                                src="/LOGO.png"
                                alt="Abu Haidar Logo"
                                className="h-20 w-auto relative z-10 drop-shadow-sm"
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, ease: appleEase }}
                            />
                        </div>
                        <div className="h-[2px] w-36 bg-[#F9D2BA]/60 overflow-hidden rounded-full relative">
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
                {/* FASE 2: WELCOME REVEAL                    */}
                {/* ========================================= */}
                {appState === "welcome" && (
                    <motion.div
                        key="welcome"
                        className="relative z-10 flex flex-col items-center justify-center w-full h-full px-6"
                        exit={{
                            opacity: 0,
                            scale: 0.96,
                            transition: { duration: 0.6, ease: appleEase },
                        }}
                    >
                        {/* Logo Melayang */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.85 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1, ease: appleEase }}
                            className="mb-6 md:mb-8"
                        >
                            <motion.img
                                animate={{ y: [0, -8, 0] }}
                                transition={{
                                    duration: 4,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                                style={{ willChange: "transform" }}
                                src="/LOGO.png"
                                alt="Abu Haidar"
                                className="h-20 sm:h-24 md:h-32 w-auto drop-shadow-md"
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
                            className="max-w-md md:max-w-lg text-center text-[13px] md:text-[16px] text-[#5E3122]/80 leading-relaxed mb-8 md:mb-12 font-medium px-4"
                        >
                            Menyajikan artikel, tafsir, dan catatan kajian
                            berlandaskan pemahaman salafush shalih dalam balutan
                            editorial modern.
                        </motion.p>

                        {/* Tombol Utama */}
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
                                className="group relative overflow-hidden flex items-center justify-center gap-4 rounded-full bg-[#1D4533] px-9 md:px-12 py-3.5 md:py-5 text-[12px] md:text-[14px] font-bold tracking-[0.2em] text-[#F7EAE0] transition-all duration-300 hover:shadow-[0_20px_40px_-15px_rgba(29,69,51,0.4)] hover:-translate-y-1 active:scale-95 cursor-pointer border border-[#F9D2BA]/40"
                            >
                                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#1D4533] via-[#285E48] to-[#1D4533] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <span className="relative z-10 uppercase">
                                    Mulai Membaca
                                </span>
                                <div className="relative z-10 flex h-7 w-7 md:h-8 md:w-8 items-center justify-center rounded-full bg-[#F9D2BA]/20 transition-all duration-500 group-hover:translate-x-1.5 group-hover:bg-[#F9D2BA] group-hover:text-[#1D4533]">
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
                            className="absolute bottom-6 left-1/2 -translate-x-1/2 md:bottom-auto md:left-auto md:right-8 lg:right-10 md:top-1/2 md:-translate-y-1/2 flex flex-row md:flex-col items-center gap-3 md:gap-4 z-50 p-2 md:p-3 rounded-full bg-white/80 backdrop-blur-md border border-[#F9D2BA] shadow-xs"
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
                                        className={`flex h-9 w-9 md:h-11 md:w-11 items-center justify-center rounded-full bg-[#FDFBF9] text-[#1D4533] border border-[#F9D2BA]/60 transition-all duration-300 ease-out hover:shadow-md hover:bg-[#1D4533] hover:text-[#F7EAE0] ${
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
            {/* FASE 3: SHUTTER EXIT                      */}
            {/* ========================================= */}
            <AnimatePresence>
                {appState === "exiting" && (
                    <motion.div
                        className="fixed inset-0 z-[100] bg-[#1D4533] flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                    >
                        <motion.img
                            src="/LOGO.png"
                            alt="Loading"
                            className="h-16 brightness-0 invert opacity-80"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 0.8, scale: 1 }}
                            transition={{ duration: 0.3 }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
