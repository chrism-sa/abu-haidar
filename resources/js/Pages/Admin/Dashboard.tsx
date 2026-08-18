import { Head, Link } from "@inertiajs/react";
import {
    LayoutDashboard,
    LogOut,
    Tags,
    FileText,
    Home,
    AlertTriangle // Tambahan ikon jika terjadi error
} from "lucide-react";

interface DashboardProps {
    auth: {
        user: {
            name: string;
            email: string;
        };
    };
    db_status: boolean; // Menangkap status DB dari Laravel
}

export default function Dashboard({ auth, db_status }: DashboardProps) {
    return (
        <div className="min-h-screen bg-[#fafaf8] text-[#17251f]">
            <Head title="Dashboard Admin - Abu Haidar" />

            <header className="border-b border-[#e9e6df] bg-white">
                <div className="mx-auto flex max-w-[1140px] items-center justify-between px-5 py-4 lg:px-0">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl text-white font-serif font-bold">
                            <img
                                src="/LOGO.png"
                                alt="Abu Haidar"
                                className="h-9 w-auto"
                            />
                        </div>
                        <div>
                            <h1 className="font-serif text-[16px] font-bold">
                                Dashboard Admin
                            </h1>
                            <p className="text-[10px] text-[#777]">
                                Kelola Konten Website Abu Haidar
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href="/home"
                            className="flex items-center gap-1.5 rounded-lg border border-[#e8e4da] bg-white px-3 py-2 text-[12px] font-medium text-[#17251f] transition hover:bg-[#faf7f0]"
                        >
                            <Home size={14} /> Lihat Web
                        </Link>

                        <Link
                            href="/logout"
                            method="post"
                            as="button"
                            onSuccess={() => {
                                window.location.href = "/home";
                            }}
                            className="flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-[12px] font-medium text-red-600 transition hover:bg-red-100"
                        >
                            <LogOut size={14} /> Keluar
                        </Link>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-[1140px] px-5 py-10 lg:px-0">
                <div className="mb-8 rounded-2xl bg-[#063f2f] p-8 text-white shadow-sm">
                    <h2 className="font-serif text-[24px] font-bold">
                        Ahlan wa Sahlan, {auth.user.name}!
                    </h2>
                    <p className="mt-2 text-[13px] text-white/80 max-w-xl leading-relaxed">
                        Selamat datang di panel pengatur utama. Dari sini Anda
                        dapat mengontrol artikel, kategori, serta teks ayat
                        pilihan yang tampil di halaman utama website Abu Haidar
                        secara *real-time*.
                    </p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    
                    {/* 1. KARTU KELOLA ARTIKEL */}
                    <Link
                        href="/admin/articles" 
                        className="group rounded-xl border border-[#e9e6df] bg-white p-6 shadow-sm transition hover:shadow-md hover:border-[#063f2f]"
                    >
                        <div className="mb-4 inline-flex rounded-lg bg-[#f3f1eb] p-3 text-[#063f2f] transition group-hover:bg-[#063f2f] group-hover:text-white">
                            <FileText size={20} />
                        </div>
                        <h3 className="font-serif text-[16px] font-bold text-[#17251f]">
                            Kelola Artikel
                        </h3>
                        <p className="mt-1 text-[12px] text-[#666]">
                            Tambah, edit, atau hapus artikel dakwah dan atur
                            status publikasinya.
                        </p>
                        <span className="mt-5 inline-block text-[11px] font-bold text-[#063f2f] group-hover:underline">
                            Buka Menu →
                        </span>
                    </Link>

                    {/* 2. KARTU KELOLA KATEGORI */}
                    <Link
                        href="/admin/categories" 
                        className="group rounded-xl border border-[#e9e6df] bg-white p-6 shadow-sm transition hover:shadow-md hover:border-[#063f2f]"
                    >
                        <div className="mb-4 inline-flex rounded-lg bg-[#f3f1eb] p-3 text-[#063f2f] transition group-hover:bg-[#063f2f] group-hover:text-white">
                            <Tags size={20} />
                        </div>
                        <h3 className="font-serif text-[16px] font-bold text-[#17251f]">
                            Kelola Kategori
                        </h3>
                        <p className="mt-1 text-[12px] text-[#666]">
                            Tambah, edit, atau hapus kategori untuk mengelompokkan
                            artikel kajian.
                        </p>
                        <span className="mt-5 inline-block text-[11px] font-bold text-[#063f2f] group-hover:underline">
                            Buka Menu →
                        </span>
                    </Link>

                    {/* 3. KARTU STATUS SISTEM (Dinami - Cek DB) */}
                    <div className={`rounded-xl border bg-white p-6 shadow-sm transition ${db_status ? 'border-[#e9e6df]' : 'border-red-200'}`}>
                        <div className={`mb-4 inline-flex rounded-lg p-3 ${db_status ? 'bg-[#f3f1eb] text-[#063f2f]' : 'bg-red-50 text-red-600'}`}>
                            {db_status ? <LayoutDashboard size={20} /> : <AlertTriangle size={20} />}
                        </div>
                        <h3 className="font-serif text-[16px] font-bold text-[#17251f]">
                            Status Sistem
                        </h3>
                        <p className="mt-1 text-[12px] text-[#666]">
                            {db_status 
                                ? "Database terhubung dengan aman dan sistem CMS berjalan normal." 
                                : "Peringatan: Gagal terhubung ke database. Segera periksa konfigurasi server Anda!"}
                        </p>
                        <span className={`mt-5 inline-block text-[11px] font-bold ${db_status ? 'text-emerald-600' : 'text-red-600 animate-pulse'}`}>
                            {db_status ? "● Online & Terhubung" : "● Database Terputus (Error)"}
                        </span>
                    </div>

                </div>
            </main>
        </div>
    );
}