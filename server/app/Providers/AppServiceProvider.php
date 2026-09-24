<?php

namespace App\Providers;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        if ($this->app->environment('production')) {
        URL::forceScheme('https');
        }

        Model::preventLazyLoading(!app()->isProduction());

        RateLimiter::for('login', function (Request $request) {
            $email = strtolower((string) $request->input('email'));

            return Limit::perMinute(5)->by($request->ip().'|'.$email);
        });

        RateLimiter::for('register', function (Request $request) {
            return Limit::perMinute(3)->by($request->ip());
        });

        RateLimiter::for('password-reset', function (Request $request) {
            $email = strtolower((string) $request->input('email'));

            return Limit::perMinute(3)->by($request->ip().'|'.$email);
        });

        RateLimiter::for('verification-notification', function (Request $request) {
            $email = strtolower((string) $request->input('email'));

            return Limit::perMinute(3)->by($request->user()?->id ?: $request->ip().'|'.$email);
        });
        }
}
