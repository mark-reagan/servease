<?php

/** @noinspection PhpUndefinedClassInspection */
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Foundation\Application;
use Illuminate\Http\JsonResponse;
/** @noinspection PhpUndefinedClassInspection */
use Illuminate\Http\Request;
/** @noinspection PhpUndefinedClassInspection */
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;

/** @noinspection PhpUndefinedTypeInspection */
return Application::configure(basePath: dirname(__DIR__)) // @intelephense-ignore-line
    ->withRouting(
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function ($middleware): void {
            // Trust Cloudflare/Render's edge proxies so signed URLs and HTTPS detection use the real scheme/host.
            $middleware->trustProxies(at: '*');

            $middleware->alias([
                'role' => 'App\\Http\\Middleware\\EnsureUserRole',
    ]);
    })
    ->withExceptions(function ($exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn ($request) => $request->is('api/*') || $request->expectsJson(),
        );

        $exceptions->render(function (Throwable $exception, Request $request): ?JsonResponse {
            if (! $request->is('api/*') && ! $request->expectsJson()) {
                return null;
            }

            $status = match (true) {
                $exception instanceof ValidationException => 422,
                $exception instanceof AuthenticationException => 401,
                $exception instanceof AuthorizationException => 403,
                $exception instanceof HttpExceptionInterface => $exception->getStatusCode(),
                default => 500,
            };

            $payload = [
                'message' => match ($status) {
                    401 => 'Unauthenticated.',
                    403 => 'Forbidden.',
                    404 => 'Resource not found.',
                    422 => 'The given data was invalid.',
                    default => $status >= 500 ? 'Server error.' : ($exception->getMessage() ?: 'Request failed.'),
                },
            ];

            if ($exception instanceof ValidationException) {
                $payload['errors'] = $exception->errors();
            }

            return response()->json($payload, $status);
        });
    })->create();
