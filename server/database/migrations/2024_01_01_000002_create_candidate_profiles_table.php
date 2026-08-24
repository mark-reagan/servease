<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('candidate_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->cascadeOnDelete();
            $table->string('headline')->nullable();          // e.g. "Senior Backend Engineer"
            $table->text('bio')->nullable();
            $table->string('location')->nullable();
            $table->json('skills')->nullable();               // ["PHP", "Laravel", "MySQL"]
            $table->string('resume_path')->nullable();         // stored file path
            $table->string('linkedin_url')->nullable();
            $table->string('portfolio_url')->nullable();
            $table->integer('years_experience')->nullable();
            $table->boolean('open_to_work')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('candidate_profiles');
    }
};
