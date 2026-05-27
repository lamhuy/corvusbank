# Implementation Plan: Kids Banking App Web App

**Branch**: `001-kids-banking-app` | **Date**: 2026-05-27 | **Spec**: [spec.md](file:///c:/Users/jason/workspace/corvusbank/specs/001-kids-banking-app/spec.md)
**Input**: Feature specification from `/specs/001-kids-banking-app/spec.md`

## Summary

The goal of this task is to create a web application equivalent to the mobile implementation of the Kids Banking App. The webapp will support:
1. **User Sign Up and Authentication**: 4-digit PIN, unique username verification, and Firebase Auth backend connection.
2. **Dashboard**: Savings account summary card showing current balance, interest rate (APY), and YTD interest earned.
3. **Account Details**: Showing transaction history (deposits and daily interest payouts) and allowing users to perform a deposit action.

The technical approach is to build a modern React Single Page Application (SPA) using Vite, TypeScript, and Vanilla CSS, reusing the existing Firebase backend and configuration.

## Technical Context

**Language/Version**: React 19 + TypeScript (Vite)
**Primary Dependencies**: `firebase` (JS SDK), `react-router-dom` (routing)
**Storage**: Firestore (reusing the existing Firebase project and collections: `users`, `accounts`, `transactions`)
**Testing**: Vitest + React Testing Library
**Target Platform**: Desktop & Mobile Web Browsers (Responsive layout)
**Project Type**: web-service (frontend client SPA)
**Performance Goals**: Load dashboard data in under 2 seconds (SC-004)
**Constraints**: Keep PIN format strictly numeric and 4 digits; unique username constraint enforced by Firestore check.
**Scale/Scope**: ~3 views/screens (SignUp, Dashboard, AccountDetails).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

The project constitution defines basic structure and testing. We will follow standard React/web styling guidelines, write tests for components and services, and ensure our web components match the state transitions of the mobile app.

- **Check 1: Single Web Project Folder**: The webapp will live entirely in the `web/` directory. (Passed)
- **Check 2: Test-First/Validation**: We will add tests in `web/src/__tests__` or `web/tests/`. (Passed)

## Project Structure

### Documentation (this feature)

```text
specs/001-kids-banking-app/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (generated later)
```

### Source Code (repository root)

```text
firebase/                # Existing Cloud Functions & Firestore configuration
src/                     # Existing Expo Mobile application code
web/                     # [NEW] Web application codebase
├── index.html           # Main entry point HTML
├── package.json         # Package configuration
├── vite.config.ts       # Vite build config
├── src/
│   ├── main.tsx         # App bootstrap
│   ├── index.css        # Main stylesheet
│   ├── App.tsx          # App component & Router setup
│   ├── components/      # UI components
│   │   ├── AccountSummaryCard.tsx
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── DepositModal.tsx
│   │   ├── TextInput.tsx
│   │   └── TransactionList.tsx
│   ├── screens/         # Page screens
│   │   ├── SignUpScreen.tsx
│   │   ├── DashboardScreen.tsx
│   │   └── AccountDetailsScreen.tsx
│   ├── services/        # Firebase Auth & Firestore Client services
│   │   ├── auth.ts
│   │   ├── authContext.tsx
│   │   └── db.ts
│   └── utils/           # Shared helpers
│       ├── finance.ts
│       └── theme.ts
```

**Structure Decision**: A new `web/` directory will contain the React Web App. The React Native app files remain in the root directory and the `src` folder. This keeps the mobile and web codebases isolated while sharing the root-level Firestore database configuration and deployment scripts.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

*(No violations. Plan complies with project structure guidelines.)*

