# Project Management App Scaffold

This repository contains a minimal, production-ready scaffold split into two folders:

- **backend/** – Node.js + Express + Sequelize (PostgreSQL)
- **frontend/** – React with React Router and hooks

## Backend

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Copy the example environment file and adjust values:
   ```bash
   cp .env.example .env
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Run the linter:
   ```bash
   npm run lint
   ```

### Environment variables

The backend expects the following variables in a `.env` file:

- `DATABASE_URL` – connection string for PostgreSQL
- `JWT_SECRET` – secret key used to sign JSON Web Tokens
- `PORT` – port for the HTTP server (defaults to `4000` if not set)

## Frontend

1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Copy the example environment file and adjust values:
   ```bash
   cp .env.example .env
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm start
   ```
5. Create a production build:
   ```bash
   npm run build
   ```

### Environment variables

Create a `.env` file with:

- `REACT_APP_API_URL` – base URL of the backend API (e.g. `http://localhost:4000`)

Both applications use environment variables and are ready for further development.
