<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('clients', function (Blueprint $table) {
            $table->id();
            $table->string('client_number')->unique();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('cin')->unique();
            $table->date('cin_expiration_date');
            $table->string('address');
            $table->string('phone');
            $table->string('email')->nullable();
            $table->foreignId('agency_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('pack_id')->nullable()->constrained()->onDelete('set null');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('accounts', function (Blueprint $table) {
            $table->id();
            $table->string('account_number')->unique();
            $table->foreignId('client_id')->constrained()->onDelete('cascade');
            $table->foreignId('product_id')->nullable()->constrained()->onDelete('set null');
            $table->enum('account_type', ['savings', 'current', 'business'])->default('current');
            $table->decimal('balance', 15, 2)->default(0);
            $table->enum('status', ['active', 'suspended', 'closed'])->default('active');
            $table->date('opening_date');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('accounts');
        Schema::dropIfExists('clients');
    }
};
