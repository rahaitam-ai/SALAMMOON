<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasColumn('depots', 'heure_depot')) {
            Schema::table('depots', function (Blueprint $table) {
                $table->time('heure_depot')->nullable();
            });
        } else {
            Schema::table('depots', function (Blueprint $table) {
                $table->time('heure_depot')->nullable()->change();
            });
        }
    }

    public function down(): void
    {
        Schema::table('depots', function (Blueprint $table) {
            $table->dropColumn('heure_depot');
        });
    }
};
