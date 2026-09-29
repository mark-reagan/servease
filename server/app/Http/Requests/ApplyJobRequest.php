<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ApplyJobRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'cover_letter' => ['nullable', 'string', 'max:5000'],
            'resume_choice' => ['sometimes', 'in:profile,upload,none'],
            'resume' => ['nullable', 'required_if:resume_choice,upload', 'file', 'mimes:pdf,doc,docx', 'max:5120'],
        ];
    }
}
