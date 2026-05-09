# Research & Decisions: Kids Banking App

## Technical Stack Decisions

- **Decision**: Use Expo with React Native for cross-platform mobile development.
- **Rationale**: User explicitly requested Expo and React. Expo provides a fast, managed workflow for React Native, making it ideal for a mobile banking app targeting both iOS and Android.
- **Alternatives considered**: Flutter, Swift/Kotlin native.

- **Decision**: Use Firebase Backend (Authentication, Firestore, Cloud Functions).
- **Rationale**: User explicitly requested Firebase. Firebase provides real-time database capabilities (Firestore), easy authentication flows, and serverless functions for secure operations (like calculating interest or processing deposits).
- **Alternatives considered**: Custom Node.js/PostgreSQL backend.

- **Decision**: Use GitHub Actions for CI/CD to Google Play Store.
- **Rationale**: User explicitly requested GitHub Actions for building and deploying to the Google Play Store. Expo Application Services (EAS) can be integrated with GitHub actions to automate builds.
- **Alternatives considered**: Bitrise, CircleCI.
