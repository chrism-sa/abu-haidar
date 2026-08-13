<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Quote;


class ArticleController extends Controller
{
    public function show($slug)
    {
        // 1. Cari artikel berdasarkan URL (slug) yang diklik
        $article = Article::with('category')->where('slug', $slug)->firstOrFail();
        $quote = Quote::with('article')->inRandomOrder()->first();
        // 2. Ambil 3 artikel terkait (dari kategori yang sama, selain artikel yang sedang dibaca)
        $relatedArticles = Article::with('category')
            ->where('category_id', $article->category_id)
            ->where('id', '!=', $article->id)
            ->where('is_published', true)
            ->latest()
            ->take(3)
            ->get();

        // 3. Ambil 5 artikel populer (Sementara menggunakan random)
        $popularArticles = Article::where('is_published', true)
            ->inRandomOrder()
            ->take(5)
            ->get();

        // 4. Ambil Kategori untuk Sidebar
        $categories = Category::withCount(['articles' => function ($query) {
            $query->where('is_published', true);
        }])->get();

        
        // 5. Kirim semua data ke file React: Pages/Article/Show.tsx
        return Inertia::render('Article/Show', [
            'article' => $article,
            'relatedArticles' => $relatedArticles,
            'popularArticles' => $popularArticles,
            'categories' => $categories,
            'quote' => $quote,
        ]);
    }
}
