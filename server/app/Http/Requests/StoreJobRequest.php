<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreJobRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // authorization/role check happens in route middleware
    }

    public function rules(): array
    {
        $jobId = $this->route('job')?->id;

        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'requirements' => ['nullable', 'string'],
            'location' => ['nullable', 'string', 'max:255'],
            'employment_type' => ['required', 'in:full_time,part_time,contract,internship,temporary'],
            'work_mode' => ['required', 'in:on_site,remote,hybrid'],
            'salary_min' => ['nullable', 'numeric', 'min:0'],
            'salary_max' => ['nullable', 'numeric', 'gte:salary_min'],
            'salary_currency' => ['nullable', 'string', 'size:3'],
            'skills' => ['nullable', 'array'],
            'skills.*' => ['string', 'max:100'],
            'status' => ['nullable', 'in:draft,open,closed'],
            'expires_at' => ['nullable', 'date', 'after:now'],
        ];
    }
}
