<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DeleteJobRequest extends FormRequest
{
    public function authorize(): bool
    {
        $user = $this->user();
        $job = $this->route('job');

        return ($user?->isEmployer() || $user?->isAdmin())
            && ($user->isAdmin() || $job?->posted_by === $user->id);
    }

    public function rules(): array
    {
        return [];
    }
}
