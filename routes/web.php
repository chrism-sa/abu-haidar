<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ArticleController;
use App\Http\Controllers\AuthController;
use Inertia\Inertia;
use App\Models\Article;
use App\Models\Category;

/*
|--------------------------------------------------------------------------
| RUTE PUBLIK
|--------------------------------------------------------------------------
*/
Route::get('/', [HomeController::class, 'index'])->name('home');

Route::get('/artikel', function () {
    $articles = Article::with('category')->where('is_published', true)->latest()->get();
    return Inertia::render('Article/Index', [
        'articles' => $articles,
        'title' => 'Semua Artikel'
    ]);
})->name('artikel.index');

Route::get('/artikel/{slug}', [ArticleController::class, 'show'])->name('artikel.show');

Route::get('/kategori/{slug}', function ($slug) {
    $category = Category::where('slug', $slug)->firstOrFail();
    $articles = Article::with('category')->where('category_id', $category->id)->where('is_published', true)->latest()->get();
    
    return Inertia::render('Article/Index', [
        'articles' => $articles,
        'title' => 'Kategori: ' . $category->name
    ]);
})->name('kategori.show');


/*
|--------------------------------------------------------------------------
| RUTE AUTENTIKASI
|--------------------------------------------------------------------------
*/
// Rute ini WAJIB ada agar middleware 'auth' Laravel tidak error 404
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
