import { useState } from 'react';
import { Eye, EyeOff, X } from 'lucide-react';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);

    if (!isOpen) return null;

    const handleClose = (): void => {
        setPassword('');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity">
            <div className="absolute inset-0" onClick={handleClose}></div>

            <div className="relative z-10 w-full max-w-[400px] overflow-hidden rounded-2xl bg-white shadow-2xl">
                <button 
                    type="button"
                    onClick={handleClose}
                    className="absolute right-4 top-4 text-[#999] transition hover:text-[#333]"
                >
                    <X size={20} />
                </button>

                <div className="p-8 sm:p-10">
                    <div className="mb-8 text-center">
                        <img src="/LOGO.png" alt="Logo" className="mx-auto mb-4 h-12" />
                        <h2 className="font-serif text-[22px] font-bold text-[#17251f]">
                            Login Admin
                        </h2>
                    </div>

                    {/* Menggunakan method POST standar HTML agar Laravel menangani redirect penuh dengan aman */}
                    <form action="/login" method="POST" className="space-y-5">
                        {/* Token CSRF Wajib untuk form native POST di Laravel */}
                        <input type="hidden" name="_token" value={(document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || ''} />

                        <div>
                            <label className="mb-2 block text-[11px] font-bold text-[#333]">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@abuhurairah.com"
                                className="w-full rounded-lg border border-[#dedbd2] bg-[#fafaf8] px-4 py-3 text-[13px] outline-none transition focus:border-[#0b6045]"
                                required
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-[11px] font-bold text-[#333]">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
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

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="remember"
                                name="remember"
                                checked={remember}
                                onChange={(e) => setRemember(e.target.checked)}
                                className="h-4 w-4 rounded border-[#dedbd2] text-[#063f2f] focus:ring-[#063f2f]"
                            />
                            <label htmlFor="remember" className="text-[11px] text-[#555]">
                                Ingat saya
                            </label>
                        </div>

                        <button
                            type="submit"
                            className="mt-2 w-full rounded-lg bg-[#17251f] py-3 text-[13px] font-bold text-white transition hover:bg-[#063f2f]"
                        >
                            Masuk
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}