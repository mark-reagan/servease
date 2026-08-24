<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class JobResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'description' => $this->description,
            'requirements' => $this->requirements,
            'location' => $this->location,
            'employment_type' => $this->employment_type,
            'work_mode' => $this->work_mode,
            'salary_min' => $this->salary_min,
            'salary_max' => $this->salary_max,
            'salary_currency' => $this->salary_currency,
            'skills' => $this->skills,
            'status' => $this->status,
            'expires_at' => $this->expires_at,
            'views_count' => $this->views_count,
            'company' => [
                'id' => $this->companyProfile?->id,
                'name' => $this->companyProfile?->company_name,
                'logo_path' => $this->companyProfile?->logo_path,
                'location' => $this->companyProfile?->location,
            ],
            'applications_count' => $this->whenCounted('applications'),
            'created_at' => $this->created_at,
        ];
    }
}
