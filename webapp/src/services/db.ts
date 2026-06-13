import { doc, setDoc, getDoc, deleteDoc, collection, query, where, getDocs, onSnapshot, runTransaction, serverTimestamp, orderBy, limit } from 'firebase/firestore';
import { db } from './firebase';

export const isUsernameAvailable = async (username: string): Promise<boolean> => {
  const q = query(collection(db, 'users'), where('username', '==', username.toLowerCase()));
  const snapshot = await getDocs(q);
  return snapshot.empty;
};

export const createUserProfile = async (uid: string, username: string) => {
  // Create Savings account
  const savingsRef = doc(collection(db, 'accounts'));
  await setDoc(savingsRef, {
    userId: uid,
    balance: 0,
    interestRate: 5.0, // 5% APY
    ytdInterest: 0,
    lastInterestCalculation: new Date(),
    type: 'SAVINGS'
  });

  // Create Checking account
  const checkingRef = doc(collection(db, 'accounts'));
  await setDoc(checkingRef, {
    userId: uid,
    balance: 0,
    interestRate: 1.0, // 1% APY
    ytdInterest: 0,
    lastInterestCalculation: new Date(),
    type: 'CHECKING'
  });

  const userRef = doc(db, 'users', uid);
  await setDoc(userRef, {
    username: username.toLowerCase(),
    accountId: savingsRef.id,
    checkingAccountId: checkingRef.id,
    createdAt: new Date()
  });
};

// In-memory cache to prevent duplicate ensureCheckingAccount calls.
// The resolved promise is kept for the entire session so that StrictMode
// re-mounts (or any other repeated calls) always return the same ID
// without hitting Firestore again.
const _ensureCheckingCache = new Map<string, Promise<string>>();

export const ensureCheckingAccount = (uid: string): Promise<string> => {
  const cached = _ensureCheckingCache.get(uid);
  if (cached) return cached;

  const promise = (async () => {
    const userRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) throw new Error("User does not exist");

    const userData = userDoc.data();

    // ALWAYS query for all CHECKING accounts to find and clean up duplicates
    const q = query(
      collection(db, 'accounts'),
      where('userId', '==', uid),
      where('type', '==', 'CHECKING')
    );
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      // Prefer the one referenced by the user doc, otherwise take the first
      let keepId = snapshot.docs[0].id;
      if (userData.checkingAccountId) {
        const referenced = snapshot.docs.find(d => d.id === userData.checkingAccountId);
        if (referenced) keepId = referenced.id;
      }

      // Delete every duplicate that isn't the one we're keeping
      for (const docSnap of snapshot.docs) {
        if (docSnap.id !== keepId) {
          try {
            await deleteDoc(doc(db, 'accounts', docSnap.id));
          } catch (e) {
            console.warn("Failed to delete duplicate checking account:", docSnap.id, e);
          }
        }
      }

      // Make sure the user doc points to the kept one
      if (userData.checkingAccountId !== keepId) {
        await setDoc(userRef, { checkingAccountId: keepId }, { merge: true });
      }
      return keepId;
    }

    // None found — create one
    const checkingRef = doc(collection(db, 'accounts'));
    await setDoc(checkingRef, {
      userId: uid,
      balance: 0,
      interestRate: 1.0,
      ytdInterest: 0,
      lastInterestCalculation: new Date(),
      type: 'CHECKING'
    });
    await setDoc(userRef, { checkingAccountId: checkingRef.id }, { merge: true });
    return checkingRef.id;
  })();

  // Store immediately so concurrent callers get the same promise
  _ensureCheckingCache.set(uid, promise);

  // On failure, clear the cache so a retry can succeed
  promise.catch(() => _ensureCheckingCache.delete(uid));

  return promise;
};

/**
 * Also ensure existing savings accounts that were created before the type
 * field existed get tagged with type: 'SAVINGS'.
 */
export const ensureSavingsType = async (uid: string): Promise<void> => {
  const q = query(collection(db, 'accounts'), where('userId', '==', uid));
  const snapshot = await getDocs(q);
  for (const docSnap of snapshot.docs) {
    const data = docSnap.data();
    if (!data.type) {
      await setDoc(doc(db, 'accounts', docSnap.id), { type: 'SAVINGS' }, { merge: true });
    }
  }
};

/** Subscribe to ALL accounts for a user (savings + checking). */
export const subscribeToUserAccounts = (uid: string, callback: (accounts: any[], error?: any) => void) => {
  const q = query(collection(db, 'accounts'), where('userId', '==', uid));
  return onSnapshot(q, (snapshot) => {
    const accounts = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    callback(accounts);
  }, (error) => {
    console.error("Accounts listener error:", error);
    callback([], error);
  });
};

/** Subscribe to a single account by its document ID. */
export const subscribeToAccount = (accountId: string, callback: (data: any, error?: any) => void) => {
  return onSnapshot(doc(db, 'accounts', accountId), (docSnap) => {
    if (docSnap.exists()) {
      callback({ id: docSnap.id, ...docSnap.data() });
    } else {
      callback(null);
    }
  }, (error) => {
    console.error("Account subscription error:", error);
    callback(null, error);
  });
};

export const subscribeToTransactions = (accountId: string, callback: (data: any[]) => void) => {
  const q = query(
    collection(db, 'transactions'),
    where('accountId', '==', accountId),
    orderBy('date', 'desc'),
    limit(50)
  );

  return onSnapshot(q, (snapshot) => {
    const transactions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(transactions);
  }, (error) => {
    console.error("Transactions listener error:", error);
  });
};

export const processDeposit = async (accountId: string, amountInCents: number) => {
  if (amountInCents > 1000000) {
    throw new Error("Maximum deposit amount is $10,000.");
  }

  const accountRef = doc(db, 'accounts', accountId);
  const txRef = doc(collection(db, 'transactions'));

  await runTransaction(db, async (transaction) => {
    const accountDoc = await transaction.get(accountRef);
    if (!accountDoc.exists()) {
      throw new Error("Account does not exist!");
    }

    const newBalance = accountDoc.data().balance + amountInCents;

    transaction.update(accountRef, { balance: newBalance });
    transaction.set(txRef, {
      accountId,
      amount: amountInCents,
      type: 'DEPOSIT',
      date: serverTimestamp(),
      description: 'Deposit'
    });
  });
};
