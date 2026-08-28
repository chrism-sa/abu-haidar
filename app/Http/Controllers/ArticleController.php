<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\Category;
use App\Models\Quote;
use App\Models\Ebook;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Artisan;

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

        $categories = Category::withCount([
            'articles' => function ($query) {
                $query->where('is_published', true);
            }
        ])->orderByRaw('FIELD(id, 2, 3, 1, 4, 5, 6, 7, 8, 9)')->get();

        $ebooks = Ebook::where('is_published', true)->latest()->take(3)->get();

        return Inertia::render('Article/Show', [
            'article' => $article,
            'relatedArticles' => $relatedArticles,
            'popularArticles' => $popularArticles,
            'categories' => $categories,
            'ebooks' => $ebooks,
            'quote' => $quote,
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
            'title' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'description' => 'nullable|string',
            'content' => 'required|string',
            'image_file' => 'nullable|image|max:5120',
            'image_url' => 'nullable|url',
            'quote_type' => 'nullable|string|in:text,image,youtube',
            'quote_arabic' => 'nullable|string',
            'quote_translation' => 'nullable|string',
            'quote_reference' => 'nullable|string',
            'quote_font' => 'nullable|string',
            'quote_font_size' => 'nullable|numeric',
            'quote_color' => 'nullable|string',
            'quote_image' => 'nullable|image|max:5120',
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
            'category_id' => $request->category_id,
            'title' => $request->title,
            'slug' => Str::slug($request->title) . '-' . time(),
            'image' => $imagePath,
            'description' => $cleanDescription,
            'content' => $cleanContent,
            'is_published' => true,
        ]);

        // 2. Simpan Data Quote
        $quoteType = $request->input('quote_type', 'text');

        if ($quoteType === 'text' && $request->filled('quote_arabic')) {
            Quote::create([
                'article_id' => $article->id,
                'arabic' => $request->quote_arabic,
                'translation' => $request->quote_translation,
                'reference' => $request->quote_reference,
                'font' => $request->input('quote_font', 'font-adobe-naskh'),
                'font_size' => $request->input('quote_font_size', 36),
                'line_height' => $request->input('quote_line_height', 2.4),
                'color' => $request->input('quote_color', '#1D4533'),
            ]);
        } elseif ($quoteType === 'image' && $request->hasFile('quote_image')) {
            $quoteImagePath = '/storage/' . $request->file('quote_image')->store('quotes', 'public');
            Quote::create([
                'article_id' => $article->id,
                'image' => $quoteImagePath,
            ]);
        } elseif ($quoteType === 'youtube' && $request->filled('quote_youtube_url')) {
            Quote::create([
                'article_id' => $article->id,
                'image' => $request->quote_youtube_url,
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
            'article' => $article,
            'categories' => $categories,
            'quote' => $quote,
        ]);
    }

    public function update(Request $request, $id)
    {
        $article = Article::findOrFail($id);

        $request->validate([
            'title' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'description' => 'nullable|string',
            'content' => 'required|string',
            'image_file' => 'nullable|image|max:5120',
            'image_url' => 'nullable|url',
            'quote_type' => 'nullable|string|in:text,image,youtube',
            'quote_arabic' => 'nullable|string',
            'quote_translation' => 'nullable|string',
            'quote_reference' => 'nullable|string',
            'quote_font' => 'nullable|string',
            'quote_font_size' => 'nullable|numeric',
            'quote_color' => 'nullable|string',
            'quote_line_height' => 'nullable|numeric',
            'quote_image' => 'nullable|image|max:5120',
            'quote_youtube_url' => 'nullable|url',
        ]);

        // Update Gambar Sampul Utama & Hapus File Lama Jika Diganti
        $imagePath = $article->image;
        if ($request->hasFile('image_file')) {
            if ($article->image && str_starts_with($article->image, '/storage/')) {
                $oldCover = str_replace('/storage/', '', $article->image);
                if (Storage::disk('public')->exists($oldCover)) {
                    Storage::disk('public')->delete($oldCover);
                }
            }
            $imagePath = '/storage/' . $request->file('image_file')->store('articles', 'public');
        } elseif ($request->filled('image_url')) {
            // Jika berganti dari file lokal ke link YouTube / URL luar, hapus file lokal lamanya
            if ($article->image && str_starts_with($article->image, '/storage/')) {
                $oldCover = str_replace('/storage/', '', $article->image);
                if (Storage::disk('public')->exists($oldCover)) {
                    Storage::disk('public')->delete($oldCover);
                }
            }
            $imagePath = $request->image_url;
        }

        $cleanContent = $this->cleanHtmlContent($request->content);
        $cleanDescription = $this->cleanHtmlContent($request->description);

        $article->update([
            'category_id' => $request->category_id,
            'title' => $request->title,
            'image' => $imagePath,
            'description' => $cleanDescription,
            'content' => $cleanContent,
            'is_published' => (bool) $request->is_published,
        ]);

        // Update Quote / Media Tafsir
        $quoteType = $request->input('quote_type', 'text');
        $quote = $article->quotes()->first();

        if ($quoteType === 'text') {
            if ($request->filled('quote_arabic')) {
                // Hapus gambar lama pada quote jika sebelumnya tipe image
                if ($quote && $quote->image && str_starts_with($quote->image, '/storage/')) {
                    $oldQuoteImg = str_replace('/storage/', '', $quote->image);
                    if (Storage::disk('public')->exists($oldQuoteImg)) {
                        Storage::disk('public')->delete($oldQuoteImg);
                    }
                }

                $quoteData = [
                    'arabic' => $request->quote_arabic,
                    'translation' => $request->quote_translation,
                    'reference' => $request->quote_reference,
                    'font' => $request->input('quote_font', 'font-adobe-naskh'),
                    'font_size' => $request->input('quote_font_size', 36),
                    'line_height' => $request->input('quote_line_height', 2.4),
                    'color' => $request->input('quote_color', '#1D4533'),
                    'image' => null,
                ];

                if ($quote) {
                    $quote->update($quoteData);
                } else {
                    $article->quotes()->create($quoteData);
                }
            } elseif ($quote) {
                if ($quote->image && str_starts_with($quote->image, '/storage/')) {
                    $oldQuoteImg = str_replace('/storage/', '', $quote->image);
                    if (Storage::disk('public')->exists($oldQuoteImg)) {
                        Storage::disk('public')->delete($oldQuoteImg);
                    }
                }
                $quote->delete();
            }
        } elseif ($quoteType === 'image') {
            $quoteImagePath = $quote?->image;
            if ($request->hasFile('quote_image')) {
                if ($quote && $quote->image && str_starts_with($quote->image, '/storage/')) {
                    $oldQuoteImg = str_replace('/storage/', '', $quote->image);
                    if (Storage::disk('public')->exists($oldQuoteImg)) {
                        Storage::disk('public')->delete($oldQuoteImg);
                    }
                }
                $quoteImagePath = '/storage/' . $request->file('quote_image')->store('quotes', 'public');
            }

            if ($quoteImagePath) {
                $quoteData = [
                    'image' => $quoteImagePath,
                    'arabic' => null,
                    'translation' => null,
                    'reference' => null,
                ];
                if ($quote) {
                    $quote->update($quoteData);
                } else {
                    $article->quotes()->create($quoteData);
                }
            }
        } elseif ($quoteType === 'youtube') {
            if ($request->filled('quote_youtube_url')) {
                if ($quote && $quote->image && str_starts_with($quote->image, '/storage/')) {
                    $oldQuoteImg = str_replace('/storage/', '', $quote->image);
                    if (Storage::disk('public')->exists($oldQuoteImg)) {
                        Storage::disk('public')->delete($oldQuoteImg);
                    }
                }

                $quoteData = [
                    'image' => $request->quote_youtube_url,
                    'arabic' => null,
                    'translation' => null,
                    'reference' => null,
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

    public function uploadEditorMedia(Request $request)
    {
        $request->validate([
            'file' => 'required|file|image|mimes:jpeg,png,jpg,webp,gif|max:5120',
        ], [
            'file.required' => 'File gambar wajib dipilih!',
            'file.image' => 'File harus berupa gambar.',
            'file.max' => 'Ukuran gambar maksimal 5 MB.',
        ]);

        try {
            if ($request->hasFile('file')) {
                $file = $request->file('file');
                $path = $file->store('articles/media', 'public');
                $url = '/storage/' . $path;

                return response()->json([
                    'success' => true,
                    'url' => $url,
                ], 200);
            }
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengunggah file: ' . $e->getMessage()
            ], 500);
        }

        return response()->json([
            'success' => false,
            'message' => 'File gambar tidak ditemukan.'
        ], 400);
    }

    public function cleanStorageImages()
    {
        try {
            Artisan::call('storage:clean-images');
            return redirect()->back()->with('success', 'File sampah di storage berhasil dibersihkan!');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Gagal membersihkan storage: ' . $e->getMessage());
        }
    }
}