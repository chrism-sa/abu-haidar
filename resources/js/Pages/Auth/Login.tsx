import { useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { motion } from "framer-motion";

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);

    // Inertia form helper untuk menangani request login
    const { data, setData, post, processing, errors } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post("/login");
    };

    // --- ANIMATION VARIANTS ---
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.2 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
        },
    };

    const slideRight = {
        hidden: { opacity: 0, x: -50 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
        },
    };

    return (
        <div className="flex min-h-screen bg-[#FBFBF9] selection:bg-[#0F4C3A] selection:text-white">
            <Head title="Login Admin - Abu Haidar" />

            {/* KIRI: Sisi Branding (Gradient Deep Emerald & Gold) */}
            <motion.div
                initial="hidden"
                animate="visible"
                variants={slideRight}
                className="hidden w-full max-w-[500px] flex-col items-center justify-center bg-gradient-to-br from-[#072B20] to-[#0A382A] p-12 text-center text-white lg:flex relative overflow-hidden"
            >
                {/* Efek Glow Modern di Background */}
                <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-[#0F4C3A] opacity-40 blur-[100px]"></div>
                <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-[#C5A059] opacity-20 blur-[100px]"></div>

                <div className="relative z-10 flex flex-col items-center">
                    <motion.img
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{
                            duration: 0.8,
                            ease: "easeOut",
                            delay: 0.3,
                        }}
                        src="/LOGO.png"
                        alt="Abu Haidar"
                        className="mb-8 h-24 drop-shadow-2xl"
                    />
                    <div className="h-[2px] w-12 bg-[#C5A059] mb-6 rounded-full"></div>
                    <h1 className="font-serif text-[32px] font-bold text-[#C5A059] drop-shadow-md">
                        Abu Haidar
                    </h1>
                    <p className="mt-1 text-[11px] tracking-[0.2em] text-[#E8E6E1]/80 uppercase font-medium">
                        Artikel Islam & Dakwah
                    </p>
                    <p className="mt-8 max-w-[280px] text-[14px] leading-relaxed text-white/70">
                        Portal manajemen konten dakwah. Silakan masuk untuk
                        mengelola artikel, tafsir, dan media.
                    </p>
                </div>
            </motion.div>

            {/* KANAN: Form Login Modern */}
            <div className="flex w-full flex-1 flex-col items-center justify-center p-6 sm:p-12 relative">
                {/* Ornamen Latar (Hanya hiasan garis abstrak) */}
                <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#0F4C3A]/[0.02] via-transparent to-transparent pointer-events-none"></div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="w-full max-w-[420px] rounded-[24px] bg-white p-8 sm:p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-[#E8E6E1] relative z-10"
                >
                    {/* Header Form Mobile */}
                    <motion.div
                        variants={itemVariants}
                        className="mb-8 text-center lg:hidden flex flex-col items-center"
                    >
                        <img
                            src="/LOGO.png"
                            alt="Logo"
                            className="mb-4 h-16 drop-shadow-md"
                        />
                        <h1 className="font-serif text-[24px] font-bold text-[#0A382A]">
                            Abu Haidar
                        </h1>
                        <p className="mt-1 text-[10px] tracking-widest text-[#C5A059] uppercase font-bold">
                            Admin Portal
                        </p>
                    </motion.div>

                    <motion.div
                        variants={itemVariants}
                        className="mb-8 hidden lg:block"
                    >
                        <h2 className="font-serif text-[28px] font-bold text-[#162B22]">
                            Selamat Datang,
                        </h2>
                        <p className="mt-2 text-[13px] text-[#6C857A]">
                            Masukkan kredensial Anda untuk melanjutkan.
                        </p>
                    </motion.div>

                    <form onSubmit={submit} className="space-y-5">
                        {/* Email */}
                        <motion.div variants={itemVariants}>
                            <label className="mb-2 block text-[12px] font-bold text-[#162B22]">
                                Alamat Email
                            </label>
                            <div className="relative group">
                                <Mail
                                    size={16}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A5B9AD] transition-colors group-focus-within:text-[#0F4C3A]"
                                />
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                    placeholder="admin@abuhaidar.com"
                                    className="w-full rounded-xl border border-[#E8E6E1] bg-[#F4F4F0] py-3.5 pl-11 pr-4 text-[13px] outline-none transition-all focus:border-[#0F4C3A] focus:bg-white focus:ring-4 focus:ring-[#0F4C3A]/5"
                                    required
                                />
                            </div>
                            {errors.email && (
                                <p className="mt-1.5 text-[11px] text-red-500 font-medium">
                                    {errors.email}
                                </p>
                            )}
                        </motion.div>

                        {/* Password */}
                        <motion.div variants={itemVariants}>
                            <label className="mb-2 block text-[12px] font-bold text-[#162B22]">
                                Kata Sandi
                            </label>
                            <div className="relative group">
                                <Lock
                                    size={16}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A5B9AD] transition-colors group-focus-within:text-[#0F4C3A]"
                                />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={data.password}
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                    placeholder="••••••••"
                                    className="w-full rounded-xl border border-[#E8E6E1] bg-[#F4F4F0] py-3.5 pl-11 pr-12 text-[13px] tracking-wider outline-none transition-all focus:border-[#0F4C3A] focus:bg-white focus:ring-4 focus:ring-[#0F4C3A]/5"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A5B9AD] transition-colors hover:text-[#0F4C3A]"
                                >
                                    {showPassword ? (
                                        <EyeOff size={16} />
                                    ) : (
                                        <Eye size={16} />
                                    )}
                                </button>
                            </div>
                        </motion.div>

                        {/* Ingat Saya */}
                        <motion.div
                            variants={itemVariants}
                            className="flex items-center gap-3 pt-1"
                        >
                            <label className="relative flex cursor-pointer items-center rounded-full">
                                <input
                                    type="checkbox"
                                    id="remember"
                                    checked={data.remember}
                                    onChange={(e) =>
                                        setData("remember", e.target.checked)
                                    }
                                    className="peer before:content[''] relative h-4 w-4 cursor-pointer appearance-none rounded border border-[#C5A059] bg-[#F4F4F0] transition-all before:absolute before:left-2/4 before:top-2/4 before:block before:h-12 before:w-12 before:-translate-x-2/4 before:-translate-y-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-[#0F4C3A] checked:bg-[#0F4C3A] checked:before:bg-[#0F4C3A] hover:before:opacity-10"
                                />
                                <span className="pointer-events-none absolute left-2/4 top-2/4 -translate-x-2/4 -translate-y-2/4 text-white opacity-0 transition-opacity peer-checked:opacity-100">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-3 w-3"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        stroke="currentColor"
                                        strokeWidth="1"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clipRule="evenodd"
                                        ></path>
                                    </svg>
                                </span>
                            </label>
                            <label
                                htmlFor="remember"
                                className="cursor-pointer text-[12px] font-medium text-[#6C857A] select-none"
                            >
                                Tetap masuk di perangkat ini
                            </label>
                        </motion.div>

                        {/* Submit Button */}
                        <motion.div variants={itemVariants} className="pt-4">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={processing}
                                className="w-full rounded-xl bg-[#0F4C3A] py-3.5 text-[13px] font-bold text-white transition-colors hover:bg-[#0A382A] disabled:opacity-70 shadow-lg shadow-[#0F4C3A]/20 flex justify-center items-center gap-2"
                            >
                                {processing ? (
                                    <>
                                        <svg
                                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                        </svg>
                                        Memproses...
                                    </>
                                ) : (
                                    "Masuk ke Dashboard"
                                )}
                            </motion.button>
                        </motion.div>
                    </form>

                    <motion.div
                        variants={itemVariants}
                        className="mt-8 text-center text-[11px] text-[#A5B9AD]"
                    >
                        © 2026 Abu Haidar Official.
                        <br />
                        All rights reserved.
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
