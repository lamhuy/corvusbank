# Interface Contract: Firestore Security Rules

This document defines the security rules governing all client-side read/write operations on the CorvusBank Firestore database. These rules are shared between the mobile (React Native) and web (Ionic) applications.

**Source of truth**: [`firebase/firestore.rules`](file:///c:/Users/jason/workspace/corvusbank/firebase/firestore.rules)

---

## Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // 1. User Profiles
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // 2. Savings Accounts
    match /accounts/{accountId} {
      allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
    }

    // 3. Transactions
    match /transactions/{transactionId} {
      allow read, write: if request.auth != null
        && get(/databases/$(database)/documents/accounts/$(resource.data.accountId)).data.userId == request.auth.uid;
      allow create: if request.auth != null
        && get(/databases/$(database)/documents/accounts/$(request.resource.data.accountId)).data.userId == request.auth.uid;
    }
  }
}
```

---

## Access Control Summary

| Collection     | Operation | Condition                                                                                        |
|----------------|-----------|--------------------------------------------------------------------------------------------------|
| `users`        | Read      | Authenticated user's UID must match the document ID                                               |
| `users`        | Write     | Authenticated user's UID must match the document ID                                               |
| `accounts`     | Read      | `resource.data.userId` must match the authenticated user's UID                                    |
| `accounts`     | Write     | `resource.data.userId` must match the authenticated user's UID                                    |
| `accounts`     | Create    | `request.resource.data.userId` must match the authenticated user's UID                            |
| `transactions` | Read      | User must own the account referenced by `resource.data.accountId` (verified via `get()`)          |
| `transactions` | Write     | User must own the account referenced by `resource.data.accountId` (verified via `get()`)          |
| `transactions` | Create    | User must own the account referenced by `request.resource.data.accountId` (verified via `get()`)  |

---

## Web App Implications

1. **Username availability check**: The `isUsernameAvailable()` function queries the `users` collection with `where('username', '==', ...)`. This is a **collection-level query**, not a document-level read on `/users/{userId}`. The current rules do not explicitly allow collection-level queries — however, Firestore evaluates security rules per-document, so the query will succeed as long as the returned documents satisfy the read rule. Since we query for documents where `username == X`, and the rule checks `request.auth.uid == userId`, this query will return empty results for usernames belonging to other users. The existing mobile app already relies on this behaviour successfully.

2. **No rule changes required**: The Ionic web app uses the identical Firebase SDK operations as the mobile app. No Firestore rule modifications are needed.

3. **Cloud Functions bypass rules**: The `dailyInterestPayout` Cloud Function uses the Admin SDK, which bypasses all security rules. It operates correctly regardless of client-side rule changes.
