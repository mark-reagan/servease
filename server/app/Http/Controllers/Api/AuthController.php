<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Models\CandidateProfile;
use App\Models\CompanyProfile;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Register a new user.
     *
    * @unauthenticated
     * @bodyParam password_confirmation string required Must match the password. Example: architecto
     */
    public function register(RegisterRequest $request)
    {
        $data = $request->validated();

        $user = DB::transaction(function () use ($data) {
            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => Hash::make($data['password']),
                'role' => $data['role'],
                'phone' => $data['phone'] ?? null,
            ]);

            if ($user->role === 'candidate') {
                CandidateProfile::create(['user_id' => $user->id]);
            } else {
                CompanyProfile::create([
                    'user_id' => $user->id,
                    'company_name' => $data['company_name'],
                    'slug' => Str::slug($data['company_name']) . '-' . Str::random(6),
                ]);
            }

            return $user;
        });

        $user->sendEmailVerificationNotification();

        return response()->json([
            'message' => 'Registration successful. Please check your email to verify your account before logging in.',
            'user' => new UserResource($user),
        ], 201);
    }

    /**
     * Authenticate a user.
     *
     * @unauthenticated
     */
    public function login(LoginRequest $request)
    {
        $credentials = $request->validated();

        $user = User::where('email', $credentials['email'])->first();

        if (! $user || ! Hash::check($credentials['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        if (! $user->is_active) {
            return response()->json(['message' => 'This account has been deactivated.'], 403);
        }

        if (! $user->hasVerifiedEmail()) {
            return response()->json(['message' => 'Please verify your email address before logging in.'], 403);
        }

        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'user' => new UserResource($user),
            'token' => $token,
        ]);
    }

    public function forgotPassword(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email'],
        ]);

        $status = Password::sendResetLink($request->only('email'));

        return $status === Password::RESET_LINK_SENT
            ? response()->json(['message' => __($status)])
            : response()->json(['message' => __($status)], 400);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'token' => ['required', 'string'],
            'email' => ['required', 'email'],
            'password' => ['required', 'confirmed', 'min:8'],
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function (User $user, string $password) {
                $user->forceFill([
                    'password' => Hash::make($password),
                ])->save();
            }
        );

        return $status === Password::PASSWORD_RESET
            ? response()->json(['message' => __($status)])
            : response()->json(['message' => __($status)], 400);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully.']);
    }

    public function updateAccount(Request $request)
    {
        $user = $request->user();
        $data = $request->validate([
            'email' => ['required', 'email', 'max:255', 'unique:users,email,' . $user->id],
            'current_password' => ['required_with:password', 'current_password'],
            'password' => ['nullable', 'confirmed', 'min:8'],
        ]);

        if ($data['email'] !== $user->email) {
            $user->email = $data['email'];
            $user->email_verified_at = null;
        }

        if (! empty($data['password'])) {
            $user->password = $data['password'];
        }

        $user->save();

        if ($user->wasChanged('email')) {
            $user->sendEmailVerificationNotification();
        }

        return response()->json([
            'message' => $user->wasChanged('email')
                ? 'Account updated. Please verify your new email address.'
                : 'Account settings updated.',
            'user' => new UserResource($user),
        ]);
    }

    public function me(Request $request)
    {
        return new UserResource($request->user()->load(['candidateProfile', 'companyProfile']));
    }
}
