# Research: Kids Banking App Web App

This document details the design and technology choices for implementing the web application equivalent of the Kids Banking mobile app.

## Web Application Framework and Build Tool

- **Decision**: Vite with React 19 and TypeScript.
- **Rationale**: Vite provides extremely fast builds and hot module reloading (HMR) for local development, which matches the modern development flow of React Native Expo. Reusing React and TypeScript makes it trivial to translate React Native component logic (such as hooks, service calls, and states) into React web components.
- **Alternatives Considered**: Next.js was considered, but since the application is purely a client-side SPA (Single Page Application) that connects directly to Firebase Firestore/Auth and does not require Server-Side Rendering (SSR) or complex backend routing, Vite is lighter, simpler, and fits the single-repo client-side architecture better.

## Routing Library

- **Decision**: `react-router-dom` (v6+).
- **Rationale**: Standard, widely-adopted, and robust routing solution for React SPAs. Enables simple state-driven routing transitions between Sign Up, Dashboard, and Account Details, analogous to `react-navigation` in the Expo mobile implementation.
- **Alternatives Considered**: Custom state-based conditional rendering (e.g. `view === 'dashboard' ? ... : ...`). While simpler, `react-router-dom` provides proper browser history support (back/forward buttons) and clean URLs, which is expected of a professional web application.

## Styling System

- **Decision**: Vanilla CSS with custom properties (CSS Variables) matching the design system in the mobile app.
- **Rationale**: Vanilla CSS keeps dependencies low and offers total control. By mapping colors, typography sizes, border radiuses, and spacings from `src/utils/theme.ts` into a root `:root` CSS declaration, we can build a premium, uniform layout. We'll use modern CSS features like Flexbox, CSS Grid, and media queries to create a responsive, fluid layout that looks stunning on desktop and mobile screens.
- **Alternatives Considered**: TailwindCSS. TailwindCSS was rejected because the guidelines suggest Vanilla CSS is preferred unless requested by the USER.

## Firebase Integration and Persistence

- **Decision**: Firebase Web JS SDK (`firebase/app`, `firebase/auth`, `firebase/firestore`), configured using the client credentials in the `.env` file, with standard web persistence (`indexedDB` or `localStorage`).
- **Rationale**: Reuses the exact same backend Firebase project. The Web SDK automatically handles authentication state persistence in the browser using IndexedDB/Local Storage, avoiding React Native specific dependencies like `AsyncStorage`.
- **Alternatives Considered**: Re-using the exact configuration file. Because of the imports (e.g., `getReactNativePersistence` from `@react-native-async-storage/async-storage`), we cannot directly import `firebaseConfig.ts` in the web build. We will create a web-compatible `firebaseConfig.ts` in the `web/src/services/` or `web/src/` folder.

## Database Schema Compatibility

- **Decision**: Match the exact Firestore path structure and attribute names used by the mobile application.
- **Rationale**: Allows seamless inter-operation between the mobile app and the webapp. 
  - User document path: `/users/{uid}`
  - Account document query: `/accounts` filtered by `userId == uid`
  - Transaction document query: `/transactions` filtered by `accountId == accountId` ordered by `date desc`
  - Deposit transactions: Type `DEPOSIT`, field `amount` (cents), field `date` (serverTimestamp), field `description`.
  - Interest transactions (handled by Cloud Functions): Type `INTEREST`, field `amount`, field `date`, field `description`.
