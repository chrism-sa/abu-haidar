import { useState, useEffect } from "react";
import { Eye, EyeOff, X, Mail, Lock, Loader2, LogIn } from "lucide-react";
import { useForm } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const solidBrownLogoFilter =
    "brightness(0) saturate(100%) invert(20%) sepia(35%) saturate(1500%) hue-rotate(345deg) brightness(90%) contrast(95%)";

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm({
            email: "",
            password: "",
            remember: false,
        });

    useEffect(() => {
        if (!isOpen) {
            reset("password");
            clearErrors();
            setShowPassword(false);
        }
    }, [isOpen]);

    const handleClose = (): void => {
        if (!processing) {
            reset("password");
            clearErrors();
            onClose();
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post("/login", {
            onSuccess: () => {
                handleClose();
                toast.success("Ahlan wa Sahlan! Berhasil masuk.", {
                    icon: "✨",
                    style: {
                        borderRadius: "12px",
                        background: "#1D4533",
                        color: "#F7EAE0",
                        fontWeight: "bold",
                    },
                });
                // router.visit() dihapus agar tidak terjadi reload 2x
            },
            onError: () => {
                toast.error("Alamat email atau kata sandi tidak cocok.", {
                    style: {
                        borderRadius: "12px",
                        background: "#FAF1E8",
                        border: "1px solid #E6CEBC",
                        color: "#991B1B",
                        fontWeight: "bold",
                    },
                });
                reset("password");
            },
        });
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
                    {/* BACKDROP BLUR */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-xs"
                        onClick={handleClose}
                    />

                    {/* MODAL CONTAINER */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 15 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{
                            type: "spring",
                            bounce: 0.25,
                            duration: 0.45,
                        }}
                        className="relative z-10 w-full max-w-[420px] overflow-hidden rounded-3xl bg-[#FDF9F5] shadow-2xl border border-[#E8CEBC] my-auto"
                    >
                        {/* Tombol Tutup */}
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={processing}
                            className="absolute right-4 top-4 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-[#FAF1E8] text-[#5E3122]/70 transition hover:bg-[#F2E0D2] hover:text-[#1D4533] disabled:opacity-50 cursor-pointer"
                        >
                            <X size={16} strokeWidth={2.5} />
                        </button>

                        <div className="relative p-6 sm:p-8">
                            {/* LOGO & JUDUL */}
                            <div className="mb-6 text-center">
                                <motion.div
                                    initial={{ scale: 0.6, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.1, duration: 0.4 }}
                                    className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-[#FAF1E8] border border-[#E8CEBC] shadow-2xs mb-4"
                                >
                                    <img
                                        src="/LOGO.png"
                                        alt="Logo Abu Haidar"
                                        style={{ filter: solidBrownLogoFilter }}
                                        className="h-12 w-auto object-contain"
                                    />
                                </motion.div>
                                <h2 className="font-brand text-[22px] font-bold text-[#1D4533]">
                                    Masuk ke Akun
                                </h2>
                                <p className="mt-1 text-[12.5px] text-[#5E3122]/75 font-medium">
                                    Silakan masukkan email dan kata sandi Anda.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* INPUT EMAIL */}
                                <div>
                                    <label className="mb-1 block text-[11.5px] font-bold uppercase tracking-wider text-[#5E3122]">
                                        Alamat Email
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#8C5E43]/60 transition group-focus-within:text-[#1D4533]">
                                            <Mail size={16} />
                                        </div>
                                        <input
                                            type="email"
                                            value={data.email}
                                            onChange={(e) =>
                                                setData("email", e.target.value)
                                            }
                                            placeholder="nama@email.com"
                                            className={`w-full rounded-xl border bg-[#FAF1E8] py-2.5 pl-10 pr-4 text-[13px] font-medium text-[#5E3122] outline-none transition-all focus:bg-white focus:ring-3 ${
                                                errors.email
                                                    ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                                                    : "border-[#E8CEBC] focus:border-[#1D4533] focus:ring-[#1D4533]/10"
                                            }`}
                                            required
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="mt-1 text-[10.5px] font-bold text-red-600">
                                            {errors.email}
                                        </p>
                                    )}
                                </div>

                                {/* INPUT PASSWORD */}
                                <div>
                                    <label className="mb-1 block text-[11.5px] font-bold uppercase tracking-wider text-[#5E3122]">
                                        Kata Sandi
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#8C5E43]/60 transition group-focus-within:text-[#1D4533]">
                                            <Lock size={16} />
                                        </div>
                                        <input
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            value={data.password}
                                            onChange={(e) =>
                                                setData(
                                                    "password",
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="••••••••"
                                            className={`w-full rounded-xl border bg-[#FAF1E8] py-2.5 pl-10 pr-11 text-[13px] font-medium text-[#5E3122] outline-none transition-all focus:bg-white focus:ring-3 ${
                                                errors.password
                                                    ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                                                    : "border-[#E8CEBC] focus:border-[#1D4533] focus:ring-[#1D4533]/10"
                                            }`}
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
                                            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-[#8C5E43]/60 transition hover:text-[#1D4533] cursor-pointer"
                                        >
                                            {showPassword ? (
                                                <EyeOff size={15} />
                                            ) : (
                                                <Eye size={15} />
                                            )}
                                        </button>
                                    </div>
                                    {errors.password && (
                                        <p className="mt-1 text-[10.5px] font-bold text-red-600">
                                            {errors.password}
                                        </p>
                                    )}
                                </div>

                                {/* CHECKBOX REMEMBER ME */}
                                <div className="flex items-center gap-2 pt-0.5">
                                    <input
                                        type="checkbox"
                                        id="remember_modal"
                                        checked={data.remember}
                                        onChange={(e) =>
                                            setData(
                                                "remember",
                                                e.target.checked,
                                            )
                                        }
                                        className="h-4 w-4 rounded border-[#E8CEBC] bg-[#FAF1E8] text-[#1D4533] focus:ring-[#1D4533] accent-[#1D4533] cursor-pointer"
                                    />
                                    <label
                                        htmlFor="remember_modal"
                                        className="cursor-pointer text-[12px] font-medium text-[#5E3122]/80 select-none"
                                    >
                                        Ingat sesi masuk saya
                                    </label>
                                </div>

                                {/* TOMBOL MASUK */}
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#1D4533] py-3 text-[13px] font-bold text-[#F7EAE0] transition hover:bg-[#143325] disabled:opacity-70 cursor-pointer shadow-xs active:scale-95"
                                >
                                    {processing ? (
                                        <>
                                            <Loader2
                                                size={16}
                                                className="animate-spin"
                                            />
                                            <span>Memverifikasi...</span>
                                        </>
                                    ) : (
                                        <>
                                            <LogIn size={16} />
                                            <span>Masuk Sekarang</span>
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
