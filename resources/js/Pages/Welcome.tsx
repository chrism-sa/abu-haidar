import { Head, router } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { FaYoutube, FaInstagram, FaFacebookF } from "react-icons/fa";

// Custom Apple-like Easing Curve
const appleEase = [0.16, 1, 0.3, 1];

export default function Welcome() {
    const [appState, setAppState] = useState<"loading" | "welcome" | "exiting">(
        "loading",
    );
    const [hoveredSocial, setHoveredSocial] = useState<number | null>(null);

    // Fase Loading Sinematik
    useEffect(() => {
        const timer = setTimeout(() => {
            if (appState === "loading") setAppState("welcome");
        }, 2200);
        return () => clearTimeout(timer);
    }, [appState]);

    const handleTransition = (path: "/home" | "/login") => {
        setAppState("exiting");
        setTimeout(() => {
            router.visit(path);
        }, 1000);
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
        // Menggunakan h-[100dvh] dan fixed inset-0 untuk mengunci halaman agar 100% tanpa scroll
        <div className="fixed inset-0 h-[100dvh] w-full bg-[#FBFBF9] text-[#162B22] selection:bg-[#0F4C3A] selection:text-white overflow-hidden flex flex-col items-center justify-center font-sans">
            <Head title="Abu Haidar - Portal Risalah & Kajian" />

            {/* ========================================= */}
            {/* BACKGROUND: FLUID GLOWING ORBS            */}
            {/* ========================================= */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-[0.05] z-10 mix-blend-overlay" />

                <motion.div
                    animate={{
                        x: [0, 100, -50, 0],
                        y: [0, -100, 50, 0],
                        scale: [1, 1.2, 0.8, 1],
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    className="absolute top-[-10%] left-[-10%] h-[60vh] w-[60vw] rounded-full bg-gradient-to-tr from-[#0F4C3A] to-[#218A6A] opacity-[0.06] blur-[100px]"
                />
                <motion.div
                    animate={{
                        x: [0, -100, 80, 0],
                        y: [0, 100, -80, 0],
                        scale: [1, 0.9, 1.1, 1],
                    }}
                    transition={{
                        duration: 18,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    className="absolute bottom-[-10%] right-[-10%] h-[70vh] w-[70vw] rounded-full bg-gradient-to-bl from-[#C5A059] to-[#E3C586] opacity-[0.08] blur-[120px]"
                />
            </div>

            <AnimatePresence mode="wait">
                {/* ========================================= */}
                {/* FASE 1: ULTRA-MINIMALIST LOADER           */}
                {/* ========================================= */}
                {appState === "loading" && (
                    <motion.div
                        key="loading"
                        className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#FBFBF9]"
                        exit={{
                            opacity: 0,
                            filter: "blur(20px)",
                            transition: { duration: 1, ease: appleEase },
                        }}
                    >
                        <div className="relative mb-12">
                            <motion.img
                                src="/LOGO.png"
                                alt="Logo"
                                className="h-20 w-auto relative z-10"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1, ease: appleEase }}
                            />
                            <motion.div
                                className="absolute inset-0 z-20 bg-gradient-to-r from-transparent via-white/80 to-transparent skew-x-12"
                                initial={{ x: "-150%" }}
                                animate={{ x: "150%" }}
                                transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    repeatDelay: 0.5,
                                    ease: "easeInOut",
                                }}
                            />
                        </div>
                        <div className="h-[2px] w-40 bg-[#E8E6E1] overflow-hidden rounded-full relative">
                            <motion.div
                                className="absolute top-0 left-0 h-full bg-[#0F4C3A]"
                                initial={{ x: "-100%" }}
                                animate={{ x: "100%" }}
                                transition={{
                                    duration: 1.2,
                                    ease: "easeInOut",
                                    repeat: Infinity,
                                }}
                            />
                        </div>
                    </motion.div>
                )}

                {/* ========================================= */}
                {/* FASE 2: WELCOME (APPLE-STYLE REVEAL)      */}
                {/* ========================================= */}
                {appState === "welcome" && (
                    <motion.div
                        key="welcome"
                        className="relative z-10 flex flex-col items-center justify-center w-full h-full px-6"
                        exit={{
                            opacity: 0,
                            scale: 0.95,
                            transition: { duration: 0.8, ease: appleEase },
                        }}
                    >
                        {/* Logo Tengah */}
                        <motion.div
                            initial={{
                                opacity: 0,
                                scale: 0.8,
                                filter: "blur(10px)",
                            }}
                            animate={{
                                opacity: 1,
                                scale: 1,
                                filter: "blur(0px)",
                            }}
                            transition={{ duration: 1.2, ease: appleEase }}
                            className="mb-8"
                        >
                            <motion.img
                                animate={{ y: [0, -12, 0] }}
                                transition={{
                                    duration: 4,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                                src="/LOGO.png"
                                alt="Abu Haidar"
                                className="h-24 md:h-32 w-auto drop-shadow-xl"
                            />
                        </motion.div>

                        <div className="overflow-hidden pb-1 text-center">
                            <motion.h1
                                initial={{ y: "100%" }}
                                animate={{ y: 0 }}
                                transition={{
                                    duration: 1,
                                    ease: appleEase,
                                    delay: 0.2,
                                }}
                                className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-[#0A382A] leading-tight"
                            >
                                Risalah Dakwah
                            </motion.h1>
                        </div>
                        <div className="overflow-hidden mb-6 text-center">
                            <motion.h1
                                initial={{ y: "100%" }}
                                animate={{ y: 0 }}
                                transition={{
                                    duration: 1,
                                    ease: appleEase,
                                    delay: 0.3,
                                }}
                                className="font-serif text-3xl md:text-4xl lg:text-5xl italic text-[#C5A059] leading-tight"
                            >
                                & Literatur Keislaman
                            </motion.h1>
                        </div>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 1,
                                ease: appleEase,
                                delay: 0.5,
                            }}
                            className="max-w-md md:max-w-lg text-center text-[14px] md:text-[16px] text-[#6C857A] leading-relaxed mb-10 md:mb-12 font-medium px-4"
                        >
                            Menyajikan artikel, tafsir, dan catatan kajian
                            berlandaskan pemahaman salafush shalih dalam balutan
                            editorial modern.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{
                                duration: 1,
                                ease: appleEase,
                                delay: 0.7,
                            }}
                        >
                            <button
                                onClick={() => handleTransition("/home")}
                                className="group relative overflow-hidden flex items-center justify-center gap-4 rounded-full bg-[#0F4C3A] px-10 md:px-12 py-4 md:py-5 text-[13px] md:text-[14px] font-bold tracking-[0.2em] text-white transition-all duration-300 hover:shadow-[0_20px_40px_-15px_rgba(15,76,58,0.6)] hover:-translate-y-1 active:scale-95"
                            >
                                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#0F4C3A] via-[#1A6D52] to-[#0F4C3A] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <span className="relative z-10 uppercase">
                                    Mulai Membaca
                                </span>
                                <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 transition-transform duration-500 group-hover:translate-x-2 group-hover:bg-[#C5A059]">
                                    <ArrowRight
                                        size={16}
                                        className="text-white"
                                    />
                                </div>
                            </button>
                        </motion.div>

                        {/* ========================================= */}
                        {/* VERTICAL FLOATING DOCK (Kanan Layar)      */}
                        {/* ========================================= */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                                duration: 1,
                                delay: 1,
                                ease: appleEase,
                            }}
                            className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 flex flex-col items-center gap-4 z-50 p-3 rounded-full bg-white/40 backdrop-blur-md border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
                            onMouseLeave={() => setHoveredSocial(null)}
                        >
                            {socials.map((social) => (
                                <a
                                    key={social.id}
                                    href={social.link}
                                    target="_blank"
                                    rel="noreferrer"
                                    onMouseEnter={() =>
                                        setHoveredSocial(social.id)
                                    }
                                    // Logika Meredup & Blur untuk ikon yang TIDAK di-hover
                                    // Serta membesar (scale) & bergeser (translateX) untuk ikon yang DI-HOVER
                                    style={{
                                        opacity:
                                            hoveredSocial !== null &&
                                            hoveredSocial !== social.id
                                                ? 0.3
                                                : 1,
                                        filter:
                                            hoveredSocial !== null &&
                                            hoveredSocial !== social.id
                                                ? "blur(3px)"
                                                : "blur(0px)",
                                        transform:
                                            hoveredSocial === social.id
                                                ? "scale(1.2) translateX(-6px)"
                                                : "scale(1) translateX(0px)",
                                    }}
                                    className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-white shadow-sm text-[#0F4C3A] transition-all duration-400 ease-out hover:shadow-lg hover:text-[#0F4C3A]"
                                    aria-label={social.name}
                                >
                                    <social.icon size={18} />
                                </a>
                            ))}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ========================================= */}
            {/* FASE 3: SHUTTER EXIT TRANSITION           */}
            {/* ========================================= */}
            <AnimatePresence>
                {appState === "exiting" && (
                    <motion.div
                        className="fixed inset-0 z-[100] bg-[#0F4C3A] origin-bottom"
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                    >
                        <div className="absolute inset-0 flex items-center justify-center">
                            <motion.img
                                src="/LOGO.png"
                                alt="Loading"
                                className="h-16 brightness-0 invert opacity-50"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 0.5, y: 0 }}
                                transition={{ delay: 0.4, duration: 0.4 }}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
