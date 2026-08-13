import { Head, Link } from '@inertiajs/react';
import { LayoutDashboard, LogOut, Settings, FileText, Home } from 'lucide-react';

interface DashboardProps {
    auth: {
        user: {
            name: string;
            email: string;
        }
    }
}

export default function Dashboard({ auth }: DashboardProps) {
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
                            <h1 className="font-serif text-[16px] font-bold">Dashboard Admin</h1>
                            <p className="text-[10px] text-[#777]">Kelola Konten Website Abu Haidar</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link 
                            href="/logout" 
                            method="post" 
                            as="button"
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
                        Selamat datang di panel pengatur utama. Dari sini Anda dapat mengontrol artikel, kategori, serta teks ayat pilihan yang tampil di halaman utama website Abu Haidar secara *real-time*.
                    </p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="rounded-xl border border-[#e9e6df] bg-white p-6 shadow-sm transition hover:shadow-md">
                        <div className="mb-4 inline-flex rounded-lg bg-[#f3f1eb] p-3 text-[#063f2f]">
                            <FileText size={20} />
                        </div>
                        <h3 className="font-serif text-[16px] font-bold text-[#17251f]">Kelola Artikel</h3>
                        <p className="mt-1 text-[12px] text-[#666]">
                            Tambah, edit, atau hapus artikel dakwah dan atur status publikasinya.
                        </p>
                        <span className="mt-5 inline-block text-[11px] font-bold text-[#063f2f] cursor-not-allowed opacity-60">
                            Segera Hadir →
                        </span>
                    </div>

                    <div className="rounded-xl border border-[#e9e6df] bg-white p-6 shadow-sm transition hover:shadow-md">
                        <div className="mb-4 inline-flex rounded-lg bg-[#f3f1eb] p-3 text-[#063f2f]">
                            <Settings size={20} />
                        </div>
                        <h3 className="font-serif text-[16px] font-bold text-[#17251f]">Pengaturan Website</h3>
                        <p className="mt-1 text-[12px] text-[#666]">
                            Ubah teks Ayat Pilihan, terjemahan, dan referensi surat di sidebar.
                        </p>
                        <span className="mt-5 inline-block text-[11px] font-bold text-[#063f2f] cursor-not-allowed opacity-60">
                            Segera Hadir →
                        </span>
                    </div>

                    <div className="rounded-xl border border-[#e9e6df] bg-white p-6 shadow-sm transition hover:shadow-md">
                        <div className="mb-4 inline-flex rounded-lg bg-[#f3f1eb] p-3 text-[#063f2f]">
                            <LayoutDashboard size={20} />
                        </div>
                        <h3 className="font-serif text-[16px] font-bold text-[#17251f]">Status Sistem</h3>
                        <p className="mt-1 text-[12px] text-[#666]">
                            Database terhubung dengan aman dan sistem CMS berjalan normal.
                        </p>
                        <span className="mt-5 inline-block text-[11px] font-bold text-emerald-600">
                            ● Online
                        </span>
                    </div>
                </div>
            </main>
        </div>
    );
}