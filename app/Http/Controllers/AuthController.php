<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AuthController extends Controller
{
    public function showLoginForm()
    {
        // Akan memanggil file resources/js/Pages/Auth/Login.tsx
        return Inertia::render('Auth/Login');
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (Auth::attempt($credentials, $request->boolean('remember'))) {
            $request->session()->regenerate();

            // Arahkan langsung ke dashboard admin
            return redirect()->intended(route('admin.dashboard'));
        }

        return back()->withErrors([
            'email' => 'Email atau password salah.',
        ]);
    }

    public function logout(Request $request)
    {
        Auth::logout();

        // Menghapus isi session dan invalidate sesi aktif
        $request->session()->invalidate();

        // Regenerasi token CSRF baru agar form login berikutnya tidak expired
        $request->session()->regenerateToken();

        // Menggunakan redirect biasa yang dipaksa reload penuh oleh browser
        return redirect('/home')->header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
    }
}
