<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('depots') && Schema::hasColumn('depots', 'date_depot')) {
            // Change column to DATETIME NULL to allow missing values without losing existing data.
            // If you prefer a default timestamp instead, replace the statement below with the commented alternative.
            DB::statement("ALTER TABLE `depots` MODIFY `date_depot` DATETIME NULL");

            // Alternative (set default to current timestamp):
            // DB::statement("ALTER TABLE `depots` MODIFY `date_depot` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP");
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('depots') && Schema::hasColumn('depots', 'date_depot')) {
            // Revert to NOT NULL without default (may fail if NULLs exist)
            DB::statement("ALTER TABLE `depots` MODIFY `date_depot` DATETIME NOT NULL");

            // Or revert and set DEFAULT CURRENT_TIMESTAMP if that was previous behaviour
            // DB::statement("ALTER TABLE `depots` MODIFY `date_depot` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP");
        }
    }
};
