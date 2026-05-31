<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasColumn('depots', 'created_by')) {
            Schema::table('depots', function (Blueprint $table) {
                $table->foreignId('created_by')->nullable()->after('date_cheque')
                    ->constrained('users')
                    ->onDelete('set null');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('depots', 'created_by')) {
            Schema::table('depots', function (Blueprint $table) {
                $table->dropForeign(['created_by']);
                $table->dropColumn('created_by');
            });
        }
    }
};
