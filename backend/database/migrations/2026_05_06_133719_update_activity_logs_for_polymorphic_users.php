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
        Schema::table('activity_logs', function (Blueprint $table) {
            // Drop foreign key if it exists
            $table->dropForeign(['user_id']);
            
            // Add user_type for polymorphic relation
            $table->string('user_type')->nullable()->after('user_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('activity_logs', function (Blueprint $table) {
            $table->dropColumn('user_type');
            $table->foreignId('user_id')->nullable()->change()->constrained()->onDelete('set null');
        });
    }
};
