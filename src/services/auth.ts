import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { createUserProfile } from './db';

const getFakeEmail = (username: string) => `${username.toLowerCase()}@kidsbanking.app`;
const getPaddedPin = (pin: string) => `${pin}00`; // Firebase requires 6+ char password

export const registerWithUsername = async (username: string, pin: string) => {
  const email = getFakeEmail(username);
  const password = getPaddedPin(pin);
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  
  // Create user profile in Firestore
  await createUserProfile(userCredential.user.uid, username);
  
  return userCredential.user;
};

export const loginWithUsername = async (username: string, pin: string) => {
  const email = getFakeEmail(username);
  const password = getPaddedPin(pin);
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

export const logout = async () => {
  return auth.signOut();
};
