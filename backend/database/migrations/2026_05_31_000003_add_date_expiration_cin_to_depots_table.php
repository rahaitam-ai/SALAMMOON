<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasColumn('depots', 'date_expiration_cin')) {
            Schema::table('depots', function (Blueprint $table) {
                $table->date('date_expiration_cin')->nullable()->after('cin');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('depots', 'date_expiration_cin')) {
            Schema::table('depots', function (Blueprint $table) {
                $table->dropColumn('date_expiration_cin');
            });
        }
    }
};
