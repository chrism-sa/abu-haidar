<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ArticleController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Models\Article;
use App\Models\Category;
use App\Models\Quote;

/*
|--------------------------------------------------------------------------
| RUTE PUBLIK
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| RUTE PUBLIK
|--------------------------------------------------------------------------
*/
// Halaman Pembuka / Sambutan Sementara
Route::get('/', function () {
    return Inertia::render('Welcome');
})->name('welcome');

// Beranda Utama Website (Daftar Artikel & Kajian)
Route::get('/home', [HomeController::class, 'index'])->name('home');

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
        'categories' => Category::all(),
        'currentCategory' => null
    ]);
})->name('artikel.index');

Route::get('/artikel/{slug}', [ArticleController::class, 'show'])->name('artikel.show');

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
        'categories' => Category::all(),
        'currentCategory' => $category
    ]);
})->name('kategori.show');


/*
|--------------------------------------------------------------------------
| API PENCARIAN REAL-TIME
|--------------------------------------------------------------------------
*/
Route::get('/api/articles/search', function (Request $request) {
    $keyword = $request->query('q');

    $articles = Article::where('is_published', true)
        ->when($keyword, function ($query, $keyword) {
            $query->where('title', 'like', '%' . $keyword . '%')
                ->orWhere('description', 'like', '%' . $keyword . '%');
        })
        ->limit(5)
        ->get(['id', 'title', 'slug', 'image', 'description', 'created_at']);

    return response()->json([
        'articles' => $articles
    ]);
});


/*
|--------------------------------------------------------------------------
| RUTE AUTENTIKASI
|--------------------------------------------------------------------------
*/
Route::get('/login', [AuthController::class, 'showLoginForm'])->name('login')->middleware('guest');
Route::post('/login', [AuthController::class, 'login'])->middleware('guest');
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');


/*
|--------------------------------------------------------------------------
| RUTE ADMIN (Dashboard, Kelola Artikel & Kategori)
|--------------------------------------------------------------------------
*/
Route::middleware('auth')->prefix('admin')->group(function () {

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
    })->name('admin.dashboard');

    // 2. KELOLA ARTIKEL
    Route::get('/articles', function () {
        return Inertia::render('Admin/Articles/Index', [
            'articles' => Article::with('category')->latest()->get()
        ]);
    })->name('admin.articles.index');

    Route::get('/articles/create', function () {
        return Inertia::render('Admin/Articles/Create', [
            'categories' => Category::all()
        ]);
    })->name('admin.articles.create');

    // SIMPAN ARTIKEL BARU (CREATE)
    Route::post('/articles', function (Request $request) {
        // Validasi
        $request->validate([
            'title' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'image_file' => 'nullable', // Bebaskan rule agar file crop Canvas bisa masuk
            'image_url' => 'nullable|string',
            'description' => 'nullable|string',
            'content' => 'required|string',
            'quote_arabic' => 'nullable|string',
            'quote_translation' => 'nullable|string',
            'quote_reference' => 'nullable|string',
        ]);

        // Cek sumber gambar
        $imagePath = '';
        if ($request->hasFile('image_file')) {
            $imagePath = '/storage/' . $request->file('image_file')->store('articles', 'public');
        } elseif ($request->filled('image_url')) {
            $imagePath = $request->image_url;
        } else {
            $imagePath = 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?q=80&w=1200&auto=format&fit=crop';
        }

        // Simpan Artikel (Gunakan ?? '' untuk mencegah error DB AllowNull=0)
        $article = Article::create([
            'category_id' => $request->category_id,
            'title' => $request->title,
            'slug' => Str::slug($request->title) . '-' . time(),
            'image' => $imagePath,
            'description' => $request->description ?? '',
            'content' => $request->content ?? '',
            'is_published' => true,
        ]);

        // Simpan Quotes jika ada (Gunakan ?? '' untuk mencegah error DB AllowNull=0)
        if ($request->filled('quote_arabic')) {
            Quote::create([
                'article_id' => $article->id,
                'arabic' => $request->quote_arabic ?? '',
                'translation' => $request->quote_translation ?? '',
                'reference' => $request->quote_reference ?? '',
            ]);
        }

        return redirect()->route('admin.articles.index')->with('success', 'Artikel berhasil dipublikasikan!');
    })->name('admin.articles.store');


    Route::get('/articles/{id}/edit', function ($id) {
        // Ambil artikel beserta relasi quotes (ambil quote pertama jika ada)
        $article = Article::with('quotes')->findOrFail($id);

        return Inertia::render('Admin/Articles/Edit', [
            'article' => $article,
            'categories' => Category::all(),
            'quote' => $article->quotes->first() // Kirim quote terkait jika ada
        ]);
    })->name('admin.articles.edit');

    // UPDATE ARTIKEL (EDIT)
    Route::post('/articles/{id}', function (Request $request, $id) {
        $article = Article::findOrFail($id);

        $request->validate([
            'title' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'image_file' => 'nullable',
            'image_url' => 'nullable|string',
            'description' => 'nullable|string',
            'content' => 'required|string',
            'quote_arabic' => 'nullable|string',
            'quote_translation' => 'nullable|string',
            'quote_reference' => 'nullable|string',
        ]);

        $updateData = [
            'title' => $request->title,
            'slug' => Str::slug($request->title) . '-' . $article->id,
            'category_id' => $request->category_id,
            'description' => $request->description ?? '',
            'content' => $request->content ?? '',
        ];

        // Cek apakah ada penggantian gambar
        if ($request->hasFile('image_file')) {
            $imagePath = $request->file('image_file')->store('articles', 'public');
            $updateData['image'] = '/storage/' . $imagePath;
        } elseif ($request->filled('image_url')) {
            $updateData['image'] = $request->image_url;
        }

        $article->update($updateData);

        // Update atau Buat Quote terkait
        if ($request->filled('quote_arabic')) {
            Quote::updateOrCreate(
                ['article_id' => $article->id],
                [
                    'arabic' => $request->quote_arabic ?? '',
                    'translation' => $request->quote_translation ?? '',
                    'reference' => $request->quote_reference ?? '',
                ]
            );
        } else {
            // Jika dikosongkan saat edit, hapus quote lamanya
            Quote::where('article_id', $article->id)->delete();
        }

        return redirect()->route('admin.articles.index')->with('success', 'Artikel berhasil diperbarui!');
    })->name('admin.articles.update');

    Route::delete('/articles/{id}', function ($id) {
        $article = Article::findOrFail($id);
        $article->delete(); // Quotes akan ikut terhapus jika di migrasi diset cascade

        return redirect()->route('admin.articles.index')->with('success', 'Artikel berhasil dihapus!');
    })->name('admin.articles.destroy');

    // 3. KELOLA KATEGORI
    Route::get('/categories', function () {
        $categories = Category::withCount('articles')->latest()->get();
        return Inertia::render('Admin/Categories/Index', [
            'categories' => $categories
        ]);
    })->name('admin.categories.index');

    Route::post('/categories', function (Request $request) {
        $validated = $request->validate([
            'name' => 'required|string|max:100|unique:categories,name',
        ]);

        Category::create([
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']),
        ]);

        return redirect()->back()->with('success', 'Kategori berhasil ditambahkan!');
    })->name('admin.categories.store');

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
    })->name('admin.categories.update');

    Route::delete('/categories/{id}', function ($id) {
        $category = Category::withCount('articles')->findOrFail($id);

        // Proteksi jika masih ada artikel di dalam kategori ini
        if ($category->articles_count > 0) {
            return redirect()->back()->with('error', 'Kategori tidak dapat dihapus karena masih memiliki artikel terkait.');
        }

        $category->delete();

        return redirect()->back()->with('success', 'Kategori berhasil dihapus!');
    })->name('admin.categories.destroy');
});
