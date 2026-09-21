<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ViewOwnApplicationRequest extends FormRequest
{
    public function authorize(): bool
    {
        $application = $this->route('application');

        return $this->user()?->isCandidate()
            && $application?->candidate_id === $this->user()->id;
    }

    public function rules(): array
    {
        return [];
    }
}