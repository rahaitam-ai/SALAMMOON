<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('depots')) {
            Schema::create('depots', function (Blueprint $table) {
                $table->id();
                $table->string('reference_operation')->unique();
                $table->foreignId('account_id')->constrained('accounts')->onDelete('cascade');
                $table->string('numero_compte');
                $table->string('rib')->nullable();

                // Depositor info
                $table->string('nom');
                $table->string('prenom');
                $table->string('cin');
                $table->date('date_expiration_cin')->nullable();
                $table->string('adresse')->nullable();

                // Amount
                $table->decimal('montant', 15, 2);

                // Solde tracking
                $table->decimal('ancien_solde', 15, 2)->default(0);
                $table->decimal('nouveau_solde', 15, 2)->default(0);

                // Type (default to especes)
                $table->enum('type_depot', ['especes', 'cheque'])->default('especes');

                // Chèque fields (nullable)
                $table->string('nom_cheque')->nullable();
                $table->string('prenom_cheque')->nullable();
                $table->string('numero_serie_cheque')->nullable();
                $table->date('date_cheque')->nullable();

                $table->foreignId('created_by')->nullable()->constrained('users')->onDelete('set null');
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('depots');
    }
};
