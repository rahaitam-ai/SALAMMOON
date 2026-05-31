<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('retraits')) {
            Schema::dropIfExists('retraits');
        }
        Schema::create('retraits', function (Blueprint $table) {
            $table->id();
            $table->foreignId('account_id')->constrained('accounts')->onDelete('cascade');
            $table->enum('type_retrait', ['personnel', 'cheque'])->default('personnel');
            $table->decimal('montant', 15, 2);
            $table->decimal('solde_avant', 15, 2);
            $table->decimal('solde_apres', 15, 2);
            $table->foreignId('guichetier_id')->nullable()->constrained('users')->onDelete('set null');
            $table->dateTime('date_operation')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('retraits');
    }
};
