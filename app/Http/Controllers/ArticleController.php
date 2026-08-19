<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\Category;
use App\Models\Quote;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ArticleController extends Controller
{
    /**
     * Membersihkan non-breaking spaces dan karakter spasi tersembunyi
     * dari input teks editor rich-text.
     */
    private function cleanHtmlContent(?string $content): ?string
    {
        if (!$content) {
            return $content;
        }

        // Ganti entitas &nbsp;, variasi hex/desimal, dan karakter unicode \u00a0 menjadi spasi biasa
        $cleaned = str_replace(
            ['&nbsp;', '&#160;', '&#xA0;', "\xc2\xa0", "\u{00A0}"],
            ' ',
            $content
        );

        return $cleaned;
    }

    public function show($slug)
    {
        // 1. Cari artikel yang terbit beserta relasi category & quotes
        $article = Article::with(['category', 'quotes'])
            ->where('slug', $slug)
            ->where('is_published', true)
            ->firstOrFail();

        // Ambil kutipan acak untuk sidebar
        $quote = Quote::with('article')->inRandomOrder()->first();

        // 2. Ambil 3 artikel terkait (dari kategori yang sama & sudah terbit)
        $relatedArticles = Article::with('category')
            ->where('category_id', $article->category_id)
            ->where('id', '!=', $article->id)
            ->where('is_published', true)
            ->latest()
            ->take(3)
            ->get();

        // 3. Ambil 5 artikel populer yang sudah terbit
        $popularArticles = Article::where('is_published', true)
            ->inRandomOrder()
            ->take(5)
            ->get();

        // 4. Ambil Kategori untuk Sidebar (hanya hitung artikel terbit)
        $categories = Category::withCount(['articles' => function ($query) {
            $query->where('is_published', true);
        }])->orderByRaw('FIELD(id, 2, 3, 1, 4, 5, 6, 7, 8, 9)')->get();

        // 5. Kirim semua data ke Pages/Article/Show.tsx
        return Inertia::render('Article/Show', [
            'article' => $article,
            'relatedArticles' => $relatedArticles,
            'popularArticles' => $popularArticles,
            'categories' => $categories,
            'quote' => $quote,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'description' => 'nullable|string',
            'content' => 'required|string',
            'image_file' => 'nullable|image|max:2048',
            'image_url' => 'nullable|url',
            'quote_arabic' => 'nullable|string',
            'quote_translation' => 'nullable|string',
            'quote_reference' => 'nullable|string',
        ]);

        // Handle Gambar (File Upload lokal atau Tautan Link Eksternal)
        $imagePath = null;
        if ($request->hasFile('image_file')) {
            $imagePath = '/storage/' . $request->file('image_file')->store('articles', 'public');
        } elseif ($request->filled('image_url')) {
            $imagePath = $request->image_url;
        }

        // Bersihkan konten dan deskripsi dari karakter &nbsp;
        $cleanContent = $this->cleanHtmlContent($request->content);
        $cleanDescription = $this->cleanHtmlContent($request->description);

        // Simpan Data Artikel
        $article = Article::create([
            'category_id' => $request->category_id,
            'title' => $request->title,
            'slug' => Str::slug($request->title) . '-' . time(),
            'image' => $imagePath,
            'description' => $cleanDescription,
            'content' => $cleanContent,
            'is_published' => true,
        ]);

        // Simpan ke tabel quotes jika teks Arab kutipan diisi
        if ($request->filled('quote_arabic')) {
            Quote::create([
                'article_id' => $article->id,
                'arabic' => $request->quote_arabic,
                'translation' => $request->quote_translation,
                'reference' => $request->quote_reference,
            ]);
        }

        return redirect()->route('admin.articles.index')->with('success', 'Artikel berhasil disimpan.');
    }
}
