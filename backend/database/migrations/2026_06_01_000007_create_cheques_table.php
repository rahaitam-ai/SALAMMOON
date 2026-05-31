<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cheques', function (Blueprint $table) {
            $table->id();
            $table->foreignId('retrait_id')->nullable()->constrained('retraits')->onDelete('cascade');
            $table->string('numero_cheque')->unique();
            $table->foreignId('account_id')->constrained('accounts')->onDelete('cascade');
            $table->string('beneficiaire_nom');
            $table->string('beneficiaire_prenom');
            $table->string('beneficiaire_cin');
            $table->date('beneficiaire_cin_expiration')->nullable();
            $table->decimal('montant', 15, 2);
            $table->enum('statut', ['paye', 'rejete'])->default('paye');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cheques');
    }
};
