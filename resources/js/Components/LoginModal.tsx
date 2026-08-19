import { useState, useEffect } from 'react';
import { Eye, EyeOff, X, Mail, Lock, Loader2 } from 'lucide-react';
import { useForm } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    // Kosongkan password dan error jika modal tertutup
    useEffect(() => {
        if (!isOpen) {
            reset('password');
            clearErrors();
            setShowPassword(false);
        }
    }, [isOpen]);

    const handleClose = (): void => {
        if (!processing) {
            reset('password');
            clearErrors();
            onClose();
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/login', {
            preserveScroll: true,
            onSuccess: () => {
                handleClose();
                toast.success('Ahlan wa Sahlan! Anda berhasil masuk.', {
                    icon: '✨',
                    style: { borderRadius: '10px', background: '#333', color: '#fff' }
                });
            },
            onError: () => {
                toast.error('Kredensial tidak valid. Silakan periksa kembali!', {
                    style: { borderRadius: '10px', background: '#fee2e2', color: '#b91c1c' }
                });
                reset('password');
            }
        });
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0">
                    {/* BACKDROP BLUR ANIMATION */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0 bg-black/50 backdrop-blur-md"
                        onClick={handleClose}
                    />

                    {/* MODAL CONTAINER ANIMATION */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ type: "spring", bounce: 0.3, duration: 0.5 }}
                        className="relative z-10 w-full max-w-[420px] overflow-hidden rounded-[24px] bg-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] ring-1 ring-black/5"
                    >
                        {/* Tombol Close */}
                        <button 
                            type="button"
                            onClick={handleClose}
                            disabled={processing}
                            className="absolute right-5 top-5 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-[#f4f4f0] text-[#777] transition hover:bg-[#e9e6df] hover:text-[#111] disabled:opacity-50"
                        >
                            <X size={16} strokeWidth={2.5} />
                        </button>

                        {/* Efek Gradasi Latar Belakang (Aksen Atas) */}
                        <div className="absolute left-0 right-0 top-0 h-32 bg-gradient-to-b from-[#063f2f]/5 to-transparent"></div>

                        <div className="relative p-8 sm:p-10">
                            {/* LOGO & TITLE */}
                            <div className="mb-8 text-center">
                                <motion.div 
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.1, duration: 0.4 }}
                                    className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-[#e9e6df] mb-5"
                                >
                                    <img src="/LOGO.png" alt="Logo" className="h-10 object-contain drop-shadow-sm" />
                                </motion.div>
                                <h2 className="font-serif text-[24px] font-bold text-[#111]">
                                    Selamat Datang
                                </h2>
                                <p className="mt-1.5 text-[13px] text-[#666]">
                                    Silakan masuk untuk mengakses panel admin.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                
                                {/* INPUT EMAIL DENGAN IKON */}
                                <div>
                                    <label className="mb-1.5 block text-[12px] font-bold text-[#444]">
                                        Alamat Email
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#999] transition group-focus-within:text-[#063f2f]">
                                            <Mail size={18} />
                                        </div>
                                        <input
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            placeholder="a@b.com"
                                            className={`w-full rounded-xl border bg-[#fafaf8] py-3 pl-11 pr-4 text-[14px] font-medium text-[#111] outline-none transition-all focus:bg-white focus:ring-4 ${
                                                errors.email 
                                                ? 'border-red-400 focus:border-red-400 focus:ring-red-100' 
                                                : 'border-[#e9e6df] focus:border-[#063f2f] focus:ring-[#063f2f]/10'
                                            }`}
                                            required
                                        />
                                    </div>
                                    {errors.email && (
                                        <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="mt-1.5 text-[11px] font-bold text-red-500">
                                            * {errors.email}
                                        </motion.p>
                                    )}
                                </div>

                                {/* INPUT PASSWORD DENGAN IKON & TOGGLE MATA */}
                                <div>
                                    <label className="mb-1.5 block text-[12px] font-bold text-[#444]">
                                        Kata Sandi
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#999] transition group-focus-within:text-[#063f2f]">
                                            <Lock size={18} />
                                        </div>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            placeholder="••••••••"
                                            className={`w-full rounded-xl border bg-[#fafaf8] py-3 pl-11 pr-12 text-[14px] font-medium text-[#111] outline-none transition-all focus:bg-white focus:ring-4 ${
                                                errors.password 
                                                ? 'border-red-400 focus:border-red-400 focus:ring-red-100' 
                                                : 'border-[#e9e6df] focus:border-[#063f2f] focus:ring-[#063f2f]/10'
                                            }`}
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-[#999] transition hover:bg-[#e9e6df] hover:text-[#111]"
                                        >
                                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                    {errors.password && (
                                        <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="mt-1.5 text-[11px] font-bold text-red-500">
                                            * {errors.password}
                                        </motion.p>
                                    )}
                                </div>

                                {/* CHECKBOX REMEMBER ME */}
                                <div className="flex items-center gap-2 pt-1">
                                    <label className="relative flex cursor-pointer items-center rounded-full p-1">
                                        <input
                                            type="checkbox"
                                            checked={data.remember}
                                            onChange={(e) => setData('remember', e.target.checked)}
                                            className="peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-[#c1bdaf] bg-[#fafaf8] transition-all checked:border-[#063f2f] checked:bg-[#063f2f] hover:scale-105"
                                        />
                                        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 transition-opacity peer-checked:opacity-100">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" strokeWidth="1">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                            </svg>
                                        </div>
                                    </label>
                                    <span className="cursor-pointer text-[13px] font-medium text-[#555]" onClick={() => setData('remember', !data.remember)}>
                                        Ingat sesi saya
                                    </span>
                                </div>

                                {/* TOMBOL SUBMIT MODERN DENGAN LOADING SPINNER */}
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="relative mt-4 flex w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-[#063f2f] to-[#0a5c45] py-3.5 text-[14px] font-bold text-white shadow-lg shadow-[#063f2f]/30 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-[#063f2f]/40 disabled:scale-100 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {processing ? (
                                        <motion.div 
                                            initial={{ opacity: 0 }} 
                                            animate={{ opacity: 1 }} 
                                            className="flex items-center gap-2"
                                        >
                                            <Loader2 size={18} className="animate-spin" />
                                            <span>Memverifikasi...</span>
                                        </motion.div>
                                    ) : (
                                        <span>Masuk ke Dashboard</span>
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