import { Head, router } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Lock } from "lucide-react";

export default function Welcome() {
    // State: 'loading' | 'welcome' | 'exiting'
    const [appState, setAppState] = useState<"loading" | "welcome" | "exiting">("loading");
    const [destination, setDestination] = useState<"/home" | "/login" | null>(null);

    // Fase 1: Initial Loading Screen (Berjalan 1.8 detik)
    useEffect(() => {
        const timer = setTimeout(() => {
            if (appState === "loading") setAppState("welcome");
        }, 1800);
        return () => clearTimeout(timer);
    }, [appState]);

    // Fase 3: Page Transition Delay sebelum pindah route
    const handleTransition = (path: "/home" | "/login") => {
        setAppState("exiting");
        setDestination(path);
        setTimeout(() => {
            router.visit(path);
        }, 800); // Tunggu animasi exit selesai
    };

    return (
        <div className="relative min-h-screen bg-[#fafaf8] text-[#17251f] selection:bg-[#063f2f] selection:text-white overflow-hidden flex flex-col items-center justify-center">
            <Head title="Abu Haidar - Portal Risalah & Kajian" />

            {/* Subtle Editorial Grain/Noise Background */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-[0.03] pointer-events-none" />

            <AnimatePresence mode="wait">
                {/* ========================================= */}
                {/* FASE 1: LOADING SCREEN                    */}
                {/* ========================================= */}
                {appState === "loading" && (
                    <motion.div
                        key="loading"
                        className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#fafaf8]"
                        exit={{ opacity: 0, filter: "blur(10px)", transition: { duration: 0.8, ease: "easeInOut" } }}
                    >
                        <motion.img
                            src="/LOGO.png"
                            alt="Logo"
                            className="h-16 w-auto mb-8"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }} // Cinematic ease-out
                        />
                        {/* Elegant Minimalist Loader */}
                        <div className="h-[1px] w-24 bg-[#e5e2da] overflow-hidden relative">
                            <motion.div
                                className="absolute top-0 left-0 h-full bg-[#063f2f]"
                                initial={{ width: "0%", left: "0%" }}
                                animate={{ width: ["0%", "100%", "0%"], left: ["0%", "0%", "100%"] }}
                                transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity }}
                            />
                        </div>
                    </motion.div>
                )}

                {/* ========================================= */}
                {/* FASE 2: WELCOME / ENTRY SCREEN            */}
                {/* ========================================= */}
                {appState === "welcome" && (
                    <motion.div
                        key="welcome"
                        className="relative z-10 flex flex-col items-center justify-center w-full px-6 text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -40, filter: "blur(10px)", transition: { duration: 0.6, ease: "easeInOut" } }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        {/* Logo Animasi Parallax Lembut */}
                        <motion.div
                            animate={{ y: [0, -8, 0] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                            className="mb-8"
                        >
                            <img src="/LOGO.png" alt="Abu Haidar" className="h-20 w-auto drop-shadow-sm" />
                        </motion.div>

                        <motion.h1 
                            className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#111] leading-[1.1] mb-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                        >
                            Risalah Dakwah <br />
                            <span className="italic font-normal text-[#555]">& Literatur Keislaman</span>
                        </motion.h1>

                        <motion.p 
                            className="max-w-md text-[15px] text-[#666] leading-relaxed mb-12"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                        >
                            Menyajikan artikel, tafsir, dan catatan kajian yang berlandaskan pemahaman salafush shalih dalam balutan editorial modern.
                        </motion.p>

                        <motion.div 
                            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.8 }}
                        >
                            {/* Tombol Masuk Utama */}
                            <button
                                onClick={() => handleTransition("/home")}
                                className="group relative overflow-hidden flex w-full sm:w-auto items-center justify-center gap-3 rounded-full bg-[#063f2f] px-8 py-4 text-[13px] font-bold tracking-wide text-white transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[#063f2f]/20"
                            >
                                <span className="relative z-10 uppercase">Mulai Membaca</span>
                                <ArrowRight size={16} className="relative z-10 transition-transform group-hover:translate-x-1" />
                                <div className="absolute inset-0 h-full w-full bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                            </button>

                        
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* FASE 3: OVERLAY LOADING SAAT EXIT */}
            <AnimatePresence>
                {appState === "exiting" && (
                    <motion.div 
                        className="fixed inset-0 z-[100] bg-[#fafaf8]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4 }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}