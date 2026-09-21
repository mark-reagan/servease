<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateApplicationStatusRequest;
use App\Http\Requests\UpdateJobStatusRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\ApplicationResource;
use App\Http\Resources\JobResource;
use App\Http\Resources\UserResource;
use App\Models\Application;
use App\Models\CandidateProfile;
use App\Models\CompanyProfile;
use App\Models\Job;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class AdminController extends Controller
{
    public function users()
    {
        return UserResource::collection(
            User::with(['candidateProfile', 'companyProfile'])->latest()->paginate(20)
        );
    }

    public function updateUser(UpdateUserRequest $request, User $user)
    {
        $data = $request->validated();

        if ($user->is($request->user())) {
            if (($data['is_active'] ?? true) === false) {
                return response()->json(['message' => 'You cannot deactivate your own account.'], 422);
            }

            if (isset($data['role']) && $data['role'] !== 'admin') {
                return response()->json(['message' => 'You cannot remove your own admin access.'], 422);
            }
        }

        DB::transaction(function () use ($user, $data) {
            $user->update($data);

            if (($data['role'] ?? $user->role) === 'candidate') {
                CandidateProfile::firstOrCreate(['user_id' => $user->id]);
            }

            if (($data['role'] ?? $user->role) === 'employer') {
                CompanyProfile::firstOrCreate(
                    ['user_id' => $user->id],
                    [
                        'company_name' => $user->name,
                        'slug' => Str::slug($user->name) . '-' . Str::random(6),
                    ]
                );
            }
        });

        return new UserResource($user->fresh());
    }

    public function deleteUser(Request $request, User $user)
    {
        if ($user->is($request->user())) {
            return response()->json(['message' => 'You cannot delete your own account.'], 422);
        }

        $user->delete();

        return response()->noContent();
    }

    public function jobs()
    {
        return JobResource::collection(
            Job::with(['companyProfile', 'postedBy'])->withCount('applications')->latest()->paginate(20)
        );
    }

    public function updateJobStatus(UpdateJobStatusRequest $request, Job $job)
    {
        $data = $request->validated();

        $job->update($data);

        return new JobResource($job->fresh()->load('companyProfile')->loadCount('applications'));
    }

    public function deleteJob(Job $job)
    {
        $job->delete();

        return response()->noContent();
    }

    public function applications()
    {
        return ApplicationResource::collection(
            Application::with(['job.companyProfile', 'candidate.candidateProfile'])->latest()->paginate(20)
        );
    }

    public function updateApplicationStatus(UpdateApplicationStatusRequest $request, Application $application)
    {
        $data = $request->validated();

        $application->update($data);

        return new ApplicationResource($application->fresh()->load('job.companyProfile', 'candidate.candidateProfile'));
    }

    public function deleteApplication(Application $application)
    {
        $application->delete();

        return response()->noContent();
    }
}