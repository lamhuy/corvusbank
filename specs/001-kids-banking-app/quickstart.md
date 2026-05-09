# Quickstart: Kids Banking App

## Prerequisites
- Node.js v18+
- Expo CLI (`npm install -g expo-cli`)
- Firebase CLI (`npm install -g firebase-tools`)
- EAS CLI (`npm install -g eas-cli`) for GitHub Actions builds

## Setup Instructions
1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```
2. Initialize Firebase in your project and create a new project. Set up Firestore and Firebase Auth.
3. Run the app locally:
   ```bash
   npx expo start
   ```

## CI/CD Pipeline
- The `.github/workflows/deploy.yml` will handle the build and deployment to the Google Play Store using `eas build --platform android`.
