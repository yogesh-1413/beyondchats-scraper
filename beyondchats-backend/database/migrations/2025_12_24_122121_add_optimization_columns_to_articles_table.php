<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
   
public function up(): void
{
    Schema::table('articles', function (Blueprint $table) {
        $table->text('ref_content_1')->nullable();
        $table->text('ref_content_2')->nullable();
        $table->text('reference_links')->nullable(); // Keep it here
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('articles', function (Blueprint $table) {
            //
        });
    }
};
