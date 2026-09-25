<?php

namespace Tests\Feature;

use App\Models\CandidateProfile;
use App\Models\CompanyProfile;
use App\Models\User;
use App\Notifications\QueuedVerifyEmail;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\URL;
use Tests\TestCase;

class EmailVerificationTest extends TestCase
{
    use RefreshDatabase;

    public function test_registering_sends_a_verification_email(): void
    {
        Notification::fake();

        $response = $this->postJson('/api/v1/register', [
            'name' => 'Jane Doe',
            'email' => 'jane@example.com',
            'password' => 'Password123',
            'password_confirmation' => 'Password123',
            'role' => 'candidate',
        ]);

        $response->assertCreated()->assertJsonMissing(['token']);

        $user = User::where('email', 'jane@example.com')->firstOrFail();

        Notification::assertSentTo($user, QueuedVerifyEmail::class);
    }

    public function test_unverified_user_cannot_log_in(): void
    {
        $user = User::factory()->unverified()->create([
            'email' => 'jane@example.com',
            'password' => bcrypt('Password123'),
        ]);

        $response = $this->postJson('/api/v1/login', [
            'email' => $user->email,
            'password' => 'Password123',
        ]);

        $response->assertStatus(403)
            ->assertJsonPath('message', 'Please verify your email address before logging in.');
    }

    public function test_verified_user_can_log_in(): void
    {
        $user = User::factory()->create([
            'email' => 'jane@example.com',
            'password' => bcrypt('Password123'),
        ]);

        $response = $this->postJson('/api/v1/login', [
            'email' => $user->email,
            'password' => 'Password123',
        ]);

        $response->assertOk()->assertJsonStructure(['user', 'token']);
    }

    public function test_unverified_candidate_is_blocked_from_verified_only_routes(): void
    {
        $user = User::factory()->unverified()->create(['role' => 'candidate']);
        CandidateProfile::create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->getJson('/api/v1/saved-jobs');

        $response->assertStatus(403)
            ->assertJsonPath('message', 'Forbidden.');
    }

    public function test_unverified_employer_is_blocked_from_verified_only_routes(): void
    {
        $user = User::factory()->unverified()->create(['role' => 'employer']);
        CompanyProfile::create([
            'user_id' => $user->id,
            'company_name' => 'Acme Inc',
            'slug' => 'acme-inc',
        ]);

        $response = $this->actingAs($user)->getJson('/api/v1/my-jobs');

        $response->assertStatus(403)
            ->assertJsonPath('message', 'Forbidden.');
    }

    public function test_verified_candidate_can_access_verified_only_routes(): void
    {
        $user = User::factory()->create(['role' => 'candidate']);
        CandidateProfile::create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->getJson('/api/v1/saved-jobs');

        $response->assertOk();
    }

    public function test_authenticated_user_can_resend_the_verification_email(): void
    {
        Notification::fake();

        $user = User::factory()->unverified()->create();

        $response = $this->actingAs($user)->postJson('/api/v1/email/verification-notification');

        $response->assertOk()
            ->assertJsonPath('message', 'Verification link sent.');

        Notification::assertSentTo($user, QueuedVerifyEmail::class);
    }

    public function test_already_verified_user_does_not_receive_a_duplicate_email(): void
    {
        Notification::fake();

        $user = User::factory()->create();

        $response = $this->actingAs($user)->postJson('/api/v1/email/verification-notification');

        $response->assertOk()
            ->assertJsonPath('message', 'Email already verified.');

        Notification::assertNothingSent();
    }

    public function test_visiting_the_signed_verification_link_verifies_the_email(): void
    {
        $user = User::factory()->unverified()->create();

        $url = URL::temporarySignedRoute(
            'verification.verify',
            now()->addMinutes(60),
            ['id' => $user->id, 'hash' => sha1($user->email)]
        );

        $response = $this->get($url);

        $response->assertStatus(302);
        $location = $response->headers->get('Location');
        $this->assertStringStartsWith('http://localhost:5173/email-verified?status=success&token=', $location);

        $this->assertNotNull($user->fresh()->email_verified_at);
    }

    public function test_visiting_the_signed_verification_link_issues_a_usable_access_token(): void
    {
        $user = User::factory()->unverified()->create();

        $url = URL::temporarySignedRoute(
            'verification.verify',
            now()->addMinutes(60),
            ['id' => $user->id, 'hash' => sha1($user->email)]
        );

        $response = $this->get($url);

        parse_str(parse_url($response->headers->get('Location'), PHP_URL_QUERY), $query);
        $token = $query['token'];

        $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/v1/me')
            ->assertOk()
            ->assertJsonPath('data.email', $user->email);
    }

    public function test_verification_link_with_invalid_hash_does_not_verify_the_email(): void
    {
        $user = User::factory()->unverified()->create();

        $url = URL::temporarySignedRoute(
            'verification.verify',
            now()->addMinutes(60),
            ['id' => $user->id, 'hash' => sha1('someone-else@example.com')]
        );

        $response = $this->get($url);

        $response->assertRedirect('http://localhost:5173/email-verified?status=invalid');

        $this->assertNull($user->fresh()->email_verified_at);
    }
}
