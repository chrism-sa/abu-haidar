<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Throwable;
use Inertia\Inertia; // Wajib ditambahkan untuk memanggil React

class Handler extends ExceptionHandler
{
    /**
     * The list of the inputs that are never flashed to the session on validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     */
    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }

    /**
     * Menyiapkan custom render untuk SEMUA HTTP Exceptions via Inertia React.
     */
    public function render($request, Throwable $e)
    {
        $response = parent::render($request, $e);
        $status = $response->getStatusCode();

        // 1. Abaikan error spesifik ini agar fungsi Autentikasi dan Validasi Form tidak rusak
        $ignoredStatuses = [401, 422];

        // 2. Tangkap SEMUA error (kode 400 ke atas) selain yang diabaikan di atas
        if ($status >= 400 && !in_array($status, $ignoredStatuses)) {
            
            // 3. Jika aplikasi sedang di mode "local" (tahap development), 
            // biarkan error 500 ke atas (server error) tetap muncul bawaan Laravel agar mudah dicari bug-nya.
            if (app()->environment('local') && $status >= 500) {
                return $response;
            }

            // 4. Tampilkan halaman custom Error.tsx untuk SEMUA jenis error sisanya
            return Inertia::render('Error', ['status' => $status])
                ->toResponse($request)
                ->setStatusCode($status);
        }

        return $response;
    }
}