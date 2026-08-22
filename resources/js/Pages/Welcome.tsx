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
        <div className="fixed inset-0 h-[100dvh] w-full bg-[#FBFBF9] text-[#162B22] selection:bg-[#0F4C3A] selection:text-white overflow-hidden flex flex-col items-center justify-center font-sans select-none">
            <Head title="Abu Haidar - Portal Risalah & Kajian" />

            {/* ======================================================== */}
            {/* BACKGROUND: FLUID GLOWING ORBS (RINGAN & HARDWARE-ACCELERATED) */}
            {/* ======================================================== */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                {/* Orb Hijau Zamrud - Atas Kiri */}
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
                    className="absolute -top-[10%] -left-[10%] h-[55vw] w-[55vw] max-w-[500px] max-h-[500px] rounded-full bg-gradient-to-tr from-[#0F4C3A] to-[#218A6A] opacity-15 blur-[60px]"
                />

                {/* Orb Emas Warm - Bawah Kanan */}
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
                    className="absolute -bottom-[10%] -right-[10%] h-[60vw] w-[60vw] max-w-[550px] max-h-[550px] rounded-full bg-gradient-to-bl from-[#C5A059] to-[#E3C586] opacity-20 blur-[70px]"
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
                            transition: { duration: 0.8, ease: appleEase },
                        }}
                    >
                        <div className="relative mb-10">
                            <motion.img
                                src="/LOGO.png"
                                alt="Logo"
                                className="h-20 w-auto relative z-10 drop-shadow-sm"
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, ease: appleEase }}
                            />
                        </div>
                        <div className="h-[2px] w-36 bg-[#E8E6E1] overflow-hidden rounded-full relative">
                            <motion.div
                                className="absolute top-0 left-0 h-full w-full bg-[#0F4C3A]"
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
                {/* FASE 2: WELCOME (PREMIUM CINEMATIC REVEAL) */}
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
                        {/* Logo Melayang Halus */}
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
                                className="h-20 sm:h-24 md:h-32 w-auto drop-shadow-xl"
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
                                className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-[#0A382A] leading-tight"
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
                                className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl italic text-[#C5A059] leading-tight"
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
                            className="max-w-md md:max-w-lg text-center text-[13px] md:text-[16px] text-[#6C857A] leading-relaxed mb-8 md:mb-12 font-medium px-4"
                        >
                            Menyajikan artikel, tafsir, dan catatan kajian
                            berlandaskan pemahaman salafush shalih dalam balutan
                            editorial modern.
                        </motion.p>

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
                                className="group relative overflow-hidden flex items-center justify-center gap-4 rounded-full bg-[#0F4C3A] px-9 md:px-12 py-3.5 md:py-5 text-[12px] md:text-[14px] font-bold tracking-[0.2em] text-white transition-all duration-300 hover:shadow-[0_20px_40px_-15px_rgba(15,76,58,0.5)] hover:-translate-y-1 active:scale-95 cursor-pointer"
                            >
                                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#0F4C3A] via-[#1A6D52] to-[#0F4C3A] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <span className="relative z-10 uppercase">
                                    Mulai Membaca
                                </span>
                                <div className="relative z-10 flex h-7 w-7 md:h-8 md:w-8 items-center justify-center rounded-full bg-white/10 transition-transform duration-500 group-hover:translate-x-2 group-hover:bg-[#C5A059]">
                                    <ArrowRight
                                        size={15}
                                        className="text-white"
                                    />
                                </div>
                            </button>
                        </motion.div>

                        {/* ========================================================= */}
                        {/* FLOATING DOCK SOSMED:                                     */}
                        {/* - Mobile : Bawah tengah (Horizontal / flex-row)          */}
                        {/* - Desktop: Samping kanan (Vertical / flex-col md:top-1/2) */}
                        {/* ========================================================= */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.8,
                                delay: 0.75,
                                ease: appleEase,
                            }}
                            className="absolute bottom-6 left-1/2 -translate-x-1/2 md:bottom-auto md:left-auto md:right-8 lg:right-10 md:top-1/2 md:-translate-y-1/2 flex flex-row md:flex-col items-center gap-3 md:gap-4 z-50 p-2 md:p-3 rounded-full bg-white/70 backdrop-blur-md border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
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
                                        className={`flex h-9 w-9 md:h-12 md:w-12 items-center justify-center rounded-full bg-white shadow-xs text-[#0F4C3A] transition-all duration-300 ease-out hover:shadow-md hover:text-[#0A382A] ${
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
                                            size={16}
                                            className="md:w-5 md:h-5"
                                        />
                                    </a>
                                );
                            })}
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
                        className="fixed inset-0 z-[100] bg-[#0F4C3A] flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                    >
                        <motion.img
                            src="/LOGO.png"
                            alt="Loading"
                            className="h-16 brightness-0 invert opacity-60"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 0.6, scale: 1 }}
                            transition={{ duration: 0.3 }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
