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
            $table->unsignedBigInteger('guichetier_id')->nullable()->after('agency_id');
            $table->string('guichetier_type')->nullable()->after('guichetier_id');
            $table->index(['guichetier_id', 'guichetier_type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('clients', function (Blueprint $table) {
            $table->dropColumn(['guichetier_id', 'guichetier_type']);
        });
    }
};
