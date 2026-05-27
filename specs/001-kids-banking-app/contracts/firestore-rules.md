# Database Interface Contract: Firestore Rules

This document details the security rules contract governing the data operations permitted by client applications (both mobile and web) on the Firebase Firestore database.

## Collections and Access Controls

### 1. `/users/{userId}`

- **Read Access**: Restricted to the authenticated user matching `userId`.
- **Write Access**: Restricted to the authenticated user matching `userId`.
- **Rules Logic**:
  ```javascript
  allow read, write: if request.auth != null && request.auth.uid == userId;
  ```

### 2. `/accounts/{accountId}`

- **Read Access**: Restricted to the authenticated owner of the account (`resource.data.userId == request.auth.uid`).
- **Write Access**: Restricted to the authenticated owner of the account.
- **Create Access**: Allowed if the user is authenticated and sets the account's `userId` to their own UID.
- **Rules Logic**:
  ```javascript
  allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
  allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
  ```

### 3. `/transactions/{transactionId}`

- **Read Access**: Restricted to the owner of the account that the transaction belongs to.
- **Write Access**: Restricted to the owner of the account that the transaction belongs to.
- **Create Access**: Restricted to the owner of the account that the transaction is being created for.
- **Rules Logic**:
  ```javascript
  allow read, write: if request.auth != null && get(/databases/$(database)/documents/accounts/$(resource.data.accountId)).data.userId == request.auth.uid;
  allow create: if request.auth != null && get(/databases/$(database)/documents/accounts/$(request.resource.data.accountId)).data.userId == request.auth.uid;
  ```
