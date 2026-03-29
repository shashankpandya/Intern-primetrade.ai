# Intern PrimeTrade Assignment

Full-stack internship assignment implementing a scalable REST API with JWT authentication, role-based access control, versioned endpoints, and a basic React frontend for API interaction.

## Tech Stack

- Backend: Node.js, Express, TypeScript, Prisma ORM, PostgreSQL
- Frontend: React, Vite, TypeScript, React Router, Axios
- Security: bcrypt password hashing, JWT access/refresh tokens, Helmet, CORS, rate limiting, validation with Zod
- Docs: Swagger (`/api-docs`) + Postman collection
- Optional extras: Docker Compose for PostgreSQL, request logging with Morgan

## Project Structure

- `backend`: API server, Prisma schema/migrations, Swagger spec, Postman collection
- `frontend`: UI for register/login and protected Task CRUD dashboard
- `docker-compose.yml`: PostgreSQL local environment

## Quick Start

### 1. Install dependencies

```bash
npm install
cd backend && npm install
cd ../frontend && npm install
```

### 2. Start PostgreSQL

```bash
docker compose up -d
```

### 3. Configure environment

Environment file is already prepared at `backend/.env`.

If needed, copy values from:

- `backend/.env.example`

### 4. Generate Prisma client and migrate

```bash
cd backend
npx prisma generate
npx prisma migrate dev --name init
npm run prisma:seed
```

### 5. Run backend

```bash
cd backend
npm run dev
```

Backend base URL: `http://localhost:5000`

### 6. Run frontend

```bash
cd frontend
npm run dev
```

Frontend URL: `http://localhost:5173`

## API Endpoints (v1)

### Auth

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`

### Tasks (JWT required)

- `GET /api/v1/tasks`
- `POST /api/v1/tasks`
- `GET /api/v1/tasks/:id`
- `PATCH /api/v1/tasks/:id`
- `DELETE /api/v1/tasks/:id`

### Admin (ADMIN role only)

- `GET /api/v1/admin/stats`

## Demo Users (seeded)

- Admin: `admin@primetrade.ai` / `Admin@123`
- User: `user@primetrade.ai` / `User@1234`

## API Documentation

- Swagger UI: `http://localhost:5000/api-docs`
- Postman collection: `backend/postman/Intern-Primetrade.postman_collection.json`

## Frontend Features

- Register and login forms
- JWT-protected dashboard route
- Task create/read/update/delete operations
- Error and success messaging from backend responses

## Validation and Error Handling

- Request validation with Zod schemas
- Standardized JSON error responses
- 404 route handling
- Global exception middleware

## Security Notes

- Passwords are hashed with bcrypt
- Access and refresh JWT tokens are issued on login
- CORS limited to configured frontend origin
- Helmet secures HTTP headers
- Rate limiting enabled for auth routes

## Test and Build

```bash
cd backend
npm test
npm run build

cd ../frontend
npm run build
```

## Scalability Note

This codebase is organized in modular domains (`auth`, `tasks`, `admin`) with separated routes, middleware, and services. It can scale by:

1. Horizontal API scaling behind a load balancer (stateless JWT auth)
2. Introducing Redis for token/session caching and rate-limit storage
3. Splitting modules into microservices (auth-service, task-service) when traffic/domain complexity grows
4. Using asynchronous workers/queues for heavy background jobs
5. Adding observability stack (structured logs, metrics, tracing)

This structure is deployment-ready for containerized environments and supports adding new modules with minimal coupling.
