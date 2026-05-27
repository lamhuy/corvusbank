# Quickstart: Kids Banking App Web App

This guide will help you set up and run the web application codebase locally.

## Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)

## Setup Steps

### 1. Initialize the Web Project

We use Vite to scaffold the React + TypeScript app in the `web/` directory.

```bash
# Navigate to the web folder (created during implementation)
cd web

# Install dependencies
npm install
```

### 2. Configure Environment Variables

Create a `.env` file inside the `web/` directory with the necessary Firebase configuration keys:

```ini
VITE_FIREBASE_API_KEY=AIzaSyA1Ahsonj1SDlZX_5npXzlt4QGfghUUcjk
VITE_FIREBASE_AUTH_DOMAIN=corvusbank.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=corvusbank
VITE_FIREBASE_STORAGE_BUCKET=corvusbank.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=274350897566
VITE_FIREBASE_APP_ID=1:274350897566:android:1e8c026c41afebf7203e8f
```

*Note: Vite requires env variables to be prefixed with `VITE_` to expose them to the frontend client.*

### 3. Run the Development Server

Start the Vite development server locally:

```bash
npm run dev
```

This will launch the app on `http://localhost:5173`. Open this URL in your web browser to access the Kids Banking App web interface.

### 4. Running Unit Tests

Run the test suite using Vitest:

```bash
npm run test
```
