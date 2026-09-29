<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateCandidateProfileRequest;
use App\Http\Requests\UpdateCompanyProfileRequest;
use App\Http\Resources\CandidateProfileResource;
use App\Http\Resources\CompanyProfileResource;
use App\Models\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
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
        $oldResumePath = $profile->resume_path;

        if ($request->hasFile('resume')) {
            $data['resume_path'] = $request->file('resume')->store('resumes/' . $user->id, 'private');
        } elseif (! empty($data['remove_resume'])) {
            $data['resume_path'] = null;
        }

        unset($data['resume']);
        unset($data['remove_resume']);

        $profile->update($data);

        if ($oldResumePath && $oldResumePath !== $profile->resume_path) {
            $resumeStillInUse = Application::where('resume_path', $oldResumePath)->exists();
            if (! $resumeStillInUse) {
                Storage::disk('private')->delete($oldResumePath);
            }
        }

        return new CandidateProfileResource($profile->fresh());
    }

    /**
     * Candidate downloads the resume stored on their own profile.
     */
    public function downloadCandidateResume(Request $request)
    {
        $profile = $request->user()->candidateProfile;

        if (! $profile?->resume_path || ! Storage::disk('private')->exists($profile->resume_path)) {
            return response()->json(['message' => 'No resume is attached to this profile.'], 404);
        }

        return Storage::disk('private')->download($profile->resume_path);
    }

    /**
     * Employer updates their company profile.
     */
    public function updateCompanyProfile(UpdateCompanyProfileRequest $request)
    {
        $user = $request->user();
        $data = $request->validated();

        $profile = $user->companyProfile;
        $oldLogoPath = $profile->logo_path;

        if (isset($data['company_name']) && $data['company_name'] !== $profile->company_name) {
            $profile->slug = Str::slug($data['company_name']) . '-' . Str::random(6);
        }

        if ($request->hasFile('logo')) {
            $data['logo_path'] = $request->file('logo')->store('logos', 'public');
        } elseif (! empty($data['remove_logo'])) {
            $data['logo_path'] = null;
        }

        unset($data['logo']);
        unset($data['remove_logo']);

        $profile->update($data);

        if ($oldLogoPath && $oldLogoPath !== $profile->logo_path) {
            Storage::disk('public')->delete($oldLogoPath);
        }

        return new CompanyProfileResource($profile->fresh());
    }
}
