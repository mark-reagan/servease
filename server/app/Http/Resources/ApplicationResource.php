<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ApplicationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'status' => $this->status,
            'cover_letter' => $this->cover_letter,
            'resume_path' => $this->resume_path,
            'employer_notes' => $this->when(
                $request->user()?->isEmployer() || $request->user()?->isAdmin(),
                $this->employer_notes
            ),
            'job' => [
                'id' => $this->job?->id,
                'title' => $this->job?->title,
                'company' => $this->job?->companyProfile?->company_name,
            ],
            'candidate' => $this->when(
                $request->user()?->isEmployer() || $request->user()?->isAdmin(),
                fn () => [
                    'id' => $this->candidate?->id,
                    'name' => $this->candidate?->name,
                    'email' => $this->candidate?->email,
                    'headline' => $this->candidate?->candidateProfile?->headline,
                ]
            ),
            'created_at' => $this->created_at,
        ];
    }
}
