# Servease

A job hunting platform that connects job seekers with employers. Servease helps people find local opportunities and helps businesses find qualified candidates.

## Overview

Servease is a two-sided job board application with distinct experiences for:

- **Job Seekers (Candidates)**: Browse jobs, save favorites, apply with cover letters, and manage application status
- **Employers**: Post jobs, manage applications, and review candidates

## Features

### For Job Seekers
- Browse and search job listings with filters (keyword, location, employment type, work mode)
- View detailed job information including company profile
- Save jobs to a personal list for later review
- Apply to jobs with cover letter and resume
- Track application status and history
- Create and manage a candidate profile with skills, experience, and portfolio links

### For Employers
- Create and manage a company profile
- Post new job openings with detailed requirements
- Edit or remove posted jobs
- View all applications for posted jobs
- Review candidate profiles and update application status
- Add notes to applications

### For All Users
- User registration and authentication
- Password reset functionality
- Role-based dashboards
- Responsive design for desktop and mobile

## Tech Stack

### Backend
- **Framework**: Laravel 13 (PHP 8.3+)
- **Authentication**: Laravel Sanctum
- **Database**: SQLite (default), supports MySQL/PostgreSQL
- **API Documentation**: Scribe

### Frontend
- **Framework**: React 18
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Icons**: Lucide React

## Project Structure

```
unpaid-proj-ken-bonghanoy/
├── server/                 # Laravel backend API
│   ├── app/
│   │   ├── Models/        # Database models
│   │   └── Http/
│   │       ├── Controllers/ # API controllers
│   │       └── Resources/   # API resource transformations
│   ├── routes/api.php     # API routes
│   └── database/
├── client/                # React frontend
│   ├── src/
│   │   ├── app/          # App routing and layout
│   │   ├── features/     # Feature-specific code
│   │   │   ├── auth/     # Authentication
│   │   │   ├── candidates/ # Candidate features
│   │   │   ├── employers/  # Employer features
│   │   │   └── jobs/       # Job browsing and management
│   │   └── shared/       # Shared components
│   └── public/
```

## API Documentation

After starting the backend server, interactive API documentation is available at:
- `/docs` - Interactive HTML documentation
- `/api/v1` - API endpoints root

## Getting Started

### Prerequisites
- PHP 8.3+
- Composer
- Node.js 18+
- SQLite (or MySQL/PostgreSQL)

### Installation

1. Clone the repository
2. Install backend dependencies:
   ```bash
   cd server
   composer install
   ```
3. Set up environment:
   ```bash
   cp .env.example .env
   php artisan key:generate
   php artisan migrate
   ```
4. Install frontend dependencies:
   ```bash
   cd ../client
   npm install
   ```
5. Start the development servers:
   ```bash
   # Backend
   cd server
   php artisan serve

   # Frontend (in a new terminal)
   cd client
   npm run dev
   ```

The application will be available at `http://localhost:5173` (or the Vite port shown in output).

## API Endpoints

### Public
- `POST /api/v1/register` - Register new user
- `POST /api/v1/login` - Login
- `POST /api/v1/forgot-password` - Request password reset
- `POST /api/v1/reset-password` - Reset password
- `GET /api/v1/jobs` - List jobs (paginated)
- `GET /api/v1/jobs/{id}` - Get job details
- `GET /api/v1/companies/{slug}` - Get company profile

### Authenticated (Candidate)
- `POST /api/v1/logout` - Logout
- `GET /api/v1/me` - Get current user
- `PUT /api/v1/profile/candidate` - Update candidate profile
- `POST /api/v1/jobs/{id}/apply` - Apply to job
- `GET /api/v1/applications` - Get my applications
- `DELETE /api/v1/applications/{id}` - Withdraw application
- `GET /api/v1/saved-jobs` - Get saved jobs
- `POST /api/v1/jobs/{id}/save` - Save job
- `DELETE /api/v1/jobs/{id}/save` - Remove saved job

### Authenticated (Employer)
- `PUT /api/v1/profile/company` - Update company profile
- `GET /api/v1/my-jobs` - Get my posted jobs
- `POST /api/v1/jobs` - Create job
- `PUT /api/v1/jobs/{id}` - Update job
- `DELETE /api/v1/jobs/{id}` - Delete job
- `GET /api/v1/jobs/{id}/applications` - Get job applicants
- `PATCH /api/v1/applications/{id}` - Update application status

## Local Focus

Servease was built with a focus on serving the Quezon, Palawan community, connecting local job seekers with local employers.

## License

MIT
