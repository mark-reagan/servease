<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DownloadApplicationResumeRequest extends FormRequest
{
    public function authorize(): bool
    {
        $application = $this->route('application');

        if (! $application) {
            return false;
        }

        $user = $this->user();

        return $user?->isAdmin()
            || $application->candidate_id === $user?->id
            || ($user?->isEmployer() && $application->job?->posted_by === $user->id);
    }

    public function rules(): array
    {
        return [];
    }
}
