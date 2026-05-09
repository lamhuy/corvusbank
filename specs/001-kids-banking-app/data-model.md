# Data Model: Kids Banking App

## Entities (Firestore Collections)

### 1. `users`
Represents the child account holder.
- `id` (String): Firebase Auth UID.
- `username` (String): Unique username chosen during sign up.
- `createdAt` (Timestamp): Account creation time.

### 2. `accounts`
Represents the savings account.
- `id` (String): Unique account ID (or can use User UID if 1:1 mapping).
- `userId` (String): Reference to the `users` collection.
- `balance` (Number): Current balance (stored in cents/smallest currency unit to avoid floating-point errors).
- `interestRate` (Number): APY percentage (e.g., 5.0 for 5%).
- `ytdInterest` (Number): Total interest earned year-to-date.
- `lastInterestCalculation` (Timestamp): Date of the last daily interest calculation.

### 3. `transactions`
Represents financial activities on the account.
- `id` (String): Unique transaction ID.
- `accountId` (String): Reference to the `accounts` collection.
- `amount` (Number): Transaction amount (positive for deposit/interest, negative for withdrawal).
- `type` (String): "DEPOSIT", "WITHDRAWAL", or "INTEREST".
- `date` (Timestamp): Date and time of the transaction.
- `description` (String): Human-readable description (e.g., "Allowance Deposit", "Daily Interest").
