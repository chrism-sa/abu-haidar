<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Home');
});

Route::get('/artikel/{slug}', function (string $slug) {
    return Inertia::render('Article/Show', [
        'slug' => $slug,
    ]);
})->name('article.show');