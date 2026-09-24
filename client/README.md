# Servease Client

The Servease client is a React single-page application for discovering local
jobs in Quezon, Palawan and managing candidate and employer workflows.

## Features

- Browse and filter public job listings and view company details.
- Register, sign in, verify an account, reset a password, and manage account settings.
- Candidate dashboards for profiles, saved jobs, applications, resumes, and application status.
- Employer dashboards for company profiles, job posting, job editing, and applicant review.
- English and Filipino translations with persistent light and dark themes.

## Requirements

- Node.js 18 or later
- A running Servease API; see [server/README.md](../server/README.md)

## Setup

From this directory, install dependencies and copy the environment template:

```bash
npm install
cp .env.example .env
```

Set `VITE_API_URL` to the API base URL. The API uses the versioned `/api/v1`
prefix, so the local value should be:

```env
VITE_API_URL=http://localhost:8000/api/v1
```

Start the development server:

```bash
npm run dev
```

The client is available at `http://localhost:5173` by default.

## Commands

```bash
npm run dev       # Start Vite with hot reload
npm run build     # Create a production build
npm run preview   # Preview the production build locally
npm run lint      # Run ESLint
```

## Routes

Public pages include the home page, job details, authentication, password
reset, and email verification. Authenticated routes include dashboards,
candidate and company profiles, account settings, saved jobs, applications,
job creation and editing, and employer applicant review. Access to candidate
and employer pages is restricted by role in the client and enforced by the
API.

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
