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
        // Use raw SQL to try dropping indexes without errors
        try {
            DB::statement('ALTER TABLE cheques DROP INDEX cheques_numero_cheque_unique');
        } catch (\Exception $e) {
            // Ignore if index doesn't exist
        }
        
        try {
            DB::statement('ALTER TABLE cheques DROP INDEX cheques_numero_cheque_statut_unique');
        } catch (\Exception $e) {
            // Ignore if index doesn't exist
        }
        
        // Also try dropping by column names (Laravel's default naming)
        try {
            DB::statement('ALTER TABLE cheques DROP INDEX numero_cheque_statut_unique');
        } catch (\Exception $e) {
            // Ignore if index doesn't exist
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Restore the unique index if needed (optional)
        try {
            Schema::table('cheques', function (Blueprint $table) {
                $table->unique(['numero_cheque', 'statut']);
            });
        } catch (\Exception $e) {
            // Ignore errors
        }
    }
};
