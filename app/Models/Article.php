<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;

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
    ];

    /**
     * Relasi ke Kategori
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Relasi ke Quotes (Kutipan Ayat)
     * Gunakan hasOne jika 1 artikel maksimal 1 quote, atau hasMany jika bisa banyak quote
     */
    public function quotes(): HasMany
    {
        return $this->hasMany(Quote::class);
    }

    // Atau relasi singular jika 1 artikel hanya punya 1 quote:
    public function quote(): HasOne
    {
        return $this->hasOne(Quote::class);
    }
}