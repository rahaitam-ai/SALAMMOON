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
        Schema::table('clients', function (Blueprint $table) {
            // Disable foreign key checks to allow dropping
            DB::statement('SET FOREIGN_KEY_CHECKS=0;');
            $table->dropColumn('agency_id');
            DB::statement('SET FOREIGN_KEY_CHECKS=1;');
        });

        Schema::table('clients', function (Blueprint $table) {
            $table->foreignId('agency_id')->after('email')->constrained('agences')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('clients', function (Blueprint $table) {
            DB::statement('SET FOREIGN_KEY_CHECKS=0;');
            $table->dropColumn('agency_id');
            DB::statement('SET FOREIGN_KEY_CHECKS=1;');
        });

        Schema::table('clients', function (Blueprint $table) {
            $table->foreignId('agency_id')->after('email')->constrained('users')->onDelete('cascade');
        });
    }
};
