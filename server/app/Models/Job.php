<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Job extends Model
{
    // avoid clashing with Laravel's queue "Jobs" table name conventions in other apps;
    // this model intentionally maps to the "jobs" table used for job POSTINGS in this app.
    protected $table = 'jobs';

    protected $fillable = [
        'company_profile_id',
        'posted_by',
        'title',
        'slug',
        'description',
        'requirements',
        'location',
        'employment_type',
        'work_mode',
        'salary_min',
        'salary_max',
        'salary_currency',
        'skills',
        'status',
        'expires_at',
    ];

    protected $casts = [
        'skills' => 'array',
        'expires_at' => 'datetime',
        'salary_min' => 'float',
        'salary_max' => 'float',
    ];

    public function companyProfile()
    {
        return $this->belongsTo(CompanyProfile::class);
    }

    public function postedBy()
    {
        return $this->belongsTo(User::class, 'posted_by');
    }

    public function applications()
    {
        return $this->hasMany(Application::class);
    }

    public function savedBy()
    {
        return $this->hasMany(SavedJob::class);
    }

    public function scopeOpen($query)
    {
        return $query->where('status', 'open')
            ->where(function ($q) {
                $q->whereNull('expires_at')->orWhere('expires_at', '>', now());
            });
    }
}
