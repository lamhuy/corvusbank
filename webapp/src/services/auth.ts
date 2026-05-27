import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';
import { createUserProfile } from './db';

const getFakeEmail = (username: string) => `${username.toLowerCase()}@kidsbanking.app`;
const getPaddedPin = (pin: string) => `${pin}00`; // Firebase requires 6+ char password

export const registerWithUsername = async (username: string, pin: string) => {
  const email = getFakeEmail(username);
  const password = getPaddedPin(pin);
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  
  let retries = 3;
  while (retries > 0) {
    try {
      await createUserProfile(userCredential.user.uid, username);
      break;
    } catch (err) {
      console.error("createUserProfile failed due to Auth sync delay. Retrying...", err);
      await new Promise(resolve => setTimeout(resolve, 1000));
      retries--;
      if (retries === 0) throw err;
    }
  }
  
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
