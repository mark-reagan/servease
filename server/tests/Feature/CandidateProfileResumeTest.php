<?php

namespace Tests\Feature;

use App\Models\CandidateProfile;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class CandidateProfileResumeTest extends TestCase
{
    use RefreshDatabase;

    public function test_candidate_can_download_their_profile_resume(): void
    {
        Storage::fake('private');

        $user = User::factory()->create(['role' => 'candidate']);
        CandidateProfile::create([
            'user_id' => $user->id,
            'resume_path' => 'resumes/' . $user->id . '/resume.pdf',
        ]);
        Storage::disk('private')->put('resumes/' . $user->id . '/resume.pdf', 'resume contents');

        $this->actingAs($user)
            ->get('/api/v1/profile/candidate/resume')
            ->assertOk()
            ->assertDownload('resume.pdf');
    }

    public function test_candidate_without_a_profile_resume_receives_not_found(): void
    {
        Storage::fake('private');

        $user = User::factory()->create(['role' => 'candidate']);
        CandidateProfile::create(['user_id' => $user->id]);

        $this->actingAs($user)
            ->getJson('/api/v1/profile/candidate/resume')
            ->assertNotFound()
            ->assertJsonPath('message', 'No resume is attached to this profile.');
    }
}