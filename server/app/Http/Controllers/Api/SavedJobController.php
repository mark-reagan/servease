<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\JobResource;
use App\Models\Job;
use App\Models\SavedJob;
use Illuminate\Http\Request;

class SavedJobController extends Controller
{
    public function index(Request $request)
    {
        $jobs = Job::whereHas('savedBy', fn ($q) => $q->where('candidate_id', $request->user()->id))
            ->with('companyProfile')
            ->paginate(15);

        return JobResource::collection($jobs);
    }

    public function store(Request $request, Job $job)
    {
        SavedJob::firstOrCreate([
            'job_id' => $job->id,
            'candidate_id' => $request->user()->id,
        ]);

        return response()->json(['message' => 'Job saved.']);
    }

    public function destroy(Request $request, Job $job)
    {
        SavedJob::where('job_id', $job->id)
            ->where('candidate_id', $request->user()->id)
            ->delete();

        return response()->json(['message' => 'Job removed from saved list.']);
    }
}
