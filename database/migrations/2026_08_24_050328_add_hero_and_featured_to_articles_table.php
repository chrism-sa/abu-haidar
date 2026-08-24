<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('articles', function (Blueprint $table) {
            $table->boolean('is_hero')->default(false)->after('is_published');
            $table->boolean('is_featured')->default(false)->after('is_hero'); // Pilihan Redaksi
        });
    }

    public function down(): void
    {
        Schema::table('articles', function (Blueprint $table) {
            $table->dropColumn(['is_hero', 'is_featured']);
        });
    }
};
