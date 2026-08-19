<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $request->user(),
            ],
            // Bagikan data kategori dengan urutan kustom ke seluruh komponen global (Navbar/Footer)
            'categories' => \App\Models\Category::orderByRaw('FIELD(id, 2, 3, 1, 4, 5, 6, 7, 8, 9)')->get(),
        ]);
    }
}