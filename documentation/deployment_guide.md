# DevTracker Deployment Guide

## Goal

Deploy the MVP with:

- Frontend: Vercel
- Backend: Render
- Database: Neon PostgreSQL

## How The Pieces Connect

1. Neon hosts the PostgreSQL database and gives you a production connection string.
2. Render runs the Spring Boot API and receives the Neon database variables.
3. Vercel builds the Vite/React frontend and calls the Render API through `VITE_API_URL`.
4. GitHub OAuth must point back to Render for the backend callback, then Render redirects to Vercel's `/auth/callback`.

## Neon

Create a Neon project and database, then copy the connection data.

For Spring Boot, split the connection into these Render variables:

- `DEVTRACKER_DB_URL=jdbc:postgresql://<host>/<database>?sslmode=require`
- `DEVTRACKER_DB_USERNAME=<neon-user>`
- `DEVTRACKER_DB_PASSWORD=<neon-password>`

Keep Flyway enabled in production:

- `FLYWAY_ENABLED=true`
- `JPA_DDL_AUTO=validate`

## Render Backend

Create a Web Service from the GitHub repository.

Recommended settings:

- Root Directory: `back-end`
- Runtime: Java
- Build Command: `./mvnw clean package -DskipTests`
- Start Command: `java -jar target/back-end-0.0.1-SNAPSHOT.jar`

Important environment variables:

- `SPRING_PROFILES_ACTIVE=prod`
- `PORT` is provided by Render automatically, and the app reads it through `server.port=${PORT:8080}`
- `DEVTRACKER_DB_URL`
- `DEVTRACKER_DB_USERNAME`
- `DEVTRACKER_DB_PASSWORD`
- `JWT_SECRET`
- `JWT_EXPIRATION=3600000`
- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`
- `GITHUB_OAUTH_REDIRECT_URI=https://<render-service>.onrender.com/auth/github/callback`
- `GITHUB_TOKEN_ENCRYPTION_SECRET`
- `FRONTEND_AUTH_CALLBACK_URL=https://<vercel-app>.vercel.app/auth/callback`
- `DEVTRACKER_CORS_ALLOWED_ORIGINS=https://<vercel-app>.vercel.app`
- `DEVTRACKER_ADMIN_EMAILS=your-admin-email@example.com`

## Vercel Frontend

Import the same GitHub repository on Vercel.

Recommended settings:

- Root Directory: `front-end`
- Framework Preset: Vite
- Build Command: `npm run build`
- Output Directory: `dist`

Environment variables:

- `VITE_API_URL=https://<render-service>.onrender.com`
- `VITE_ADMIN_EMAILS=your-admin-email@example.com`

The `front-end/vercel.json` rewrite sends browser refreshes on private routes back to `index.html`, which is required for React Router with `BrowserRouter`.

## GitHub OAuth App

In your GitHub OAuth App settings:

- Homepage URL: `https://<vercel-app>.vercel.app`
- Authorization callback URL: `https://<render-service>.onrender.com/auth/github/callback`

## Deploy Order

1. Create Neon database.
2. Deploy backend on Render with production environment variables.
3. Deploy frontend on Vercel with `VITE_API_URL` pointing to Render.
4. Update GitHub OAuth callback to the Render backend URL.
5. Test local login, GitHub login, dashboard, goals, tasks, sessions, overview, and admin analytics.
