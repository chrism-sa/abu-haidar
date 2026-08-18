export type Category = {
    id: number;
    name: string;
    slug: string;
    articles_count?: number; 
};

export type Article = {
    id: number;
    category_id: number;
    category: Category;
    title: string;
    slug: string;
    image: string;
    description: string;
    content: string;
    is_published: boolean;
    created_at: string;
    updated_at: string;
};

export type Quote = {
    id?: number;
    arabic: string;
    translation: string;
    reference: string;
    article_id?: number;
    article?: Article; 
};