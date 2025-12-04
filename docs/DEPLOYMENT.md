# Deployment Guide

## Prerequisites
- Node.js 16+ installed
- MongoDB database (local or Atlas)
- Domain name (for production)

---

## Backend Deployment (Render)

### 1. Create Render Account
Go to [render.com](https://render.com) and sign up

### 2. Create New Web Service
- Connect your GitHub repository
- Select the `server` directory as root
- Configure:
  - **Build Command**: `npm install`
  - **Start Command**: `npm start`

### 3. Environment Variables
Add these in Render dashboard:
```
PORT=8081
NODE_ENV=production
MONGO_URI=your-mongodb-atlas-uri
JWT_SECRET=your-production-secret
EMAIL_USER=your-email
EMAIL_PASS=your-app-password
```

### 4. Deploy
Click "Create Web Service"

---

## Frontend Deployment (Netlify)

### 1. Create Netlify Account
Go to [netlify.com](https://netlify.com) and sign up

### 2. Import Project
- Connect GitHub repository
- Select the `client` directory

### 3. Build Settings
- **Build Command**: `npm run build`
- **Publish Directory**: `build`

### 4. Environment Variables
```
REACT_APP_API_URL=https://your-backend-url.onrender.com
```

### 5. Redirects
The `_redirects` file is already configured for SPA routing

---

## MongoDB Atlas Setup

### 1. Create Cluster
- Go to [mongodb.com/atlas](https://mongodb.com/atlas)
- Create free cluster

### 2. Configure Access
- Add IP whitelist (0.0.0.0/0 for all)
- Create database user

### 3. Get Connection String
```
mongodb+srv://<username>:<password>@cluster.xxxxx.mongodb.net/medsync
```

---

## SSL/HTTPS
Both Render and Netlify provide free SSL certificates automatically.

---

## Post-Deployment Checklist

- [ ] Test all API endpoints
- [ ] Verify database connection
- [ ] Test user registration/login
- [ ] Check email notifications
- [ ] Test on mobile devices
- [ ] Monitor error logs
