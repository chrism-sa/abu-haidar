<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;

// Controllers
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ArticleController;
use App\Http\Controllers\AuthController;

// Models
use App\Models\Article;
use App\Models\Category;

/*
|--------------------------------------------------------------------------
| RUTE PUBLIK
|--------------------------------------------------------------------------
*/
Route::get('/', [HomeController::class, 'index'])->name('home');

// 1. Rute Arsip Semua Artikel & Pencarian
Route::get('/artikel', function (Request $request) {
    $search = $request->query('search');
    
    $articles = Article::with('category')
        ->where('is_published', true)
        ->when($search, function ($query, $search) {
            $query->where(function($q) use ($search) {
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

// 2. Rute Berdasarkan Kategori
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
| API PENCARIAN REAL-TIME (Header Dropdown)
|--------------------------------------------------------------------------
*/
Route::get('/api/articles/search', function (Request $request) {
    $keyword = $request->query('q');
    
    $articles = Article::where('is_published', true)
        ->when($keyword, function($query, $keyword) {
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
    
    // --- 1. DASHBOARD UTAMA ---
    Route::get('/dashboard', function () {
        // Cek koneksi Database
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

    // --- 2. KELOLA ARTIKEL ---
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

    Route::post('/articles', function (Request $request) {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048', // Diubah jadi file upload
            'description' => 'nullable|string',
            'content' => 'required|string',
            'read_time' => 'required|integer',
        ]);

        // Otomatis buat slug dan set status terbit
        $validated['slug'] = Str::slug($validated['title']);
        $validated['is_published'] = true;

        // Tangani Upload Gambar Lokal
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('articles', 'public');
            $validated['image'] = '/storage/' . $imagePath;
        } else {
            $validated['image'] = 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?q=80&w=1200&auto=format&fit=crop';
        }

        Article::create($validated);

        return redirect()->route('admin.articles.index')->with('success', 'Artikel berhasil dipublikasikan!');
    })->name('admin.articles.store');

    Route::delete('/articles/{id}', function ($id) {
        $article = Article::findOrFail($id);
        $article->delete();

        return redirect()->route('admin.articles.index')->with('success', 'Artikel berhasil dihapus!');
    })->name('admin.articles.destroy');

    // --- 3. KELOLA KATEGORI (Persiapan untuk besok) ---
    Route::get('/categories', function () {
        return Inertia::render('Admin/Categories/Index', [
            'categories' => Category::latest()->get()
        ]);
    })->name('admin.categories.index');

});