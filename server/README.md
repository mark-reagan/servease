# Servease API

Laravel API for Servease, a two-sided job board connecting local job seekers
with employers in Quezon, Palawan. The API provides authentication, role-based
access, job management, profiles, applications, and saved jobs.

## Requirements

- PHP 8.4 or later
- Composer
- SQLite, MySQL, or PostgreSQL

## Setup

From this directory, install the dependencies and initialize the application:

```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

SQLite is the default database. Create `database/database.sqlite` when needed,
or configure another supported database in `.env`. The API is available at
`http://localhost:8000` by default.

The root [README](../README.md) documents the full client and server workflow.

## API

All endpoints are versioned under `/api/v1`. JSON errors use a consistent
`message` field, with validation details in `errors` when applicable.

Interactive Scribe documentation is available at `/docs` after the server
starts. The generated OpenAPI specification and Postman collection are also
available through the Scribe documentation routes.

### Route areas

- **Public:** registration, login, password reset, job listings, job details, and company profiles
- **Account:** logout, current user, account updates, account deletion, email verification, and resume downloads
- **Candidates:** verified candidate profiles, applications, withdrawals, and saved jobs
- **Employers:** verified company profiles, job CRUD, applicant lists, and application status updates

Candidate and employer routes require Sanctum authentication, the matching role,
and a verified email address.

## Domain models

- `User` - Authentication and candidate/employer role
- `CandidateProfile` - Candidate skills, experience, and portfolio links
- `CompanyProfile` - Employer company information
- `Job` - Job postings and requirements
- `Application` - Candidate applications, cover letters, resumes, and statuses
- `SavedJob` - Candidate bookmarks

## Commands

```bash
php artisan serve      # Start the API
php artisan migrate    # Apply database migrations
php artisan test       # Run the test suite
composer test          # Clear config and run the test suite
```

## License

MIT
