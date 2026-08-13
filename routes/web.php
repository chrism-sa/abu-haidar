<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ArticleController;
use App\Http\Controllers\AuthController;
use Inertia\Inertia;
use App\Models\Article;
use App\Models\Category;
use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| RUTE PUBLIK
|--------------------------------------------------------------------------
*/
Route::get('/', [HomeController::class, 'index'])->name('home');

// 1. Rute Arsip Semua Artikel & Pencarian (Hanya 1 ini saja!)
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

// 2. Rute Berdasarkan Kategori (Hanya 1 ini saja!)
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
| RUTE AUTENTIKASI
|--------------------------------------------------------------------------
*/
Route::get('/login', [AuthController::class, 'showLoginForm'])->name('login')->middleware('guest');
Route::post('/login', [AuthController::class, 'login'])->middleware('guest');
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');


/*
|--------------------------------------------------------------------------
| RUTE ADMIN (Dashboard)
|--------------------------------------------------------------------------
*/
Route::middleware('auth')->prefix('admin')->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Admin/Dashboard', [
            'auth' => [
                'user' => auth()->user()
            ]
        ]); 
    })->name('admin.dashboard');
});


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