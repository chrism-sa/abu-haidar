<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Quote extends Model
{
    use HasFactory;

    protected $fillable = ['arabic', 'translation', 'reference', 'article_id'];

    // Relasi ke Artikel
    public function article()
    {
        return $this->belongsTo(Article::class);
    }
}