@echo off
echo Deploying Firestore security rules to CorvusBank...
npx firebase deploy --only firestore:rules --project corvusbank
echo Done!
