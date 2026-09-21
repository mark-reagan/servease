<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\DeleteJobRequest;
use App\Http\Requests\StoreJobRequest;
use App\Http\Resources\JobResource;
use App\Models\Job;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class JobController extends Controller
{
    /**
     * Public job search/listing with basic filters.
     * GET /api/jobs?keyword=&location=&employment_type=&work_mode=&min_salary=&skills[]=
    *
    * @unauthenticated
     */
    public function index(Request $request)
    {
        $query = Job::query()->open()->with('companyProfile')->withCount('applications');

        if ($keyword = $request->query('keyword')) {
            $query->where(function ($q) use ($keyword) {
                $q->where('title', 'like', "%{$keyword}%")
                  ->orWhere('description', 'like', "%{$keyword}%");
            });
        }

        if ($location = $request->query('location')) {
            $query->where('location', 'like', "%{$location}%");
        }

        if ($type = $request->query('employment_type')) {
            $query->where('employment_type', $type);
        }

        if ($mode = $request->query('work_mode')) {
            $query->where('work_mode', $mode);
        }

        if ($minSalary = $request->query('min_salary')) {
            $query->where('salary_max', '>=', $minSalary);
        }

        if ($skills = $request->query('skills')) {
            $skills = is_array($skills) ? $skills : [$skills];
            foreach ($skills as $skill) {
                $query->whereJsonContains('skills', $skill);
            }
        }

        $perPage = min(max($request->integer('per_page', 15), 1), 50);
        $jobs = $query->latest()->paginate($perPage);

        return JobResource::collection($jobs);
    }

    /**
     * Show a public job listing.
     *
     * @unauthenticated
     */
    public function show(Job $job)
    {
        $job->increment('views_count');

        return new JobResource($job->load('companyProfile')->loadCount('applications'));
    }

    /**
     * Employer creates a job posting under their own company profile.
     */
    public function store(StoreJobRequest $request)
    {
        $user = $request->user();
        $companyProfile = $user->companyProfile;

        if (! $companyProfile) {
            return response()->json(['message' => 'You must complete your company profile before posting jobs.'], 422);
        }

        $data = $request->validated();
        $data['company_profile_id'] = $companyProfile->id;
        $data['posted_by'] = $user->id;
        $data['slug'] = Str::slug($data['title']) . '-' . Str::random(6);
        $data['status'] = $data['status'] ?? 'open';

        $job = Job::create($data);

        return new JobResource($job->load('companyProfile'));
    }

    public function update(StoreJobRequest $request, Job $job)
    {
        $job->update($request->validated());

        return new JobResource($job->load('companyProfile'));
    }

    public function destroy(DeleteJobRequest $request, Job $job)
    {
        $job->delete();

        return response()->json(['message' => 'Job deleted.']);
    }

    /**
     * Jobs posted by the authenticated employer (includes drafts/closed).
     */
    public function myJobs(Request $request)
    {
        $jobs = Job::where('posted_by', $request->user()->id)
            ->with('companyProfile')
            ->withCount('applications')
            ->latest()
            ->paginate(15);

        return JobResource::collection($jobs);
    }

}
