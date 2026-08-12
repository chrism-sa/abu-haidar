<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id', 'title', 'slug', 'image', 'description', 'content', 'read_time', 'is_published'
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}