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
        Schema::table('guichetiers', function (Blueprint $table) {
            $table->string('email')->unique()->after('numero_guichetier');
            $table->string('password')->after('email');
            $table->boolean('must_change_password')->default(true)->after('password');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('guichetiers', function (Blueprint $table) {
            $table->dropColumn(['email', 'password', 'must_change_password']);
        });
    }
};
