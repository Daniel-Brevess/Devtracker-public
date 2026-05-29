# DevTracker

DevTracker is a developer-focused productivity and technical evolution platform.

It helps developers track their study sessions, focus areas, tasks, long-term goals, GitHub activity, contribution frequency, streaks, repositories, languages, and overall progress in one dashboard.

Access the app:

https://dev-tracker-two-swart.vercel.app

## What DevTracker Does

DevTracker was built to answer a simple question:

> Am I actually evolving as a developer?

Instead of tracking productivity only by tasks, DevTracker combines personal planning with real development signals from GitHub.

The platform currently includes:

- Local authentication with email and password
- GitHub OAuth authentication
- Personal dashboard
- Focus areas
- Tasks grouped by focus
- Long-term goals
- Study/work sessions with real duration tracking
- GitHub analytics
- Commit frequency
- Current streak based on GitHub contributions
- Repository and language overview
- Admin analytics for platform monitoring

## Main Features

### Overview

The overview is the main analytical panel of the app.

It shows a general summary of:

- completed tasks
- pending tasks
- task completion rate
- current streak
- focus/session time
- GitHub commits
- repositories
- most used languages
- recent activity

The goal is to give the user a quick view of their technical consistency and progress.

### Tasks

Tasks are organized by focus areas.

A user can create focus groups, then add tasks inside each focus. Each task has:

- title
- description
- priority
- completion status
- creation date

Task priorities use English enum values:

- `LOW`
- `MEDIUM`
- `HIGH`

The app enforces limits to keep the MVP simple and intentional:

- each user can have up to 20 focus areas
- each focus can have up to 25 active tasks

### Goals

Goals are used for long-term planning.

Each goal has:

- title
- description
- difficulty
- status
- progress information

Goal difficulty values:

- `LOW`
- `MEDIUM`
- `HIGH`

Goal status values:

- `TODO`
- `IN_PROGRESS`
- `DONE`
- `DISCARDED`

Each user can have up to 30 active goals.

### Sessions

Sessions track real time spent studying, working, or focusing.

The user chooses:

- session type
- planned duration

When the session starts, DevTracker shows a live timer in the dashboard header. The app saves the real duration when the session finishes or when the user stops it manually.

Session duration is stored in seconds in the database and formatted as readable time in the frontend.

### GitHub Analytics

DevTracker integrates with GitHub OAuth.

The backend handles the OAuth flow and stores only what is needed for analytics. The frontend never receives or handles the GitHub access token directly.

GitHub analytics include:

- repositories
- private repositories, if permission is granted
- languages
- commits/contributions
- contribution frequency
- current streak

The current streak is based on the GitHub contribution calendar, using GitHub as the source of truth.

### Admin Analytics

The app includes a simple admin analytics section.

Admin access is controlled by email through backend environment variables. This means the frontend can show or hide the admin menu, but the backend is the real authority.

Admin analytics include:

- total users
- active users
- local users
- GitHub users
- users created today
- users created in the last 7 days

  ## Tech Stack

### Frontend

- React
- Vite
- JavaScript
- Tailwind CSS
- Axios
- React Router
- Lucide React

### Backend

- Java
- Spring Boot
- Spring Security
- Spring Data JPA
- Bean Validation
- Flyway
- JWT
- Maven
- Docker

### Database

- PostgreSQL
- Supabase PostgreSQL
- Flyway migrations

### Authentication

- Local authentication with email and password
- GitHub OAuth
- JWT-based authentication

### Deployment

- Vercel
- Render
- Docker
- Supabase

### External APIs

- GitHub OAuth API
- GitHub REST API
- GitHub GraphQL API

### Development Tools

- Git
- GitHub
- IntelliJ IDEA
- VS Code
- Postman
- pgAdmin
- Supabase Dashboard
- Render Dashboard
- Vercel Dashboard
E se quiser deixar mais “portfolio”, coloca também:

md


## Tools And Technologies Used

DevTracker was built using a modern full-stack architecture.

The frontend uses React with Vite for fast development and optimized builds. Tailwind CSS is used for styling, Axios for HTTP communication, React Router for routing, and Lucide React for icons.

The backend uses Java with Spring Boot, Spring Security, Spring Data JPA, Bean Validation, Flyway migrations, JWT authentication, and Docker for production deployment.

The database is PostgreSQL, hosted on Supabase. Database schema changes are versioned with Flyway.

The application is deployed with Vercel for the frontend and

## Architecture

DevTracker is structured as a full-stack application with a clear separation between frontend, backend, and database.

### Frontend

The frontend is built with:

- React
- Vite
- Tailwind CSS
- Axios
- Lucide React

Responsibilities:

- user interface
- routing
- dashboard experience
- forms and validation feedback
- token storage
- authenticated API requests
- rendering analytics and user data

The frontend communicates only with the backend API. It does not connect directly to the database or to GitHub APIs.

### Backend

The backend is built with:

- Java
- Spring Boot
- Spring Security
- Spring Data JPA
- Flyway
- PostgreSQL driver
- JWT authentication

Responsibilities:

- authentication
- GitHub OAuth flow
- JWT generation and validation
- business rules
- input validation
- user ownership checks
- data persistence
- GitHub API integration
- admin analytics
- error handling

The backend is the source of truth for authorization and business rules.

### Database

The production database uses Supabase PostgreSQL.

Database changes are managed with Flyway migrations.

This keeps schema changes versioned and predictable across local, staging, and production environments.

### Deployment

The production deployment uses:

- Vercel for the frontend
- Render for the backend
- Supabase for PostgreSQL

The backend is deployed on Render using Docker.

## Authentication Decisions

DevTracker supports two authentication flows:

### Local Authentication

Users can register with:

- name
- username
- email
- password

Passwords are hashed in the backend.

Sensitive local account changes require the current password.

### GitHub Authentication

Users can also authenticate with GitHub.

The GitHub flow works as both login and registration:

- if the GitHub ID already exists, the user logs in
- if it does not exist, a new account is created
- GitHub users do not use a local DevTracker password

GitHub users cannot update email, username, or password inside DevTracker. Those fields are managed by GitHub.

The frontend receives only DevTracker's JWT, never the GitHub token.

## Security Decisions

Some important security decisions in the MVP:

- JWT is generated by the backend
- GitHub token is never exposed to the frontend
- private routes require authentication
- expired tokens are removed by the frontend
- sensitive user updates require current password
- GitHub users cannot change local credentials
- admin routes are protected in the backend
- secrets are stored in environment variables
- production uses external PostgreSQL
- database schema is managed by migrations
- CORS is restricted by environment configuration

## Business Rules

Current MVP limits:

- one user can have up to 20 focus areas
- one focus can have up to 25 active tasks
- one user can have up to 30 active goals
- session duration is stored as real elapsed time
- GitHub contribution streak is based on GitHub contribution data
- admin access is email-based and configured through environment variables

These limits were chosen to keep the MVP focused, predictable, and easy to validate.

## Design Direction

DevTracker uses a dark, developer-oriented interface.

The visual direction focuses on:

- clarity
- focus
- technical feel
- dashboard-first experience
- minimal friction
- readable analytics
- strong contrast
- modern SaaS-style UI

The landing page presents the product as a technical evolution platform, while the dashboard is built as the main usable experience.

## Project Status

DevTracker is currently an MVP.

The main goal of this version is to validate:

- authentication
- GitHub OAuth
- task tracking
- goal tracking
- session tracking
- developer analytics
- deployment flow
- production database integration

Future improvements may include:

- refresh tokens or HttpOnly cookie authentication
- richer GitHub analytics
- historical user metrics
- public profile pages
- team features
- notification system
- improved admin panel
- billing or plan management
- deeper mobile responsiveness
