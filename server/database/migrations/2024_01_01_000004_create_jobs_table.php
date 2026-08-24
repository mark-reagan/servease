<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('jobs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_profile_id')->constrained()->cascadeOnDelete();
            $table->foreignId('posted_by')->constrained('users')->cascadeOnDelete(); // employer user who created it
            $table->string('title');
            $table->string('slug');
            $table->text('description');
            $table->text('requirements')->nullable();
            $table->string('location')->nullable();
            $table->enum('employment_type', ['full_time', 'part_time', 'contract', 'internship', 'temporary'])->default('full_time');
            $table->enum('work_mode', ['on_site', 'remote', 'hybrid'])->default('on_site');
            $table->decimal('salary_min', 10, 2)->nullable();
            $table->decimal('salary_max', 10, 2)->nullable();
            $table->string('salary_currency', 3)->default('USD');
            $table->json('skills')->nullable(); // required skills, used for matching/search
            $table->enum('status', ['draft', 'open', 'closed'])->default('open');
            $table->timestamp('expires_at')->nullable();
            $table->unsignedInteger('views_count')->default(0);
            $table->timestamps();

            $table->index(['status', 'location']);
            $table->index('employment_type');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('jobs');
    }
};
