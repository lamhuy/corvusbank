import { doc, setDoc, getDoc, collection, query, where, getDocs, onSnapshot, runTransaction, serverTimestamp, orderBy, limit } from 'firebase/firestore';
import { db } from './firebase';

export const isUsernameAvailable = async (username: string): Promise<boolean> => {
  const q = query(collection(db, 'users'), where('username', '==', username.toLowerCase()));
  const snapshot = await getDocs(q);
  return snapshot.empty;
};

export const createUserProfile = async (uid: string, username: string) => {
  // Create initial account first to get the ID
  const accountRef = doc(collection(db, 'accounts'));
  await setDoc(accountRef, {
    userId: uid,
    balance: 0,
    interestRate: 5.0, // 5% APY
    ytdInterest: 0,
    lastInterestCalculation: new Date()
  });

  const userRef = doc(db, 'users', uid);
  await setDoc(userRef, {
    username: username.toLowerCase(),
    accountId: accountRef.id,
    createdAt: new Date()
  });
};

export const subscribeToUserAccount = async (uid: string, callback: (data: any, error?: any) => void) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (!userDoc.exists()) {
      callback(null);
      return () => { };
    }

    const accountId = userDoc.data().accountId;
    if (accountId) {
      return onSnapshot(doc(db, 'accounts', accountId), (docSnap) => {
        if (docSnap.exists()) {
          callback({ id: docSnap.id, ...docSnap.data() });
        } else {
          callback(null);
        }
      }, (error) => {
        console.error("Account listener error:", error);
      });
    } else {
      // Fallback to query if accountId isn't found (for backwards compatibility)
      const q = query(collection(db, 'accounts'), where('userId', '==', uid));
      return onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          callback({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() });
        } else {
          callback(null);
        }
      }, (error) => {
        console.error("Account query listener error:", error);
        callback(null, error);
      });
    }
  } catch (error) {
    console.error("Failed to setup account listener:", error);
    callback(null, error);
    return () => { };
  }
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
