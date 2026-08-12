<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\Category;
use App\Models\Setting; // <-- Tambahkan import Setting
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        // 1. Ambil Pengaturan (Settings)
        $settings = Setting::pluck('value', 'key'); // Mengubah data tabel menjadi array praktis

        // Format data quote agar sesuai dengan props di React
        $quote = [
            'arabic' => $settings['quote_arabic'] ?? '',
            'translation' => $settings['quote_translation'] ?? '',
            'reference' => $settings['quote_reference'] ?? '',
            'tafsir_link' => $settings['quote_link'] ?? '#',
        ];

        // 2. Query Artikel & Kategori (Masih sama seperti sebelumnya)
        $heroArticle = Article::with('category')->where('is_published', true)->latest()->first();
        
        $latestArticles = Article::with('category')
            ->where('is_published', true)
            ->where('id', '!=', $heroArticle?->id)
            ->latest()
            ->take(4)
            ->get();

        $selectedArticles = Article::with('category')->where('is_published', true)->inRandomOrder()->take(4)->get();

        $categories = Category::withCount(['articles' => function ($query) {
            $query->where('is_published', true);
        }])->get();

        // 3. Kirim ke React
        return Inertia::render('Home', [
            'heroArticle' => $heroArticle,
            'latestArticles' => $latestArticles,
            'selectedArticles' => $selectedArticles,
            'categories' => $categories,
            'quote' => $quote, // Data ini sekarang berasal dari database!
        ]);
    }
}