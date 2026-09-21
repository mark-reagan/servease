<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ViewJobApplicationsRequest extends FormRequest
{
    public function authorize(): bool
    {
        $job = $this->route('job');

        return $this->user()?->isAdmin()
            || ($this->user()?->isEmployer() && $job?->posted_by === $this->user()->id);
    }

    public function rules(): array
    {
        return [
            'status' => ['sometimes', 'in:pending,reviewed,shortlisted,rejected,hired'],
        ];
    }
}
