<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('quotes', function (Blueprint $table) {
            $table->string('font')->default('font-adobe-naskh')->nullable()->after('reference');
            $table->integer('font_size')->default(36)->nullable()->after('font');
            $table->string('color')->default('#1D4533')->nullable()->after('font_size');
        });
    }

    public function down(): void
    {
        Schema::table('quotes', function (Blueprint $table) {
            $table->dropColumn(['font', 'font_size', 'color']);
        });
    }
};
