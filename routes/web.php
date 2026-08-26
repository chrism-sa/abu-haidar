<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ArticleController;
use App\Http\Controllers\AuthController;
use App\Models\Article;
use App\Models\Category;
use App\Models\Quote;
use App\Models\User;
use App\Models\Ebook;
use App\Models\Setting;

/*
|--------------------------------------------------------------------------
| 1. RUTE PUBLIK (Dapat Diakses Siapa Saja)
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return Inertia::render('Welcome');
})->name('welcome');

// Beranda Utama Website
Route::get('/home', [HomeController::class, 'index'])->name('home');

// Katalog & Pencarian Artikel
Route::get('/artikel', function (Request $request) {
    $search = $request->query('search');

    $articles = Article::with('category')
        ->where('is_published', true)
        ->when($search, function ($query, $search) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', '%' . $search . '%')
                    ->orWhere('description', 'like', '%' . $search . '%');
            });
        })
        ->latest()
        ->get();

    return Inertia::render('Article/Index', [
        'articles' => $articles,
        'title' => $search ? 'Pencarian: "' . $search . '"' : 'Semua Artikel',
        'categories' => Category::orderByRaw('FIELD(id, 2, 3, 1, 4, 5, 6, 7, 8, 9)')->get(),
        'currentCategory' => null
    ]);
})->name('artikel.index');

Route::get('/artikel/{slug}', [ArticleController::class, 'show'])->name('artikel.show');

// Kategori Publik
Route::get('/kategori/{slug}', function ($slug) {
    $category = Category::where('slug', $slug)->firstOrFail();

    $articles = Article::with('category')
        ->where('category_id', $category->id)
        ->where('is_published', true)
        ->latest()
        ->get();

    return Inertia::render('Article/Index', [
        'articles' => $articles,
        'title' => 'Kategori: ' . $category->name,
        'categories' => Category::orderByRaw('FIELD(id, 2, 3, 1, 4, 5, 6, 7, 8, 9)')->get(),
        'currentCategory' => $category
    ]);
})->name('kategori.show');

// E-Book Publik
Route::get('/ebook', function () {
    return Inertia::render('Ebook/Index', [
        'ebooks' => Ebook::where('is_published', true)->latest()->get()
    ]);
})->name('ebook.index');

Route::get('/ebook/{slug}', function ($slug) {
    $ebook = Ebook::where('slug', $slug)->where('is_published', true)->firstOrFail();
    return Inertia::render('Ebook/Show', [
        'ebook' => $ebook
    ]);
})->name('ebook.show');

// API Pencarian Real-Time
Route::get('/api/articles/search', function (Request $request) {
    $keyword = $request->query('q');

    $articles = Article::where('is_published', true)
        ->when($keyword, function ($query, $keyword) {
            $query->where(function ($sub) use ($keyword) {
                $sub->where('title', 'like', '%' . $keyword . '%')
                    ->orWhere('description', 'like', '%' . $keyword . '%');
            });
        })
        ->latest()
        ->limit(5)
        ->get(['id', 'title', 'slug', 'image', 'description', 'created_at'])
        ->map(function ($article) {
            $imageUrl = $article->image;

            if ($imageUrl && preg_match('/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/', $imageUrl, $matches)) {
                $imageUrl = "https://img.youtube.com/vi/{$matches[1]}/mqdefault.jpg";
            }

            return [
                'id' => $article->id,
                'title' => $article->title,
                'slug' => $article->slug,
                'image' => $imageUrl,
                'description' => $article->description,
                'created_at' => $article->created_at,
            ];
        });

    return response()->json([
        'articles' => $articles
    ]);
});

/*
|--------------------------------------------------------------------------
| 2. RUTE AUTENTIKASI
|--------------------------------------------------------------------------
*/
Route::get('/login', [AuthController::class, 'showLoginForm'])->name('login')->middleware('guest');
Route::post('/login', [AuthController::class, 'login'])->middleware('guest');
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

/*
|--------------------------------------------------------------------------
| 3. GERBANG REDIREKSI DASHBOARD
|--------------------------------------------------------------------------
*/
Route::middleware('auth')->get('/dashboard', function () {
    $user = auth()->user();

    if ($user->isAdmin()) {
        return redirect()->route('admin.dashboard');
    }

    return redirect()->route('user.dashboard');
})->name('dashboard');

/*
|--------------------------------------------------------------------------
| 4. RUTE USER BIASA / JAMAAH
|--------------------------------------------------------------------------
*/
Route::middleware('auth')->prefix('user')->name('user.')->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('User/Dashboard', [
            'auth' => [
                'user' => auth()->user()
            ]
        ]);
    })->name('dashboard');
});

/*
|--------------------------------------------------------------------------
| 5. RUTE KHUSUS ADMINISTRATOR (Diproteksi Auth & Role Admin)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {

    // 1. DASHBOARD UTAMA
    Route::get('/dashboard', function () {
        $dbConnected = false;
        try {
            DB::connection()->getPdo();
            $dbConnected = true;
        } catch (\Exception $e) {
            $dbConnected = false;
        }

        return Inertia::render('Admin/Dashboard', [
            'auth' => [
                'user' => auth()->user()
            ],
            'db_status' => $dbConnected
        ]);
    })->name('dashboard');

    // 2. KELOLA PENGGUNA (USERS)
    Route::get('/users', function () {
        return Inertia::render('Admin/Users/Index', [
            'users' => User::latest()->get()
        ]);
    })->name('users.index');

    Route::post('/users', function (Request $request) {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'nullable|in:admin,user',
        ], [
            'email.unique' => 'Mohon maaf, alamat email ini sudah terdaftar.',
            'password.confirmed' => 'Konfirmasi kata sandi tidak cocok.',
            'password.min' => 'Kata sandi minimal harus 8 karakter.'
        ]);

        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'role' => $request->input('role', 'user'),
        ]);

        return redirect()->back()->with('success', 'Pengguna baru berhasil ditambahkan!');
    })->name('users.store');

    Route::delete('/users/{id}', function ($id) {
        $user = User::findOrFail($id);

        if ($user->id === auth()->id()) {
            return redirect()->back()->with('error', 'Anda tidak bisa menghapus akun Anda sendiri yang sedang aktif!');
        }

        $user->delete();
        return redirect()->back()->with('success', 'Pengguna berhasil dihapus!');
    })->name('users.destroy');

    // 3. KELOLA ARTIKEL
    Route::get('/articles', function () {
        return Inertia::render('Admin/Articles/Index', [
            'articles' => Article::with('category')->latest()->get()
        ]);
    })->name('articles.index');

    Route::get('/articles/create', function () {
        return Inertia::render('Admin/Articles/Create', [
            'categories' => Category::orderByRaw('FIELD(id, 2, 3, 1, 4, 5, 6, 7, 8, 9)')->get()
        ]);
    })->name('articles.create');

    Route::post('/articles', function (Request $request) {
        $rawContent = $request->content ?? '';
        $cleanContent = str_replace(['&nbsp;', '&#160;', '&#xA0;', "\xc2\xa0", "\u{00A0}"], ' ', $rawContent);
        $cleanDescription = str_replace(['&nbsp;', '&#160;', '&#xA0;', "\xc2\xa0", "\u{00A0}"], ' ', $request->description ?? '');

        $plainText = trim(strip_tags($cleanContent));
        if (empty($plainText)) {
            $request->merge(['content' => null]);
        } else {
            $request->merge(['content' => $cleanContent]);
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'image_file' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'image_url' => 'nullable|string',
            'description' => 'nullable|string',
            'content' => 'required|string',
            'quote_type' => 'nullable|in:text,image,youtube',
            'quote_image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'quote_youtube_url' => 'nullable|string',
            'quote_arabic' => 'nullable|string',
            'quote_translation' => 'nullable|string',
            'quote_reference' => 'nullable|string',
            'quote_font' => 'nullable|string',
            'quote_font_size' => 'nullable|numeric',
            'quote_line_height' => 'nullable|numeric',
            'quote_color' => 'nullable|string',
        ], [
            'title.required' => 'Judul artikel wajib diisi.',
            'category_id.required' => 'Silakan pilih salah satu kategori.',
            'content.required' => 'Konten atau isi naskah artikel tidak boleh kosong!',
            'image_file.max' => 'Ukuran file gambar sampul maksimal 2 MB.',
            'quote_image.max' => 'Ukuran file gambar quote maksimal 2 MB.',
        ]);

        $imagePath = '';
        if ($request->hasFile('image_file')) {
            $imagePath = '/storage/' . $request->file('image_file')->store('articles', 'public');
        } elseif ($request->filled('image_url')) {
            $imagePath = $request->image_url;
        } else {
            $imagePath = 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?q=80&w=1200&auto=format&fit=crop';
        }

        $article = Article::create([
            'category_id' => $request->category_id,
            'title' => $request->title,
            'slug' => Str::slug($request->title) . '-' . time(),
            'image' => $imagePath,
            'description' => $cleanDescription ?? '',
            'content' => $cleanContent ?? '',
            'is_published' => true,
            'is_hero' => false,
            'is_featured' => false,
        ]);

        $quoteType = $request->quote_type ?? 'text';
        $quoteImage = null;

        if ($quoteType === 'youtube' && $request->filled('quote_youtube_url')) {
            $quoteImage = $request->quote_youtube_url;
        } elseif ($quoteType === 'image' && $request->hasFile('quote_image')) {
            $quoteImage = '/storage/' . $request->file('quote_image')->store('quotes', 'public');
        }

        if ($quoteImage || $request->filled('quote_arabic') || $request->filled('quote_reference')) {
            Quote::create([
                'article_id' => $article->id,
                'arabic' => $quoteType === 'text' ? ($request->quote_arabic ?? '') : '',
                'translation' => $quoteType === 'text' ? ($request->quote_translation ?? '') : '',
                'reference' => $request->quote_reference ?? '',
                'font' => $request->input('quote_font', 'font-adobe-naskh'),
                'font_size' => $request->input('quote_font_size', 36),
                'line_height' => $request->input('quote_line_height', 2.4),
                'color' => $request->input('quote_color', '#1D4533'),
                'image' => $quoteImage,
            ]);
        }

        return redirect()->route('admin.articles.index')->with('success', 'Artikel berhasil dipublikasikan!');
    })->name('articles.store');

    Route::get('/articles/{id}/edit', function ($id) {
        $article = Article::with('quotes')->findOrFail($id);

        return Inertia::render('Admin/Articles/Edit', [
            'article' => $article,
            'categories' => Category::orderByRaw('FIELD(id, 2, 3, 1, 4, 5, 6, 7, 8, 9)')->get(),
            'quote' => $article->quotes->first()
        ]);
    })->name('articles.edit');

    Route::post('/articles/{id}', function (Request $request, $id) {
        $article = Article::with('quotes')->findOrFail($id);

        $request->validate([
            'title' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'image_file' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'image_url' => 'nullable|string',
            'description' => 'nullable|string',
            'content' => 'required|string',
            'quote_type' => 'nullable|in:text,image,youtube',
            'quote_image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'quote_youtube_url' => 'nullable|string',
            'quote_arabic' => 'nullable|string',
            'quote_translation' => 'nullable|string',
            'quote_reference' => 'nullable|string',
            'quote_font' => 'nullable|string',
            'quote_font_size' => 'nullable|numeric',
            'quote_line_height' => 'nullable|numeric',
            'quote_color' => 'nullable|string',
        ]);

        $cleanContent = str_replace(['&nbsp;', '&#160;', '&#xA0;', "\xc2\xa0", "\u{00A0}"], ' ', $request->content ?? '');
        $cleanDescription = str_replace(['&nbsp;', '&#160;', '&#xA0;', "\xc2\xa0", "\u{00A0}"], ' ', $request->description ?? '');

        $updateData = [
            'title' => $request->title,
            'slug' => Str::slug($request->title) . '-' . $article->id,
            'category_id' => $request->category_id,
            'description' => $cleanDescription ?? '',
            'content' => $cleanContent ?? '',
        ];

        if ($request->hasFile('image_file')) {
            if ($article->image && str_starts_with($article->image, '/storage/')) {
                $oldPath = str_replace('/storage/', '', $article->image);
                if (Storage::disk('public')->exists($oldPath)) {
                    Storage::disk('public')->delete($oldPath);
                }
            }
            $imagePath = $request->file('image_file')->store('articles', 'public');
            $updateData['image'] = '/storage/' . $imagePath;
        } elseif ($request->filled('image_url') && $request->image_url !== $article->image) {
            if ($article->image && str_starts_with($article->image, '/storage/')) {
                $oldPath = str_replace('/storage/', '', $article->image);
                if (Storage::disk('public')->exists($oldPath)) {
                    Storage::disk('public')->delete($oldPath);
                }
            }
            $updateData['image'] = $request->image_url;
        }

        $article->update($updateData);

        $quoteType = $request->quote_type ?? 'text';
        $existingQuote = $article->quotes->first();
        $quoteImage = $existingQuote ? $existingQuote->image : null;

        if ($quoteType === 'youtube') {
            if ($quoteImage && str_starts_with($quoteImage, '/storage/')) {
                $oldQuoteFile = str_replace('/storage/', '', $quoteImage);
                if (Storage::disk('public')->exists($oldQuoteFile)) {
                    Storage::disk('public')->delete($oldQuoteFile);
                }
            }
            $quoteImage = $request->quote_youtube_url;
        } elseif ($quoteType === 'image') {
            if ($request->hasFile('quote_image')) {
                if ($quoteImage && str_starts_with($quoteImage, '/storage/')) {
                    $oldQuoteFile = str_replace('/storage/', '', $quoteImage);
                    if (Storage::disk('public')->exists($oldQuoteFile)) {
                        Storage::disk('public')->delete($oldQuoteFile);
                    }
                }
                $quoteImage = '/storage/' . $request->file('quote_image')->store('quotes', 'public');
            }
        } else {
            if ($quoteImage && str_starts_with($quoteImage, '/storage/')) {
                $oldQuoteFile = str_replace('/storage/', '', $quoteImage);
                if (Storage::disk('public')->exists($oldQuoteFile)) {
                    Storage::disk('public')->delete($oldQuoteFile);
                }
            }
            $quoteImage = null;
        }

        if ($quoteImage || $request->filled('quote_arabic') || $request->filled('quote_reference')) {
            Quote::updateOrCreate(
                ['article_id' => $article->id],
                [
                    'arabic' => $quoteType === 'text' ? ($request->quote_arabic ?? '') : '',
                    'translation' => $quoteType === 'text' ? ($request->quote_translation ?? '') : '',
                    'reference' => $request->quote_reference ?? '',
                    'font' => $request->input('quote_font', 'font-adobe-naskh'),
                    'font_size' => $request->input('quote_font_size', 36),
                    'line_height' => $request->input('quote_line_height', 2.4),
                    'color' => $request->input('quote_color', '#1D4533'),
                    'image' => $quoteImage,
                ]
            );
        } else {
            Quote::where('article_id', $article->id)->delete();
        }

        return redirect()->route('admin.articles.index')->with('success', 'Artikel berhasil diperbarui!');
    })->name('articles.update');

    Route::delete('/articles/{id}', function ($id) {
        $article = Article::findOrFail($id);
        $article->delete();

        return redirect()->back()->with('success', 'Artikel beserta seluruh aset gambar berhasil dihapus bersih!');
    })->name('articles.destroy');

    Route::post('/articles/{id}/toggle-publish', function ($id) {
        $article = Article::findOrFail($id);
        $article->update(['is_published' => !$article->is_published]);
        return response()->json(['success' => true, 'is_published' => $article->is_published]);
    })->name('articles.togglePublish');

    Route::post('/articles/{id}/toggle-hero', function ($id) {
        $article = Article::findOrFail($id);
        if (!$article->is_hero) {
            Article::query()->update(['is_hero' => false]);
            $article->update(['is_hero' => true]);
            $status = true;
        } else {
            $article->update(['is_hero' => false]);
            $status = false;
        }
        return response()->json(['success' => true, 'is_hero' => $status]);
    })->name('articles.toggleHero');

    Route::post('/articles/{id}/toggle-featured', function ($id) {
        $article = Article::findOrFail($id);
        if (!$article->is_featured) {
            $currentFeaturedCount = Article::where('is_featured', true)->count();
            if ($currentFeaturedCount >= 3) {
                return response()->json(['success' => false, 'message' => 'Maksimal 3 artikel pilihan redaksi!'], 422);
            }
            $article->update(['is_featured' => true]);
            $status = true;
        } else {
            $article->update(['is_featured' => false]);
            $status = false;
        }
        return response()->json(['success' => true, 'is_featured' => $status]);
    })->name('articles.toggleFeatured');

    // 4. KELOLA KATEGORI
    Route::get('/categories', function () {
        $categories = Category::withCount('articles')
            ->orderByRaw('FIELD(id, 2, 3, 1, 4, 5, 6, 7, 8, 9)')
            ->get();

        return Inertia::render('Admin/Categories/Index', [
            'categories' => $categories
        ]);
    })->name('categories.index');

    Route::post('/categories', function (Request $request) {
        $validated = $request->validate([
            'name' => 'required|string|max:100|unique:categories,name',
        ]);

        Category::create([
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']),
        ]);

        return redirect()->back()->with('success', 'Kategori berhasil ditambahkan!');
    })->name('categories.store');

    Route::put('/categories/{id}', function (Request $request, $id) {
        $category = Category::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:100|unique:categories,name,' . $id,
        ]);

        $category->update([
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']),
        ]);

        return redirect()->back()->with('success', 'Kategori berhasil diperbarui!');
    })->name('categories.update');

    Route::delete('/categories/{id}', function ($id) {
        $category = Category::withCount('articles')->findOrFail($id);

        if ($category->articles_count > 0) {
            return redirect()->back()->with('error', 'Kategori tidak dapat dihapus karena masih memiliki artikel terkait.');
        }

        $category->delete();

        return redirect()->back()->with('success', 'Kategori berhasil dihapus!');
    })->name('categories.destroy');

    // 5. KELOLA E-BOOK
    Route::get('/ebooks', function () {
        return Inertia::render('Admin/Ebooks/Index', [
            'ebooks' => Ebook::latest()->get()
        ]);
    })->name('ebooks.index');

    Route::post('/ebooks', function (Request $request) {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'author' => 'nullable|string',
            'total_pages' => 'nullable|integer',
            'pdf_file' => 'required|mimes:pdf|max:20480',
            'cover_image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        $pdfFile = $request->file('pdf_file');
        $pdfSizeInMB = round($pdfFile->getSize() / (1024 * 1024), 2) . ' MB';

        $originalPdfName = pathinfo($pdfFile->getClientOriginalName(), PATHINFO_FILENAME);
        $cleanPdfName = Str::slug($originalPdfName) . '.' . $pdfFile->getClientOriginalExtension();

        $pdfStoredPath = $pdfFile->storeAs('ebooks/files', $cleanPdfName, 'public');
        $pdfPath = '/storage/' . $pdfStoredPath;

        $coverPath = null;
        if ($request->hasFile('cover_image')) {
            $coverFile = $request->file('cover_image');
            $originalCoverName = pathinfo($coverFile->getClientOriginalName(), PATHINFO_FILENAME);
            $cleanCoverName = Str::slug($originalCoverName) . '-' . time() . '.' . $coverFile->getClientOriginalExtension();

            $coverStoredPath = $coverFile->storeAs('ebooks/covers', $cleanCoverName, 'public');
            $coverPath = '/storage/' . $coverStoredPath;
        }

        Ebook::create([
            'title' => $request->title,
            'slug' => Str::slug($request->title) . '-' . time(),
            'description' => $request->description,
            'author' => $request->author ?? 'Abu Haidar',
            'file_path' => $pdfPath,
            'file_size' => $pdfSizeInMB,
            'total_pages' => $request->total_pages,
            'cover_image' => $coverPath,
            'is_published' => $request->boolean('is_published', true),
        ]);

        return redirect()->back()->with('success', 'E-Book PDF berhasil diunggah!');
    })->name('ebooks.store');

    Route::post('/ebooks/{id}', function (Request $request, $id) {
        $ebook = Ebook::findOrFail($id);

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'author' => 'nullable|string',
            'total_pages' => 'nullable|integer',
            'pdf_file' => 'nullable|mimes:pdf|max:20480',
            'cover_image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        $updateData = [
            'title' => $request->title,
            'slug' => Str::slug($request->title) . '-' . $ebook->id,
            'description' => $request->description,
            'author' => $request->author ?? 'Abu Haidar',
            'total_pages' => $request->total_pages,
            'is_published' => $request->boolean('is_published'),
        ];

        if ($request->hasFile('pdf_file')) {
            if ($ebook->file_path && str_starts_with($ebook->file_path, '/storage/')) {
                $oldPdf = str_replace('/storage/', '', $ebook->file_path);
                if (Storage::disk('public')->exists($oldPdf)) {
                    Storage::disk('public')->delete($oldPdf);
                }
            }

            $pdfFile = $request->file('pdf_file');
            $pdfSizeInMB = round($pdfFile->getSize() / (1024 * 1024), 2) . ' MB';
            $originalPdfName = pathinfo($pdfFile->getClientOriginalName(), PATHINFO_FILENAME);
            $cleanPdfName = Str::slug($originalPdfName) . '.' . $pdfFile->getClientOriginalExtension();

            $pdfStoredPath = $pdfFile->storeAs('ebooks/files', $cleanPdfName, 'public');
            $updateData['file_path'] = '/storage/' . $pdfStoredPath;
            $updateData['file_size'] = $pdfSizeInMB;
        }

        if ($request->hasFile('cover_image')) {
            if ($ebook->cover_image && str_starts_with($ebook->cover_image, '/storage/')) {
                $oldCover = str_replace('/storage/', '', $ebook->cover_image);
                if (Storage::disk('public')->exists($oldCover)) {
                    Storage::disk('public')->delete($oldCover);
                }
            }

            $coverFile = $request->file('cover_image');
            $originalCoverName = pathinfo($coverFile->getClientOriginalName(), PATHINFO_FILENAME);
            $cleanCoverName = Str::slug($originalCoverName) . '-' . time() . '.' . $coverFile->getClientOriginalExtension();

            $coverStoredPath = $coverFile->storeAs('ebooks/covers', $cleanCoverName, 'public');
            $updateData['cover_image'] = '/storage/' . $coverStoredPath;
        }

        $ebook->update($updateData);

        return redirect()->back()->with('success', 'E-Book berhasil diperbarui!');
    })->name('ebooks.update');

    Route::post('/ebooks/{id}/toggle-status', function ($id) {
        $ebook = Ebook::findOrFail($id);
        $ebook->update(['is_published' => !$ebook->is_published]);
        return response()->json(['success' => true, 'is_published' => $ebook->is_published]);
    })->name('ebooks.toggle');

    Route::delete('/ebooks/{id}', function ($id) {
        $ebook = Ebook::findOrFail($id);
        $ebook->delete();

        return redirect()->back()->with('success', 'E-Book beserta seluruh file dokumen berhasil dihapus!');
    })->name('ebooks.destroy');

    // 6. SIMPAN PENGATURAN TAMPILAN GLOBAL KE DATABASE
    Route::post('/settings/save', function (Request $request) {
        $request->validate([
            'key' => 'required|string',
            'value' => 'required|array',
        ]);

        Setting::updateOrCreate(
            ['key' => $request->key],
            ['value' => json_encode($request->value)]
        );

        return back()->with('success', 'Pengaturan tampilan berhasil disimpan untuk semua pengunjung!');
    })->name('settings.save');
});