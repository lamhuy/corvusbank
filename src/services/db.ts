import { doc, setDoc, collection, query, where, getDocs, onSnapshot, runTransaction, serverTimestamp, orderBy, limit } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

export const isUsernameAvailable = async (username: string): Promise<boolean> => {
  const q = query(collection(db, 'users'), where('username', '==', username.toLowerCase()));
  const snapshot = await getDocs(q);
  return snapshot.empty;
};

export const createUserProfile = async (uid: string, username: string) => {
  const userRef = doc(db, 'users', uid);
  await setDoc(userRef, {
    username: username.toLowerCase(),
    createdAt: new Date()
  });

  // Create initial account
  const accountRef = doc(collection(db, 'accounts'));
  await setDoc(accountRef, {
    userId: uid,
    balance: 0,
    interestRate: 5.0, // 5% APY
    ytdInterest: 0,
    lastInterestCalculation: new Date()
  });
};

export const subscribeToUserAccount = (uid: string, callback: (data: any) => void) => {
  const q = query(collection(db, 'accounts'), where('userId', '==', uid));
  return onSnapshot(q, (snapshot) => {
    if (!snapshot.empty) {
      callback({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() });
    } else {
      callback(null);
    }
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
  });
};

export const processDeposit = async (accountId: string, amountInCents: number) => {
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
