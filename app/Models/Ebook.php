<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Ebook extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'description',
        'author',
        'file_path',
        'file_size',
        'total_pages',
        'cover_image',
        'is_published',
    ];

    protected $casts = [
        'is_published' => 'boolean',
    ];
    
    /**
     * Event Lifecycle Model: Otomatis hapus file PDF & Cover dari storage sebelum data dihapus
     */
    protected static function booted()
    {
        static::deleting(function ($ebook) {
            // 1. Hapus file dokumen PDF dari storage
            if ($ebook->file_path && str_starts_with($ebook->file_path, '/storage/')) {
                $pdfPath = str_replace('/storage/', '', $ebook->file_path);
                if (Storage::disk('public')->exists($pdfPath)) {
                    Storage::disk('public')->delete($pdfPath);
                }
            }

            // 2. Hapus file gambar cover dari storage jika ada
            if ($ebook->cover_image && str_starts_with($ebook->cover_image, '/storage/')) {
                $coverPath = str_replace('/storage/', '', $ebook->cover_image);
                if (Storage::disk('public')->exists($coverPath)) {
                    Storage::disk('public')->delete($coverPath);
                }
            }
        });
    }
}
