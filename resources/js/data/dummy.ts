import { Article } from '../types';

export const heroArticle = {
    category: 'ARTIKEL TERBARU',
    title: 'Ikhlas, Kunci Diterimanya Amal di Sisi Allah',
    description: 'Allah tidak melihat bentuk amalmu, tetapi melihat keikhlasan hati di baliknya. Ketika niat hanya untuk-Nya, amal sekecil apa pun menjadi besar nilainya.',
    image: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=1400&q=90',
};

export const latestArticles: Article[] = [
    {
        category: 'AKIDAH',
        title: 'Tawakal yang Sebenarnya kepada Allah',
        date: '8 Mei 2026',
        readTime: '6 min read',
        image: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=900&q=85',
        description: 'Tawakal bukan berarti pasrah tanpa usaha, tetapi menyerahkan hasil kepada Allah setelah melakukan ikhtiar.',
    },
    {
        category: "TAFSIR AL-QUR'AN",
        title: 'Tadabbur Surah Al-Ikhlas',
        date: '6 Mei 2026',
        readTime: '7 min read',
        image: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=900&q=85',
        description: 'Surah Al-Ikhlas adalah surah yang penuh dengan makna tentang tauhid dan keesaan Allah.',
    },
    {
        category: 'IBADAH',
        title: 'Keutamaan Shalat Tahajud',
        date: '4 Mei 2026',
        readTime: '5 min read',
        image: 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&w=900&q=85',
        description: 'Shalat tahajud menjadi salah satu ibadah malam yang memiliki banyak keutamaan.',
    },
    {
        category: 'ILMU',
        title: 'Menuntut Ilmu, Jalan Menuju Surga',
        date: '2 Mei 2026',
        readTime: '6 min read',
        image: 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=900&q=85',
        description: 'Menuntut ilmu adalah jalan mulia yang mengantarkan seorang muslim kepada kebaikan.',
    },
];

export const selectedArticles: Article[] = [
    {
        category: "TAFSIR AL-QUR'AN",
        title: 'Makna Surah Al-Fatihah dan Ayat Demi Ayat',
        date: '1 Mei 2026',
        readTime: '8 min read',
        image: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=500&q=80',
        description: 'Memahami makna mendalam dari setiap ayat dalam Surah Al-Fatihah.',
    },
    {
        category: 'AKIDAH',
        title: 'Sifat Allah yang Wajib Diketahui',
        date: '29 Apr 2026',
        readTime: '6 min read',
        image: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=500&q=80',
        description: 'Mengenal sifat-sifat Allah dengan landasan Al-Qur’an dan sunnah.',
    },
    {
        category: 'SIRAH',
        title: 'Perjalanan Nabi Muhammad di Makkah',
        date: '27 Apr 2026',
        readTime: '7 min read',
        image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?auto=format&fit=crop&w=500&q=80',
        description: 'Menyelami perjalanan dakwah Rasulullah ﷺ pada periode Makkah.',
    },
    {
        category: 'FIQIH',
        title: 'Hukum dan Adab Berdoa dalam Islam',
        date: '25 Apr 2026',
        readTime: '5 min read',
        image: 'https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&w=500&q=80',
        description: 'Adab berdoa serta waktu-waktu mustajab agar doa lebih mudah dikabulkan.',
    },
];

export const categories = [
    { name: "Tafsir Al-Qur'an", count: 18 },
    { name: 'Hadis', count: 16 },
    { name: 'Akidah', count: 14 },
    { name: 'Fiqih', count: 13 },
    { name: 'Ibadah', count: 20 },
    { name: 'Sirah Nabi', count: 12 },
    { name: 'Keluarga Muslim', count: 10 },
    { name: 'Motivasi Islam', count: 15 },
];