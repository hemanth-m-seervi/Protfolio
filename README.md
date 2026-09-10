# Hemanth M Sirvi — Engineering Portfolio

A portable MERN portfolio with cinematic Framer Motion transitions, a MongoDB-backed content system, secure owner authentication, and MongoDB GridFS media storage.

## What is included

- Vite + React frontend
- Tailwind CSS and Framer Motion
- Stacked chapter-style scrolling
- Dynamic navigation and optional sections
- Project categories, images, expandable project details and GitHub/demo links
- Certifications with full-screen certificate viewer
- Animated SDE/Data/ML resume tabs and inline PDF viewer
- Contact form and admin inbox
- One-time admin setup, login and password change
- MongoDB Atlas persistence
- MongoDB GridFS storage for images and PDFs

## 1. Requirements

- Node.js 20 or newer
- A free MongoDB Atlas project

## 2. Install

Open this folder in VS Code and run:

```bash
npm run install:all
```

## 3. Configure the backend

Copy `server/.env.example` to `server/.env` and add your MongoDB values.

Generate a random JWT secret. Do not use your email password as the secret.

```env
PORT=5000
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-long-random-secret
NODE_ENV=development
```

The frontend defaults to `http://localhost:5000/api`. To change it, copy `client/.env.example` to `client/.env`.

## 4. Run

From the project root:

```bash
npm run dev
```

Open `http://localhost:5173`.

## 5. Create the administrator

Open `http://localhost:5173/admin`. On the first visit, the app shows a one-time owner setup screen. Enter your email and a new, unique password. After the first account is created, the setup endpoint disables itself.

Never put the administrator password in source files, `.env.example`, GitHub, or chat messages.

## MongoDB Atlas setup

1. Create a free cluster.
2. Create a database user with a unique database-only password.
3. Add your current IP address under Network Access for local development.
4. Select Connect → Drivers → Node.js.
5. Copy the connection string into `MONGODB_URI`.

## Production notes

- Configure the production frontend origin as `CLIENT_URL`.
- Set `NODE_ENV=production` so authentication cookies require HTTPS.
- Keep MongoDB and authentication secrets only in the hosting provider's environment-variable settings.
- Deploy the React client and Express API together on a Node-compatible host, or deploy them separately and set `VITE_API_URL` to the API URL.
