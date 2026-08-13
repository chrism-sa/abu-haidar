<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\Category;
use App\Models\Quote; // <-- Ubah dari Setting ke Quote
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        // 1. Ambil Ayat Pilihan secara Random dari tabel quotes
        $quote = Quote::with('article')->inRandomOrder()->first();

        // 2. Query Artikel & Kategori
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
            'quote' => $quote, // Data dikirim secara seragam
        ]);
    }
}