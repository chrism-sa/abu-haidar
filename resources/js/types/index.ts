export type Category = {
    id: number;
    name: string;
    slug: string;
    articles_count?: number; // Hasil dari withCount() di controller
};

export type Article = {
    id: number;
    category_id: number;
    category: Category; // Relasi tabel
    title: string;
    slug: string;
    image: string;
    description: string;
    content: string;
    read_time: number;
    is_published: boolean;
    created_at: string;
};

// Tambahkan di bawah tipe Article dan Category
export type Quote = {
    id?: number;
    arabic: string;
    translation: string;
    reference: string;
    tafsir_link?: string;
};