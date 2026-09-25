<?php

namespace App\Notifications;

use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;

// Queued so a slow/unreachable SMTP server never turns registration/resend into a 500 response.
class QueuedVerifyEmail extends VerifyEmail implements ShouldQueue
{
    use Queueable;
}
