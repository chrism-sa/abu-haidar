<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use App\Models\Article;
use App\Models\Quote;
use Illuminate\Support\Str;

class CleanOrphanedImages extends Command
{
    /**
     * Nama perintah artisan
     */
    protected $signature = 'storage:clean-images';

    /**
     * Deskripsi perintah
     */
    protected $description = 'Membersihkan file gambar sampah di storage yang sudah tidak dipakai di database artikel';

    public function handle()
    {
        $this->info('Memulai pemindaian file sampah di storage...');

        // 1. Kumpulkan semua path file yang BENAR-BENAR aktif di database
        $activeImages = [];

        // A. Sampul dan Konten Artikel
        foreach (Article::all() as $article) {
            if ($article->image && str_starts_with($article->image, '/storage/')) {
                $activeImages[] = str_replace('/storage/', '', $article->image);
            }

            if ($article->content) {
                preg_match_all('/<img[^>]+src="([^">]+)"/i', $article->content, $matches);
                if (!empty($matches[1])) {
                    foreach ($matches[1] as $imgUrl) {
                        if (str_contains($imgUrl, '/storage/')) {
                            $activeImages[] = Str::after($imgUrl, '/storage/');
                        }
                    }
                }
            }
        }

        // B. Gambar Quote
        foreach (Quote::all() as $quote) {
            if ($quote->image && str_starts_with($quote->image, '/storage/')) {
                $activeImages[] = str_replace('/storage/', '', $quote->image);
            }
        }

        // Normalisasi path agar tidak ada duplikasi
        $activeImages = array_unique(array_filter($activeImages));

        // 2. Ambil semua file yang ada di folder storage/app/public
        $allFiles = Storage::disk('public')->allFiles();
        $deletedCount = 0;

        foreach ($allFiles as $file) {
            // Abaikan file sistem seperti .gitignore
            if (Str::endsWith($file, ['.gitignore', '.gitkeep'])) {
                continue;
            }

            // Hanya periksa folder artikel dan quotes
            if (Str::startsWith($file, ['articles', 'quotes'])) {
                if (!in_array($file, $activeImages)) {
                    Storage::disk('public')->delete($file);
                    $this->line("<fg=yellow>Dihapus (file tidak terpakai):</> {$file}");
                    $deletedCount++;
                }
            }
        }

        $this->info("Pembersihan selesai! {$deletedCount} file sampah berhasil dibersihkan dari server.");
    }
}
