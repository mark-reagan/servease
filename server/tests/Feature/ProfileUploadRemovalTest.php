<?php

namespace Tests\Feature;

use App\Models\Application;
use App\Models\CandidateProfile;
use App\Models\CompanyProfile;
use App\Models\Job;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ProfileUploadRemovalTest extends TestCase
{
    use RefreshDatabase;

    public function test_employer_can_remove_company_logo(): void
    {
        Storage::fake('public');

        $user = User::factory()->create(['role' => 'employer']);
        $logoPath = 'logos/company.png';
        CompanyProfile::create([
            'user_id' => $user->id,
            'company_name' => 'Example Co',
            'slug' => 'example-co',
            'logo_path' => $logoPath,
        ]);
        Storage::disk('public')->put($logoPath, 'logo');

        $this->actingAs($user)->putJson('/api/v1/profile/company', [
            'remove_logo' => true,
        ])->assertOk()->assertJsonPath('data.logo_path', null);

        Storage::disk('public')->assertMissing($logoPath);
    }

    public function test_candidate_can_remove_profile_resume_when_no_application_uses_it(): void
    {
        Storage::fake('private');

        $user = User::factory()->create(['role' => 'candidate']);
        $resumePath = 'resumes/' . $user->id . '/resume.pdf';
        CandidateProfile::create([
            'user_id' => $user->id,
            'resume_path' => $resumePath,
        ]);
        Storage::disk('private')->put($resumePath, 'resume');

        $this->actingAs($user)->putJson('/api/v1/profile/candidate', [
            'remove_resume' => true,
        ])->assertOk()->assertJsonPath('data.has_resume', false);

        Storage::disk('private')->assertMissing($resumePath);
    }

    public function test_candidate_resume_used_by_application_is_kept_after_profile_removal(): void
    {
        Storage::fake('private');

        $candidate = User::factory()->create(['role' => 'candidate']);
        CandidateProfile::create([
            'user_id' => $candidate->id,
            'resume_path' => 'resumes/' . $candidate->id . '/resume.pdf',
        ]);
        $employer = User::factory()->create(['role' => 'employer']);
        $company = CompanyProfile::create([
            'user_id' => $employer->id,
            'company_name' => 'Example Co',
            'slug' => 'example-co',
        ]);
        $job = Job::create([
            'company_profile_id' => $company->id,
            'posted_by' => $employer->id,
            'title' => 'Developer',
            'slug' => 'developer',
            'description' => 'Build software.',
            'status' => 'open',
        ]);
        $applicationResume = 'resumes/' . $candidate->id . '/application-copy.pdf';
        Application::create([
            'job_id' => $job->id,
            'candidate_id' => $candidate->id,
            'resume_path' => $applicationResume,
            'status' => 'pending',
        ]);
        Storage::disk('private')->put('resumes/' . $candidate->id . '/resume.pdf', 'profile resume');
        Storage::disk('private')->put($applicationResume, 'application resume');

        $this->actingAs($candidate)->putJson('/api/v1/profile/candidate', [
            'remove_resume' => true,
        ])->assertOk()->assertJsonPath('data.has_resume', false);

        Storage::disk('private')->assertExists($applicationResume);
    }
}