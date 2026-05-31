<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasColumn('depots', 'account_id')) {
            Schema::table('depots', function (Blueprint $table) {
                $table->foreignId('account_id')->nullable()->after('reference_operation')
                    ->constrained('accounts')
                    ->onDelete('cascade');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('depots', 'account_id')) {
            Schema::table('depots', function (Blueprint $table) {
                $table->dropForeign(['account_id']);
                $table->dropColumn('account_id');
            });
        }
    }
};
