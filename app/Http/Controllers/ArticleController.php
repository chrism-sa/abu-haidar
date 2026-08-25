<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\Category;
use App\Models\Quote;
use App\Models\Ebook;
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

        return str_replace(
            ['&nbsp;', '&#160;', '&#xA0;', "\xc2\xa0", "\u{00A0}"],
            ' ',
            $content
        );
    }

    public function show($slug)
    {
        $article = Article::with(['category', 'quotes'])
            ->where('slug', $slug)
            ->where('is_published', true)
            ->firstOrFail();

        $quote = Quote::with('article')->inRandomOrder()->first();

        $relatedArticles = Article::with('category')
            ->where('category_id', $article->category_id)
            ->where('id', '!=', $article->id)
            ->where('is_published', true)
            ->latest()
            ->take(3)
            ->get();

        $popularArticles = Article::where('is_published', true)
            ->inRandomOrder()
            ->take(5)
            ->get();

        $categories = Category::withCount(['articles' => function ($query) {
            $query->where('is_published', true);
        }])->orderByRaw('FIELD(id, 2, 3, 1, 4, 5, 6, 7, 8, 9)')->get();

        // Mengambil data ebook terbit untuk sidebar
        $ebooks = Ebook::where('is_published', true)->latest()->take(3)->get();

        return Inertia::render('Article/Show', [
            'article'         => $article,
            'relatedArticles' => $relatedArticles,
            'popularArticles' => $popularArticles,
            'categories'      => $categories,
            'ebooks'          => $ebooks,
            'quote'           => $quote,
        ]);
    }

    public function create()
    {
        $categories = Category::all();
        return Inertia::render('Article/Create', [
            'categories' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title'             => 'required|string|max:255',
            'category_id'       => 'required|exists:categories,id',
            'description'       => 'nullable|string',
            'content'           => 'required|string',
            'image_file'        => 'nullable|image|max:2048',
            'image_url'         => 'nullable|url',
            'quote_type'        => 'nullable|string|in:text,image,youtube',
            'quote_arabic'      => 'nullable|string',
            'quote_translation' => 'nullable|string',
            'quote_reference'   => 'nullable|string',
            'quote_font'        => 'nullable|string',
            'quote_font_size'   => 'nullable|numeric',
            'quote_color'       => 'nullable|string',
            'quote_image'       => 'nullable|image|max:2048',
            'quote_youtube_url' => 'nullable|url',
        ]);

        // Handle Gambar Sampul Utama
        $imagePath = null;
        if ($request->hasFile('image_file')) {
            $imagePath = '/storage/' . $request->file('image_file')->store('articles', 'public');
        } elseif ($request->filled('image_url')) {
            $imagePath = $request->image_url;
        }

        $cleanContent = $this->cleanHtmlContent($request->content);
        $cleanDescription = $this->cleanHtmlContent($request->description);

        // 1. Simpan Data Artikel
        $article = Article::create([
            'category_id'  => $request->category_id,
            'title'        => $request->title,
            'slug'         => Str::slug($request->title) . '-' . time(),
            'image'        => $imagePath,
            'description'  => $cleanDescription,
            'content'      => $cleanContent,
            'is_published' => true,
        ]);

        // 2. Simpan Data Quote
        $quoteType = $request->input('quote_type', 'text');

        if ($quoteType === 'text' && $request->filled('quote_arabic')) {
            Quote::create([
                'article_id'  => $article->id,
                'arabic'      => $request->quote_arabic,
                'translation' => $request->quote_translation,
                'reference'   => $request->quote_reference,
                'font'        => $request->input('quote_font', 'font-adobe-naskh'),
                'font_size'   => $request->input('quote_font_size', 36),
                'color'       => $request->input('quote_color', '#1D4533'),
            ]);
        } elseif ($quoteType === 'image' && $request->hasFile('quote_image')) {
            $quoteImagePath = '/storage/' . $request->file('quote_image')->store('quotes', 'public');
            Quote::create([
                'article_id' => $article->id,
                'image'      => $quoteImagePath,
            ]);
        } elseif ($quoteType === 'youtube' && $request->filled('quote_youtube_url')) {
            Quote::create([
                'article_id' => $article->id,
                'image'      => $request->quote_youtube_url,
            ]);
        }

        return redirect()->route('admin.articles.index')->with('success', 'Artikel berhasil disimpan.');
    }

    public function edit($id)
    {
        $article = Article::with('quotes')->findOrFail($id);
        $categories = Category::all();
        $quote = $article->quotes()->first();

        return Inertia::render('Article/Edit', [
            'article'    => $article,
            'categories' => $categories,
            'quote'      => $quote,
        ]);
    }

    public function update(Request $request, $id)
    {
        $article = Article::findOrFail($id);

        $request->validate([
            'title'             => 'required|string|max:255',
            'category_id'       => 'required|exists:categories,id',
            'description'       => 'nullable|string',
            'content'           => 'required|string',
            'image_file'        => 'nullable|image|max:2048',
            'image_url'         => 'nullable|url',
            'quote_type'        => 'nullable|string|in:text,image,youtube',
            'quote_arabic'      => 'nullable|string',
            'quote_translation' => 'nullable|string',
            'quote_reference'   => 'nullable|string',
            'quote_font'        => 'nullable|string',
            'quote_font_size'   => 'nullable|numeric',
            'quote_color'       => 'nullable|string',
            'quote_image'       => 'nullable|image|max:2048',
            'quote_youtube_url' => 'nullable|url',
        ]);

        // Update Gambar Sampul Utama
        $imagePath = $article->image;
        if ($request->hasFile('image_file')) {
            $imagePath = '/storage/' . $request->file('image_file')->store('articles', 'public');
        } elseif ($request->filled('image_url')) {
            $imagePath = $request->image_url;
        }

        $cleanContent = $this->cleanHtmlContent($request->content);
        $cleanDescription = $this->cleanHtmlContent($request->description);

        $article->update([
            'category_id'  => $request->category_id,
            'title'        => $request->title,
            'image'        => $imagePath,
            'description'  => $cleanDescription,
            'content'      => $cleanContent,
            'is_published' => (bool) $request->is_published,
        ]);

        // Update Quote / Media Tafsir
        $quoteType = $request->input('quote_type', 'text');
        $quote = $article->quotes()->first();

        if ($quoteType === 'text') {
            if ($request->filled('quote_arabic')) {
                $quoteData = [
                    'arabic'      => $request->quote_arabic,
                    'translation' => $request->quote_translation,
                    'reference'   => $request->quote_reference,
                    'font'        => $request->input('quote_font', 'font-adobe-naskh'),
                    'font_size'   => $request->input('quote_font_size', 36),
                    'color'       => $request->input('quote_color', '#1D4533'),
                    'image'       => null,
                ];

                if ($quote) {
                    $quote->update($quoteData);
                } else {
                    $article->quotes()->create($quoteData);
                }
            } elseif ($quote) {
                $quote->delete();
            }
        } elseif ($quoteType === 'image') {
            $quoteImagePath = $quote?->image;
            if ($request->hasFile('quote_image')) {
                $quoteImagePath = '/storage/' . $request->file('quote_image')->store('quotes', 'public');
            }

            if ($quoteImagePath) {
                $quoteData = [
                    'image'       => $quoteImagePath,
                    'arabic'      => null,
                    'translation' => null,
                    'reference'   => null,
                ];
                if ($quote) {
                    $quote->update($quoteData);
                } else {
                    $article->quotes()->create($quoteData);
                }
            }
        } elseif ($quoteType === 'youtube') {
            if ($request->filled('quote_youtube_url')) {
                $quoteData = [
                    'image'       => $request->quote_youtube_url,
                    'arabic'      => null,
                    'translation' => null,
                    'reference'   => null,
                ];
                if ($quote) {
                    $quote->update($quoteData);
                } else {
                    $article->quotes()->create($quoteData);
                }
            } elseif ($quote) {
                $quote->delete();
            }
        }

        return redirect()->route('admin.articles.index')->with('success', 'Artikel berhasil diperbarui.');
    }
}
