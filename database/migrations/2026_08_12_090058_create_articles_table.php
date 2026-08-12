<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('articles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->string('slug')->unique(); // Untuk URL artikel
            $table->string('image'); // Path/URL gambar thumbnail
            $table->text('description'); // Deskripsi singkat
            $table->longText('content'); // Isi artikel lengkap
            $table->integer('read_time'); // Estimasi waktu baca (dalam menit)
            $table->boolean('is_published')->default(true); // Status Draft/Published
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('articles');
    }
};