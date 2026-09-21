<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateCandidateProfileRequest;
use App\Http\Requests\UpdateCompanyProfileRequest;
use App\Http\Resources\CandidateProfileResource;
use App\Http\Resources\CompanyProfileResource;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProfileController extends Controller
{
    /**
     * Candidate updates their own profile (headline, bio, skills, resume, etc).
     */
    public function updateCandidateProfile(UpdateCandidateProfileRequest $request)
    {
        $user = $request->user();
        $data = $request->validated();

        $profile = $user->candidateProfile;

        if ($request->hasFile('resume')) {
            $data['resume_path'] = $request->file('resume')->store('resumes/' . $user->id, 'private');
        }

        unset($data['resume']);

        $profile->update($data);

        return new CandidateProfileResource($profile->fresh());
    }

    /**
     * Employer updates their company profile.
     */
    public function updateCompanyProfile(UpdateCompanyProfileRequest $request)
    {
        $user = $request->user();
        $data = $request->validated();

        $profile = $user->companyProfile;

        if (isset($data['company_name']) && $data['company_name'] !== $profile->company_name) {
            $profile->slug = Str::slug($data['company_name']) . '-' . Str::random(6);
        }

        if ($request->hasFile('logo')) {
            $data['logo_path'] = $request->file('logo')->store('logos', 'public');
        }

        unset($data['logo']);

        $profile->update($data);

        return new CompanyProfileResource($profile->fresh());
    }
}
