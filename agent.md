You are Codex. Your mission is to generate a full project planning web application step by step.  
Always follow exactly the instructions for each numbered step.  
The stack is: Backend = Node.js + Express + Sequelize (PostgreSQL), Frontend = React (React Router, hooks), Auth = JWT + bcrypt.  
All code must be clean, modular, in English, ASCII only, and commented in English.  
Each step must produce working code before moving to the next.

----------------------------------------------------------------
STEP 1 – PROJECT SCAFFOLD
----------------------------------------------------------------
- Create backend/ and frontend/ folders
- backend/: Express app with Sequelize config, models/, routes/, middleware/
- frontend/: React app with React Router and placeholder pages
- Provide package.json scripts and .env.example
- Output folder tree and initial files with placeholders

----------------------------------------------------------------
STEP 2 – DATABASE MODELS
----------------------------------------------------------------
- Implement Sequelize models: User, Project, Milestone, Task, TimeLog
- Add all fields and associations (Project→Task, Project→Milestone, Task→User, Task→TimeLog, etc.)
- Configure cascade deletes where logical
- Export sequelize instance in config/db.js
- Ensure sync() works without error

----------------------------------------------------------------
STEP 3 – API ROUTES (NO AUTH)
----------------------------------------------------------------
- Create modular routers and controllers
- Projects: CRUD + GET /:id with Tasks and Milestones
- Tasks: CRUD inside project + update status
- Milestones: CRUD
- TimeLogs: GET/POST for a task
- Cost endpoint: GET /projects/:id/cost returns { totalHours, totalCost }
- Use proper HTTP codes, JSON only, comments included

----------------------------------------------------------------
STEP 4 – AUTHENTICATION & AUTHORIZATION
----------------------------------------------------------------
- Routes: POST /auth/register, POST /auth/login
- Hash passwords with bcrypt, issue JWT with id+role
- Middleware: auth.js (verify JWT), authorizeRole.js
- Protect all routes except /auth/*
- Admin only: CRUD on projects, tasks, milestones
- Users: can only update their own assigned tasks, post their own timelogs
- Never return password hashes

----------------------------------------------------------------
STEP 5 – FRONTEND SCAFFOLD
----------------------------------------------------------------
- React app with Router
- Pages: /login, /register (optional), /projects, /projects/:id
- Components: Navbar, ProtectedRoute
- Context: AuthContext to store { user, token }
- api.js helper to call backend with Authorization header
- Simple UI (forms, lists), no CSS framework required

----------------------------------------------------------------
STEP 6 – FRONTEND PAGES IMPLEMENTATION
----------------------------------------------------------------
- LoginPage: login form, save token+user to context, redirect to /projects
- ProjectListPage: list projects, create project form visible only to admin
- ProjectDetailPage: show project info, tasks, milestones, totals
  - Admin: add tasks
  - Assigned user: change status, log time
- RegisterPage: form to create a new account (optional)

----------------------------------------------------------------
STEP 7 – FINAL CONFIG
----------------------------------------------------------------
- Backend: add CORS, .env loading, /health endpoint
- Scripts: "dev" = nodemon, "start" = node server.js
- Frontend: use REACT_APP_API_URL, handle 401 by redirect to /login
- README.md with instructions to run backend + frontend

----------------------------------------------------------------
STEP 8 – TEST AUTOMATION
----------------------------------------------------------------
- Provide PowerShell script test_api.ps1
  - Registers admin, promotes to admin
  - Logs in, creates project+milestone
  - Registers member, logs in
  - Creates task assigned to member
  - Member updates status, logs time, marks done
  - Admin fetches project cost
- Provide smoke test checklist for frontend UI

----------------------------------------------------------------
GENERAL RULES
----------------------------------------------------------------
- Always comment code in English
- Never output secrets (only placeholders in .env.example)
- Keep code modular and production-ready
- Output each step completely before moving to the next
