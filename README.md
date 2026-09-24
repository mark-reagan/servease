# Servease

Servease is a two-sided job board for connecting local job seekers with employers in Quezon, Palawan.

## Features

- Browse, search, and filter job listings by keyword, location, employment type, and work mode.
- View job and company details, save jobs, submit applications with a cover letter and resume, and track application status.
- Maintain candidate profiles with skills, experience, and portfolio links.
- Create company profiles, post and manage job openings, review applicants, and update application statuses.
- Register and sign in with role-based access, email verification, password reset, and account settings.
- Responsive interface with English/Filipino language support and light/dark themes.

## Tech Stack

- **Frontend:** React 18, React Router, Vite, Tailwind CSS, Lucide React
- **Backend:** Laravel 13, PHP 8.3+, Laravel Sanctum, Scribe
- **Database:** SQLite by default; MySQL and PostgreSQL are supported by Laravel

## Project Structure

```text
client/       React frontend, routes, feature pages, and shared UI
server/       Laravel API, models, migrations, and tests
```

See [client/README.md](client/README.md) for frontend details and
[server/README.md](server/README.md) for the API and database details.

## Requirements

- PHP 8.3 or later
- Composer
- Node.js 18 or later
- SQLite, MySQL, or PostgreSQL

## Setup

Install and configure the backend:

```bash
cd server
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
```

SQLite is the default database. Create `database/database.sqlite` first if it
does not already exist. MySQL and PostgreSQL can be configured through the
database variables in `server/.env`.

Configure `VITE_API_URL` in `client/.env` when the API is not available at its
default local URL, `http://localhost:8000/api/v1`. Then install the frontend
dependencies:

```bash
cd ../client
npm install
```

Start the backend and frontend in separate terminals:

```bash
# Terminal 1
cd server
php artisan serve

# Terminal 2
cd client
npm run dev
```

The frontend is available at `http://localhost:5173` by default. The backend is available at `http://localhost:8000`.

The API documentation is available at `http://localhost:8000/docs` after the
backend starts.

## Useful Commands

```bash
# Client
cd client
npm run lint
npm run build

# Server
cd server
php artisan test
# or: composer test
```

## API

All API routes are versioned under `/api/v1` and return JSON responses with a `message` field for errors. Candidate and employer routes require an authenticated, verified account.

Interactive API documentation is available at `/docs` after starting the backend. The main API areas are:

- **Public:** registration, login, password reset, job listings, job details, and company profiles
- **Account:** logout, current user, account updates/deletion, email verification, and resume downloads
- **Candidates:** candidate profile, applications, saved jobs, and application withdrawal
- **Employers:** company profile, job management, applicant lists, and application status updates

## License

MIT
