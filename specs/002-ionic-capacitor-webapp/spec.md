# Feature Specification: Ionic Capacitor Web App

**Feature Branch**: `002-ionic-capacitor-webapp`  
**Created**: 2026-05-27  
**Status**: Draft  
**Input**: User description: "convert the following project as a capacitor application with ionic framework. still utilizing existing firebase database, auth backend and logic. focus with ability to deploy web app first"

## Clarifications

### Session 2026-05-27

- Q: Should returning users have a separate Login page or a combined Sign Up / Login page? → A: Separate Sign Up and Login pages (two distinct routes/screens).
- Q: Should the system enforce a maximum deposit amount per transaction? → A: Yes, maximum $10,000 per transaction.
- Q: What is the long-term plan for the existing React Native mobile app? → A: The Ionic/Capacitor app will replace the React Native app once web + native builds are validated.
- Q: Should the app provide offline support or be strictly online-only? → A: Online-only; show a clear "No internet connection" message when connectivity is lost.
- Q: Should the web app remember login sessions across browser restarts? → A: Yes, persistent session — user stays logged in until explicit logout.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Sign Up and Account Creation (Priority: P1)

As a new user (child under 15), I want to sign up with a unique username and a 4-digit PIN through the web application so that I can have my own secure banking account accessible from any browser.

**Why this priority**: Without an account and authentication, no other features can be accessed. This is the entry point for new users.

**Independent Test**: Can be fully tested by visiting the web app URL, creating a new account with a unique username and 4-digit PIN, and verifying the user is registered and automatically logged in to the dashboard.

**Acceptance Scenarios**:

1. **Given** a new user on the sign-up page in a web browser, **When** they enter a unique username and a valid 4-digit PIN and submit, **Then** the account is created and they are logged in to the dashboard.
2. **Given** a new user on the sign-up page, **When** they enter a username that already exists in the shared Firebase database, **Then** they are shown an error message to choose a different username.
3. **Given** a new user on the sign-up page, **When** they enter a PIN that is not exactly 4 digits, **Then** they are shown a validation error.
4. **Given** a new user on the sign-up page, **When** they want to log in instead, **Then** there is a visible link/button to navigate to the separate Login page.

---

### User Story 1b - Login for Returning Users (Priority: P1)

As a returning user, I want to log in with my existing username and 4-digit PIN on a dedicated Login page so that I can access my savings account from the web.

**Why this priority**: Returning users (including those who signed up via the mobile app) need a clear, separate entry point to authenticate.

**Independent Test**: Can be fully tested by navigating to the Login page, entering valid credentials for an existing account, and verifying the dashboard loads with the correct account data.

**Acceptance Scenarios**:

1. **Given** a returning user on the login page, **When** they enter their existing username and correct 4-digit PIN and submit, **Then** they are logged in and see their dashboard with current account data.
2. **Given** a returning user on the login page, **When** they enter an incorrect PIN, **Then** they are shown an authentication error message.
3. **Given** a returning user on the login page, **When** they want to create a new account instead, **Then** there is a visible link/button to navigate to the separate Sign Up page.
4. **Given** a user who previously signed up via the mobile app, **When** they log in on the web app with the same username and PIN, **Then** they see their existing account data (balance, transactions).

---

### User Story 2 - Account Dashboard (Priority: P1)

As a logged-in user, I want to see my savings account summary card displaying my balance, interest rate, and YTD interest earned, so I know my financial status at a glance.

**Why this priority**: The dashboard is the primary landing page and provides the most critical summary information. It must render correctly in web browsers with a responsive layout.

**Independent Test**: Can be tested by logging in as an existing user and verifying the summary card metrics match the data stored in the shared Firebase database.

**Acceptance Scenarios**:

1. **Given** a logged-in user on the dashboard, **When** the page loads, **Then** a savings account summary card is displayed showing current balance, APY interest rate, and YTD interest earned.
2. **Given** a logged-in user on the dashboard, **When** a deposit or interest payout occurs (from either mobile or web), **Then** the dashboard updates in real-time without requiring a page refresh.

---

### User Story 3 - Account Details and Transactions (Priority: P2)

As a logged-in user, I want to click on my savings account to view detailed information, including my balance, a deposit action, and my transaction history, so I can track my activity and add funds.

**Why this priority**: Details and transaction history are core banking features, but secondary to seeing the high-level summary.

**Independent Test**: Can be tested by navigating to the account details page and verifying the transaction list and deposit functionality work correctly.

**Acceptance Scenarios**:

1. **Given** a user viewing the account summary card, **When** they click on the card, **Then** they are navigated to the account details page showing the balance, deposit button, and transaction history.
2. **Given** a user on the account details page, **When** they click deposit, enter an amount, and confirm, **Then** the new deposit appears in the transaction history and the balance is updated.
3. **Given** a user on the account details page, **When** they view their transaction history, **Then** transactions from both the mobile app and web app are shown together (shared database).

---

### User Story 4 - Web Deployment and Browser Access (Priority: P1)

As a user, I want to access the banking app from any modern web browser without installing a native app, so I can manage my savings from any device.

**Why this priority**: The primary goal of this feature is web deployment. The app must be deployable as a standard web application and accessible via URL.

**Independent Test**: Can be tested by building the application, deploying to a web host, and verifying all screens load and function correctly in Chrome, Firefox, Safari, and Edge.

**Acceptance Scenarios**:

1. **Given** the application has been built, **When** a user navigates to the deployed URL in a modern web browser, **Then** the sign-up/login page loads correctly.
2. **Given** the web app is open in a browser, **When** the user resizes the window or uses a mobile device, **Then** the layout adapts responsively to the screen size.

---

### User Story 5 - Native Mobile Packaging (Priority: P3)

As a developer, I want the application architecture to support future packaging as a native mobile app via Capacitor, so that the same codebase can be distributed on iOS and Android app stores.

**Why this priority**: Native packaging is a future goal. The architecture must be Capacitor-compatible from the start, but actual native builds are lower priority than delivering the web app.

**Independent Test**: Can be tested by running Capacitor commands to add iOS/Android platforms and verifying the app runs in a simulator without errors.

**Acceptance Scenarios**:

1. **Given** the web app is built, **When** a developer runs the Capacitor sync and build commands, **Then** the application runs successfully in an iOS simulator or Android emulator.

### Edge Cases

- What happens when the user forgets their 4-digit PIN?
- How does the system handle extremely large deposit amounts? → Enforced maximum of $10,000 per transaction; amounts exceeding this are rejected with a validation error.
- What happens if the username contains special characters?
- How is the interest calculation triggered and displayed accurately?
- What happens when the user has no internet connectivity (offline behavior)? → The app is online-only; a clear "No internet connection" message is displayed and all features are disabled until connectivity is restored.
- How does the app behave when the same user is logged in on both mobile and web simultaneously?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow users to sign up with a unique username and a 4-digit numeric PIN, using the existing Firebase Auth backend.
- **FR-002**: System MUST enforce username uniqueness during registration by checking the existing Firestore `users` collection.
- **FR-003**: System MUST display a dashboard post-login with a savings account summary card showing balance, interest rate, and YTD interest earned.
- **FR-004**: System MUST provide an account details view showing balance, a deposit action, and transaction history.
- **FR-005**: System MUST allow users to perform a deposit action that updates their balance and creates a transaction record in the shared Firestore database. Maximum deposit amount is $10,000 per transaction.
- **FR-006**: System MUST display real-time updates when account data changes (via Firestore real-time listeners).
- **FR-007**: System WILL NOT provide a PIN recovery mechanism; if a PIN is forgotten, users must create a new account.
- **FR-013**: System MUST provide separate Sign Up and Login pages as two distinct routes, each with a navigation link to the other.
- **FR-014**: System MUST display a clear "No internet connection" error state when connectivity is lost; all features require an active internet connection (online-only).
- **FR-015**: System MUST persist user authentication sessions across browser restarts; users remain logged in until they explicitly log out.
- **FR-008**: System MUST present a professional and realistic UI tailored for kids under 15, using the Ionic Framework component library.
- **FR-009**: System MUST be built using the Ionic Framework with Capacitor, enabling future native mobile packaging from the same codebase.
- **FR-010**: System MUST be deployable as a web application accessible via a standard URL in modern browsers.
- **FR-011**: System MUST provide a responsive layout that functions correctly on desktop, tablet, and mobile screen sizes.
- **FR-012**: System MUST share the same Firestore database collections (`users`, `accounts`, `transactions`) as the existing mobile app, so user data is accessible from either platform.

### Key Entities

- **User**: Represents the child account holder. Attributes: username, PIN (hashed via Firebase Auth).
- **Account**: Represents the savings account. Attributes: balance, interest rate, YTD interest.
- **Transaction**: Represents financial activities on the account. Attributes: amount, type (deposit/interest), date, description.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can successfully complete the sign-up process in under 1 minute from a web browser.
- **SC-002**: 100% of deposits correctly update both the account balance and the transaction history, regardless of whether initiated from web or mobile.
- **SC-003**: The web app loads and displays the dashboard within 2 seconds of successful login on a standard broadband connection.
- **SC-004**: The web application achieves a usability score suitable for the target demographic (kids under 15) with larger typography, clear contrast, and engaging design.
- **SC-005**: The web application renders correctly and is fully functional in the latest versions of Chrome, Firefox, Safari, and Edge.
- **SC-006**: The application's responsive layout passes usability testing on screen widths from 320px (mobile) to 1920px (desktop).

## Assumptions

- The existing Firebase project (Firestore, Auth, Cloud Functions for daily interest payout) is fully operational and will be reused without modification.
- The Ionic Framework provides the UI component library and theming; Capacitor provides the native bridge layer for future mobile packaging.
- The Ionic/Capacitor application is intended to replace the existing React Native/Expo mobile app once the web deployment is validated and native (iOS/Android) Capacitor builds are confirmed working. Both apps may coexist temporarily during the transition period.
- The initial deployment target is the web (served as a standard SPA); native iOS/Android packaging is a future phase using the same codebase.
- The existing Firestore security rules already support the required read/write operations for the web client (same Firebase SDK operations as mobile).
- Users who previously signed up via the mobile app can log in to the web app and see their existing data (shared database).
- The design will use the same color palette and visual identity as the existing mobile app, adapted to Ionic components.
- All users start with a $0 balance upon sign-up.
