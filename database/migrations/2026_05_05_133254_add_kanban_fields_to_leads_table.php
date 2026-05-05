<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('leads', function (Blueprint $table) {
            // Safe checks so it doesn't break your local PC
            if (!Schema::hasColumn('leads', 'status')) {
                $table->string('status')->default('active')->after('stage');
            }
            
            if (!Schema::hasColumn('leads', 'sort_order')) {
                $table->integer('sort_order')->default(0)->after('status');
            }
        });
    }

    public function down(): void
    {
        Schema::table('leads', function (Blueprint $table) {
            $table->dropColumn(['status', 'sort_order']);
        });
    }
};