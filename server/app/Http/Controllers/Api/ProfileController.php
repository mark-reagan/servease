<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProfileController extends Controller
{
    /**
     * Candidate updates their own profile (headline, bio, skills, resume, etc).
     */
    public function updateCandidateProfile(Request $request)
    {
        $user = $request->user();
        abort_unless($user->isCandidate(), 403, 'Only candidates have a candidate profile.');

        $data = $request->validate([
            'headline' => ['nullable', 'string', 'max:255'],
            'bio' => ['nullable', 'string', 'max:5000'],
            'location' => ['nullable', 'string', 'max:255'],
            'skills' => ['nullable', 'array'],
            'skills.*' => ['string', 'max:100'],
            'linkedin_url' => ['nullable', 'url'],
            'portfolio_url' => ['nullable', 'url'],
            'years_experience' => ['nullable', 'integer', 'min:0', 'max:60'],
            'open_to_work' => ['nullable', 'boolean'],
            'resume' => ['nullable', 'file', 'mimes:pdf,doc,docx', 'max:5120'],
        ]);

        $profile = $user->candidateProfile;

        if ($request->hasFile('resume')) {
            $data['resume_path'] = $request->file('resume')->store('resumes/' . $user->id, 'private');
        }

        $profile->update($data);

        return response()->json($profile->fresh());
    }

    /**
     * Employer updates their company profile.
     */
    public function updateCompanyProfile(Request $request)
    {
        $user = $request->user();
        abort_unless($user->isEmployer(), 403, 'Only employers have a company profile.');

        $data = $request->validate([
            'company_name' => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:5000'],
            'website' => ['nullable', 'url'],
            'industry' => ['nullable', 'string', 'max:255'],
            'company_size' => ['nullable', 'string', 'max:50'],
            'location' => ['nullable', 'string', 'max:255'],
            'logo' => ['nullable', 'image', 'max:2048'],
        ]);

        $profile = $user->companyProfile;

        if (isset($data['company_name']) && $data['company_name'] !== $profile->company_name) {
            $profile->slug = Str::slug($data['company_name']) . '-' . Str::random(6);
        }

        if ($request->hasFile('logo')) {
            $data['logo_path'] = $request->file('logo')->store('logos', 'public');
        }

        $profile->update($data);

        return response()->json($profile->fresh());
    }
}
