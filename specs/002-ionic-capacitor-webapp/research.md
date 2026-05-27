# Research: Ionic Capacitor Web App

This document captures the technology decisions, rationale, and alternatives evaluated for converting the CorvusBank Kids Banking App from React Native/Expo to an Ionic React + Capacitor cross-platform application.

---

## 1. UI Framework

- **Decision**: Ionic React (`@ionic/react`) with React 19 and TypeScript.
- **Rationale**: Ionic provides a comprehensive library of pre-built, mobile-optimised UI components (cards, lists, modals, buttons, inputs, toolbars) that automatically adapt to iOS and Material Design conventions. This dramatically reduces the effort needed to build a kid-friendly, professional-looking interface (FR-008). Since the existing codebase already uses React + TypeScript, the core business logic (hooks, context, service calls) can be ported directly without a framework rewrite.
- **Alternatives Considered**:
  - *React Native Web*: Rejected because it carries React Native bundler complexity (Metro) and produces less idiomatic web output. Ionic is web-first and produces standard DOM elements.
  - *Plain React + Vite (feature 001 plan)*: Rejected because it lacks the built-in mobile component library and Capacitor integration scaffolding that Ionic provides out of the box.

## 2. Build Tooling

- **Decision**: Vite with the `react-ts` template.
- **Rationale**: Vite is the standard bundler for modern Ionic React projects. It provides sub-second hot module replacement during development and highly optimised production builds via Rollup. The output directory (`dist/`) maps directly to Capacitor's `webDir` configuration, enabling seamless native packaging.
- **Alternatives Considered**:
  - *Create React App (CRA)*: Deprecated and no longer maintained. Vite is universally recommended.
  - *Webpack*: Heavier configuration burden with no meaningful benefit over Vite for an SPA of this scale.

## 3. Routing

- **Decision**: `@ionic/react-router` paired with `react-router-dom@5`.
- **Rationale**: Ionic's page transition animations, route guards, and navigation lifecycle hooks (`IonRouterOutlet`, `IonPage`) are tightly coupled to React Router v5. Using v6 or v7 will break Ionic-specific routing. The app will define four primary routes: `/login`, `/signup`, `/dashboard`, and `/account/:id`.
- **Alternatives Considered**:
  - *react-router-dom v6/v7*: Incompatible with `@ionic/react-router` as of 2026. Would break `IonRouterOutlet` and page transitions.

## 4. Capacitor (Native Bridge)

- **Decision**: `@capacitor/core` + `@capacitor/cli` installed from the start, with native platforms added later.
- **Rationale**: Capacitor wraps the Vite `dist/` output in a native WebView container. Installing it now ensures the project structure is compatible from day one (FR-009). Native platform folders (`ios/`, `android/`) will be added in a future phase (P3) via `npx cap add ios` / `npx cap add android`. No native plugins are required for the initial web deployment.
- **Alternatives Considered**:
  - *Cordova*: Legacy, deprecated in favour of Capacitor by the Ionic team. Capacitor is actively maintained and has a simpler plugin architecture.

## 5. Firebase SDK & Auth Persistence

- **Decision**: Firebase JS SDK (`firebase` npm package, same version `^12.12.1` as the mobile app), initialised with `getAuth()` for automatic browser persistence.
- **Rationale**: On the web, `getAuth()` automatically configures `indexedDBLocalPersistence` as the default. This persists the user's auth state in the browser's IndexedDB, satisfying FR-015 (sessions survive browser restarts). This replaces the mobile app's `initializeAuth` + `getReactNativePersistence(AsyncStorage)` pattern, which is React Native-specific and cannot run in a browser.
- **Key Adaptation**: The `firebaseConfig.ts` file must be rewritten for the web:
  - Remove `@react-native-async-storage/async-storage` import.
  - Remove `getReactNativePersistence` import.
  - Replace `initializeAuth(app, { persistence: ... })` with `getAuth(app)`.
  - Replace `EXPO_PUBLIC_` env var prefix with `VITE_` prefix (`import.meta.env.VITE_*`).
- **Alternatives Considered**:
  - *initializeAuth with browserLocalPersistence*: Unnecessary complexity. `getAuth()` already sets IndexedDB persistence by default, which is more robust than localStorage.

## 6. Firebase Auth Credential Mapping

- **Decision**: Reuse the identical fake-email and PIN-padding pattern from the mobile app.
- **Rationale**: The existing Firebase Auth project stores users with email addresses of the form `username@kidsbanking.app` and passwords of the form `PIN + "00"` (e.g., PIN `1234` → password `123400`). The web app must use exactly the same mapping to authenticate against the same user records. This is a direct port of `src/services/auth.ts`.
- **No alternatives**: This is a hard constraint dictated by the existing Firebase Auth data.

## 7. Firestore Data Layer

- **Decision**: Port the service functions from `src/services/db.ts` verbatim, changing only the import path for the Firebase instances.
- **Rationale**: The Firestore SDK (`firebase/firestore`) works identically on web and React Native. The functions `isUsernameAvailable`, `createUserProfile`, `subscribeToUserAccount`, `subscribeToTransactions`, and `processDeposit` use `onSnapshot` for real-time updates and `runTransaction` for atomic deposits — both are supported without modification in the browser.
- **Enhancement**: The `processDeposit` function will gain a $10,000 max validation check (FR-005) that was not present in the original mobile code.

## 8. Styling & Theming

- **Decision**: Ionic's built-in CSS variable system (`src/theme/variables.css`) with the existing mobile colour palette mapped to Ionic custom properties.
- **Rationale**: Ionic components are themed via CSS custom properties (e.g., `--ion-color-primary`, `--ion-color-secondary`). We will map the existing theme colours:
  - `--ion-color-primary`: `#FF6B6B` (Vibrant Red/Pink)
  - `--ion-color-secondary`: `#4ECDC4` (Bright Teal)
  - `--ion-background-color`: `#F7FFF7` (Off-white/Mint)
  - `--ion-text-color`: `#2C3E50` (Dark Blue/Gray)
  
  Typography will use the Ionic default system font stack with sizes increased for kid-friendliness (18px body minimum).
- **Alternatives Considered**:
  - *Tailwind CSS*: Not requested by user and would conflict with Ionic's component styling model.

## 9. Online/Offline Detection

- **Decision**: Browser-native `navigator.onLine` + `window.addEventListener('online'/'offline')` wrapped in a React hook (`useNetworkStatus`).
- **Rationale**: This is the simplest, zero-dependency approach. When the app detects an offline state, an `IonLoading` or full-screen overlay will block all interactions and display "No internet connection — please reconnect to continue" (FR-014). When connectivity resumes, the overlay dismisses automatically.
- **Alternatives Considered**:
  - *@capacitor/network plugin*: Adds a native dependency that is unnecessary for the web-first deployment. Can be added later when native builds are prioritized.

## 10. Project Structure

- **Decision**: Create a new `webapp/` subdirectory at the repository root for all Ionic/Capacitor code.
- **Rationale**: The existing React Native/Expo code occupies the root `src/`, `App.tsx`, `package.json`, and `node_modules/`. Placing the Ionic project in `webapp/` ensures zero bundler conflicts (Vite vs Metro), separate dependency trees, and independent build scripts. The two apps share only the Firebase project credentials and backend.
- **Alternatives Considered**:
  - *In-place replacement*: Rejected because the spec states both apps may coexist during transition. Replacing root files would break the mobile app immediately.
  - *Monorepo with shared packages*: Over-engineered for this scope. The shared logic (auth patterns, db functions, finance utils) is small enough to copy directly.

## 11. Testing

- **Decision**: Vitest + React Testing Library.
- **Rationale**: Vitest is the native test runner for Vite projects, offering near-instant test execution with the same configuration. React Testing Library provides component-level testing that exercises the Ionic React components as users would interact with them.
