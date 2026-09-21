<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CompanyProfileResource;
use App\Http\Resources\JobResource;
use App\Models\CompanyProfile;

class CompanyController extends Controller
{
    /**
     * Public company profile page with its open jobs.
     * GET /api/companies/{slug}
    *
    * @unauthenticated
     */
    public function show(string $slug)
    {
        $company = CompanyProfile::where('slug', $slug)->firstOrFail();

        $openJobs = $company->jobs()->open()->latest()->paginate(15);

        return response()->json([
            'company' => new CompanyProfileResource($company),
            'open_jobs' => JobResource::collection($openJobs),
        ]);
    }
}
