# Tasks: Kids Banking App

**Input**: Design documents from `/specs/001-kids-banking-app/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, quickstart.md

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Initialize Expo React Native project with TypeScript
- [x] T002 [P] Configure Firebase SDK and environment variables in `firebaseConfig.ts`
- [x] T003 [P] Setup React Navigation for standard mobile routing in `src/navigation/`
- [x] T004 [P] Create initial UI theme (typography, colors) tailored for kids under 15 in `src/utils/theme.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

- [x] T005 Setup Firestore schema configurations and security rules in `firebase/firestore.rules`
- [x] T006 [P] Implement base Firebase auth wrapper and state provider in `src/services/authContext.tsx`
- [x] T007 [P] Create shared UI components (Card, Button, TextInput) in `src/components/`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Sign Up and Account Creation (Priority: P1) 🎯 MVP

**Goal**: As a new user (child under 15), I want to sign up with a unique username and a 4-digit PIN so that I can have my own secure banking account.

**Independent Test**: Can be fully tested by creating a new account and verifying the user is successfully registered and can log in.

### Implementation for User Story 1

- [x] T008 [P] [US1] Create Firebase auth service methods for username/PIN registration in `src/services/auth.ts`
- [x] T009 [P] [US1] Implement `users` and `accounts` Firestore creation logic in `src/services/db.ts`
- [x] T010 [US1] Build SignUpScreen UI with username and 4-digit PIN validation in `src/screens/SignUpScreen.tsx`
- [x] T011 [US1] Implement username uniqueness check against Firestore during signup
- [x] T012 [US1] Connect SignUpScreen to auth context and redirect upon success

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Account Dashboard (Priority: P1)

**Goal**: As a logged-in user, I want to see my savings account summary card displaying my balance, interest rate, and YTD interest earned, so I know my financial status at a glance.

**Independent Test**: Can be tested by logging in as an existing user and verifying the summary card metrics reflect the backend data.

### Implementation for User Story 2

- [x] T013 [P] [US2] Create helper functions to format currency and calculate daily interest in `src/utils/finance.ts`
- [x] T014 [US2] Implement Firestore query to fetch the user's `accounts` data in `src/services/db.ts`
- [x] T015 [US2] Build AccountSummaryCard component in `src/components/AccountSummaryCard.tsx`
- [x] T016 [US2] Build DashboardScreen UI integrating the summary card in `src/screens/DashboardScreen.tsx`
- [x] T017 [US2] Create Firebase Cloud Function for daily interest accrual and payout in `firebase/functions/src/index.ts`

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Account Details and Transactions (Priority: P2)

**Goal**: As a logged-in user, I want to click on my savings account to view detailed information, including my balance, a deposit action, and my transaction history, so I can track my activity and add funds.

**Independent Test**: Can be tested by navigating to the account details page and verifying the transaction list and deposit functionality.

### Implementation for User Story 3

- [x] T018 [P] [US3] Implement Firestore query to fetch recent `transactions` in `src/services/db.ts`
- [x] T019 [US3] Implement Firestore atomic transaction for processing deposits in `src/services/db.ts`
- [x] T020 [P] [US3] Build TransactionList component in `src/components/TransactionList.tsx`
- [x] T021 [P] [US3] Build DepositModal component with amount validation in `src/components/DepositModal.tsx`
- [x] T022 [US3] Build AccountDetailsScreen UI integrating the list and modal in `src/screens/AccountDetailsScreen.tsx`
- [x] T023 [US3] Add navigation link from DashboardScreen card to AccountDetailsScreen

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T024 [P] Polish UI styling to ensure it is realistic yet kid-friendly (large fonts, clear contrast)
- [x] T025 Set up GitHub Actions workflow in `.github/workflows/deploy.yml` for EAS build
- [x] T026 Configure EAS project and deployment credentials for Google Play Store

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - US1 and US2 can proceed in parallel once foundational elements are done
  - US3 requires the basic data structure established in US1 and US2
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### Parallel Opportunities

- Setup tasks related to React Navigation and UI Theme can be done in parallel with Firebase SDK setup
- The daily interest Firebase Cloud Function can be developed parallel to the Dashboard UI
- GitHub Actions workflow setup can be done independently of UI polish
