<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasColumn('depots', 'compte_id')) {
            Schema::table('depots', function (Blueprint $table) {
                $table->dropForeign(['compte_id']);
                $table->dropColumn('compte_id');
            });
        }
    }

    public function down(): void
    {
        if (!Schema::hasColumn('depots', 'compte_id')) {
            Schema::table('depots', function (Blueprint $table) {
                $table->foreignId('compte_id')->nullable()->after('reference_operation')
                    ->constrained('accounts')
                    ->onDelete('cascade');
            });
        }
    }
};
