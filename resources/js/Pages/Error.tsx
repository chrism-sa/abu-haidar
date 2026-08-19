import { Head, Link } from '@inertiajs/react';
import { AlertCircle, Home } from 'lucide-react';

interface ErrorProps {
    status: number;
}

export default function ErrorPage({ status }: ErrorProps) {
    // Kumpulan Judul Error
    const title: Record<number, string> = {
        503: 'Layanan Tidak Tersedia',
        500: 'Terjadi Kesalahan Server',
        404: 'Halaman Tidak Ditemukan',
        403: 'Akses Ditolak',
        419: 'Sesi Kedaluwarsa',
    };

    // Kumpulan Deskripsi Custom
    const description: Record<number, string> = {
        503: 'Mohon maaf, server sedang dalam masa pemeliharaan rutin. Silakan coba beberapa saat lagi.',
        500: 'Mohon maaf, terjadi kesalahan pada server internal kami. Tim teknis sedang memperbaikinya.',
        404: 'Mohon maaf, halaman artikel atau tautan yang Anda cari tidak dapat ditemukan. Mungkin telah dihapus atau dipindahkan.',
        403: 'Mohon maaf, Anda tidak memiliki izin atau akses untuk masuk ke halaman ini.',
        419: 'Sesi halaman Anda telah berakhir karena terlalu lama tidak ada aktivitas. Silakan kembali ke beranda dan coba lagi.',
    };

    // Fallback jika error tidak ada di list
    const currentTitle = title[status] || 'Terjadi Kesalahan';
    const currentDesc = description[status] || 'Mohon maaf, telah terjadi kesalahan yang tidak terduga pada sistem.';

    return (
        <div className="min-h-screen bg-[#fafaf8] flex flex-col items-center justify-center p-6 text-[#17251f]">
            <Head title={`${status} - ${currentTitle}`} />
            
            <div className="max-w-lg w-full text-center space-y-6 bg-white p-10 md:p-14 rounded-3xl shadow-sm border border-[#e5e2da]">
                <div className="flex justify-center mb-6">
                    <div className="flex items-center justify-center w-24 h-24 bg-red-50 text-red-500 rounded-full">
                        <AlertCircle size={48} />
                    </div>
                </div>
                
                <h1 className="text-6xl md:text-8xl font-serif font-bold text-[#063f2f]">
                    {status}
                </h1>
                
                <div>
                    <h2 className="text-xl md:text-2xl font-bold mb-2">
                        {currentTitle}
                    </h2>
                    <p className="text-[#555] leading-relaxed text-sm md:text-base">
                        {currentDesc}
                    </p>
                </div>

                <div className="pt-4">
                    <Link
                        href="/home"
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#063f2f] px-6 py-3.5 text-[14px] font-bold text-white transition hover:bg-[#07513c] shadow-sm w-full md:w-auto"
                    >
                        <Home size={18} /> Kembali ke Beranda
                    </Link>
                </div>
            </div>
        </div>
    );
}