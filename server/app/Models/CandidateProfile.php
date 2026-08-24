<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CandidateProfile extends Model
{
    protected $fillable = [
        'user_id',
        'headline',
        'bio',
        'location',
        'skills',
        'resume_path',
        'linkedin_url',
        'portfolio_url',
        'years_experience',
        'open_to_work',
    ];

    protected $casts = [
        'skills' => 'array',
        'open_to_work' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
