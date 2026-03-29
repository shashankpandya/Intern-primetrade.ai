# Deployment Guide

This guide covers deploying both the backend API and React frontend to production.

## Current Deployment Status

- **Frontend**: Deployed on Vercel (https://intern-primetrade-ai-aeqq.vercel.app)
- **Backend**: NOT YET DEPLOYED - Currently only runs locally
- **Database**: Supabase PostgreSQL (already configured)

## Step 1: Deploy Backend

The backend needs to be deployed to a service that supports Node.js. Options include:

### Option A: Deploy to Render.com (Recommended - Free Tier Available)

1. **Create Render Account**
   - Go to https://render.com
   - Sign up with GitHub

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository (shashankpandya/Intern-primetrade.ai)
   - Select repository
   - Name: `intern-primetrade-api`
   - Environment: `Node`
   - Build Command: `cd backend && npm install && npm run build`
   - Start Command: `node backend/dist/index.js`

3. **Set Environment Variables**
   - Database: `DATABASE_URL` = `postgresql://postgres:Intern-primetrade.ai@db.qqwdxhhetjoqnfwuefpv.supabase.co:5432/postgres?sslmode=require`
   - JWT Secrets:
     - `JWT_ACCESS_SECRET` = "your-strong-random-string-here"
     - `JWT_REFRESH_SECRET` = "your-another-random-string-here"
   - CORS:
     - `CORS_ORIGIN` = "https://intern-primetrade-ai-aeqq.vercel.app,http://localhost:5173"
   - `NODE_ENV` = `production`
   - `PORT` = `3000`

4. **Deploy**
   - Click "Create Web Service"
   - Render will deploy (takes 2-5 minutes)
   - Copy the deployed URL (e.g., https://intern-primetrade-api.onrender.com)

### Option B: Deploy to Railway.app

1. **Create Railway Account**
   - Go to https://railway.app
   - Connect GitHub

2. **Deploy Project**
   - Create new project → "Deploy from GitHub repo"
   - Select repository
   - Add PostgreSQL plugin (if not using Supabase)
   - Set environment variables (same as Render above)

### Option C: Deploy to Fly.io

1. **Install Fly CLI**: `brew install flyctl` (or use Windows installer)

2. **Deploy**

   ```bash
   flyctl auth login
   flyctl apps create --name intern-primetrade-api
   flyctl deploy
   ```

3. **Set Secrets**
   ```bash
   flyctl secrets set DATABASE_URL="postgresql://..."
   flyctl secrets set JWT_ACCESS_SECRET="your-secret"
   flyctl secrets set JWT_REFRESH_SECRET="your-secret"
   flyctl secrets set CORS_ORIGIN="https://intern-primetrade-ai-aeqq.vercel.app,http://localhost:5173"
   ```

## Step 2: Update Frontend with Backend URL

Once backend is deployed, update frontend environment:

1. **In Vercel Dashboard**
   - Go to Project Settings → Environment Variables
   - Add: `VITE_API_BASE_URL` = `https://your-backend-api.onrender.com/api/v1`

2. **Or in local .env.local** (for local testing):
   ```
   VITE_API_BASE_URL=http://localhost:5000/api/v1
   ```

## Step 3: Update Backend CORS

In your deployed backend environment variables, update:

```
CORS_ORIGIN=https://intern-primetrade-ai-aeqq.vercel.app,http://localhost:5173
```

## Step 4: Test Full Stack

1. Access frontend: https://intern-primetrade-ai-aeqq.vercel.app
2. Try login with seeded user:
   - Email: `admin@primetrade.ai`
   - Password: `Admin@123`
3. Create a task to verify API connection

## Troubleshooting

### CORS Error: "Access to XMLHttpRequest blocked"

- **Cause**: Backend CORS_ORIGIN doesn't include frontend URL
- **Fix**: Update backend environment variable with correct frontend URL

### 404 on API endpoints

- **Cause**: Frontend is using wrong backend URL
- **Fix**: Verify `VITE_API_BASE_URL` environment variable in Vercel

### Database Connection Error

- **Cause**: `DATABASE_URL` is incorrect or Supabase is down
- **Fix**: Verify DATABASE_URL in backend environment variables

### 401/403 Authentication Error

- **Cause**: JWT tokens invalid or user doesn't exist
- **Fix**: Verify JWT_ACCESS_SECRET and JWT_REFRESH_SECRET match between local and deployed

## Local Development While Backend is Deployed

To test against deployed backend locally:

```bash
# In frontend/.env.local
VITE_API_BASE_URL=https://your-backend-api.onrender.com/api/v1

npm run dev:frontend
```

## Production Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     User Browser                             │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
        ┌──────────────────────────────────────┐
        │  Frontend (Vercel)                   │
        │  https://...vercel.app               │
        └──────────────────┬───────────────────┘
                           │ HTTP/HTTPS
                           │ /api/v1/...
                           ▼
        ┌──────────────────────────────────────┐
        │  Backend API (Render/Railway/Fly)    │
        │  https://...onrender.com/api/v1      │
        └──────────────────┬───────────────────┘
                           │ SQL
                           ▼
        ┌──────────────────────────────────────┐
        │  PostgreSQL (Supabase)               │
        │  db.qqwdxhhetjoqnfwuefpv.supabase.co│
        └──────────────────────────────────────┘
```

## Next Steps

1. Choose a backend hosting service (Render recommended for ease)
2. Deploy backend API
3. Update environment variables in Vercel with backend URL
4. Test full stack integration
5. Monitor logs for any issues

---

For questions on specific platforms, refer to their documentation:

- [Render Docs](https://render.com/docs)
- [Railway Docs](https://docs.railway.app)
- [Fly.io Docs](https://fly.io/docs)
