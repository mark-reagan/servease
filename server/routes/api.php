<?php

use App\Http\Controllers\Api\ApplicationController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CompanyController;
use App\Http\Controllers\Api\EmailVerificationController;
use App\Http\Controllers\Api\JobController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\SavedJobController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
/*
|--------------------------------------------------------------------------
| Public routes
|--------------------------------------------------------------------------
*/
Route::post('/register', [AuthController::class, 'register'])->middleware('throttle:register');
Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:login');
Route::post('/forgot-password', [AuthController::class, 'forgotPassword'])->middleware('throttle:password-reset');
Route::post('/reset-password', [AuthController::class, 'resetPassword'])->middleware('throttle:password-reset');

Route::get('/reset-password', function () {
    return redirect(env('FRONTEND_URL', 'http://localhost:5173') . '/reset-password' . (request()->getQueryString() ? '?' . request()->getQueryString() : ''));
})->name('password.reset');

Route::get('/email/verify/{id}/{hash}', [EmailVerificationController::class, 'verify'])
    ->middleware('signed')
    ->name('verification.verify');

Route::post('/email/verification-notification/resend', [EmailVerificationController::class, 'resendByEmail'])
    ->middleware('throttle:verification-notification');

Route::apiResource('jobs', JobController::class)->only(['index', 'show']);
Route::get('/companies/{slug}', [CompanyController::class, 'show']);

/*
|--------------------------------------------------------------------------
| Authenticated routes (any logged-in user)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::put('/account', [AuthController::class, 'updateAccount']);
	Route::delete('/account', [AuthController::class, 'deleteAccount']);
    Route::post('/email/verification-notification', [EmailVerificationController::class, 'resend'])
        ->middleware('throttle:verification-notification');

    Route::get('/applications/{application}/resume', [ApplicationController::class, 'downloadResume']);

    /*
    |----------------------------------------------------------------------
    | Candidate-only routes
    |----------------------------------------------------------------------
    */
    Route::middleware(['role:candidate', 'verified'])->group(function () {
        Route::put('/profile/candidate', [ProfileController::class, 'updateCandidateProfile']);

        Route::post('/jobs/{job}/apply', [ApplicationController::class, 'apply']);
        Route::get('/applications', [ApplicationController::class, 'myApplications']);
        Route::get('/applications/{application}', [ApplicationController::class, 'show']);
        Route::delete('/applications/{application}', [ApplicationController::class, 'withdraw']);

        Route::get('/saved-jobs', [SavedJobController::class, 'index']);
        Route::post('/jobs/{job}/save', [SavedJobController::class, 'store']);
        Route::delete('/jobs/{job}/save', [SavedJobController::class, 'destroy']);
    });

    /*
    |----------------------------------------------------------------------
    | Employer-only routes
    |----------------------------------------------------------------------
    */
    Route::middleware(['role:employer', 'verified'])->group(function () {
        Route::put('/profile/company', [ProfileController::class, 'updateCompanyProfile']);

        Route::get('/my-jobs', [JobController::class, 'myJobs']);
        Route::apiResource('jobs', JobController::class)->only(['store', 'update', 'destroy']);

        Route::get('/jobs/{job}/applications', [ApplicationController::class, 'forJob']);
        Route::patch('/applications/{application}', [ApplicationController::class, 'updateStatus']);
    });

});
});
