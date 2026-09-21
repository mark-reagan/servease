<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CandidateProfileResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'headline' => $this->headline,
            'bio' => $this->bio,
            'location' => $this->location,
            'skills' => $this->skills,
            'linkedin_url' => $this->linkedin_url,
            'portfolio_url' => $this->portfolio_url,
            'years_experience' => $this->years_experience,
            'open_to_work' => $this->open_to_work,
            'has_resume' => filled($this->resume_path),
        ];
    }
}
