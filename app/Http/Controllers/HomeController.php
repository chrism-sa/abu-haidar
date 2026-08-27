<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\Category;
use App\Models\Quote;
use App\Models\Ebook;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        // 1. Artikel Utama (Hero):
        // Ambil yang eksplisit diset is_hero = true. Jika belum ada, ambil artikel terbitan paling baru.
        $heroArticle = Article::with('category')
            ->where('is_published', true)
            ->where('is_hero', true)
            ->first();

        if (!$heroArticle) {
            $heroArticle = Article::with('category')
                ->where('is_published', true)
                ->latest()
                ->first();
        }

        // 2. Pilihan Redaksi:
        // Wajib menampilkan PERSIS 3 artikel yang diset is_featured = true tanpa terpotong
        $selectedArticles = Article::with('category')
            ->where('is_published', true)
            ->where('is_featured', true)
            ->latest()
            ->take(5)
            ->get();

        // 3. Terbitan Terbaru:
        // Ambil 2 artikel terbaru terbitan terakhir berdasarkan tanggal dibuat (latest).
        // Hanya kecualikan ID hero agar layout atas tidak menduplikasi kartu persis di sampingnya.
        $heroId = $heroArticle ? $heroArticle->id : null;

        $latestArticles = Article::with('category')
            ->where('is_published', true)
            ->when($heroId, function ($q) use ($heroId) {
                $q->where('id', '!=', $heroId);
            })
            ->latest()
            ->take(2)
            ->get();

        // Data kategori & jumlah artikel
        $categories = Category::withCount(['articles' => function ($query) {
            $query->where('is_published', true);
        }])->orderByRaw('FIELD(id, 2, 3, 1, 4, 5, 6, 7, 8, 9)')->get();

        // Kutipan mutiara acak
        $quote = Quote::with('article')->inRandomOrder()->first();

        // 3 E-Book terbaru untuk Sidebar
        $ebooks = Ebook::where('is_published', true)
            ->latest()
            ->take(3)
            ->get(['id', 'title', 'slug', 'file_size', 'author', 'file_path']);

        return Inertia::render('Home', [
            'heroArticle' => $heroArticle,
            'latestArticles' => $latestArticles,
            'selectedArticles' => $selectedArticles,
            'categories' => $categories,
            'quote' => $quote,
            'ebooks' => $ebooks,
        ]);
    }
}
