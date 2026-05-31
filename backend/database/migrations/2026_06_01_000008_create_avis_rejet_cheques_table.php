<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('avis_rejet_cheques', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cheque_id')->constrained('cheques')->onDelete('cascade');
            $table->string('motif');
            $table->string('pdf_path');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('avis_rejet_cheques');
    }
};
