<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ApplyJobRequest;
use App\Http\Resources\ApplicationResource;
use App\Models\Application;
use App\Models\Job;
use Illuminate\Http\Request;

class ApplicationController extends Controller
{
    /**
     * Candidate applies to a job.
     */
    public function apply(ApplyJobRequest $request, Job $job)
    {
        $user = $request->user();

        if ($job->status !== 'open') {
            return response()->json(['message' => 'This job is not accepting applications.'], 422);
        }

        $existing = Application::where('job_id', $job->id)
            ->where('candidate_id', $user->id)
            ->first();

        if ($existing) {
            return response()->json(['message' => 'You have already applied to this job.'], 409);
        }

        $resumePath = $user->candidateProfile?->resume_path;

        if ($request->hasFile('resume')) {
            $resumePath = $request->file('resume')->store('resumes/' . $user->id, 'private');
        }

        $application = Application::create([
            'job_id' => $job->id,
            'candidate_id' => $user->id,
            'cover_letter' => $request->validated('cover_letter'),
            'resume_path' => $resumePath,
            'status' => 'pending',
        ]);

        return new ApplicationResource($application->load('job.companyProfile'));
    }

    /**
     * Candidate's own applications.
     */
    public function myApplications(Request $request)
    {
        $applications = Application::where('candidate_id', $request->user()->id)
            ->with('job.companyProfile')
            ->latest()
            ->paginate(15);

        return ApplicationResource::collection($applications);
    }

    /**
     * Employer views applicants for one of their job postings.
     */
    public function forJob(Request $request, Job $job)
    {
        abort_unless(
            $job->posted_by === $request->user()->id || $request->user()->isAdmin(),
            403,
            'You do not own this job posting.'
        );

        $applications = $job->applications()
            ->with('candidate.candidateProfile')
            ->when($request->query('status'), fn ($q, $status) => $q->where('status', $status))
            ->latest()
            ->paginate(20);

        return ApplicationResource::collection($applications);
    }

    /**
     * Employer updates an application's status (reviewed/shortlisted/rejected/hired).
     */
    public function updateStatus(Request $request, Application $application)
    {
        $job = $application->job;

        abort_unless(
            $job->posted_by === $request->user()->id || $request->user()->isAdmin(),
            403,
            'You do not own this job posting.'
        );

        $data = $request->validate([
            'status' => ['required', 'in:pending,reviewed,shortlisted,rejected,hired'],
            'employer_notes' => ['nullable', 'string', 'max:2000'],
        ]);

        $application->update($data);

        return new ApplicationResource($application->load('job.companyProfile', 'candidate.candidateProfile'));
    }

    /**
     * Candidate withdraws their own application.
     */
    public function withdraw(Request $request, Application $application)
    {
        abort_unless($application->candidate_id === $request->user()->id, 403);

        $application->delete();

        return response()->json(['message' => 'Application withdrawn.']);
    }
}
