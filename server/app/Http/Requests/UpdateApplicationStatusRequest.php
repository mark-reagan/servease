<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateApplicationStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        $application = $this->route('application');

        return $this->user()?->isAdmin()
            || ($this->user()?->isEmployer() && $application?->job?->posted_by === $this->user()->id);
    }

    public function rules(): array
    {
        return [
            'status' => ['required', 'in:pending,reviewed,shortlisted,rejected,hired'],
            'employer_notes' => ['nullable', 'string', 'max:2000'],
        ];
    }
}
