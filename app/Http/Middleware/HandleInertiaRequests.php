<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use App\Models\Setting;
use App\Models\Category;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        $sidebarSetting = Setting::where('key', 'sidebar_style')->first();

        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $request->user(),
            ],
            'flash' => [
                'success' => fn() => $request->session()->get('success'),
                'error' => fn() => $request->session()->get('error'),
            ],
            // Bagikan data kategori urutan kustom ke seluruh komponen (Navbar/Footer/Sidebar)
            'categories' => Category::orderByRaw('FIELD(id, 2, 3, 1, 4, 5, 6, 7, 8, 9)')->get(),
            'globalSidebarStyle' => $sidebarSetting ? json_decode($sidebarSetting->value, true) : null,
        ]);
    }
}