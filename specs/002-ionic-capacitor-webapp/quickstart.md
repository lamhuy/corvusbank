# Quickstart: Ionic Capacitor Web App

This guide covers setting up, running, building, and testing the CorvusBank Ionic web application locally.

---

## Prerequisites

- **Node.js** v18+ (v20 LTS recommended)
- **npm** v9+

## 1. Install Dependencies

```bash
cd webapp
npm install
```

## 2. Configure Environment Variables

Create a `.env` file inside `webapp/`:

```ini
VITE_FIREBASE_API_KEY=AIzaSyA1Ahsonj1SDlZX_5npXzlt4QGfghUUcjk
VITE_FIREBASE_AUTH_DOMAIN=corvusbank.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=corvusbank
VITE_FIREBASE_STORAGE_BUCKET=corvusbank.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=274350897566
VITE_FIREBASE_APP_ID=1:274350897566:android:1e8c026c41afebf7203e8f
```

> **Note**: Vite exposes only variables prefixed with `VITE_` to the client bundle via `import.meta.env`.

## 3. Run Development Server

```bash
npm run dev
```

Opens at `http://localhost:5173`. Supports hot module replacement.

## 4. Production Build

```bash
npm run build
```

Outputs optimised static files to `webapp/dist/`. This directory can be deployed to any static hosting provider (Firebase Hosting, Netlify, Vercel, etc.).

## 5. Run Tests

```bash
npm run test
```

Runs Vitest in watch mode. For CI, use:

```bash
npm run test -- --run
```

---

## Capacitor (Future — P3)

Once the web app is stable and validated:

```bash
# Install Capacitor CLI and platform packages
npm install @capacitor/core @capacitor/cli

# Initialise Capacitor (only once)
npx cap init CorvusBank com.corvusbank.app --web-dir=dist

# Add native platforms
npx cap add ios
npx cap add android

# Build web assets, then sync to native projects
npm run build
npx cap sync

# Open in native IDE
npx cap open ios      # Xcode
npx cap open android  # Android Studio
```

---

## Key Commands Reference

| Command              | Description                              |
|----------------------|------------------------------------------|
| `npm run dev`        | Start Vite dev server with HMR           |
| `npm run build`      | Build production SPA to `dist/`          |
| `npm run preview`    | Preview production build locally         |
| `npm run test`       | Run Vitest test suite                    |
| `npx cap sync`       | Copy `dist/` to native platform projects |
| `npx cap open ios`   | Open iOS project in Xcode               |
| `npx cap open android` | Open Android project in Android Studio |
