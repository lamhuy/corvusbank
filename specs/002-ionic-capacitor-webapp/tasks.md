# Tasks: Ionic Capacitor Web App

**Input**: Design documents from `/specs/002-ionic-capacitor-webapp/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are OPTIONAL - only include them if explicitly requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `webapp/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create project directory `webapp/` per implementation plan
- [x] T002 Initialize Vite React TypeScript project in `webapp/`
- [x] T003 [P] Install Ionic Framework dependencies (`@ionic/react`, `ionicons`)
- [x] T004 [P] Install Routing dependencies (`react-router-dom@5`, `@ionic/react-router`)
- [x] T005 [P] Install Firebase SDK (`firebase^12.12.1`)
- [x] T006 Configure Vite in `webapp/vite.config.ts` to support Ionic and set build options
- [x] T007 Configure environment variables inside `webapp/.env`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T008 Setup Firebase App and Auth with `getAuth()` in `webapp/src/services/firebase.ts`
- [x] T009 [P] Port Auth context from mobile to `webapp/src/services/authContext.tsx`
- [x] T010 [P] Port Auth service logic (login, register, fake email padding) to `webapp/src/services/auth.ts`
- [x] T011 [P] Port DB service logic (Firestore operations, $10,000 max deposit check) to `webapp/src/services/db.ts`
- [x] T012 [P] Port Finance utils to `webapp/src/utils/finance.ts`
- [x] T013 Configure Ionic app variables (theme colors) in `webapp/src/theme/variables.css`
- [x] T014 Setup base Ionic App layout and React Router in `webapp/src/App.tsx` and `webapp/src/main.tsx`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Sign Up and Account Creation (Priority: P1) 🎯 MVP

**Goal**: Allow a new user to sign up with a unique username and a 4-digit PIN.

**Independent Test**: Visit the sign-up page, create a new account, and verify the user is logged in and redirected.

### Implementation for User Story 1

- [x] T015 [US1] Create SignUpPage UI component in `webapp/src/pages/SignUpPage.tsx`
- [x] T016 [US1] Implement username validation and registration logic in `webapp/src/pages/SignUpPage.tsx`
- [x] T017 [US1] Add route for `/signup` in `webapp/src/App.tsx`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently.

---

## Phase 4: User Story 1b - Login for Returning Users (Priority: P1)

**Goal**: Provide a separate login page for returning users.

**Independent Test**: Navigate to the Login page, enter valid credentials, and verify login succeeds.

### Implementation for User Story 1b

- [x] T018 [US1b] Create LoginPage UI component in `webapp/src/pages/LoginPage.tsx`
- [x] T019 [US1b] Implement login logic and error handling in `webapp/src/pages/LoginPage.tsx`
- [x] T020 [US1b] Add route for `/login` in `webapp/src/App.tsx` and link between login/signup pages

**Checkpoint**: Authentication flows (signup and login) should both work independently.

---

## Phase 5: User Story 2 - Account Dashboard (Priority: P1)

**Goal**: Display a savings account summary card showing balance, interest rate, and YTD interest earned.

**Independent Test**: Log in and verify the summary card metrics load correctly from the database.

### Implementation for User Story 2

- [x] T021 [P] [US2] Create AccountSummaryCard component in `webapp/src/components/AccountSummaryCard.tsx`
- [x] T022 [US2] Create DashboardPage integrating the summary card and real-time subscription in `webapp/src/pages/DashboardPage.tsx`
- [x] T023 [US2] Add protected route for `/dashboard` in `webapp/src/App.tsx` and redirect on successful login

**Checkpoint**: Dashboard accurately displays the summary data for the logged-in user.

---

## Phase 6: User Story 3 - Account Details and Transactions (Priority: P2)

**Goal**: View detailed information and transaction history, and make a deposit.

**Independent Test**: Navigate to the account details, view transaction history, make a deposit, and see the balance update.

### Implementation for User Story 3

- [x] T024 [P] [US3] Create TransactionList component in `webapp/src/components/TransactionList.tsx`
- [x] T025 [P] [US3] Create DepositModal component in `webapp/src/components/DepositModal.tsx`
- [x] T026 [US3] Create AccountDetailsPage integrating transaction list and deposit modal in `webapp/src/pages/AccountDetailsPage.tsx`
- [x] T027 [US3] Add protected route for `/account/:id` in `webapp/src/App.tsx`

**Checkpoint**: All user stories should now be independently functional.

---

## Phase 7: User Story 4 & Offline Support - Web Deployment (Priority: P1)

**Goal**: Ensure the app functions properly in web browsers and handles offline states cleanly.

**Independent Test**: Disable internet connectivity in the browser tools and verify the "No internet connection" overlay appears.

### Implementation for User Story 4

- [x] T028 [P] [US4] Create useNetworkStatus hook in `webapp/src/hooks/useNetworkStatus.ts`
- [x] T029 [P] [US4] Create OfflineOverlay component in `webapp/src/components/OfflineOverlay.tsx`
- [x] T030 [US4] Integrate OfflineOverlay at the root layout in `webapp/src/App.tsx`
- [x] T031 [US4] Build web assets to `webapp/dist/` and verify production deployment

---

## Phase 8: User Story 5 - Native Mobile Packaging (Priority: P3)

**Goal**: Make the architecture compatible with Capacitor for future native packaging.

**Independent Test**: Verify Capacitor initialization works cleanly without breaking the web app.

### Implementation for User Story 5

- [x] T032 [P] [US5] Install Capacitor CLI and Core (`@capacitor/core`, `@capacitor/cli`) inside `webapp/`
- [x] T033 [US5] Initialize Capacitor config in `webapp/capacitor.config.ts` (`npx cap init CorvusBank com.corvusbank.app --web-dir=dist`)

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T034 Code cleanup and refactoring
- [x] T035 Test responsive layout across mobile, tablet, and desktop breakpoints
- [x] T036 Run quickstart.md validation locally

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can proceed sequentially (P1 → P2 → P3) or in parallel.
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **US1 & US1b (P1)**: Identity management. Depends on Foundation.
- **US2 (P1)**: Dashboard. Depends on Authentication (US1/US1b) to view state.
- **US3 (P2)**: Account Details. Depends on US2 for navigation.
- **US4 (P1)**: Offline behavior. Can be implemented in parallel after Foundation.
- **US5 (P3)**: Native Packaging. Can be performed anytime after Setup.

### Parallel Opportunities

- Foundation logic porting (Auth, DB, Finance) can run in parallel.
- US4 (Offline Support) components can be built concurrently with US1-US3 screens.
- UI components (AccountSummaryCard, TransactionList, DepositModal) can be built in parallel.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3 & 4: User Story 1 & 1b
4. **STOP and VALIDATE**: Test Authentication independently
5. Proceed to remaining features sequentially.
