<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class Article extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id',
        'title',
        'slug',
        'image',
        'description',
        'content',
        'is_published',
        'is_hero',
        'is_featured',
    ];

    protected $casts = [
        'is_published' => 'boolean',
        'is_hero' => 'boolean',
        'is_featured' => 'boolean',
    ];

    /**
     * Relasi ke Category
     */
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Relasi ke Quotes
     */
    public function quotes()
    {
        return $this->hasMany(Quote::class);
    }

    /**
     * Event Lifecycle Model: Otomatis hapus semua file terkait dari storage saat artikel dihapus
     */
    protected static function booted()
    {
        static::deleting(function ($article) {
            // 1. Hapus gambar sampul artikel jika tersimpan di disk public storage
            if ($article->image && str_starts_with($article->image, '/storage/')) {
                $coverPath = str_replace('/storage/', '', $article->image);
                if (Storage::disk('public')->exists($coverPath)) {
                    Storage::disk('public')->delete($coverPath);
                }
            }

            // 2. Scan & Hapus semua gambar editor yang disisipkan di dalam teks HTML artikel (content)
            if ($article->content) {
                preg_match_all('/<img[^>]+src="([^">]+)"/i', $article->content, $matches);
                if (!empty($matches[1])) {
                    foreach ($matches[1] as $imgUrl) {
                        if (str_contains($imgUrl, '/storage/')) {
                            $mediaPath = Str::after($imgUrl, '/storage/');
                            if ($mediaPath && Storage::disk('public')->exists($mediaPath)) {
                                Storage::disk('public')->delete($mediaPath);
                            }
                        }
                    }
                }
            }

            // 3. Hapus file gambar quote terkait & hapus data quote-nya
            foreach ($article->quotes as $quote) {
                if ($quote->image && str_starts_with($quote->image, '/storage/')) {
                    $quotePath = str_replace('/storage/', '', $quote->image);
                    if (Storage::disk('public')->exists($quotePath)) {
                        Storage::disk('public')->delete($quotePath);
                    }
                }
                $quote->delete();
            }
        });
    }
}