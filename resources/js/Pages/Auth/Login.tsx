import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Eye, EyeOff } from 'lucide-react';

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    
    // Inertia form helper untuk menangani request login
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/login');
    };

    return (
        <div className="flex min-h-screen bg-[#fafaf8]">
            <Head title="Login Admin - Abu Haidar" />

            {/* KIRI: Sisi Branding (Hanya muncul di desktop) */}
            <div className="hidden w-full max-w-[500px] flex-col items-center justify-center bg-[#063f2f] p-12 text-center text-white lg:flex relative overflow-hidden">
                <div className="relative z-10 flex flex-col items-center">
                    <img src="/LOGO2.png" alt="Abu Haidar" className="mb-6 h-20 brightness-0 invert" />
                    <h1 className="font-serif text-[24px] font-bold">Abu Haidar</h1>
                    <p className="mt-2 text-[12px] text-white/80">Artikel Islam & Dakwah</p>
                    <p className="mt-8 max-w-xs text-[13px] leading-relaxed text-white/70">
                        Kelola artikel dan konten dakwah dengan mudah dan aman.
                    </p>
                </div>
                {/* Ornamen Masjid di Bawah (Opsional jika ada gambarnya) */}
                <div className="absolute bottom-0 w-full opacity-20">
                    {/* <img src="/masjid-silhouette.png" className="w-full" /> */}
                </div>
            </div>

            {/* KANAN: Form Login */}
            <div className="flex w-full flex-1 flex-col items-center justify-center p-6 sm:p-12">
                <div className="w-full max-w-[380px] rounded-2xl bg-white p-8 sm:p-10 shadow-sm border border-[#e9e6df]">
                    
                    {/* Header Form Mobile */}
                    <div className="mb-8 text-center lg:hidden">
                        <img src="/LOGO2.png" alt="Logo" className="mx-auto mb-4 h-12" />
                        <h1 className="font-serif text-[20px] font-bold text-[#17251f]">Login Admin</h1>
                    </div>

                    <h2 className="mb-8 hidden text-center font-serif text-[24px] font-bold text-[#17251f] lg:block">
                        Login Admin
                    </h2>

                    <form onSubmit={submit} className="space-y-5">
                        {/* Email */}
                        <div>
                            <label className="mb-2 block text-[11px] font-bold text-[#333]">Email</label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="Masukkan email"
                                className="w-full rounded-lg border border-[#dedbd2] bg-[#fafaf8] px-4 py-3 text-[13px] outline-none transition focus:border-[#0b6045]"
                                required
                            />
                            {errors.email && <p className="mt-1 text-[10px] text-red-500">{errors.email}</p>}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="mb-2 block text-[11px] font-bold text-[#333]">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Masukkan password"
                                    className="w-full rounded-lg border border-[#dedbd2] bg-[#fafaf8] py-3 pl-4 pr-11 text-[13px] outline-none transition focus:border-[#0b6045]"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#999] hover:text-[#333]"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {/* Ingat Saya */}
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="remember"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                                className="h-4 w-4 rounded border-[#dedbd2] text-[#063f2f] focus:ring-[#063f2f]"
                            />
                            <label htmlFor="remember" className="text-[11px] text-[#555]">
                                Ingat saya
                            </label>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="mt-2 w-full rounded-lg bg-[#17251f] py-3 text-[12px] font-bold text-white transition hover:bg-[#063f2f] disabled:opacity-70"
                        >
                            {processing ? 'Memproses...' : 'Masuk'}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-[10px] text-[#999]">
                        © 2026 Abu Haidar. All rights reserved.
                    </div>
                </div>
            </div>
        </div>
    );
}