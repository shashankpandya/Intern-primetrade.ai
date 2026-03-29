# Deployment Guide

## Quick Reference: Where to Add Environment Variables

```
┌─────────────────────────────────────────────────────────┐
│  RENDER (Backend)                                       │
│  Environment Variables:                                 │
│  • DATABASE_URL                                         │
│  • JWT_ACCESS_SECRET                                    │
│  • JWT_REFRESH_SECRET                                   │
│  • CORS_ORIGIN ← Includes frontend URL                  │
│  • NODE_ENV=production                                  │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  VERCEL (Frontend)                                      │
│  Environment Variables:                                 │
│  • VITE_API_BASE_URL ← Points to Render backend URL ✓  │
└─────────────────────────────────────────────────────────┘
```

## Architecture Flow

```
User Browser
    ↓
Vercel Frontend (https://intern-primetrade-ai-aeqq.vercel.app)
    ↓ (uses VITE_API_BASE_URL env var)
Render Backend (https://intern-primetrade-api.onrender.com)
    ↓ (checks CORS_ORIGIN)
Supabase PostgreSQL
```

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

## Step 2: Copy Your Render Backend URL

After Render deployment completes:

1. Go to your Render service: https://dashboard.render.com/services
2. Click on `intern-primetrade-api`
3. Copy the URL shown at top (e.g., `https://intern-primetrade-api.onrender.com`)
4. **Note this URL - you'll use it next**

## Step 3: Update Frontend with Backend URL in Vercel

Once you have your Render backend URL:

1. **Go to Vercel Dashboard**
   - Open https://vercel.com/dashboard
   - Click on `intern-primetrade-ai` project
   - Click "Settings" tab
   - Go to "Environment Variables"

2. **Add the Backend URL**
   - Key: `VITE_API_BASE_URL`
   - Value: `https://your-backend-url.onrender.com/api/v1` (replace with your actual Render URL)
   - Example: `https://intern-primetrade-api.onrender.com/api/v1`

3. **Redeploy Frontend**
   - Go to "Deployments" tab
   - Click the three dots (...) on latest deployment
   - Select "Redeploy"
   - Wait for redeploy to complete

4. **For local testing** (optional):
   - Create `frontend/.env.local`:
   ```
   VITE_API_BASE_URL=https://your-backend-url.onrender.com/api/v1
   ```

   - Run `npm run dev:frontend`

## Step 4: Verify Backend CORS is Set

Make sure your Render backend has this environment variable set (it should already have it from step 1):

```
CORS_ORIGIN=https://intern-primetrade-ai-aeqq.vercel.app,http://localhost:5173
```

After Vercel redeploys with the new environment variable:

1. Access frontend: https://intern-primetrade-ai-aeqq.vercel.app
2. Try login with seeded user:
   - Email: `admin@primetrade.ai`
   - Password: `Admin@123`
3. Create a task to verify API connection works
4. If you get CORS errors, check that:
   - `VITE_API_BASE_URL` is set correctly in Vercel
   - `CORS_ORIGIN` includes your Vercel frontend URL in Render

5. Access frontend: https://intern-primetrade-ai-aeqq.vercel.app
6. Try login with seeded user:
   - Email: `admin@primetrade.ai`
   - Password: `Admin@123`
7. Create a task to verify API connection

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
