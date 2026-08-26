import { useState } from "react";
import { Head, useForm, Link } from "@inertiajs/react";
import {
    Eye,
    EyeOff,
    Lock,
    Mail,
    Loader2,
    ArrowLeft,
    LogIn,
} from "lucide-react";
import { motion } from "framer-motion";

const solidBrownLogoFilter =
    "brightness(0) saturate(100%) invert(20%) sepia(35%) saturate(1500%) hue-rotate(345deg) brightness(90%) contrast(95%)";

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post("/login");
    };

    return (
        <div className="flex min-h-screen bg-[#F7EAE0] text-[#5E3122] selection:bg-[#1D4533] selection:text-[#F7EAE0]">
            <Head title="Masuk Akun - Abu Haidar" />

            {/* SISI KIRI: Branding Panel (Warm Dark Green) */}
            <div className="hidden w-full max-w-[480px] flex-col justify-between bg-[#1D4533] p-10 lg:p-12 text-[#F7EAE0] lg:flex relative overflow-hidden">
                <div className="relative z-10">
                    <Link
                        href="/home"
                        className="inline-flex items-center gap-2 rounded-full bg-[#FAF1E8]/10 border border-[#FAF1E8]/20 px-3.5 py-1.5 text-xs font-bold text-[#FAF1E8] hover:bg-[#FAF1E8]/20 transition"
                    >
                        <ArrowLeft size={14} />
                        <span>Ke Beranda</span>
                    </Link>
                </div>

                <div className="relative z-10 my-auto flex flex-col items-center text-center">
                    <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-[#FAF1E8] border border-[#E6CEBC] shadow-md mb-5">
                        <img
                            src="/LOGO.png"
                            alt="Logo Abu Haidar"
                            style={{ filter: solidBrownLogoFilter }}
                            className="h-16 w-auto object-contain"
                        />
                    </div>
                    <h1 className="font-brand text-3xl font-bold tracking-tight text-[#FAF1E8]">
                        Abu Haidar
                    </h1>
                    <p className="mt-1 text-[11px] font-bold tracking-[0.25em] text-[#DFC9BC] uppercase">
                        Risalah & Literatur Keislaman
                    </p>
                    <p className="mt-6 max-w-[300px] text-[13px] leading-relaxed text-[#DFC9BC]/85 font-medium">
                        Portal artikel, catatan kajian ilmiah, dan risalah
                        dakwah salafush shalih.
                    </p>
                </div>

                <div className="relative z-10 text-center text-[11px] text-[#DFC9BC]/60 font-medium">
                    © 2026 Abu Haidar Official. All rights reserved.
                </div>
            </div>

            {/* SISI KANAN: Form Login Modern */}
            <div className="flex w-full flex-1 flex-col items-center justify-center p-4 sm:p-8 relative">
                <div className="w-full max-w-[420px] rounded-3xl bg-[#FDF9F5] p-6 sm:p-10 shadow-lg border border-[#E8CEBC] relative z-10">
                    {/* Header Mobile */}
                    <div className="mb-6 text-center lg:hidden flex flex-col items-center">
                        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#FAF1E8] border border-[#E8CEBC] shadow-2xs mb-3">
                            <img
                                src="/LOGO.png"
                                alt="Logo"
                                style={{ filter: solidBrownLogoFilter }}
                                className="h-12 w-auto object-contain"
                            />
                        </div>
                        <h1 className="font-brand text-2xl font-bold text-[#1D4533]">
                            Abu Haidar
                        </h1>
                        <p className="text-[10.5px] tracking-widest text-[#8C5E43] uppercase font-bold">
                            Portal Masuk
                        </p>
                    </div>

                    <div className="mb-6 hidden lg:block">
                        <h2 className="font-brand text-2xl font-bold text-[#1D4533]">
                            Selamat Datang,
                        </h2>
                        <p className="mt-1 text-[13px] text-[#5E3122]/75 font-medium">
                            Masukkan kredensial akun Anda untuk melanjutkan.
                        </p>
                    </div>

                    <form onSubmit={submit} className="space-y-4">
                        {/* Email */}
                        <div>
                            <label className="mb-1 block text-[11.5px] font-bold uppercase tracking-wider text-[#5E3122]">
                                Alamat Email
                            </label>
                            <div className="relative group">
                                <Mail
                                    size={16}
                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C5E43]/60 transition-colors group-focus-within:text-[#1D4533]"
                                />
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                    placeholder="nama@email.com"
                                    className={`w-full rounded-xl border bg-[#FAF1E8] py-3 pl-10 pr-4 text-[13px] text-[#5E3122] outline-none transition focus:bg-white focus:ring-3 ${
                                        errors.email
                                            ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                                            : "border-[#E8CEBC] focus:border-[#1D4533] focus:ring-[#1D4533]/10"
                                    }`}
                                    required
                                />
                            </div>
                            {errors.email && (
                                <p className="mt-1 text-[11px] text-red-600 font-bold">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="mb-1 block text-[11.5px] font-bold uppercase tracking-wider text-[#5E3122]">
                                Kata Sandi
                            </label>
                            <div className="relative group">
                                <Lock
                                    size={16}
                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C5E43]/60 transition-colors group-focus-within:text-[#1D4533]"
                                />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={data.password}
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                    placeholder="••••••••"
                                    className={`w-full rounded-xl border bg-[#FAF1E8] py-3 pl-10 pr-11 text-[13px] text-[#5E3122] outline-none transition focus:bg-white focus:ring-3 ${
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
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8C5E43]/60 transition hover:text-[#1D4533] cursor-pointer"
                                >
                                    {showPassword ? (
                                        <EyeOff size={15} />
                                    ) : (
                                        <Eye size={15} />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1 text-[11px] text-red-600 font-bold">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center gap-2 pt-0.5">
                            <input
                                type="checkbox"
                                id="remember_page"
                                checked={data.remember}
                                onChange={(e) =>
                                    setData("remember", e.target.checked)
                                }
                                className="h-4 w-4 rounded border-[#E8CEBC] bg-[#FAF1E8] text-[#1D4533] focus:ring-[#1D4533] accent-[#1D4533] cursor-pointer"
                            />
                            <label
                                htmlFor="remember_page"
                                className="cursor-pointer text-[12px] font-medium text-[#5E3122]/80 select-none"
                            >
                                Tetap masuk di perangkat ini
                            </label>
                        </div>

                        {/* Tombol Submit */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#1D4533] py-3 text-[13px] font-bold text-[#F7EAE0] transition hover:bg-[#143325] disabled:opacity-70 cursor-pointer shadow-xs"
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
                                    <span>Masuk</span>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center lg:hidden">
                        <Link
                            href="/home"
                            className="text-xs font-bold text-[#8C5E43] hover:underline"
                        >
                            ← Kembali ke Beranda
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
