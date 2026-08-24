<?php

/** @noinspection PhpUndefinedClassInspection */
use Illuminate\Foundation\Application;

/** @noinspection PhpUndefinedTypeInspection */
return Application::configure(basePath: dirname(__DIR__)) // @intelephense-ignore-line
    ->withRouting(
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function ($middleware): void {
            $middleware->alias([
                'role' => 'App\\Http\\Middleware\\EnsureUserRole',
    ]);
    })
    ->withExceptions(function ($exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn ($request) => $request->is('api/*') || $request->expectsJson(),
        );
    })->create();
