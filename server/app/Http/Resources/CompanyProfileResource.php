<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CompanyProfileResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'company_name' => $this->company_name,
            'slug' => $this->slug,
            'description' => $this->description,
            'website' => $this->website,
            'logo_path' => $this->logo_path,
            'industry' => $this->industry,
            'company_size' => $this->company_size,
            'location' => $this->location,
        ];
    }
}
