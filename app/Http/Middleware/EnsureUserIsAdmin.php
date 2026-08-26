<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsAdmin
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // 1. Cek apakah user sudah login
        if (!$request->user()) {
            return redirect()->route('login');
        }

        // 2. Cek apakah user memiliki role admin
        if (!$request->user()->isAdmin()) {
            abort(403, 'Akses ditolak! Anda tidak memiliki izin Administrator.');
        }

        return $next($request);
    }
}