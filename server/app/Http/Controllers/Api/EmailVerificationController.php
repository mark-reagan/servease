<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Verified;
use Illuminate\Http\Request;

class EmailVerificationController extends Controller
{
    /**
     * Verify a user's email address from the signed link sent via email.
     *
     * @unauthenticated
     */
    public function verify(Request $request, string $id, string $hash)
    {
        $user = User::findOrFail($id);
        $frontendUrl = rtrim(env('FRONTEND_URL', 'http://localhost:5173'), '/');

        if (! hash_equals(sha1($user->getEmailForVerification()), $hash)) {
            return redirect($frontendUrl . '/email-verified?status=invalid');
        }

        if (! $user->hasVerifiedEmail()) {
            $user->markEmailAsVerified();
            event(new Verified($user));
        }

        // Issue an access token so the signed link also signs the user into the SPA.
        $token = $user->createToken('api-token')->plainTextToken;

        return redirect($frontendUrl . '/email-verified?status=success&token=' . urlencode($token));
    }

    /**
     * Resend the email verification notification to the authenticated user.
     */
    public function resend(Request $request)
    {
        $user = $request->user();

        if ($user->hasVerifiedEmail()) {
            return response()->json(['message' => 'Email already verified.']);
        }

        $user->sendEmailVerificationNotification();

        return response()->json(['message' => 'Verification link sent.']);
    }
}
